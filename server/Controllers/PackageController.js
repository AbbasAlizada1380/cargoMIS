import Package from "../Models/package.js";

/**
 * Create a new package
 */
export const createPackage = async (req, res) => {
  try {
    const payload = req.body;

    // optional: compute totalCash if not provided
    if (
      (!payload.totalCash || payload.totalCash === "") &&
      payload.perKgCash &&
      payload.goodWeight
    ) {
      payload.totalCash = (
        parseFloat(payload.perKgCash) * parseFloat(payload.goodWeight)
      ).toFixed(2);
    }

    const pkg = await Package.create(payload);
    return res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    console.error("createPackage error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * Get all packages (with optional pagination)
 */
export const getPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // ✅ page from query
    const limit = parseInt(req.query.limit, 10) || 20; // default 20
    const offset = (page - 1) * limit;

    const { count, rows } = await Package.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      data: rows,
    });
  } catch (err) {
    console.error("getPackages error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};




/**
 * Get single package by id
 */
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg)
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    return res.json({ success: true, data: pkg });
  } catch (err) {
    console.error("getPackageById error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * Update package
 */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const pkg = await Package.findByPk(id);
    if (!pkg)
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });

    await pkg.update(payload);
    return res.json({ success: true, data: pkg });
  } catch (err) {
    console.error("updatePackage error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * Delete package
 */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg)
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });

    await pkg.destroy();
    return res.json({ success: true, message: "Package deleted" });
  } catch (err) {
    console.error("deletePackage error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
