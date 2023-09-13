import type { FindAndReplace } from '../index.js'

export default {
  find: /(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}(?::\d{2}(?::\d{2}(?:\.\d+)?)?)))?Z?/g,
  replace(data, value, date, time) {
    return data('datetime', value, time ? `${date}T${time}Z` : `${date}Z`)
  },
} satisfies FindAndReplace
