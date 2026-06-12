import {execFileSync} from "child_process";
import {formatDate} from "./formatDate.ts";

type GitContentDates = {
  createdAt: Date | null;
  lastCommittedAt: Date | null;
  commitCount: number;
};

const gitContentDatesCache = new Map<string, GitContentDates>();

function readGitCommitDates(filepath: string) {
  const result = execFileSync(
    "git",
    ["log", "--follow", "--format=%cI", "--", filepath],
    {encoding: "utf-8"}
  );

  return result
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
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
