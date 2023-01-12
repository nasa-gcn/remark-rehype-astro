[![codecov](https://codecov.io/gh/nasa-gcn/remark-astromd/branch/main/graph/badge.svg?token=3ID7X7XNNQ)](https://codecov.io/gh/nasa-gcn/remark-astromd)

# remark-astromd

This is a plugin for [Remark](https://remark.js.org) for parsing Astro Flavored Markdown, a dialect of [Markdown](https://www.markdownguide.org) for rapid astronomy communications.

Astro Flavored Markdown detects dates, times, sky coordinates, and bibliographic references. Astro Flavored Markdown data is tagged in the [mdast](https://github.com/syntax-tree/mdast) syntax tree for later enrichment.

An Astro Flavored Markdown node is just an mdast [Text](https://github.com/syntax-tree/mdast#text) node containing the original text verbatim plus an added `data` attribute:

```ts
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
```

Astro Flavored Markdown supports the following types.

## datetime

A UTC date with an optional time, normalized to [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).
