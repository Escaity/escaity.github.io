// タグ・カテゴリーの一覧ページ用の SEO 設定

// 記事がこの件数未満の一覧ページは内容が薄いため noindex にする(sitemap からも自動で除外される)
export const MIN_POSTS_FOR_INDEX = 2;

const MAX_DESCRIPTION_LENGTH = 120;

// 「〇〇」タグの記事一覧(N件)。記事タイトル1、記事タイトル2… を 120 字程度に収める
export const getListPageDescription = (heading: string, posts) => {
  let description = `${heading}（${posts.length}件）。`;
  for (const [index, post] of posts.entries()) {
    const next = `${index === 0 ? '' : '、'}${post.data.title}`;
    if ((description + next).length > MAX_DESCRIPTION_LENGTH) {
      return index === 0 ? description : `${description}など`;
    }
    description += next;
  }
  return description;
};
