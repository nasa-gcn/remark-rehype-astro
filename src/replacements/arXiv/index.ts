import type { FindAndReplaceTuple } from 'mdast-util-find-and-replace'

import { astroText } from '../../nodes.js'

export default [
  /arXiv:(?:\d{4}\.\d{5}|[a-z-]+\/\d{7})(?:v\d+)?/g,
  (value: string) => astroText(value, 'arXiv'),
] satisfies FindAndReplaceTuple
