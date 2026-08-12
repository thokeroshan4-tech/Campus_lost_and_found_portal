import asyncHandler from "../utils/asyncHandler.js";
import Item from "../models/Item.js";
import Claim from "../models/Claim.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// @desc   Report a lost or found item
// @route  POST /api/items
// @access Private (verified users only)
const createItem = asyncHandler(async (req, res) => {
  const { type, title, description, category, location, date } = req.body;

  if (!type || !title || !category || !location || !date) {
    res.status(400);
    throw new Error("type, title, category, location, and date are required");
  }
  if (!["lost", "found"].includes(type)) {
    res.status(400);
    throw new Error("type must be 'lost' or 'found'");
  }

  let imageUrl = null;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "items");
    imageUrl = result.secure_url;
  }

  const item = await Item.create({
    type,
    title,
    description,
    category,
    location,
    date,
    imageUrl,
    reportedBy: req.user._id,
  });

  res.status(201).json(item);
});

// @desc   Browse/search items
// @route  GET /api/items?type=&category=&keyword=&status=&page=&limit=
// @access Private (verified users only)
const getItems = asyncHandler(async (req, res) => {
  const { type, category, keyword, status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) {
    filter.status = status;
  } else {
    filter.status = { $ne: "resolved" }; // resolved items drop off the default browse view
  }
  if (keyword) filter.$text = { $search: keyword };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Item.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("reportedBy", "name designation"),
    Item.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

// @desc   Get a single item's detail
// @route  GET /api/items/:id
// @access Private (verified users only)
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate(
    "reportedBy",
    "name designation"
  );
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }
  res.json(item);
});

// @desc   Get items reported by the logged-in user
// @route  GET /api/items/mine
// @access Private (verified users only)
const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ reportedBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(items);
});

// @desc   Edit an item (owner or admin only)
// @route  PATCH /api/items/:id
// @access Private
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const isOwner = item.reportedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this item");
  }

  const editableFields = ["title", "description", "category", "location", "date"];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) item[field] = req.body[field];
  });

  await item.save();
  res.json(item);
});

// @desc   Delete an item (owner or admin only)
// @route  DELETE /api/items/:id
// @access Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const isOwner = item.reportedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this item");
  }

  await Claim.deleteMany({ item: item._id });
  await item.deleteOne();
  res.json({ message: "Item deleted" });
});

// @desc   Manually mark an item as resolved — the final safety checkpoint,
//         only allowed once a claim on it has already been approved
// @route  PATCH /api/items/:id/resolve
// @access Private (owner or admin)
const resolveItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const isOwner = item.reportedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to resolve this item");
  }

  const approvedClaim = await Claim.findOne({
    item: item._id,
    status: "approved",
  });
  if (!approvedClaim) {
    res.status(400);
    throw new Error("This item cannot be resolved without an approved claim");
  }

  item.status = "resolved";
  await item.save();
  res.json(item);
});

export {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
  resolveItem,
};
