
"use server";

interface Message {
  role: "user" | "model";
  content: string;
}

export async function chat(messages: Message[], input: string): Promise<string> {
  console.log("Chatbot flow received messages:", messages);
  console.log("Chatbot flow received input:", input);

  // Dummy response for now
  const response = `This is a dummy response to your message: "${input}"`;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 1000);
  });
}
