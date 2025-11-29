// controllers/priceListController.js

import PriceList from "../Models/PriceList.js"
import Zone from "../Models/Zone.js";
import TransitWay from "../Models/TransitWay.js";

/**
 * Create Price List
 */
export const createPriceList = async (req, res) => {
  try {
    const { zoneId, range, price, transitId } = req.body;

    if (!zoneId || !price || !range || !transitId) {
      return res.status(400).json({ message: "تمام فیلدها ضروری هستند." });
    }

    const newRecord = await PriceList.create({
      zoneId,
      range,
      price,
      transitId,
    });

    res.status(201).json({
      message: "قیمت‌لیست موفقانه ایجاد شد.",
      data: newRecord,
    });
  } catch (error) {
    console.error("Create PriceList error:", error);
    res.status(500).json({ message: "خطا در ایجاد قیمت‌لیست" });
  }
};

/**
 * Get All Price Lists
 */
export const getAllPriceLists = async (req, res) => {
  try {
    const lists = await PriceList.findAll({
      include: [
        { model: Zone, attributes: ["id", "name"] },
        { model: TransitWay, attributes: ["id", "name"] },
      ],
      order: [["id", "DESC"]],
    });

    res.json(lists);
  } catch (error) {
    console.error("Get All PriceList error:", error);
    res.status(500).json({ message: "خطا در دریافت قیمت‌لیست‌ها" });
  }
};

/**
 * Get Single Price List
 */
export const getPriceList = async (req, res) => {
  try {
    const id = req.params.id;

    const list = await PriceList.findByPk(id, {
      include: [
        { model: Zone, attributes: ["id", "name"] },
        { model: TransitWay, attributes: ["id", "name"] },
      ],
    });

    if (!list) {
      return res.status(404).json({ message: "قیمت‌لیست یافت نشد." });
    }

    res.json(list);
  } catch (error) {
    console.error("Get Single PriceList error:", error);
    res.status(500).json({ message: "خطا در دریافت قیمت‌لیست" });
  }
};

/**
 * Update Price List
 */
export const updatePriceList = async (req, res) => {
  try {
    const id = req.params.id;
    const { zoneId, range, price, transitId } = req.body;

    const list = await PriceList.findByPk(id);
    if (!list) {
      return res.status(404).json({ message: "قیمت‌لیست یافت نشد." });
    }

    await list.update({
      zoneId: zoneId ?? list.zoneId,
      range: range ?? list.range,
      price: price ?? list.price,
      transitId: transitId ?? list.transitId,
    });

    res.json({
      message: "قیمت‌لیست با موفقیت آپدیت شد.",
      data: list,
    });
  } catch (error) {
    console.error("Update PriceList error:", error);
    res.status(500).json({ message: "خطا در آپدیت قیمت‌لیست" });
  }
};

/**
 * Delete Price List
 */
export const deletePriceList = async (req, res) => {
  try {
    const id = req.params.id;

    const list = await PriceList.findByPk(id);
    if (!list) {
      return res.status(404).json({ message: "قیمت‌لیست یافت نشد." });
    }

    await list.destroy();

    res.json({ message: "قیمت‌لیست با موفقیت حذف شد." });
  } catch (error) {
    console.error("Delete PriceList error:", error);
    res.status(500).json({ message: "خطا در حذف قیمت‌لیست" });
  }
};
