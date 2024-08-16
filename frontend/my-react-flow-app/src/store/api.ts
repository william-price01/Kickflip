const BASE_URL = "http://localhost:8888/api";

export const API = {
  process: async (data: {
    task_type: string;
    input: string;
    ruleset?: string;
  }) => {
    return await sendRequest(`${BASE_URL}/process`, data);
  },

  generateImage: async (data: {
    image_prompt: string;
    ruleset_input: string;
  }) => {
    return await sendRequest(`${BASE_URL}/image-gen`, data);
  },
};

async function sendRequest(url: string, data: any) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}
