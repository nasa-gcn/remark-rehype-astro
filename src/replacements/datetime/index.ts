import type { FindAndReplaceTuple } from 'mdast-util-find-and-replace'

import { astroText } from '../../nodes.js'

export default [
  /(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}(?::\d{2}(?::\d{2}(?:\.\d+)?)?)))?Z?/g,
  (value: string, date: string, time?: string) =>
    astroText(value, 'datetime', time ? `${date}T${time}Z` : `${date}Z`),
] satisfies FindAndReplaceTuple
