// components/PackageCrud.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PackageCrud = () => {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    // Sender fields
    senderName: "",
    senderAddress: "",
    senderEmail: "",
    senderPhoneNumber: "",
    senderCountry: "",
    // Receiver fields
    receiverName: "",
    receiverAddress: "",
    receiverEmail: "",
    receiverPhoneNumber: "",
    receiverCountry: "",
    // Package fields
    totalWeight: 0,
    piece: 0,
    value: 0,
    perKgCash: 0,
    OPerKgCash: 0,
    OTotalCash: 0,
    transitWay:"",
    totalCash: 0,
    remain: 0,
    received: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/packages`);
      setPackages(res.data);
    } catch (err) {
      console.error("Fetch packages error:", err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sender = {
      name: form.senderName,
      address: form.senderAddress,
      email: form.senderEmail,
      phoneNumber: form.senderPhoneNumber,
      country: form.senderCountry,
    };

    const receiver = {
      name: form.receiverName,
      address: form.receiverAddress,
      email: form.receiverEmail,
      phoneNumber: form.receiverPhoneNumber,
      country: form.receiverCountry,
    };

    const packageData = {
      totalWeight: parseFloat(form.totalWeight),
      piece: parseInt(form.piece),
      value: parseFloat(form.value),
      perKgCash: parseFloat(form.perKgCash),
      OPerKgCash: parseFloat(form.OPerKgCash),
      OTotalCash: parseFloat(form.OTotalCash),
      transitWay: form.transitWay,
      totalCash: parseFloat(form.totalCash),
      remain: parseFloat(form.remain),
      received: parseFloat(form.received),
    };

    try {
      console.log(sender,receiver,packageData);
      
      if (editingId) {
        await axios.put(`${BASE_URL}/packages/${editingId}`, {
          sender,
          receiver,
          packageData,
        });
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/packages`, {
          sender,
          receiver,
          packageData,
        });
      }

      setForm({
        senderName: "",
        senderAddress: "",
        senderEmail: "",
        senderPhoneNumber: "",
        senderCountry: "",
        receiverName: "",
        receiverAddress: "",
        receiverEmail: "",
        receiverPhoneNumber: "",
        receiverCountry: "",
        totalWeight: 0,
        piece: 0,
        value: 0,
        perKgCash: 0,
        OPerKgCash: 0,
        OTotalCash:0,
        transitWay:"",
        totalCash: 0,
        remain: 0,
        received: 0,
      });

      fetchPackages();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);

    setForm({
      senderName: pkg.Sender.name,
      senderAddress: pkg.Sender.address,
      senderEmail: pkg.Sender.email || "",
      senderPhoneNumber: pkg.Sender.phoneNumber,
      senderCountry: pkg.Sender.country,
      receiverName: pkg.Receiver.name,
      receiverAddress: pkg.Receiver.address,
      receiverEmail: pkg.Receiver.email || "",
      receiverPhoneNumber: pkg.Receiver.phoneNumber,
      receiverCountry: pkg.Receiver.country,
      totalWeight: pkg.totalWeight,
      piece: pkg.piece,
      value: pkg.value || 0,
      perKgCash: pkg.perKgCash,
      OPerKgCash: pkg. OPerKgCash,
      OTotalCash:pkg.OTotalCash,
      transitWay:pkg.transitWay,
      totalCash: pkg.totalCash,
      remain: pkg.remain,
      received: pkg.received,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/packages/${id}`);
      fetchPackages();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Update Package" : "Create Package"}
      </h2>

      <form className="grid grid-cols-2 gap-4 mb-6" onSubmit={handleSubmit}>
        {/* Sender */}
        <h3 className="col-span-2 font-semibold text-lg">Sender Info</h3>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Sender Name</span>
          <input
            type="text"
            name="senderName"
            placeholder="Sender Name"
            value={form.senderName}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Sender Address</span>
          <input
            type="text"
            name="senderAddress"
            placeholder="Sender Address"
            value={form.senderAddress}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Sender Email</span>
          <input
            type="email"
            name="senderEmail"
            placeholder="Sender Email"
            value={form.senderEmail}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Sender Phone</span>
          <input
            type="text"
            name="senderPhoneNumber"
            placeholder="Sender Phone"
            value={form.senderPhoneNumber}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Sender Country</span>
          <input
            type="text"
            name="senderCountry"
            placeholder="Sender Country"
            value={form.senderCountry}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        {/* Receiver */}
        <h3 className="col-span-2 font-semibold text-lg">Receiver Info</h3>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Receiver Name</span>
          <input
            type="text"
            name="receiverName"
            placeholder="Receiver Name"
            value={form.receiverName}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Receiver Address</span>
          <input
            type="text"
            name="receiverAddress"
            placeholder="Receiver Address"
            value={form.receiverAddress}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Receiver Email</span>
          <input
            type="email"
            name="receiverEmail"
            placeholder="Receiver Email"
            value={form.receiverEmail}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Receiver Phone</span>
          <input
            type="text"
            name="receiverPhoneNumber"
            placeholder="Receiver Phone"
            value={form.receiverPhoneNumber}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Receiver Country</span>
          <input
            type="text"
            name="receiverCountry"
            placeholder="Receiver Country"
            value={form.receiverCountry}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        {/* Package */}
        <h3 className="col-span-2 font-semibold text-lg">Package Info</h3>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Total Weight (KG)</span>
          <input
            type="number"
            name="totalWeight"
            placeholder="Total Weight"
            value={form.totalWeight}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Piece</span>
          <input
            type="number"
            name="piece"
            placeholder="Piece"
            value={form.piece}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Value</span>
          <input
            type="number"
            name="value"
            placeholder="Value"
            value={form.value}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Per Kg Cash</span>
          <input
            type="number"
            name="perKgCash"
            placeholder="Per Kg Cash"
            value={form.perKgCash}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Office Per Kg Cash</span>
          <input
            type="number"
            name="OPerKgCash"
            placeholder="Per Kg Cash"
            value={form.OPerKgCash}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Office total Cash</span>
          <input
            type="number"
            name="OTotalCash"
            placeholder="Per Kg Cash"
            value={form.OTotalCash}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Transit way</span>
          <input
            type="text"
            name="transitWay"
            placeholder="transit way"
            value={form.transitWay}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Total Cash</span>
          <input
            type="number"
            name="totalCash"
            placeholder="Total Cash"
            value={form.totalCash}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Remain</span>
          <input
            type="number"
            name="remain"
            placeholder="Remain"
            value={form.remain}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Received</span>
          <input
            type="number"
            name="received"
            placeholder="Received"
            value={form.received}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded col-span-2"
        >
          {editingId ? "Update Package" : "Create Package"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Packages List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Sender</th>
            <th className="border p-2">Receiver</th>
            <th className="border p-2">Total Weight</th>
            <th className="border p-2">Piece</th>
            <th className="border p-2">Total Cash</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td className="border p-2">{pkg.id}</td>
              <td className="border p-2">{pkg.Sender.name}</td>
              <td className="border p-2">{pkg.Receiver.name}</td>
              <td className="border p-2">{pkg.totalWeight}</td>
              <td className="border p-2">{pkg.piece}</td>
              <td className="border p-2">{pkg.totalCash}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="bg-yellow-500 text-white p-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackageCrud;
