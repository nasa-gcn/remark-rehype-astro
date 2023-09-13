import type { Text } from 'mdast'

type AstroValue = boolean | number | string

export type AstroData = {
  /** Astro Flavored Markdown data type */
  type: string
  /** Normalized value */
  value: AstroValue
}

export interface AstroText extends Text {
  data: {
    astromd: AstroData
  }
}

export function text(value: string): Text {
  return { type: 'text', value }
}

export function astroText(
  value: string,
  type: string,
  astroValue?: AstroValue
): AstroText {
  return {
    ...text(value),
    data: { astromd: { type, value: astroValue ?? value } },
  }
}
