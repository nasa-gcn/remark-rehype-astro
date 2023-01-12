import remarkAstroMd from '.'
import { fromMarkdown } from 'mdast-util-from-markdown'

const md = `
# Hello, world

This paragraph contains a time 2022-10-03 12:01:01.313 and some more text

This paragraph contains a time 2022-10-03

2022-10-03T12:01:01Z is a time
`

describe('datetimer', () => {
  test('parses sample text', async () => {
    const tree = remarkAstroMd(fromMarkdown(md))
    expect(tree.children[1]).toHaveProperty('children', [
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
    expect(tree.children[2]).toHaveProperty('children', [
      { type: 'text', value: 'This paragraph contains a time ' },
      {
        data: { astromd: { type: 'datetime', value: '2022-10-03Z' } },
        type: 'text',
        value: '2022-10-03',
      },
    ])
    expect(tree.children[3]).toHaveProperty('children', [
      {
        data: { astromd: { type: 'datetime', value: '2022-10-03T12:01:01Z' } },
        type: 'text',
        value: '2022-10-03T12:01:01Z',
      },
      { type: 'text', value: ' is a time' },
    ])
  })
})
