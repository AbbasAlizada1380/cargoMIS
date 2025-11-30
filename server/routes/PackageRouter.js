// routes/packageRoutes.js

import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../Controllers/PackageController.js";

const PackageRouter = express.Router();

// Create sender + receiver + package
PackageRouter.post("/", createPackage);

// Get all packages with sender & receiver details
PackageRouter.get("/", getAllPackages);

// Get single package by ID
PackageRouter.get("/:id", getPackageById);

// Update package only (NOT sender/receiver)
PackageRouter.put("/:id", updatePackage);

// Delete package
PackageRouter.delete("/:id", deletePackage);

export default PackageRouter;
