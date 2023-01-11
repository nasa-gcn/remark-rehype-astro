import astromdDatetime from './index.js'
import {fromMarkdown} from 'mdast-util-from-markdown'

const md = `
# Hello, world

This paragraph contains a time 2022-10-03Z and some more text

This paragraph contains a time 2022-10-03Z

2022-10-03Z is a time
`

describe('astromdDatetime', () => {
  test('parses sample text', async () => {
    const result = fromMarkdown(md)
    astromdDatetime(result)
    expect(result.children[1].children).toStrictEqual([{"type": "text", "value": "This paragraph contains a time "}, {"data": {"astromd": "datetime"}, "type": "text", "value": "2022-10-03Z"}, {"type": "text", "value": " and some more text"}])
    expect(result.children[2].children).toStrictEqual([{"type": "text", "value": "This paragraph contains a time "}, {"data": {"astromd": "datetime"}, "type": "text", "value": "2022-10-03Z"}])
    expect(result.children[3].children).toStrictEqual([{"data": {"astromd": "datetime"}, "type": "text", "value": "2022-10-03Z"}, {"type": "text", "value": " is a time"}])
  })
})
