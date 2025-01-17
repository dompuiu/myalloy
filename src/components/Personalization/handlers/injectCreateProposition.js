/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import PAGE_WIDE_SCOPE from "../../../constants/pageWideScope";

export default ({ preprocess, isPageWideSurface }) => {
  const createItem = (item, meta) => {
    const { schema, data, characteristics: { trackingLabel } = {} } = item;

    const processedData = preprocess(data);

    if (trackingLabel) {
      meta.trackingLabel = trackingLabel;
    }

    return {
      getSchema() {
        return schema;
      },
      getData() {
        return processedData;
      },
      getMeta() {
        return meta;
      },
      getOriginalItem() {
        return item;
      },
      toString() {
        return JSON.stringify(item);
      },
      toJSON() {
        return item;
      }
    };
  };

  return (payload, visibleInReturnedItems = true) => {
    const { id, scope, scopeDetails, items = [] } = payload;
    const { characteristics: { scopeType } = {} } = scopeDetails || {};

    return {
      getScope() {
        if (!scope) {
          return scope;
        }
        return scope;
      },
      getScopeType() {
        if (scope === PAGE_WIDE_SCOPE || isPageWideSurface(scope)) {
          return "page";
        }
        if (scopeType === "view") {
          return "view";
        }
        return "proposition";
      },
      getItems() {
        return items.map(item => createItem(item, { id, scope, scopeDetails }));
      },
      getNotification() {
        return { id, scope, scopeDetails };
      },
      toJSON() {
        return payload;
      },
      addToReturnValues(
        propositions,
        decisions,
        includedItems,
        renderAttempted
      ) {
        if (visibleInReturnedItems) {
          propositions.push({
            ...payload,
            items: includedItems.map(i => i.getOriginalItem()),
            renderAttempted
          });
          if (!renderAttempted) {
            decisions.push({
              ...payload,
              items: includedItems.map(i => i.getOriginalItem())
            });
          }
        }
      }
    };
  };
};
