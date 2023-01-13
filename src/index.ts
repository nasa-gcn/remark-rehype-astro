import { SKIP, visit } from 'unist-util-visit'
import type { Parent, Text } from 'mdast'

export interface AstroText extends Text {
  data: {
    astromd: {
      /** Astro Flavored Markdown data type */
      type: string
      /** Normalized value */
      value: string
    }
  }
}

interface VisitorSpec {
  /** Name of the Astro Flavored Markdown type. */
  type: string
  /** Regular expression to search for. */
  pattern: RegExp
  /** Replacement function to generate normalized value.
   * The function should be suitable for passing to String.replace().
   */
  replacement: (...groups: string[]) => string
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

export default function mdastAstroMd<T extends Parent>(tree: T): T {
  visit(tree, 'text', ({ value }, index, parent) => {
    if (parent === null || index === null)
      throw new Error('Unexpected visit to root element')

    for (const { type, pattern, replacement } of visitorSpecs) {
      const match = pattern.exec(value)
      if (match) {
        const [matchText] = match
        const { index: matchStart } = match
        const matchEnd = matchStart + matchText.length

        const nodes: Text[] = []
        if (matchStart > 0)
          nodes.push({ type: 'text', value: value.slice(0, matchStart) })
        nodes.push({
          type: 'text',
          value: matchText,
          data: {
            astromd: { type, value: replacement(...match) },
          },
        })
        if (matchEnd < value.length)
          nodes.push({ type: 'text', value: value.slice(matchEnd) })

        parent.children.splice(index, 1, ...nodes)
        return [SKIP, index + nodes.length]
      }
    }
  })

  return tree
}
