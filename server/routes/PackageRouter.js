// routes/packageRoutes.js
import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../Controllers/PackageController.js";

const packageRouter = express.Router();

// =======================
// Package Routes
// =======================

// Create package + sender + receiver
packageRouter.post("/", createPackage);

// Get all packages
packageRouter.get("/", getAllPackages);

// Get package by ID
packageRouter.get("/:id", getPackageById);

// Update package (and optionally sender/receiver)
packageRouter.put("/:id", updatePackage);

// Delete package
packageRouter.delete("/:id", deletePackage);

export default packageRouter;
