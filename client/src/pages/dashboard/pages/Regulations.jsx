import React from "react";
import { FaDownload, FaFilePdf } from "react-icons/fa";
import logo from "/logo.png"
const Regulation = ({ companyName = "افغان کارگو", data }) => {
  const downloadRegulationPDF = () => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    console.log(data)
    if (!printWindow) {
      alert("لطفاً پاپ‌آپ را برای پرینت مجاز کنید");
      return;
    }

    const today = new Date();
    const persianDate = today.toLocaleDateString("fa-IR");
    const docNumber = `AC-REG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>مقررات انتقال محموله - ${companyName}</title>
        <style>
          /* Reset and base styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Tahoma', 'Arial', sans-serif;
          }

          /* A4 Page Size - Prevent empty second page */
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          body {
            direction: rtl;
            background: white;
            color: #000;
            line-height: 1.5;
            width: 210mm;
            min-height: 297mm;
            max-height: 297mm;
            margin: 0;
            padding: 0;
            font-size: 12px;
            overflow: hidden;
          }

          /* Main container matching A4 dimensions */
          .a4-container {
            width: 194mm;
            min-height: 281mm;
            max-height: 281mm;
            background: white;
            margin: 8mm auto;
            position: relative;
            padding: 5mm;
            overflow: hidden;
          }

          /* Header - Compact version */
          .print-header {
            background: linear-gradient(to left, #1e40af, #2563eb);
            color: white;
            padding: 8px 10px;
            border-bottom: 3px solid #1e3a8a;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .logo-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
          }

          .logo-text {
            color: #1e40af;
            font-weight: bold;
            font-size: 14px;
          }

          .company-info {
            display: flex;
            flex-direction: column;
            text-align: right;
          }

          .company-name-fa {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 2px;
          }

          .company-name-en {
            font-size: 10px;
            opacity: 0.95;
          }

          .header-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 3px;
          }

          .doc-info-item {
            font-size: 9px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .doc-info-label {
            font-weight: bold;
            color: #dbeafe;
          }

          .doc-info-value {
            font-weight: 600;
          }

          /* Document Title - Compact */
          .document-title-section {
            text-align: center;
            margin: 8px 0 12px 0;
            padding: 5px 0;
          }

          .document-title-main {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 3px;
          }

          .document-title-sub {
            font-size: 11px;
            color: #4b5563;
            font-weight: 500;
          }

          /* Introduction Box - Compact */
          .intro-box {
            background: #f0f9ff;
            border-right: 2px solid #1e40af;
            border-radius: 3px;
            padding: 8px 10px;
            margin: 0 0 12px 0;
            text-align: center;
          }

          .intro-text {
            font-size: 12px;
            color: #1e3a8a;
            font-weight: 600;
            line-height: 1.5;
          }

          /* Section Styling - Compact */
          .section {
            margin: 12px 0;
          }

          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #93c5fd;
          }

          /* Regulations List - Compact */
          .regulations-list {
            margin: 0;
            padding-right: 18px;
            list-style: none;
            counter-reset: regulation-counter;
          }

          .regulation-item {
            margin-bottom: 6px;
            text-align: right;
            font-size: 11px;
            line-height: 1.5;
            position: relative;
            padding-right: 20px;
          }

          .regulation-item:before {
            counter-increment: regulation-counter;
            content: counter(regulation-counter) ". ";
            position: absolute;
            right: 0;
            color: #1e40af;
            font-weight: bold;
            font-size: 11px;
            background: #e0f2fe;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Compact spacing for lists */
          .regulations-list.compact {
            margin-bottom: 4px;
          }

          /* Contact Information - Compact */
          .contact-section {
            background: #eef2ff;
            border: 1px solid #c7d2fe;
            border-radius: 4px;
            padding: 10px;
            margin: 15px 0 10px 0;
          }

          .contact-title {
            font-size: 12px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 6px;
            text-align: center;
          }

          .contact-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 5px;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
          }

          .contact-icon {
            color: #1e40af;
            font-size: 11px;
            min-width: 16px;
            flex-shrink: 0;
          }

          /* Signature Section */
          .signature-section {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #d1d5db;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .signature-box {
            width: 48%;
            text-align: center;
          }

          .signature-title {
            font-size: 12px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 8px;
          }

          .signature-area {
            height: 100px;
            border-bottom: 1px solid #666;
            margin-bottom: 5px;
            position: relative;
          }

          .signature-label {
            font-size: 10px;
            color: #666;
            margin-top: 3px;
          }

          .company-signature {
            border: 1px solid #1e40af;
            background: #f0f9ff;
          }

          .customer-signature {
            border: 1px dashed #666;
          }

          /* Footer - Compact */
          .footer {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #d1d5db;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
          }

          .footer-company {
            font-weight: bold;
            color: #4b5563;
            margin-bottom: 3px;
          }

          /* Print Optimization - Prevent second page */
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              background: white !important;
              font-size: 12px !important;
              overflow: hidden !important;
            }

            .a4-container {
              width: 194mm !important;
              height: 281mm !important;
              margin: 8mm auto !important;
              padding: 5mm !important;
              box-shadow: none !important;
              border: none !important;
              overflow: hidden !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }

            .print-header {
              background: linear-gradient(to left, #1e40af, #2563eb) !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Prevent page breaks and empty pages */
            body * {
              page-break-inside: avoid !important;
              page-break-after: avoid !important;
              page-break-before: avoid !important;
            }

            html, body {
              height: 100% !important;
              overflow: hidden !important;
            }
          }

          /* Text clarity improvements */
          .regulation-item {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        </style>
      </head>
      <body>
        <div class="a4-container">
          <!-- Header - Compact -->
          <div class="print-header">
           <div class="header-left">
  <div class="logo-circle">
    <img src=${logo} alt="Company Logo" />
  </div>

  <div class="company-info">
    <div class="company-name-fa">${companyName}</div>
    <div class="company-name-en">Afghan Cargo Services</div>
  </div>
</div>

            <div class="header-right">
              <div class="doc-info-item">
                <span class="doc-info-label">شماره سند:</span>
                <span class="doc-info-value">${data.id}</span>
              </div>
              <div class="doc-info-item">
                <span class="doc-info-label">تاریخ:</span>
                <span class="doc-info-value">${persianDate}</span>
              </div>
            </div>
          </div>

          <!-- Document Title -->
          <div class="document-title-section">
            
          </div>

          <!-- Introduction -->
          <div class="intro-box">
            <p class="intro-text"> قرارداد انتقال محموله بین شرکت ${companyName} و مشتری محترم ${data.Sender.name} به شرح ذیل تنظیم شده است</p>
          </div>

          <!-- Company Responsibilities -->
          <div class="section">
            <h2 class="section-title">مکلفیت‌های شرکت</h2>
            <ol class="regulations-list">
              <li class="regulation-item">شرکت ${companyName} مکلف است تا از مسیر قانونی، محموله مشتری را انتقال دهد.</li>
              <li class="regulation-item">شرکت ${companyName} مکلف به نگهداری از اجناس در تمام مواقع می‌باشد و در صورت ثابت شدن تفاوت وزن، مسئولیت را در برابر مشتری تقبل می‌نماید.</li>
              <li class="regulation-item">شرکت ${companyName} محموله‌ها را نمبرگذاری کرده و قابلیت ردیابی ۲۴ ساعته فراهم می‌سازد.</li>
              <li class="regulation-item">مسئولیت بسته‌بندی به عهده فرستنده است و محموله‌های بیمه‌نشده شامل جبران خساره نمی‌گردد.</li>
              <li class="regulation-item">شرکت ${companyName} مسئولیت انتقال کالا از مبدا تا مقصد از مسیر قانونی را دارد.</li>
            </ol>
          </div>

          <!-- Sender Responsibilities -->
          <div class="section">
            <h2 class="section-title">مکلفیت‌های شخص فرستنده</h2>
            <ol class="regulations-list compact" start="6">
              <li class="regulation-item">فرستنده مکلف به درج معلومات درست Shipper و Consignee می‌باشد.</li>
              <li class="regulation-item">بسته‌بندی نامناسب مسئولیتش به عهده فرستنده است.</li>
              <li class="regulation-item">ارسال مواد مخدر، مشروبات یا مواد ممنوعه اکیداً ممنوع است.</li>
              <li class="regulation-item">درج معلومات نادرست مسئولیت قانونی دارد.</li>
              <li class="regulation-item">تأخیرهای ناشی از ادارات دولتی مربوط شرکت نمی‌باشد.</li>
              <li class="regulation-item">مالیات و مصارف مقصد به عهده مشتری است.</li>
              <li class="regulation-item">آدرس غلط مسئولیت شرکت نیست.</li>
              <li class="regulation-item">اسناد لازم باید از طرف فرستنده تهیه شود.</li>
              <li class="regulation-item">فرستنده پس از مطالعه، قرارداد را قبول می‌نماید.</li>
            </ol>
          </div>

          <!-- General Conditions -->
          <div class="section">
            <h2 class="section-title">شرایط عمومی</h2>
            <ol class="regulations-list compact" start="15">
              <li class="regulation-item">این قرارداد در دو نسخه تنظیم شده و هر دو نسخه دارای اعتبار قانونی یکسان هستند.</li>
              <li class="regulation-item">هرگونه تغییر در این قرارداد باید به صورت کتبی و با امضای طرفین معتبر باشد.</li>
              <li class="regulation-item">قانون حاکم بر این قرارداد قوانین جمهوری اسلامی افغانستان می‌باشد.</li>
              <li class="regulation-item">محل حل اختلاف، دادگاه‌های صالحه شهر کابل تعیین می‌گردد.</li>
            </ol>
          </div>
   <!-- Signature Section -->
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-title">امضاء و مهر شرکت</div>
              <div class="signature-area company-signature">  <div class="signature-label">${companyName}</div></div>
            
            </div>
            <div class="signature-box">
              <div class="signature-title">امضاء مشتری</div>
              <div class="signature-area customer-signature"><div class="signature-label">${data.Sender.name}</div></div>
              
            </div>
          </div>
        <div class="contact-section">
            <div class="contact-title">  تماس با ما</div>
            <div class="contact-grid">
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span>تلفن: 0745721127 - 0780177060 - 0774610613</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🏢</span>
                <span>آدرس: مارکیت بهار سراب، تانک تیل، دشت برچی، کابل، افغانستان</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span>ایمیل: info@afghancargo.af</span>
              </div>
            </div>
          </div>

       
        </div>

        <script>
          // Auto print with delay to ensure rendering
          window.onload = function() {
            window.focus();
            setTimeout(function() {
              window.print();
            }, 300);
          };

          // Fallback if onload doesn't fire
          setTimeout(function() {
            if (document.readyState === 'complete') {
              window.print();
            }
          }, 1000);
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="flex justify-center p-4">
      <button
        onClick={downloadRegulationPDF}
        className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 
                   text-white rounded-lg hover:from-blue-700 hover:to-blue-900 
                   transition-all duration-300 shadow-md hover:shadow-lg 
                   transform hover:-translate-y-0.5 active:translate-y-0
                   border border-blue-500"
      >
        <FaFilePdf className="text-lg" />
        <FaDownload className="text-md" />
        <span className="font-semibold">دانلود مقررات شرکت</span>
      </button>
    </div>
  );
};

export default Regulation;