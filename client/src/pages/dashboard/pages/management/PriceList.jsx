import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PriceListManager() {
  const [priceLists, setPriceLists] = useState([]);
  const [zones, setZones] = useState([]);
  const [transits, setTransits] = useState([]);

  const [formData, setFormData] = useState({
    zoneId: "",
    transitId: "",
    range: { start: "", end: "" },
    price: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch all data when page loads
  useEffect(() => {
    fetchPriceLists();
    fetchZones();
    fetchTransits();
  }, []);

  const fetchPriceLists = async () => {
    const res = await axios.get(`${BASE_URL}/priceList`);
    setPriceLists(res.data);
  };

  const fetchZones = async () => {
    const res = await axios.get(`${BASE_URL}/zone/`);
    setZones(res.data);
  };

  const fetchTransits = async () => {
    const res = await axios.get(`${BASE_URL}/transitWay/`);
    setTransits(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      setFormData({
        ...formData,
        range: { ...formData.range, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openModal = () => {
    setFormData({
      zoneId: "",
      transitId: "",
      range: { start: "", end: "" },
      price: "",
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const editModal = (item) => {
    setIsEdit(true);
    setEditId(item.id);
    setFormData({
      zoneId: item.zoneId,
      transitId: item.transitId,
      range: { start: item.range.start, end: item.range.end },
      price: item.price,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.patch(`${BASE_URL}/pricelist/${editId}`, formData);
      } else {
        await axios.post(`${BASE_URL}/pricelist/`, formData);
      }

      fetchPriceLists();
      setModalOpen(false);

      Swal.fire({
        icon: "success",
        title: isEdit ? "Updated!" : "Created!",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const deletePriceList = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/pricelist/${id}`);
        fetchPriceLists();
        Swal.fire("Deleted!", "", "success");
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Price List Management</h1>
        <button
          className="px-4 py-2 bg-green-600 rounded text-white"
          onClick={openModal}
        >
          + Add Price
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Zone</th>
              <th className="p-2 border">Transit</th>
              <th className="p-2 border">Range</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {priceLists.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.Zone?.name}</td>
                <td className="border p-2">{item.TransitWay?.name}</td>
                <td className="border p-2">
                  {item.range.start} - {item.range.end}
                </td>
                <td className="border p-2">{item.price} USD</td>

                <td className="border p-2 space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => editModal(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => deletePriceList(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Price List" : "Add New Price"}
            </h2>

            {/* Zone Select */}
            <div className="mb-4">
              <label className="text-sm">Zone</label>
              <select
                name="zoneId"
                value={formData.zoneId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Zone</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transit Select */}
            <div className="mb-4">
              <label className="text-sm">Transit Way</label>
              <select
                name="transitId"
                value={formData.transitId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Transit</option>
                {transits.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Range Start */}
            <div className="mb-4">
              <label className="text-sm">Start Range</label>
              <input
                type="number"
                name="start"
                value={formData.range.start}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Range End */}
            <div className="mb-4">
              <label className="text-sm">End Range</label>
              <input
                type="number"
                name="end"
                value={formData.range.end}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="text-sm">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleSubmit}
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
