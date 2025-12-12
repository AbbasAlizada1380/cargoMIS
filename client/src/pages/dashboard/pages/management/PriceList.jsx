import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaWeight,
  FaGlobe,
  FaTruck,
  FaChartLine,
  FaTimes,
  FaSave,
  FaSearch
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PriceListManager() {
  const [priceLists, setPriceLists] = useState([]);
  const [zones, setZones] = useState([]);
  const [transits, setTransits] = useState([]);
  const [activeTransit, setActiveTransit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    submit: false,
    delete: false,
    fetch: false
  });

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
    setLoading(prev => ({ ...prev, fetch: true }));
    try {
      const res = await axios.get(`${BASE_URL}/priceList`);
      setPriceLists(res.data);
    } catch (error) {
      console.error("Error fetching price lists:", error);
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  const fetchZones = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/zone/`);
      setZones(res.data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const fetchTransits = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/transitWay/`);
      setTransits(res.data);
      if (res.data.length > 0) setActiveTransit(res.data[0].id);
    } catch (error) {
      console.error("Error fetching transits:", error);
    }
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
      transitId: activeTransit || "",
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
    if (loading.submit) return;
    
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      if (isEdit) {
        await axios.put(`${BASE_URL}/pricelist/${editId}`, formData);
      } else {
        await axios.post(`${BASE_URL}/pricelist/`, formData);
      }

      fetchPriceLists();
      setModalOpen(false);

      Swal.fire({
        icon: "success",
        title: isEdit ? "بروزرسانی موفق!" : "ایجاد موفق!",
        text: isEdit ? "قیمت با موفقیت بروزرسانی شد." : "قیمت جدید با موفقیت ثبت شد.",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: err.response?.data?.message || "مشکلی در ارتباط با سرور رخ داده است.",
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const deletePriceList = async (id) => {
    if (loading.delete) return;
    
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عمل قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو",
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await axios.delete(`${BASE_URL}/pricelist/${id}`);
      fetchPriceLists();
      Swal.fire("حذف شد!", "قیمت مورد نظر حذف شد.", "success");
    } catch (error) {
      Swal.fire("خطا!", "مشکلی در حذف قیمت رخ داده است.", "error");
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const filteredPriceLists = priceLists.filter((p) => {
    if (activeTransit && p.transitId !== activeTransit) return false;
    if (searchTerm) {
      const zoneName = p.Zone?.name || "";
      return zoneName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl">
                <FaChartLine className="text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">مدیریت لست قیمت‌ها</h1>
                <p className="text-blue-100 mt-1">تنظیم و مدیریت قیمت‌های حمل و نقل بر اساس زون و وزن</p>
              </div>
            </div>
            <button
              onClick={openModal}
              disabled={loading.fetch}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading.fetch ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  در حال بارگذاری...
                </>
              ) : (
                <>
                  <FaPlus />
                  اضافه کردن قیمت جدید
                </>
              )}
            </button>
          </div>
        </div>

        {/* CONTROLS SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaSearch className="text-blue-500" />
              جستجوی زون
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو بر اساس نام زون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-4 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={loading.fetch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Transit Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaTruck className="text-green-500" />
              انتخاب روش حمل و نقل
            </label>
            <div className="flex flex-wrap gap-2">
              {transits.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTransit(t.id)}
                  disabled={loading.fetch}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTransit === t.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border"
                  }`}
                >
                  <FaTruck className="text-sm" />
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-700">تعداد زون‌ها</div>
                <div className="text-2xl font-bold text-blue-900">{zones.length}</div>
              </div>
              <FaGlobe className="text-3xl text-blue-500 opacity-70" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-700">روش‌های حمل</div>
                <div className="text-2xl font-bold text-green-900">{transits.length}</div>
              </div>
              <FaTruck className="text-3xl text-green-500 opacity-70" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-700">قیمت‌های ثبت شده</div>
                <div className="text-2xl font-bold text-purple-900">{filteredPriceLists.length}</div>
              </div>
              <FaDollarSign className="text-3xl text-purple-500 opacity-70" />
            </div>
          </div>
        </div>

        {/* PRICE TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaChartLine className="text-blue-600" />
              لیست قیمت‌ها
              {activeTransit && (
                <span className="text-sm font-normal text-gray-600">
                  (فیلتر شده بر اساس {transits.find(t => t.id === activeTransit)?.name})
                </span>
              )}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaGlobe />
                      زون
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaWeight />
                      بازه وزن (کیلوگرم)
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaDollarSign />
                      قیمت (دلار)
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaTruck />
                      روش حمل
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading.fetch ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">در حال بارگذاری قیمت‌ها...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPriceLists.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FaChartLine className="text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">قیمتی یافت نشد</p>
                        <p className="text-gray-400 text-sm mt-2">
                          {searchTerm ? "نتیجه‌ای برای جستجوی شما یافت نشد" : "هنوز قیمتی ثبت نشده است"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPriceLists.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-blue-50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                            <FaGlobe className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{item.Zone?.name}</div>
                            <div className="text-xs text-gray-500">زون ID: {item.zoneId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center">
                            <FaWeight className="text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.range.start} - {item.range.end} کیلوگرم
                            </div>
                            <div className="text-xs text-gray-500">وزن</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 flex items-center justify-center">
                            <FaDollarSign className="text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-bold text-2xl text-green-700">
                              ${item.price}
                            </div>
                            <div className="text-xs text-gray-500">هر کیلوگرم</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm">
                          <FaTruck className="text-xs" />
                          {transits.find(t => t.id === item.transitId)?.name}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editModal(item)}
                            disabled={loading.submit || loading.delete}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 rounded-xl hover:from-blue-200 hover:to-blue-300 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaEdit />
                            <span className="text-sm">ویرایش</span>
                          </button>

                          <button
                            onClick={() => deletePriceList(item.id)}
                            disabled={loading.submit || loading.delete}
                            className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-600 rounded-xl hover:from-red-200 hover:to-red-300 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading.delete ? (
                              <>
                                <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm">حذف...</span>
                              </>
                            ) : (
                              <>
                                <FaTrash />
                                <span className="text-sm">حذف</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-2xl text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {isEdit ? <FaEdit /> : <FaPlus />}
                    </div>
                    <h2 className="text-xl font-bold">
                      {isEdit ? "ویرایش قیمت" : "افزودن قیمت جدید"}
                    </h2>
                  </div>
                  <button
                    onClick={() => !loading.submit && setModalOpen(false)}
                    disabled={loading.submit}
                    className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  {isEdit ? "اطلاعات قیمت را ویرایش کنید" : "اطلاعات قیمت جدید را وارد کنید"}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Zone Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaGlobe className="text-blue-500" />
                    انتخاب زون
                  </label>
                  <select
                    name="zoneId"
                    value={formData.zoneId}
                    onChange={handleChange}
                    disabled={loading.submit}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">انتخاب زون...</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weight Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaWeight className="text-green-500" />
                      شروع بازه (کیلوگرم)
                    </label>
                    <input
                      type="number"
                      name="start"
                      value={formData.range.start}
                      onChange={handleChange}
                      disabled={loading.submit}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaWeight className="text-green-500" />
                      پایان بازه (کیلوگرم)
                    </label>
                    <input
                      type="number"
                      name="end"
                      value={formData.range.end}
                      onChange={handleChange}
                      disabled={loading.submit}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="100"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaDollarSign className="text-yellow-500" />
                    قیمت (دلار)
                  </label>
                    <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={loading.submit}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Selected Transit Info */}
                {formData.transitId && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700">
                      <FaTruck />
                      <span className="font-medium">
                        روش حمل: {transits.find(t => t.id === formData.transitId)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-between">
                  <button
                    onClick={() => !loading.submit && setModalOpen(false)}
                    disabled={loading.submit}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTimes />
                    لغو
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading.submit}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                  >
                    {loading.submit ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isEdit ? "در حال بروزرسانی..." : "در حال ذخیره..."}
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {isEdit ? "بروزرسانی قیمت" : "ذخیره قیمت"}
                      </>
                    )}
                  </button>
                </div>
              </div> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
}