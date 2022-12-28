/*!
 * Copyright © 2022 United States Government as represented by the Administrator
 * of the National Aeronautics and Space Administration. No copyright is claimed
 * in the United States under Title 17, U.S. Code. All Other Rights Reserved.
 *
 * SPDX-License-Identifier: NASA-1.3
 */

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
                    child['value'] = child['value'].replace(matches[0], `<strong>${matches[0]}</strong>`)
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