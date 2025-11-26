export interface DiffResult {
  lines: DiffLine[];
  stats: {
    added: number;
    removed: number;
    unchanged: number;
  };
}

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export function diffText(text1: string, text2: string): DiffResult {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');

  const result: DiffLine[] = [];
  const stats = { added: 0, removed: 0, unchanged: 0 };

  // Simple diff implementation using longest common subsequence approach
  const lcs = computeLCS(lines1, lines2);

  let i = 0, j = 0;
  let oldLineNum = 1, newLineNum = 1;

  while (i < lines1.length || j < lines2.length) {
    if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
      // Lines match
      result.push({
        type: 'unchanged',
        content: lines1[i],
        oldLineNumber: oldLineNum++,
        newLineNumber: newLineNum++,
      });
      stats.unchanged++;
      i++;
      j++;
    } else if (j >= lines2.length || (i < lines1.length && !isInLCS(j, lcs))) {
      // Line removed
      result.push({
        type: 'removed',
        content: lines1[i],
        oldLineNumber: oldLineNum++,
      });
      stats.removed++;
      i++;
    } else {
      // Line added
      result.push({
        type: 'added',
        content: lines2[j],
        newLineNumber: newLineNum++,
      });
      stats.added++;
      j++;
    }
  }

  return { lines: result, stats };
}

function computeLCS(arr1: string[], arr2: string[]): Set<number> {
  const m = arr1.length;
  const n = arr2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  // Build LCS table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find LCS indices in arr2
  const lcsIndices = new Set<number>();
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcsIndices.add(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcsIndices;
}

function isInLCS(index: number, lcs: Set<number>): boolean {
  return lcs.has(index);
}
