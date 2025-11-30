import Package from "./package.js";
import Customer from "./Customer.js";

// A package belongs to one sender and one receiver (both from Customer table)
Package.belongsTo(Customer, { as: "receiver", foreignKey: "receiverId" });
Package.belongsTo(Customer, { as: "sender", foreignKey: "senderId" });

// Optional: to get list of packages for a customer
Customer.hasMany(Package, { as: "receivedPackages", foreignKey: "receiverId" });
Customer.hasMany(Package, { as: "sentPackages", foreignKey: "senderId" });


db.Package.belongsTo(db.Customer, { as: "sender", foreignKey: "senderId" });
db.Package.belongsTo(db.Customer, { as: "receiver", foreignKey: "receiverId" });
