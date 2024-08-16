import axios from "axios";

const API_URL = "http://localhost:8888/api/process";

export const processWithGriptape = async (data: {
  task_type: string;
  input: string;
}) => {
  try {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Response:", res);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error processing with Griptape:", error);
    throw error;
  }
};
