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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Zone Management</h1>
        <button
          className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
          onClick={openModal}
        >
          + Add Zone
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3 border">Zone Name</th>
              <th className="p-3 border">Countries</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {zones.length > 0 ? (
              zones.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 border">{item.name}</td>

                  <td className="p-3 border">{item.countries.join(", ")}</td>

                  <td className="p-3 border text-center space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => editModal(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => deleteZone(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-center p-4 border text-gray-500"
                  colSpan={3}
                >
                  No zones found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg animate-scaleIn">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Zone" : "Add New Zone"}
            </h2>

            {/* Zone Name */}
            <div className="mb-4 relative">
              <input
                type="text"
                className="peer w-full border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:border-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder=" "
              />
              <label
                className="absolute left-3 top-3 text-gray-600 transition-all 
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 
            bg-white px-1"
              >
                Zone Name
              </label>
            </div>

            {/* Countries */}
            <div className="mb-4 relative">
              <textarea
                rows={3}
                className="peer w-full border border-gray-400 rounded-lg px-3 py-3 focus:outline-none focus:border-blue-500"
                value={formData.countries}
                onChange={(e) =>
                  setFormData({ ...formData, countries: e.target.value })
                }
                placeholder=" "
              ></textarea>
              <label
                className="absolute left-3 top-3 text-gray-600 transition-all 
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 
            bg-white px-1"
              >
                Countries (comma separated)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
