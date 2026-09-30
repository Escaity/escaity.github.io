import dayjs from "dayjs";
import {dealLabel} from "./dealLabel";

const normalizeLabels = (label) => dealLabel(label).map((item) => item.toLowerCase());

// 共通タグ 1 つにつき 2 点、同じカテゴリで 1 点として関連度を計算し、上位の記事を返す
export const getRelatedPosts = (posts, current, limit = 3) => {
  const currentTags = new Set(normalizeLabels(current.data.tags));
  const currentCategories = new Set(
    normalizeLabels(current.data.category).filter((category) => category !== "uncategorized")
  );

  return posts
    .filter((post) => post.id !== current.id)
    .map((post) => {
      const sharedTags = normalizeLabels(post.data.tags).filter((tag) => currentTags.has(tag)).length;
      const sameCategory = normalizeLabels(post.data.category).some((category) => currentCategories.has(category));
      return {post, score: sharedTags * 2 + (sameCategory ? 1 : 0)};
    })
    .filter(({score}) => score > 0)
    .sort((a, b) => b.score - a.score || dayjs(b.post.data.date).valueOf() - dayjs(a.post.data.date).valueOf())
    .slice(0, limit)
    .map(({post}) => post);
};
