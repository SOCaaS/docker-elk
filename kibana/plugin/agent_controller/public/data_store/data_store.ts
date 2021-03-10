import { Comparators } from "../comparators/comparators";
import { times } from "../utils/utils";

// import { Comparators } from "../dependencies";
// import { times } from "../dependencies";
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

const createUsers = () => {
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
  const users = createUsers();

  return {
    users,

    findUsers: (pageIndex, pageSize, sortField, sortDirection) => {
      let items;

      if (sortField) {
        items = users
          .slice(0)
          .sort(
            Comparators.property(sortField, Comparators.default(sortDirection))
          );
      } else {
        items = users;
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

    deleteUsers: (...ids) => {
      ids.forEach((id) => {
        const index = users.findIndex((user) => user.id === id);
        if (index >= 0) {
          users.splice(index, 1);
        }
      });
    },

    cloneUser: (id) => {
      const index = users.findIndex((user) => user.id === id);
      if (index >= 0) {
        const user = users[index];
        users.splice(index, 0, { ...user, id: users.length });
      }
    }
  };
};
