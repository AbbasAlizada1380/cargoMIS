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
} from "../Controllers/PackageController.js"

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
packageRouter.post("/", upload.single("image"), createPackage);
packageRouter.get("/", getPackages);
packageRouter.get("/:id", getPackageById);
packageRouter.put("/:id", upload.single("image"), updatePackage);
packageRouter.patch("/:id",  updatePackageLocationValidated);
packageRouter.delete("/:id", deletePackage);

export default packageRouter;
