import { Probot } from "probot";
import { aiSuggestion } from "./lib/aiSuggestion.js";

export default (app: Probot) => {

  app.on("pull_request_review_comment.created", async (context) => {
    if (context.isBot) {
      return console.info("Received a pull request review comment event but it's a bot");
    }
    console.log("Received a pull request review comment event");
    const comment = context.payload.comment.body;
    const commentId = context.payload.comment.id;
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    console.log("Comment body:", comment);

    const body = await aiSuggestion(comment, context.payload.comment.diff_hunk, context.payload.comment.path);
    console.log("Suggestions from ChatGPT:", body);

    // Répondre au commentaire existant
    await context.octokit.rest.pulls.createReplyForReviewComment({
      owner,
      repo,
      pull_number: context.payload.pull_request.number,
      comment_id: commentId,
      body,
    });
    console.log("Reply posted with suggestions");
  });
};
