import React, { useEffect, useState } from "react";
import { packageService } from "../services/packageService";
import Pagination from "../pagination/Pagination";
import { FaEdit, FaPrint } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PrintShippingBill from "../pages/PrintShippingBill"; // ✅ import the bill component

const PackageList = ({ refreshTrigger, onEdit, onDelete }) => {
  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ State for Print Bill modal
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isBillOpen, setIsBillOpen] = useState(false);

  const fetchPackages = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await packageService.getAll(pageNumber, limit);
      if (response.success) {
        setPackages(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(page);
  }, [page, refreshTrigger]);

  const handlePrintBill = (pkg) => {
    setSelectedPackage(pkg);
    setIsBillOpen(true);
  };

  const handleCloseBill = () => {
    setIsBillOpen(false);
    setSelectedPackage(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center text-gray-700">
        لیست بسته‌ها 📦
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full text-sm text-gray-700 border">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-2 border">شماره</th>
                <th className="p-2 border">نام گیرنده</th>
                <th className="p-2 border">کشور</th>
                <th className="p-2 border">نام فرستنده</th>
                <th className="p-2 border">وزن (کیلوگرام)</th>
                <th className="p-2 border">مقدار پول</th>
                <th className="p-2 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">{pkg.id}</td>
                    <td className="p-2 border">{pkg.receiverName}</td>
                    <td className="p-2 border">{pkg.country}</td>
                    <td className="p-2 border">{pkg.senderName}</td>
                    <td className="p-2 border text-center">{pkg.goodWeight}</td>
                    <td className="p-2 border text-center">{pkg.totalCash}</td>
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

                        {/* ✅ Print Bill button */}
                        <button
                          onClick={() => handlePrintBill(pkg)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="چاپ بل"
                        >
                          <FaPrint size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
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
