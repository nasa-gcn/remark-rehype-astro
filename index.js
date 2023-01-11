import { SKIP, visit } from 'unist-util-visit'
// import type { Node, Parent } from 'unist'
// import type { Literal, Text } from 'mdast'

const re = /\d{4}-\d{2}-\d{2}Z?/

export default function astromdDatetime(tree) {
  // const re = /\d{4}-\d{2}-\d{2}(?:[ T]\d{2}(?::\d{2}(?::\d{2}(?:\.\d+))))Z?/
  visit(
    tree,
    'text',
    ({ value } /*: Text*/, index /*: number*/, parent /*: Parent*/) => {
      const match = re.exec(value)
      if (match) {
        const [matchText] = match
        const { index: matchStart } = match
        const matchEnd = matchStart + matchText.length

        const nodes /*: Literal[]*/ = []
        if (matchStart > 0)
          nodes.push({ type: 'text', value: value.slice(0, matchStart) })
        nodes.push({
          type: 'text',
          value: matchText,
          data: { astromd: 'datetime' },
        })
        if (matchEnd < value.length)
          nodes.push({ type: 'text', value: value.slice(matchEnd) })

        parent.children.splice(index, 1, ...nodes)
        return [SKIP, index + nodes.length]
      }
    }
  )
}
