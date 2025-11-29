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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            مدیریت لست قیمت‌ها
          </h1>

          <button
            onClick={openModal}
            className="bg-gradient-to-r from-green-500 to-emerald-600 
        hover:from-green-600 hover:to-emerald-700 text-white font-bold 
        px-6 py-2 rounded-full shadow-lg transition-all duration-300"
          >
            + اضافه کردن قیمت
          </button>
        </div>

        {/* Price Table Card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-indigo-100 to-blue-100">
                <tr className="text-gray-700 font-semibold text-sm">
                  <th className="p-3 border">زون</th>
                  <th className="p-3 border">طریق ترانزیت</th>
                  <th className="p-3 border">بازه وزن</th>
                  <th className="p-3 border">قیمت</th>
                  <th className="p-3 border">عملیات</th>
                </tr>
              </thead>

              <tbody>
                {priceLists.map((item) => (
                  <tr
                    key={item.id}
                    className="text-center hover:bg-blue-50 transition duration-200"
                  >
                    {console.log(item)}

                    <td className="border p-3">{item.Zone?.name}</td>
                    <td className="border p-3">{item.Transit?.name}</td>

                    <td className="border p-3">
                      {item.range.start} - {item.range.end} کیلوگرام
                    </td>

                    <td className="border p-3 font-bold text-green-700">
                      ${item.price}
                    </td>

                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => editModal(item)}
                        className="px-4 py-1 bg-blue-500 hover:bg-blue-600 
                    text-white rounded-full shadow-sm transition"
                      >
                        ویرایش
                      </button>

                      <button
                        onClick={() => deletePriceList(item.id)}
                        className="px-4 py-1 bg-red-500 hover:bg-red-600 
                    text-white rounded-full shadow-sm transition"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-96 p-6 rounded-2xl shadow-xl animate-scaleIn">
              <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">
                {isEdit ? "ویرایش قیمت" : "اضافه کردن قیمت جدید"}
              </h2>

              {/* Zone */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  زون
                </label>
                <select
                  name="zoneId"
                  value={formData.zoneId}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md 
              bg-gray-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">زون انتخاب کنید</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transit */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  طریق ترانزیت
                </label>
                <select
                  name="transitId"
                  value={formData.transitId}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md 
              bg-gray-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">انتخاب کنید</option>
                  {transits.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Range Start */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  شروع بازه (kg)
                </label>
                <input
                  type="number"
                  name="start"
                  value={formData.range.start}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md 
              bg-gray-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Range End */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  پایان بازه (kg)
                </label>
                <input
                  type="number"
                  name="end"
                  value={formData.range.end}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md 
              bg-gray-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  قیمت ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md 
              bg-gray-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 
              text-gray-700 rounded-xl transition font-semibold"
                >
                  بستن
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 
              hover:from-blue-700 hover:to-indigo-700 text-white 
              rounded-xl shadow-md transition font-semibold"
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
