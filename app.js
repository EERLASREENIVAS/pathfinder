// 🔴 PASTE YOUR OPENROUTER API KEY HERE (LOCAL ONLY)
const API_KEY = "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";

async function callAPI(message) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "PathFinder"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful career advisor for Indian students."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return "Error: " + (data.error?.message || "API failed");
    }

    return data.choices?.[0]?.message?.content || "No response";

  } catch (error) {
    return "Error: " + error.message;
  }
}

async function send() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerText = "Please enter something.";
    return;
  }

  output.innerText = "Loading...";

  const result = await callAPI(input);

  output.innerText = result;
}
