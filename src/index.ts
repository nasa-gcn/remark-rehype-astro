import type { Nodes } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'

import replacements from './replacements.js'

export type { AstroData, AstroText } from './nodes.js'

export function mdastAstro(tree: Nodes) {
  findAndReplace(tree, replacements)
  return tree
}

export default function remarkAstro() {
  return mdastAstro
}
