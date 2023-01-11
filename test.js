import plugin from './index.js'
import { remark } from 'remark'

const md = `
# Test file

13:45:30 == 1:45:30 PM
13:45:30.123 == 1:45:30.123 PM
13:45:30+02:00 == 1:45:30 PM, with a time zone offset of +02:00
13:45:30Z == 1:45:30 PM in UTC
`

describe('datetime', () => {
  test('parses sample text', async () => {
    const result = remark().use(plugin).parse(md)
    expect(result).toBe({})
  })
})
