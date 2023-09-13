import { type DataFunction, text } from './index.js'

export default ((type, children, value) => ({
  ...text(children),
  data: { class: type, value: value ?? children },
})) satisfies DataFunction
