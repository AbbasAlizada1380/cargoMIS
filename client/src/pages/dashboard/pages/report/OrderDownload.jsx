import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment-jalaali";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import VazirmatnTTF from "../../../../../public/ttf/Vazirmatn.js";

const OrderDownload = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transitWays, setTransitWays] = useState([]);
  const [selectedTransitWay, setSelectedTransitWay] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load transit ways on mount
  useEffect(() => {
    const fetchTransitWays = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/packages/transitWays`);
        setTransitWays(res.data.data || []);
      } catch (error) {
        console.error("Error fetching transit ways:", error);
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
      console.log(response.data);

      const orders = response.data.data; // Adjust to your API "data" field
      if (!orders || orders.length === 0) {
        alert("هیچ سفارشی مطابق این فیلترها یافت نشد");
        return;
      }

      // ===================== PDF START =====================
      const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
      });

      doc.addFileToVFS("Vazirmatn.ttf", VazirmatnTTF);
      doc.addFont("Vazirmatn.ttf", "Vazirmatn", "normal");
      doc.setFont("Vazirmatn");

      doc.setFontSize(14);
      doc.text(
        `گزارش سفارشات ترانزیت «${selectedTransitWay}» از ${moment(startDate).format(
          "jYYYY/jMM/jDD"
        )} تا ${moment(endDate).format("jYYYY/jMM/jDD")}`,
        550,
        40,
        { align: "right" }
      );

      const headers = [
        [
          "وزن",
          "تاریخ",
          "باقیمانده",
          "دریافتی",
          "مجموع",
          "نام فرستنده",
           "نام گیرنده",
          "شماره بیل",
        ],
      ];

      const data = orders.map((order) => [
        order.totalWeight || 0,
        moment(order.createdAt).format("jYYYY/jMM/jDD"),
        order.remain?.toLocaleString("fa-AF") || 0,
        order.received?.toLocaleString("fa-AF") || 0,
        order.totalCash?.toLocaleString("fa-AF") || 0,
        order.Sender?.name || "-",
        order.Receiver?.name || "-",
        order.id,
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 60,
        styles: {
          font: "Vazirmatn",
          fontStyle: "normal",
          halign: "center",
          fontSize: 10,
        },
        headStyles: {
          font: "Vazirmatn",
          fontStyle: "normal",
          halign: "center",
          fillColor: [200, 200, 200],
          textColor: 20,
        },
        didParseCell: function (data) {
          data.cell.styles.font = "Vazirmatn";
          data.cell.styles.fontStyle = "normal"; // Important
        },
        theme: "grid",
      });

      const finalY = doc.lastAutoTable.finalY + 40;
      doc.text("امضاء و مهر:", 550, finalY, { align: "right" });
      doc.line(400, finalY + 2, 550, finalY + 2);

      doc.save(
        `Orders_${selectedTransitWay}_${startDate}_to_${endDate}.pdf`
      );
      // ===================== PDF END =====================

    } catch (error) {
      console.error("Error downloading:", error);
      alert("خطا در دریافت اطلاعات!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center">

        {/* Start Date */}
        <label htmlFor="startDate">تاریخ شروع</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* End Date */}
        <label htmlFor="endDate">تاریخ ختم</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* Transit Way Selector */}
        <label htmlFor="transitWay">ترانزیت‌وی</label>
        <select
          id="transitWay"
          className="border p-2 rounded"
          value={selectedTransitWay}
          onChange={(e) => setSelectedTransitWay(e.target.value)}
        >
          <option value="">انتخاب...</option>
          {transitWays.map((way, index) => (
            <option key={index} value={way}>
              {way}
            </option>
          ))}
        </select>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className="bg-cyan-800 text-white px-4 py-2 rounded"
        >
          {loading ? "در حال دانلود..." : "دانلود PDF"}
        </button>
      </div>
    </div>
  );
};

export default OrderDownload;
