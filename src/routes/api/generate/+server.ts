import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const { prompt } = await request.json();
    const ollama = new Ollama({ host: "http://localhost:11434" });

    const chat = await ollama.chat({
        model: "deepseek-r1:1.5b",
        messages: [{ role: "user", content: prompt }],
    });

    return json({ response: [{ message: { content: chat.message.content } }] });
};
