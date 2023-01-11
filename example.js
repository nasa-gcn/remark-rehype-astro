import plugin from "./index.js";
import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const buffer = fs.readFileSync("sample.md");

unified()
  .use(plugin)
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(buffer);
