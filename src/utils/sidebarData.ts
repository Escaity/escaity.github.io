import getCountByCategory from './getCountByCategory';
import getPostArchivesByMonth from './getPostArchivesByMonth';
import { getBlogPosts } from './posts';

export const archiveLimit = 10;

export const getSidebarData = async () => {
  const posts = await getBlogPosts();

  return {
    archives: getPostArchivesByMonth(posts),
    categoryCount: getCountByCategory(posts),
  };
};
