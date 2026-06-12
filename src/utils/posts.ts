import { getCollection } from 'astro:content';
import dayjs from 'dayjs';
import {getGitCreatedAt} from "./gitContentDates";

export const isVisiblePost = (post) => {
  return import.meta.env.PROD ? !post.data.draft : true;
};

export const filterVisiblePosts = (posts) => posts.filter(isVisiblePost);

const withResolvedDate = (post) => {
  if (post.data.date) {
    return post;
  }

  const fallbackDate = getGitCreatedAt(post.filePath);
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
  return filterVisiblePosts(posts).map(withResolvedDate);
};

export const sortPostsByDate = (posts) => {
  return [...posts].sort((a, b) => {
    return dayjs(b.data.date).valueOf() - dayjs(a.data.date).valueOf();
  });
};

export const orderPostsBySticky = (posts) => {
  return [...posts].sort((a, b) => {
    const stickyDiff = (b.data.sticky || 0) - (a.data.sticky || 0);
    if (stickyDiff !== 0) return stickyDiff;

    return dayjs(b.data.date).valueOf() - dayjs(a.data.date).valueOf();
  });
};
