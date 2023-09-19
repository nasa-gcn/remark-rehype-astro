import type { FindAndReplace } from '../index.js'

const marker = /(?:arXiv:|https?:\/\/(?:www\.)?arxiv\.org\/abs\/)/.source
const articleId = /(?:\d{4}\.\d{5}|[a-z-]+\/\d{7})(?:v\d+)?/.source

export default {
  find: new RegExp(`${marker}(${articleId})`, 'g'),
  replace(data, text, value) {
    return data('arXiv', text, value)
  },
} satisfies FindAndReplace
