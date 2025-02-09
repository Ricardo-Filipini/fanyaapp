import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyA00Ju6qKzSf13kUkUgQvACejXVmIPOcos");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function chat(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
  }
}
