import type { FindAndReplace } from '../index.js'

export default {
  find: /AT\s*(2\d{3}[a-z]+)/g,
  replace(data, text, value) {
    return data('tns', text, value)
  },
} satisfies FindAndReplace
