import { NextResponse } from 'next/server';

// --- MEMBER B's LOGIC (Adapted for Next.js) ---
const SYSTEM_PROMPT = `
You are an expert Task Decomposer.
Your goal is to break a complex task into 3-5 very small, actionable steps.
Rules:
1. Each step must be do-able in under 15 minutes.
2. Start each step with a verb (e.g., "Open", "Write", "Call").
3. Do NOT use markdown or bold text.
4. Return ONLY the list of steps, nothing else.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { task } = body; 

    if (!task) return NextResponse.json({ error: "Task is required" }, { status: 400 });

    console.log(`⚡ [API] Processing task: "${task}"`);

    // 1. CONNECT TO OLLAMA (The App you just installed)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    // We use 'llama3.2' because it is stable and fast.
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2", 
        prompt: `${SYSTEM_PROMPT}\n\nTask: ${task}`,
        stream: false
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`Ollama API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // 2. CLEAN UP THE RESPONSE
    // This turns the AI text into a neat list for your dashboard
    const rawText = data.response;
    const cleanSteps = rawText
      .split("\n")
      .map(line => line.replace(/^\d+[\.\)]\s*/, "").replace(/^- /, "").trim()) // Remove "1." or "-"
      .filter(line => line.length > 0) // Remove empty lines
      .slice(0, 5) // Keep max 5 steps
      .map((stepText, index) => ({
        id: index + 1,
        title: stepText,
        time: "15m", // AI estimates are hard, so we default to 15m for flow
        completed: false
      }));

    return NextResponse.json({ subtasks: cleanSteps });

  } catch (error) {
    console.error("⚠️ AI Failed:", error.message);
    
    // FALLBACK: If Ollama isn't running, return this so the app doesn't crash
    return NextResponse.json({ 
      subtasks: [
        { id: 1, title: "Check if Ollama app is running", time: "5m", completed: false },
        { id: 2, title: `Error: ${error.message}`, time: "0m", completed: false },
        { id: 3, title: "Try restarting the server", time: "5m", completed: false }
      ]
    });
  }
}