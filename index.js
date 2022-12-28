

import {visit} from 'unist-util-visit'
import {is} from 'unist-util-is'


// Plugin
export default function astroFlavor(){
    // transformer
    return (tree, file) => {
        // Check tree for a pattern:
       // console.log('This is a test')
        visit(tree, 'ParagraphNode', (node) => {
            console.log(node)
            const children = node.children

            children.forEach((child, index) => {
                if (is(children[index-1], 'SentenceNode') && 
                    is(child, 'WhiteSpaceNode') && 
                    is(children[index + 1], 'SentenceNode')
                    ) {
                    if(child.value.length !== 1){
                        file.message('Expected 1 space between sentences, not ' + child.value.length, child)
                    }
                }
            });
        })
    }
}