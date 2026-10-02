import {execFileSync} from "child_process";
import {existsSync, readFileSync} from "fs";
import {formatDate} from "./formatDate.ts";

type GitContentDates = {
  createdAt: Date | null;
  lastCommittedAt: Date | null;
  commitCount: number;
};

const gitContentDatesCache = new Map<string, GitContentDates>();

// 記事内容の更新として扱わないコミット(一括のメタデータ変更・画像最適化など)。
// .git-blame-ignore-revs と同じく 1 行 1 コミットの完全なハッシュで書き、# 以降はコメント。
const IGNORE_REVS_FILE = ".lastmod-ignore-revs";

const ignoredRevs = (() => {
  if (!existsSync(IGNORE_REVS_FILE)) {
    return new Set<string>();
  }
  return new Set(
    readFileSync(IGNORE_REVS_FILE, "utf-8")
      .split("\n")
      .map((line) => line.replace(/#.*/, "").trim())
      .filter(Boolean)
  );
})();

// 記事ファイルのコミット日時(新しい順)。git 管理外などで取得できなければ空
function readGitCommitDates(filepath: string) {
  try {
    return execFileSync("git", ["log", "--follow", "--format=%H %cI", "--", filepath], {encoding: "utf-8"})
      .split("\n")
      .map((line) => line.trim().split(" "))
      .filter(([hash]) => hash && !ignoredRevs.has(hash))
      .map(([, date]) => new Date(date));
  } catch {
    return [];
  }
}

export function getGitContentDates(filepath?: string): GitContentDates {
  if (!filepath) {
    return {createdAt: null, lastCommittedAt: null, commitCount: 0};
  }

  if (!gitContentDatesCache.has(filepath)) {
    const commitDates = readGitCommitDates(filepath);
    gitContentDatesCache.set(filepath, {
      createdAt: commitDates.at(-1) ?? null,
      lastCommittedAt: commitDates[0] ?? null,
      commitCount: commitDates.length,
    });
  }
  return gitContentDatesCache.get(filepath);
}

export function getGitLastModifiedLabel(filepath: string, publishedDate?: Date | null) {
  const {createdAt, lastCommittedAt, commitCount} = getGitContentDates(filepath);

  if (!lastCommittedAt || commitCount < 2) {
    return "";
  }

  const baselineDate = publishedDate ?? createdAt;
  if (baselineDate && formatDate(lastCommittedAt) === formatDate(baselineDate)) {
    return "";
  }

  return formatDate(lastCommittedAt);
}
