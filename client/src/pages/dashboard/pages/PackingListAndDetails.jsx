import React, { useState, useEffect, useRef } from "react";
import { FaBox, FaWeight, FaCalendarAlt, FaPlus, FaTrash } from "react-icons/fa";

const PackingListAndDetails = ({ form, handleChange, setForm, resetTrigger }) => {
    // Initial list - this should be static
    const initialPackList = [
        { description: "لباس زنانه", qty: "", weight: "" },
        { description: "مردانه لباس", qty: "", weight: "" },
        { description: "ماهی تابه", qty: "", weight: "" },
        { description: "چادر", qty: "", weight: "" },
        { description: "ملاقه", qty: "", weight: "" },
        { description: "پلون مردانه", qty: "", weight: "" },
        { description: "گزاره", qty: "", weight: "" },
        { description: "حاکت زنانه", qty: "", weight: "" },
        { description: "بلوز", qty: "", weight: "" },
        { description: "واسکت", qty: "", weight: "" },
        { description: "بوت", qty: "", weight: "" },
        { description: "گند افغانی", qty: "", weight: "" },
        { description: "کردن بند", qty: "", weight: "" },
        { description: "بیک", qty: "", weight: "" },
        { description: "کرتی", qty: "", weight: "" },
        { description: "پوش بالش", qty: "", weight: "" },
        { description: "پوش نوشک", qty: "", weight: "" },
        { description: "زیرپوش بالش", qty: "", weight: "" },
        { description: "زیرپوش نوشک", qty: "", weight: "" },
        { description: "قالین", qty: "", weight: "" },
        { description: "نمد", qty: "", weight: "" },
        { description: "پرده", qty: "", weight: "" },
        { description: "میوه خشک", qty: "", weight: "" },
        { description: "فروت", qty: "", weight: "" },
        { description: "گیاه یونانی", qty: "", weight: "" },
        { description: "ترموز", qty: "", weight: "" },
        { description: "چاینک", qty: "", weight: "" },
        { description: "پیاله", qty: "", weight: "" },
    ];

    const [packList, setPackList] = useState(initialPackList);
    const [newItemDescription, setNewItemDescription] = useState("");
    
    // Refs to track state and prevent infinite loops
    const isInitialMount = useRef(true);
    const hasProcessedEdit = useRef(false);
    const lastFormPackList = useRef([]);

    // Reset when parent triggers it
    useEffect(() => {
        if (resetTrigger) {
            setPackList([...initialPackList]);
            setNewItemDescription("");
            hasProcessedEdit.current = false;
            lastFormPackList.current = [];
        }
    }, [resetTrigger]);

    // Handle editing mode - only when form.packList changes from parent (not from our own updates)
    useEffect(() => {
        // Skip initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Check if form.packList has changed from parent (not from our own updates)
        const currentFormPackList = form.packList || [];
        const stringifiedCurrent = JSON.stringify(currentFormPackList);
        const stringifiedLast = JSON.stringify(lastFormPackList.current);

        if (stringifiedCurrent !== stringifiedLast && currentFormPackList.length > 0) {
            // Update the reference
            lastFormPackList.current = currentFormPackList;
            
            // Mark that we've processed this edit
            hasProcessedEdit.current = true;
            
            // Start with the initial list
            const mergedList = [...initialPackList];
            
            // Add any custom items from the saved data
            const customItems = [];
            
            currentFormPackList.forEach(itemFromForm => {
                // Find if this item exists in our initial list
                const existingIndex = mergedList.findIndex(
                    item => item.description === itemFromForm.description
                );
                
                if (existingIndex !== -1) {
                    // Update existing item
                    mergedList[existingIndex] = {
                        ...mergedList[existingIndex],
                        qty: itemFromForm.qty || "",
                        weight: itemFromForm.weight || ""
                    };
                } else {
                    // Add to custom items list
                    customItems.push({
                        description: itemFromForm.description,
                        qty: itemFromForm.qty || "",
                        weight: itemFromForm.weight || ""
                    });
                }
            });
            
            // Combine initial items with custom items
            setPackList([...mergedList, ...customItems]);
        }
    }, [form.packList]);

    // Update parent form with only items that have values (with optimization)
    useEffect(() => {
        const filteredList = packList.filter(item => 
            (item.qty && item.qty !== "") || 
            (item.weight && item.weight !== "")
        );

        // Only update if there's a real change
        const stringifiedFiltered = JSON.stringify(filteredList);
        const stringifiedCurrent = JSON.stringify(form.packList || []);

        if (stringifiedFiltered !== stringifiedCurrent) {
            setForm(prev => ({
                ...prev,
                packList: filteredList
            }));
        }
    }, [packList, setForm, form.packList]);

    // Handle pack list item changes
    const handlePackListChange = (index, field, value) => {
        // Remove leading zeros for better UX
        const cleanValue = value === "" ? "" :
            field === 'description' ? value :
                value.replace(/^0+(?=\d)/, '');

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
            weight: ""
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
        const totals = packList.reduce((acc, item) => {
            const qty = parseFloat(item.qty) || 0;
            const weight = parseFloat(item.weight) || 0;

            return {
                totalQty: acc.totalQty + qty,
                totalWeight: acc.totalWeight + (qty * weight)
            };
        }, { totalQty: 0, totalWeight: 0 });

        return totals;
    };

    // Parse number safely for display
    const parseNumber = (value) => {
        return value === "" || value == null ? "" : value;
    };

    const { totalQty, totalWeight } = calculateTotals();
    const itemsWithValues = packList.filter(item =>
        (item.qty && item.qty !== "") ||
        (item.weight && item.weight !== "")
    ).length;

    return (
        <div className="space-y-6">
            {/* Date and Tracking Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <FaCalendarAlt className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-lg">تاریخ ارسال</h4>
                        <p className="text-gray-500 text-sm">تاریخ و اطلاعات رهگیری را وارد کنید</p>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Weight and Value Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FaWeight className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-lg">وزن و ابعاد بسته</h4>
                        <p className="text-gray-500 text-sm">مشخصات اصلی بسته را وارد کنید</p>
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
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                کیلو
                            </span>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
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
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                $
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packing List Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <FaBox className="text-white text-xl" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-lg">لیست بسته‌بندی</h4>
                                <p className="text-gray-300 text-sm mt-1">
                                    {itemsWithValues} قلم کالا دارای مقدار • مجموع: {totalQty} عدد • {totalWeight.toFixed(2)} کیلوگرم
                                </p>
                            </div>
                        </div>

                        {/* Add New Item */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItemDescription}
                                onChange={(e) => setNewItemDescription(e.target.value)}
                                placeholder="نام کالای جدید"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddNewItem()}
                            />
                            <button
                                onClick={handleAddNewItem}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <FaPlus />
                                افزودن
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
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
                                    حذف
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {packList.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 text-center text-gray-600 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="py-4 px-4 text-right font-medium text-gray-900">
                                        {item.description}
                                    </td>
                                    <td className="py-4 px-4">
                                        <input
                                            type="number"
                                            value={parseNumber(item.qty)}
                                            onChange={(e) => handlePackListChange(index, 'qty', e.target.value)}
                                            min="0"
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                                        />
                                    </td>
                                    <td className="py-4 px-4">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={parseNumber(item.weight)}
                                            onChange={(e) => handlePackListChange(index, 'weight', e.target.value)}
                                            min="0"
                                            placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                                        />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="حذف این کالا"
                                        >
                                            <FaTrash />
                                        </button>
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