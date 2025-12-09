// Try importing Customer first, then Package
import Customer from "../Models/Customer.js";
import Package from "../Models/package.js";
import { Op } from "sequelize";
import nodemailer from "nodemailer";

export const searchPackagesByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Search query 'name' is required",
        message: "Please provide a name to search for",
      });
    }

    const searchTerm = name.trim();
    console.log(`Searching for: ${searchTerm}`);

    // Search packages with sender OR receiver name matching (case-insensitive)
    const packages = await Package.findAll({
      include: [
        {
          association: "Sender",
          attributes: ["id", "name", "phoneNumber", "country"],
          required: false, // Always include sender if exists
        },
        {
          association: "Receiver", 
          attributes: ["id", "name", "phoneNumber", "country"],
          required: false, // Always include receiver if exists
        },
      ],
      order: [["createdAt", "DESC"]], // Show newest first
    });

    // Filter packages where EITHER sender OR receiver name matches (case-insensitive)
    const filteredPackages = packages.filter(pkg => {
      // Check if package has sender and sender name matches
      const senderMatch = pkg.Sender && 
        pkg.Sender.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if package has receiver and receiver name matches
      const receiverMatch = pkg.Receiver && 
        pkg.Receiver.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Include package if either sender OR receiver matches
      return senderMatch || receiverMatch;
    });

    // If no matches found, suggest similar names
    if (filteredPackages.length === 0) {
      // Collect all unique sender and receiver names for suggestions
      const allNames = new Set();
      packages.forEach(pkg => {
        if (pkg.Sender) allNames.add(pkg.Sender.name);
        if (pkg.Receiver) allNames.add(pkg.Receiver.name);
      });

      // Find similar names (partial matches)
      const suggestions = Array.from(allNames).filter(fullName => 
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(fullName.toLowerCase().substring(0, 3))
      ).slice(0, 5); // Limit to 5 suggestions

      return res.status(200).json({
        success: true,
        message: `No packages found matching '${searchTerm}'`,
        totalRecords: 0,
        data: [],
        suggestions: suggestions.length > 0 ? suggestions : null,
        searchTerm: searchTerm,
      });
    }

    // Enhance results with match type information
    const enhancedPackages = filteredPackages.map(pkg => {
      const senderMatch = pkg.Sender && 
        pkg.Sender.name.toLowerCase().includes(searchTerm.toLowerCase());
      const receiverMatch = pkg.Receiver && 
        pkg.Receiver.name.toLowerCase().includes(searchTerm.toLowerCase());

      return {
        ...pkg.toJSON(),
        matchInfo: {
          matchesSender: senderMatch,
          matchesReceiver: receiverMatch,
          matchType: senderMatch && receiverMatch ? "both" : 
                    senderMatch ? "sender" : "receiver",
          highlightedName: searchTerm
        }
      };
    });

    // Count matches by type
    const senderMatches = enhancedPackages.filter(p => p.matchInfo.matchesSender).length;
    const receiverMatches = enhancedPackages.filter(p => p.matchInfo.matchesReceiver).length;
    const bothMatches = enhancedPackages.filter(p => p.matchInfo.matchType === "both").length;

    return res.status(200).json({
      success: true,
      message: `Found ${filteredPackages.length} package(s) matching '${searchTerm}'`,
      totalRecords: filteredPackages.length,
      searchTerm: searchTerm,
      matchStats: {
        senderMatches,
        receiverMatches,
        bothMatches,
        uniquePackages: filteredPackages.length
      },
      data: enhancedPackages,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Search Packages Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to search packages",
      message: "An internal server error occurred",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

export const getPackagesByRange = async (req, res) => {
  try {
    const { startDate, endDate, transitWay } = req.query;

    if (!startDate || !endDate || !transitWay) {
      return res.status(400).json({
        error: "Missing required query parameters: startDate, endDate, transitWay",
      });
    }

    // You can also try a simpler query first to debug
    const packages = await Package.findAll({
      where: {
        transitWay,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      include: [
        {
          association: "Sender", // Use association name instead of model
          attributes: ["id", "name", "phoneNumber", "country"]
        },
        {
          association: "Receiver", // Use association name instead of model
          attributes: ["id", "name", "phoneNumber", "country"]
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      message: "Successfully retrieved filtered packages",
      totalRecords: packages.length,
      data: packages,
    });

  } catch (error) {
    console.error("Get Packages By Range Error:", error);
    return res.status(500).json({
      error: "Failed to retrieve packages",
      details: error.message
    });
  }
};

export const updatePackageLocation = async (req, res) => {
  try {
    const { id } = req.params; // Can be single or multiple IDs "1,2,4"
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({
        error: "location field is required",
      });
    }

    // Split IDs by comma and convert to numbers
    const ids = id.split(",").map(i => parseInt(i)).filter(i => !isNaN(i));

    if (ids.length === 0) {
      return res.status(400).json({
        error: "No valid package IDs provided",
      });
    }

    // Update all packages matching these IDs
    const [updatedCount, updatedPackages] = await Package.update(
      { location },
      {
        where: { id: ids },
        returning: true, // return updated rows (Postgres) 
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        error: "No packages found for the provided IDs",
      });
    }

    return res.status(200).json({
      message: `Successfully updated location for ${updatedCount} package(s)`,
      data: updatedPackages, // may be empty for some DBs
    });

  } catch (error) {
    console.error("Update Package Location Error:", error);
    return res.status(500).json({
      error: "Failed to update package location",
      details: error.message,
    });
  }
};


export const getAllTransitWays = async (req, res) => {
  try {
    // Fetch only transitWay column
    const packages = await Package.findAll({
      attributes: ["transitWay"],
    });

    // Extract values & filter unique ones
    const allTransitWays = packages.map((p) => p.transitWay);
    const uniqueTransitWays = [...new Set(allTransitWays)];

    return res.status(200).json({
      message: "Successfully retrieved all transit ways",
      data: uniqueTransitWays,
    });
  } catch (error) {
    console.error("Get All Transit Ways Error:", error);
    return res.status(500).json({ error: "Failed to retrieve transit ways" });
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

// Email configuration - set these in your environment variables or here
const EMAIL_CONFIG = {
  service: 'gmail', // or use your email service
  auth: {
    user: process.env.EMAIL || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// Recipient email for notifications
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'admin@example.com';

// Create email transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Helper function to send email notifications
const sendPackageNotification = async (subject, message, packageData = null) => {
  try {
    const htmlContent = packageData ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          ${subject}
        </h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="font-size: 16px; color: #555;">${message}</p>
          
          ${packageData ? `
          <div style="margin-top: 20px;">
            <h3 style="color: #444;">Package Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Package ID:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${packageData.id || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Sender:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${packageData.Sender?.name || 'N/A'}<br>
                  <small>Phone: ${packageData.Sender?.phoneNumber || 'N/A'}</small><br>
                  <small>Country: ${packageData.Sender?.country || 'N/A'}</small>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Receiver:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${packageData.Receiver?.name || 'N/A'}<br>
                  <small>Phone: ${packageData.Receiver?.phoneNumber || 'N/A'}</small><br>
                  <small>Country: ${packageData.Receiver?.country || 'N/A'}</small>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Weight:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${packageData.totalWeight || 0} kg</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Pieces:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${packageData.piece || 0}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Value:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${packageData.value || 0}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Transit Way:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${packageData.transitWay || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Cash:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${packageData.totalCash || 0}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Status:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${packageData.location || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Tracking #:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${packageData.track_number || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${new Date(packageData.date || packageData.createdAt).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          ` : ''}
        </div>
        <p style="color: #777; font-size: 12px; margin-top: 30px;">
          This is an automated notification from Package Management System.
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #333;">${subject}</h2>
        <p>${message}</p>
      </div>
    `;

    const mailOptions = {
      from: `"Package Management System" <${EMAIL_CONFIG.auth.user}>`,
      to: NOTIFICATION_EMAIL,
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent: ${subject}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw the error to avoid breaking the main operation
    // Just log it and continue
  }
};
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
      location: "Kabul Stock",
      ...packageData,
    });

    // Send email notification with complete data
    await sendPackageNotification(
      "📦 New Package Created Successfully",
      `A new package has been created in the system.`,
      {
        id: newPackage.id,
        Sender: newSender, // Complete sender object
        Receiver: newReceiver, // Complete receiver object
        ...newPackage.toJSON() // All package data
      }
    );

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
   UPDATE PACKAGE + OPTIONAL SENDER/RECEIVER
============================================================ */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, receiver, packageData } = req.body;

    const pkg = await Package.findByPk(id, {
      include: [
        { model: Customer, as: "Sender" },
        { model: Customer, as: "Receiver" },
      ],
    });
    
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    // Store old data for comparison
    const oldPackageData = {
      totalWeight: pkg.totalWeight,
      transitWay: pkg.transitWay,
      totalCash: pkg.totalCash,
      location: pkg.location,
      senderName: pkg.Sender?.name,
      receiverName: pkg.Receiver?.name
    };

    // 1️⃣ Update sender if provided
    if (sender && pkg.Sender) {
      await Customer.update(sender, { where: { id: pkg.sender } });
    }

    // 2️⃣ Update receiver if provided
    if (receiver && pkg.Receiver) {
      await Customer.update(receiver, { where: { id: pkg.receiver } });
    }

    // 3️⃣ Update package data
    if (packageData) {
      await pkg.update(packageData);
    }

    // Refresh to get updated data
    await pkg.reload({
      include: [
        { model: Customer, as: "Sender" },
        { model: Customer, as: "Receiver" },
      ],
    });

    // Send email notification
    const changes = [];
    if (packageData?.totalWeight !== undefined && packageData.totalWeight !== oldPackageData.totalWeight) {
      changes.push(`Weight: ${oldPackageData.totalWeight} → ${packageData.totalWeight} kg`);
    }
    if (packageData?.transitWay && packageData.transitWay !== oldPackageData.transitWay) {
      changes.push(`Transit: ${oldPackageData.transitWay} → ${packageData.transitWay}`);
    }
    if (packageData?.totalCash !== undefined && packageData.totalCash !== oldPackageData.totalCash) {
      changes.push(`Total: $${oldPackageData.totalCash} → $${packageData.totalCash}`);
    }
    if (packageData?.location && packageData.location !== oldPackageData.location) {
      changes.push(`Location: ${oldPackageData.location} → ${packageData.location}`);
    }

    const changeMessage = changes.length > 0 
      ? `Changes made: ${changes.join(', ')}`
      : 'Package details updated';

    await sendPackageNotification(
      "✏️ Package Updated Successfully",
      `${changeMessage}`,
      {
        id: pkg.id,
        Sender: pkg.Sender, // Complete sender object
        Receiver: pkg.Receiver, // Complete receiver object
        ...pkg.toJSON()
      }
    );

    return res.status(200).json({ 
      message: "Package updated successfully",
      data: pkg
    });
  } catch (error) {
    console.error("Update Package Error:", error);
    return res.status(500).json({ error: "Failed to update package" });
  }
};

/* ============================================================
   DELETE PACKAGE + OPTIONAL CUSTOMERS
============================================================ */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findByPk(id, {
      include: [
        { model: Customer, as: "Sender" },
        { model: Customer, as: "Receiver" },
      ],
    });
    
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    // Store data for notification before deletion
    const packageInfo = {
      id: pkg.id,
      Sender: pkg.Sender, // Complete sender object
      Receiver: pkg.Receiver, // Complete receiver object
      ...pkg.toJSON()
    };

    // Only delete package
    await pkg.destroy();

    // Send email notification
    await sendPackageNotification(
      "🗑️ Package Deleted Successfully",
      `Package #${packageInfo.id} has been deleted from the system.<br>
       Deletion Time: ${new Date().toLocaleString()}`,
      packageInfo
    );

    return res.status(200).json({ 
      message: "Package deleted successfully",
      deletedPackage: packageInfo
    });
  } catch (error) {
    console.error("Delete Package Error:", error);
    return res.status(500).json({ error: "Failed to delete package" });
  }
};


