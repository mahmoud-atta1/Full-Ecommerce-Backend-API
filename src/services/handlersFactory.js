const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc  Create one document
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

// @desc  Get all documents (supports filtering, pagination, search, sort)
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    // Check for nested route filter
    if (req.filterObj) {
      filter = req.filterObj;
    }

    // Get count for pagination
    const documentsCount = await Model.countDocuments(filter);

    // Build query using ApiFeatures
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });

// @desc  Get one document by id
exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    // Add population if options exist
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    // Execute query
    const document = await query;
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404),
      );
    }

    res.status(200).json({ data: document });
  });

// @desc  Update one document by id
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404),
      );
    }

    res.status(200).json({ data: document });
  });

// @desc  Delete one document by id
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404),
      );
    }

    res.status(204).send();
  });
