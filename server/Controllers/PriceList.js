// Controllers/priceListController.js
import PriceList from "../Models/PriceList.js";
import Zone from "../Models/Zone.js";
import TransitWay from "../Models/TransitWay.js";

export const createPriceList = async (req, res) => {
  try {
    const { zoneId, transitId } = req.body;

    // Validate foreign keys
    const zone = await Zone.findByPk(zoneId);
    if (!zone) return res.status(400).json({ message: "Invalid zoneId" });

    const transit = await TransitWay.findByPk(transitId);
    if (!transit) return res.status(400).json({ message: "Invalid transitId" });

    const priceList = await PriceList.create(req.body);
    res.status(201).json(priceList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPriceLists = async (req, res) => {
  try {
    const priceLists = await PriceList.findAll({
      include: [
        { model: Zone, attributes: ["name"] },
        { model: Transit, attributes: ["name"] },
      ],
    });
    res.json(priceLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPriceListById = async (req, res) => {
  try {
    const priceList = await PriceList.findByPk(req.params.id, {
      include: [
        { model: Zone, attributes: ["name"] },
        { model: Transit, attributes: ["name"] },
      ],
    });

    if (!priceList)
      return res.status(404).json({ message: "Price list not found" });

    res.json(priceList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePriceList = async (req, res) => {
  try {
    const priceList = await PriceList.findByPk(req.params.id);
    if (!priceList)
      return res.status(404).json({ message: "Price list not found" });

    await priceList.update(req.body);
    res.json(priceList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePriceList = async (req, res) => {
  try {
    const priceList = await PriceList.findByPk(req.params.id);
    if (!priceList)
      return res.status(404).json({ message: "Price list not found" });

    await priceList.destroy();
    res.json({ message: "Price list deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
