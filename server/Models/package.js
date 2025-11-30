// models/package.js
import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import Customer from "./Customer.js";
// models/Package.js

export default (sequelize) => {
  const Package = sequelize.define(
    "Package",
    {
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Customers", // customer table name
          key: "id",
        },
      },

      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Customers",
          key: "id",
        },
      },

      totalWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      piece: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      value: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      oPerKgCash: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      oTotalCash: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      perKgCash: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      totalCash: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      remainder: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      received: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "packages",
      timestamps: true,
    }
  );

  return Package;
};

