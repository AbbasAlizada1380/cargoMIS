import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment-jalaali";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import VazirmatnTTF from "../../../../../public/ttf/Vazirmatn.js";

const PackageDownload = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      alert("لطفاً تاریخ شروع و پایان را انتخاب کنید");
      return;
    }

    try {
      setLoading(true);

      // 🔥 MATCHING YOUR ROUTE: /packages/Range
      const response = await axios.get(
        `${BASE_URL}/packages/Range?startDate=${startDate}&endDate=${endDate}`
      );

      const packages = response.data;

      if (!packages || packages.length === 0) {
        alert("هیچ محموله‌ای در این بازه زمانی یافت نشد");
        return;
      }

      // PDF Setup
      const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
      });

      // Add Persian font
      doc.addFileToVFS("Vazirmatn.ttf", VazirmatnTTF);
      doc.addFont("Vazirmatn.ttf", "Vazirmatn", "normal");
      doc.setFont("Vazirmatn");

      doc.setFontSize(14);
      doc.text(
        `گزارش محموله‌ها از ${moment(startDate).format(
          "jYYYY/jMM/jDD"
        )} تا ${moment(endDate).format("jYYYY/jMM/jDD")}`,
        550,
        40,
        { align: "right" }
      );

      // Table headers
      const headers = [
        [
          "تاریخ",
          "موقعیت",
          "مقدار باقی",
          "رسید",
          "مجموع",
          "شماره تحویل گیرنده",
          "تحویل گیرنده",
          "کد محموله",
        ],
      ];

      // Table body      
      const data = packages.data.map((p) => [
        moment(p.createdAt).format("jYYYY/jMM/jDD"),
        p.location || "-",
        p.remain?.toLocaleString("fa-AF") || 0,
        p.recip?.toLocaleString("fa-AF") || 0,
        p.totalCash?.toLocaleString("fa-AF") || 0,
        p.receiverPhone || "-",
        p.receiverName || "-",
        p.id,
      ]);

      // Create table
      autoTable(doc, {
        head: headers,
        body: data,
        startY: 70,
        styles: {
          font: "Vazirmatn",
          halign: "center",
          fontSize: 10,
        },
        headStyles: {
          font: "Vazirmatn",
          fontStyle: "normal",
          halign: "center",
          fillColor: [200, 200, 200],
        },
        theme: "grid",
      });

      const finalY = doc.lastAutoTable.finalY + 40;
      doc.text("امضاء و مهر:", 550, finalY, { align: "right" });
      doc.line(400, finalY + 2, 550, finalY + 2);

      doc.save(`Packages_${startDate}_to_${endDate}.pdf`);
    } catch (error) {
      console.error("Error downloading packages:", error);
      alert("خطا در دریافت اطلاعات!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center">
        <label htmlFor="startDate">تاریخ شروع</label>
        <input
          name="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />

        <label htmlFor="endDate">تاریخ ختم</label>
        <input
          name="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />

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

export default PackageDownload;
