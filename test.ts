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

  test.each([
    'GCN 123',
    'GCN #123',
    '(GCN 123)',
    '(GCN #123)',
    'GCN circ. 123',
    'GCN circ. #123',
    '(GCN circ. #123)',
    'GCN circ 123',
    '(GCN circ 123)',
    'GCN Circ. 123',
    'GCN Circ. #123',
    '(GCN Circ. #123)',
    'GCN Circ 123',
    '(GCN Circ 123)',
    'GCN Circular 123',
    'GCN Circular #123',
    '(GCN Circular 123)',
    '(GCN Circular #123)',
    'GCN Circs 123, 456',
    'GCN Circs. 123, 456',
    'GCN Circs #123, #456',
    '(GCN Circs #123, #456)',
    '(GCN Circs 123, 456)',
    'GCN Circ 123, 456',
    'GCN Circ. 123, 456',
    'GCN Circ #123, #456',
    '(GCN Circ 123, 456)',
    'GCN circs 123, 456',
    'GCN circs. 123, 456',
    'GCN circs #123, #456',
    '(GCN circs 123, 456)',
    'GCN circs 123 and 456',
    'GCN circs. 123 and 456',
    'GCN circs #123 and #456',
    '(GCN circs 123 and 456)',
    'GCN circs 123 456',
    'GCN circs. 123 456',
    'GCN circs #123 #456',
    '(GCN circs 123 456)',
    'GCN          #123',
    'gcn         123',
  ])('GCN linking', async (testPattern) => {
    const result = (
      await processor().process(
        `some preceding text ${testPattern} some following text.`
      )
    ).value.toString()
    const circularIdString = testPattern.match(/\d+/g)?.join(', ') || ''
    const circularIdArray = circularIdString.split(',').map((x) => {
      return x.trim()
    })
    for (const circularId of circularIdArray) {
      const htmlResult = `<data class="gcn-circular" value="${circularId}">${circularId}`
      const jsonResult = {
        type: 'text',
        value: circularId,
        data: {
          class: 'gcn-circular',
          value: parseInt(circularId),
        },
      }
      const expected = ext === 'html' ? htmlResult : JSON.stringify(jsonResult)
      const formattedResult =
        ext === 'html'
          ? result
          : JSON.stringify(JSON.parse(result).children[0].children)
      expect(formattedResult).toContain(expected)
    }
  })
})
