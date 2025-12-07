import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment-jalaali";
import { Download, Calendar, Filter, FileText, TrendingUp, RefreshCw } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
import VazirmatnTTF from "../../../../../public/ttf/Vazirmatn.js";
import Regulation from "../Regulations.jsx";

const OrderDownload = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transitWays, setTransitWays] = useState([]);
  const [selectedTransitWay, setSelectedTransitWay] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalWeight: 0,
    totalCash: 0
  });

  // 🔹 Load transit ways on mount
  useEffect(() => {
    const fetchTransitWays = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${BASE_URL}/packages/transitWays`);
        setTransitWays(res.data.data || []);
      } catch (error) {
        console.error("Error fetching transit ways:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchTransitWays();
  }, []);

  const handleDownload = async () => {
    if (!startDate || !endDate || !selectedTransitWay) {
      alert("لطفاً تاریخ‌ها و ترانزیت‌وی را انتخاب کنید");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Send transitWay in API request
      const response = await axios.get(
        `${BASE_URL}/packages/Range?startDate=${startDate}&endDate=${endDate}&transitWay=${selectedTransitWay}`
      );
console.log(response.data)
      const orders = response.data.data;
      if (!orders || orders.length === 0) {
        alert("هیچ سفارشی مطابق این فیلترها یافت نشد");
        return;
      }

      // Calculate statistics
      const totalWeight = orders.reduce((sum, order) => sum + (order.totalWeight || 0), 0);
      const totalCash = orders.reduce((sum, order) => sum + (order.OTotalCash || 0), 0);

      setStats({
        totalOrders: orders.length,
        totalWeight,
        totalCash
      });

      // ===================== PDF Generation =====================
      const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
      });

      doc.addFileToVFS("Vazirmatn.ttf", VazirmatnTTF);
      doc.addFont("Vazirmatn.ttf", "Vazirmatn", "normal");
      doc.setFont("Vazirmatn");

      // Header
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');

      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text("گزارش سفارشات ترانزیت", doc.internal.pageSize.width - 40, 35, { align: "right" });

      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `از ${moment(startDate).format("jYYYY/jMM/jDD")} تا ${moment(endDate).format("jYYYY/jMM/jDD")} - ${selectedTransitWay}`,
        doc.internal.pageSize.width - 40,
        55,
        { align: "right" }
      );

      // Table headers with better styling
      const headers = [
        [
          "تعداد",
          "تاریخ",
          "مجموع",
          "وزن",
          "قیمت",
          "نام فرستنده",
          "نام گیرنده",
          "شماره بیل",
        ],
      ];

      const data = orders.map((order) => [
        (order.piece || 0).toLocaleString("fa-AF") + " بسته",
        moment(order.createdAt).format("jYYYY/jMM/jDD"),
        (order.OTotalCash || 0).toLocaleString("fa-AF") + " دالر",
        (order.totalWeight || 0).toLocaleString("fa-AF") + " کیلوگرم",
        (order.OPerKgCash || 0).toLocaleString("fa-AF") + " دالر",
        order.Sender?.name || "-",
        order.Receiver?.name || "-",
        order.id,
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 80,
        margin: { right: 40, left: 40 },
        styles: {
          font: "Vazirmatn",
          fontStyle: "normal",
          halign: "center",
          fontSize: 9,
          cellPadding: 8,
          lineColor: [229, 231, 235],
          lineWidth: 0.5,
        },
        headStyles: {
          font: "Vazirmatn",
          fontStyle: "bold",
          halign: "center",
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 10,
          cellPadding: 10,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        didParseCell: function (data) {
          data.cell.styles.font = "Vazirmatn";
          data.cell.styles.fontStyle = "normal";
        },
        theme: "striped",
      });

      // Footer with summary
      const finalY = doc.lastAutoTable.finalY + 30;

      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text("خلاصه گزارش:", doc.internal.pageSize.width - 40, finalY, { align: "right" });

      doc.setFontSize(10);
      doc.text(
        `تعداد سفارشات: ${orders.length} | وزن کل: ${totalWeight} کیلوگرم | مجموع مبالغ: ${totalCash.toLocaleString("fa-AF")} افغانی`,
        doc.internal.pageSize.width - 40,
        finalY + 20,
        { align: "right" }
      );

      // Signature
      doc.text("امضاء و مهر:", doc.internal.pageSize.width - 40, finalY + 50, { align: "right" });
      doc.line(doc.internal.pageSize.width - 200, finalY + 55, doc.internal.pageSize.width - 40, finalY + 55);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `تاریخ تولید: ${moment().format("jYYYY/jMM/jDD HH:mm")}`,
        40,
        doc.internal.pageSize.height - 20,
        { align: "left" }
      );
      doc.text(
        "سیستم مدیریت ترانزیت",
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 20,
        { align: "right" }
      );

      // Save PDF
      doc.save(
        `orders_report_${selectedTransitWay}_${startDate}_to_${endDate}.pdf`
      );

    } catch (error) {
      console.error("Error downloading:", error);
      alert("خطا در دریافت اطلاعات!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setSelectedTransitWay("");
    setStats({ totalOrders: 0, totalWeight: 0, totalCash: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                گزارش‌گیری سفارشات ترانزیت
              </h1>
              <p className="text-gray-600 mt-2">
                فیلتر و دانلود گزارش سفارشات بر اساس تاریخ و طریق ترانزیت
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Filters */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg">
                  <Filter className="w-6 h-6 text-cyan-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mr-3">
                  فیلترهای گزارش
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date Range */}
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-cyan-600" />
                      <label className="block text-sm font-medium text-gray-700">
                        محدوده تاریخ
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                          focus:outline-none focus:border-cyan-500 focus:bg-white 
                          transition-all duration-300 text-gray-800
                          hover:border-gray-300"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span className="absolute -top-2 right-3 px-2 bg-white text-xs text-gray-500">
                          تاریخ شروع
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                          focus:outline-none focus:border-cyan-500 focus:bg-white 
                          transition-all duration-300 text-gray-800
                          hover:border-gray-300"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <span className="absolute -top-2 right-3 px-2 bg-white text-xs text-gray-500">
                          تاریخ پایان
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transit Way Selector */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <label className="block text-sm font-medium text-gray-700">
                      انتخاب ترانزیت‌وی
                    </label>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedTransitWay}
                      onChange={(e) => setSelectedTransitWay(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                      focus:outline-none focus:border-cyan-500 focus:bg-white 
                      transition-all duration-300 text-gray-800 appearance-none
                      hover:border-gray-300"
                    >
                      <option value="" className="text-gray-400">
                        {fetching ? "در حال بارگذاری..." : "انتخاب طریق ترانزیت..."}
                      </option>
                      {transitWays.map((way, index) => (
                        <option key={index} value={way} className="text-gray-800">
                          {way}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDownload}
                  disabled={loading || !startDate || !endDate || !selectedTransitWay}
                  className="flex-1 flex items-center justify-center gap-3 
                  bg-gradient-to-r from-cyan-600 to-blue-600 
                  hover:from-cyan-700 hover:to-blue-700 
                  text-white py-3 px-6 rounded-xl font-semibold 
                  transition-all duration-300 transform hover:-translate-y-0.5 
                  active:translate-y-0 shadow-lg hover:shadow-xl 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>در حال تولید گزارش...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>دانلود گزارش PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetForm}
                  className="flex items-center justify-center gap-2 px-6 py-3 
                  bg-gradient-to-r from-gray-500 to-gray-600 text-white 
                  rounded-xl font-semibold transition-all duration-300 
                  hover:from-gray-600 hover:to-gray-700 
                  transform hover:-translate-y-0.5 active:translate-y-0 
                  shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-5 h-5" />
                  بازنشانی
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            {stats.totalOrders > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">تعداد سفارشات</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalOrders.toLocaleString("fa-AF")}</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">وزن کل</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalWeight.toLocaleString("fa-AF")} <span className="text-sm">کیلوگرم</span></p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">مجموع مبالغ</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalCash.toLocaleString("fa-AF")} <span className="text-sm">افغانی</span></p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-lg">
                      <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDownload;