
import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaBox,
  FaUser,
  FaWeightHanging,
  FaCube,
  FaMoneyBillWave,
  FaTruck,
  FaReceipt,
  FaMoneyCheck,
  FaCalendar,
  FaFlag,
  FaPhone,
  FaPrint,
  FaTimes,
  FaCopy,
  FaDownload
} from "react-icons/fa";
import moment from "moment-jalaali";
import PrintShippingBill from "./PrintShippingBill";

const PackageList = ({ packages, onEdit, onDelete, mode }) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const handlePrintClick = (pkg) => {
    setSelectedPackage(pkg);
    setIsPrintModalOpen(true);
    console.log(isPrintModalOpen);

  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
    setSelectedPackage(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    if (!selectedPackage) return;

    const billText = generateBillText(selectedPackage);
    navigator.clipboard.writeText(billText)
      .then(() => alert("متن صورت‌حساب در کلیپ‌بورد کپی شد"))
      .catch(err => console.error("خطا در کپی کردن:", err));
  };

  const generateBillText = (pkg) => {
    return `
صورت‌حساب حمل و نقل
====================
کد بسته: ${pkg.id}
تاریخ: ${formatDate(pkg.createdAt)}

مشخصات فرستنده:
- نام: ${pkg.Sender?.name || "نامشخص"}
- آدرس: ${pkg.Sender?.address || "نامشخص"}
- تلفن: ${pkg.Sender?.phoneNumber || "نامشخص"}
- کشور: ${pkg.Sender?.country || "نامشخص"}

مشخصات گیرنده:
- نام: ${pkg.Receiver?.name || "نامشخص"}
- آدرس: ${pkg.Receiver?.address || "نامشخص"}
- تلفن: ${pkg.Receiver?.phoneNumber || "نامشخص"}
- کشور: ${pkg.Receiver?.country || "نامشخص"}

مشخصات بسته:
- وزن کل: ${pkg.totalWeight} کیلوگرم
- تعداد قطعات: ${pkg.piece}
- ارزش: ${formatCurrency(pkg.value)}
- روش حمل: ${pkg.transitWay}

اطلاعات مالی:
- نرخ هر کیلو: ${formatCurrency(pkg.perKgCash)}
- مجموع کل: ${formatCurrency(pkg.totalCash)}
- دریافتی: ${formatCurrency(pkg.received)}
- مانده: ${formatCurrency(pkg.remain)}

نرخ دفتری:
- نرخ هر کیلو: ${formatCurrency(pkg.OPerKgCash)}
- مجموع دفتری: ${formatCurrency(pkg.OTotalCash)}

تاریخ صدور: ${moment().format("jYYYY/jMM/jDD")}
امضاء مسئول: ______________
`;
  };

  const generateReceipt = () => {
    if (!selectedPackage) return "";

    return `
رسید دریافت وجه
================
کد رسید: RC-${selectedPackage.id}-${Date.now().toString().slice(-6)}
تاریخ: ${moment().format("jYYYY/jMM/jDD HH:mm")}

مشخصات پرداخت:
مبلغ: ${formatCurrency(selectedPackage.received)}
بابت: حمل و نقل بسته شماره ${selectedPackage.id}
روش پرداخت: نقدی

فرستنده: ${selectedPackage.Sender?.name || "نامشخص"}
گیرنده: ${selectedPackage.Receiver?.name || "نامشخص"}

مشخصات باقی‌مانده:
مبلغ کل: ${formatCurrency(selectedPackage.totalCash)}
پرداخت شده: ${formatCurrency(selectedPackage.received)}
باقیمانده: ${formatCurrency(selectedPackage.remain)}

تاریخ سررسید: ${moment().add(30, 'days').format("jYYYY/jMM/jDD")}

امضاء دریافت‌کننده: ______________
`;
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl shadow-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBox className="text-3xl" />
            <div>
              <h2 className="text-2xl font-bold">لیست بسته‌ها</h2>
              <p className="text-blue-100 text-sm mt-1">
                مجموع: {packages.length} بسته
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="text-xs">بسته‌های فعال</div>
              <div className="font-bold">{packages.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      {packages.length > 0 && (
        <div className="bg-white p-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-blue-600" />
                <span className="text-sm text-gray-600">مجموع دریافتی</span>
              </div>
              <div className="text-xl font-bold text-blue-700 mt-1">
                {formatCurrency(packages.reduce((sum, pkg) => sum + parseFloat(pkg.received || 0), 0))}
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FaMoneyCheck className="text-orange-600" />
                <span className="text-sm text-gray-600">مجموع مانده</span>
              </div>
              <div className="text-xl font-bold text-orange-700 mt-1">
                {formatCurrency(packages.reduce((sum, pkg) => sum + parseFloat(pkg.remain || 0), 0))}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FaReceipt className="text-green-600" />
                <span className="text-sm text-gray-600">مجموع کل</span>
              </div>
              <div className="text-xl font-bold text-green-700 mt-1">
                {formatCurrency(packages.reduce((sum, pkg) => sum + parseFloat(pkg.totalCash || 0), 0))}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FaWeightHanging className="text-purple-600" />
                <span className="text-sm text-gray-600">مجموع وزن</span>
              </div>
              <div className="text-xl font-bold text-purple-700 mt-1">
                {packages.reduce((sum, pkg) => sum + parseFloat(pkg.totalWeight || 0), 0).toFixed(2)} کیلوگرم
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Packages Table */}
      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        {packages.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">بسته‌ای یافت نشد</p>
            <p className="text-gray-400 text-sm mt-2">هنوز هیچ بسته‌ای ثبت نشده است</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaBox className="text-gray-500" />
                      شناسه
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-500" />
                      فرستنده
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-500" />
                      گیرنده
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaWeightHanging className="text-gray-500" />
                      وزن
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaCube className="text-gray-500" />
                      قطعات
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaReceipt className="text-gray-500" />
                      مجموع کل
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-gray-500" />
                      دریافتی
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaMoneyCheck className="text-gray-500" />
                      مانده
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaTruck className="text-gray-500" />
                      روش حمل
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-gray-500" />
                      تاریخ
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-gray-50 transition-colors"
                  >

                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">
                        #{pkg.id}
                      </div>
                    </td>

                    {/* Sender Column */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">
                          {pkg.Sender?.name || "نامشخص"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <FaFlag className="text-xs" />
                            {pkg.Sender?.country || "نامشخص"}
                          </div>
                          {pkg.Sender?.phoneNumber && (
                            <div className="flex items-center gap-1 mt-1">
                              <FaPhone className="text-xs" />
                              {pkg.Sender.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Receiver Column */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">
                          {pkg.Receiver?.name || "نامشخص"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <FaFlag className="text-xs" />
                            {pkg.Receiver?.country || "نامشخص"}
                          </div>
                          {pkg.Receiver?.phoneNumber && (
                            <div className="flex items-center gap-1 mt-1">
                              <FaPhone className="text-xs" />
                              {pkg.Receiver.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Weight Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FaWeightHanging className="text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {parseFloat(pkg.totalWeight || 0).toFixed(2)} کیلوگرم
                          </div>
                          <div className="text-xs text-gray-500">
                            {pkg.OPerKgCash ? `$${pkg.OPerKgCash}/کیلو` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Pieces Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FaCube className="text-purple-500" />
                        <span className="font-medium">{pkg.piece || 0}</span>
                      </div>
                    </td>

                    {/* Total Cash Column */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="font-bold text-green-700">
                          {formatCurrency(pkg.totalCash)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {pkg.perKgCash ? `$${pkg.perKgCash}/کیلو` : ""}
                        </div>
                      </div>
                    </td>

                    {/* Received Column */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-blue-700">
                        {formatCurrency(pkg.received)}
                      </div>
                      {pkg.totalCash > 0 && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">
                          {((parseFloat(pkg.received || 0) / parseFloat(pkg.totalCash || 1)) * 100).toFixed(1)}%
                        </div>
                      )}
                    </td>

                    {/* Remain Column */}
                    <td className="py-3 px-4">
                      <div className={`font-medium ${parseFloat(pkg.remain || 0) > 0
                        ? 'text-orange-700'
                        : 'text-green-700'
                        }`}>
                        {formatCurrency(pkg.remain)}
                      </div>
                      {parseFloat(pkg.remain || 0) > 0 && (
                        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full mt-1 inline-block">
                          پرداخت نشده
                        </div>
                      )}
                    </td>

                    {/* Transit Way Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-indigo-500" />
                        <span className="text-sm font-medium">{pkg.transitWay || "نامشخص"}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {pkg.OTotalCash ? `دفتری: ${formatCurrency(pkg.OTotalCash)}` : ""}
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(pkg.createdAt)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(pkg.createdAt).toLocaleTimeString('fa-IR')}
                      </div>
                    </td>

                    {/* Actions Column - Updated چاپ button */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {mode !== "list" && (
                          <button
                            onClick={() => onEdit(pkg)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                            title="ویرایش"
                          >
                            <FaEdit className="text-sm" />
                            <span className="text-xs hidden sm:inline">ویرایش</span>
                          </button>
                        )}

                        <button
                          onClick={() => onDelete(pkg.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                          title="حذف"
                        >
                          <FaTrash className="text-sm" />
                          <span className="text-xs hidden sm:inline">حذف</span>
                        </button>

                        {/* چاپ Button - Changed to Print icon */}
                        <button
                          onClick={() => handlePrintClick(pkg)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                          title="چاپ صورت‌حساب"
                        >
                          <FaPrint className="text-sm" />
                          <span className="text-xs hidden sm:inline">چاپ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )} {isPrintModalOpen && (
          < PrintShippingBill isOpen={isPrintModalOpen} onClose={handleClosePrintModal} mode={"list"} data={selectedPackage} />
        )}
      </div>

      {/* Print Modal */}

    </div>
  );
};

export default PackageList;