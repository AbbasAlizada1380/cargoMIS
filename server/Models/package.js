// models/package.js
import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js"; // adjust path to your sequelize instance

const Package = sequelize.define(
  "Package",
  {
    // primary key 'id' will be created automatically by Sequelize unless you override
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    receiverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    receiverEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    senderEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },

    goodsDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    goodWeight: {
      type: DataTypes.DECIMAL(10, 2), // kg
      allowNull: true,
    },

    piece: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    goodsValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    perKgCash: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    recip: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    remain: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
    },

    totalCash: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
  },
  {
    tableName: "packages",
    timestamps: true,
  }
);

export default Package;
