import dayjs from 'dayjs';
import { site } from '../consts';
import { sortPostsByDate } from './sortPostsByDate';

const formatArchiveLabel = (date) => {
  const month = Number(date.format('M'));
  const year = date.format('YYYY');
  return `${month}月 ${year}`;
};

const getPostArchivesByMonth = (posts, pageSize = site.archivePageSize) => {
  const archives = new Map();

  sortPostsByDate(posts).forEach((post, index) => {
    const date = dayjs(post.data.date);
    const key = date.format('YYYY-MM');
    const page = Math.floor(index / pageSize) + 1;

    if (!archives.has(key)) {
      archives.set(key, {
        key,
        label: formatArchiveLabel(date),
        count: 0,
        href: `/archive/${page}#archive-${key}`,
      });
    }

    archives.get(key).count += 1;
  });

  return Array.from(archives.values());
};

export default getPostArchivesByMonth;
