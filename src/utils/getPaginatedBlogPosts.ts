import {site} from '../consts';
import {orderBySticky} from './orderBySticky';

export const getPaginatedBlogPosts = (posts, pageSize = site.postPageSize) => {
  const sortedPosts = orderBySticky(posts);
  const totalPage = Math.ceil(sortedPosts.length / pageSize);

  const getPagePosts = (pageNumber) => {
    const start = (pageNumber - 1) * pageSize;
    return sortedPosts.slice(start, start + pageSize);
  };

  return {
    totalPage,
    firstPagePosts: getPagePosts(1),
    getPagePosts,
  };
};
