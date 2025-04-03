import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const GET: RequestHandler = async () => {
    const ollama = new Ollama({ host: "http://localhost:11434" });

    const dataOfMasterUser = {
        name: "Rose", 
        course: "BSCS", 
        hobbies: ["Reading Novels", "Watching anime", "Reading Bible", "Drawing"], 
        favorFoods: ["Pnacit Palabok", "Adobo", "Fried Chicken"],
        userType: "Master User",
    };

    const chat = await ollama.chat({
        model: "deepseek-r1:1.5b", 
        messages: [
            {
                role:"system", 
                content: 
                    `Here is the information of the master user: ${JSON.stringify(dataOfMasterUser)} 
                    Respond only based on the data of the master UserActivation.`,
            }, 
            {
                role:"user", 
                content: "Who is your master user?",
            },
        ],
    });

    return json(chat);
};
