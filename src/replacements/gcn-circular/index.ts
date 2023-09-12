import type { Text } from 'mdast'
import type { FindAndReplaceTuple } from 'mdast-util-find-and-replace'

import { astroText, text } from '../../nodes.js'

function astroTextGcnCircular(match: string) {
  return astroText(
    match,
    'gcn-circular',
    parseFloat(match.replace(/a$/i, '.5'))
  )
}

const preamble = /GCN(?:\s+Circular)?s?\s*/.source
const conjunction = /(?:\s*|,|and)+/.source
const circularIdRegExp = /\d+(?:a|\.5)?/gi
const circularId = circularIdRegExp.source

export default [
  new RegExp(`${preamble}${circularId}(?:${conjunction}${circularId})*`, 'gi'),
  (value: string) => {
    const result: Text[] = []
    let lastIndex = 0
    for (const match of value.matchAll(circularIdRegExp)) {
      /* istanbul ignore if */
      if (match.index === undefined) throw new Error('match.index is undefined')
      const pre = value.slice(lastIndex, match.index)
      if (pre) result.push(text(pre))
      result.push(astroTextGcnCircular(match[0]))
      lastIndex = match.index + match[0].length
    }
    return result
  },
] satisfies FindAndReplaceTuple
