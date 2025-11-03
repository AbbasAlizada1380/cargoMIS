import Package from "../Models/package.js";
import nodemailer from "nodemailer";

/**
 * Create a new package
 */

export const createPackage = async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);

    // Auto calculate totalCash if not provided
    if (
      (!payload.totalCash || payload.totalCash === "") &&
      payload.perKgCash &&
      payload.goodWeight
    ) {
      payload.totalCash = (
        parseFloat(payload.perKgCash) * parseFloat(payload.goodWeight)
      ).toFixed(2);
    }

    // Create package record
    const pkg = await Package.create(payload);

    // ✅ Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or smtp.yourdomain.com if custom domain
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // ✅ Email message content (HTML for nice styling)

    const emailBody = `
  <div style="font-family:'Vazirmatn',sans-serif;line-height:1.6;color:#333">
    <h2 style="color:#0d9488">تمدن کارگو</h2>
    <p>بسته شما توسط تیم <strong>Afghan Cargo</strong> ثبت گردید.</p>
    <p>شما به زودی از موقعیت بسته تان آگاه خواهید شد.</p>
    <hr />
    <h3>جزئیات بسته</h3>
    <p><strong>کد بسته:</strong> ${pkg.id}</p>
    <p><strong>نام فرستنده:</strong> ${pkg.senderName}</p>
    <p><strong>شماره تماس فرستنده:</strong> ${pkg.senderPhone}</p>
    <p><strong>نام گیرنده:</strong> ${pkg.receiverName}</p>
    <p><strong>شماره تماس گیرنده:</strong> ${pkg.receiverPhone}</p>
    
        <p><strong>موقعیت:</strong> ${pkg.location}</p>
    <p><strong>وزن:</strong> ${pkg.goodWeight} کیلوگرام</p>
    <p><strong>تعداد:</strong> ${pkg.piece}</p>
    <p><strong>قیمت هر کیلو:</strong> ${pkg.perKgCash} افغانی</p>
    <p><strong>مجموع:</strong> ${pkg.totalCash} افغانی</p>
    <p><strong>باقیمانده:</strong> ${pkg.remain} افغانی</p>
    <p><strong>دریافتی:</strong> ${pkg.totalCash - pkg.remain} افغانی</p>
    <br/>
    <p style="font-size:13px;color:#666">
      از اعتماد شما به تمدن کارگو سپاس‌گزاریم.
    </p>
  </div>
`;

    // ✅ Send email to both sender & receiver
    const recipients = [pkg.senderEmail, pkg.receiverEmail].filter(Boolean); // ignore empty ones
    if (recipients.length > 0) {
      await transporter.sendMail({
        from: `"Afghan Cargo Team" <${process.env.EMAIL_USER}>`,
        to: recipients,
        subject: "بسته شما توسط تیم افغان کارگو ثبت شد ✅",
        html: emailBody,
      });
    }

    return res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    console.error("createPackage error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
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
      order: [["id", "DESC"]],
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
// Optional: Predefined common locations
const COMMON_LOCATIONS = [
  "cargo stock in kabul",
  "in transit",
  "at sorting facility",
  "out for delivery",
  "delivered",
  "returned to sender",
  "held at customs",
  "lost in transit",
];

/**
 * Update package location with validation
 */
export const updatePackageLocationValidated = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, customLocation } = req.body;
    console.log(location);

    // Validate input
    if (!location && !customLocation) {
      return res.status(400).json({
        success: false,
        message: "Either location or customLocation is required",
      });
    }

    const finalLocation = customLocation || location;

    // Optional: Validate against common locations
    if (location && !COMMON_LOCATIONS.includes(location) && !customLocation) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid location. Use customLocation for non-standard locations.",
        validLocations: COMMON_LOCATIONS,
      });
    }

    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    const oldLocation = pkg.location;
    await pkg.update({ location: finalLocation });

    return res.status(200).json({
      success: true,
      message: "Package location updated successfully",
      data: {
        packageId: pkg.id,
        receiverName: pkg.receiverName,
        oldLocation,
        newLocation: finalLocation,
        updatedAt: pkg.updatedAt,
      },
    });
  } catch (err) {
    console.error("updatePackageLocationValidated error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating package location",
      error: err.message,
    });
  }
};
