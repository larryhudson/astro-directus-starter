import { Directus } from "@directus/sdk";
import { getContentFromUrl } from "./extract-article";
import { getAudioBufferForText } from "./azure-tts";
import FormData from "form-data";
import { Readable } from "stream";

// id, title can be null, url required
type Article = {
  id: number;
  title: string | null;
  url: string;
  audio_file: number | null;
};

type ArticlesDirectus = {
  articles: Article;
};

export async function getAudioForArticleId(articleId: number) {
  const directus = new Directus<ArticlesDirectus>(
    import.meta.env.DIRECTUS_URL,
    {
      auth: {
        staticToken: "vwp-JBuzyH5vd6-N6Ic97IACFkmxIBPL",
      },
    }
  );

  const articleFromDb = await directus.items("articles").readOne(articleId);

  if (!articleFromDb) {
    throw new Error("Article not found");
  }

  const articleContent = await getContentFromUrl(articleFromDb.url);

  const audioBuffer = await getAudioBufferForText(articleContent);

  const audioStream = Readable.from(audioBuffer);

  const form = new FormData();
  form.append("file", audioStream, "audio.mp3");

  const directusFile = await directus.files.createOne(
    form,
    {},
    {
      requestOptions: {
        headers: {
          ...form.getHeaders(),
        },
      },
    }
  );
  console.log("logging directus file");
  console.log(directusFile);

  //   update article with audio file
  const updateResponse = await directus.items("articles").updateOne(articleId, {
    audio_file: directusFile.id,
  });

  return updateResponse;
}
