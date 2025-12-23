import { FaDownload, FaFilePdf } from "react-icons/fa";

const Regulation = ({ companyName = "افغان کارگو", data }) => {
  const downloadRegulationPDF = () => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      alert("لطفاً پاپ‌آپ را برای پرینت مجاز کنید");
      return;
    }

    const isoDate = data.date;

    const persianDate = new Intl.DateTimeFormat("fa-IR-u-nu-arabext", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(isoDate));

    const docNumber = data?.id.toLocaleString("fa-IR");

    // Get the logo URL - assuming it's hosted at /logo.png
    const logoUrl = window.location.origin + "/logo.png";

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
            margin: 0mm;
          }

          body {
            direction: rtl;
            background: white;
            color: #000;
            line-height: 1.9;
            width: 210mm;
            min-height: 297mm;
            max-height: 297mm;
            margin: 0;
            padding: 0;
            font-size: 20px;
            overflow: hidden;
          }

          /* Main container matching A4 dimensions */
          .a4-container {
            width: 210mm;
            min-height: 297mm;
            max-height: 297mm;
            background: white;
            margin: 0mm auto;
            position: relative;
            padding-right:20mm;
            overflow: hidden;
          }

          /* Header - Compact version */
          .print-header {
            background: #0f3a76;
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .logo-circle {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
          }

          .logo-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .company-info {
            display: flex;
            flex-direction: column;
            text-align: right;
          }

          .company-name-fa {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 2px;
          }

          .company-name-en {
            font-size: 14px;
            opacity: 0.95;
          }

          .header-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justity:center;
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

          /* Introduction Box - Compact */
          .intro-box {
            background: #f0f9ff;
            border-right: 2px solid #1e40af;
            border-radius: 3px;
            padding: 8px 10px;
            margin-top:4px;
          }

          .intro-text {
            font-size: 12px;
            color: #1e3a8a;
            font-weight: 600;
            line-height: 1.5;
          }

          /* Section Styling - Compact */
          .section {
            margin: 0;
          }

          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e3a8a;
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
            width: 18px;
            height: 18px;
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
            background: #0f3a76;
            padding:16px;
          }

          .contact-title {
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 6px;
            text-align: center;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color:#ffffff;
            font-size: 16px;
          }

          /* Signature Section */
          .signature-section {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #d1d5db;
            display: flex;
            padding: 5mm;
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
            height: 90px;
            border: 1px solid #666;
            margin-bottom: 5px;
            position: relative;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 10px;
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

          .signature-name {
            font-size: 11px;
            font-weight: bold;
            color: #1e3a8a;
            text-align: center;
            width: 100%;
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
              width: 210mm !important;
              height: 297mm !important;
                       box-shadow: none !important;
              border: none !important;
              overflow: hidden !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }

            .print-header {
              background: #0f3a76 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .logo-img {
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
                <img src="${logoUrl}" alt="Company Logo" class="logo-img" />
              </div>
              <div class="company-info">
                <div class="company-name-fa">${companyName}</div>
                <div class="company-name-en">Afghan Cargo Services</div>
              </div>
            </div>
            <div class="header-right">
              <div class="doc-info-item">
                <span class="doc-info-label">شماره بل:</span>
                <span class="doc-info-value">${docNumber}</span>
              </div>
              <div class="doc-info-item">
                <span class="doc-info-label">تاریخ:</span>
                <span class="doc-info-value">${persianDate}</span>
              </div>
            </div>
          </div>

          <!-- Introduction -->
          <div class="intro-box">
            <p class="intro-text">قرارداد انتقال محموله بین شرکت ${companyName} و مشتری محترم ${
      data?.Sender?.name || "مشتری"
    } به شرح ذیل تنظیم شده است</p>
          </div>

          <!-- Company Responsibilities -->
         <div class="section"> <h2 class="section-title">مکلفیت‌های شرکت</h2> <ol class="regulations-list"> <li class="regulation-item">شرکت افغان کارگو مکلف است تا از مسیر قانونی محموله‌های خود را انتقال بدهد.</li> <li class="regulation-item">افغان کارگو به نگهداری از اجسام در تمام مواقع می‌باشد و در صورتی که ثابت شود در نتیجه تقصیر یا تفریط کارمندان افغان کارگو به محصول آسیب رسیده است، در مقابل مشتری جوابگو می‌باشیم.</li> <li class="regulation-item">افغان کارگو با استفاده از سیستم ردیابی دقیق و معماری خود که در وبسایت شرکت‌های بین‌المللی درج می‌باشد، به مشتریان خود یک نمره ردیابی در زمان ارائه می‌دارد که با آن نمره مشتریان قابلیت ردیابی محصول خود را داشته و ساعات و دقیقه‌ی اول آدرس مقصد را می‌دانند.</li> <li class="regulation-item">افغان کارگو صرفاً مکلف به انتقال بسته‌ها بوده و در صورت مفقودی کل یا قسمتی و همچنین تخریب کل یا قسمتی محصولاتی که بیمه شده است و در ضمن توسط فرستنده ثابت شود، مکلف به پرداخت خساره است. برای محصولاتی که بیمه نشده باشد، طبق قوانین شرکت‌های بین‌المللی رسیدگی می‌گردد.</li> <li class="regulation-item">در صورت مواجه شدن با محدودیت در امور انتقال محموله توسط شرکت کشور مبدأ، کشور مقصد یا کشورهای مسیر، افغان کارگو هیچ نوع مسؤولیتی در این قبال ندارد.</li> <li class="regulation-item">در صورتی که شرکت کشور مبدأ یا مقصد، جامعیت و محصول مشتری را مشکوک گردانده و بخواهد بررسی نمایند و در هنگام بازرسی سبب تخریب قسمتی یا کل اجسام در اثر بازکردن یا برنامه شود، افغان کارگو هیچ نوع مسؤولیتی در این قبال ندارد.</li> </ol> </div>

<!-- Sender Responsibilities -->
<div class="section">
  <h2 class="section-title">مکلفیت‌های شخص فرستنده</h2>
  <ol class="regulations-list compact" start="6">
    <li class="regulation-item">شخص فرستنده مکلف به درج معلومات صحیح و مکمل خود (فرستنده) و شخص گیرنده می‌باشد.</li>
    <li class="regulation-item">در صورت درج معلومات نادرست توسط فرستنده، اگر محموله توسط نهادهای ذیربط برگردانده شود، مبلغ کرایه ارسال بسته عودت نشده و مبلغ برگشت بسته نیز به دوش فرستنده می‌باشد.</li>
    <li class="regulation-item">اگر اشیای قیمتی بدون بیمه و درج قیمت صحیح توسط افغان کارگو ارسال گردد، در صورت تخریب یا مفقود شدن یا وضع شدن مالیات (استهلاک و گمرکی)، کرایه اخذ شده و تاوانی پرداخت نمی‌گردد.</li>
    <li class="regulation-item">ارسال پول نقد، زیورآلات قیمتی، مایعات، ادویه جات توسط افغان کارگو قابل انتقال نیستند.</li>
    <li class="regulation-item">محموله مذکور باید مطابق جواز تجاری به کشور مقصد صادر گردد. در صورت وجود محموله غیرقانونی (مثل مواد مخدر، مواد منفجره و هر مال ممنوعه خلاف قانون) که نگهداری و حمل آن جرم شناخته شود، مسؤولیت قانونی و جزایی آن به عهده شخص فرستنده می‌باشد. فرستنده تعهد می‌نماید که هیچ نوع مواد ممنوعه فوق‌الذکر در محموله موجود نمی‌باشد. در صورت کشف چنین موردی، افغان کارگو هیچ نوع مسئولیتی ندارد.</li>
    <li class="regulation-item">در صورتی که در کشورهای مبدأ، مسیر یا مقصد، محموله مورد ارزیابی و تحقیقات امنیتی قرار گیرد، مشتری مکلف به ارائه اطلاعات لازم در مورد اموال خود می‌باشد.</li>
    <li class="regulation-item">هرگاه بر محموله در کشور مقصد مالیات و سایر مصارف حکومتی وضع شود، شخص گیرنده مکلف به پرداخت آن می‌باشد.</li>
    <li class="regulation-item">در صورت پیش آمدن حالات غیرمترقبه مثل: اتفاقات طبیعی، آتش‌سوزی، کودتا، جنگی، محدودیت‌های حکومتی و امثال آن که باعث تأخیر در محموله گردد، افغان کارگو هیچ‌گونه مسؤولیتی ندارد.</li>
    <li class="regulation-item">پرداخت حق‌العمل و مصارف انتقال اموال به صورت پیش‌پرداخت توسط شخص فرستنده در کابل قابل پرداخت است.</li>
    <li class="regulation-item">شخص گیرنده مکلف است در صورت نیاز به گمرک کشور مقصد، اسناد لازم را ارائه دهد. در صورتی که شخص گیرنده مشکلاتی مانند نداشتن اسناد قانونی، بدهی دولتی، عدم موجودیت در آدرس داده شده یا قرار گرفتن در وضعیت‌های اضطراری داشته باشد و شرکت نتواند محموله را تحویل دهد، افغان کارگو هیچ نوع مسؤولیتی ندارد.</li>
    <li class="regulation-item">شخص گیرنده مکلف است حین باز کردن بسته از جزئیات آن فیلم گرفته تا در صورت کمبود یا آسیب، مستندسازی شود.</li>
    <li class="regulation-item">شخص فرستنده مکلف است تا در هنگام تسلیم اجناس خود به افغان کارگو، این شرایط را به دقت مطالعه نموده و با آگاهی کامل این قرارداد (که دارای 17 ماده است) را امضاء نماید. این قرارداد پس از تسلیم مال به کشور مقصد توسط شخص گیرنده قابل تغییر یا فسخ نیست.</li>
  </ol>
</div>


          <!-- Signature Section -->
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-title">امضاء و مهر شرکت</div>
              <div class="signature-area company-signature">
                <div class="signature-name">${companyName}</div>
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-title">امضاء مشتری</div>
              <div class="signature-area customer-signature">
                <div class="signature-name">${
                  data?.Sender?.name || "مشتری"
                }</div>
              </div>
            </div>
          </div>

          <div class="contact-section">
            <div class="contact-grid">
              <div class="contact-item">

                <span>تماس: ۰۷۴۵۷۲۱۱۲۷  - ۰۷۸۰۱۷۷۰۶۰ -  ۰۷۷۴۶۱۰۶۱۳</span>
              </div>
              <div class="contact-item">

                <span>آدرس: مارکیت بهار سراب، تانک تیل، دشت برچی، کابل، افغانستان</span>
              </div> 
            </div>
          </div>
        </div>

        <script>
          // Preload the logo image before printing
          const logoImg = new Image();
          logoImg.src = "${logoUrl}";
          
          logoImg.onload = function() {
            console.log('Logo loaded successfully');
          };
          
          logoImg.onerror = function() {
            console.log('Logo failed to load, using fallback');
          };

          // Auto print with delay to ensure rendering
          window.onload = function() {
            window.focus();
            setTimeout(function() {
              window.print();
            }, 500); // Increased delay for image loading
          };

          // Fallback if onload doesn't fire
          setTimeout(function() {
            if (document.readyState === 'complete') {
              window.print();
            }
          }, 1500);
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
                   shadow-md hover:shadow-lg border border-blue-500"
      >
        <FaFilePdf className="text-lg" />
        <FaDownload className="text-md" />
        <span className="font-semibold">دانلود مقررات شرکت</span>
      </button>
    </div>
  );
};

export default Regulation;
