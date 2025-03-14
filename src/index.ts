import { Probot } from "probot";
import axios from "axios";

export default (app: Probot) => {

  app.on("pull_request_review_comment.created", async (context) => {
    const comment = context.payload.comment.body;

    // Envoyer le commentaire à ChatGPT
    const response = await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions", {
      prompt: `Voici un commentaire de pull request : "${comment}". Pouvez-vous faire des suggestions pour l'améliorer ?`,
      max_tokens: 150,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json'
      }
    });

    const suggestions = response.data.choices[0].text.trim();

    // Poster les suggestions en tant que commentaire
    const issueComment = context.issue({
      body: `Suggestions de ChatGPT :\n${suggestions}`,
    });
    await context.octokit.issues.createComment(issueComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
