import type { FindAndReplace } from '../index.js'

export default {
  find: /arXiv:(?:\d{4}\.\d{5}|[a-z-]+\/\d{7})(?:v\d+)?/g,
  replace(data, value) {
    return data('arXiv', value)
  },
} satisfies FindAndReplace
