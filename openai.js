import assert from "assert";
import OpenAI from "openai/index.mjs";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.PROJECT_ID,
  organization: process.env.ORGANIZATION,
});

let assistant;
const assID = process.env.ASSISTANT_ID;

const init = async () => {
  assert(!assistant, "OpenAI init only once.");
  assistant = await openai.beta.assistants.retrieve(assID);
};

const thread = async () => {
  return await openai.beta.threads.create();
};

export const ask = async (question) => {
  const newThread = await thread();

  await openai.beta.threads.messages.create(newThread.id, {
    role: "user",
    content: question,
  });

  let fullResponse = "";

  return new Promise((resolve, reject) => {
    openai.beta.threads.runs
      .stream(newThread.id, { assistant_id: assID })
      .on("error", (e) => {
        const errorMessage = e.error
          ? e.error.message
          : "An unknown error occurred.";
        console.error("Error:", errorMessage);
        reject(errorMessage);
      })
      .on("textDelta", (_, { value }) => {
        fullResponse = value;
      })
      .on("textDone", () => {
        resolve(fullResponse);
      });
  });
};

init().catch((error) => {
  console.error("Failed to initialize OpenAI:", error);
});
