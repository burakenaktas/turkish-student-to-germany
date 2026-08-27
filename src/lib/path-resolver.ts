import type { PathOption, PathQuestion, PathResult } from "@/data/roadmap-paths";

export type ResolvedPath = {
  /** Answered (question, chosen label) pairs, in order. */
  trail: { question: string; label: string }[];
  /** The next unanswered question, if the tree hasn't reached a result yet. */
  current?: PathQuestion;
  /** The terminal result, once every question up to it has been answered. */
  result?: PathResult;
};

/** Walks a path question tree with the given answer indices. */
export function resolvePath(root: PathQuestion, choices: number[]): ResolvedPath {
  const trail: ResolvedPath["trail"] = [];
  let node: PathQuestion | undefined = root;
  let result: PathResult | undefined;

  for (const idx of choices) {
    if (!node) break;
    const opt: PathOption | undefined = node.options[idx];
    if (!opt) break;
    trail.push({ question: node.question, label: opt.label });
    if (opt.result) {
      result = opt.result;
      node = undefined;
      break;
    }
    node = opt.next;
  }

  if (result) return { trail, result };
  if (node) return { trail, current: node };
  return { trail };
}
