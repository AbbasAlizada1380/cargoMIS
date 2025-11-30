import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

const Customer = sequelize.define(
  "Customer",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "customers",
    timestamps: true,
  }
);

export default Customer;
