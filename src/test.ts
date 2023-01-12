import astromd from '.'
import { fromMarkdown } from 'mdast-util-from-markdown'
import type { Parent } from 'unist'

const md = `
# Hello, world

This paragraph contains a time 2022-10-03 12:01:01.313 and some more text

This paragraph contains a time 2022-10-03

2022-10-03T12:01:01Z is a time
`

describe('astromdDatetime', () => {
  test('parses sample text', async () => {
    const result = fromMarkdown(md)
    astromd(result)
    expect((result.children[1] as Parent).children).toStrictEqual([
      { type: 'text', value: 'This paragraph contains a time ' },
      {
        data: {
          astromd: { type: 'datetime', value: '2022-10-03T12:01:01.313Z' },
        },
        type: 'text',
        value: '2022-10-03 12:01:01.313',
      },
      { type: 'text', value: ' and some more text' },
    ])
    expect((result.children[2] as Parent).children).toStrictEqual([
      { type: 'text', value: 'This paragraph contains a time ' },
      {
        data: { astromd: { type: 'datetime', value: '2022-10-03Z' } },
        type: 'text',
        value: '2022-10-03',
      },
    ])
    expect((result.children[3] as Parent).children).toStrictEqual([
      {
        data: { astromd: { type: 'datetime', value: '2022-10-03T12:01:01Z' } },
        type: 'text',
        value: '2022-10-03T12:01:01Z',
      },
      { type: 'text', value: ' is a time' },
    ])
  })
})
