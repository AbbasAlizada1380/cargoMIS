import React from "react";
import { FaDownload, FaFilePdf } from "react-icons/fa";

const Regulation = ({ companyName = "افغان کارگو" }) => {
  
  const downloadRegulationPDF = () => {
    // Create a new window for printing/download
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to download regulations');
      return;
    }

    // Get current date
    const today = new Date();
    const persianDate = today.toLocaleDateString('fa-IR');
    
    // Regulation content
    const regulationContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>قوانین و مقررات شرکت ${companyName}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Tahoma', 'Arial', sans-serif;
            background: white;
            color: #333;
            line-height: 1.6;
          }
          
          .container {
            width: 210mm;
            min-height: 297mm;
            padding: 25mm;
            box-sizing: border-box;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          
          .english-name {
            font-size: 18px;
            color: #4b5563;
            margin-bottom: 15px;
          }
          
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 30px 0 20px 0;
            text-align: center;
          }
          
          .document-info {
            text-align: left;
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
            border: 1px solid #ddd;
            padding: 10px;
            background: #f9fafb;
          }
          
          .regulation-list {
            margin: 20px 0;
            padding-right: 20px;
          }
          
          .regulation-item {
            margin-bottom: 15px;
            text-align: justify;
            font-size: 14px;
          }
          
          .regulation-number {
            font-weight: bold;
            color: #1e40af;
            margin-left: 5px;
          }
          
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          
          .contact-info {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-size: 13px;
          }
          
          .signature-area {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-box {
            width: 45%;
            text-align: center;
          }
          
          .signature-line {
            width: 80%;
            height: 1px;
            background: #333;
            margin: 40px auto 10px auto;
          }
          
          @media print {
            body * {
              visibility: hidden;
            }
            .container, .container * {
              visibility: visible;
            }
            .container {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="company-name">${companyName}</div>
            <div class="english-name">Afghan Cargo Services</div>
            <div style="font-size: 22px; font-weight: bold; color: #1e3a8a;">
              قوانین و مقررات حمل و نقل
            </div>
          </div>
          
          <!-- Document Info -->
          <div class="document-info">
            <div><strong>تاریخ انتشار:</strong> ${persianDate}</div>
            <div><strong>شماره سند:</strong> AC-RG-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}</div>
            <div><strong>نسخه:</strong> ۱.۰</div>
          </div>
          
          <!-- Main Content -->
          <div class="title">مقررات عمومی شرکت</div>
          
          <div class="regulation-list">
            <div class="regulation-item">
              <span class="regulation-number">۱.</span>
              مشتری موظف است اطلاعات صحیح و کامل فرستنده و گیرنده (نام، آدرس، شماره تماس) را ارائه دهد. هرگونه خطا در اطلاعات منجر به تاخیر یا عدم تحویل می‌گردد.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۲.</span>
              شرکت ${companyName} مسئولیت کالاهای آسیب دیده در اثر بسته‌بندی ناصحیح یا ناکافی مشتری را بر عهده نمی‌گیرد. مشتری مسئول بسته‌بندی مناسب کالا می‌باشد.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۳.</span>
              پرداخت کامل هزینه‌های حمل و نقل قبل از ارسال کالا الزامی است. در صورت عدم پرداخت، شرکت حق توقف فرایند ارسال را دارد.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۴.</span>
              تغییر آدرس مقصد پس از ثبت سفارش تنها با هماهنگی دفتر مرکزی و پرداخت هزینه‌های اضافی امکان‌پذیر است.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۵.</span>
              هرگونه شکایت یا ادعای خسارت باید حداکثر ظرف ۷۲ ساعت (۳ روز کاری) پس از دریافت کالا به صورت کتبی به شرکت اعلام شود.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۶.</span>
              کالاهای ممنوعه شامل مواد مخدر، اسلحه، مواد آتش‌زا و مشروبات الکلی تحت هیچ شرایطی پذیرفته نمی‌شوند.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۷.</span>
              زمان تخمینی تحویل کالا ۲-۵ روز کاری می‌باشد. شرایط جوی، امنیتی و سایر عوامل خارج از کنترل ممکن است باعث تاخیر شوند.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۸.</span>
              برای کالاهای با ارزش بیش از ۱۰۰,۰۰۰ افغانی، بیمه جداگانه الزامی است. شرکت تا سقف ۱۰۰,۰۰۰ افغانی مسئولیت جبران خسارت را دارد.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۹.</span>
              گیرنده باید هنگام دریافت کالا کارت شناسایی معتبر ارائه دهد. در صورت ارسال توسط نماینده، نامه رسمی نمایندگی الزامی است.
            </div>
            
            <div class="regulation-item">
              <span class="regulation-number">۱۰.</span>
              این قرارداد تابع قوانین جمهوری اسلامی افغانستان است و هرگونه اختلاف در دادگاه‌های کابل رسیدگی خواهد شد.
            </div>
          </div>
          
          <!-- Contact Information -->
          <div class="contact-info">
            <div style="font-weight: bold; margin-bottom: 10px; color: #1e40af;">اطلاعات تماس:</div>
            <div><strong>تلفن:</strong> ۰۷۸۹۳۸۴۷۰۰ - ۰۷۹۹۳۰۶۴۳۷ - ۰۷۴۸۸۵۲۵۶۹</div>
            <div><strong>آدرس:</strong> مارکیت بهار سراب، تانک تیل، دشت برچی، کابل، افغانستان</div>
            <div><strong>ساعات کاری:</strong> شنبه تا پنجشنبه، ۸:۰۰ صبح تا ۵:۰۰ بعدازظهر</div>
          </div>
          
          <!-- Signature Area -->
          <div class="signature-area">
            <div class="signature-box">
              <div>امضاء مسئول شرکت</div>
              <div class="signature-line"></div>
              <div style="font-size: 12px; margin-top: 5px;">نام و نام خانوادگی</div>
            </div>
            
            <div class="signature-box">
              <div>مهر و امضاء مشتری</div>
              <div class="signature-line"></div>
              <div style="font-size: 12px; margin-top: 5px;">تاریخ و امضاء</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div>این سند رسمی شرکت ${companyName} می‌باشد و هرگونه کپی برداری بدون اجازه کتبی ممنوع است.</div>
            <div style="margin-top: 10px;">© ${new Date().getFullYear()} ${companyName} - تمامی حقوق محفوظ است.</div>
            <div style="margin-top: 5px; font-size: 11px; color: #888;">صفحه ۱ از ۱</div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              // Optionally close the window after printing
              // window.close();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(regulationContent);
    printWindow.document.close();
  };

  return (
    <div className="flex justify-center items-center p-4">
      <button
        onClick={downloadRegulationPDF}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 
                   text-white rounded-lg hover:from-blue-700 hover:to-blue-900 
                   transition-all duration-300 shadow-lg hover:shadow-xl
                   transform hover:-translate-y-1 active:translate-y-0"
      >
        <FaFilePdf className="text-xl" />
        <FaDownload className="text-lg" />
        <span className="font-bold">دانلود قوانین شرکت</span>
      </button>
    </div>
  );
};

export default Regulation;