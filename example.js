import plugin from './index.js'
import fs from 'fs'
import { remark } from 'remark'

const buffer = fs.readFileSync('sample.md')

remark().use(plugin).process(buffer)
