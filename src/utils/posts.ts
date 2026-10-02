import { getCollection } from 'astro:content';
import dayjs from 'dayjs';
import {getGitContentDates} from "./gitContentDates";

const withResolvedDate = (post) => {
  if (post.data.date) {
    return post;
  }

  const fallbackDate = getGitContentDates(post.filePath).createdAt;
  if (!fallbackDate) {
    throw new Error(`Unable to resolve a created date for blog post "${post.id}".`);
  }

  return {
    ...post,
    data: {
      ...post.data,
      date: fallbackDate,
    },
  };
};

export const getBlogPosts = async () => {
  const posts = await getCollection('blog');
  // 下書きは本番ビルドでは除外する
  return posts.filter((post) => !import.meta.env.PROD || !post.data.draft).map(withResolvedDate);
};

export const byDateDesc = (a, b) => dayjs(b.data.date).valueOf() - dayjs(a.data.date).valueOf();

export const sortPostsByDate = (posts) => [...posts].sort(byDateDesc);

// 固定記事(sticky の大きい順)を先頭に、残りは日付の新しい順
export const orderPostsBySticky = (posts) =>
  [...posts].sort((a, b) => (b.data.sticky || 0) - (a.data.sticky || 0) || byDateDesc(a, b));

// pageSize 件ずつのページに分ける(pages[0] が 1 ページ目)
export const paginate = (posts, pageSize: number) =>
  Array.from({length: Math.ceil(posts.length / pageSize)}, (_, index) =>
    posts.slice(index * pageSize, (index + 1) * pageSize)
  );
