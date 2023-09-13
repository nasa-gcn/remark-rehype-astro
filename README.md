[![codecov](https://codecov.io/gh/nasa-gcn/remark-astro/branch/main/graph/badge.svg?token=3ID7X7XNNQ)](https://codecov.io/gh/nasa-gcn/remark-astro)

# remark-astro

This is a plugin for [remark](https://github.com/remarkjs/remark) for parsing Astro Flavored Markdown, a dialect of [Markdown](https://www.markdownguide.org) for rapid astronomy communications.

Astro Flavored Markdown detects dates, times, sky coordinates, and bibliographic references. Astro Flavored Markdown data is tagged in the [mdast](https://github.com/syntax-tree/mdast) syntax tree for later enrichment.

An Astro Flavored Markdown node is just an mdast [Text](https://github.com/syntax-tree/mdast#text) node containing the original text verbatim plus an added `data` attribute:

```ts
export interface AstroText extends Text {
  data: {
    astro: {
      /** Astro Flavored Markdown data type */
      type: string
      /** Normalized value */
      value: string
    }
  }
}
```

For supported syntax, see the [src/replacements](src/replacements) directory. In each direcetory there is a file called `test.md` illustrating the Markdown syntax and a file called `test.json` containing the resulting syntax tree.
