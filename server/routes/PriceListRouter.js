import express from "express";
import {
  createPriceList,
  getAllPriceLists,
  getPriceList,
  updatePriceList,
  deletePriceList,
} from "../Controllers/PriceList.js";

const PriceListRouter = express.Router();

PriceListRouter.post("/", createPriceList);
PriceListRouter.get("/", getAllPriceLists);
PriceListRouter.get("/:id", getPriceList);
PriceListRouter.put("/:id", updatePriceList);
PriceListRouter.delete("/:id", deletePriceList);

export default PriceListRouter;
