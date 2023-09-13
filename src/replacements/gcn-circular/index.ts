import { text } from '../../nodes/index.js'
import type { FindAndReplace } from '../index.js'

function normalize(match: string) {
  return parseFloat(match.replace(/a$/i, '.5'))
}

const preamble = /GCN(?:\s+Circular)?s?\s*/.source
const conjunction = /(?:\s*|,|and)+/.source
const circularIdRegExp = /\d+(?:a|\.5)?/gi
const circularId = circularIdRegExp.source

export default {
  find: new RegExp(
    `${preamble}${circularId}(?:${conjunction}${circularId})*`,
    'gi'
  ),
  replace(data, value) {
    const result = []
    let lastIndex = 0
    for (const match of value.matchAll(circularIdRegExp)) {
      /* istanbul ignore if */
      if (match.index === undefined) throw new Error('match.index is undefined')
      const pre = value.slice(lastIndex, match.index)
      if (pre) result.push(text(pre))
      result.push(data('gcn-circular', match[0], normalize(match[0])))
      lastIndex = match.index + match[0].length
    }
    return result
  },
} satisfies FindAndReplace
