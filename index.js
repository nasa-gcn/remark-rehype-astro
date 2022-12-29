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
    visit(tree, "text", (node) => {
      const matches = parseISO8601Time(node.value);
      if (matches) {
        console.log(matches);
        node.value = node.value.replaceAll(
          matches[0],
          `<strong>${matches[0]}</strong>`
        );
      }
    });
  };

  function parseISO8601Time(stringValue) {
    // hh:mm:ss[.sss][+-hh:mm]
    const pattern =
      /([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9])?(Z|([+-][0-9]{2}:[0-9]{2}))?)/;
    return pattern.exec(stringValue);
  }
}
