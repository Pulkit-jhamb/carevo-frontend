// Run this in your browser console or import and call testCors() in your frontend app
import { API_ENDPOINTS } from './config';

export async function testCors() {
  try {
    const response = await fetch(API_ENDPOINTS.SIGNUP, {
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