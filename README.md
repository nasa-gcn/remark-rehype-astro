[![codecov](https://codecov.io/gh/nasa-gcn/remark-rehype-astro/branch/main/graph/badge.svg?token=3ID7X7XNNQ)](https://codecov.io/gh/nasa-gcn/remark-rehype-astro)

# remark-rehype-astro

This package provides plugins for [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype) for parsing Astro Flavored Markdown, a dialect of [Markdown](https://www.markdownguide.org) for rapid astronomy communications. Astro Flavored Markdown detects dates, times, sky coordinates, and bibliographic references.

The `remark-rehype-astro` package can be used as _either_ a Remark plugin _or_ as a Rehype plugin. Use it in Remark mode if you want a symbolic representation of the Markdown content (for example, to extract data nodes from it). Use it in Rehype mode if you want to render Astro Flavored Mardkown into a Web page.

For supported syntax, see the [src/replacements](src/replacements) directory. In each directory there is a file called `test.md` illustrating the Markdown syntax, a file called `test.json` containing the resulting astract syntax tree, and a file called `test.html` showing how it is rendered in HTML.

## Remark mode

When you use the plugin in Remark mode, it tags Astro Flavored Markdown nodes in the [mdast](https://github.com/syntax-tree/mdast) syntax tree by adding `data` attributes with `class` and `value` attributes indicating the kind of data and a normalized, computable value.

Here is a basic pipeline for processing in Remark mode:

```mjs
import remarkParse from 'remark-parse'
import { remarkAstro } from 'remark-rehype-astro'
import { unified } from 'unified'

const processor = unified().use(remarkParse).use(remarkAstro)
```

The following Markdown text:

```md
See GCN Circular 123
```

is represented by the following syntax tree:

```json
{
  "type": "root",
  "children": [
    {
      "type": "text",
      "value": "See GCN Circular "
    },
    {
      "type": "text",
      "value": "123",
      "data": {
        "class": "gcn-circular",
        "value": 123
      }
    }
  ]
}
```

## Rehype mode

When you use the plugin in Rehype mode, it converts Astro Flavored Markdown nodes into HTML [`<data>`](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) elements with `class` and `value` attributes indicating the kind of data and a normalized, computable value.

Here is a basic pipeline for processing in Remark mode:

```mjs
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { rehypeAstro } from 'remark-rehype-astro'
import { unified } from 'unified'

const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeAstro)
```

The following Markdown text:

```md
See GCN Circular 123
```

is represented by the following HTML:

```html
<p>See <data class="gcn-circular" value="123">123</data></p>
```

You can enrich these [`<data>`](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) elements using CSS, JavaScript, or by rendering them as custom React components using [rehype-react](https://github.com/rehypejs/rehype-react).
