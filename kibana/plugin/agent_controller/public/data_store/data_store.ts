import { Comparators } from "../comparators/comparators";
import { times } from "../utils/utils";

const ruleSet = [
  "Very long first name that will wrap or be truncated",
  "Another very long first name which will wrap or be truncated",
];

const ruleName = [
  "Very long first name that will wrap or be truncated",
  "Another very long first name which will wrap or be truncated",
  "Clinton",
  "Igor",
];

const createRules = () => {
  return times(10, (index) => {
    return {
      id: index,
      ruleName: index < 10 ? ruleName[index] : ruleName[index - 10],
      ruleSet: index < 10 ? ruleSet[index] : ruleSet[index - 10],
      status: 1
    };
  });
};

export const createDataStore = () => {
  const rules = createRules();

  return {
    rules,

    findRules: (pageIndex, pageSize, sortField, sortDirection) => {
      let items;

      if (sortField) {
        items = rules
          .slice(0)
          .sort(
            Comparators.property(sortField, Comparators.default(sortDirection))
          );
      } else {
        items = rules;
      }

      let pageOfItems;

      if (!pageIndex && !pageSize) {
        pageOfItems = items;
      } else {
        const startIndex = pageIndex * pageSize;
        pageOfItems = items.slice(
          startIndex,
          Math.min(startIndex + pageSize, items.length)
        );
      }

      return {
        pageOfItems,
        totalItemCount: items.length
      };
    },

    deleteRules: (...ids) => {
      ids.forEach((id) => {
        const index = rules.findIndex((rule) => rule.id === id);
        if (index >= 0) {
          rules.splice(index, 1);
        }
      });
    },

    // cloneRule: (id) => {
    //   const index = rules.findIndex((rule) => rule.id === id);
    //   if (index >= 0) {
    //     const rule = rules[index];
    //     rules.splice(index, 0, { ...rule, id: rules.length });
    //   }
    // }
  };
};
