import React from "react";
import moment from "moment-jalaali";
import { FaPhone, FaPrint, FaTimes } from "react-icons/fa";
import Regulation from "./Regulations";

const PrintShippingBill = ({ isOpen, onClose, data }) => {
  console.log(data);

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
          className="scale-[0.65] print:scale-[1] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col print:shadow-none print:rounded-none"
          style={{
            width: "210mm",
            height: "297mm",
            direction: "rtl",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-blue-800 to-blue-600 text-white p-4 border-b-4 border-blue-900 flex   items-center justify-between">
            {/* Logo and Company Name */}
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <img
                src="/logo.png"
                alt="Afghan Cargo Logo"
                className="h-16 w-16 object-contain rounded-full border-2 border-white"
              />
              <div className="flex flex-col text-center md:text-left">
                <h1 className="text-2xl font-bold leading-tight">افغان کارگو</h1>
                <p className="text-sm opacity-90">Afghan Cargo Services</p>
              </div>
            </div>

            {/* Bill Info */}
            <div className="flex flex-col items-center md:items-end text-xs">
              <span className="mb-1">
                <strong>شماره بل:</strong> {billNumber}
              </span>
              <span>
                <strong>تاریخ:</strong> {today}
              </span>
            </div>
          </div>

          {/* Sender Info */}
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1 border-gray-300">
              معلومات ارسال‌کننده
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p>
                <span className="font-semibold">نام:</span> {data.Sender.name}
              </p>
              <p>
                <span className="font-semibold">شماره تماس:</span>{" "}
                {data.Sender.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">آدرس:</span>{" "}
                {data.Sender.address}
              </p>
              <p>
                <span className="font-semibold">ایمیل:</span> {data.Sender.email}
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
                <span className="font-semibold">نام:</span> {data.Receiver.name}
              </p>
              <p>
                <span className="font-semibold">شماره تماس:</span>{" "}
                {data.Receiver.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">آدرس:</span>{" "}
                {data.Receiver.address}
              </p>
              <p>
                <span className="font-semibold">ایمیل:</span> {data.Receiver.email}
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

                </tr>
                <tr>
                  <td className="border border-gray-300 p-1 font-semibold">
                    وزن:
                  </td>
                  <td className="border border-gray-300 p-1">
                    {data.totalWeight} کیلوگرام
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
                    {formatCurrency(data.value)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bill Summary */}
          <div className="flex border-t h-[110px] border-gray-300 bg-gray-50">
            {/* Left Half — Totals Section */}
            <div className="w-1/2 border-l border-gray-300 p-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1 text-sm">
                  <span>مجموع کل:</span>
                  <span className="text-cyan-800">{formatCurrency(data.totalCash)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1 text-sm">
                  <span>
                    <strong>دریافتی :</strong>
                  </span>
                  <span className="text-green-600">
                    {formatCurrency(data.received || 0)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                  <span
                    className={data.remain > 0 ? "text-red-600" : "text-green-600"}
                  >
                    باقیمانده:
                  </span>
                  <span
                    className={data.remain > 0 ? "text-red-600" : "text-green-600"}
                  >
                    {formatCurrency(data.remain)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Half — Signature and Stamp Section */}
            <div className="w-1/2 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-full   border-gray-400 h-28 flex flex-col items-center justify-center">
                <p className="text-gray-600 text-sm font-semibold">
                  محل امضاء و مُهر
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            id="footer-area"
            className="bg-gray-800 text-white p-3 text-center text-xs"
          >
            {/* Phone Numbers */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <FaPhone className="text-cyan-300" />
              <span>تماس: 0789384700 - 0799306437 - 0748852569</span>
            </div>

            {/* Address */}
            <p className="text-cyan-200 mt-1">
              آدرس:مارکیت بهار سراب، تانک تیل،دشت برچی، کابل، افغانستان
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
        <button><Regulation data={data}/></button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
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
            width: 210mm !important;
            height: 297mm !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintShippingBill;
