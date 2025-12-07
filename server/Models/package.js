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
    transitWay: DataTypes.STRING,
    OPerKgCash: DataTypes.FLOAT,
    OTotalCash: DataTypes.FLOAT,
    perKgCash: DataTypes.FLOAT,
    totalCash: DataTypes.FLOAT,
    remain: DataTypes.FLOAT,
    received: DataTypes.FLOAT,
    date:DataTypes.DATE,
    track_number:DataTypes.STRING,

    // --- FIXED packList ---
    packList: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "List of packages: each item contains {weight, description, qty}",
      get() {
        const raw = this.getDataValue("packList");
        return raw ? raw : [];
      },
      set(value) {
        // Ensure it's always an array
        if (Array.isArray(value)) {
          this.setDataValue("packList", value);
        } else if (typeof value === "object") {
          this.setDataValue("packList", [value]);
        } else {
          this.setDataValue("packList", []);
        }
      },
    },
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

export default Package;
