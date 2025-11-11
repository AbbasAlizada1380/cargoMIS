import React from "react";
import Pagination from "../pagination/Pagination";
import { FaEdit, FaPrint, FaBox, FaCheckCircle } from "react-icons/fa";
import { MdDelete, MdUpdate, MdLocalShipping } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import PrintShippingBill from "../pages/PrintShippingBill";
import { usePackageList } from "../pages/hooks/usePackageList.js";

const PackageList = ({ refreshTrigger, onEdit, onDelete }) => {
  const {
    packages,
    page,
    meta,
    loading,
    selectedPackage,
    isBillOpen,
    selectedPackages,
    bulkLocation,
    isUpdating,
    setPage,
    setBulkLocation,
    handleUpdateLocation,
    handleBulkLocationUpdate,
    handlePackageSelect,
    handleSelectAll,
    handlePrintBill,
    handleCloseBill,
    locationLabels,
  } = usePackageList(refreshTrigger, onEdit, onDelete);

  // Status badge styling
  const getStatusBadge = (location) => {
    const statusColors = {
      "cargo stock in kabul": "bg-blue-100 text-blue-800 border-blue-200",
      "in transit": "bg-yellow-100 text-yellow-800 border-yellow-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const defaultColor = "bg-purple-100 text-purple-800 border-purple-200";
    return statusColors[location] || defaultColor;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <FaBox className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              لیست بسته‌ها
              <span className="mr-2">📦</span>
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            مدیریت و پیگیری تمام بسته‌های ثبت شده در سیستم
          </p>
        </div>

        {/* ✅ Bulk Update Section */}
        {selectedPackages.size > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-blue-800 font-semibold text-lg">
                  {selectedPackages.size} بسته انتخاب شده است
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={bulkLocation}
                  onChange={(e) => setBulkLocation(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 min-w-[200px]"
                >
                  <option value="">انتخاب موقعیت جدید</option>
                  {Object.entries(locationLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleBulkLocationUpdate}
                  disabled={isUpdating || !bulkLocation}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  <MdUpdate size={20} />
                  {isUpdating ? "در حال به‌روزرسانی..." : "به‌روزرسانی موقعیت"}
                </button>

                <button
                  onClick={() => setSelectedPackages(new Set())}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  لغو انتخاب
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">
                در حال بارگذاری بسته‌ها...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <IoLocationSharp className="text-blue-500 text-xl ml-2" />
                  <h2 className="text-lg font-bold text-gray-800">
                    لیست کامل بسته‌ها
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                    مجموع: {meta.total || 0} بسته
                  </span>
                  <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    صفحه {page} از {meta.totalPages || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
                  <tr>
                    <th className="p-4 border-l border-gray-200">
                      <input
                        type="checkbox"
                        checked={
                          selectedPackages.size === packages.length &&
                          packages.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                      />
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200">
                      شماره
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200 min-w-[150px]">
                      نام گیرنده
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200">
                      کشور
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200 min-w-[150px]">
                      نام فرستنده
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200">
                      وزن
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200">
                      دریافتی
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200">
                      باقی
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200">
                      مجموعی
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700 border-l border-gray-200">
                      وضعیت
                    </th>
                    <th className="p-4 text-right font-bold text-gray-700">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.length > 0 ? (
                    packages.map((pkg, index) => (
                      <tr
                        key={pkg.id}
                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="p-4 border-l border-gray-100 text-center">
                          <input
                            type="checkbox"
                            checked={selectedPackages.has(pkg.id)}
                            onChange={() => handlePackageSelect(pkg.id)}
                            className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                          />
                        </td>
                        <td className="p-4 border-l border-gray-100 text-center">
                          <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            #{pkg.id}
                          </span>
                        </td>
                        <td className="p-4 border-l border-gray-100 font-medium text-gray-800">
                          {pkg.receiverName}
                        </td>
                        <td className="p-4 border-l border-gray-100">
                          <span className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                            {pkg.country}
                          </span>
                        </td>
                        <td className="p-4 border-l border-gray-100 font-medium text-gray-800">
                          {pkg.senderName}
                        </td>
                        <td className="p-4 border-l border-gray-100 text-center font-bold text-gray-700">
                          <span className="bg-gray-100 px-3 py-1 rounded-lg">
                            {pkg.goodWeight} kg
                          </span>
                        </td>
                        <td className="p-4 border-l border-gray-100 text-center">
                          <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">
                            ${pkg.recip}
                          </span>
                        </td>
                        <td className="p-4 border-l border-gray-100 text-center">
                          <span
                            className={`font-bold px-2 py-1 rounded-lg ${
                              pkg.remain > 0
                                ? "text-orange-600 bg-orange-50"
                                : "text-green-600 bg-green-50"
                            }`}
                          >
                            ${pkg.remain}
                          </span>
                        </td>
                        <td className="p-4 border-l border-gray-100 text-center">
                          <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg">
                            ${pkg.totalCash}
                          </span>
                        </td>
                        <td className="p-4 border-l border-gray-100 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                              pkg.location
                            )}`}
                          >
                            {pkg.location}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => onEdit(pkg.id)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              title="ویرایش"
                            >
                              <FaEdit size={16} />
                            </button>

                            <button
                              onClick={() => onDelete(pkg.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              title="حذف"
                            >
                              <MdDelete size={18} />
                            </button>

                            <button
                              onClick={() => handlePrintBill(pkg)}
                              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              title="چاپ بل"
                            >
                              <FaPrint size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FaBox className="text-4xl text-gray-300 mb-4" />
                          <p className="text-lg font-medium mb-2">
                            هیچ بسته‌ای یافت نشد
                          </p>
                          <p className="text-sm text-gray-400">
                            هنوز هیچ بسته‌ای در سیستم ثبت نشده است
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {packages.length > 0 && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500 ml-2" />
                    نمایش {packages.length} بسته از {meta.total} بسته
                  </div>
                  <div className="text-sm text-gray-500">
                    آخرین به‌روزرسانی: هم اکنون
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination Component */}
        {meta.totalPages > 1 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <Pagination
              currentPage={meta.page || 1}
              totalPages={meta.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* ✅ Print Bill Modal */}
        {isBillOpen && (
          <PrintShippingBill
            isOpen={isBillOpen}
            onClose={handleCloseBill}
            data={selectedPackage}
          />
        )}
      </div>
    </div>
  );
};

export default PackageList;
