import React from "react";
import Pagination from "../pagination/Pagination";
import { FaEdit, FaPrint } from "react-icons/fa";
import { MdDelete, MdUpdate } from "react-icons/md";
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
    COMMON_LOCATIONS
  } = usePackageList(refreshTrigger, onEdit, onDelete);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center text-gray-700">
        لیست بسته‌ها 📦
      </h1>

      {/* ✅ Bulk Update Section */}
      {selectedPackages.size > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-blue-700 font-medium">
              {selectedPackages.size} بسته انتخاب شده است
            </span>

            <select
              value={bulkLocation}
              onChange={(e) => setBulkLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">انتخاب موقعیت جدید</option>
              {COMMON_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {locationLabels[loc]}
                </option>
              ))}
            </select>

            <button
              onClick={handleBulkLocationUpdate}
              disabled={isUpdating || !bulkLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <MdUpdate size={18} />
              {isUpdating ? "در حال به‌روزرسانی..." : "به‌روزرسانی موقعیت"}
            </button>

            <button
              onClick={() => setSelectedPackages(new Set())}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              لغو انتخاب
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full text-sm text-gray-700 border">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-2 border">
                  <input
                    type="checkbox"
                    checked={
                      selectedPackages.size === packages.length &&
                      packages.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="p-2 border">شماره</th>
                <th className="p-2 border">نام گیرنده</th>
                <th className="p-2 border">کشور</th>
                <th className="p-2 border">نام فرستنده</th>
                <th className="p-2 border">وزن (کیلوگرام)</th>
                <th className="p-2 border">دریافتی</th>
                <th className="p-2 border">باقی</th>
                <th className="p-2 border">مجموعی</th>
                <th className="p-2 border">موفقیت</th>
                <th className="p-2 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={selectedPackages.has(pkg.id)}
                        onChange={() => handlePackageSelect(pkg.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2 border text-center">{pkg.id}</td>
                    <td className="p-2 border">{pkg.receiverName}</td>
                    <td className="p-2 border">{pkg.country}</td>
                    <td className="p-2 border">{pkg.senderName}</td>
                    <td className="p-2 border text-center">{pkg.goodWeight}</td>
                    <td className="p-2 border text-center">{pkg.recip}</td>
                    <td className="p-2 border text-center">{pkg.remain}</td>
                    <td className="p-2 border text-center">{pkg.totalCash}</td>
                    <td className="p-2 border text-center">{pkg.location}</td>
                    <td className="p-2 border text-center">
                      <div className="flex justify-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => onEdit(pkg.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="ویرایش"
                        >
                          <FaEdit size={18} />
                        </button>

                        <button
                          onClick={() => onDelete(pkg.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="حذف"
                        >
                          <MdDelete size={20} />
                        </button>

                        <button
                          onClick={() => handlePrintBill(pkg)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="چاپ بل"
                        >
                          <FaPrint size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateLocation(pkg.id, "in transit")
                          }
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                          title="به‌روزرسانی موقعیت"
                        >
                          <MdUpdate size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center text-gray-500 py-3 border"
                  >
                    هیچ بسته‌ای یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Component */}
      {meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page || 1}
          totalPages={meta.totalPages || 1}
          onPageChange={setPage}
        />
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
  );
};

export default PackageList;
