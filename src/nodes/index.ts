import type { Node } from 'unist'

export function text(children: string) {
  return { type: 'text', value: children }
}

export type DataFunction = (
  type: string,
  children: string,
  value?: string | number
) => Node
