import { remark } from 'remark'
import { datetime } from './datetime'
import type { Node } from 'unist'

let tree: Node

const md = `
# Hello world
A date: 2022-12-01
`

beforeEach(async () => {
  tree = await remark().use(datetime).process(md)
})

describe('datetime', () => {
  test('works', () => {
    expect(tree).toBe({})
  })
})
