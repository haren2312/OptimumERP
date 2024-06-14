const { Router } = require("express");
const {
  limitFreePlanOnCreateEntityForOrganization,
} = require("../middlewares/auth.middleware");
const { createModel, updateModel } = require("../middlewares/crud.middleware");

const {
  createPurchase,
  getPurchase,
  deletePurchase,
  getPurchases,
  updatePurchase,
  viewPurchaseBill,
  downloadPurchaseInvoice,
  payoutPurchase,
} = require("../controllers/purchase.controller");

const purchaseRouter = Router({
  mergeParams: true,
});

purchaseRouter.post(
  "/",
  createModel,
  limitFreePlanOnCreateEntityForOrganization("purchases"),
  createPurchase
);
purchaseRouter.get("/:purchaseId", getPurchase);
purchaseRouter.delete("/:purchaseId", deletePurchase);
purchaseRouter.get("/", getPurchases);

purchaseRouter.patch("/:purchaseId", updateModel, updatePurchase);
purchaseRouter.get("/:purchaseId/view", viewPurchaseBill);
purchaseRouter.get("/:purchaseId/download", downloadPurchaseInvoice);
purchaseRouter.post("/:purchaseId/payment", payoutPurchase);
module.exports = purchaseRouter;
