





import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const GET: RequestHandler = async () => {
    const ollama = new Ollama({ host: "http://localhost:11434" });

    const dataOfMasterUser = {
        name: "Rose", 
        course: "BSCS", 
        hobbies: ["Reading Novels", "Watching anime", "Reading Bible", "Drawing"], 
        favorFoods: ["Pancit Palabok", "Adobo", "Fried Chicken"],
        userType: "Master User",
    };

    const professorPrompt = "Can you provide a summary or key points of the context data you currently have, including the name of the master user associated with you, whether there is any sensitive information in the context data, your confidence level (on a scale of 1 to 10) in the accuracy of the data being returned, and based on the context data, what kind of person the user appears to be?";

    const systemMessage = `You are a strict JSON generator bot. Respond ONLY in valid JSON based on this schema:
{
  "$schema": "https://json-schema.org/draft/2020-12/schema#",
  "summary_of_context_data": string,
  "master_user_name": string,
  "sensitive_information_present": boolean,
  "confidence_level": number (1-10),
  "user_persona_description": string
}

Here is the master user data:
${JSON.stringify(dataOfMasterUser)}
`;

    try {
        const chat = await ollama.chat({
            model: "deepseek-r1:1.5b", 
            messages: [
                {
                    role:"system", 
                    content: systemMessage,
                }, 
                {
                    role:"user", 
                    content: professorPrompt,
                },
            ],
        });

        return json({message: chat.message});
    } catch (err) {
        return json({ error: "Failed to connect to Ollama or process the chat." }, { status: 500 });
    }
};

