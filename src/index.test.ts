import { describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import { Probot, ProbotOctokit } from "probot";
import myProbotApp from "./index";

nock.disableNetConnect();

describe("My Probot app", () => {
  let probot: Probot;

  beforeEach(() => {
    probot = new Probot({
      appId: 123,
      privateKey: "test",
      githubToken: "test",
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });

    probot.load(myProbotApp);
  });

  it("creates a comment when a pull request review comment is created", async () => {
    const mockPayload = require("./fixtures/pull_request_review_comment.created.json");

    nock("https://api.openai.com")
      .post("/v1/engines/davinci-codex/completions")
      .reply(200, {
        choices: [{ text: "Voici une suggestion pour améliorer le code." }],
      });

    nock("https://api.github.com")
      .post("/repos/test/test/issues/1/comments", (body) => {
        expect(body).toMatchObject({
          body: "Suggestions de ChatGPT :\nVoici une suggestion pour améliorer le code.",
        });
        return true;
      })
      .reply(200);

    await probot.receive({ name: "pull_request_review_comment", payload: mockPayload });
  });
}); 