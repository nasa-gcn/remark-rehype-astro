import arXiv from './replacements/arXiv/index.js'
import datetime from './replacements/datetime/index.js'
import gcnCircular from './replacements/gcn-circular/index.js'
import type { FindAndReplace } from './replacements/index.js'

export const replacements: FindAndReplace[] = [arXiv, datetime, gcnCircular]
