import { Worker } from "bullmq";
import { getAudioForArticleId } from "./src/utils/get-audio-for-article-id";

const worker = new Worker(
  "my-queue",
  async (job) => {
    const { articleId } = job.data;

    const updateResponse = await getAudioForArticleId(articleId);

    return updateResponse;
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("ready", () => {
  console.log("Worker is ready");
});
