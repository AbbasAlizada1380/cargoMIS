import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ZoneManager() {
  const [zones, setZones] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    countries: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/zone/`);
      setZones(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    setFormData({ name: "", countries: "" });
    setIsEdit(false);
    setModalOpen(true);
  };

  const editModal = (item) => {
    setIsEdit(true);
    setEditId(item.id);

    setFormData({
      name: item.name,
      countries: item.countries.join(", "), // Convert array → comma text
    });

    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        countries: formData.countries
          .split(",")
          .map((c) => c.trim())
          .filter((x) => x !== ""),
      };

      if (isEdit) {
        await axios.patch(`${BASE_URL}/zone/${editId}`, payload);
      } else {
        await axios.post(`${BASE_URL}/zone/`, payload);
      }

      fetchZones();
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

  const deleteZone = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This zone will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/zone/${id}`);
        fetchZones();
        Swal.fire("Deleted!", "", "success");
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Zone Management</h1>
        <button
          className="px-4 py-2 bg-green-600 rounded text-white"
          onClick={openModal}
        >
          + Add Zone
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Zone Name</th>
              <th className="p-2 border">Countries</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {zones.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.countries.join(", ")}</td>

                <td className="border p-2 space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => editModal(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => deleteZone(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {zones.length === 0 && (
              <tr>
                <td className="text-center p-4 border" colSpan={3}>
                  No zones found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Zone" : "Add New Zone"}
            </h2>

            {/* Zone Name */}
            <div className="mb-4">
              <label className="text-sm">Zone Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Countries */}
            <div className="mb-4">
              <label className="text-sm">Countries (comma separated)</label>
              <textarea
                rows={3}
                value={formData.countries}
                onChange={(e) =>
                  setFormData({ ...formData, countries: e.target.value })
                }
                className="w-full p-2 border rounded"
              ></textarea>
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
