import type { FindAndReplace } from '../index.js'

const suffixChars = /[a-zA-Z0-9]/.source
const suffixCharsNonTerminal = /[-_.~%]/.source
const prefix = /10\.\d{4,}/.source
const terminal = /\s|$/.source

export default {
  find: new RegExp(
    `doi:(${prefix}/(?:${suffixChars}|(?:${suffixCharsNonTerminal})(?!${terminal}))+)`,
    'g'
  ),
  replace(data, value) {
    return data('doi', value.toLowerCase())
  },
} satisfies FindAndReplace
