// controllers/packageController.js



// ===================== CREATE =====================
export const createPackage = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { sender, receiver, package: packageData } = req.body;

    if (!sender || !receiver || !packageData) {
      return res.status(400).json({
        success: false,
        message: "Sender, receiver, and package data are required",
      });
    }

    // 1️⃣ Create Sender
    const senderRecord = await Customer.create(sender, { transaction: t });

    // 2️⃣ Create Receiver
    const receiverRecord = await Customer.create(receiver, { transaction: t });

    // 3️⃣ Create Package using senderId & receiverId
    const newPackage = await Package.create(
      {
        ...packageData,
        senderId: senderRecord.id,
        receiverId: receiverRecord.id,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage,
    });
  } catch (error) {
    await t.rollback();
    console.error("Create Package Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== GET ALL =====================
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: [
        { model: Customer, as: "sender" },
        { model: Customer, as: "receiver" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data: packages });
  } catch (error) {
    console.error("Fetch Packages Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== GET BY ID =====================
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const packageItem = await Package.findByPk(id, {
      include: [
        { model: Customer, as: "sender" },
        { model: Customer, as: "receiver" },
      ],
    });

    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    return res.status(200).json({ success: true, data: packageItem });
  } catch (error) {
    console.error("Get Package Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== UPDATE =====================
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const packageItem = await Package.findByPk(id);

    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    await packageItem.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: packageItem,
    });
  } catch (error) {
    console.error("Update Package Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== DELETE =====================
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const packageItem = await Package.findByPk(id);

    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    await packageItem.destroy();

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Delete Package Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
