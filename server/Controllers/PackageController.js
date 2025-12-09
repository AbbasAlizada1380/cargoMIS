// Try importing Customer first, then Package
import Customer from "../Models/Customer.js";
import Package from "../Models/package.js";
import { Op } from "sequelize";

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
