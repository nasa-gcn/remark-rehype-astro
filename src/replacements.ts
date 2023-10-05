import arxiv from './replacements/arxiv/index.js'
import datetime from './replacements/datetime/index.js'
import doi from './replacements/doi/index.js'
import gcnCircular from './replacements/gcn-circular/index.js'
import type { FindAndReplace } from './replacements/index.js'
import tns from './replacements/tns/index.js'

export const replacements: FindAndReplace[] = [
  arxiv,
  datetime,
  doi,
  gcnCircular,
  tns,
]
