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

function readGitCommitDates(filepath: string) {
  const result = execFileSync(
    "git",
    ["log", "--follow", "--format=%H %cI", "--", filepath],
    {encoding: "utf-8"}
  );

  return result
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(" "))
    .filter(([hash]) => !ignoredRevs.has(hash))
    .map(([, date]) => date);
}

export function getGitContentDates(filepath?: string): GitContentDates {
  if (!filepath) {
    return {createdAt: null, lastCommittedAt: null, commitCount: 0};
  }

  const cached = gitContentDatesCache.get(filepath);
  if (cached) {
    return cached;
  }

  try {
    const commitDates = readGitCommitDates(filepath);
    const dates = {
      createdAt: commitDates.length ? new Date(commitDates[commitDates.length - 1]) : null,
      lastCommittedAt: commitDates.length ? new Date(commitDates[0]) : null,
      commitCount: commitDates.length,
    };
    gitContentDatesCache.set(filepath, dates);
    return dates;
  } catch {
    const dates = {createdAt: null, lastCommittedAt: null, commitCount: 0};
    gitContentDatesCache.set(filepath, dates);
    return dates;
  }
}

export function getGitCreatedAt(filepath?: string) {
  return getGitContentDates(filepath).createdAt;
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
