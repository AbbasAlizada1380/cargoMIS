// DashboardHome.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaTruck,
  FaBox,
  FaWeightHanging,
  FaChartLine,
  FaCalendarAlt,
  FaSync,
  FaBoxOpen,
  FaWallet,
  FaExclamationTriangle,
  FaDownload,
  FaFilter,
  FaFileExcel,
  FaFilePdf,
  FaGlobe,
  FaMapMarkerAlt,
  FaCube,
  FaShippingFast,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DashboardHome = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reportType, setReportType] = useState("basic"); // basic, detailed, location

  const fetchReportData = async (start = null, end = null, type = "basic") => {
    try {
      setLoading(true);
      const params = {};
      if (start) params.startDate = start.toISOString().split("T")[0];
      if (end) params.endDate = end.toISOString().split("T")[0];

      let endpoint = "/package-stats";
      if (type === "detailed") endpoint = "/package-stats/detailed";
      if (type === "location") endpoint = "/package-stats/location";

      const response = await axios.get(`${BASE_URL}/report`, { params });
      setReportData(response.data.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("خطا در دریافت اطلاعات");
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleFilter = () => {
    fetchReportData(startDate, endDate, reportType);
  };

  const handleResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setReportType("basic");
    fetchReportData();
  };

  const downloadReport = async (format) => {
    try {
      const params = {
        format,
        download: true,
      };
      if (startDate) params.startDate = startDate.toISOString().split("T")[0];
      if (endDate) params.endDate = endDate.toISOString().split("T")[0];

      const response = await axios.get(`${BASE_URL}/package-stats`, {
        params,
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `package-report-${timestamp}.${format}`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("خطا در دانلود گزارش");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fa-AF").format(amount || 0) + " افغانی";
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("fa-AF").format(number || 0);
  };

  const formatWeight = (weight) => {
    return new Intl.NumberFormat("fa-AF").format(weight || 0) + " کیلوگرم";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchReportData()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <FaSync />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  // Extract data based on report type
  const isBasicReport = reportType === "basic";
  const isDetailedReport = reportType === "detailed";
  const isLocationReport = reportType === "location";

  const {
    // Basic stats
    totalPackagesCount,
    totalIncome,
    totalReceivedMoney,
    totalPendingMoney,
    totalWeight,
    totalPieces,
    averageWeight,
    averageTotalCash,
    averagePerKgCash,

    // Detailed stats
    maxTotalCash,
    minTotalCash,
    maxWeight,
    minWeight,
    byCountry,
    byGoodsType,
    monthlyBreakdown,
    weightDistribution,

    // Location stats
    byLocation,

    // Common
    timeRange,
  } = reportData;

  const statsCards = [
    {
      title: "تعداد کل بسته‌ها",
      value: formatNumber(totalPackagesCount),
      icon: FaBoxOpen,
      color: "bg-purple-600",
      description: "تعداد کل بسته‌های ثبت شده",
    },
    {
      title: "مجموع وزن",
      value: formatWeight(totalWeight),
      icon: FaWeightHanging,
      color: "bg-orange-600",
      description: "وزن کل بسته‌ها",
    },
    {
      title: "مجموع درآمد",
      value: formatCurrency(totalIncome),
      icon: FaMoneyBillWave,
      color: "bg-cyan-800",
      description: "کل درآمد از بسته‌ها",
    },
    {
      title: "مجموع دریافتی",
      value: formatCurrency(totalReceivedMoney),
      icon: FaWallet,
      color: "bg-emerald-600",
      description: "مبالغ دریافت شده",
    },
    {
      title: "مجموع باقیمانده",
      value: formatCurrency(totalPendingMoney),
      icon: FaMoneyBillWave,
      color: "bg-amber-600",
      description: "مبالغ باقیمانده",
    },
    {
      title: "میانگین وزن",
      value: formatWeight(averageWeight),
      icon: FaChartLine,
      color: "bg-blue-600",
      description: "میانگین وزن هر بسته",
    },
  ];

  // Add detailed stats cards if available
  if (isDetailedReport) {
    statsCards.push(
      {
        title: "میانگین قیمت هر کیلو",
        value: formatCurrency(averagePerKgCash),
        icon: FaChartLine,
        color: "bg-green-600",
        description: "میانگین قیمت حمل هر کیلو",
      },
      {
        title: "بیشترین مبلغ بسته",
        value: formatCurrency(maxTotalCash),
        icon: FaCube,
        color: "bg-red-600",
        description: "بیشترین مبلغ یک بسته",
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              داشبورد مدیریت بسته‌ها
            </h1>
            <p className="text-gray-600">
              خلاصه وضعیت بسته‌ها و آمار مالی افغان کارگو
            </p>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
                آخرین بروزرسانی: {lastUpdated.toLocaleTimeString("fa-AF")}
              </div>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              <FaFilter />
              فیلترها
            </button>
            <button
              onClick={() => fetchReportData(startDate, endDate, reportType)}
              className="flex items-center gap-2 bg-white text-cyan-600 hover:bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
            >
              <FaSync className={`${loading ? "animate-spin" : ""}`} />
              بروزرسانی
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  از تاریخ
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholderText="انتخاب تاریخ شروع"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تا تاریخ
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholderText="انتخاب تاریخ پایان"
                />
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع گزارش
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="basic">گزارش پایه</option>
                  <option value="detailed">گزارش تفصیلی</option>
                  <option value="location">گزارش بر اساس مکان</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={handleFilter}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  اعمال فیلتر
                </button>
                <button
                  onClick={handleResetFilter}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  بازنشانی
                </button>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => downloadReport("pdf")}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <FaFilePdf />
                دانلود PDF
              </button>
              <button
                onClick={() => downloadReport("excel")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <FaFileExcel />
                دانلود Excel
              </button>
            </div>
          </div>
        )}

        {/* Time Range Info */}
        {timeRange?.hasTimeRange && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 inline-flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" />
            <span className="text-blue-700 font-medium">
              {timeRange.startDate && timeRange.endDate
                ? `داده‌ها از ${new Date(
                    timeRange.startDate
                  ).toLocaleDateString("fa-AF")} تا ${new Date(
                    timeRange.endDate
                  ).toLocaleDateString("fa-AF")}`
                : timeRange.startDate
                ? `داده‌ها از ${new Date(
                    timeRange.startDate
                  ).toLocaleDateString("fa-AF")}`
                : timeRange.endDate
                ? `داده‌ها تا ${new Date(timeRange.endDate).toLocaleDateString(
                    "fa-AF"
                  )}`
                : "کل داده‌های تاریخی"}
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
          >
            <div className={`${card.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <card.icon className="text-2xl opacity-90" />
                <span className="text-sm font-semibold text-right">
                  {card.title}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {card.value}
              </div>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Sections based on report type */}
      {isDetailedReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weight Distribution */}
          {weightDistribution && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-600 rounded-xl">
                  <FaWeightHanging className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  توزیع وزن بسته‌ها
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "زیر ۱ کیلوگرم",
                    key: "under1kg",
                    color: "bg-green-500",
                  },
                  {
                    label: "۱ تا ۵ کیلوگرم",
                    key: "1to5kg",
                    color: "bg-blue-500",
                  },
                  {
                    label: "۵ تا ۱۰ کیلوگرم",
                    key: "5to10kg",
                    color: "bg-yellow-500",
                  },
                  {
                    label: "۱۰ تا ۲۰ کیلوگرم",
                    key: "10to20kg",
                    color: "bg-orange-500",
                  },
                  {
                    label: "بالای ۲۰ کیلوگرم",
                    key: "over20kg",
                    color: "bg-red-500",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800">
                        {formatNumber(weightDistribution[item.key] || 0)}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Goods Types */}
          {byGoodsType && byGoodsType.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <FaCube className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  محبوب‌ترین انواع کالا
                </h2>
              </div>

              <div className="space-y-4">
                {byGoodsType.slice(0, 5).map((goods, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">
                      {goods.goodsDetails || "نامشخص"}
                    </span>
                    <div className="text-left">
                      <span className="font-bold text-gray-800">
                        {formatNumber(goods.packageCount)}
                      </span>
                      <span className="text-sm text-gray-500 mr-1">بسته</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Location-based Report */}
      {isLocationReport && byLocation && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-600 rounded-xl">
              <FaMapMarkerAlt className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              آمار بر اساس مکان
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold text-gray-700">مکان</th>
                  <th className="p-3 font-semibold text-gray-700">
                    تعداد بسته
                  </th>
                  <th className="p-3 font-semibold text-gray-700">درآمد کل</th>
                  <th className="p-3 font-semibold text-gray-700">وزن کل</th>
                  <th className="p-3 font-semibold text-gray-700">
                    میانگین ارزش
                  </th>
                </tr>
              </thead>
              <tbody>
                {byLocation.map((location, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-700">
                      {location.location || "نامشخص"}
                    </td>
                    <td className="p-3 text-gray-800 font-medium">
                      {formatNumber(location.packageCount)}
                    </td>
                    <td className="p-3 text-green-600 font-medium">
                      {formatCurrency(location.totalIncome)}
                    </td>
                    <td className="p-3 text-gray-800">
                      {formatWeight(location.totalWeight)}
                    </td>
                    <td className="p-3 text-blue-600 font-medium">
                      {formatCurrency(location.averageValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-800 rounded-xl">
              <FaMoneyBillWave className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">خلاصه مالی</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">مجموع دریافتی:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(totalReceivedMoney)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">مجموع باقیمانده:</span>
              <span className="font-bold text-amber-600 text-lg">
                {formatCurrency(totalPendingMoney)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 bg-cyan-50 rounded-lg px-4">
              <span className="text-gray-800 font-semibold">درآمد کل:</span>
              <span className="font-bold text-cyan-800 text-lg">
                {formatCurrency(totalIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Package Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <FaShippingFast className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">خلاصه بسته‌ها</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">تعداد کل بسته‌ها:</span>
              <span className="font-bold text-purple-600 text-lg">
                {formatNumber(totalPackagesCount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">وزن کل:</span>
              <span className="font-bold text-orange-600 text-lg">
                {formatWeight(totalWeight)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">تعداد قطعات:</span>
              <span className="font-bold text-blue-600 text-lg">
                {formatNumber(totalPieces)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
              <span className="text-gray-800 font-semibold">میانگین وزن:</span>
              <span className="font-bold text-blue-800 text-lg">
                {formatWeight(averageWeight)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Breakdown for Detailed Report */}
      {isDetailedReport && byCountry && byCountry.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-600 rounded-xl">
              <FaGlobe className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              آمار بر اساس کشور
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold text-gray-700">کشور</th>
                  <th className="p-3 font-semibold text-gray-700">
                    تعداد بسته
                  </th>
                  <th className="p-3 font-semibold text-gray-700">درآمد کل</th>
                  <th className="p-3 font-semibold text-gray-700">دریافتی</th>
                  <th className="p-3 font-semibold text-gray-700">باقیمانده</th>
                  <th className="p-3 font-semibold text-gray-700">وزن کل</th>
                </tr>
              </thead>
              <tbody>
                {byCountry.map((country, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-700">
                      {country.country || "نامشخص"}
                    </td>
                    <td className="p-3 text-gray-800 font-medium">
                      {formatNumber(country.packageCount)}
                    </td>
                    <td className="p-3 text-green-600 font-medium">
                      {formatCurrency(country.totalIncome)}
                    </td>
                    <td className="p-3 text-blue-600 font-medium">
                      {formatCurrency(country.receivedMoney)}
                    </td>
                    <td className="p-3 text-amber-600 font-medium">
                      {formatCurrency(country.pendingMoney)}
                    </td>
                    <td className="p-3 text-gray-800">
                      {formatWeight(country.totalWeight)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
