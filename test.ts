import { readFile } from 'fs/promises'
import { globSync } from 'glob'
import { toMatchFile } from 'jest-file-snapshot'
import type { Nodes } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { Processor, unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'

import { rehypeAstro, remarkAstro } from './src'

function remarkRemovePosition() {
  return (tree: Nodes) => {
    removePosition(tree)
    return tree
  }
}

function remarkJson(this: Processor) {
  this.Compiler = (root) => JSON.stringify(root, undefined, 2)
}

const processors = {
  json: unified()
    .use(remarkParse)
    .use(remarkRemovePosition)
    .use(remarkAstro)
    .use(remarkJson),
  html: unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeAstro)
    .use(rehypeStringify),
}

expect.extend({ toMatchFile })

describe.each(globSync('src/replacements/*/test.md'))('convert %s', (path) => {
  const stem = path.replace(/\.md$/, '')
  let input: Buffer

  beforeAll(async () => (input = await readFile(path)))

  test.each(Object.entries(processors))(`to ${stem}.%s`, (ext, proc) =>
    expect(proc.processSync(input).value).toMatchFile(`${stem}.${ext}`)
  )
})
