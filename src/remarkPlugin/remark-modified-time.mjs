import getReadingTime from 'reading-time';
import {toString} from 'mdast-util-to-string';
import {getGitLastModifiedLabel} from "../utils/gitContentDates.ts";

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    const publishedDate = file.data.astro.frontmatter.date;
    file.data.astro.frontmatter.lastModified = getGitLastModifiedLabel(filepath, publishedDate);
    // 本文の文字数から読了時間を計算する
    file.data.astro.frontmatter.readingTime = getReadingTime(toString(tree));
  };
}
