import React, { useState, useEffect } from "react";
import { FaBox, FaWeight, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

const PackingListAndDetails = ({ form, handleChange, setForm }) => {
    const initialItems = [
        "لباس زنانه", "مردانه لباس", "ماهی تابه", "چادر", "ملاقه", "پلون مردانه",
        "گزاره", "حاکت زنانه", "بلوز", "واسکت", "بوت", "گند افغانی", "کردن بند",
        "بیک", "کرتی", "پوش بالش", "پوش نوشک", "زیرپوش بالش", "زیرپوش نوشک",
        "قالین", "نمد", "پرده", "میوه خشک", "فروت", "گیاه یونانی", "ترموز",
        "چاینک", "پیاله"
    ];

    const [packList, setPackList] = useState(
        initialItems.map(desc => ({ description: desc, qty: "", weight: "" }))

    );

    // Sync packing list when editing
    useEffect(() => {
        if (form.packList && form.packList.length > 0) {
            const updatedPackList = initialItems.map(desc => {
                const savedItem = form.packList.find(item => item.description === desc);
                return savedItem
                    ? {
                        description: desc,
                        qty: savedItem.qty > 0 ? savedItem.qty : "",
                        weight: savedItem.weight > 0 ? savedItem.weight : ""
                    }
                    : { description: desc, qty: "", weight: "" };

            });
            setPackList(updatedPackList);
        }
    }, [form.packList]);

    // Reset packing list when parent form is reset
    useEffect(() => {
        // Check if form appears to be reset/empty
        const isFormEmpty =
            (!form.totalWeight || form.totalWeight === "0.00") &&
            (!form.piece || form.piece === "0") &&
            (!form.packList || form.packList.length === 0);

        if (isFormEmpty) {
            setPackList(initialItems.map(desc => ({ description: desc, qty: 0, weight: 0 })));
        }
    }, [form.totalWeight, form.piece, form.packList]);

    const handlePackListChange = (index, field, value) => {
        const updated = [...packList];

        // Allow empty values (important!)
        updated[index][field] = value === "" ? "" : value;

        setPackList(updated);

        // Convert values to numbers only when creating filtered list
        const filtered = updated
            .filter(item => Number(item.qty) > 0 || Number(item.weight) > 0)
            .map(item => ({
                description: item.description,
                qty: Number(item.qty) || 0,
                weight: Number(item.weight) || 0
            }));

        setForm(prev => ({ ...prev, packList: filtered }));
    };

    const autoFillFromPackingList = () => {
        const totalWeight = packList.reduce((sum, item) => sum + item.weight, 0);
        const totalPieces = packList.reduce((sum, item) => sum + item.qty, 0);

        setForm(prev => ({
            ...prev,
            totalWeight: totalWeight.toFixed(2),
            piece: totalPieces
        }));
    };

    const packListTotalWeight = packList.reduce((sum, item) => sum + item.weight, 0);
    const packListTotalPieces = packList.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className="space-y-6">
            {/* Weight & Dimensions */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaWeight className="text-blue-600" />
                    وزن و ابعاد
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-700 mb-1 block">وزن کل (کیلوگرم)</label>
                        <input
                            type="number"
                            name="totalWeight"
                            value={form.totalWeight || ""}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700 mb-1 block">تعداد قطعات</label>
                        <input
                            type="number"
                            name="piece"
                            value={form.piece || ""}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700 mb-1 block">ارزش بسته ($)</label>
                        <input
                            type="number"
                            name="value"
                            value={form.value || ""}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={autoFillFromPackingList}
                        className="px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg text-sm"
                    >
                        پرکردن خودکار از لیست
                    </button>
                </div>
            </div>

            {/* Date & Tracking */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-600" />
                    تاریخ ارسال
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-700 mb-1 block">تاریخ</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700 mb-1 block">شماره رهگیری</label>
                        <input
                            type="text"
                            name="track_number"
                            value={form.track_number || ""}
                            onChange={handleChange}
                            placeholder="شماره رهگیری بسته"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Packing List */}
            <div className="bg-white rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-sm font-semibold text-gray-700 border-b">#</th>
                                <th className="py-2 px-4 text-sm font-semibold text-gray-700 border-b">جزئیات</th>
                                <th className="py-2 px-4 text-sm font-semibold text-gray-700 border-b">تعداد</th>
                                <th className="py-2 px-4 text-sm font-semibold text-gray-700 border-b">وزن (کیلو)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {packList.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 text-center text-gray-600">{index + 1}</td>
                                    <td className="py-2 px-4 text-right">{item.description}</td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => handlePackListChange(index, 'qty', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-center"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.weight}
                                            onChange={(e) => handlePackListChange(index, 'weight', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-center"
                                            placeholder="0.00"
                                        />
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