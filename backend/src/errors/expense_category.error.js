class ExpenseCategoryNotDeleted extends Error {
  constructor({ reason = "Expense category not deleted" }) {
    super();
    this.code = 400;
    this.message = reason;
    this.name = "ExpenseCategoryNotDeleted";
  }
}

module.exports = { ExpenseCategoryNotDeleted };
