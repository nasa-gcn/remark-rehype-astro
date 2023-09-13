import type { Nodes } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'

import replacements from './replacements/index.js'

export type { AstroData, AstroText } from './nodes.js'

export default function <T extends Nodes>(tree: T): T {
  findAndReplace(tree, replacements)
  return tree
}
