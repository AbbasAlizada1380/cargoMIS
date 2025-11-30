import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PriceListManager() {
  const [priceLists, setPriceLists] = useState([]);
  const [zones, setZones] = useState([]);
  const [transits, setTransits] = useState([]);

  const [activeTransit, setActiveTransit] = useState(null);

  const [formData, setFormData] = useState({
    zoneId: "",
    transitId: "",
    range: { start: "", end: "" },
    price: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    if (res.data.length > 0) setActiveTransit(res.data[0].id);
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
      transitId: activeTransit, // auto select active tab transit
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            مدیریت لست قیمت‌ها
          </h1>

          <button
            onClick={openModal}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-full shadow-lg"
          >
            + اضافه کردن قیمت
          </button>
        </div>

        {/* TRANSIT TABS */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {transits.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTransit(t.id)}
              className={`px-4 py-2 rounded-full font-semibold transition 
              ${
                activeTransit === t.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* PRICE TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <table className="w-full border">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border">زون</th>
                <th className="p-3 border">بازه وزن</th>
                <th className="p-3 border">قیمت</th>
                <th className="p-3 border">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {priceLists
                .filter((p) => p.transitId === activeTransit)
                .map((item) => (
                  <tr key={item.id} className="text-center hover:bg-blue-50">
                    <td className="border p-3">{item.Zone?.name}</td>

                    <td className="border p-3">
                      {item.range.start} - {item.range.end} kg
                    </td>

                    <td className="border p-3 font-bold text-green-700">
                      ${item.price}
                    </td>

                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => editModal(item)}
                        className="px-4 py-1 bg-blue-500 text-white rounded-full"
                      >
                        ویرایش
                      </button>

                      <button
                        onClick={() => deletePriceList(item.id)}
                        className="px-4 py-1 bg-red-500 text-white rounded-full"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-96 p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">
                {isEdit ? "ویرایش قیمت" : "اضافه کردن قیمت جدید"}
              </h2>

              {/* ZONE */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700">
                  زون
                </label>
                <select
                  name="zoneId"
                  value={formData.zoneId}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-md bg-gray-50"
                >
                  <option value="">انتخاب زون</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* START */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700">
                  شروع بازه (kg)
                </label>
                <input
                  type="number"
                  name="start"
                  value={formData.range.start}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-md bg-gray-50"
                />
              </div>

              {/* END */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700">
                  پایان بازه (kg)
                </label>
                <input
                  type="number"
                  name="end"
                  value={formData.range.end}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-md bg-gray-50"
                />
              </div>

              {/* PRICE */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700">
                  قیمت ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-md bg-gray-50"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-between">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 bg-gray-300 rounded-xl"
                >
                  بستن
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl"
                >
                  {isEdit ? "بروزرسانی" : "ثبت"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
