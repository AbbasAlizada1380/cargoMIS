import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import Customer from "./Customer.js";

const Package = sequelize.define(
  "Package",
  {
    receiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalWeight: DataTypes.FLOAT,
    piece: DataTypes.INTEGER,
    value: DataTypes.FLOAT,
    transitWay:DataTypes.STRING,
    OPerKgCash: DataTypes.FLOAT,
    OTotalCash: DataTypes.FLOAT,
    perKgCash: DataTypes.FLOAT,
    totalCash: DataTypes.FLOAT,
    remain: DataTypes.FLOAT,
    received: DataTypes.FLOAT,
  },
  {
    tableName: "packages",
    timestamps: true,
  }
);

// ---- ASSOCIATIONS ----
Package.belongsTo(Customer, {
  as: "Sender",
  foreignKey: "sender",
  targetKey: "id",
});

Package.belongsTo(Customer, {
  as: "Receiver",
  foreignKey: "receiver",
  targetKey: "id",
});
export default Package