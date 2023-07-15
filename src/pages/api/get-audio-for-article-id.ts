import type { APIRoute } from "astro";
import { getAudioForArticleId } from "../../utils/get-audio-for-article-id";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const articleId = body.articleId;

    const updateResponse = await getAudioForArticleId(articleId);

    return new Response(
      JSON.stringify({
        updateResponse,
      }),
      {
        status: 200,
      }
    );
  }
  return new Response(null, { status: 400 });
};
