// frontmatter の category / tags(配列またはカンマ区切りの文字列)を扱うヘルパー。
// 検索ページ(クライアント側)からも使うため astro:content には依存させない

type LabelKey = 'category' | 'tags';

export const getLabels = (label): string[] => {
  const labels = typeof label === 'string' ? label.split(',') : Array.isArray(label) ? label : [];
  return labels.filter(Boolean);
};

// 表示用のカテゴリー(既定値の uncategorized は除く)
export const getCategories = (category) => getLabels(category).filter((item) => item !== 'uncategorized');

// ラベルごとの記事数(記事の並び順で初出順)
export const countLabels = (posts, key: LabelKey) => {
  const counts: Record<string, number> = {};
  posts.forEach((post) => {
    getLabels(post.data[key]).forEach((label) => {
      counts[label] = (counts[label] || 0) + 1;
    });
  });
  return counts;
};

export const getPostsByLabel = (posts, key: LabelKey, label: string) =>
  posts.filter((post) => getLabels(post.data[key]).includes(label));
