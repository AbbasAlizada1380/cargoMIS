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
  const [reportType, setReportType] = useState("all"); // all, delivered, pending
  const { currentUser } = useSelector((state) => state.user);
  const fetchReportData = async (start = null, end = null, type = "all") => {
    try {
      setLoading(true);
      const params = {};
      if (start) params.startDate = start.toISOString().split("T")[0];
      if (end) params.endDate = end.toISOString().split("T")[0];
      if (type !== "all") params.type = type;

      const response = await axios.get(`${BASE_URL}/report`, { params });
      setReportData(response.data.data);
      console.log(response.data.data);
      
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fa-AF").format(amount) + " افغانی";
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("fa-AF").format(number);
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
      title: "مجموع پول همه سفارشات",
      value: formatCurrency(totalIncome),
      icon: FaMoneyBillWave,
      color: "bg-cyan-800",
      description: "کل پول از سفارشات",
      role: "admin",
    },
    {
      title: "مجموع پول دریافتی",
      value: formatCurrency(totalReceivedMoney),
      icon: FaWallet,
      color: "bg-emerald-600",
      description: "کل مبالغ دریافت شده",
      role: "admin",
    },
    {
      title: "مجموع پول باقیمانده",
      value: formatCurrency(totalPendingMoney),
      icon: FaMoneyBillWave,
      color: "bg-cyan-800",
      description: "کل مبلغ باقیمانده از سفارشات",
      role: "admin",
    },
    {
      title: "تعداد کل بسته ها",
      value: formatNumber(totalPieces),
      icon: FaBoxOpen,
      color: "bg-purple-600",
      description: "تعداد کل سفارشات",
      role: "reception",
    },
   
  ];
  // Filter cards based on role
  const visibleCards = statsCards.filter(
    (card) => card.role === currentUser.role || currentUser.role === "admin"
  );
  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            داشبورد مدیریت
          </h1>
          <p className="text-gray-600">
            خلاصه وضعیت بسته ها  
          </p>
        </div>
      </div>
      {currentUser.role == "admin" && <PackageDownload />}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
          >
            <div className={`${card.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <card.icon className="text-2xl opacity-90" />
                <span className="text-sm font-semibold">{card.title}</span>
              </div>
            </div>

            <div className="p-6">
              {card.isCombined ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <FaCheckCircle className="text-green-600 text-xl mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-700">
                        {formatNumber(card.delivered)}
                      </div>
                      <div className="text-green-600 text-xs">تحویل شده</div>
                    </div>

                    <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <FaClock className="text-orange-600 text-xl mx-auto mb-1" />
                      <div className="text-lg font-bold text-orange-700">
                        {formatNumber(card.pending)}
                      </div>
                      <div className="text-orange-600 text-xs">در انتظار</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {card.value}
                  </div>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Detailed Financial Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        {currentUser.role == "admin" && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
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
                <span className="font-bold text-red-600 text-lg">
                  {formatCurrency(totalPendingMoney)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 bg-cyan-50 rounded-lg px-4">
                <span className="text-gray-800 font-semibold">مجموع کل:</span>
                <span className="font-bold text-cyan-800 text-lg">
                  {formatCurrency(totalIncome)}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardHome;
