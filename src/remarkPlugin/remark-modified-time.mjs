import getReadingTime from 'reading-time';
import {toString} from 'mdast-util-to-string';
import {getGitLastModifiedLabel} from "../utils/gitContentDates.ts";

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    const publishedDate = file.data.astro.frontmatter.date;
    file.data.astro.frontmatter.lastModified = getGitLastModifiedLabel(filepath, publishedDate);
    // 获取文章字数和阅读时长
    const textOnPage = toString(tree);
    // readingTime.text 会以友好的字符串形式给出阅读时间，例如 "3 min read"。
    file.data.astro.frontmatter.readingTime = getReadingTime(textOnPage,);
  };
}
