import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DOCS_ROOT = path.join(process.cwd(), "src", "content", "docs");
const FORBIDDEN_PATTERNS = [/FIXME/i, /\?\?\?\?/g, /\uFFFD/g];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      if (entry.isFile() && fullPath.endsWith(".mdx")) return [fullPath];
      return [];
    }),
  );
  return files.flat();
}

function parseCodeBlocks(content) {
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let inBlock = false;
  let startLine = 0;
  let fenceInfo = "";

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (!inBlock) {
        inBlock = true;
        startLine = i + 1;
        fenceInfo = line.slice(3).trim();
      } else {
        blocks.push({ line: startLine, info: fenceInfo });
        inBlock = false;
        fenceInfo = "";
      }
    }
  }

  return { blocks, hasUnclosedFence: inBlock };
}

function checkFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return "missing frontmatter";

  const fm = match[1];
  if (!/^\s*title\s*:/m.test(fm)) return "missing frontmatter.title";
  if (!/^\s*description\s*:/m.test(fm)) return "missing frontmatter.description";
  return null;
}

async function main() {
  const files = await walk(DOCS_ROOT);
  const errors = [];
  let totalCodeBlocks = 0;

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    const content = await readFile(file, "utf8");

    const frontmatterError = checkFrontmatter(content);
    if (frontmatterError) errors.push(`${rel}: ${frontmatterError}`);

    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(content)) {
        errors.push(`${rel}: contains forbidden pattern ${pattern}`);
      }
    }

    const { blocks, hasUnclosedFence } = parseCodeBlocks(content);
    totalCodeBlocks += blocks.length;

    if (hasUnclosedFence) errors.push(`${rel}: has unclosed code fence`);

    for (const block of blocks) {
      if (typeof block.info !== "string") {
        errors.push(`${rel}:${block.line}: invalid code fence`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("Docs validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Docs validation passed: ${files.length} files, ${totalCodeBlocks} code blocks.`);
}

main().catch((error) => {
  console.error("Docs validation crashed:", error);
  process.exit(1);
});
