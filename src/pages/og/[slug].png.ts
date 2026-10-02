import type {APIRoute} from "astro";
import {getBlogPosts} from "../../utils/posts";
import {dealLabel} from "../../utils/dealLabel";
import {formatDate} from "../../utils/formatDate";
import {renderOgImage} from "../../utils/ogImage";

// 記事ごとの OGP 画像(/og/<記事ID>.png)
export async function getStaticPaths() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({params: {slug: post.id}, props: {post}}));
}

export const GET: APIRoute = async ({props}) => {
  const {data} = props.post;
  // カテゴリとタグが同名(例: AI)のときに同じラベルを 2 つ並べない(大文字小文字は区別しない)
  const labels = [
    ...dealLabel(data.category).filter((label) => label !== "uncategorized"),
    ...dealLabel(data.tags),
  ].filter((label, index, all) =>
    all.findIndex((other) => other.toLowerCase() === label.toLowerCase()) === index
  );
  const png = await renderOgImage({title: data.title, labels, date: formatDate(data.date)});
  return new Response(new Uint8Array(png), {headers: {"Content-Type": "image/png"}});
};
