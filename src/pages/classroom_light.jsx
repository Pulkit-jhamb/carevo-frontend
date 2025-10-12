import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color, Vec3 } from "ogl";
import Sidebar from "./sidebar.jsx"; // Use light sidebar
import { Calendar, Folder } from "lucide-react"; // Lucide icons for calendar & drive
import { useNavigate } from "react-router-dom";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
 vUv = uv;
 gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;


uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;


#define PI 3.1415926538


const int u_line_count = 40;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;


float Perlin2D(vec2 P) {
   vec2 Pi = floor(P);
   vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
   vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
   Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
   Pt += vec2(26.0, 161.0).xyxy;
   Pt *= Pt;
   Pt = Pt.xzxz * Pt.yyww;
   vec4 hash_x = fract(Pt * (1.0 / 951.135664));
   vec4 hash_y = fract(Pt * (1.0 / 642.949883));
   vec4 grad_x = hash_x - 0.49999;
   vec4 grad_y = hash_y - 0.49999;
   vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
       * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
   grad_results *= 1.4142135623730950;
   vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
              * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
   vec4 blend2 = vec4(blend, vec2(1.0 - blend));
   return dot(grad_results, blend2.zxzx * blend2.wwyy);
}


float pixel(float count, vec2 resolution) {
   return (1.0 / max(resolution.x, resolution.y)) * count;
}


float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
   float split_offset = (perc * 0.4);
   float split_point = 0.1 + split_offset;


   float amplitude_normal = smoothstep(split_point, 0.7, st.x);
   float amplitude_strength = 0.5;
   float finalAmplitude = amplitude_normal * amplitude_strength
                          * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);


   float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
   float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;


   float xnoise = mix(
       Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
       Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
       st.x * 0.3
   );


   float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;


   float line_start = smoothstep(
       y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
       y,
       st.y
   );


   float line_end = smoothstep(
       y,
       y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
       st.y
   );


   return clamp(
       (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
       0.0,
       1.0
   );
}


void mainImage(out vec4 fragColor, in vec2 fragCoord) {
   vec2 uv = fragCoord / iResolution.xy;


   float line_strength = 1.0;
   for (int i = 0; i < u_line_count; i++) {
       float p = float(i) / float(u_line_count);
       line_strength *= (1.0 - lineFn(
           uv,
           u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
           p,
           (PI * 1.0) * p,
           uMouse,
           iTime,
           uAmplitude,
           uDistance
       ));
   }


   float colorVal = 1.0 - line_strength;
   fragColor = vec4(uColor * colorVal, colorVal);
}


void main() {
   mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const Threads = ({
 color = [0, 0, 0], // Changed to black for light mode
 amplitude = 1,
 distance = 0,
 enableMouseInteraction = false,
 ...rest
}) => {
 const containerRef = useRef(null);
 const animationFrameId = useRef();

 useEffect(() => {
   if (!containerRef.current) return;
   const container = containerRef.current;

   const renderer = new Renderer({ alpha: true });
   const gl = renderer.gl;
   gl.clearColor(0, 0, 0, 0);
   gl.enable(gl.BLEND);
   gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
   container.appendChild(gl.canvas);

   const geometry = new Triangle(gl);
   const program = new Program(gl, {
     vertex: vertexShader,
     fragment: fragmentShader,
     uniforms: {
       iTime: { value: 0 },
       iResolution: {
         value: new Vec3(gl.canvas.width, gl.canvas.height, 1.0),
       },
       uColor: { value: new Color(...color) },
       uAmplitude: { value: amplitude },
       uDistance: { value: distance },
       uMouse: { value: new Float32Array([0.5, 0.5]) },
     },
   });

   const mesh = new Mesh(gl, { geometry, program });

   function resize() {
     const { clientWidth, clientHeight } = container;
     const dpr = window.devicePixelRatio || 1;
     const width = clientWidth * dpr;
     const height = clientHeight * dpr;

     renderer.setSize(width, height);
     gl.canvas.style.width = clientWidth + "px";
     gl.canvas.style.height = clientHeight + "px";

     program.uniforms.iResolution.value.set(width, height, 1.0);
   }
   window.addEventListener("resize", resize);
   resize();

   let currentMouse = [0.5, 0.5];
   let targetMouse = [0.5, 0.5];

   function handleMouseMove(e) {
     const rect = container.getBoundingClientRect();
     const x = (e.clientX - rect.left) / rect.width;
     const y = 1.0 - (e.clientY - rect.top) / rect.height;
     targetMouse = [x, y];
   }
   function handleMouseLeave() {
     targetMouse = [0.5, 0.5];
   }
   if (enableMouseInteraction) {
     container.addEventListener("mousemove", handleMouseMove);
     container.addEventListener("mouseleave", handleMouseLeave);
   }

   function update(t) {
     if (enableMouseInteraction) {
       const smoothing = 0.05;
       currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
       currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
       program.uniforms.uMouse.value[0] = currentMouse[0];
       program.uniforms.uMouse.value[1] = currentMouse[1];
     } else {
       program.uniforms.uMouse.value[0] = 0.5;
       program.uniforms.uMouse.value[1] = 0.5;
     }
     program.uniforms.iTime.value = t * 0.001;

     renderer.render({ scene: mesh });
     animationFrameId.current = requestAnimationFrame(update);
   }
   animationFrameId.current = requestAnimationFrame(update);

   return () => {
     if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
     window.removeEventListener("resize", resize);

     if (enableMouseInteraction) {
       container.removeEventListener("mousemove", handleMouseMove);
       container.removeEventListener("mouseleave", handleMouseLeave);
     }
     if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
     gl.getExtension("WEBGL_lose_context")?.loseContext();
   };
 }, [color, amplitude, distance, enableMouseInteraction]);

 return <div ref={containerRef} className="w-full h-full relative" {...rest} />;
};

export default function ClassroomLight() {
  const userName = "Harshit Dua"; // Replace with dynamic user if needed
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/classroom-dark");
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Sidebar isDarkMode={false} />
      <div className="flex-1 flex flex-col transition-all duration-300 ml-64">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-4">
            {/* Moon icon toggle button - left of calendar */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors"
              title="Switch to Dark Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Folder className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{userName}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-8 px-8 pt-6 border-b border-gray-200">
          <button className="pb-2 border-b-2 border-gray-900 font-semibold text-base text-gray-900">Stream</button>
          <button className="pb-2 text-gray-500 text-base">Classwork</button>
          <button className="pb-2 text-gray-500 text-base">People</button>
          <div className="flex-1"></div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Calendar className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Folder className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {/* Main content */}
        <div className="flex gap-8 px-8 py-8">
          {/* Left card */}
          <div className="bg-gray-50 rounded-xl p-8 w-80 flex-shrink-0 border border-gray-200">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Physics</h2>
            <p className="text-lg text-gray-600 mb-6">Xth C</p>
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Upcoming</h3>
              <p className="text-gray-700 mb-2">Woohoo, no work due soon!</p>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                View All
              </button>
            </div>
          </div>
          {/* Right feed */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4 border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <span className="text-gray-700 text-base font-medium">
                Announce something to your class
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <span className="font-semibold text-base text-gray-900">ABC Ma'am</span>
                <span className="text-gray-500 text-xs ml-auto">
                  OCT 6, 2025
                </span>
              </div>
              <div className="text-gray-700 mb-4 text-base">
                All the marks are updated on the respective web kiosk. A review of
                the marks is advised.
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add class comment..."
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg flex-1 outline-none border border-gray-200 text-base focus:ring-2 focus:ring-blue-500"
                />
                <button className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 2L11 13" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4 border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <span className="font-semibold text-base text-gray-900">ABC Ma'am</span>
            </div>
          </div>
        </div>
        {/* Footer */}
       </div>
    </div>
  );
}
