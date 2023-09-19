import type { FindAndReplace } from '../index.js'

const doiMarker = /(?:doi:|https?:\/\/(?:dx\.)?doi\.org\/)/.source
const suffixChars = /[a-zA-Z0-9]/.source
const suffixCharsNonTerminal = /[-_.~%]/.source
const prefix = /10\.\d{4,}/.source
const terminal = /\s|$/.source

export default {
  find: new RegExp(
    `${doiMarker}(${prefix}/(?:${suffixChars}|(?:${suffixCharsNonTerminal})(?!${terminal}))+)`,
    'g'
  ),
  replace(data, text, value) {
    return data('doi', text, value.toLowerCase())
  },
} satisfies FindAndReplace
