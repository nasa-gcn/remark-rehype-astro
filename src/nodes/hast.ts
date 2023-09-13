import { h } from 'hastscript'

import type { DataFunction } from './index.js'

export default ((type, children, value) =>
  h(
    'data',
    { class: type, value: value ?? children },
    children
  )) satisfies DataFunction
