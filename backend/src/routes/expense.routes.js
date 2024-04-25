const { Router } = require("express");
const { authenticate, limitFreePlanOnCreateEntityForOrganization } = require("../middlewares/auth.middleware");
const {
  checkOrgAuthorization,
} = require("../middlewares/organization.middleware");
const {
  paginateModel,
  createModel,
  updateModel,
} = require("../middlewares/crud.middleware");
const {
  getAllExpenses,
  getAllExpenseCategories,
  getExpense,
  deleteExpense,
  updateExpense,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  createExpense,
  getExpenseCategory,
} = require("../controllers/expenses.controller");

const expenseRouter = Router({ mergeParams: true });

expenseRouter.get(
  "/",
  authenticate,
  checkOrgAuthorization,
  paginateModel,
  getAllExpenses
);

expenseRouter.post(
  "/",
  authenticate,
  createModel,
  checkOrgAuthorization,
  limitFreePlanOnCreateEntityForOrganization("expenses"),
  createExpense
);

expenseRouter.get(
  "/categories",
  authenticate,
  checkOrgAuthorization,
  getAllExpenseCategories
);

expenseRouter.post(
  "/categories",
  authenticate,
  checkOrgAuthorization,
  createModel,
  limitFreePlanOnCreateEntityForOrganization("expenseCategories"),
  createExpenseCategory
);

expenseRouter.patch(
  "/categories/:categoryId",
  authenticate,
  checkOrgAuthorization,
  updateModel,
  updateExpenseCategory
);

expenseRouter.get(
  "/categories/:categoryId",
  authenticate,
  checkOrgAuthorization,
  getExpenseCategory
);
expenseRouter.delete(
  "/categories/:categoryId",
  authenticate,
  checkOrgAuthorization,
  deleteExpenseCategory
);
expenseRouter.get(
  "/:expenseId",
  authenticate,
  checkOrgAuthorization,
  getExpense
);
expenseRouter.delete(
  "/:expenseId",
  authenticate,
  checkOrgAuthorization,
  deleteExpense
);
expenseRouter.patch(
  "/:expenseId",
  authenticate,
  checkOrgAuthorization,
  updateExpense
);

module.exports = expenseRouter;
