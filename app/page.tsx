import fs from "fs";
import path from "path";
import DocsViewer, { DocFile } from "@/app/lib/DocsViewer";

interface DocFile {
  name: string;
  content: string;
}

async function loadDocs(): Promise<DocFile[]> {
  const docsDir = path.join(process.cwd(), "docs");
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"));
  const docs: DocFile[] = files.map((file) => {
    const content = fs.readFileSync(path.join(docsDir, file), "utf8");
    return { name: file, content };
  });
  const readmePath = path.join(process.cwd(), "README.md");
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, "utf8");
    docs.unshift({ name: "README.md", content: readmeContent });
  }
  return docs;
}

export default async function Home() {
  const docs = await loadDocs();
  return <DocsViewer docs={docs} />;
}
