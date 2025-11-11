// Packages.jsx
import React, { useState, useEffect } from "react";
import PackageList from "./PackageList";
import { packageService } from "../services/packageservice.js";
import {
  calculateTotalCash,
  calculateRemainingCash,
  shouldAutoCalculate,
} from "../services/formServices";

const Packages = () => {
  const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverEmail: "",
    country: "",
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderEmail: "",
    goodsDetails: "",
    goodWeight: "",
    piece: 1,
    goodsValue: "",
    location: "cargo stock in kabul",
    perKgCash: "",
    remain: 0,
    totalCash: "",
    recip: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [isTotalCashManual, setIsTotalCashManual] = useState(false);

  // Auto-calculate total when goodWeight or perKgCash changes
  useEffect(() => {
    if (shouldAutoCalculate(formData)) {
      const calculatedTotal = calculateTotalCash(
        formData.goodWeight,
        formData.perKgCash
      );

      setFormData((prev) => ({
        ...prev,
        totalCash: calculatedTotal,
      }));
    }
  }, [formData.goodWeight, formData.perKgCash, formData.piece]);

  // Auto-calculate remain when totalCash or recip changes
  useEffect(() => {
    if (formData.totalCash || formData.recip) {
      const calculatedRemain = calculateRemainingCash(
        formData.totalCash,
        formData.recip
      );

      setFormData((prev) => ({
        ...prev,
        remain: calculatedRemain,
      }));
    }
  }, [formData.totalCash, formData.recip]);

  // Handle form input changes
  const handleFormChange = (e, formData, setFormData) => {
    const { name, value } = e.target;

    // If user manually edits totalCash, set manual mode
    if (name === "totalCash") {
      setIsTotalCashManual(true);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset auto-calculation when goodWeight or perKgCash is cleared
  useEffect(() => {
    if (!formData.goodWeight || !formData.perKgCash) {
      setIsTotalCashManual(false);
    }
  }, [formData.goodWeight, formData.perKgCash]);

  // Handle form submission (both create and update)
  const handleFormSubmit = async (e, formData, setFormData) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing package
        await packageService.update(editingId, formData);
        alert("بسته با موفقیت به‌روزرسانی شد");
      } else {
        // Create new package
        await packageService.create(formData);
        alert("بسته جدید با موفقیت ثبت شد");
      }

      // Reset form
      setFormData({
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        receiverEmail: "",
        country: "",
        senderName: "",
        senderPhone: "",
        senderAddress: "",
        senderEmail: "",
        goodsDetails: "",
        goodWeight: "",
        piece: 1,
        goodsValue: "",
        location: "cargo stock in kabul",
        perKgCash: "",
        remain: 0,
        totalCash: "",
        recip: "",
      });

      setEditingId(null);
      setIsTotalCashManual(false);
      setRefreshList((prev) => !prev); // Trigger list refresh
    } catch (error) {
      console.error("Error saving package:", error);
      alert("خطا در ذخیره بسته");
    }
  };

  // Function to handle edit - will be passed to PackageList
  const handleEdit = async (id) => {
    try {
      const response = await packageService.getById(id);
      if (response.success) {
        setFormData(response.data);
        setEditingId(id);
        setIsTotalCashManual(true); // Assume edited data has manual totalCash
        // Scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error fetching package for edit:", error);
      alert("خطا در دریافت اطلاعات بسته");
    }
  };

  // Function to handle delete - will be passed to PackageList
  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این بسته اطمینان دارید؟")) {
      try {
        await packageService.delete(id);
        alert("بسته با موفقیت حذف شد");
        setRefreshList((prev) => !prev); // Trigger list refresh

        // If we're editing the deleted package, reset form
        if (editingId === id) {
          setEditingId(null);
          setIsTotalCashManual(false);
          setFormData({
            receiverName: "",
            receiverPhone: "",
            receiverAddress: "",
            receiverEmail: "",
            country: "",
            senderName: "",
            senderPhone: "",
            senderAddress: "",
            senderEmail: "",
            goodsDetails: "",
            goodWeight: "",
            piece: 1,
            goodsValue: "",
            location: "cargo stock in kabul",
            perKgCash: "",
            remain: 0,
            totalCash: "",
            recip: "",
          });
        }
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("خطا در حذف بسته");
      }
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setIsTotalCashManual(false);
    setFormData({
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      receiverEmail: "",
      country: "",
      senderName: "",
      senderPhone: "",
      senderAddress: "",
      senderEmail: "",
      goodsDetails: "",
      goodWeight: "",
      piece: 1,
      goodsValue: "",
      location: "cargo stock in kabul",
      perKgCash: "",
      remain: 0,
      totalCash: "",
      recip: "",
    });
  };

  // Recalculate total cash manually
  const recalculateTotal = () => {
    if (formData.goodWeight && formData.perKgCash) {
      const calculatedTotal = calculateTotalCash(
        formData.goodWeight,
        formData.perKgCash,
        formData.piece
      );
      setFormData((prev) => ({
        ...prev,
        totalCash: calculatedTotal,
      }));
      setIsTotalCashManual(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {editingId ? "ویرایش بسته" : "ثبت بسته جدید"}
            <span className="mr-2">📦</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {editingId
              ? "در حال ویرایش اطلاعات بسته موجود"
              : "فرم زیر را برای ثبت بسته جدید پر کنید"}
          </p>
        </div>

        {/* Edit Mode Banner */}
        {editingId && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse mr-3"></div>
                <p className="text-amber-800 font-medium">
                  در حال ویرایش بسته شماره{" "}
                  <span className="font-bold">{editingId}</span>
                </p>
              </div>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                لغو ویرایش
              </button>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <form
            onSubmit={(e) => handleFormSubmit(e, formData, setFormData)}
            className="p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 p-6 md:gap-x-5 gap-y-5">
              {/* Receiver Info Section */}
              <div className="md:col-span-3">
                <div className="flex items-center pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="ml-2">📩</span>
                    معلومات گیرنده
                  </h3>
                </div>
              </div>

              {[
                {
                  name: "receiverName",
                  placeholder: "نام گیرنده",
                  type: "text",
                  required: true,
                },
                {
                  name: "receiverPhone",
                  placeholder: "شماره تماس گیرنده",
                  type: "text",
                  required: true,
                },
                {
                  name: "receiverEmail",
                  placeholder: "ایمیل گیرنده",
                  type: "email",
                },
                {
                  name: "receiverAddress",
                  placeholder: "آدرس گیرنده",
                  type: "text",
                },
                { name: "country", placeholder: "کشور گیرنده", type: "text" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    {field.placeholder}
                    {field.required && (
                      <span className="text-red-500 mr-1">*</span>
                    )}
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) => handleFormChange(e, formData, setFormData)}
                    className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-blue-500 transition-all duration-200 focus:outline-none bg-gray-200 shadow-sm hover:shadow-md"
                    required={field.required}
                  />
                </div>
              ))}

              {/* Sender Info Section */}
              <div className="md:col-span-3 mt-4">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="ml-2">📨</span>
                    معلومات فرستنده
                  </h3>
                </div>
              </div>

              {[
                {
                  name: "senderName",
                  placeholder: "نام فرستنده",
                  type: "text",
                  required: true,
                },
                {
                  name: "senderPhone",
                  placeholder: "شماره تماس فرستنده",
                  type: "text",
                  required: true,
                },
                {
                  name: "senderEmail",
                  placeholder: "ایمیل فرستنده",
                  type: "email",
                },
                {
                  name: "senderAddress",
                  placeholder: "آدرس فرستنده",
                  type: "text",
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    {field.placeholder}
                    {field.required && (
                      <span className="text-red-500 mr-1">*</span>
                    )}
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) => handleFormChange(e, formData, setFormData)}
                    className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-blue-500 transition-all duration-200 focus:outline-none bg-gray-200 shadow-sm hover:shadow-md"
                    required={field.required}
                  />
                </div>
              ))}

              {/* Package Info Section */}
              <div className="md:col-span-3 mt-4">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="ml-2">📦</span>
                    معلومات بسته
                  </h3>
                </div>
              </div>

              {[
                {
                  name: "goodsDetails",
                  placeholder: "جزئیات جنس (مثلاً لباس)",
                  type: "text",
                },
                {
                  name: "goodWeight",
                  placeholder: "وزن (کیلوگرام)",
                  type: "number",
                  step: "0.1",
                },
                {
                  name: "piece",
                  placeholder: "تعداد",
                  type: "number",
                  min: "1",
                },
                {
                  name: "goodsValue",
                  placeholder: "ارزش جنس ($)",
                  type: "number",
                  step: "0.01",
                },
                {
                  name: "perKgCash",
                  placeholder: "قیمت انتقال فی کیلو ($)",
                  type: "number",
                  step: "0.01",
                },
                {
                  name: "recip",
                  placeholder: "دریافتی ($)",
                  type: "number",
                  step: "0.01",
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-semibold text-gray-700 mb-2"
                  >
                    {field.placeholder}
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) => handleFormChange(e, formData, setFormData)}
                    min={field.min}
                    step={field.step}
                    className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-blue-500 transition-all duration-200 focus:outline-none bg-gray-200 shadow-sm hover:shadow-md"
                  />
                </div>
              ))}

              {/* Total Cash with auto-calculation indicator */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  مجموع پول ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="totalCash"
                    value={formData.totalCash}
                    onChange={(e) => handleFormChange(e, formData, setFormData)}
                    step="0.01"
                    className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-blue-500 transition-all duration-200 focus:outline-none bg-gray-200 shadow-sm hover:shadow-md"
                    placeholder="0.00"
                  />
                  {!isTotalCashManual &&
                    formData.goodWeight &&
                    formData.perKgCash && (
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-full font-medium border border-green-200">
                        محاسبه خودکار
                      </span>
                    )}
                  {isTotalCashManual && (
                    <button
                      type="button"
                      onClick={recalculateTotal}
                      className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-blue-500 transition-all duration-200 focus:outline-none bg-gray-200 shadow-sm hover:shadow-md"
                    >
                      محاسبه مجدد
                    </button>
                  )}
                </div>
              </div>

              {/* Remain field (auto-calculated) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  باقی مانده ($)
                </label>
                <input
                  type="number"
                  name="remain"
                  value={formData.remain}
                  readOnly
                  step="0.01"
                  className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-blue-500 transition-all duration-200 focus:outline-none bg-gray-200 shadow-sm hover:shadow-md"
                  placeholder="0.00"
                />
              </div>

              {/* Auto-calculation info */}
              {formData.goodWeight && formData.perKgCash && (
                <div className="col-span-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <p className="font-semibold text-blue-800">
                      محاسبه خودکار:
                    </p>
                  </div>
                  <div className="text-sm text-blue-700 bg-white p-3 rounded-lg border border-blue-100">
                    <p className="font-mono text-center">
                      {formData.goodWeight} kg × {formData.perKgCash} $/kg
                      {formData.piece > 1
                        ? ` × ${formData.piece} عدد`
                        : ""} ={" "}
                      <span className="font-bold text-green-600">
                        {calculateTotalCash(
                          formData.goodWeight,
                          formData.perKgCash,
                          formData.piece
                        )}{" "}
                        $
                      </span>
                    </p>
                    {isTotalCashManual && (
                      <p className="text-amber-600 mt-2 text-xs text-center font-medium bg-amber-50 p-2 rounded border border-amber-200">
                        ✓ مقدار به صورت دستی ویرایش شده است
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="md:col-span-3 flex justify-center items-center mt-6">
                <button
                  type="submit"
                  className=" bg-gradient-to-r px-5 from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {editingId ? "بروزرسانی بسته" : "ثبت بسته جدید"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Package List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <PackageList
            refreshTrigger={refreshList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Packages;
