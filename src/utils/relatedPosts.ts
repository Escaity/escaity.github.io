import {getCategories, getLabels} from "./labels";
import {byDateDesc} from "./posts";

const normalize = (labels: string[]) => labels.map((item) => item.toLowerCase());

// 共通タグ 1 つにつき 2 点、同じカテゴリで 1 点として関連度を計算し、上位の記事を返す
export const getRelatedPosts = (posts, current, limit = 3) => {
  const currentTags = new Set(normalize(getLabels(current.data.tags)));
  const currentCategories = new Set(normalize(getCategories(current.data.category)));

  return posts
    .filter((post) => post.id !== current.id)
    .map((post) => {
      const sharedTags = normalize(getLabels(post.data.tags)).filter((tag) => currentTags.has(tag)).length;
      const sameCategory = normalize(getLabels(post.data.category)).some((category) => currentCategories.has(category));
      return {post, score: sharedTags * 2 + (sameCategory ? 1 : 0)};
    })
    .filter(({score}) => score > 0)
    .sort((a, b) => b.score - a.score || byDateDesc(a.post, b.post))
    .slice(0, limit)
    .map(({post}) => post);
};
