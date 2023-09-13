import type { Node } from 'unist'

import type { DataFunction } from '../nodes/index.js'

export interface FindAndReplace<T extends Node = Node> {
  find: string | RegExp
  replace: (data: DataFunction, ...captures: string[]) => T | T[]
}
