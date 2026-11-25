# مصمم الملصقات A4 — Sticker Creator

تطبيق ويب (HTML/CSS/JS فقط) لتصميم أوراق A4 تحتوي على ملصقات متعددة وطباعتها، ويعمل مباشرة على **GitHub Pages** بدون أي خادم.

A static web app for designing and printing A4 sheets of multiple stickers/labels. Runs entirely in the browser; works on GitHub Pages.

## الميزات / Features
- **الورقة:** A4 / A5 / A3 / Letter / Legal / مقاس مخصص، عمودي أو أفقي.
- **التقسيم:** عدد الأعمدة والصفوف، قياس ثابت أو تلقائي من الهوامش، توسيط تلقائي، هوامش ومسافات بالمليمتر، تدوير الزوايا، ترتيب التعبئة (يسار←يمين، يمين←يسار، أعمدة). أكثر من 19 تقسيماً جاهزاً (2×7، 3×8، 4×10، 5×13، دوائر…).
- **المحرر:** نصوص، باركود (CODE128, EAN13, CODE39, UPC…)، رمز QR (يدعم العربية)، صور، مستطيلات، دوائر، خطوط. سحب وتغيير الحجم بالفأرة أو اللمس، محاذاة ذكية للمنتصف والحواف، طبقات، قفل، نسخ، دوران، شفافية.
- **الخطوط والألوان:** Cairo، Tajawal، Amiri، Noto Kufi Arabic، Changa، Inter، Oswald… مع عريض/مائل/تسطير، محاذاة، تباعد، وتصغير النص تلقائياً ليناسب الإطار.
- **البيانات والأرقام:** ترقيم تسلسلي `{n}` (بداية، خطوة، عدد خانات، بادئة، لاحقة)، `{i}`، `{date}`، ودمج بيانات من Excel/CSV باستخدام `{اسم_العمود}`.
- **ورقة مستعملة:** تخطي أول N ملصقات، أو النقر على أي ملصق في المعاينة لتخطيه.
- **المعاينة قبل الطباعة:** معاينة كل الصفحات، ثم طباعة أو حفظ PDF بالقياس الدقيق.
- **الحفظ:** حفظ تلقائي، مشاريع متعددة محفوظة في المتصفح، تصدير/استيراد ملف `.sticker.json`، تراجع/إعادة.
- **مكتبة 1290 ورقة ملصقات تجارية** (Avery, Herma, Zweckform, Avery US…) بقياساتها الدقيقة — ابحث برقم المنتج مثل `L7160` أو بالقياس `70x37`.
- **تحديد متعدد:** Shift/Ctrl + نقر أو سحب مربع، محاذاة (يسار/وسط/يمين/أعلى/أسفل) نسبةً للتحديد أو الملصق، توزيع متساوٍ، نسخ/لصق بين المشاريع، محاذاة ذكية لحواف العناصر الأخرى.
- **شبكة ومساطر بالمليمتر** في المحرر.
- **الطباعة والتصدير:** نطاق (ملصقات أو صفحات من–إلى)، معايرة إزاحة الطابعة مع صفحة اختبار، علامات القص، طباعة معكوسة لورق النقل الحراري، تصدير PNG بدقة 150/300 dpi.
- **تذكّر آخر طباعة:** يحفظ آخر رقم وموضع، وزر "متابعة" يضبط الترقيم وتخطي الملصقات المستعملة تلقائياً، مع تنبيه عند إعادة طباعة أرقام سابقة.
- **متغيرات التاريخ:** `{date}` `{hijri}` (هجري) `{time}` `{year}` `{month}` `{day}`.
- **تعديل الصور:** السطوع، التباين، رمادي، أبيض وأسود، قلب أفقي/عمودي.
- **8 قوالب جاهزة:** منتجات بباركود، ملفات ودفاتر، أدراج، مواقع مخازن، دفاتر مدرسية، أسماء من جدول، ملصقات دائرية، فارغ.
- واجهة عربية/إنجليزية، وضع ليلي، وتعمل على الهاتف.

### اختصارات / Shortcuts
`Ctrl+S` حفظ · `Ctrl+P` طباعة · `Ctrl+Z / Ctrl+Y` تراجع/إعادة · `Ctrl+A` تحديد الكل · `Ctrl+C / X / V` نسخ/قص/لصق · `Ctrl+D` تكرار · `Delete` حذف · الأسهم للتحريك (`Shift` = 1 مم) · `Ctrl+عجلة الفأرة` تكبير · `Alt` أثناء السحب لإيقاف المحاذاة.

## النشر على GitHub Pages / Deploy
1. Settings → Pages
2. Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save
3. الرابط: `https://<username>.github.io/Sticker-creator/`

## نصائح الطباعة / Printing tips
في نافذة الطباعة اختر: الهوامش = **بلا (None)**، المقياس = **100%** (لا "ملاءمة للصفحة")، وفعّل **رسومات الخلفية** إذا استخدمت ألواناً.
Set margins to *None*, scale to *100%*, and enable *Background graphics*.

## مصادر الإلهام / Credits
- [gLabels-qt](https://github.com/jimevins/glabels-qt) — قاعدة بيانات أوراق الملصقات (`data/label-db.js`، رخصة MIT) وفكرة علامات القص.
- [LabelPrint Studio](https://github.com/a-Arani/labelprint-studio) — فكرة معايرة الإزاحة، صفحة الاختبار، تذكّر آخر رقم مطبوع، التاريخ الهجري، تعديل الصور.
- [QR Layout Tool](https://github.com/shashi089/qr-code-label-designer) — التحديد المتعدد والمحاذاة والتصدير كصورة.
- [luomus label-designer](https://github.com/luomus/label-designer) — المساطر والشبكة في المحرر.

## المكتبات / Libraries
- [JsBarcode](https://github.com/lindell/JsBarcode) 3.11.6 (MIT)
- [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 1.4.4 (MIT)
- [html2canvas](https://github.com/niklasvh/html2canvas) 1.4.1 (MIT) — loaded only when exporting PNG

Both are bundled in `vendor/`, so the app works offline after the first load (fonts come from Google Fonts).
