import express from "express";
import multer from "multer";
import path from "path";
import {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  updatePackageLocationValidated,
  getPackagesByDateRange,
  searchPackages,
} from "../Controllers/PackageController.js";
import { authenticate } from "../middleware/auth.js";
const packageRouter = express.Router();
// Multer setup for optional package image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/packages"); // directory for storing package images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
packageRouter.get("/search", searchPackages);
packageRouter.get("/Range", getPackagesByDateRange);
packageRouter.post("/", createPackage);
packageRouter.get("/", authenticate, getPackages);
packageRouter.get("/:id", getPackageById);
packageRouter.put("/:id", upload.single("image"), updatePackage);
packageRouter.patch("/:id", updatePackageLocationValidated);
packageRouter.delete("/:id", deletePackage);

export default packageRouter;
