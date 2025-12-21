import React, { useState, useEffect, useRef } from "react";
import {
  FaBox,
  FaWeight,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaMoneyBillWave,
} from "react-icons/fa";
import UpdatePackageTracking from "./UpdatePackageTracking";

const PackingListAndDetails = ({
  form,
  handleChange,
  setForm,
  resetTrigger,
}) => {
  // Initial list - this should be static with value field added
  const initialPackList = [
    { description: "لباس زنانه", qty: "", weight: "", value: "" },
    { description: "مردانه لباس", qty: "", weight: "", value: "" },
    { description: "چادر", qty: "", weight: "", value: "" },
    { description: "پلون مردانه", qty: "", weight: "", value: "" },
    { description: "گزاره", qty: "", weight: "", value: "" },
    { description: "جاکت زنانه", qty: "", weight: "", value: "" },
    { description: "بلوز", qty: "", weight: "", value: "" },
    { description: "واسکت", qty: "", weight: "", value: "" },
    { description: "بوت", qty: "", weight: "", value: "" },
    { description: "گند افغانی", qty: "", weight: "", value: "" },
    { description: "گردن بند", qty: "", weight: "", value: "" },
    { description: "بیک", qty: "", weight: "", value: "" },
    { description: "کرتی", qty: "", weight: "", value: "" },
    { description: "پوش بالش", qty: "", weight: "", value: "" },
    { description: "پوش توشک", qty: "", weight: "", value: "" },
    { description: "زیرپوش بالش", qty: "", weight: "", value: "" },
    { description: "زیرپوش توشک", qty: "", weight: "", value: "" },
    { description: "قالین", qty: "", weight: "", value: "" },
    { description: "نمد", qty: "", weight: "", value: "" },
    { description: "پرده", qty: "", weight: "", value: "" },
    { description: "میوه خشک", qty: "", weight: "", value: "" },
    { description: "قروت", qty: "", weight: "", value: "" },
    { description: "گیاه یونانی", qty: "", weight: "", value: "" },
    { description: "ترموز", qty: "", weight: "", value: "" },
    { description: "ماهی تابه", qty: "", weight: "", value: "" },
    { description: "چاینک", qty: "", weight: "", value: "" },
    { description: "ملاقه", qty: "", weight: "", value: "" },
    { description: "پیاله", qty: "", weight: "", value: "" },
  ];

  const [packList, setPackList] = useState(initialPackList);

  const [newItemDescription, setNewItemDescription] = useState("");

  // Refs to track state and prevent infinite loops
  const isInitialMount = useRef(true);
  const hasProcessedEdit = useRef(false);
  const lastFormPackList = useRef([]);

  useEffect(() => {
    // When resetTrigger changes, reset to initial state
    if (resetTrigger) {
      setPackList(
        initialPackList.map((item) => ({
          description: item.description,
          qty: "",
          weight: "",
          value: "",
        }))
      );
      setNewItemDescription("");
      hasProcessedEdit.current = false;
      lastFormPackList.current = [];

      // Also update parent form immediately
      setForm((prev) => ({
        ...prev,
        packList: [],
      }));
    }
  }, [resetTrigger, setForm]);

  // Also update the form synchronization useEffect
  useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // If parent form has empty packList and we have items, reset
    if (!form.packList || form.packList.length === 0) {
      if (packList.some((item) => item.qty || item.weight || item.value)) {
        setPackList(
          initialPackList.map((item) => ({
            description: item.description,
            qty: "",
            weight: "",
            value: "",
          }))
        );
      }
      return;
    }

    // Rest of the editing logic...
    // ... existing code ...
  }, [form.packList]);
  // Update parent form with only items that have values (with optimization)
  useEffect(() => {
    const filteredList = packList.filter(
      (item) =>
        (item.qty && item.qty !== "") ||
        (item.weight && item.weight !== "") ||
        (item.value && item.value !== "")
    );

    // Only update if there's a real change
    const stringifiedFiltered = JSON.stringify(filteredList);
    const stringifiedCurrent = JSON.stringify(form.packList || []);

    if (stringifiedFiltered !== stringifiedCurrent) {
      setForm((prev) => ({
        ...prev,
        packList: filteredList,
      }));
    }
  }, [packList, setForm, form.packList]);

  // Handle pack list item changes
  const handlePackListChange = (index, field, value) => {
    // Remove leading zeros for better UX and validate numeric fields
    let cleanValue = value;

    if (field === "qty" || field === "weight" || field === "value") {
      // Allow only numbers and one decimal point for numeric fields
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        cleanValue = value.replace(/^0+(?=\d)/, "");
      } else {
        return; // Don't update if invalid
      }
    }

    const updatedPackList = [...packList];
    updatedPackList[index][field] = cleanValue;
    setPackList(updatedPackList);
  };

  // Add new item to pack list
  const handleAddNewItem = () => {
    if (newItemDescription.trim() === "") return;

    const newItem = {
      description: newItemDescription.trim(),
      qty: "",
      weight: "",
      value: "",
    };

    setPackList([...packList, newItem]);
    setNewItemDescription("");
  };

  // Remove item from pack list
  const handleRemoveItem = (index) => {
    const updatedPackList = packList.filter((_, i) => i !== index);
    setPackList(updatedPackList);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totals = packList.reduce(
      (acc, item) => {
        const qty = parseFloat(item.qty) || 0;
        const weight = parseFloat(item.weight) || 0;
        const value = parseFloat(item.value) || 0;

        return {
          totalQty: acc.totalQty + qty,
          totalWeight: acc.totalWeight + qty * weight,
          totalValue: acc.totalValue + qty * value,
        };
      },
      { totalQty: 0, totalWeight: 0, totalValue: 0 }
    );

    return totals;
  };

  // Parse number safely for display
  const parseNumber = (value) => {
    return value === "" || value == null ? "" : value;
  };

  const { totalQty, totalWeight, totalValue } = calculateTotals();
  const itemsWithValues = packList.filter(
    (item) =>
      (item.qty && item.qty !== "") ||
      (item.weight && item.weight !== "") ||
      (item.value && item.value !== "")
  ).length;

  return (
    <div className="space-y-6">
      {/* Weight and Value Section */}
      <div className="bg-gray-200 rounded-md shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaWeight className="text-blue-600 text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">
              وزن و ابعاد بسته
            </h4>
            <p className="text-gray-500 text-sm">
              مشخصات اصلی بسته را وارد کنید
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وزن کل (کیلوگرم)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                name="totalWeight"
                value={parseNumber(form.totalWeight)}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white   rounded-md focus:ring-1 focus:ring-primary  outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تعداد قطعات
            </label>
            <input
              type="number"
              min="0"
              name="piece"
              value={parseNumber(form.piece)}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-white   rounded-md focus:ring-1 focus:ring-primary  outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ارزش بسته
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                name="value"
                value={parseNumber(form.value)}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white   rounded-md focus:ring-1 focus:ring-primary  outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Date and Tracking Section */}
      <div className="bg-gray-200   rounded-md shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaCalendarAlt className="text-purple-600 text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">تاریخ ارسال</h4>
            <p className="text-gray-500 text-sm">
              تاریخ و اطلاعات رهگیری را وارد کنید
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ ارسال
            </label>
            <input
              type="date"
              name="date"
              value={form.date || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white   rounded-md focus:ring-1 focus:ring-primary  outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره رهگیری
            </label>
            <input
              type="text"
              name="track_number"
              value={form.track_number || ""}
              onChange={handleChange}
              placeholder="شماره رهگیری بسته"
              className="w-full px-4 py-3 bg-white   rounded-md focus:ring-1 focus:ring-primary  outline-none transition-all"
            />
          </div>
        </div>
      </div>
      {/* Packing List Section */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-blue-900 p-6">
          <div className="">
            <div className="md:flex space-y-3 md:space-y-0 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FaBox className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">
                    لیست بسته‌بندی
                  </h4>
                </div>
              </div>

              {/* Add New Item */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="نام کالای جدید"
                  className=" bg-white px-3 py-2  w-full  focus:outline-none rounded-md focus:ring-1 "
                  onKeyPress={(e) => e.key === "Enter" && handleAddNewItem()}
                />
                <button
                  onClick={handleAddNewItem}
                  className="px-4 py-2 bg-white text-[#0F3A76] rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                >
                  <FaPlus />
                  افزودن
                </button>
              </div>
            </div>
            <div className=" text-center pt-4">
              <p className="text-gray-300 text-sm ">
                {itemsWithValues} قلم کالا دارای مقدار • مجموع: {totalQty} عدد •{" "}
                {totalWeight.toFixed(2)} کیلوگرم • ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  شماره
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  جزئیات
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  تعداد
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  وزن (کیلوگرم)
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  ارزش ($)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packList.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4 text-center text-gray-600 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 text-right font-medium text-gray-900">
                    {item.description}
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={parseNumber(item.qty)}
                      onChange={(e) =>
                        handlePackListChange(index, "qty", e.target.value)
                      }
                      min="0"
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={parseNumber(item.weight)}
                      onChange={(e) =>
                        handlePackListChange(index, "weight", e.target.value)
                      }
                      min="0"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={parseNumber(item.value)}
                        onChange={(e) =>
                          handlePackListChange(index, "value", e.target.value)
                        }
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                      />
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        $
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackingListAndDetails;
