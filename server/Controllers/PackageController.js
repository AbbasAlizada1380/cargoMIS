// controllers/packageController.js
import Package from "../Models/package.js";
import Customer from "../Models/Customer.js";

/* ============================================================
   CREATE PACKAGE + SENDER + RECEIVER
============================================================ */
export const createPackage = async (req, res) => {
  try {
    const { sender, receiver, packageData } = req.body;

    if (!sender || !receiver || !packageData) {
      return res.status(400).json({
        error: "sender, receiver and packageData are required",
      });
    }

    // 1️⃣ Create sender
    const newSender = await Customer.create(sender);

    // 2️⃣ Create receiver
    const newReceiver = await Customer.create(receiver);

    // 3️⃣ Create package
    const newPackage = await Package.create({
      sender: newSender.id,
      receiver: newReceiver.id,
      ...packageData,
    });

    return res.status(201).json({
      message: "Package, sender, and receiver created successfully",
      data: { sender: newSender, receiver: newReceiver, package: newPackage },
    });
  } catch (error) {
    console.error("Create Package Error:", error);
    return res.status(500).json({ error: "Failed to create package" });
  }
};

/* ============================================================
   GET ALL PACKAGES
============================================================ */
export const getAllPackages = async (req, res) => {
  try {
  const packages = await Package.findAll({
    include: [
      { model: Customer, as: "Sender" },
      { model: Customer, as: "Receiver" },
    ],
  });

    return res.status(200).json(packages);
  } catch (error) {
    console.error("Get All Packages Error:", error);
    return res.status(500).json({ error: "Failed to get packages" });
  }
};

/* ============================================================
   GET PACKAGE BY ID
============================================================ */
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findByPk(id, {
      include: [
        { model: Customer, as: "Sender" },
        { model: Customer, as: "Receiver" },
      ],
    });

    if (!pkg) return res.status(404).json({ error: "Package not found" });

    return res.status(200).json(pkg);
  } catch (error) {
    console.error("Get Package Error:", error);
    return res.status(500).json({ error: "Failed to get package" });
  }
};

/* ============================================================
   UPDATE PACKAGE + OPTIONAL SENDER/RECEIVER
============================================================ */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, receiver, packageData } = req.body;

    const pkg = await Package.findByPk(id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    // 1️⃣ Update sender if provided
    if (sender) {
      await Customer.update(sender, { where: { id: pkg.sender } });
    }

    // 2️⃣ Update receiver if provided
    if (receiver) {
      await Customer.update(receiver, { where: { id: pkg.receiver } });
    }

    // 3️⃣ Update package data
    if (packageData) {
      await pkg.update(packageData);
    }

    return res.status(200).json({ message: "Package updated successfully" });
  } catch (error) {
    console.error("Update Package Error:", error);
    return res.status(500).json({ error: "Failed to update package" });
  }
};

/* ============================================================
   DELETE PACKAGE + OPTIONAL CUSTOMERS
   (We usually DON'T delete sender/receiver because they may be reused)
============================================================ */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findByPk(id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    // Only delete package
    await pkg.destroy();

    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Delete Package Error:", error);
    return res.status(500).json({ error: "Failed to delete package" });
  }
};
