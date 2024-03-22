const requestAsyncHandler = require("../handlers/requestAsync.handler");
const ProductCategory = require("../models/product_category.model");

exports.createProductCategory = requestAsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const newProductCategory = new ProductCategory({
    name,
    description,
    org: req.params.orgId,
  });
  await newProductCategory.save();
  return res.status(201).json({ data: newProductCategory });
});

exports.getAllProductCategories = requestAsyncHandler(async (req, res) => {
  const filter = {
    org: req.params.orgId,
  };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  if (search) filter.$text = { $search: search };
  const totalDocuments = await ProductCategory.countDocuments(filter);
  const productCategories = await ProductCategory.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalDocuments / limit);

  return res.status(200).json({
    data: productCategories,
    currentPage: page,
    limit,
    totalPages,
    totalCount: totalDocuments,
  });
});

exports.getProductCategoryById = requestAsyncHandler(async (req, res) => {
  const productCategory = await ProductCategory.findOne({
    _id: req.params.id,
    org: req.params.orgId,
  });
  if (!productCategory)
    return res.status(404).json({ message: "Product category not found" });
  return res.status(200).json(productCategory);
});

exports.updateProductCategory = requestAsyncHandler(async (req, res) => {
  const updatedProductCategory = await ProductCategory.findOneAndUpdate(
    {
      _id: req.params.id,
      org: req.params.orgId,
    },
    req.body,
    { new: true }
  );
  if (!updatedProductCategory) {
    return res.status(404).json({ message: "Product category not found" });
  }
  return res.status(200).json(updatedProductCategory);
});

exports.deleteProductCategory = requestAsyncHandler(async (req, res) => {
  const deletedProductCategory = await ProductCategory.findOneAndDelete({
    _id: req.params.id,
    org: req.params.orgId,
  });
  if (!deletedProductCategory) {
    return res.status(404).json({ message: "Product category not found" });
  }
  return res
    .status(200)
    .json({ message: "Product category deleted successfully" });
});
