// Packages.jsx
import React, { useState, useEffect } from "react";
import PackageList from "./PackageList";
import { packageService } from "../services/packageService";

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
    perKgCash: "",
    remain: 0,
    totalCash: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  // Handle form input changes
  const handleFormChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        perKgCash: "",
        remain: 0,
        totalCash: "",
      });

      setEditingId(null);
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
            perKgCash: "",
            remain: 0,
            totalCash: "",
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
      perKgCash: "",
      remain: 0,
      totalCash: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        {editingId ? "ویرایش بسته" : "ثبت بسته جدید"} 📦
      </h2>

      {editingId && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800 text-center">
            در حال ویرایش بسته شماره {editingId}
            <button
              onClick={cancelEdit}
              className="mr-4 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              لغو ویرایش
            </button>
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => handleFormSubmit(e, formData, setFormData)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Receiver Info */}
        <h3 className="col-span-2 text-lg font-bold text-gray-700 mt-4">
          معلومات گیرنده 📩
        </h3>
        <input
          type="text"
          name="receiverName"
          value={formData.receiverName}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="نام گیرنده"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="receiverPhone"
          value={formData.receiverPhone}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="شماره تماس گیرنده"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="receiverEmail"
          value={formData.receiverEmail}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="ایمیل گیرنده"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="receiverAddress"
          value={formData.receiverAddress}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="آدرس گیرنده"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="کشور گیرنده"
          className="p-2 border rounded"
        />

        {/* Sender Info */}
        <h3 className="col-span-2 text-lg font-bold text-gray-700 mt-4">
          معلومات فرستنده 📨
        </h3>
        <input
          type="text"
          name="senderName"
          value={formData.senderName}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="نام فرستنده"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="senderPhone"
          value={formData.senderPhone}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="شماره تماس فرستنده"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="senderEmail"
          value={formData.senderEmail}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="ایمیل فرستنده"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="senderAddress"
          value={formData.senderAddress}
          onChange={(e) => handleFormChange(e, formData, setFormData)}
          placeholder="آدرس فرستنده"
          className="p-2 border rounded"
        />

        {/* Package Info */}
        <h3 className="col-span-2 text-lg font-bold text-gray-700 mt-4">
          معلومات بسته 📦
        </h3>
        {[
          {
            name: "goodsDetails",
            placeholder: "جزئیات جنس (مثلاً لباس)",
            type: "text",
          },
          { name: "goodWeight", placeholder: "وزن (کیلوگرام)", type: "number" },
          { name: "piece", placeholder: "تعداد", type: "number" },
          { name: "goodsValue", placeholder: "ارزش جنس ($)", type: "number" },
          {
            name: "perKgCash",
            placeholder: "قیمت فی کیلو ($)",
            type: "number",
          },
          { name: "remain", placeholder: "باقی مانده ($)", type: "number" },
          { name: "totalCash", placeholder: "مجموع پول ($)", type: "number" },
        ].map((item) => (
          <input
            key={item.name}
            type={item.type}
            name={item.name}
            value={formData[item.name]}
            onChange={(e) => handleFormChange(e, formData, setFormData)}
            placeholder={item.placeholder}
            className="p-2 border rounded"
          />
        ))}

        {/* Submit */}
        <button
          type="submit"
          className="col-span-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {editingId ? "بروزرسانی بسته" : "ثبت بسته"}
        </button>
      </form>

      <PackageList
        refreshTrigger={refreshList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Packages;
