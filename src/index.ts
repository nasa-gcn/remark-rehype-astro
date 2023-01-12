import { SKIP, visit } from 'unist-util-visit'
import type { Node, Parent } from 'unist'
import type { Text } from 'mdast'

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

export default function astromd(tree: Node) {
  visit(tree, 'text', ({ value }: Text, index: number, parent: Parent) => {
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
}
