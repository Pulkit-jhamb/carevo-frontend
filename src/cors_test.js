// Run this in your browser console or import and call testCors() in your frontend app
export async function testCors() {
  try {
    const response = await fetch("http://localhost:6000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "test" })
    });
    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// To use: import { testCors } from './cors_test'; testCors();
// Or copy the function body and run in your browser console. 