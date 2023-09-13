import { findAndReplace as findAndReplaceHast } from 'hast-util-find-and-replace'
import { findAndReplace as findAndReplaceMdast } from 'mdast-util-find-and-replace'

import dataHast from './nodes/hast.js'
import type { DataFunction } from './nodes/index.js'
import dataMdast from './nodes/mdast.js'
import { replacements } from './replacements.js'

function getPlugin<Tree, FindAndReplaceTuple>(
  findAndReplace: (tree: Tree, list: FindAndReplaceTuple[]) => void,
  data: DataFunction
) {
  const list = replacements.map(
    ({ find, replace }) =>
      [
        find,
        (...args: string[]) => replace(data, ...args),
      ] as FindAndReplaceTuple
  )
  return (tree: Tree) => {
    findAndReplace(tree, list)
    return tree
  }
}

export const remarkAstro = () => getPlugin(findAndReplaceMdast, dataMdast)
export const rehypeAstro = () => getPlugin(findAndReplaceHast, dataHast)
