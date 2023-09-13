import { readFile, writeFile } from 'fs/promises'
import { globSync } from 'glob'
import remarkParse from 'remark-parse'
import { Processor, unified } from 'unified'

import remarkAstro from './src'

async function read(filename: string) {
  return await readFile(filename, { encoding: 'utf-8' })
}

function remarkDumpJson(this: Processor) {
  this.Compiler = (root) => root
}

test.each(globSync('src/replacements/*/test.md'))('%s', async (mdFilename) => {
  const expected = (
    await unified()
      .use(remarkParse)
      .use(remarkAstro)
      .use(remarkDumpJson)
      .process(await readFile(mdFilename))
  ).result

  const jsonFilename = mdFilename.replace(/\.md$/, '.json')

  let resultText
  try {
    resultText = await read(jsonFilename)
  } catch {
    const draftFilename = jsonFilename.replace(/\.json$/, '.draft.json')
    await writeFile(draftFilename, JSON.stringify(expected, undefined, 2))
    throw new Error(
      `Could not read the expected results file, '${jsonFilename}'. Please review the draft results file at '${draftFilename}'. If the results are correct, then rename it to '${jsonFilename}' and add it to version control.`
    )
  }
  const result = JSON.parse(resultText)

  expect(expected).toStrictEqual(result)
})
