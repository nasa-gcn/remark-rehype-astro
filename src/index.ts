import type { Nodes, Text } from 'mdast'
import { type Find, findAndReplace } from 'mdast-util-find-and-replace'

type AstroData = {
  /** Astro Flavored Markdown data type */
  type: string
  /** Normalized value */
  value: string
}

export interface AstroText extends Text {
  data: {
    astromd: AstroData
  }
}

interface VisitorSpec {
  /** Name of the Astro Flavored Markdown type. */
  type: string
  /** Regular expression to search for. */
  pattern: Find
  /** Replacement function to generate normalized value.
   * The function should be suitable for passing to String.replace().
   */
  replacement: (value: string, ...groups: string[]) => string
}

const visitorSpecs: VisitorSpec[] = [
  {
    type: 'datetime',
    pattern:
      /(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}(?::\d{2}(?::\d{2}(?:\.\d+)?)?))?)?Z?/,
    replacement: (_: string, date: string, time?: string) =>
      time ? `${date}T${time}Z` : `${date}Z`,
  },
]

export default function mdastAstroMd<T extends Nodes>(tree: T): T {
  findAndReplace(
    tree,
    visitorSpecs.map(({ type, pattern, replacement }) => [
      pattern,
      (value: string, ...groups: string[]) => ({
        type: 'text',
        value,
        data: { astromd: { type, value: replacement(value, ...groups) } },
      }),
    ])
  )
  return tree
}
