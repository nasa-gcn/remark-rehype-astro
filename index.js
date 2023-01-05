/*!
 * Copyright © 2022 United States Government as represented by the Administrator
 * of the National Aeronautics and Space Administration. No copyright is claimed
 * in the United States under Title 17, U.S. Code. All Other Rights Reserved.
 *
 * SPDX-License-Identifier: NASA-1.3
 */

import { visit } from "unist-util-visit";

export default function plugin() {
  // transformer
  return (tree) => {
    visit(tree, "element", (node) => {
      const matches = parseISO8601Time(node.value);
      if (matches) {
        node = buildNewTree(node, matches);
      }
    });

    visit(tree, "text", (node) => {
      const matches = parseISO8601Time(node.value);
      if (matches) {
        node = buildNewTree(node, matches);
      }
    });
  };

  function buildNewTree(node, matches) {
    console.log(node);
    const childrenNodes = parseNewNodes(node, matches);
    const baseNode = {
      type: "element",
      tagName: "p",
      properties: {},
      children: childrenNodes,
      position: {
        start: {
          line: node.position.line,
          column: node.position.start.column,
          offset: node.position.start.column,
        },
        end: {
          line: node.position.line,
          column: node.position.end.column,
          offset: node.position.end.column,
        },
      },
    };
    console.log(baseNode);
    return baseNode;
  }

  function parseISO8601Time(stringValue) {
    // hh:mm:ss[.sss][+-hh:mm]
    const pattern =
      /([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9])?(Z|([+-][0-9]{2}:[0-9]{2}))?)/g;
    return pattern.exec(stringValue);
  }

  function parseNewNodes(baseNode, matches) {
    let startNode = JSON.parse(JSON.stringify(baseNode));
    startNode.value = startNode.value.substring(0, matches.index);
    startNode.position.end.column =
      startNode.position.start.column + startNode.value.length;
    startNode.position.end.offset =
      startNode.position.start.offset + startNode.value.length;

    let mainNode = {
      type: "element",
      tagName: "strong",
      properties: {},
      children: [
        {
          type: "text",
          value: matches[0],
          position: {
            start: {
              line: baseNode.position.start.line,
              column: startNode.position.end.column,
              offset: startNode.position.end.column,
            },
            end: {
              line: baseNode.position.end.line,
              column: startNode.position.end.column + matches[0].length,
              offset: startNode.position.end.column + matches[0].length,
            },
          },
        },
      ],
      position: {
        start: {
          line: baseNode.position.start.line,
          column: startNode.position.end.column,
          offset: startNode.position.end.column,
        },
        end: {
          line: baseNode.position.start.line,
          column: startNode.position.end.column + matches[0].length,
          offset: startNode.position.end.column + matches[0].length,
        },
      },
    };

    let endNode = JSON.parse(JSON.stringify(baseNode));
    const endNodeStartPosition = matches.index + matches[0].length;
    endNode.value = endNode.value.substring(
      endNodeStartPosition,
      endNode.value.length
    );
    endNode.position.start.column = endNodeStartPosition;
    endNode.position.start.offset = endNodeStartPosition;

    return [startNode, mainNode, endNode];
  }
}
