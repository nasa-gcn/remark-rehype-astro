import { text } from '../../nodes/index.js'
import type { FindAndReplace } from '../index.js'

function normalize(match: string) {
  return parseFloat(match.replace(/a$/i, '.5'))
}

const preamble = /GCN(?:s|\s+Circulars?|\s+Circs?\.)?\s*/.source
const conjunction = /(?:\s*|,|and)+/.source
const circularIdRegExp = /\d+(?:a|\.5)?/gi
const circularId = circularIdRegExp.source
const legacyUrlOrigin = /https?:\/\/gcn\.gsfc\.nasa\.gov/.source
const legacyUrlExtension = /\.gcn3/.source
const legacyUrl = `${legacyUrlOrigin}/(?:gcn/)*gcn3/(${circularId})${legacyUrlExtension}`
const urlOrigin = /https?:\/\/gcn\.nasa\.gov/.source
const url = `${urlOrigin}/circulars/(${circularId})`

export default {
  find: new RegExp(
    `${url}|${legacyUrl}|${preamble}${circularId}(?:${conjunction}${circularId})*`,
    'gi'
  ),
  replace(data, value, circularIdFromUrl, circularIdFromLegacyUrl) {
    circularIdFromUrl ||= circularIdFromLegacyUrl
    if (circularIdFromUrl)
      return data('gcn-circular', value, normalize(circularIdFromUrl))

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
