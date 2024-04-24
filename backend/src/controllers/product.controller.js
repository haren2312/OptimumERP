const requestAsyncHandler = require("../handlers/requestAsync.handler");
const { createProductDto, updateProductDto } = require("../dto/product.dto");
const Product = require("../models/product.model");
const { OrgNotFound } = require("../errors/org.error");
const { ProductNotFound } = require("../errors/product.error");
const OrgModel = require("../models/org.model");
exports.createProduct = requestAsyncHandler(async (req, res) => {
  const body = await createProductDto.validateAsync(req.body);
  const orgId = req.params.orgId;
  if (!orgId) throw new OrgNotFound();
  const product = new Product({ org: orgId, ...body });
  const newProduct = await product.save();
  await OrgModel.updateOne(
    { _id: req.params.orgId },
    { $inc: { "relatedDocsCount.products": 1 } }
  );
  return res
    .status(201)
    .json({ data: newProduct, message: "New product created !" });
});

exports.getAllProducts = requestAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {
    org: req.params.orgId,
  };
  const search = req.query.search;
  const category = req.query.category;
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("category")
    .exec();

  const totalCount = await Product.countDocuments(filter).exec();
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json({
    data: products,
    page,
    limit,
    totalCount,
    totalPages,
    message: "Products retrieved successfully!",
  });
});

exports.getProduct = requestAsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  if (!productId) throw new ProductNotFound();
  const orgId = req.params.orgId;
  if (!orgId) throw new OrgNotFound();
  const product = await Product.findOne({
    org: orgId,
    _id: productId,
  });
  if (!product) throw new ProductNotFound();
  return res
    .status(200)
    .json({ data: product, message: "Product retrieved successfully!" });
});

exports.updateProduct = requestAsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const orgId = req.params.orgId;
  if (!productId) throw new ProductNotFound();
  if (!orgId) throw new OrgNotFound();
  const body = await updateProductDto.validateAsync(req.body);
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, org: orgId },
    body,
    {
      new: true,
    }
  ).exec();
  if (!updatedProduct) throw new ProductNotFound();
  return res
    .status(200)
    .json({ data: updatedProduct, message: "Product updated successfully!" });
});

exports.deleteProduct = requestAsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const orgId = req.params.orgId;
  if (!productId) throw new ProductNotFound();
  if (!orgId) throw new OrgNotFound();
  const deletedProduct = await Product.findOneAndDelete({
    _id: productId,
    org: req.params.orgId,
  }).exec();

  if (!deletedProduct) throw new ProductNotFound();
  await OrgModel.updateOne(
    { _id: req.params.orgId },
    { $inc: { "relatedDocsCount.products": -1 } }
  );
  return res.status(200).json({ message: "Product deleted successfully!" });
});

exports.addManyProducts = requestAsyncHandler(async (req, res) => {
  const body = req.body;
  const orgId = req.params.orgId;
  if (!orgId) throw new OrgNotFound();
  const productsToAdd = body.map((product) => ({
    ...product,
    createdBy: req.session.user._id,
    org: orgId,
  }));
  await Product.insertMany(productsToAdd);
  return res.status(200).json({
    message: "Products saved successfully",
    productsCreated: body.length,
  });
});
