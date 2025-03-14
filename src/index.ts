import { Probot } from "probot";
import axios from "axios";

export default (app: Probot) => {

  app.on("pull_request_review_comment.created", async (context) => {
    console.log("Received a pull request review comment event");
    const comment = context.payload.comment.body;
    const commentId = context.payload.comment.id;
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const pullNumber = context.payload.pull_request.number;
    console.log("Comment body:", comment);

    // Envoyer le commentaire à ChatGPT
    // const response = await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions", {
    //   prompt: `Voici le commentaire d'un utilisateur sur la pull request : "${comment}". Fais moi une suggestion concise pour améliorer le code.`,
    //   max_tokens: 150,
    //   temperature: 0.7,
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    const suggestions = "coucou ceci est une suggestion";
    console.log("Suggestions from ChatGPT:", suggestions);

    // Répondre au commentaire existant
    await context.octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies', {
      owner,
      repo,
      pull_number: pullNumber,
      comment_id: commentId,
      body: `Suggestions de ChatGPT :\n${suggestions}`,
    });
    console.log("Reply posted with suggestions");
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
