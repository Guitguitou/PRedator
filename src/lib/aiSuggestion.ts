import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Assurez-vous que votre clé API est définie dans les variables d'environnement
});

export async function aiSuggestion(comment: string, diff: string, filepath: string) {
  // Créer un thread
  const createThreadResponse = await openai.beta.threads.create();
  const threadId = createThreadResponse.id;

  // Ajouter un message au thread
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: `Voici le commentaire: ${comment} Voici le diff: ${diff} Voici le fichier: ${filepath}`
  });

  // Exécuter le thread avec l'ID de l'assistant
  const runThreadResponse = await openai.beta.threads.runs.create(threadId, {
    assistant_id: "asst_B6GIc92FAGYDf3xBcr2CiwX0"
  });

  const runId = runThreadResponse.id;

  // Attendre que le run soit terminé
  let status = "running";
  while (status !== "completed") {
    const runObject = await openai.beta.threads.runs.retrieve(threadId, runId);
    status = runObject.status;
    if (status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 2 secondes avant de vérifier à nouveau
    }
  }

  // Récupérer les messages du thread
  const messages = await openai.beta.threads.messages.list(threadId);
  console.log("Messages de chat GPT ", messages.data[0]);
  // Récupérer le dernier message de l'assistant
  const lastMessage = messages.data[0].content[0];
  if ('text' in lastMessage) {
    return lastMessage.text.value;
  }
  throw new Error("Message content is not text");
}