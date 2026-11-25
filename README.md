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
- **يعمل بدون إنترنت ويُثبَّت كتطبيق** (PWA) على الهاتف والكمبيوتر، والخطوط مستضافة داخل المشروع.
- **تخزين كبير وآمن:** المشاريع والصور والخطوط تُحفظ في IndexedDB (مئات الميغابايت بدل 5 ميغابايت).
- **رفع خطوطك الخاصة** (TTF/OTF/WOFF) وتُضمَّن تلقائياً عند تصدير المشروع.
- **تنزيل PDF مباشرة** بالقياس الدقيق (150/300 dpi) بدون نافذة الطباعة.
- **استيراد Excel مباشرة** (.xlsx / .xls) إضافة إلى CSV.
- **تنسيق المتغيرات:** `{n+100}` `{date+30}` `{price|0.00}` `{price|#,##0.00}` `{name|upper}` `{name|title}` `{n|ar}` (أرقام عربية ١٢٣) `{code|ean}` (إضافة رقم التحقق) `{x|default:—}` `{x|first:10}` `{x|prefix:رقم }` `{price|money:IQD}`.
- **رمز التحقق تلقائي** لـ EAN-13 / EAN-8 / UPC، وأنواع إضافية: **DataMatrix، PDF417، GS1-128، Aztec، GS1 QR**.
- **نص دائري** حول الملصقات الدائرية، و**103 أيقونات** جاهزة (تحذير، قابل للكسر، شحن، إعادة تدوير…).
- **تعديل ملصق واحد بعينه** من المعاينة دون جدول بيانات.
- **محرر الصور:** قص، تدوير، قلب، قص الحواف الفارغة، **إزالة الخلفية** للشعارات.
- **تنسيق مختلط داخل النص:** `**عريض**` `*مائل*` `__تسطير__` `[color=#e00]…[/color]` `[size=16]…[/size]` `[bg=#ff0]…[/bg]` `[font=Amiri]…[/font]`.
- **قوالبك وتقسيماتك الخاصة** تُحفظ بجانب الجاهزة.
- **رابط مشاركة:** التصميم مضغوط داخل الرابط نفسه، بدون أي خادم.
- **سجل الطباعة** مع تصدير CSV، و**دليل سريع** تفاعلي لأول استخدام (زر ؟).
- **8 قوالب جاهزة:** منتجات بباركود، ملفات ودفاتر، أدراج، مواقع مخازن، دفاتر مدرسية، أسماء من جدول، ملصقات دائرية، فارغ.
- واجهة عربية/إنجليزية، وضع ليلي، وتعمل على الهاتف.

### اختصارات / Shortcuts
`Ctrl+S` حفظ · `Ctrl+P` طباعة · `Ctrl+Z / Ctrl+Y` تراجع/إعادة · `Ctrl+A` تحديد الكل · `Ctrl+C / X / V` نسخ/قص/لصق · `Ctrl+D` تكرار · `Delete` حذف · الأسهم للتحريك (`Shift` = 1 مم) · `Ctrl+عجلة الفأرة` تكبير · `Alt` أثناء السحب لإيقاف المحاذاة.

## النشر على GitHub Pages / Deploy
**الطريقة المفضلة (اختبار ونشر تلقائي):**
1. Settings → Pages → Source: **GitHub Actions**
2. كل دفع (push) إلى `main` يشغّل اختبارات Playwright ثم ينشر الموقع تلقائياً (`.github/workflows/pages.yml`).

**أو بدون Actions:** Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)`.

الرابط: `https://<username>.github.io/Sticker-creator/`

## نسخة محلية بملف واحد / Single-file local copy
```bash
python3 tools/build-single.py    # -> dist/sticker-creator.html (~3 MB)
```
ملف HTML واحد يحتوي كل شيء (الخطوط، المكتبات، مكتبة الأوراق، الأيقونات). افتحه بنقرة مزدوجة — يعمل بدون إنترنت وبدون خادم.
One HTML file with everything inlined; open it with a double-click, no internet or server needed.

## التطوير / Development
```bash
npm install
npm run serve            # http://localhost:8080
npx playwright test      # end-to-end tests
python3 tools/build-sw.py   # after changing files: refresh the offline cache list
python3 tools/build-single.py  # single-file copy in dist/
```

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
- [html2canvas](https://github.com/niklasvh/html2canvas) 1.4.1 (MIT) — PNG/PDF export, loaded on demand
- [jsPDF](https://github.com/parallax/jsPDF) 2.5.2 (MIT) — PDF export, loaded on demand
- [SheetJS](https://sheetjs.com) 0.18.5 mini (Apache-2.0) — Excel import, loaded on demand
- [bwip-js](https://github.com/metafloor/bwip-js) 4.5.1 (MIT) — DataMatrix / PDF417 / GS1 / Aztec, loaded on demand
- [Lucide](https://lucide.dev) icons (ISC) — `data/icons.js`
- Fonts via [Fontsource](https://fontsource.org) (SIL Open Font License 1.1) — `fonts/`

All libraries and fonts are bundled in the repo, so the app works fully offline after the first visit.
