import rss from '@astrojs/rss';
import {site} from "../consts";
import {getBlogPosts} from "../utils/posts";

export async function GET(context) {
  const blog = await getBlogPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: site.url,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description? post.data.description : post.body.substring(0, 140).replace(/#/gi, "") + "...",
      // Compute RSS link from post id
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.id}/`,
    })),
  });
}
