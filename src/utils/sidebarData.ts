import dayjs from 'dayjs';
import {site} from '../consts';
import {countLabels} from './labels';
import {getBlogPosts, sortPostsByDate} from './posts';

export const archiveLimit = 10;

// 月別アーカイブ(新しい月順)。リンク先はその月の最初の記事が載るアーカイブページ
const getArchivesByMonth = (posts) => {
  const archives = new Map();

  sortPostsByDate(posts).forEach((post, index) => {
    const date = dayjs(post.data.date);
    const key = date.format('YYYY-MM');
    const page = Math.floor(index / site.archivePageSize) + 1;

    if (!archives.has(key)) {
      archives.set(key, {
        key,
        label: `${date.month() + 1}月 ${date.year()}`,
        count: 0,
        // 1ページ目は /archive/1/ ではなく /archive/(リダイレクトでアンカーが失われないように)
        href: `${page === 1 ? '/archive/' : `/archive/${page}/`}#archive-${key}`,
      });
    }

    archives.get(key).count += 1;
  });

  return Array.from(archives.values());
};

// カテゴリーごとの記事数(未分類は末尾)
const getCategoryCount = (posts) => {
  const {uncategorized, ...counts} = countLabels(posts, 'category');
  return uncategorized ? {...counts, uncategorized} : counts;
};

export const getSidebarData = async () => {
  const posts = await getBlogPosts();

  return {
    archives: getArchivesByMonth(posts),
    categoryCount: getCategoryCount(posts),
  };
};
