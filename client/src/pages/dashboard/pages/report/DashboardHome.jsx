import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaTruck,
  FaClock,
  FaCheckCircle,
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
  FaChevronDown,
  FaChevronUp,
  FaDollarSign,
  FaBoxes,
  FaPercent
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import PackageDownload from "./OrderDownload.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DashboardHome = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reportType, setReportType] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const fetchReportData = async (start = null, end = null, type = "all") => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      const params = {};
      if (start) params.startDate = start.toISOString().split("T")[0];
      if (end) params.endDate = end.toISOString().split("T")[0];
      if (type !== "all") params.type = type;

      const response = await axios.get(`${BASE_URL}/report`, { params });
      setReportData(response.data.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("خطا در دریافت اطلاعات");
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fa-AF").format(amount) + " افغانی";
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("fa-AF").format(number);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("fa-AF", {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Loading State
  if (loading && !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 rounded-full mx-auto mb-6"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">در حال بارگذاری داشبورد</h3>
          <p className="text-gray-500">دریافت آخرین اطلاعات...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">خطا در اتصال</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchReportData()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaSync className={isRefreshing ? "animate-spin" : ""} />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  const {
    totalRemainedMoney,
    deliveredOrdersCount,
    notDeliveredOrdersCount,
    totalReceivedMoney,
    totalPendingMoney,
    totalOrdersCount,
    timeRange,
    totalPieces,
    totalIncome
  } = reportData;

  const deliveryRate =
    totalOrdersCount > 0 ? (deliveredOrdersCount / totalOrdersCount) * 100 : 0;

  const statsCards = [
    {
      title: "کل درآمد",
      value: formatCurrency(totalIncome),
      icon: FaMoneyBillWave,
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "مجموع درآمد سفارشات",
      role: "admin",
      trend: "+12%",
    },
    {
      title: "دریافتی‌ها",
      value: formatCurrency(totalReceivedMoney),
      icon: FaWallet,
      color: "from-emerald-500 to-emerald-700",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "مبالغ دریافت شده",
      role: "admin",
      trend: "+8%",
    },
    {
      title: "مانده حساب",
      value: formatCurrency(totalPendingMoney),
      icon: FaDollarSign,
      color: "from-amber-500 to-amber-700",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      description: "مبالغ در انتظار دریافت",
      role: "admin",
      trend: "-3%",
    },
    {
      title: "تعداد بسته‌ها",
      value: formatNumber(totalPieces),
      icon: FaBoxes,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "کل سفارشات ثبت شده",
      role: "reception",
      trend: "+15%",
    },
    {
      title: "سفارشات تحویل شده",
      value: formatNumber(deliveredOrdersCount),
      icon: FaCheckCircle,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "بسته‌های تحویل داده شده",
      role: "reception",
      trend: "+5%",
    },
    {
      title: "نرخ تحویل",
      value: deliveryRate.toFixed(1) + "%",
      icon: FaPercent,
      color: "from-cyan-500 to-cyan-700",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
      description: "درصد موفقیت تحویل",
      role: "reception",
      trend: "+2%",
    },
  ];

  const visibleCards = statsCards.filter(
    (card) => card.role === currentUser.role || currentUser.role === "admin"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              داشبورد مدیریت
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              خلاصه عملکرد و آمار سفارشات
              {lastUpdated && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  آخرین بروزرسانی: {formatTime(lastUpdated)}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {currentUser.role === "admin" && <PackageDownload />}
            
            <button
              onClick={() => fetchReportData()}
              disabled={isRefreshing}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <FaSync className={`${isRefreshing ? "animate-spin" : ""} text-gray-600`} />
              <span className="text-gray-700 font-medium">بروزرسانی</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <FaFilter className="text-gray-600" />
              <span className="text-gray-700 font-medium">فیلترها</span>
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاریخ شروع
                </label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholderText="انتخاب تاریخ شروع"
                  />
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاریخ پایان
                </label>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholderText="انتخاب تاریخ پایان"
                  />
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع گزارش
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="all">همه سفارشات</option>
                  <option value="delivered">تحویل شده</option>
                  <option value="pending">در انتظار</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setReportType("all");
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                پاک کردن فیلترها
              </button>
              <button
                onClick={() => fetchReportData(startDate, endDate, reportType)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                اعمال فیلترها
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {visibleCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
          >
            <div className={`p-1 bg-gradient-to-r ${card.color}`}>
              <div className="bg-white rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgColor}`}>
                    <card.icon className={`text-xl ${card.iconColor}`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {card.trend}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{card.title}</span>
                  <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                    مشاهده جزئیات →
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Financial Section */}
      {currentUser.role === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <FaMoneyBillWave className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">خلاصه مالی</h2>
                  <p className="text-sm text-gray-500">وضعیت مالی کلی سیستم</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                امروز
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaWallet className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">مجموع دریافتی</div>
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(totalReceivedMoney)}</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">+12%</div>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FaClock className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">مجموع باقیمانده</div>
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(totalPendingMoney)}</div>
                  </div>
                </div>
                <div className="text-sm text-amber-600 font-medium">در انتظار</div>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaChartLine className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">درآمد کل</div>
                    <div className="text-xl font-bold text-blue-800">{formatCurrency(totalIncome)}</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">نمای کلی</div>
              </div>
            </div>
          </div>

          {/* Order Status Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                  <FaBoxOpen className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">وضعیت سفارشات</h2>
                  <p className="text-sm text-gray-500">آمار تحویل و در انتظار</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">نرخ تحویل</span>
                  <span className="text-lg font-bold text-gray-900">{deliveryRate.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: `${deliveryRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaCheckCircle className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(deliveredOrdersCount)}</div>
                      <div className="text-sm text-gray-600">تحویل شده</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FaClock className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(notDeliveredOrdersCount)}</div>
                      <div className="text-sm text-gray-600">در انتظار</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  مجموع سفارشات: <span className="font-bold text-gray-900">{formatNumber(totalOrdersCount)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
            <FaFileExcel className="text-green-600" />
            خروجی Excel
          </button>
          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
            <FaFilePdf className="text-red-600" />
            گزارش PDF
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2">
            <FaDownload />
            دانلود گزارش کامل
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

