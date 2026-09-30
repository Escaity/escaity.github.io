import type {APIRoute} from "astro";
import {site} from "../consts";
import {renderOgImage} from "../utils/ogImage";

// 記事以外のページで使うサイト共通の OGP 画像
export const GET: APIRoute = async () => {
  const png = await renderOgImage({title: site.description});
  return new Response(new Uint8Array(png), {headers: {"Content-Type": "image/png"}});
};
