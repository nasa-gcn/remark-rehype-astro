
import {visit} from 'unist-util-visit'
import {is} from 'unist-util-is'


// Plugin
export default function astroFlavor(){
    // transformer
    return (tree, file) => {
        visit(tree, 'paragraph', (node) => {
            const children = node.children
            children.forEach((child) => {
                const matches = parseISO8601Time(child['value'])
                if (is(child, 'text') && matches) {
                    //console.log(child, parseISO8601Time(child['value']))
                    child['value'] = child['value'].replace(matches[0], 'Did this work?')
                }
            });
        })
    }
}
export function parseISO8601Time(stringValue){
    // hh:mm:ss[.sss][+-hh:mm]
    const pattern = /([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9])?(Z|([+-][0-9]{2}:[0-9]{2}))?)/
    const match = pattern.exec(stringValue)
    return match
}