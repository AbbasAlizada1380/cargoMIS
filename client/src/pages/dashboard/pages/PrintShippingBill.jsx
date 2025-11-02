import React from "react";
import moment from "moment-jalaali";
import { FaPhone, FaPrint, FaTimes } from "react-icons/fa";

const PrintShippingBill = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const formatCurrency = (num) => {
    const number = Number(num || 0);
    return number.toLocaleString("fa-AF") + " افغانی";
  };

  const handlePrint = () => window.print();

  const billNumber = data.id
    ? `${data.id}`
    : `${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const today = moment(data.createdAt).format("jYYYY/jMM/jDD");

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 print:bg-transparent print:p-0">
      <div>
        <div
          id="printable-area"
          className="bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col print:shadow-none print:rounded-none"
          style={{
            width: "148mm",
            height: "210mm",
            direction: "rtl",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-blue-800 to-blue-600 text-white p-4 text-center border-b-4 border-blue-900">
            <h1 className="text-xl font-bold mb-1">افغان کارگو</h1>
            <p className="text-sm opacity-90">Afghan Cargo Services</p>
            <div className="flex justify-between items-center mt-2 text-xs">
              <span>شماره بل: {billNumber}</span>
              <span>تاریخ: {today}</span>
            </div>
          </div>

          {/* Sender Info */}
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1 border-gray-300">
              معلومات ارسال‌کننده
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p>
                <span className="font-semibold">نام:</span> {data.senderName}
              </p>
              <p>
                <span className="font-semibold">شماره تماس:</span>{" "}
                {data.senderPhone}
              </p>
              <p>
                <span className="font-semibold">آدرس:</span>{" "}
                {data.senderAddress}
              </p>
              <p>
                <span className="font-semibold">ایمیل:</span> {data.senderEmail}
              </p>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1 border-gray-300">
              معلومات دریافت‌کننده
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p>
                <span className="font-semibold">نام:</span> {data.receiverName}
              </p>
              <p>
                <span className="font-semibold">شماره تماس:</span>{" "}
                {data.receiverPhone}
              </p>
              <p>
                <span className="font-semibold">آدرس:</span>{" "}
                {data.receiverAddress}
              </p>
              <p>
                <span className="font-semibold">ایمیل:</span>{" "}
                {data.receiverEmail}
              </p>
            </div>
          </div>

          {/* Goods Details */}
          <div className="flex-1 p-3">
            <h3 className="text-sm font-bold text-blue-700 mb-2 bg-blue-50 p-2 rounded border-r-4 border-blue-500">
              جزئیات محموله
            </h3>
            <table className="w-full text-xs border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-1 font-semibold w-32">
                    توضیحات:
                  </td>
                  <td className="border border-gray-300 p-1">
                    {data.goodsDetails}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 font-semibold">
                    وزن:
                  </td>
                  <td className="border border-gray-300 p-1">
                    {data.goodWeight} کیلوگرام
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 font-semibold">
                    تعداد:
                  </td>
                  <td className="border border-gray-300 p-1">{data.piece}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 font-semibold">
                    قیمت هر کیلو:
                  </td>
                  <td className="border border-gray-300 p-1">
                    {formatCurrency(data.perKgCash)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 font-semibold">
                    ارزش اجناس:
                  </td>
                  <td className="border border-gray-300 p-1">
                    {formatCurrency(data.goodsValue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-300 bg-gray-50 p-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>مجموع کل:</span>
                <span className="font-bold text-blue-700">
                  {formatCurrency(data.totalCash)}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                <span className={"text-green-600"}>دریافتی:</span>
                <span
                  className={ "text-لقثثد-600" 
                  }
                >
                  {formatCurrency(data.totalCash-data.remain)}
                </span>
              </div>{" "}
              <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                <span
                  className={
                    data.remain > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  باقیمانده:
                </span>
                <span
                  className={
                    data.remain > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  {formatCurrency(data.remain)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 text-white p-3 text-center text-xs">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FaPhone className="text-blue-300" />
              <span>تماس: ۰۷۸۹ـــ۶۷۸۸۹۶</span>
            </div>
            <p className="text-blue-200">
              از اعتماد شما به افغان کارگو سپاس‌گزاریم!
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute bottom-6 left-6 flex gap-3 print:hidden">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 shadow-lg transition-colors"
        >
          <FaTimes size={14} /> بستن
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-lg transition-colors"
        >
          <FaPrint size={14} /> چاپ بل
        </button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A5 portrait;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #printable-area,
          #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 148mm !important;
            height: 210mm !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintShippingBill;
