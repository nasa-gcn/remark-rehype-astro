import { readFile, writeFile } from 'fs/promises'
import { globSync } from 'glob'
import type { Nodes } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { Processor, unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'

import { rehypeAstro, remarkAstro } from './src'

async function read(filename: string) {
  return await readFile(filename, { encoding: 'utf-8' })
}

function remarkRemovePosition() {
  return (tree: Nodes) => {
    removePosition(tree)
    return tree
  }
}

function remarkJson(this: Processor) {
  this.Compiler = (root) => JSON.stringify(root, undefined, 2)
}

function remarkProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkRemovePosition)
    .use(remarkAstro)
    .use(remarkJson)
}

function rehypeProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeAstro)
    .use(rehypeStringify)
}

describe.each([
  ['remarkAstro', 'json', remarkProcessor],
  ['rehypeAstro', 'html', rehypeProcessor],
])('%s', (_, ext, processor) => {
  test.each(globSync('src/replacements/*/test.md'))(
    '%s',
    async (inputFilename) => {
      const result = (
        await processor().process(await readFile(inputFilename))
      ).value.toString()

      const expectedFilename = inputFilename.replace(/\.md$/, `.${ext}`)
      let expected
      try {
        expected = await read(expectedFilename)
      } catch {
        const draftFilename = inputFilename.replace(/\.md$/, `.draft.${ext}`)
        await writeFile(draftFilename, result)
        throw new Error(
          `Could not read the expected results file, '${expectedFilename}'. Please review the draft results file at '${draftFilename}'. If the results are correct, then rename it to '${expectedFilename}' and add it to version control.`
        )
      }

      expect(result).toStrictEqual(expected)
    }
  )
})
