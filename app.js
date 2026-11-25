/* Sticker Creator — A4 multi-label sheet designer.
 * Pure client-side; works on GitHub Pages. All geometry is in millimetres. */
(function () {
  'use strict';

  const MM = 96 / 25.4; // CSS px per mm
  const STORE = 'stickerCreator.';
  const SVGNS = 'http://www.w3.org/2000/svg';
  const MAX_PREVIEW_PAGES = 30;
  const MAX_PAGES = 500;

  if (window.qrcode && qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  }

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      appTitle: 'مصمم الملصقات A4', new: 'جديد', templates: 'القوالب', projects: 'مشاريعي', save: 'حفظ',
      undo: 'تراجع', redo: 'إعادة', exportFile: 'تصدير ملف', importFile: 'استيراد', print: 'طباعة / PDF', theme: 'المظهر',
      tabSheet: 'الورقة', tabData: 'البيانات والترقيم', paper: 'الورق', pageSize: 'المقاس', custom: 'مخصص',
      orientation: 'الاتجاه', portrait: 'عمودي', landscape: 'أفقي', widthMm: 'العرض (مم)', heightMm: 'الارتفاع (مم)',
      layoutPresets: 'قوالب التقسيم الجاهزة (A4)', choosePreset: '— اختر تقسيماً جاهزاً —', grid: 'عدد الملصقات', cols: 'الأعمدة', rows: 'الصفوف',
      labelSize: 'قياس الملصق', sizeAuto: 'تلقائي من الهوامش', sizeFixed: 'قياس ثابت', labelW: 'عرض الملصق (مم)', labelH: 'ارتفاع الملصق (مم)',
      centerOnPage: 'توسيط على الصفحة', margins: 'الهوامش والمسافات (مم)', mTop: 'أعلى', mBottom: 'أسفل', mLeft: 'يسار', mRight: 'يمين',
      gapX: 'مسافة أفقية', gapY: 'مسافة عمودية', shapeOrder: 'الشكل والترتيب', radius: 'تدوير الزوايا (مم)', fillOrder: 'ترتيب التعبئة',
      orderLtr: 'صفوف: يسار ← يمين', orderRtl: 'صفوف: يمين ← يسار', orderCol: 'أعمدة: أعلى ← أسفل',
      scaleContent: 'تحجيم التصميم تلقائياً عند تغيير القياس',
      dataSource: 'مصدر البيانات', modeCopies: 'نسخ / ترقيم', modeCsv: 'جدول بيانات (CSV)', labelCount: 'عدد الملصقات', fillPage: 'صفحة كاملة',
      csvHint: 'الصق بيانات من Excel أو CSV. الصف الأول = أسماء الأعمدة. استخدم {اسم_العمود} داخل النصوص.',
      loadCsv: 'تحميل ملف CSV', copiesPerRow: 'نسخ لكل صف', numbering: 'الترقيم التسلسلي {n}', startAt: 'يبدأ من', step: 'الخطوة',
      digits: 'عدد الخانات', prefix: 'بادئة', suffix: 'لاحقة', sheetUse: 'استخدام ورقة مستعملة', skipLabels: 'تخطي أول ملصقات في الصفحة الأولى',
      skipHint: 'مفيد عند إعادة استخدام ورقة طُبع جزء منها. يمكنك أيضاً النقر على الملصقات في الصفحة الأولى من المعاينة لتخطيها.',
      variables: 'المتغيرات المتاحة (انقر للإدراج)', add: 'إضافة:', elText: 'نص', elBarcode: 'باركود', elQr: 'QR', elImage: 'صورة',
      elRect: 'مستطيل', elEllipse: 'دائرة', elLine: 'خط', snap: 'محاذاة للشبكة', fit: 'ملاءمة', sheetPreview: 'معاينة الورقة قبل الطباعة',
      previewZoom: 'الحجم', layers: 'الطبقات', projectsHint: 'تُحفظ المشاريع في متصفحك على هذا الجهاز. استخدم "تصدير ملف" لنقلها أو أخذ نسخة احتياطية.',
      // inspector
      labelSettings: 'إعدادات الملصق', background: 'الخلفية', borderPreview: 'إظهار الحدود في المعاينة', borderPrint: 'طباعة حدود القص',
      borderColor: 'لون الحدود', borderWidth: 'سماكة الحدود (مم)', bgImage: 'صورة خلفية', choose: 'اختيار', remove: 'إزالة',
      noSelection: 'انقر على عنصر داخل الملصق لتعديله، أو أضف عنصراً من شريط الأدوات.',
      position: 'الموضع والحجم (مم)', x: 'س', y: 'ص', w: 'العرض', h: 'الارتفاع', rot: 'الدوران°', opacity: 'الشفافية',
      content: 'المحتوى', text: 'النص', font: 'الخط', size: 'الحجم (pt)', color: 'اللون', bold: 'عريض', italic: 'مائل', underline: 'تسطير',
      align: 'المحاذاة الأفقية', valign: 'المحاذاة العمودية', start: 'بداية', center: 'وسط', end: 'نهاية', top: 'أعلى', middle: 'وسط', bottom: 'أسفل',
      lineHeight: 'تباعد الأسطر', letter: 'تباعد الأحرف', fill: 'تعبئة', none: 'بدون', padding: 'حشوة (مم)', fitText: 'تصغير النص تلقائياً ليناسب الإطار',
      value: 'القيمة', format: 'النوع', showText: 'إظهار الرقم أسفل الباركود', textSize: 'حجم الرقم (pt)', ecc: 'تصحيح الأخطاء', quiet: 'هامش (وحدات)',
      image: 'الصورة', fitMode: 'الملاءمة', contain: 'احتواء', cover: 'تغطية', stretch: 'تمديد', stroke: 'لون الحد', strokeW: 'سماكة الحد (مم)', dashed: 'متقطع',
      name: 'الاسم', duplicate: 'نسخ', delete: 'حذف', front: 'للأمام', back: 'للخلف', centerH: 'توسيط ↔', centerV: 'توسيط ↕', lock: 'قفل', unlock: 'فتح',
      fullSize: 'ملء الملصق',
      // messages
      saved: 'تم الحفظ', unsaved: 'تغييرات غير محفوظة', savedLocal: 'محفوظ', autosaved: 'حُفظ تلقائياً',
      confirmNew: 'سيتم فتح تصميم جديد. التغييرات غير المحفوظة ستُفقد. متابعة؟', confirmDelete: 'حذف هذا المشروع نهائياً؟',
      open: 'فتح', rename: 'إعادة تسمية', copy: 'نسخة', noProjects: 'لا توجد مشاريع محفوظة بعد.', newName: 'الاسم الجديد:',
      importOk: 'تم استيراد المشروع', importBad: 'ملف غير صالح', storageFull: 'مساحة التخزين ممتلئة — صغّر الصور أو صدّر المشروع كملف.',
      perSheet: 'ملصق في الورقة', labelsTotal: 'ملصق', pages: 'صفحة', overflow: 'تحذير: الملصقات تتجاوز حدود الصفحة!', tooSmall: 'القياسات غير صالحة',
      csvRows: 'صف بيانات', columns: 'الأعمدة', morePages: 'صفحات إضافية ستُطبع ولا تظهر في المعاينة', page: 'صفحة',
      skipFromNumber: 'هذا الملصق متخطّى بواسطة رقم "التخطي"', defaultText: 'نص جديد', untitled: 'ملصقات بدون اسم',
      barcodeInvalid: 'قيمة غير صالحة لهذا النوع', fileSaved: 'تم تنزيل الملف',
      tplProduct: 'منتج مع باركود', tplProductD: '3×8 — صورة ونص وباركود مرقّم',
      tplFolder: 'ملصقات الملفات والدفاتر', tplFolderD: '2×7 — عنوان ورقم وسنة',
      tplDrawer: 'ملصقات الأدراج', tplDrawerD: '4×10 — رقم كبير مع بادئة',
      tplBin: 'مواقع المخازن', tplBinD: '2×4 — QR وباركود ورمز الموقع',
      tplNotebook: 'ملصقات الدفاتر المدرسية', tplNotebookD: '2×5 — الاسم والمادة والصف',
      tplAddress: 'أسماء من جدول بيانات', tplAddressD: '3×7 — دمج بيانات CSV',
      tplRound: 'ملصقات دائرية', tplRoundD: '4×6 — دوائر Ø45 مم مرقمة',
      tplBlank: 'فارغ', tplBlankD: '3×8 — ابدأ من الصفر',
      t_yourText: 'اكتب النص هنا', t_fileName: 'اسم الملف', t_fileMeta: 'رقم: {n}   •   السنة: 2026', t_drawer: 'درج',
      t_location: 'الموقع / Location', t_name: 'الاسم: ..............................', t_subject: 'المادة: ............................',
      t_class: 'الصف: ...............................', t_round: 'رقم',
      sheetLibrary: 'مكتبة أوراق الملصقات التجارية', libSearch: 'ابحث برقم المنتج أو الماركة أو القياس… مثال: L7160 أو 70x37',
      libHint: 'قياسات دقيقة لأوراق ملصقات تجارية (Avery, Herma, Zweckform…) من مكتبة gLabels. اختر رقم المنتج المطبوع على علبة الورق.',
      allPapers: 'كل المقاسات', allShapes: 'كل الأشكال', shapeRect: 'مستطيل', shapeRound: 'دائري', shapeEllipse: 'بيضوي', noResults: 'لا توجد نتائج',
      showing: 'عرض', of: 'من', sheet: 'الورقة',
      showGrid: 'الشبكة والمساطر', printTitle: 'الطباعة والتصدير', printRange: 'نطاق الطباعة', rangeAll: 'الكل', rangeLabels: 'ملصقات من – إلى',
      rangePages: 'صفحات من – إلى', from: 'من', to: 'إلى', calibration: 'معايرة الطابعة (إزاحة بالمليمتر)',
      calibrationHint: 'اطبع "صفحة اختبار" على ورق عادي وضعها فوق ورقة الملصقات أمام الضوء. إذا كانت منزاحة، صحّح الإزاحة هنا. يُحفظ هذا الضبط لهذا الجهاز.',
      offsetX: 'أفقي (+ يمين)', offsetY: 'عمودي (+ أسفل)', printOptions: 'خيارات', cropMarks: 'علامات القص في الزوايا',
      mirror: 'طباعة معكوسة (ورق النقل الحراري)', rememberPrint: 'تذكّر آخر رقم مطبوع للمتابعة لاحقاً', testPage: 'صفحة اختبار',
      exportPng: 'تصدير PNG', printTips: 'في نافذة الطباعة: الهوامش = بلا، المقياس = 100%، وفعّل رسومات الخلفية.',
      willPrint: 'سيُطبع', lastPrinted: 'آخر طباعة', lastNumber: 'آخر رقم', continueNext: 'متابعة الترقيم والورقة من بعد آخر طباعة',
      continued: 'تم ضبط الترقيم والتخطي للمتابعة', alreadyPrinted: 'تنبيه: بعض هذه الأرقام طُبعت سابقاً',
      selected: 'عناصر محددة', alignTo: 'المحاذاة نسبةً إلى', toSelection: 'التحديد', toLabel: 'الملصق',
      aLeft: '⇤ يسار', aCenterH: '↔ وسط', aRight: 'يمين ⇥', aTop: '⤒ أعلى', aMiddle: '↕ وسط', aBottom: 'أسفل ⤓',
      distH: 'توزيع أفقي', distV: 'توزيع عمودي', lockAll: 'قفل الكل', unlockAll: 'فتح الكل', copied: 'تم النسخ', pasted: 'تم اللصق',
      multiHint: 'Shift/Ctrl + نقر لتحديد عدة عناصر، أو اسحب مربعاً حولها. Ctrl+A لتحديد الكل.',
      adjust: 'تعديل الصورة', brightness: 'السطوع %', contrast: 'التباين %', grayscale: 'رمادي', bw: 'أبيض وأسود', flipH: 'قلب ↔', flipV: 'قلب ↕',
      exporting: 'جارٍ التصدير…', exported: 'تم تصدير الصور', loadFail: 'تعذّر تحميل المكتبة',
      elArc: 'نص دائري', elIcon: 'أيقونة', uploadFont: 'رفع خط من جهازك (TTF/OTF/WOFF)', fontAdded: 'تمت إضافة الخط', fontBad: 'ملف خط غير صالح',
      richText: 'تنسيق مختلط داخل النص', richHint: '**عريض**  *مائل*  __تسطير__  [color=#e00]ملون[/color]  [size=16]كبير[/size]  [bg=#ff0]تظليل[/bg]  [font=Amiri]خط[/font]',
      editImage: 'تحرير الصورة (قص، تدوير، إزالة الخلفية)', arcSide: 'موضع النص', arcTop: 'أعلى الدائرة', arcBottom: 'أسفل الدائرة',
      inset: 'البعد عن الحافة (مم)', rotateText: 'تدوير النص°', lineW: 'سماكة الخط', arcDefault: 'نص دائري • اكتب هنا',
      myLayouts: 'تقسيماتي المحفوظة', saveLayout: 'حفظ التقسيم الحالي…', deleteLayout: 'حذف تقسيم محفوظ…', layoutName: 'اسم التقسيم:',
      deleteLayoutPrompt: 'اكتب اسم التقسيم المراد حذفه:', templateName: 'اسم القالب:', saveAsTemplate: 'حفظ التصميم الحالي كقالب',
      myTemplates: 'قوالبي', builtinTemplates: 'القوالب الجاهزة', labelNo: 'الملصق رقم', noEditable: 'لا توجد نصوص قابلة للتعديل في هذا التصميم.',
      resetLabel: 'إرجاع للأصل', cancel: 'إلغاء', editedLabels: 'ملصقات معدّلة يدوياً', edited: 'معدّل يدوياً',
      barcodeHint: 'رقم التحقق يُحسب تلقائياً لـ EAN13 (12 رقماً) وEAN8 (7) وUPC (11). أنواع 2D/GS1 تُحمَّل عند الحاجة.',
      linkOpened: 'تم فتح التصميم من الرابط', clickAction: 'عند النقر على ملصق:', clickSkip: 'تخطي', clickEdit: 'تعديل نصه', clearEdits: 'مسح التعديلات',
      imgEditor: 'تحرير الصورة', crop: 'قص التحديد', rotate90: 'تدوير 90°', flip: 'قلب', trim: 'قص الحواف الفارغة', removeBg: 'إزالة الخلفية',
      tolerance: 'درجة التسامح', reset: 'إرجاع', apply: 'تطبيق', cropHint: 'اسحب على الصورة لتحديد منطقة القص. إزالة الخلفية تعمل جيداً مع الشعارات ذات الخلفية الموحدة.',
      share: 'مشاركة', shareTitle: 'رابط مشاركة التصميم', shareHint: 'التصميم محفوظ داخل الرابط نفسه — من يفتحه يحصل على نسخة منه. لا يُرفع أي شيء إلى خادم.',
      copyLink: 'نسخ الرابط', linkCopied: 'تم نسخ الرابط', imagesStripped: 'أُزيلت الصور من الرابط لأنها كبيرة جداً — استخدم "تصدير ملف" لمشاركتها.',
      openShared: 'فتح التصميم المشارَك؟ سيحل محل التصميم المفتوح حالياً (مشاريعك المحفوظة لن تتأثر).',
      printLog: 'سجل الطباعة', clearLog: 'مسح السجل', exportCsv: 'تصدير CSV', noLog: 'لا توجد عمليات طباعة مسجلة بعد.',
      logWhen: 'التاريخ', logProject: 'المشروع', logSheet: 'الورقة', logCount: 'العدد', logRange: 'الأرقام', logKind: 'النوع',
      downloadPdf: 'تنزيل PDF', help: 'دليل سريع', next: 'التالي', prev: 'السابق', skipTour: 'تخطي', done: 'تم',
      tour1: 'مرحباً! من هنا تختار ورقة الملصقات: مقاس جاهز، أو رقم المنتج من مكتبة الأوراق التجارية، أو قياس مخصص.',
      tour2: 'أضف نصوصاً وباركود وQR وصوراً وأيقونات ونصاً دائرياً إلى الملصق.',
      tour3: 'هذا هو المحرر: اسحب العناصر وغيّر حجمها. Shift + نقر لتحديد أكثر من عنصر.',
      tour4: 'خصائص العنصر المحدد تظهر هنا: الخط، اللون، المحاذاة، الحجم…',
      tour5: 'الترقيم التسلسلي ودمج البيانات من Excel أو CSV من هنا. استخدم {n} أو {اسم_العمود} داخل النصوص.',
      tour6: 'معاينة كل الصفحات قبل الطباعة. يمكنك النقر على ملصق لتخطيه أو تعديل نصه.',
      tour7: 'احفظ مشروعك، ثم اطبع أو نزّل PDF أو PNG بالقياس الدقيق.',
    },
    en: {
      appTitle: 'A4 Sticker Designer', new: 'New', templates: 'Templates', projects: 'My projects', save: 'Save',
      undo: 'Undo', redo: 'Redo', exportFile: 'Export file', importFile: 'Import', print: 'Print / PDF', theme: 'Theme',
      tabSheet: 'Sheet', tabData: 'Data & numbering', paper: 'Paper', pageSize: 'Size', custom: 'Custom',
      orientation: 'Orientation', portrait: 'Portrait', landscape: 'Landscape', widthMm: 'Width (mm)', heightMm: 'Height (mm)',
      layoutPresets: 'Ready-made layouts (A4)', choosePreset: '— Choose a layout —', grid: 'Number of labels', cols: 'Columns', rows: 'Rows',
      labelSize: 'Label size', sizeAuto: 'Auto from margins', sizeFixed: 'Fixed size', labelW: 'Label width (mm)', labelH: 'Label height (mm)',
      centerOnPage: 'Center on page', margins: 'Margins & gaps (mm)', mTop: 'Top', mBottom: 'Bottom', mLeft: 'Left', mRight: 'Right',
      gapX: 'Horizontal gap', gapY: 'Vertical gap', shapeOrder: 'Shape & order', radius: 'Corner radius (mm)', fillOrder: 'Fill order',
      orderLtr: 'Rows: left → right', orderRtl: 'Rows: right → left', orderCol: 'Columns: top → bottom',
      scaleContent: 'Scale design automatically when size changes',
      dataSource: 'Data source', modeCopies: 'Copies / numbering', modeCsv: 'Spreadsheet (CSV)', labelCount: 'Number of labels', fillPage: 'Full page',
      csvHint: 'Paste data from Excel or CSV. First row = column names. Use {column_name} inside texts.',
      loadCsv: 'Load CSV file', copiesPerRow: 'Copies per row', numbering: 'Serial numbering {n}', startAt: 'Start at', step: 'Step',
      digits: 'Digits', prefix: 'Prefix', suffix: 'Suffix', sheetUse: 'Reuse a partly used sheet', skipLabels: 'Skip first labels on page 1',
      skipHint: 'Useful when reprinting on a partially used sheet. You can also click labels on page 1 of the preview to skip them.',
      variables: 'Available variables (click to insert)', add: 'Add:', elText: 'Text', elBarcode: 'Barcode', elQr: 'QR', elImage: 'Image',
      elRect: 'Rectangle', elEllipse: 'Ellipse', elLine: 'Line', snap: 'Snap to grid', fit: 'Fit', sheetPreview: 'Sheet print preview',
      previewZoom: 'Size', layers: 'Layers', projectsHint: 'Projects are stored in this browser on this device. Use "Export file" to move them or keep a backup.',
      labelSettings: 'Label settings', background: 'Background', borderPreview: 'Show borders in preview', borderPrint: 'Print cut borders',
      borderColor: 'Border color', borderWidth: 'Border width (mm)', bgImage: 'Background image', choose: 'Choose', remove: 'Remove',
      noSelection: 'Click an element inside the label to edit it, or add one from the toolbar.',
      position: 'Position & size (mm)', x: 'X', y: 'Y', w: 'Width', h: 'Height', rot: 'Rotation°', opacity: 'Opacity',
      content: 'Content', text: 'Text', font: 'Font', size: 'Size (pt)', color: 'Color', bold: 'Bold', italic: 'Italic', underline: 'Underline',
      align: 'Horizontal align', valign: 'Vertical align', start: 'Start', center: 'Center', end: 'End', top: 'Top', middle: 'Middle', bottom: 'Bottom',
      lineHeight: 'Line height', letter: 'Letter spacing', fill: 'Fill', none: 'None', padding: 'Padding (mm)', fitText: 'Shrink text to fit the box',
      value: 'Value', format: 'Type', showText: 'Show number under barcode', textSize: 'Number size (pt)', ecc: 'Error correction', quiet: 'Quiet zone (modules)',
      image: 'Image', fitMode: 'Fit', contain: 'Contain', cover: 'Cover', stretch: 'Stretch', stroke: 'Stroke color', strokeW: 'Stroke width (mm)', dashed: 'Dashed',
      name: 'Name', duplicate: 'Duplicate', delete: 'Delete', front: 'Forward', back: 'Backward', centerH: 'Center ↔', centerV: 'Center ↕', lock: 'Lock', unlock: 'Unlock',
      fullSize: 'Fill label',
      saved: 'Saved', unsaved: 'Unsaved changes', savedLocal: 'Saved', autosaved: 'Autosaved',
      confirmNew: 'Open a new design? Unsaved changes will be lost.', confirmDelete: 'Delete this project permanently?',
      open: 'Open', rename: 'Rename', copy: 'Copy', noProjects: 'No saved projects yet.', newName: 'New name:',
      importOk: 'Project imported', importBad: 'Invalid file', storageFull: 'Storage is full — use smaller images or export the project as a file.',
      perSheet: 'labels per sheet', labelsTotal: 'labels', pages: 'page(s)', overflow: 'Warning: labels exceed the page bounds!', tooSmall: 'Invalid measurements',
      csvRows: 'data rows', columns: 'Columns', morePages: 'more pages will print but are not shown in the preview', page: 'Page',
      skipFromNumber: 'This label is skipped by the "skip" number', defaultText: 'New text', untitled: 'Untitled labels',
      barcodeInvalid: 'Invalid value for this type', fileSaved: 'File downloaded',
      tplProduct: 'Product with barcode', tplProductD: '3×8 — image, text and numbered barcode',
      tplFolder: 'Folder & binder labels', tplFolderD: '2×7 — title, number and year',
      tplDrawer: 'Drawer labels', tplDrawerD: '4×10 — big number with prefix',
      tplBin: 'Warehouse locations', tplBinD: '2×4 — QR, barcode and location code',
      tplNotebook: 'School notebook labels', tplNotebookD: '2×5 — name, subject and class',
      tplAddress: 'Names from a spreadsheet', tplAddressD: '3×7 — CSV data merge',
      tplRound: 'Round stickers', tplRoundD: '4×6 — Ø45 mm numbered circles',
      tplBlank: 'Blank', tplBlankD: '3×8 — start from scratch',
      t_yourText: 'Your text here', t_fileName: 'File name', t_fileMeta: 'No: {n}   •   Year: 2026', t_drawer: 'Drawer',
      t_location: 'Location', t_name: 'Name: ..............................', t_subject: 'Subject: ...........................',
      t_class: 'Class: ..............................', t_round: 'No.',
      sheetLibrary: 'Commercial label sheet library', libSearch: 'Search by product code, brand or size… e.g. L7160 or 70x37',
      libHint: 'Exact geometry for commercial label sheets (Avery, Herma, Zweckform…) from the gLabels library. Pick the product code printed on your label box.',
      allPapers: 'All paper sizes', allShapes: 'All shapes', shapeRect: 'Rectangle', shapeRound: 'Round', shapeEllipse: 'Oval', noResults: 'No results',
      showing: 'Showing', of: 'of', sheet: 'Sheet',
      showGrid: 'Grid & rulers', printTitle: 'Print & export', printRange: 'Print range', rangeAll: 'All', rangeLabels: 'Labels from – to',
      rangePages: 'Pages from – to', from: 'From', to: 'To', calibration: 'Printer calibration (offset in mm)',
      calibrationHint: 'Print a "Test page" on plain paper and hold it over the label sheet against the light. If it is off, correct the offset here. Saved for this device.',
      offsetX: 'Horizontal (+ right)', offsetY: 'Vertical (+ down)', printOptions: 'Options', cropMarks: 'Corner crop marks',
      mirror: 'Mirror print (transfer paper)', rememberPrint: 'Remember the last printed number to continue later', testPage: 'Test page',
      exportPng: 'Export PNG', printTips: 'In the print dialog: margins = None, scale = 100%, enable background graphics.',
      willPrint: 'Will print', lastPrinted: 'Last print', lastNumber: 'last number', continueNext: 'Continue numbering & sheet after last print',
      continued: 'Numbering and skip set to continue', alreadyPrinted: 'Note: some of these numbers were printed before',
      selected: 'elements selected', alignTo: 'Align relative to', toSelection: 'Selection', toLabel: 'Label',
      aLeft: '⇤ Left', aCenterH: '↔ Center', aRight: 'Right ⇥', aTop: '⤒ Top', aMiddle: '↕ Middle', aBottom: 'Bottom ⤓',
      distH: 'Distribute horizontally', distV: 'Distribute vertically', lockAll: 'Lock all', unlockAll: 'Unlock all', copied: 'Copied', pasted: 'Pasted',
      multiHint: 'Shift/Ctrl + click to select several elements, or drag a box around them. Ctrl+A selects all.',
      adjust: 'Image adjustments', brightness: 'Brightness %', contrast: 'Contrast %', grayscale: 'Grayscale', bw: 'Black & white', flipH: 'Flip ↔', flipV: 'Flip ↕',
      exporting: 'Exporting…', exported: 'Images exported', loadFail: 'Could not load the library',
      elArc: 'Curved text', elIcon: 'Icon', uploadFont: 'Upload a font from your device (TTF/OTF/WOFF)', fontAdded: 'Font added', fontBad: 'Invalid font file',
      richText: 'Mixed formatting inside text', richHint: '**bold**  *italic*  __underline__  [color=#e00]colour[/color]  [size=16]big[/size]  [bg=#ff0]highlight[/bg]  [font=Amiri]font[/font]',
      editImage: 'Edit image (crop, rotate, remove background)', arcSide: 'Text position', arcTop: 'Top of circle', arcBottom: 'Bottom of circle',
      inset: 'Distance from edge (mm)', rotateText: 'Rotate text°', lineW: 'Line weight', arcDefault: 'CURVED TEXT • TYPE HERE',
      myLayouts: 'My saved layouts', saveLayout: 'Save current layout…', deleteLayout: 'Delete a saved layout…', layoutName: 'Layout name:',
      deleteLayoutPrompt: 'Type the name of the layout to delete:', templateName: 'Template name:', saveAsTemplate: 'Save current design as template',
      myTemplates: 'My templates', builtinTemplates: 'Built-in templates', labelNo: 'Label no.', noEditable: 'This design has no editable texts.',
      resetLabel: 'Reset to original', cancel: 'Cancel', editedLabels: 'labels edited by hand', edited: 'Edited by hand',
      barcodeHint: 'Check digit is added automatically for EAN13 (12 digits), EAN8 (7) and UPC (11). 2D/GS1 types load on demand.',
      linkOpened: 'Design opened from link', clickAction: 'Clicking a label:', clickSkip: 'Skips it', clickEdit: 'Edits its text', clearEdits: 'Clear edits',
      imgEditor: 'Edit image', crop: 'Crop selection', rotate90: 'Rotate 90°', flip: 'Flip', trim: 'Trim empty borders', removeBg: 'Remove background',
      tolerance: 'Tolerance', reset: 'Reset', apply: 'Apply', cropHint: 'Drag on the image to select a crop area. Background removal works best on logos with a plain background.',
      share: 'Share', shareTitle: 'Design share link', shareHint: 'The design is stored inside the link itself — whoever opens it gets a copy. Nothing is uploaded to a server.',
      copyLink: 'Copy link', linkCopied: 'Link copied', imagesStripped: 'Images were removed from the link because they are too large — use "Export file" to share them.',
      openShared: 'Open the shared design? It replaces the design currently open (your saved projects are not affected).',
      printLog: 'Print history', clearLog: 'Clear history', exportCsv: 'Export CSV', noLog: 'No prints recorded yet.',
      logWhen: 'Date', logProject: 'Project', logSheet: 'Sheet', logCount: 'Count', logRange: 'Numbers', logKind: 'Type',
      downloadPdf: 'Download PDF', help: 'Quick guide', next: 'Next', prev: 'Back', skipTour: 'Skip', done: 'Done',
      tour1: 'Welcome! Choose your label sheet here: a ready layout, a product code from the commercial sheet library, or a custom size.',
      tour2: 'Add texts, barcodes, QR codes, images, icons and curved text to the label.',
      tour3: 'This is the editor: drag and resize elements. Shift + click selects several.',
      tour4: 'The selected element\'s properties appear here: font, colour, alignment, size…',
      tour5: 'Serial numbering and Excel/CSV data merge live here. Use {n} or {column_name} inside texts.',
      tour6: 'Preview every page before printing. Click a label to skip it or edit its text.',
      tour7: 'Save your project, then print or download a PDF or PNG at the exact size.',
    },
  };
  let lang = (() => { try { return localStorage.getItem(STORE + 'lang'); } catch (e) { return null; } })() || 'ar';
  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;

  /* ================= utils ================= */
  /* Large data (projects, autosave, fonts, templates, logs) lives in IndexedDB, which allows hundreds of MB.
   * Values are mirrored in memory after init() so reads stay synchronous. Small settings stay in localStorage. */
  const BIG_KEYS = new Set(['autosave', 'projects', 'clipboard', 'userTemplates', 'userFonts', 'printLog']);
  const KV = (() => {
    const mem = new Map(); let db = null; let ready = false;
    const lsGet = (k) => { try { return localStorage.getItem(STORE + k); } catch (e) { return null; } };
    function openDb() {
      return new Promise((res) => {
        try {
          const r = indexedDB.open('stickerCreator', 1);
          r.onupgradeneeded = () => r.result.createObjectStore('kv');
          r.onsuccess = () => res(r.result); r.onerror = () => res(null); r.onblocked = () => res(null);
        } catch (e) { res(null); }
      });
    }
    async function init() {
      db = await openDb();
      if (db) await new Promise((res) => {
        try {
          const req = db.transaction('kv').objectStore('kv').openCursor();
          req.onsuccess = () => { const c = req.result; if (c) { mem.set(c.key, c.value); c.continue(); } else res(); };
          req.onerror = () => res();
        } catch (e) { res(); }
      });
      // one-time migration from localStorage
      for (const k of BIG_KEYS) {
        const v = lsGet(k);
        if (v == null) continue;
        if (!mem.has(k)) { mem.set(k, v); write(k, v); }
        if (db) try { localStorage.removeItem(STORE + k); } catch (e) { /* ignore */ }
      }
      ready = true;
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* ignore */ }
    }
    function write(k, v) {
      if (!db) { try { localStorage.setItem(STORE + k, v); return true; } catch (e) { toast(t('storageFull')); return false; } }
      try {
        const tx = db.transaction('kv', 'readwrite');
        if (v == null) tx.objectStore('kv').delete(k); else tx.objectStore('kv').put(v, k);
        tx.onerror = () => toast(t('storageFull'));
        return true;
      } catch (e) { toast(t('storageFull')); return false; }
    }
    return { init, get: (k) => (mem.has(k) ? mem.get(k) : null), set: (k, v) => { if (v == null) mem.delete(k); else mem.set(k, v); return write(k, v); },
      get ready() { return ready; }, get usingIdb() { return !!db; } };
  })();
  function safeGet(k) {
    if (BIG_KEYS.has(k) && KV.ready) return KV.get(k);
    try { return localStorage.getItem(STORE + k); } catch (e) { return null; }
  }
  function safeSet(k, v) {
    if (BIG_KEYS.has(k) && KV.ready) return KV.set(k, v);
    try { localStorage.setItem(STORE + k, v); return true; }
    catch (e) { toast(t('storageFull')); return false; }
  }
  const getJSON = (k, d) => { try { const v = safeGet(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const setJSON = (k, v) => safeSet(k, JSON.stringify(v));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const round = (v, p = 2) => Math.round(v * 10 ** p) / 10 ** p;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function debounce(fn, ms) { let h; return (...a) => { clearTimeout(h); h = setTimeout(() => fn(...a), ms); }; }
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'text') e.textContent = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
    return e;
  }
  function getPath(o, p) { return p.split('.').reduce((a, k) => (a == null ? a : a[k]), o); }
  function setPath(o, p, v) { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; }
  function deepMerge(base, over) {
    if (Array.isArray(base) || typeof base !== 'object' || base === null) return over === undefined ? base : over;
    const out = { ...base };
    if (over && typeof over === 'object') for (const k of Object.keys(over)) {
      out[k] = (k in base && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) ? deepMerge(base[k], over[k]) : over[k];
    }
    return out;
  }
  let toastTimer;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  function saveBlob(blob, name) {
    const a = h('a', { href: URL.createObjectURL(blob), download: name, style: 'display:none' });
    (document.querySelector('dialog[open]') || document.body).append(a); // modal dialogs make the rest of the page inert
    a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function download(name, text, type = 'application/json') { saveBlob(new Blob([text], { type }), name); }
  const todayStr = () => new Date().toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-GB');
  function dateVars() {
    const d = new Date();
    let hijri = '';
    try { hijri = new Intl.DateTimeFormat((lang === 'ar' ? 'ar' : 'en') + '-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); } catch (e) { hijri = ''; }
    return { date: todayStr(), hijri, time: d.toLocaleTimeString(lang === 'ar' ? 'ar-IQ' : 'en-GB', { hour: '2-digit', minute: '2-digit' }),
      year: String(d.getFullYear()), month: String(d.getMonth() + 1).padStart(2, '0'), day: String(d.getDate()).padStart(2, '0') };
  }

  /* ================= model ================= */
  const PAGE_SIZES = { A4: [210, 297], A5: [148, 210], A3: [297, 420], Letter: [215.9, 279.4], Legal: [215.9, 355.6] };
  const BUILTIN_FONTS = ['Cairo', 'Tajawal', 'Amiri', 'Noto Kufi Arabic', 'Changa', 'Inter', 'Oswald', 'Roboto Mono', 'Arial', 'Times New Roman', 'Courier New'];
  const FONTS = BUILTIN_FONTS.slice();
  /* ---------- user fonts (stored in IndexedDB, registered with the FontFace API) ---------- */
  const registeredFonts = new Set();
  async function registerFont(name, dataUrl) {
    if (registeredFonts.has(name)) return true;
    try {
      const ff = new FontFace(name, `url(${dataUrl})`);
      await ff.load(); document.fonts.add(ff); registeredFonts.add(name);
      if (!FONTS.includes(name)) FONTS.push(name);
      return true;
    } catch (e) { return false; }
  }
  async function loadUserFonts() {
    const all = getJSON('userFonts', {});
    await Promise.all(Object.entries(all).map(([n, d]) => registerFont(n, d)));
  }
  function uploadFont(cb) {
    const inp = h('input', { type: 'file', accept: '.ttf,.otf,.woff,.woff2,font/*' });
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      const name = f.name.replace(/\.(ttf|otf|woff2?)$/i, '').replace(/[-_]+/g, ' ').trim() || 'Custom';
      const r = new FileReader();
      r.onload = async () => {
        if (!(await registerFont(name, r.result))) { toast(t('fontBad')); return; }
        const all = getJSON('userFonts', {}); all[name] = r.result; setJSON('userFonts', all);
        toast(t('fontAdded') + ': ' + name); cb && cb(name);
      };
      r.readAsDataURL(f);
    };
    inp.click();
  }
  function fontsUsedBy(st) {
    const user = getJSON('userFonts', {}); const out = {};
    for (const e of st.label.elements) if (e.font && user[e.font]) out[e.font] = user[e.font];
    return out;
  }
  async function importFonts(map) {
    if (!map || typeof map !== 'object') return;
    const all = getJSON('userFonts', {});
    for (const [n, d] of Object.entries(map)) if (typeof d === 'string' && d.startsWith('data:')) { all[n] = d; await registerFont(n, d); }
    setJSON('userFonts', all);
  }
  const BARCODE_FORMATS = ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14', 'ITF', 'MSI', 'codabar', 'pharmacode'];
  // 2D / GS1 symbologies rendered with bwip-js (loaded on demand)
  const BWIP_FORMATS = { DATAMATRIX: 'datamatrix', GS1DATAMATRIX: 'gs1datamatrix', PDF417: 'pdf417', 'GS1-128': 'gs1-128', AZTEC: 'azteccode', GS1QR: 'gs1qrcode' };
  const TWO_D = new Set(['DATAMATRIX', 'GS1DATAMATRIX', 'PDF417', 'AZTEC', 'GS1QR']);

  const ELEMENT_DEFAULTS = {
    text: { w: 40, h: 10, text: '', font: 'Cairo', size: 12, color: '#000000', bold: false, italic: false, underline: false,
      align: 'center', valign: 'middle', lineHeight: 1.2, letter: 0, bg: '', pad: 0, fit: false, rich: false },
    barcode: { w: 45, h: 16, value: '{n}', format: 'CODE128', showText: true, textSize: 8, color: '#000000', bg: '' },
    qr: { w: 20, h: 20, value: 'https://example.com/{n}', ecc: 'M', color: '#000000', bg: '', quiet: 0 },
    image: { w: 20, h: 20, src: '', fitMode: 'contain', radius: 0, brightness: 100, contrast: 100, grayscale: false, bw: false, flipH: false, flipV: false },
    rect: { w: 30, h: 15, fill: '#fde8db', stroke: '#e8651d', strokeW: 0.3, radius: 1, dashed: false },
    ellipse: { w: 20, h: 20, fill: '#fde8db', stroke: '#e8651d', strokeW: 0.3, dashed: false },
    line: { w: 40, h: 2, stroke: '#000000', strokeW: 0.4, dashed: false },
    arctext: { w: 40, h: 40, text: 'CIRCULAR • TEXT', font: 'Cairo', size: 10, color: '#000000', bold: true, side: 'top', inset: 1, startAngle: 0, letter: 0.3 },
    icon: { w: 12, h: 12, icon: 'package', color: '#000000', strokeW: 2, fill: '' },
  };
  function makeEl(type, props) {
    return Object.assign({ id: uid(), type, x: 2, y: 2, rot: 0, opacity: 1, locked: false, name: '' }, clone(ELEMENT_DEFAULTS[type]), props || {});
  }

  function baseState() {
    return {
      v: 1, id: null, name: t('untitled'),
      page: { size: 'A4', orientation: 'portrait', w: 210, h: 297 },
      layout: { cols: 3, rows: 8, sizeMode: 'fixed', labelW: 70, labelH: 37, center: true,
        mt: 0, mb: 0, ml: 0, mr: 0, gapX: 0, gapY: 0, radius: 2, order: 'row-ltr', scaleContent: true, sheetRef: '' },
      label: { bg: '#ffffff', bgImage: '', borderPreview: true, borderPrint: false, borderColor: '#9a9a9a', borderWidth: 0.2,
        designW: 70, designH: 37, elements: [] },
      data: { mode: 'copies', copies: 24, csv: '', csvCopies: 1, skip: 0, skipList: [],
        serial: { start: 1, step: 1, pad: 0, prefix: '', suffix: '' }, lastPrinted: null, overrides: {} },
      print: { range: 'all', from: 1, to: 1, crop: false, mirror: false, remember: true },
    };
  }

  /* ---------- templates ---------- */
  function tplState(fn) { const s = baseState(); fn(s); s.label.designW = 0; normalizeDesign(s, true); return s; }
  const TEMPLATES = [
    { key: 'Product', make: () => tplState((s) => {
      Object.assign(s.layout, { cols: 3, rows: 8, labelW: 70, labelH: 37, gapX: 0, gapY: 0, radius: 2 });
      s.data.copies = 24; Object.assign(s.data.serial, { start: 1, pad: 8, prefix: '' });
      s.label.elements = [
        makeEl('text', { x: 2, y: 1.5, w: 66, h: 8, text: t('t_yourText'), size: 11, bold: true }),
        makeEl('image', { x: 3, y: 11, w: 22, h: 22 }),
        makeEl('barcode', { x: 28, y: 11, w: 39, h: 22, value: '{n}', textSize: 8 }),
      ];
    }) },
    { key: 'Folder', make: () => tplState((s) => {
      Object.assign(s.layout, { cols: 2, rows: 7, labelW: 99.1, labelH: 38.1, gapX: 2.5, gapY: 0, radius: 2 });
      s.data.copies = 14; Object.assign(s.data.serial, { start: 1, pad: 3 });
      s.label.elements = [
        makeEl('rect', { x: 0, y: 0, w: 8, h: 38.1, fill: '#e8651d', stroke: '#e8651d', strokeW: 0, radius: 0 }),
        makeEl('text', { x: 11, y: 4, w: 84, h: 15, text: t('t_fileName'), size: 20, bold: true, align: 'start', fit: true }),
        makeEl('line', { x: 11, y: 19.5, w: 84, h: 1.5, stroke: '#e8651d', strokeW: 0.4 }),
        makeEl('text', { x: 11, y: 23, w: 84, h: 10, text: t('t_fileMeta'), size: 11, align: 'start', color: '#444444' }),
      ];
    }) },
    { key: 'Drawer', make: () => tplState((s) => {
      Object.assign(s.layout, { cols: 4, rows: 10, labelW: 48.5, labelH: 25.4, gapX: 0, gapY: 0, radius: 1.5 });
      s.data.copies = 40; Object.assign(s.data.serial, { start: 1, pad: 2, prefix: 'D-' });
      s.label.elements = [
        makeEl('text', { x: 2, y: 2, w: 44.5, h: 14, text: '{n}', font: 'Oswald', size: 28, bold: true }),
        makeEl('text', { x: 2, y: 16, w: 44.5, h: 7, text: t('t_drawer'), size: 9, color: '#666666' }),
      ];
    }) },
    { key: 'Bin', make: () => tplState((s) => {
      Object.assign(s.layout, { cols: 2, rows: 4, labelW: 99.1, labelH: 67.7, gapX: 2.5, gapY: 0, radius: 2 });
      s.data.copies = 8; Object.assign(s.data.serial, { start: 1, pad: 3, prefix: 'A-' });
      s.label.elements = [
        makeEl('qr', { x: 5, y: 7, w: 44, h: 44, value: 'BIN:{n}' }),
        makeEl('text', { x: 53, y: 7, w: 42, h: 20, text: '{n}', font: 'Oswald', size: 32, bold: true }),
        makeEl('text', { x: 53, y: 28, w: 42, h: 7, text: t('t_location'), size: 10, color: '#555555' }),
        makeEl('barcode', { x: 53, y: 37, w: 42, h: 14, value: '{n}', showText: false }),
        makeEl('text', { x: 5, y: 55, w: 89, h: 7, text: '{date}', size: 8, align: 'start', color: '#777777' }),
      ];
    }) },
    { key: 'Notebook', make: () => tplState((s) => {
      Object.assign(s.layout, { cols: 2, rows: 5, labelW: 90, labelH: 50, gapX: 6, gapY: 5, radius: 4 });
      s.data.copies = 10;
      s.label.elements = [
        makeEl('rect', { x: 2, y: 2, w: 86, h: 46, fill: '', stroke: '#e8651d', strokeW: 0.6, radius: 3 }),
        makeEl('text', { x: 6, y: 7, w: 78, h: 10, text: t('t_name'), size: 13, align: 'start' }),
        makeEl('text', { x: 6, y: 20, w: 78, h: 10, text: t('t_subject'), size: 13, align: 'start' }),
        makeEl('text', { x: 6, y: 33, w: 78, h: 10, text: t('t_class'), size: 13, align: 'start' }),
      ];
    }) },
    { key: 'Address', make: () => tplState((s) => {
      Object.assign(s.layout, { cols: 3, rows: 7, labelW: 63.5, labelH: 38.1, gapX: 2.5, gapY: 0, radius: 2 });
      s.data.mode = 'csv';
      s.data.csv = lang === 'ar'
        ? 'name,city,phone\nأحمد علي,بغداد,07700000001\nسارة محمد,البصرة,07700000002\nحسين كريم,أربيل,07700000003\nزينب حسن,النجف,07700000004'
        : 'name,city,phone\nJohn Smith,London,+44 20 0000 0001\nMaria Garcia,Madrid,+34 600 000 002\nAli Hassan,Baghdad,+964 770 000 0003\nYuki Tanaka,Tokyo,+81 3 0000 0004';
      s.label.elements = [
        makeEl('text', { x: 3, y: 4, w: 57.5, h: 11, text: '{name}', size: 14, bold: true, fit: true }),
        makeEl('text', { x: 3, y: 16, w: 57.5, h: 8, text: '{city}', size: 11 }),
        makeEl('text', { x: 3, y: 26, w: 57.5, h: 8, text: '{phone}', size: 10, font: 'Roboto Mono', color: '#555555' }),
      ];
    }) },
    { key: 'Round', make: () => tplState((s) => {
      Object.assign(s.layout, { cols: 4, rows: 6, labelW: 45, labelH: 45, gapX: 4, gapY: 4, radius: 22.5 });
      s.label.bg = '#fff4ec'; s.data.copies = 24;
      s.label.elements = [
        makeEl('ellipse', { x: 3, y: 3, w: 39, h: 39, fill: '', stroke: '#e8651d', strokeW: 0.6, dashed: true }),
        makeEl('text', { x: 5, y: 9, w: 35, h: 8, text: t('t_round'), size: 10, color: '#e8651d', bold: true }),
        makeEl('text', { x: 5, y: 17, w: 35, h: 18, text: '{n}', size: 30, font: 'Oswald', bold: true }),
      ];
    }) },
    { key: 'Blank', make: () => tplState((s) => {
      s.label.elements = [makeEl('text', { x: 5, y: 10, w: 60, h: 17, text: t('t_yourText'), size: 14 })];
    }) },
  ];

  /* ---------- layout presets (A4) ---------- */
  const PRESETS = [
    [1, 1, 210, 297, 0, 0, 0], [1, 2, 210, 148.5, 0, 0, 0], [2, 2, 105, 148.5, 0, 0, 0], [2, 4, 99.1, 67.7, 2.5, 0, 2],
    [2, 5, 105, 57, 0, 0, 0], [2, 7, 99.1, 38.1, 2.5, 0, 2], [2, 8, 99.1, 33.9, 2.5, 0, 2], [3, 6, 70, 49.5, 0, 0, 0],
    [3, 7, 63.5, 38.1, 2.5, 0, 2], [3, 7, 70, 42.3, 0, 0, 0], [3, 8, 70, 37, 0, 0, 0], [3, 8, 63.5, 33.9, 2.5, 0, 2],
    [3, 10, 70, 29.7, 0, 0, 0], [4, 10, 48.5, 25.4, 0, 0, 1], [4, 16, 48.5, 16.9, 0, 0, 1], [5, 13, 38.1, 21.2, 2.5, 0, 1],
    [4, 6, 45, 45, 4, 4, 22.5], [5, 7, 37, 37, 3, 3, 18.5], [7, 10, 25, 25, 3, 3, 12.5],
  ];

  /* ================= state & history ================= */
  let state;
  let selectedId = null;
  let selSet = new Set();
  let alignTo = 'selection';
  function selSetIds(ids) { selSet = new Set(ids); selectedId = ids.length ? ids[ids.length - 1] : null; }
  const selectedEls = () => state.label.elements.filter((e) => selSet.has(e.id));
  let editorZoom = 4;
  let zoomAuto = true;
  let showGrid = safeGet('grid') === '1';
  let history = [], hIdx = -1;
  let lastSavedSnap = null;

  function loadInitial() {
    const auto = safeGet('autosave');
    if (auto) {
      try { const p = JSON.parse(auto); state = migrate(p.state); lastSavedSnap = p.savedSnap || null; return; } catch (e) { /* fallthrough */ }
    }
    state = TEMPLATES[0].make();
  }
  function migrate(s) {
    const m = deepMerge(baseState(), s || {});
    m.label.elements = (m.label.elements || []).map((e) => Object.assign(makeEl(e.type in ELEMENT_DEFAULTS ? e.type : 'text'), e));
    if (!Array.isArray(m.data.skipList)) m.data.skipList = [];
    return m;
  }

  function snapshot() { return JSON.stringify(state); }
  function commit() {
    const snap = snapshot();
    if (history[hIdx] === snap) return;
    history = history.slice(0, hIdx + 1); history.push(snap);
    if (history.length > 100) history.shift();
    hIdx = history.length - 1;
    autosave(snap); updateUndoButtons(); updateSaveState();
  }
  const scheduleCommit = debounce(commit, 400);
  function autosave(snap) { safeSet('autosave', JSON.stringify({ state: JSON.parse(snap || snapshot()), savedSnap: lastSavedSnap })); }
  function undo() { if (hIdx > 0) { hIdx--; restore(); } }
  function redo() { if (hIdx < history.length - 1) { hIdx++; restore(); } }
  function restore() {
    state = JSON.parse(history[hIdx]);
    selSetIds([...selSet].filter((id) => findEl(id)));
    autosave(history[hIdx]); renderAll(); updateUndoButtons();
  }
  function updateUndoButtons() {
    $('[data-act=undo]').disabled = hIdx <= 0;
    $('[data-act=redo]').disabled = hIdx >= history.length - 1;
  }
  function updateSaveState() {
    const el = $('#saveState');
    if (!state.id) { el.textContent = t('autosaved'); return; }
    el.textContent = snapshot() === lastSavedSnap ? '✓ ' + t('savedLocal') : '● ' + t('unsaved');
  }

  /* ================= geometry ================= */
  function pageDims(s) {
    let [w, hh] = s.page.size === 'custom' ? [+s.page.w || 210, +s.page.h || 297] : PAGE_SIZES[s.page.size] || PAGE_SIZES.A4;
    if (s.page.orientation === 'landscape') [w, hh] = [hh, w];
    return { w, h: hh };
  }
  function computeLayout(s) {
    const P = pageDims(s), L = s.layout;
    const cols = Math.max(1, Math.floor(+L.cols || 1)), rows = Math.max(1, Math.floor(+L.rows || 1));
    const gx = +L.gapX || 0, gy = +L.gapY || 0;
    let w, hh, ml, mt;
    if (L.sizeMode === 'auto') {
      w = (P.w - (+L.ml || 0) - (+L.mr || 0) - gx * (cols - 1)) / cols;
      hh = (P.h - (+L.mt || 0) - (+L.mb || 0) - gy * (rows - 1)) / rows;
      ml = +L.ml || 0; mt = +L.mt || 0;
    } else {
      w = +L.labelW || 10; hh = +L.labelH || 10;
      if (L.center) { ml = (P.w - (w * cols + gx * (cols - 1))) / 2; mt = (P.h - (hh * rows + gy * (rows - 1))) / 2; }
      else { ml = +L.ml || 0; mt = +L.mt || 0; }
    }
    const valid = w > 1 && hh > 1;
    const overflow = ml < -0.01 || mt < -0.01 || ml + cols * w + (cols - 1) * gx > P.w + 0.01 || mt + rows * hh + (rows - 1) * gy > P.h + 0.01;
    return { P, w: valid ? w : 10, h: valid ? hh : 10, ml, mt, cols, rows, gx, gy, per: cols * rows, valid, overflow,
      radius: Math.min(+L.radius || 0, Math.min(w, hh) / 2), order: L.order };
  }
  function slotPos(L, k) {
    let r, c;
    if (L.order === 'col') { c = Math.floor(k / L.rows); r = k % L.rows; }
    else { r = Math.floor(k / L.cols); c = k % L.cols; if (L.order === 'row-rtl') c = L.cols - 1 - c; }
    return { x: L.ml + c * (L.w + L.gx), y: L.mt + r * (L.h + L.gy) };
  }
  /** Keep the design proportional when the label size changes. */
  function normalizeDesign(s, force) {
    const L = computeLayout(s), lab = s.label;
    if (!L.valid) return;
    if (lab.designW > 0 && lab.designH > 0 && (Math.abs(lab.designW - L.w) > 0.01 || Math.abs(lab.designH - L.h) > 0.01)
        && (s.layout.scaleContent || force === 'scale')) {
      const sx = L.w / lab.designW, sy = L.h / lab.designH, sf = Math.min(sx, sy);
      for (const e of lab.elements) {
        e.x = round(e.x * sx); e.w = round(e.w * sx); e.y = round(e.y * sy); e.h = round(e.h * sy);
        if (e.type === 'qr') { const m = Math.min(e.w, e.h); e.x = round(e.x + (e.w - m) / 2); e.y = round(e.y + (e.h - m) / 2); e.w = e.h = m; }
        if (e.size) e.size = round(Math.max(3, e.size * sf), 1);
        if (e.textSize) e.textSize = round(Math.max(3, e.textSize * sf), 1);
      }
    }
    lab.designW = round(L.w, 3); lab.designH = round(L.h, 3);
  }

  /* ================= data / records ================= */
  let csvCache = { text: null, out: null };
  function parseCSV(text) {
    if (csvCache.text === text) return csvCache.out;
    const src = (text || '').replace(/\r\n?/g, '\n').replace(/^﻿/, '');
    const firstLine = src.split('\n')[0] || '';
    const count = (d) => firstLine.split(d).length;
    const delim = ['\t', ';', ','].reduce((b, d) => (count(d) > count(b) ? d : b), ',');
    const rows = []; let row = [], f = '', q = false;
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if (q) {
        if (c === '"') { if (src[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += c;
      } else if (c === '"' && f === '') q = true;
      else if (c === delim) { row.push(f); f = ''; }
      else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
      else f += c;
    }
    if (f !== '' || row.length) { row.push(f); rows.push(row); }
    const clean = rows.filter((r) => r.some((c) => c.trim() !== ''));
    const headers = (clean[0] || []).map((x, i) => x.trim() || 'col' + (i + 1));
    const data = clean.slice(1).map((r) => Object.fromEntries(headers.map((hd, i) => [hd, (r[i] || '').trim()])));
    const out = { headers, rows: data };
    csvCache = { text, out };
    return out;
  }
  function serial(s, i) {
    const S = s.data.serial;
    const n = (+S.start || 0) + i * (S.step === '' || S.step == null ? 1 : +S.step);
    const neg = n < 0; let str = String(Math.abs(n));
    if (+S.pad > 0) str = str.padStart(+S.pad, '0');
    return (S.prefix || '') + (neg ? '-' : '') + str + (S.suffix || '');
  }
  function getRecords(s) {
    const D = s.data, dv = dateVars();
    let base = [];
    if (D.mode === 'csv') {
      const { rows } = parseCSV(D.csv); const cp = Math.max(1, Math.floor(+D.csvCopies || 1));
      for (const r of rows) for (let c = 0; c < cp; c++) base.push(r);
    } else {
      const n = clamp(Math.floor(+D.copies || 0), 0, 20000);
      base = Array.from({ length: n }, () => ({}));
    }
    return base.map((r, i) => Object.assign({}, r, dv, { n: serial(s, i), i: String(i + 1), _idx: i }));
  }
  function sampleRecord(s) {
    const recs = getRecords(s);
    if (recs.length) return recs[0];
    const r = Object.assign(dateVars(), { n: serial(s, 0), i: '1' });
    if (s.data.mode === 'csv') for (const hd of parseCSV(s.data.csv).headers) r[hd] = '{' + hd + '}';
    return r;
  }
  /* ---------- template variables: {key}, {key+N}, {date+30}, {key|filter|filter:arg} ---------- */
  const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩', FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  function gs1Check(digits) {
    let sum = 0;
    for (let i = digits.length - 1, w = 3; i >= 0; i--, w = 4 - w) sum += +digits[i] * w;
    return String((10 - (sum % 10)) % 10);
  }
  function addToNumberInString(v, delta) {
    const str = String(v); const m = str.match(/(\d+)(?!.*\d)/);
    if (!m) { const n = parseFloat(str); return isNaN(n) ? str : String(round(n + delta, 6)); }
    const num = +m[1] + delta; const neg = num < 0;
    const body = String(Math.abs(num)).padStart(m[1].length, '0');
    return str.slice(0, m.index) + (neg ? '-' : '') + body + str.slice(m.index + m[1].length);
  }
  function evalExpr(expr, rec) {
    if (has(rec, expr)) return rec[expr];
    const m = /^(.+?)\s*([+-])\s*(\d+(?:\.\d+)?)$/.exec(expr);
    if (!m || !has(rec, m[1].trim())) return undefined;
    const key = m[1].trim(), delta = (m[2] === '-' ? -1 : 1) * +m[3];
    if (key === 'date' || key === 'hijri') {
      const d = new Date(); d.setDate(d.getDate() + delta);
      if (key === 'date') return d.toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-GB');
      try { return new Intl.DateTimeFormat((lang === 'ar' ? 'ar' : 'en') + '-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); } catch (e) { return ''; }
    }
    return addToNumberInString(rec[key], delta);
  }
  function applyFilter(v, f) {
    const raw = f.trim(); v = v == null ? '' : String(v);
    if (/^[#0,]*0[#0]*(\.[0#]+)?$/.test(raw)) { // number pattern, e.g. 0.00  #,##0  000
      const n = parseFloat(v.replace(/[^\d.\-]/g, '')); if (isNaN(n)) return v;
      const dec = (raw.split('.')[1] || '').length, intZeros = (raw.split('.')[0].match(/0/g) || []).length;
      let out = n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: raw.includes(',') });
      const [ip, fp] = out.split('.'); const sign = ip.startsWith('-') ? '-' : '';
      out = sign + ip.replace('-', '').padStart(intZeros, '0') + (fp != null ? '.' + fp : '');
      return out;
    }
    const i = raw.indexOf(':'); const name = (i < 0 ? raw : raw.slice(0, i)).toLowerCase(); const arg = i < 0 ? '' : raw.slice(i + 1);
    switch (name) {
      case 'upper': return v.toUpperCase();
      case 'lower': return v.toLowerCase();
      case 'title': return v.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
      case 'trim': return v.trim();
      case 'ar': return v.replace(/[0-9]/g, (d) => AR_DIGITS[d]);
      case 'fa': return v.replace(/[0-9]/g, (d) => FA_DIGITS[d]);
      case 'en': return v.replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d)).replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d));
      case 'pad': return v.padStart(+arg || 0, '0');
      case 'first': case 'left': return v.slice(0, +arg || 0);
      case 'last': case 'right': return +arg ? v.slice(-arg) : '';
      case 'default': return v.trim() ? v : arg;
      case 'prefix': return v ? arg + v : '';
      case 'suffix': return v ? v + arg : '';
      case 'replace': { const j = arg.indexOf('='); return j < 0 ? v : v.split(arg.slice(0, j)).join(arg.slice(j + 1)); }
      case 'ean': case 'check': { const d = v.replace(/\D/g, ''); return d ? d + gs1Check(d) : v; }
      case 'money': case 'currency': {
        const n = parseFloat(v.replace(/[^\d.\-]/g, '')); if (isNaN(n)) return v;
        try { return n.toLocaleString(lang === 'ar' ? 'ar-IQ' : 'en-US', arg ? { style: 'currency', currency: arg.toUpperCase() } : { maximumFractionDigits: 2 }); } catch (e) { return String(n); }
      }
      default: return v;
    }
  }
  function fillTpl(str, rec) {
    return String(str == null ? '' : str).replace(/\{([^{}]+)\}/g, (m, inner) => {
      const parts = inner.split('|');
      let v = evalExpr(parts[0].trim(), rec);
      if (v === undefined) return m;
      for (const f of parts.slice(1)) v = applyFilter(v, f);
      return v;
    });
  }
  function skipSet(s, per) {
    const set = new Set();
    for (let k = 0; k < Math.min(+s.data.skip || 0, per); k++) set.add(k);
    for (const k of s.data.skipList || []) if (k < per) set.add(k);
    return set;
  }
  function paginate(s, recs) {
    const L = computeLayout(s), skips = skipSet(s, L.per);
    recs = recs || getRecords(s);
    const pages = []; let ri = 0;
    do {
      const pg = [];
      for (let k = 0; k < L.per; k++) {
        if (pages.length === 0 && skips.has(k)) pg.push({ k, skip: true });
        else if (ri < recs.length) pg.push({ k, rec: recs[ri++], page: pages.length });
        else pg.push({ k, empty: true });
      }
      pages.push(pg);
      if (skips.size >= L.per && pages.length === 1 && ri === 0 && recs.length === 0) break;
    } while (ri < recs.length && pages.length < MAX_PAGES);
    return { L, pages, total: recs.length };
  }

  /* ================= rendering: elements ================= */
  const barcodeCache = new Map();
  let bwipLoading = false;
  function bwipSVG(e, value) {
    if (!window.bwipjs) {
      if (!bwipLoading) {
        bwipLoading = true;
        loadScript('vendor/bwip-js-min.js').then(() => { barcodeCache.clear(); renderEditor(); scheduleSheet(); }).catch(() => toast(t('loadFail')));
      }
      return '<svg viewBox="0 0 10 4"><text x="5" y="2.5" font-size="1.4" text-anchor="middle" fill="#999">…</text></svg>';
    }
    const opts = { bcid: BWIP_FORMATS[e.format], text: value, barcolor: e.color.replace('#', ''), paddingwidth: 0, paddingheight: 0 };
    if (!TWO_D.has(e.format)) { opts.includetext = !!e.showText; opts.textxalign = 'center'; opts.height = Math.max(4, e.h * 0.8); opts.textsize = +e.textSize || 8; }
    let svg = window.bwipjs.toSVG(opts);
    svg = svg.replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ').replace(/ width="[\d.]+"/, '').replace(/ height="[\d.]+"/, '');
    return svg;
  }
  function barcodeSVG(e, value) {
    const key = [value, e.format, e.showText, e.textSize, e.color, round(e.w, 1), round(e.h, 1)].join('|');
    if (barcodeCache.has(key)) return barcodeCache.get(key);
    if (BWIP_FORMATS[e.format]) {
      let out = null;
      try { out = bwipSVG(e, value); } catch (err) { out = null; }
      if (window.bwipjs) barcodeCache.set(key, out);
      return out;
    }
    let out = null;
    try {
      const opts = { format: e.format, displayValue: !!e.showText, margin: 0, width: 2, height: 50, lineColor: e.color,
        background: 'transparent', textMargin: 1, font: 'Roboto Mono, monospace', fontSize: 14, fontOptions: 'bold' };
      let svg = document.createElementNS(SVGNS, 'svg');
      JsBarcode(svg, value, opts);
      const W = parseFloat(svg.getAttribute('width')) || 100;
      const unitsPerMm = W / Math.max(1, e.w);
      opts.fontSize = Math.max(4, (+e.textSize || 8) * 0.3528 * unitsPerMm);
      const textH = opts.displayValue ? opts.fontSize + opts.textMargin + 2 : 0;
      opts.height = Math.max(4, e.h * unitsPerMm - textH);
      svg = document.createElementNS(SVGNS, 'svg');
      JsBarcode(svg, value, opts);
      const W2 = parseFloat(svg.getAttribute('width')), H2 = parseFloat(svg.getAttribute('height'));
      svg.setAttribute('viewBox', `0 0 ${W2} ${H2}`);
      svg.removeAttribute('width'); svg.removeAttribute('height'); svg.removeAttribute('style');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('shape-rendering', 'crispEdges');
      out = svg.outerHTML;
    } catch (err) { out = null; }
    if (barcodeCache.size > 3000) barcodeCache.clear();
    barcodeCache.set(key, out);
    return out;
  }
  const qrCache = new Map();
  function qrSVG(e, value) {
    const key = [value, e.ecc, e.color, e.bg, e.quiet].join('|');
    if (qrCache.has(key)) return qrCache.get(key);
    let out = null;
    try {
      const q = qrcode(0, e.ecc || 'M'); q.addData(value || ' ', 'Byte'); q.make();
      const n = q.getModuleCount(), m = Math.max(0, +e.quiet || 0);
      let d = '';
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      const bg = e.bg ? `<rect x="${-m}" y="${-m}" width="${n + 2 * m}" height="${n + 2 * m}" fill="${e.bg}"/>` : '';
      out = `<svg xmlns="${SVGNS}" viewBox="${-m} ${-m} ${n + 2 * m} ${n + 2 * m}" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges">${bg}<path d="${d}" fill="${e.color}"/></svg>`;
    } catch (err) { out = null; }
    if (qrCache.size > 3000) qrCache.clear();
    qrCache.set(key, out);
    return out;
  }

  // Off-screen measurer for "shrink to fit" text.
  let measurer;
  const fitCache = new Map();
  /* Lightweight markup for mixed styles inside one text box:
   * **bold**  *italic*  __underline__  [color=#e00]…[/color]  [size=14]…[/size]  [bg=#ff0]…[/bg]  [font=Amiri]…[/font] */
  const escHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeColor = (c) => (/^(#[0-9a-f]{3,8}|[a-z]{3,20})$/i.test(c) ? c : 'inherit');
  function richHTML(text) {
    let x = escHtml(text);
    x = x.replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>')
      .replace(/__([\s\S]+?)__/g, '<u>$1</u>')
      .replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<i>$2</i>');
    for (let i = 0; i < 4; i++) { // allow some nesting
      x = x.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/g, (m, c, b) => `<span style="color:${safeColor(c)}">${b}</span>`)
        .replace(/\[bg=([^\]]+)\]([\s\S]*?)\[\/bg\]/g, (m, c, b) => `<span style="background:${safeColor(c)}">${b}</span>`)
        .replace(/\[size=([\d.]+)\]([\s\S]*?)\[\/size\]/g, (m, n, b) => `<span style="font-size:${clamp(+n, 2, 300)}pt">${b}</span>`)
        .replace(/\[font=([^\]]+)\]([\s\S]*?)\[\/font\]/g, (m, f, b) => `<span style="font-family:'${f.replace(/['"<>;]/g, '')}',sans-serif">${b}</span>`);
    }
    return x;
  }
  function fittedSize(e, text) {
    const key = [e.rich ? 'R' : '', text, e.font, e.size, e.bold, e.italic, e.letter, e.lineHeight, e.pad, round(e.w, 1), round(e.h, 1)].join('|');
    if (fitCache.has(key)) return fitCache.get(key);
    if (!measurer) {
      measurer = h('div', { style: 'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;' });
      document.body.append(measurer);
    }
    const box = h('div', { style: `width:${e.w}mm;height:${e.h}mm;padding:${e.pad || 0}mm;box-sizing:border-box;overflow:hidden;` });
    const inner = h('div', { style: `white-space:pre-wrap;word-break:break-word;font-family:'${e.font}',sans-serif;font-weight:${e.bold ? 700 : 400};font-style:${e.italic ? 'italic' : 'normal'};line-height:${e.lineHeight};letter-spacing:${e.letter || 0}mm;` }, text);
    if (e.rich) inner.innerHTML = richHTML(text);
    box.append(inner); measurer.append(box);
    let size = +e.size;
    while (size > 3) {
      inner.style.fontSize = size + 'pt';
      if (inner.scrollHeight <= box.clientHeight + 0.5 && inner.scrollWidth <= inner.clientWidth + 0.5) break;
      size = round(size - 0.5, 1);
    }
    box.remove();
    fitCache.set(key, size);
    if (fitCache.size > 5000) fitCache.clear();
    return size;
  }

  function renderElement(e, rec) {
    const node = h('div', { class: 'el el-' + e.type, 'data-id': e.id });
    const st = node.style;
    st.left = e.x + 'mm'; st.top = e.y + 'mm'; st.width = e.w + 'mm'; st.height = e.h + 'mm';
    if (+e.rot) st.transform = `rotate(${e.rot}deg)`;
    if (e.opacity != null && +e.opacity < 1) st.opacity = e.opacity;
    switch (e.type) {
      case 'text': {
        const text = fillTpl(e.text, rec);
        const size = e.fit ? fittedSize(e, text) : +e.size;
        const jc = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[e.valign] || 'center';
        const txt = h('div', { class: 'txt', dir: 'auto' }, e.rich ? null : text);
        if (e.rich) { const inner = h('div'); inner.innerHTML = richHTML(text); txt.append(inner); }
        txt.style.cssText = `font-family:'${e.font}',sans-serif;font-size:${size}pt;color:${e.color};font-weight:${e.bold ? 700 : 400};`
          + `font-style:${e.italic ? 'italic' : 'normal'};text-decoration:${e.underline ? 'underline' : 'none'};text-align:${e.align};`
          + `justify-content:${jc};line-height:${e.lineHeight};letter-spacing:${e.letter || 0}mm;padding:${e.pad || 0}mm;`
          + (e.bg ? `background:${e.bg};` : '');
        node.append(txt);
        break;
      }
      case 'barcode': {
        const v = fillTpl(e.value, rec);
        const svg = barcodeSVG(e, v);
        if (e.bg) st.background = e.bg;
        if (svg) node.innerHTML = svg; else node.append(h('div', { class: 'err' }, t('barcodeInvalid') + '\n' + v));
        break;
      }
      case 'qr': {
        const svg = qrSVG(e, fillTpl(e.value, rec));
        if (svg) node.innerHTML = svg; else node.append(h('div', { class: 'err' }, 'QR ✕'));
        break;
      }
      case 'image': {
        if (e.src) {
          const img = h('img', { src: e.src, alt: '', draggable: 'false' });
          img.style.objectFit = e.fitMode === 'stretch' ? 'fill' : e.fitMode;
          if (+e.radius) img.style.borderRadius = e.radius + 'mm';
          const f = [];
          if (+e.brightness && +e.brightness !== 100) f.push(`brightness(${e.brightness}%)`);
          if (e.bw) f.push('grayscale(1)', 'contrast(400%)');
          else { if (e.grayscale) f.push('grayscale(1)'); if (+e.contrast && +e.contrast !== 100) f.push(`contrast(${e.contrast}%)`); }
          if (f.length) img.style.filter = f.join(' ');
          if (e.flipH || e.flipV) img.style.transform = `scale(${e.flipH ? -1 : 1},${e.flipV ? -1 : 1})`;
          node.append(img);
        } else node.append(h('div', { class: 'ph' }, '🖼'));
        break;
      }
      case 'rect': case 'ellipse': {
        st.background = e.fill || 'transparent';
        if (+e.strokeW > 0) st.border = `${e.strokeW}mm ${e.dashed ? 'dashed' : 'solid'} ${e.stroke}`;
        st.borderRadius = e.type === 'ellipse' ? '50%' : (e.radius || 0) + 'mm';
        break;
      }
      case 'line': {
        const horiz = e.w >= e.h;
        const bar = h('div');
        bar.style.cssText = `position:absolute;${horiz ? `left:0;right:0;top:50%;border-top:${e.strokeW}mm ${e.dashed ? 'dashed' : 'solid'} ${e.stroke};transform:translateY(-50%)`
          : `top:0;bottom:0;left:50%;border-left:${e.strokeW}mm ${e.dashed ? 'dashed' : 'solid'} ${e.stroke};transform:translateX(-50%)`}`;
        node.append(bar);
        break;
      }
      case 'arctext': {
        const text = fillTpl(e.text, rec);
        const sizeMm = (+e.size || 10) * 0.3528, R = Math.min(e.w, e.h) / 2, cx = e.w / 2, cy = e.h / 2;
        const top = e.side !== 'bottom';
        const r = Math.max(1, R - (+e.inset || 0) - (top ? sizeMm * 0.75 : sizeMm * 0.25));
        const pid = `arc_${e.id}_${top ? 't' : 'b'}_${String(round(r, 2)).replace('.', '_')}_${String(round(cx, 2)).replace('.', '_')}`;
        const d = top ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}` : `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;
        node.innerHTML = `<svg viewBox="0 0 ${e.w} ${e.h}" overflow="visible"><defs><path id="${pid}" d="${d}"/></defs>`
          + `<g transform="rotate(${+e.startAngle || 0} ${cx} ${cy})"><text font-family="'${escHtml(e.font)}',sans-serif" font-size="${sizeMm}" font-weight="${e.bold ? 700 : 400}" fill="${safeColor(e.color)}" letter-spacing="${+e.letter || 0}">`
          + `<textPath href="#${pid}" startOffset="50%" text-anchor="middle">${escHtml(text)}</textPath></text></g></svg>`;
        break;
      }
      case 'icon': {
        const body = (window.ICONS && window.ICONS[e.icon]) || '<rect x="4" y="4" width="16" height="16" rx="2"/>';
        node.innerHTML = `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="${e.fill ? safeColor(e.fill) : 'none'}" stroke="${safeColor(e.color)}" stroke-width="${+e.strokeW || 2}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
        break;
      }
    }
    return node;
  }

  function renderLabel(s, L, rec, mode) {
    const lab = s.label;
    const node = h('div', { class: 'label' });
    node.style.cssText = `width:${L.w}mm;height:${L.h}mm;border-radius:${L.radius}mm;background-color:${lab.bg || '#fff'};`;
    if (lab.bgImage) node.style.backgroundImage = `url("${lab.bgImage}")`, node.style.backgroundSize = 'cover', node.style.backgroundPosition = 'center';
    const ov = rec && rec._idx != null && s.data.overrides ? s.data.overrides[rec._idx] : null;
    if (rec) for (const e of lab.elements) node.append(renderElement(ov && ov[e.id] ? Object.assign({}, e, ov[e.id]) : e, rec));
    if (ov && mode === 'preview' && Object.keys(ov).length) node.append(h('div', { class: 'ov-dot', title: t('edited') }));
    const showBorder = mode === 'test' ? true : mode === 'print' ? lab.borderPrint : (lab.borderPreview || lab.borderPrint);
    if (showBorder) {
      const o = h('div', { class: 'outline' });
      o.style.cssText = `position:absolute;inset:0;pointer-events:none;border-radius:${L.radius}mm;border:${Math.max(0.05, +lab.borderWidth || 0.2)}mm ${mode === 'print' || mode === 'test' || lab.borderPrint ? 'solid' : 'dashed'} ${mode === 'test' ? '#000' : lab.borderColor};`;
      node.append(o);
    }
    return node;
  }

  /** opts (print only): { offX, offY, crop, mirror } */
  function renderPage(s, L, pg, mode, opts = {}) {
    const page = h('div', { class: 'page' + (mode === 'print' || mode === 'test' ? ' printing' : '') });
    page.style.width = L.P.w + 'mm'; page.style.height = L.P.h + 'mm';
    const content = h('div', { style: 'position:absolute;inset:0;' });
    const tf = [];
    if (opts.offX || opts.offY) tf.push(`translate(${+opts.offX || 0}mm,${+opts.offY || 0}mm)`);
    if (opts.mirror) tf.push('scaleX(-1)');
    if (tf.length) content.style.transform = tf.join(' ');
    page.append(content);
    for (const slot of pg) {
      const p = slotPos(L, slot.k);
      const printing = mode === 'print' || mode === 'test';
      if (mode === 'print' && (slot.skip || slot.empty)) continue;
      const lab = renderLabel(s, L, mode === 'test' ? null : slot.rec || (slot.skip || slot.empty ? null : {}), mode);
      lab.style.left = p.x + 'mm'; lab.style.top = p.y + 'mm';
      lab.dataset.k = slot.k;
      if (slot.rec) lab.dataset.idx = slot.rec._idx;
      lab.dataset.p = slot.page != null ? slot.page : '';
      if (!printing && slot.skip) lab.classList.add('skipped');
      if (!printing && slot.empty) lab.classList.add('empty');
      content.append(lab);
      if (opts.crop) content.append(...cropMarks(p.x, p.y, L.w, L.h));
    }
    return page;
  }
  function cropMarks(x, y, w, hh) {
    const len = 3, gap = 0.8, out = [];
    const line = (lx, ly, lw, lh) => h('div', { style: `position:absolute;left:${lx}mm;top:${ly}mm;width:${lw}mm;height:${lh}mm;background:#000;` });
    for (const [cx, sx] of [[x, -1], [x + w, 1]]) for (const [cy, sy] of [[y, -1], [y + hh, 1]]) {
      out.push(line(sx < 0 ? cx - gap - len : cx + gap, cy - 0.05, len, 0.1));
      out.push(line(cx - 0.05, sy < 0 ? cy - gap - len : cy + gap, 0.1, len));
    }
    return out;
  }

  /* ================= rendering: sheet preview ================= */
  let sheetRaf = 0;
  function scheduleSheet() { cancelAnimationFrame(sheetRaf); sheetRaf = requestAnimationFrame(renderSheet); }
  function renderSheet() {
    const host = $('#sheetPreview');
    const { L, pages, total } = paginate(state);
    host.innerHTML = '';
    const pct = +$('#previewZoom').value / 100;
    const avail = host.clientWidth - 40;
    let scale = pct;
    if (avail > 0 && L.P.w * MM * scale > avail) scale = avail / (L.P.w * MM);
    pages.slice(0, MAX_PREVIEW_PAGES).forEach((pg, i) => {
      const page = renderPage(state, L, pg, 'preview');
      page.style.transform = `scale(${scale})`;
      const scaler = h('div', { class: 'page-scaler', style: `width:${L.P.w * MM * scale}px;height:${L.P.h * MM * scale}px` }, page);
      page.dataset.page = i;
      page.addEventListener('click', onPreviewClick);
      host.append(h('div', { class: 'page-wrap' }, h('span', { class: 'page-num' }, `${t('page')} ${i + 1} / ${pages.length}`), scaler));
    });
    if (pages.length > MAX_PREVIEW_PAGES) host.append(h('div', { class: 'info' }, `+${pages.length - MAX_PREVIEW_PAGES} ${t('morePages')}`));
    $('#previewInfo').textContent = `${total} ${t('labelsTotal')} · ${pages.length} ${t('pages')}`;
  }
  let previewMode = 'skip';
  function onPreviewClick(ev) {
    const lab = ev.target.closest('.label'); if (!lab) return;
    if (previewMode === 'edit') { if (lab.dataset.idx) openLabelEditor(+lab.dataset.idx); return; }
    if (ev.currentTarget.dataset.page !== '0') return;
    const k = +lab.dataset.k;
    if (k < (+state.data.skip || 0)) { toast(t('skipFromNumber')); return; }
    const list = state.data.skipList || (state.data.skipList = []);
    const i = list.indexOf(k);
    if (i >= 0) list.splice(i, 1); else list.push(k);
    commit(); renderSheet();
  }

  /* ================= rendering: editor ================= */
  function fitZoom() {
    const L = computeLayout(state), stage = $('#stage');
    const aw = stage.clientWidth - 60, ah = stage.clientHeight - 60;
    if (aw <= 0 || ah <= 0) return;
    editorZoom = clamp(Math.min(aw / (L.w * MM), ah / (L.h * MM)), 0.2, 12);
  }
  function rulerSVG(lenMm, px, vertical) {
    const step = px >= 6 ? 1 : px >= 2.5 ? 2 : 5;
    const lbl = px >= 4 ? 10 : px >= 1.5 ? 20 : 50;
    let d = '', txt = '';
    for (let m = 0; m <= lenMm + 0.001; m += step) {
      const pos = round(m * px, 2), big = m % 10 === 0, mid = m % 5 === 0;
      const l = big ? 10 : mid ? 6 : 3;
      d += vertical ? `M${18 - l} ${pos}H18` : `M${pos} ${18 - l}V18`;
      if (m % lbl === 0) txt += vertical
        ? `<text x="2" y="${pos + 3}" font-size="9" transform="rotate(-90 6 ${pos})">${m}</text>`
        : `<text x="${pos + 2}" y="8" font-size="9">${m}</text>`;
    }
    const W = vertical ? 18 : lenMm * px, H = vertical ? lenMm * px : 18;
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="${d}" stroke="currentColor" stroke-width="1" fill="none"/><g fill="currentColor" font-family="sans-serif">${txt}</g></svg>`;
  }
  function renderEditor() {
    const stage = $('#stage');
    const L = computeLayout(state);
    if (zoomAuto) fitZoom();
    const rec = sampleRecord(state);
    const lab = renderLabel(state, L, rec, 'editor');
    lab.classList.add('editor', 'editor-label');
    lab.style.position = 'absolute'; lab.style.left = '0'; lab.style.top = '0';
    lab.style.transformOrigin = '0 0'; lab.style.transform = `scale(${editorZoom})`;
    lab.style.setProperty('--z', editorZoom);
    const single = selSet.size === 1;
    for (const n of $$('.el', lab)) {
      const e = findEl(n.dataset.id);
      if (e.locked) n.classList.add('locked');
      if (selSet.has(e.id)) {
        n.classList.add('sel');
        if (single && !e.locked) for (const d of ['nw', 'ne', 'sw', 'se', 'e', 's']) {
          const hd = h('div', { class: 'handle ' + d, 'data-h': d });
          hd.style.transform = `scale(${1 / editorZoom})`;
          n.append(hd);
        }
      }
    }
    const pxmm = MM * editorZoom;
    const inner = h('div', { class: 'stage-inner', style: `width:${L.w * pxmm}px;height:${L.h * pxmm}px` }, lab);
    if (showGrid) {
      const g = h('div', { class: 'grid-overlay' });
      const big = 5 * pxmm, small = pxmm;
      g.style.backgroundImage = 'linear-gradient(to right, rgba(47,125,246,.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,125,246,.28) 1px, transparent 1px)'
        + (small >= 5 ? ', linear-gradient(to right, rgba(47,125,246,.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,125,246,.1) 1px, transparent 1px)' : '');
      g.style.backgroundSize = `${big}px ${big}px, ${big}px ${big}px` + (small >= 5 ? `, ${small}px ${small}px, ${small}px ${small}px` : '');
      g.style.borderRadius = L.radius * pxmm + 'px';
      inner.append(g);
      const rt = h('div', { class: 'ruler top' }); rt.innerHTML = rulerSVG(L.w, pxmm, false);
      const rl = h('div', { class: 'ruler left' }); rl.innerHTML = rulerSVG(L.h, pxmm, true);
      inner.append(rt, rl);
    }
    stage.innerHTML = ''; stage.append(inner);
    $('#zoomLabel').textContent = Math.round(editorZoom * 100) + '%';
  }

  /* ================= editor interaction ================= */
  const findEl = (id) => state.label.elements.find((e) => e.id === id);
  let drag = null;
  function refreshSelection() { renderEditor(); renderInspector(); renderLayers(); }
  function bbox(els) {
    const x = Math.min(...els.map((e) => e.x)), y = Math.min(...els.map((e) => e.y));
    return { x, y, w: Math.max(...els.map((e) => e.x + e.w)) - x, h: Math.max(...els.map((e) => e.y + e.h)) - y };
  }
  function clientToMm(ev) {
    const r = $('#stage .stage-inner').getBoundingClientRect(), k = editorZoom * MM;
    return { x: (ev.clientX - r.left) / k, y: (ev.clientY - r.top) / k };
  }
  function stagePointerDown(ev) {
    if (ev.button !== 0 && ev.pointerType === 'mouse') return;
    const handle = ev.target.closest('.handle');
    const node = ev.target.closest('.el');
    const additive = ev.shiftKey || ev.ctrlKey || ev.metaKey;
    $('#stage').focus({ preventScroll: true });
    if (!node) {
      if (!$('#stage .stage-inner')) return;
      const base = additive ? new Set(selSet) : new Set();
      if (!additive && selSet.size) { selSetIds([]); refreshSelection(); }
      $('#stage').setPointerCapture(ev.pointerId);
      drag = { mode: 'marquee', start: clientToMm(ev), base, moved: false };
      return;
    }
    const e = findEl(node.dataset.id);
    if (additive && !handle) {
      const ids = [...selSet];
      if (selSet.has(e.id)) ids.splice(ids.indexOf(e.id), 1); else ids.push(e.id);
      selSetIds(ids); refreshSelection();
      if (!selSet.has(e.id)) return;
    } else if (!selSet.has(e.id)) { selSetIds([e.id]); refreshSelection(); }
    else if (selectedId !== e.id) { selectedId = e.id; }
    const movable = selectedEls().filter((x) => !x.locked);
    if (!movable.length) return;
    ev.preventDefault();
    $('#stage').setPointerCapture(ev.pointerId);
    const orig = new Map(movable.map((x) => [x.id, { x: x.x, y: x.y, w: x.w, h: x.h }]));
    drag = { id: e.id, mode: handle ? handle.dataset.h : 'move', sx: ev.clientX, sy: ev.clientY, o: { x: e.x, y: e.y, w: e.w, h: e.h },
      orig, box: bbox(movable), moved: false };
  }
  function drawGuides(guides) {
    const lab = $('#stage .editor-label'); if (!lab) return;
    $$('.guide', lab).forEach((g) => g.remove());
    for (const [d, v] of guides) {
      const g = h('div', { class: 'guide ' + d });
      if (d === 'v') g.style.left = v + 'mm'; else g.style.top = v + 'mm';
      g.style[d === 'v' ? 'width' : 'height'] = (1 / editorZoom) + 'px';
      lab.append(g);
    }
  }
  function applyNodeGeom(e) {
    const node = $(`#stage .el[data-id="${e.id}"]`);
    if (node) { node.style.left = e.x + 'mm'; node.style.top = e.y + 'mm'; node.style.width = e.w + 'mm'; node.style.height = e.h + 'mm'; }
  }
  function stagePointerMove(ev) {
    if (!drag) return;
    if (drag.mode === 'marquee') {
      const p = clientToMm(ev), a = drag.start;
      const r = { x: Math.min(a.x, p.x), y: Math.min(a.y, p.y), w: Math.abs(p.x - a.x), h: Math.abs(p.y - a.y) };
      if (r.w + r.h < 0.5) return;
      drag.moved = true;
      const inner = $('#stage .stage-inner');
      let m = $('.marquee', inner); if (!m) { m = h('div', { class: 'marquee' }); inner.append(m); }
      const k = editorZoom * MM;
      m.style.cssText = `left:${r.x * k}px;top:${r.y * k}px;width:${r.w * k}px;height:${r.h * k}px`;
      const hit = state.label.elements.filter((e) => e.x < r.x + r.w && e.x + e.w > r.x && e.y < r.y + r.h && e.y + e.h > r.y).map((e) => e.id);
      const ids = [...new Set([...drag.base, ...hit])];
      selSet = new Set(ids);
      $$('#stage .el').forEach((n) => n.classList.toggle('sel', selSet.has(n.dataset.id)));
      return;
    }
    const e = findEl(drag.id); if (!e) return;
    const k = editorZoom * MM;
    const dx = (ev.clientX - drag.sx) / k, dy = (ev.clientY - drag.sy) / k;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 0.2) return;
    drag.moved = true;
    const snapOn = $('#snapToggle').checked && !ev.altKey;
    const sn = (v) => (snapOn ? Math.round(v * 2) / 2 : round(v, 2));
    const L = computeLayout(state);
    const guides = [];
    if (drag.mode === 'move') {
      const o = drag.box;
      let x = o.x + dx, y = o.y + dy;
      if (snapOn) {
        const tol = 1.2;
        // other (non-moving) elements' edges & centres as snap targets
        const others = state.label.elements.filter((x2) => !drag.orig.has(x2.id));
        const tx = [0, L.w / 2, L.w, ...others.flatMap((q) => [q.x, q.x + q.w / 2, q.x + q.w])];
        const ty = [0, L.h / 2, L.h, ...others.flatMap((q) => [q.y, q.y + q.h / 2, q.y + q.h])];
        const snapAxis = (pos, size, targets, dir) => {
          let best = null;
          for (const [off, ] of [[0], [size / 2], [size]]) for (const tv of targets) {
            const dd = Math.abs(pos + off - tv);
            if (dd < tol && (!best || dd < best.d)) best = { d: dd, v: tv - off, g: tv };
          }
          if (best) { guides.push([dir, best.g]); return best.v; }
          return sn(pos);
        };
        x = snapAxis(x, o.w, tx, 'v'); y = snapAxis(y, o.h, ty, 'h');
      }
      const ddx = x - o.x, ddy = y - o.y;
      for (const [id, oo] of drag.orig) {
        const q = findEl(id); q.x = round(oo.x + ddx, 2); q.y = round(oo.y + ddy, 2); applyNodeGeom(q);
      }
    } else {
      const o = drag.o, m = drag.mode; let { x, y, w, h: hh } = o;
      if (m.includes('e')) w = o.w + dx;
      if (m.includes('s')) hh = o.h + dy;
      if (m.includes('w')) { w = o.w - dx; x = o.x + dx; }
      if (m.includes('n')) { hh = o.h - dy; y = o.y + dy; }
      if ((e.type === 'qr' || ev.shiftKey) && m.length === 2) { // keep aspect
        const r = o.w / o.h; if (w / hh > r) hh = w / r; else w = hh * r;
      }
      e.w = round(Math.max(1, sn(w)), 2); e.h = round(Math.max(0.5, sn(hh)), 2);
      e.x = round(m.includes('w') ? o.x + o.w - e.w : x, 2); e.y = round(m.includes('n') ? o.y + o.h - e.h : y, 2);
      applyNodeGeom(e);
    }
    drawGuides(guides);
    syncPosFields();
  }
  function stagePointerUp() {
    if (!drag) return;
    const d = drag; drag = null;
    if (d.mode === 'marquee') {
      const ids = [...selSet]; selSetIds(ids); refreshSelection(); return;
    }
    if (d.moved) { renderEditor(); scheduleSheet(); commit(); }
  }
  function syncPosFields() {
    if (selSet.size !== 1) return;
    const e = findEl(selectedId); if (!e) return;
    for (const k of ['x', 'y', 'w', 'h']) { const inp = $(`#inspector [data-k="${k}"]`); if (inp && document.activeElement !== inp) inp.value = e[k]; }
  }

  /* ================= element operations ================= */
  function addElement(type) {
    const L = computeLayout(state);
    const def = ELEMENT_DEFAULTS[type];
    let w = Math.min(def.w, L.w * 0.8), hh = Math.min(def.h, L.h * 0.8);
    if (type === 'qr' || type === 'icon') w = hh = Math.min(def.w, L.w * 0.8, L.h * 0.8);
    const e = makeEl(type, { w: round(w), h: round(hh), x: round((L.w - w) / 2), y: round((L.h - hh) / 2) });
    if (type === 'text') e.text = t('defaultText');
    if (type === 'arctext') { const m = Math.min(L.w, L.h) * 0.9; Object.assign(e, { w: round(m), h: round(m), x: round((L.w - m) / 2), y: round((L.h - m) / 2), text: t('arcDefault') }); }
    state.label.elements.push(e);
    selSetIds([e.id]);
    afterDesignChange(true);
    if (type === 'image') pickImage((src) => { e.src = src; afterDesignChange(true); });
  }
  function removeSelected() {
    if (!selSet.size) return;
    state.label.elements = state.label.elements.filter((e) => !selSet.has(e.id));
    selSetIds([]); afterDesignChange(true);
  }
  function duplicateSelected() {
    const els = selectedEls(); if (!els.length) return;
    const ids = [];
    for (const e of els) {
      const c = Object.assign(clone(e), { id: uid(), x: round(e.x + 2), y: round(e.y + 2), locked: false });
      state.label.elements.splice(state.label.elements.indexOf(e) + 1 + ids.length, 0, c); ids.push(c.id);
    }
    selSetIds(ids); afterDesignChange(true);
  }
  function copySelected() {
    const els = selectedEls(); if (!els.length) return;
    safeSet('clipboard', JSON.stringify(els)); toast(t('copied'));
  }
  function paste() {
    let els; try { els = JSON.parse(safeGet('clipboard') || 'null'); } catch (e) { els = null; }
    if (!Array.isArray(els) || !els.length) return;
    const ids = [];
    for (const e of els) {
      const exists = findEl(e.id);
      const c = Object.assign(makeEl(e.type in ELEMENT_DEFAULTS ? e.type : 'text'), e, { id: uid() });
      if (exists) { c.x = round(c.x + 2); c.y = round(c.y + 2); }
      state.label.elements.push(c); ids.push(c.id);
    }
    safeSet('clipboard', JSON.stringify(ids.map((id) => findEl(id))));
    selSetIds(ids); afterDesignChange(true); toast(t('pasted'));
  }
  function alignSel(how) {
    const els = selectedEls().filter((e) => !e.locked); if (!els.length) return;
    const L = computeLayout(state);
    const B = alignTo === 'label' || els.length === 1 ? { x: 0, y: 0, w: L.w, h: L.h } : bbox(els);
    for (const e of els) {
      if (how === 'left') e.x = B.x;
      if (how === 'centerH') e.x = B.x + (B.w - e.w) / 2;
      if (how === 'right') e.x = B.x + B.w - e.w;
      if (how === 'top') e.y = B.y;
      if (how === 'middle') e.y = B.y + (B.h - e.h) / 2;
      if (how === 'bottom') e.y = B.y + B.h - e.h;
      e.x = round(e.x); e.y = round(e.y);
    }
    afterDesignChange(true);
  }
  function distributeSel(axis) {
    const els = selectedEls().filter((e) => !e.locked); if (els.length < 3) return;
    const [p, sz] = axis === 'h' ? ['x', 'w'] : ['y', 'h'];
    els.sort((a, b) => a[p] - b[p]);
    const start = els[0][p], end = Math.max(...els.map((e) => e[p] + e[sz]));
    const total = els.reduce((a, e) => a + e[sz], 0);
    const gap = (end - start - total) / (els.length - 1);
    let cur = start;
    for (const e of els) { e[p] = round(cur); cur += e[sz] + gap; }
    afterDesignChange(true);
  }
  function moveLayer(dir) {
    const arr = state.label.elements, e = findEl(selectedId); if (!e) return;
    const i = arr.indexOf(e), j = clamp(i + dir, 0, arr.length - 1);
    if (i === j) return; arr.splice(i, 1); arr.splice(j, 0, e); afterDesignChange(true);
  }
  function afterDesignChange(full) {
    renderEditor(); scheduleSheet();
    if (full) { renderInspector(); renderLayers(); commit(); } else { renderLayers(); scheduleCommit(); }
  }

  function pickImage(cb) {
    const inp = $('#imageInput');
    inp.onchange = () => {
      const f = inp.files[0]; inp.value = ''; if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (f.type === 'image/svg+xml') { cb(reader.result); return; }
        const img = new Image();
        img.onload = () => {
          const max = 1200, sc = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          const png = f.type === 'image/png' || f.type === 'image/gif' || f.type === 'image/webp';
          cb(c.toDataURL(png ? 'image/png' : 'image/jpeg', 0.88));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    };
    inp.click();
  }

  /* ================= inspector ================= */
  let lastField = null;
  function fieldWrap(label, input, cls) { return h('label', { class: cls || null }, h('span', null, label), input); }
  function numField(obj, key, label, opts = {}) {
    const inp = h('input', { type: 'number', step: opts.step || 0.1, min: opts.min, max: opts.max, 'data-k': key });
    inp.value = obj[key];
    inp.addEventListener('input', () => { if (inp.value === '') return; obj[key] = +inp.value; onPropChange(opts); });
    return fieldWrap(label, inp, opts.cls);
  }
  function textField(obj, key, label, opts = {}) {
    const inp = h(opts.multi ? 'textarea' : 'input', opts.multi ? { rows: opts.rows || 3, dir: 'auto' } : { type: 'text', dir: 'auto' });
    inp.value = obj[key] || '';
    inp.addEventListener('input', () => { obj[key] = inp.value; onPropChange(opts); });
    inp.addEventListener('focus', () => { lastField = inp; });
    return fieldWrap(label, inp, opts.cls || 'span2');
  }
  function selectField(obj, key, label, options, opts = {}) {
    const sel = h('select');
    for (const o of options) { const [v, l] = Array.isArray(o) ? o : [o, o]; sel.append(h('option', { value: v }, l)); }
    sel.value = obj[key];
    sel.addEventListener('change', () => { obj[key] = sel.value; onPropChange(Object.assign({ full: true }, opts)); });
    return fieldWrap(label, sel, opts.cls);
  }
  function colorField(obj, key, label, opts = {}) {
    const inp = h('input', { type: 'color' });
    const allowNone = opts.none;
    const wrap = h('div', { class: 'row', style: 'margin:0' });
    inp.value = obj[key] || '#ffffff';
    inp.addEventListener('input', () => { obj[key] = inp.value; if (chk) chk.checked = false; onPropChange(opts); });
    wrap.append(inp);
    let chk = null;
    if (allowNone) {
      chk = h('input', { type: 'checkbox' }); chk.checked = !obj[key];
      chk.addEventListener('change', () => { obj[key] = chk.checked ? '' : inp.value; onPropChange(opts); });
      wrap.append(h('label', { class: 'check inline', style: 'font-size:11px;white-space:nowrap' }, chk, t('none')));
    }
    return fieldWrap(label, wrap, opts.cls);
  }
  function checkField(obj, key, label, opts = {}) {
    const inp = h('input', { type: 'checkbox' }); inp.checked = !!obj[key];
    inp.addEventListener('change', () => { obj[key] = inp.checked; onPropChange(opts); });
    return h('label', { class: 'check ' + (opts.cls || 'span2') }, inp, h('span', null, label));
  }
  function segField(obj, key, label, options, opts = {}) {
    const row = h('div', { class: 'align-row' });
    for (const [v, l] of options) {
      const b = h('button', { class: 'btn small' + (obj[key] === v ? ' on' : ''), type: 'button' }, l);
      b.addEventListener('click', () => { obj[key] = v; $$('button', row).forEach((x) => x.classList.toggle('on', x === b)); onPropChange(opts); });
      row.append(b);
    }
    return fieldWrap(label, row, opts.cls || 'span2');
  }
  function toggleBtn(obj, key, label) {
    const b = h('button', { class: 'btn small' + (obj[key] ? ' on' : ''), type: 'button' }, label);
    b.addEventListener('click', () => { obj[key] = !obj[key]; b.classList.toggle('on', obj[key]); onPropChange({}); });
    return b;
  }
  function rangeField(obj, key, label, min, max, step) {
    const out = h('output', { style: 'min-width:34px;text-align:center;font-size:12px;color:var(--text)' }, String(obj[key]));
    const inp = h('input', { type: 'range', min, max, step }); inp.value = obj[key];
    inp.addEventListener('input', () => { obj[key] = +inp.value; out.textContent = inp.value; onPropChange({}); });
    return fieldWrap(label, h('div', { class: 'row', style: 'margin:0' }, inp, out), 'span2');
  }
  function onPropChange(opts) {
    renderEditor(); scheduleSheet(); renderLayers();
    if (opts.full) { commit(); if (opts.rebuild) renderInspector(); } else scheduleCommit();
  }

  const TYPE_KEYS = { text: 'Text', barcode: 'Barcode', qr: 'Qr', image: 'Image', rect: 'Rect', ellipse: 'Ellipse', line: 'Line', arctext: 'Arc', icon: 'Icon' };
  const typeLabel = (e) => t('el' + (TYPE_KEYS[e.type] || 'Text'));
  function fontField(obj, key, opts = {}) {
    const f = selectField(obj, key, t('font'), FONTS, Object.assign({ cls: 'span2' }, opts));
    const sel = $('select', f);
    const row = h('div', { class: 'row', style: 'margin:0' });
    sel.replaceWith(row); row.append(sel,
      h('button', { class: 'btn small', type: 'button', title: t('uploadFont'), onclick: (ev) => { ev.preventDefault(); uploadFont((name) => { obj[key] = name; onPropChange({ full: true }); renderInspector(); }); } }, '＋'));
    sel.style.fontFamily = `'${obj[key]}',sans-serif`;
    return f;
  }
  function renderInspector() {
    const box = $('#inspector'); box.innerHTML = '';
    if (selSet.size > 1) return renderMultiInspector(box);
    const e = findEl(selectedId);
    if (!e) return renderLabelInspector(box);
    const typeName = typeLabel(e);
    box.append(h('div', { class: 'insp-title' }, h('h2', null, typeName),
      h('button', { class: 'btn small', onclick: () => { selSetIds([]); renderEditor(); renderInspector(); renderLayers(); } }, '✕')));
    box.append(h('div', { class: 'insp-actions' },
      h('button', { class: 'btn small', onclick: duplicateSelected }, t('duplicate')),
      h('button', { class: 'btn small', onclick: () => moveLayer(1) }, t('front')),
      h('button', { class: 'btn small', onclick: () => moveLayer(-1) }, t('back')),
      h('button', { class: 'btn small', onclick: () => { e.locked = !e.locked; afterDesignChange(true); } }, e.locked ? '🔒 ' + t('unlock') : t('lock')),
      h('button', { class: 'btn small danger', onclick: removeSelected }, t('delete'))));

    // content
    box.append(h('h3', null, t('content')));
    const g = h('div', { class: 'grid2' }); box.append(g);
    switch (e.type) {
      case 'text':
        g.append(textField(e, 'text', t('text'), { multi: true }));
        g.append(varChipsRow());
        g.append(fontField(e, 'font'));
        g.append(numField(e, 'size', t('size'), { step: 0.5, min: 3 }));
        g.append(colorField(e, 'color', t('color')));
        g.append(h('div', { class: 'align-row span2' }, toggleBtn(e, 'bold', 'B ' + t('bold')), toggleBtn(e, 'italic', 'I ' + t('italic')), toggleBtn(e, 'underline', 'U ' + t('underline'))));
        g.append(segField(e, 'align', t('align'), [['start', t('start')], ['center', t('center')], ['end', t('end')]]));
        g.append(segField(e, 'valign', t('valign'), [['top', t('top')], ['middle', t('middle')], ['bottom', t('bottom')]]));
        g.append(numField(e, 'lineHeight', t('lineHeight'), { step: 0.05, min: 0.5 }));
        g.append(numField(e, 'letter', t('letter'), { step: 0.1 }));
        g.append(numField(e, 'pad', t('padding'), { step: 0.5, min: 0 }));
        g.append(colorField(e, 'bg', t('background'), { none: true }));
        g.append(checkField(e, 'fit', t('fitText')));
        g.append(checkField(e, 'rich', t('richText')));
        if (e.rich) g.append(h('p', { class: 'hint span2 mono-hint' }, t('richHint')));
        break;
      case 'barcode':
        g.append(textField(e, 'value', t('value')));
        g.append(varChipsRow());
        g.append(selectField(e, 'format', t('format'), [...BARCODE_FORMATS, ...Object.keys(BWIP_FORMATS)].map((f) => [f, f + (BWIP_FORMATS[f] ? ' (2D/GS1)' : '')]), { cls: 'span2' }));
        g.append(h('p', { class: 'hint span2' }, t('barcodeHint')));
        g.append(checkField(e, 'showText', t('showText')));
        g.append(numField(e, 'textSize', t('textSize'), { step: 0.5, min: 3 }));
        g.append(colorField(e, 'color', t('color')));
        g.append(colorField(e, 'bg', t('background'), { none: true, cls: 'span2' }));
        break;
      case 'qr':
        g.append(textField(e, 'value', t('value'), { multi: true, rows: 2 }));
        g.append(varChipsRow());
        g.append(selectField(e, 'ecc', t('ecc'), [['L', 'L 7%'], ['M', 'M 15%'], ['Q', 'Q 25%'], ['H', 'H 30%']]));
        g.append(numField(e, 'quiet', t('quiet'), { step: 1, min: 0, max: 8 }));
        g.append(colorField(e, 'color', t('color')));
        g.append(colorField(e, 'bg', t('background'), { none: true }));
        break;
      case 'image':
        g.append(h('div', { class: 'row span2' },
          h('button', { class: 'btn small', onclick: () => pickImage((src) => { e.src = src; afterDesignChange(true); }) }, t('choose')),
          e.src ? h('button', { class: 'btn small danger', onclick: () => { e.src = ''; afterDesignChange(true); } }, t('remove')) : null));
        if (e.src) g.append(h('button', { class: 'btn small span2', onclick: () => openImageEditor(e) }, '✂ ' + t('editImage')));
        g.append(selectField(e, 'fitMode', t('fitMode'), [['contain', t('contain')], ['cover', t('cover')], ['stretch', t('stretch')]]));
        g.append(numField(e, 'radius', t('radius'), { step: 0.5, min: 0 }));
        g.append(h('h3', { class: 'span2', style: 'margin:10px 0 0' }, t('adjust')));
        g.append(rangeField(e, 'brightness', t('brightness'), 0, 200, 5));
        g.append(rangeField(e, 'contrast', t('contrast'), 0, 300, 5));
        g.append(h('div', { class: 'align-row span2' }, toggleBtn(e, 'grayscale', t('grayscale')), toggleBtn(e, 'bw', t('bw')),
          toggleBtn(e, 'flipH', t('flipH')), toggleBtn(e, 'flipV', t('flipV'))));
        break;
      case 'rect': case 'ellipse':
        g.append(colorField(e, 'fill', t('fill'), { none: true, cls: 'span2' }));
        g.append(colorField(e, 'stroke', t('stroke')));
        g.append(numField(e, 'strokeW', t('strokeW'), { step: 0.1, min: 0 }));
        if (e.type === 'rect') g.append(numField(e, 'radius', t('radius'), { step: 0.5, min: 0 }));
        g.append(checkField(e, 'dashed', t('dashed'), { cls: e.type === 'rect' ? '' : 'span2' }));
        break;
      case 'line':
        g.append(colorField(e, 'stroke', t('stroke')));
        g.append(numField(e, 'strokeW', t('strokeW'), { step: 0.1, min: 0.05 }));
        g.append(checkField(e, 'dashed', t('dashed')));
        break;
      case 'arctext':
        g.append(textField(e, 'text', t('text')));
        g.append(varChipsRow());
        g.append(fontField(e, 'font'));
        g.append(numField(e, 'size', t('size'), { step: 0.5, min: 3 }));
        g.append(colorField(e, 'color', t('color')));
        g.append(segField(e, 'side', t('arcSide'), [['top', t('arcTop')], ['bottom', t('arcBottom')]], { full: true }));
        g.append(numField(e, 'inset', t('inset'), { step: 0.5 }));
        g.append(numField(e, 'startAngle', t('rotateText'), { step: 5 }));
        g.append(numField(e, 'letter', t('letter'), { step: 0.1 }));
        g.append(h('div', { class: 'align-row' }, toggleBtn(e, 'bold', 'B ' + t('bold'))));
        break;
      case 'icon': {
        const grid = h('div', { class: 'icon-grid span2' });
        for (const [name, body] of Object.entries(window.ICONS || {})) {
          const b = h('button', { class: 'icon-btn' + (e.icon === name ? ' on' : ''), type: 'button', title: name });
          b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
          b.addEventListener('click', () => { e.icon = name; $$('.icon-btn', grid).forEach((x) => x.classList.toggle('on', x === b)); onPropChange({ full: true }); renderLayers(); });
          grid.append(b);
        }
        g.append(grid);
        g.append(colorField(e, 'color', t('color')));
        g.append(numField(e, 'strokeW', t('lineW'), { step: 0.25, min: 0.25, max: 4 }));
        g.append(colorField(e, 'fill', t('fill'), { none: true, cls: 'span2' }));
        break;
      }
    }

    // geometry
    box.append(h('h3', null, t('position')));
    const gp = h('div', { class: 'grid2' }); box.append(gp);
    gp.append(numField(e, 'x', t('x'), { full: false }), numField(e, 'y', t('y')), numField(e, 'w', t('w'), { min: 0.5 }), numField(e, 'h', t('h'), { min: 0.5 }));
    gp.append(numField(e, 'rot', t('rot'), { step: 1 }));
    const op = h('input', { type: 'range', min: 0.05, max: 1, step: 0.05 }); op.value = e.opacity;
    op.addEventListener('input', () => { e.opacity = +op.value; onPropChange({}); });
    gp.append(fieldWrap(t('opacity'), op));
    const L = computeLayout(state);
    gp.append(h('div', { class: 'align-row span2' },
      h('button', { class: 'btn small', onclick: () => { e.x = round((L.w - e.w) / 2); afterDesignChange(true); } }, t('centerH')),
      h('button', { class: 'btn small', onclick: () => { e.y = round((L.h - e.h) / 2); afterDesignChange(true); } }, t('centerV')),
      h('button', { class: 'btn small', onclick: () => { e.x = 0; e.y = 0; e.w = round(L.w); e.h = round(L.h); afterDesignChange(true); } }, t('fullSize'))));
    gp.append(textField(e, 'name', t('name')));
  }

  function renderMultiInspector(box) {
    const els = selectedEls();
    box.append(h('div', { class: 'insp-title' }, h('h2', null, `${els.length} ${t('selected')}`),
      h('button', { class: 'btn small', onclick: () => { selSetIds([]); refreshSelection(); } }, '✕')));
    box.append(h('div', { class: 'insp-actions' },
      h('button', { class: 'btn small', onclick: duplicateSelected }, t('duplicate')),
      h('button', { class: 'btn small', onclick: copySelected }, t('copy')),
      h('button', { class: 'btn small', onclick: () => { const lock = !els.every((e) => e.locked); els.forEach((e) => { e.locked = lock; }); afterDesignChange(true); } },
        els.every((e) => e.locked) ? t('unlockAll') : t('lockAll')),
      h('button', { class: 'btn small danger', onclick: removeSelected }, t('delete'))));
    box.append(h('h3', null, t('alignTo')));
    const seg = h('div', { class: 'align-row' });
    for (const [v, l] of [['selection', t('toSelection')], ['label', t('toLabel')]]) {
      seg.append(h('button', { class: 'btn small' + (alignTo === v ? ' on' : ''), onclick: () => { alignTo = v; renderInspector(); } }, l));
    }
    box.append(seg);
    const grid = h('div', { class: 'multi-grid', style: 'margin-top:8px' });
    for (const k of ['left', 'centerH', 'right', 'top', 'middle', 'bottom']) {
      grid.append(h('button', { class: 'btn small', onclick: () => alignSel(k) }, t('a' + k[0].toUpperCase() + k.slice(1))));
    }
    box.append(grid);
    box.append(h('div', { class: 'align-row', style: 'margin-top:6px' },
      h('button', { class: 'btn small', disabled: els.length < 3, onclick: () => distributeSel('h') }, t('distH')),
      h('button', { class: 'btn small', disabled: els.length < 3, onclick: () => distributeSel('v') }, t('distV'))));
    // shared text styling
    const texts = els.filter((e) => e.type === 'text');
    if (texts.length) {
      box.append(h('h3', null, t('elText') + ' (' + texts.length + ')'));
      const g = h('div', { class: 'grid2' }); box.append(g);
      const proxy = { font: texts[0].font, size: texts[0].size, color: texts[0].color };
      const apply = (k) => () => { texts.forEach((x) => { x[k] = proxy[k]; }); onPropChange({}); };
      const wrapChange = (el, k) => { el.addEventListener('input', apply(k)); el.addEventListener('change', apply(k)); return el; };
      g.append(wrapChange(fontField(proxy, 'font'), 'font'));
      g.append(wrapChange(numField(proxy, 'size', t('size'), { step: 0.5, min: 3 }), 'size'));
      g.append(wrapChange(colorField(proxy, 'color', t('color')), 'color'));
    }
    box.append(h('p', { class: 'hint' }, t('multiHint')));
  }
  function renderLabelInspector(box) {
    const lab = state.label;
    box.append(h('h2', null, t('labelSettings')));
    box.append(h('p', { class: 'hint' }, t('noSelection')));
    box.append(h('p', { class: 'hint' }, t('multiHint')));
    const g = h('div', { class: 'grid2' }); box.append(g);
    g.append(colorField(lab, 'bg', t('background'), { cls: 'span2' }));
    g.append(h('div', { class: 'span2' }, h('span', { class: 'hint' }, t('bgImage')), h('div', { class: 'row' },
      h('button', { class: 'btn small', onclick: () => pickImage((src) => { lab.bgImage = src; afterDesignChange(true); }) }, t('choose')),
      lab.bgImage ? h('button', { class: 'btn small danger', onclick: () => { lab.bgImage = ''; afterDesignChange(true); } }, t('remove')) : null)));
    g.append(checkField(lab, 'borderPreview', t('borderPreview')));
    g.append(checkField(lab, 'borderPrint', t('borderPrint')));
    g.append(colorField(lab, 'borderColor', t('borderColor')));
    g.append(numField(lab, 'borderWidth', t('borderWidth'), { step: 0.05, min: 0.05 }));
  }

  function varChipsRow() {
    const row = h('div', { class: 'chips span2' });
    for (const v of availableVars()) row.append(h('span', { class: 'chip', onclick: () => insertVar(v) }, '{' + v + '}'));
    return row;
  }
  function availableVars() {
    const v = ['n', 'i', 'date', 'hijri', 'time', 'year', 'month', 'day'];
    if (state.data.mode === 'csv') v.push(...parseCSV(state.data.csv).headers);
    return v;
  }
  function insertVar(v) {
    const token = '{' + v + '}';
    const f = lastField && document.body.contains(lastField) ? lastField : $('#inspector textarea, #inspector input[type=text]');
    if (f) {
      const s = f.selectionStart ?? f.value.length, en = f.selectionEnd ?? f.value.length;
      f.value = f.value.slice(0, s) + token + f.value.slice(en);
      f.focus(); f.setSelectionRange(s + token.length, s + token.length);
      f.dispatchEvent(new Event('input'));
    } else {
      navigator.clipboard && navigator.clipboard.writeText(token).catch(() => {});
      toast(token);
    }
  }

  function renderLayers() {
    const ul = $('#layers'); ul.innerHTML = '';
    const typeLbl = TYPE_KEYS;
    [...state.label.elements].reverse().forEach((e) => {
      const nm = e.name || (e.type === 'text' || e.type === 'arctext' ? e.text : e.type === 'barcode' || e.type === 'qr' ? e.value : e.type === 'icon' ? e.icon : '') || typeLabel(e);
      const li = h('li', { class: selSet.has(e.id) ? 'sel' : '' },
        h('span', { class: 'ltype' }, typeLabel(e)),
        h('span', { class: 'lname', dir: 'auto' }, String(nm).split('\n')[0]),
        e.locked ? h('span', null, '🔒') : null);
      li.addEventListener('click', (ev) => {
        if (ev.shiftKey || ev.ctrlKey || ev.metaKey) {
          const ids = [...selSet]; if (selSet.has(e.id)) ids.splice(ids.indexOf(e.id), 1); else ids.push(e.id); selSetIds(ids);
        } else selSetIds([e.id]);
        refreshSelection();
      });
      ul.append(li);
    });
  }

  /* ================= settings panel bindings ================= */
  function bindSettings() {
    for (const inp of $$('[data-bind]')) {
      const path = inp.dataset.bind;
      const ev = inp.tagName === 'SELECT' || inp.type === 'checkbox' ? 'change' : 'input';
      inp.addEventListener(ev, () => {
        let v;
        if (inp.type === 'checkbox') v = inp.checked;
        else if (inp.type === 'number') { if (inp.value === '') return; v = +inp.value; }
        else v = inp.value;
        setPath(state, path, v);
        onSettingsChange(path, ev === 'change');
      });
    }
    for (const seg of $$('[data-seg]')) {
      seg.addEventListener('click', (ev) => {
        const b = ev.target.closest('button'); if (!b) return;
        setPath(state, seg.dataset.seg, b.dataset.val);
        onSettingsChange(seg.dataset.seg, true);
      });
    }
  }
  function onSettingsChange(path, immediate) {
    if (path === 'page.size' && state.page.size === 'custom') {
      const P = PAGE_SIZES.A4; if (!state.page.w) state.page.w = P[0]; if (!state.page.h) state.page.h = P[1];
    }
    if (path.startsWith('page') || path.startsWith('layout')) {
      if (path === 'layout.sizeMode' && state.layout.sizeMode === 'fixed') {
        const L0 = computeLayout(Object.assign(clone(state), { layout: Object.assign(clone(state.layout), { sizeMode: 'auto' }) }));
        state.layout.labelW = round(L0.w); state.layout.labelH = round(L0.h);
      }
      normalizeDesign(state);
      state.layout.sheetRef = '';
      $('#presetSelect').value = '';
    }
    if (path === 'data.mode' || path === 'data.csv') { csvCache.text = null; }
    if (path === 'data.skip' || path.startsWith('layout.cols') || path.startsWith('layout.rows')) {
      state.data.skipList = (state.data.skipList || []).filter((k) => k < computeLayout(state).per);
    }
    syncSettingsUI(path);
    zoomAuto = zoomAuto || path.startsWith('layout') || path.startsWith('page');
    renderEditor(); scheduleSheet();
    if (path.startsWith('data')) { renderVarChips(); if (selectedId) renderInspector(); }
    if (immediate) commit(); else scheduleCommit();
  }
  function syncSettingsUI(exceptPath) {
    for (const inp of $$('[data-bind]')) {
      if (inp.dataset.bind === exceptPath && document.activeElement === inp) continue;
      const v = getPath(state, inp.dataset.bind);
      if (inp.type === 'checkbox') inp.checked = !!v; else inp.value = v == null ? '' : v;
    }
    for (const seg of $$('[data-seg]')) {
      const v = getPath(state, seg.dataset.seg);
      $$('button', seg).forEach((b) => b.classList.toggle('on', b.dataset.val === v));
    }
    const show = (sel, on) => $$(sel).forEach((x) => { x.hidden = !on; });
    show('.custom-only', state.page.size === 'custom');
    show('.fixed-only', state.layout.sizeMode === 'fixed');
    show('.csv-only', state.data.mode === 'csv');
    show('.copies-only', state.data.mode !== 'csv');
    // margins are irrelevant when fixed+centered
    const marginsDisabled = state.layout.sizeMode === 'fixed' && state.layout.center;
    $$('.margins input').forEach((i) => {
      const k = i.dataset.bind.split('.')[1];
      i.disabled = marginsDisabled && ['mt', 'mb', 'ml', 'mr'].includes(k) || (state.layout.sizeMode === 'fixed' && ['mb', 'mr'].includes(k));
    });
    const L = computeLayout(state);
    const info = $('#layoutInfo');
    info.className = 'info' + (!L.valid || L.overflow ? ' warn' : '');
    info.textContent = !L.valid ? t('tooSmall')
      : `${L.per} ${t('perSheet')} · ${round(L.w, 2)} × ${round(L.h, 2)} mm` + (L.overflow ? ' — ' + t('overflow') : '');
    if (state.data.mode === 'csv') {
      const p = parseCSV(state.data.csv);
      $('#csvInfo').textContent = `${p.rows.length} ${t('csvRows')} · ${t('columns')}: ${p.headers.join(', ') || '—'}`;
    }
    $('#projectName').value = state.name || '';
    $('#sheetRef').textContent = state.layout.sheetRef ? `✓ ${t('sheet')}: ${state.layout.sheetRef}` : '';
    if ($('#printDlg').open) syncPrintDlg();
  }
  function renderVarChips() {
    const box = $('#varChips'); box.innerHTML = '';
    for (const v of availableVars()) box.append(h('span', { class: 'chip', onclick: () => insertVar(v) }, '{' + v + '}'));
  }
  function renderPresets() {
    const sel = $('#presetSelect'); sel.innerHTML = '';
    sel.append(h('option', { value: '' }, t('choosePreset')));
    PRESETS.forEach((p, i) => {
      const [c, r, w, hh, , , rad] = p;
      const round_ = rad * 2 >= Math.min(w, hh) - 0.01;
      sel.append(h('option', { value: i }, `${c} × ${r} (${c * r}) — ${round_ ? 'Ø' + w : w + ' × ' + hh} mm`));
    });
    const mine = getUserLayouts();
    const grp = h('optgroup', { label: t('myLayouts') });
    mine.forEach((u, i) => grp.append(h('option', { value: 'u:' + i }, u.name)));
    grp.append(h('option', { value: 'save' }, '＋ ' + t('saveLayout')));
    if (mine.length) grp.append(h('option', { value: 'del' }, '✕ ' + t('deleteLayout')));
    sel.append(grp);
    sel.onchange = () => {
      if (sel.value === '') return;
      if (sel.value === 'save') {
        const L = computeLayout(state);
        const name = prompt(t('layoutName'), state.layout.sheetRef || `${L.cols}×${L.rows} — ${round(L.w, 1)}×${round(L.h, 1)} mm`);
        if (name) { mine.push({ name, page: clone(state.page), layout: clone(state.layout) }); safeSet('userLayouts', JSON.stringify(mine)); toast(t('saved')); }
        renderPresets(); return;
      }
      if (sel.value === 'del') {
        const name = prompt(t('deleteLayoutPrompt') + '\n' + mine.map((u) => '• ' + u.name).join('\n'));
        const i = mine.findIndex((u) => u.name === name);
        if (i >= 0) { mine.splice(i, 1); safeSet('userLayouts', JSON.stringify(mine)); }
        renderPresets(); return;
      }
      if (sel.value.startsWith('u:')) {
        const u = mine[+sel.value.slice(2)]; if (!u) return;
        Object.assign(state.page, clone(u.page)); Object.assign(state.layout, clone(u.layout));
        state.data.skipList = [];
        normalizeDesign(state); zoomAuto = true;
        const keep = sel.value; renderAll(); commit(); sel.value = keep; return;
      }
      const [c, r, w, hh, gx, gy, rad] = PRESETS[+sel.value];
      Object.assign(state.page, { size: 'A4', orientation: 'portrait' });
      Object.assign(state.layout, { cols: c, rows: r, labelW: w, labelH: hh, gapX: gx, gapY: gy, radius: rad, sizeMode: 'fixed', center: true });
      state.data.skipList = []; state.layout.sheetRef = '';
      if (state.data.mode === 'copies') state.data.copies = c * r;
      normalizeDesign(state); zoomAuto = true;
      const keep = sel.value;
      renderAll(); commit(); sel.value = keep;
    };
  }

  function getUserLayouts() { try { const a = JSON.parse(safeGet('userLayouts') || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }

  /* ================= templates & projects ================= */
  function tplCard(s, title, sub, onPick, onDelete) {
    const L = computeLayout(s);
    const sc = Math.min(170 / (L.w * MM), 110 / (L.h * MM));
    const lab = renderLabel(s, L, sampleRecord(s), 'preview');
    lab.style.position = 'relative'; lab.style.transform = `scale(${sc})`; lab.style.transformOrigin = '0 0';
    lab.style.boxShadow = '0 1px 4px rgba(0,0,0,.2)';
    const holder = h('div', { class: 'tpl-holder', style: `width:${L.w * MM * sc}px;height:${L.h * MM * sc}px` }, lab);
    const card = h('div', { class: 'tpl', role: 'button', tabindex: '0' }, h('div', { class: 'thumb' }, holder),
      h('strong', { dir: 'auto' }, title), h('small', null, sub));
    card.addEventListener('click', onPick);
    card.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') onPick(); });
    if (onDelete) {
      const del = h('button', { class: 'btn small danger tpl-del', type: 'button', title: t('delete') }, '✕');
      del.addEventListener('click', (ev) => { ev.stopPropagation(); onDelete(); });
      card.append(del);
    }
    return card;
  }
  function isDirty() { return state.id ? snapshot() !== lastSavedSnap : state.label.elements.length > 0 && history.length > 1; }
  function newFromState(s) {
    state = s; state.id = null; selSetIds([]); lastSavedSnap = null; zoomAuto = true;
    history = []; hIdx = -1; commit(); renderAll();
  }
  function openTemplates() {
    const grid = $('#templateGrid'); grid.innerHTML = '';
    const pick = (make) => () => { if (isDirty() && !confirm(t('confirmNew'))) return; $('#templatesDlg').close(); newFromState(make()); };
    grid.append(h('div', { class: 'tpl-bar' },
      h('button', { class: 'btn primary', type: 'button', onclick: () => {
        const name = prompt(t('templateName'), state.name || ''); if (!name) return;
        const all = getJSON('userTemplates', {}); const id = uid() + uid();
        const st = clone(state); st.id = null; st.data.lastPrinted = null;
        all[id] = { id, name, at: Date.now(), state: st };
        setJSON('userTemplates', all); toast(t('saved')); openTemplates();
      } }, '＋ ' + t('saveAsTemplate'))));
    const mine = Object.values(getJSON('userTemplates', {})).sort((a, b) => b.at - a.at);
    if (mine.length) {
      grid.append(h('h3', { class: 'tpl-sec' }, t('myTemplates')));
      for (const u of mine) {
        const L = computeLayout(migrate(u.state));
        grid.append(tplCard(migrate(u.state), u.name, `${L.cols}×${L.rows} — ${round(L.w, 1)}×${round(L.h, 1)} mm`,
          pick(() => { const st = migrate(clone(u.state)); st.name = u.name; return st; }),
          () => { if (!confirm(t('confirmDelete'))) return; const all = getJSON('userTemplates', {}); delete all[u.id]; setJSON('userTemplates', all); openTemplates(); }));
      }
      grid.append(h('h3', { class: 'tpl-sec' }, t('builtinTemplates')));
    }
    for (const tp of TEMPLATES) grid.append(tplCard(tp.make(), t('tpl' + tp.key), t('tpl' + tp.key + 'D'), pick(tp.make)));
    if (!$('#templatesDlg').open) $('#templatesDlg').showModal();
  }

  /* ================= per-label editing ================= */
  function openLabelEditor(idx) {
    const recs = getRecords(state); const rec = recs[idx]; if (!rec) return;
    const ovs = state.data.overrides || (state.data.overrides = {});
    const ov = ovs[idx] || {};
    const body = $('#labelDlgBody'); body.innerHTML = '';
    body.append(h('p', { class: 'hint' }, `${t('labelNo')} ${idx + 1}  ·  {n} = `, h('b', { dir: 'ltr' }, rec.n)));
    const fields = [];
    for (const e of state.label.elements) {
      const key = e.type === 'text' || e.type === 'arctext' ? 'text' : e.type === 'barcode' || e.type === 'qr' ? 'value' : null;
      if (!key) continue;
      const ta = h('textarea', { rows: 2, dir: 'auto' });
      ta.value = ov[e.id] && ov[e.id][key] != null ? ov[e.id][key] : e[key];
      fields.push([e, key, ta]);
      const preview = h('small', { class: 'hint', dir: 'auto' }, '→ ' + fillTpl(ta.value, rec));
      ta.addEventListener('input', () => { preview.textContent = '→ ' + fillTpl(ta.value, rec); });
      body.append(h('label', { class: 'full' }, h('span', null, `${typeLabel(e)} — ${e.name || String(e[key]).split('\n')[0].slice(0, 40)}`), ta, preview));
    }
    if (!fields.length) body.append(h('p', { class: 'empty-msg' }, t('noEditable')));
    const close = () => $('#labelDlg').close();
    body.append(h('div', { class: 'dlg-actions' },
      h('button', { class: 'btn danger', type: 'button', onclick: () => { delete ovs[idx]; commit(); renderSheet(); close(); } }, t('resetLabel')),
      h('span', { class: 'grow' }),
      h('button', { class: 'btn', type: 'button', onclick: close }, t('cancel')),
      h('button', { class: 'btn accent', type: 'button', onclick: () => {
        const n = {};
        for (const [e, key, ta] of fields) if (ta.value !== e[key]) n[e.id] = { [key]: ta.value };
        if (Object.keys(n).length) ovs[idx] = n; else delete ovs[idx];
        commit(); renderSheet(); updateEditedInfo(); close();
      } }, t('save'))));
    $('#labelDlg').showModal();
  }
  function updateEditedInfo() {
    const n = Object.keys(state.data.overrides || {}).length;
    const el = $('#editedInfo'); if (!el) return;
    el.hidden = !n; el.querySelector('span').textContent = `${n} ${t('editedLabels')}`;
  }

  /* ================= image editor: crop, rotate, trim, remove background ================= */
  let imgEd = null;
  function cloneCanvas(src, w = src.width, hh = src.height, sx = 0, sy = 0) {
    const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(hh));
    c.getContext('2d').drawImage(src, sx, sy, w, hh, 0, 0, c.width, c.height); return c;
  }
  function openImageEditor(e) {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      imgEd = { e, orig: c, work: cloneCanvas(c), crop: null };
      $('#imgTol').value = 30; drawImgEd(); $('#imgDlg').showModal();
    };
    img.src = e.src;
  }
  function drawImgEd() {
    const view = $('#imgCanvas'), w = imgEd.work;
    const maxW = Math.min(560, window.innerWidth - 80), sc = Math.min(1, maxW / w.width, 360 / w.height);
    view.width = Math.max(1, Math.round(w.width * sc)); view.height = Math.max(1, Math.round(w.height * sc)); imgEd.sc = sc;
    const ctx = view.getContext('2d'); ctx.clearRect(0, 0, view.width, view.height); ctx.drawImage(w, 0, 0, view.width, view.height);
    const c = imgEd.crop;
    if (c && c.w > 1 && c.h > 1) {
      ctx.fillStyle = 'rgba(0,0,0,.45)';
      ctx.fillRect(0, 0, view.width, c.y * sc); ctx.fillRect(0, (c.y + c.h) * sc, view.width, view.height);
      ctx.fillRect(0, c.y * sc, c.x * sc, c.h * sc); ctx.fillRect((c.x + c.w) * sc, c.y * sc, view.width, c.h * sc);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.strokeRect(c.x * sc, c.y * sc, c.w * sc, c.h * sc);
    }
    $('#imgSize').textContent = `${w.width} × ${w.height}px` + (c && c.w > 1 ? `  →  ${Math.round(c.w)} × ${Math.round(c.h)}px` : '');
  }
  function imgEdPointer() {
    const view = $('#imgCanvas'); let start = null;
    const pt = (ev) => { const r = view.getBoundingClientRect(); return { x: clamp((ev.clientX - r.left) / imgEd.sc, 0, imgEd.work.width), y: clamp((ev.clientY - r.top) / imgEd.sc, 0, imgEd.work.height) }; };
    view.addEventListener('pointerdown', (ev) => { start = pt(ev); view.setPointerCapture(ev.pointerId); imgEd.crop = null; drawImgEd(); });
    view.addEventListener('pointermove', (ev) => {
      if (!start) return; const p = pt(ev);
      imgEd.crop = { x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), w: Math.abs(p.x - start.x), h: Math.abs(p.y - start.y) }; drawImgEd();
    });
    view.addEventListener('pointerup', () => { start = null; });
  }
  function bgColorAt(data, w, hh) {
    const idx = [0, w - 1, (hh - 1) * w, hh * w - 1].map((i) => i * 4);
    const best = idx.map((i) => [data[i], data[i + 1], data[i + 2], data[i + 3]]);
    return best.sort((a, b) => b[3] - a[3])[0];
  }
  const colorDist = (d, i, c) => Math.abs(d[i] - c[0]) + Math.abs(d[i + 1] - c[1]) + Math.abs(d[i + 2] - c[2]);
  const imgEdOps = {
    rotate() {
      const w = imgEd.work, c = document.createElement('canvas'); c.width = w.height; c.height = w.width;
      const ctx = c.getContext('2d'); ctx.translate(c.width, 0); ctx.rotate(Math.PI / 2); ctx.drawImage(w, 0, 0);
      imgEd.work = c; imgEd.crop = null;
    },
    flip() { const w = imgEd.work, c = cloneCanvas(w, w.width, w.height); const ctx = c.getContext('2d'); ctx.clearRect(0, 0, c.width, c.height); ctx.translate(c.width, 0); ctx.scale(-1, 1); ctx.drawImage(w, 0, 0); imgEd.work = c; },
    crop() { const c = imgEd.crop; if (!c || c.w < 2 || c.h < 2) return; imgEd.work = cloneCanvas(imgEd.work, c.w, c.h, c.x, c.y); imgEd.crop = null; },
    trim() {
      const w = imgEd.work, ctx = w.getContext('2d'), { data } = ctx.getImageData(0, 0, w.width, w.height);
      const bg = bgColorAt(data, w.width, w.height), tol = +$('#imgTol').value;
      let x0 = w.width, y0 = w.height, x1 = -1, y1 = -1;
      for (let y = 0; y < w.height; y++) for (let x = 0; x < w.width; x++) {
        const i = (y * w.width + x) * 4;
        if (data[i + 3] > 10 && (bg[3] < 10 || colorDist(data, i, bg) > tol)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      if (x1 >= x0 && y1 >= y0) imgEd.work = cloneCanvas(w, x1 - x0 + 1, y1 - y0 + 1, x0, y0);
    },
    removeBg() {
      const w = imgEd.work, W = w.width, H = w.height, ctx = w.getContext('2d'), im = ctx.getImageData(0, 0, W, H), d = im.data;
      const bg = bgColorAt(d, W, H), tol = +$('#imgTol').value * 3;
      const seen = new Uint8Array(W * H), stack = [];
      for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
      for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
      while (stack.length) {
        const p = stack.pop(); if (seen[p]) continue; seen[p] = 1;
        const i = p * 4; if (d[i + 3] === 0 ? false : colorDist(d, i, bg) > tol) continue;
        d[i + 3] = 0;
        const x = p % W;
        if (x > 0) stack.push(p - 1); if (x < W - 1) stack.push(p + 1);
        if (p >= W) stack.push(p - W); if (p < W * (H - 1)) stack.push(p + W);
      }
      ctx.putImageData(im, 0, 0);
    },
    reset() { imgEd.work = cloneCanvas(imgEd.orig); imgEd.crop = null; },
    apply() {
      if (imgEd.crop && imgEd.crop.w > 2) imgEdOps.crop();
      let w = imgEd.work; const max = 1600;
      if (Math.max(w.width, w.height) > max) { const k = max / Math.max(w.width, w.height); const c = document.createElement('canvas'); c.width = Math.round(w.width * k); c.height = Math.round(w.height * k); c.getContext('2d').drawImage(w, 0, 0, c.width, c.height); w = c; }
      imgEd.e.src = w.toDataURL('image/png');
      $('#imgDlg').close(); afterDesignChange(true);
    },
  };
  function getProjects() { try { return JSON.parse(safeGet('projects') || '{}'); } catch (e) { return {}; } }
  function setProjects(p) { return safeSet('projects', JSON.stringify(p)); }
  function saveProject() {
    const p = getProjects();
    if (!state.id) state.id = uid() + uid();
    state.name = $('#projectName').value.trim() || state.name || t('untitled');
    const snap = snapshot();
    p[state.id] = { id: state.id, name: state.name, updated: Date.now(), state: JSON.parse(snap) };
    if (setProjects(p)) {
      lastSavedSnap = snap; history[hIdx] = snap; autosave(snap); updateSaveState(); toast(t('saved'));
    }
  }
  function openProjects() {
    const ul = $('#projectList'); ul.innerHTML = '';
    const list = Object.values(getProjects()).sort((a, b) => b.updated - a.updated);
    if (!list.length) ul.append(h('li', { class: 'empty-msg' }, t('noProjects')));
    for (const pr of list) {
      const L = computeLayout(migrate(pr.state));
      const li = h('li', { class: pr.id === state.id ? 'current' : '' },
        h('div', { class: 'pinfo' }, h('strong', { dir: 'auto' }, pr.name),
          h('small', null, `${L.cols}×${L.rows} · ${round(L.w, 1)}×${round(L.h, 1)} mm · ${new Date(pr.updated).toLocaleString(lang === 'ar' ? 'ar' : 'en-GB')}`)),
        h('button', { class: 'btn small primary', onclick: () => {
          if (pr.id !== state.id && isDirty() && !confirm(t('confirmNew'))) return;
          state = migrate(pr.state); state.id = pr.id; lastSavedSnap = snapshot(); selSetIds([]); zoomAuto = true;
          history = []; hIdx = -1; commit(); renderAll(); $('#projectsDlg').close();
        } }, t('open')),
        h('button', { class: 'btn small', onclick: () => {
          const nn = prompt(t('newName'), pr.name); if (!nn) return;
          const p = getProjects(); p[pr.id].name = nn; p[pr.id].state.name = nn; setProjects(p);
          if (pr.id === state.id) { state.name = nn; lastSavedSnap = snapshot(); commit(); syncSettingsUI(); }
          openProjects();
        } }, t('rename')),
        h('button', { class: 'btn small', onclick: () => {
          const p = getProjects(); const id = uid() + uid();
          p[id] = { id, name: pr.name + ' (' + t('copy') + ')', updated: Date.now(), state: Object.assign(clone(pr.state), { id, name: pr.name + ' (' + t('copy') + ')' }) };
          setProjects(p); openProjects();
        } }, t('copy')),
        h('button', { class: 'btn small', onclick: () => download(fileName(pr.name), JSON.stringify({ app: 'sticker-creator', v: 1, state: pr.state, fonts: fontsUsedBy(migrate(pr.state)) }, null, 1)) }, '⬇'),
        h('button', { class: 'btn small danger', onclick: () => {
          if (!confirm(t('confirmDelete'))) return;
          const p = getProjects(); delete p[pr.id]; setProjects(p);
          if (pr.id === state.id) { state.id = null; lastSavedSnap = null; commit(); updateSaveState(); }
          openProjects();
        } }, '🗑'));
      ul.append(li);
    }
    if (!$('#projectsDlg').open) $('#projectsDlg').showModal();
  }
  const fileName = (n) => (n || 'stickers').replace(/[\\/:*?"<>|]+/g, '_') + '.sticker.json';
  function exportFile() {
    download(fileName(state.name), JSON.stringify({ app: 'sticker-creator', v: 1, state, fonts: fontsUsedBy(state) }, null, 1));
    toast(t('fileSaved'));
  }
  function importFile(file) {
    const r = new FileReader();
    r.onload = async () => {
      try {
        const obj = JSON.parse(r.result);
        const s = obj.state || obj;
        if (!s.layout || !s.label) throw new Error('bad');
        await importFonts(obj.fonts);
        const ns = migrate(s); ns.id = null;
        newFromState(ns); toast(t('importOk'));
      } catch (e) { toast(t('importBad')); }
    };
    r.readAsText(file);
  }

  /* ================= print ================= */
  const scriptCache = {};
  function loadScript(src) {
    if (!scriptCache[src]) scriptCache[src] = new Promise((res, rej) => {
      const sc = h('script', { src }); sc.onload = res; sc.onerror = () => { delete scriptCache[src]; rej(new Error(src)); };
      document.head.append(sc);
    });
    return scriptCache[src];
  }
  function getOffset() { try { return Object.assign({ x: 0, y: 0 }, JSON.parse(safeGet('offset') || '{}')); } catch (e) { return { x: 0, y: 0 }; } }
  function printJob() {
    const P = state.print;
    let recs = getRecords(state);
    const total = recs.length;
    if (P.range === 'labels') {
      const a = clamp(Math.floor(+P.from || 1), 1, Math.max(1, total)), b = clamp(Math.floor(+P.to || total), a, Math.max(1, total));
      recs = recs.slice(a - 1, b);
    }
    let { L, pages } = paginate(state, recs);
    if (P.range === 'pages') {
      const a = clamp(Math.floor(+P.from || 1), 1, pages.length), b = clamp(Math.floor(+P.to || pages.length), a, pages.length);
      pages = pages.slice(a - 1, b);
    }
    const printed = pages.flat().filter((sl) => sl.rec);
    return { L, pages, printed, total };
  }
  function pageOpts() { const o = getOffset(); return { offX: o.x, offY: o.y, crop: state.print.crop, mirror: state.print.mirror }; }
  function renderPrint(test) {
    const area = $('#printArea'); area.innerHTML = '';
    const { L, pages } = printJob();
    if (test === true) {
      const pg = Array.from({ length: L.per }, (_, k) => ({ k, empty: true }));
      area.append(renderPage(state, L, pg, 'test', pageOpts()));
    } else for (const pg of pages) area.append(renderPage(state, L, pg, 'print', pageOpts()));
    let st = $('#pageStyle');
    if (!st) { st = h('style', { id: 'pageStyle' }); document.head.append(st); }
    st.textContent = `@page { size: ${L.P.w}mm ${L.P.h}mm; margin: 0; }`;
  }
  async function doPrint(test) {
    test = test === true;
    renderPrint(test);
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    await Promise.all($$('#printArea img').map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
    printingTest = test;
    window.print();
    printingTest = false;
    if (!test) { logPrint(t('print').split(' ')[0]); if (state.print.remember) rememberPrinted(); }
  }
  let printingTest = false;
  function rememberPrinted() {
    const { printed, L } = printJob();
    if (!printed.length) return;
    const first = printed[0], last = printed[printed.length - 1];
    const S = state.data.serial, step = S.step === '' || S.step == null ? 1 : +S.step;
    state.data.lastPrinted = { mode: state.data.mode, n: last.rec.n, idx: last.rec._idx, slot: last.k, per: L.per,
      firstNum: (+S.start || 0) + first.rec._idx * step, lastNum: (+S.start || 0) + last.rec._idx * step, count: printed.length, at: Date.now() };
    commit(); renderLastPrinted();
  }
  function renderLastPrinted() {
    const box = $('#lastPrinted'); const lp = state.data.lastPrinted;
    box.hidden = !lp; if (!lp) return;
    box.innerHTML = '';
    box.append(h('div', null, h('strong', null, t('lastPrinted') + ': '),
      `${new Date(lp.at).toLocaleString(lang === 'ar' ? 'ar' : 'en-GB')} — ${lp.count} ${t('labelsTotal')}, ${t('lastNumber')} `, h('b', { dir: 'ltr' }, lp.n)));
    box.append(h('button', { class: 'btn small', onclick: continueAfterLast }, t('continueNext')));
    box.append(h('button', { class: 'btn small', style: 'margin-inline-start:6px', onclick: () => { state.data.lastPrinted = null; commit(); renderLastPrinted(); } }, '✕'));
  }
  function continueAfterLast() {
    const lp = state.data.lastPrinted; if (!lp) return;
    const L = computeLayout(state);
    if (lp.mode === 'csv') {
      Object.assign(state.print, { range: 'labels', from: lp.idx + 2, to: getRecords(state).length });
    } else {
      const S = state.data.serial, step = S.step === '' || S.step == null ? 1 : +S.step;
      S.start = lp.lastNum + step;
      state.print.range = 'all';
    }
    state.data.skip = lp.per === L.per ? (lp.slot + 1) % L.per : 0;
    state.data.skipList = [];
    syncSettingsUI(); renderEditor(); renderSheet(); commit(); toast(t('continued'));
  }

  function openPrintDlg() {
    const dlg = $('#printDlg');
    syncPrintDlg();
    if (!dlg.open) dlg.showModal();
  }
  function syncPrintDlg() {
    const P = state.print, o = getOffset();
    $$('#printDlg [data-pseg] button').forEach((b) => b.classList.toggle('on', b.dataset.val === P.range));
    $('#printDlg .range-fields').hidden = P.range === 'all';
    for (const inp of $$('#printDlg [data-pbind]')) {
      const k = inp.dataset.pbind;
      const v = k === 'outlines' ? state.label.borderPrint : P[k];
      if (inp.type === 'checkbox') inp.checked = !!v; else if (document.activeElement !== inp) inp.value = v;
    }
    if (document.activeElement !== $('#offX')) $('#offX').value = o.x;
    if (document.activeElement !== $('#offY')) $('#offY').value = o.y;
    const { pages, printed, total } = printJob();
    const sum = $('#printSummary');
    let txt = `${t('willPrint')}: ${printed.length} / ${total} ${t('labelsTotal')} · ${pages.length} ${t('pages')}`;
    const lp = state.data.lastPrinted;
    let warn = false;
    if (lp && lp.mode !== 'csv' && state.data.mode !== 'csv' && printed.length) {
      const S = state.data.serial, step = S.step === '' || S.step == null ? 1 : +S.step;
      const a = (+S.start || 0) + printed[0].rec._idx * step, b = (+S.start || 0) + printed[printed.length - 1].rec._idx * step;
      const lo = Math.min(a, b), hi = Math.max(a, b), plo = Math.min(lp.firstNum, lp.lastNum), phi = Math.max(lp.firstNum, lp.lastNum);
      warn = lo <= phi && hi >= plo;
    }
    sum.className = 'info' + (warn ? ' warn' : '');
    sum.textContent = txt + (warn ? ' — ' + t('alreadyPrinted') : '');
  }
  function wirePrintDlg() {
    const dlg = $('#printDlg');
    dlg.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-pseg] button'); if (!b) return;
      state.print.range = b.dataset.val;
      if (b.dataset.val !== 'all') {
        const { L } = printJob(); const n = b.dataset.val === 'pages' ? paginate(state).pages.length : getRecords(state).length;
        state.print.from = 1; state.print.to = Math.max(1, n);
      }
      syncPrintDlg(); scheduleCommit();
    });
    for (const inp of $$('#printDlg [data-pbind]')) {
      inp.addEventListener(inp.type === 'checkbox' ? 'change' : 'input', () => {
        const k = inp.dataset.pbind;
        const v = inp.type === 'checkbox' ? inp.checked : +inp.value;
        if (k === 'outlines') { state.label.borderPrint = v; renderEditor(); scheduleSheet(); renderInspector(); }
        else state.print[k] = v;
        syncPrintDlg(); scheduleCommit();
      });
    }
    for (const id of ['offX', 'offY']) $('#' + id).addEventListener('input', () => {
      safeSet('offset', JSON.stringify({ x: +$('#offX').value || 0, y: +$('#offY').value || 0 }));
    });
  }

  async function renderPageCanvas(page, dpi) {
    await Promise.all($$('img', page).map((im) => (im.decode ? im.decode().catch(() => {}) : null)));
    return window.html2canvas(page, { scale: dpi / 96, backgroundColor: '#ffffff', logging: false });
  }
  async function exportPDF() {
    const dpi = +$('#pngDpi').value || 300;
    toast(t('exporting'));
    try { await Promise.all([loadScript('vendor/html2canvas.min.js'), loadScript('vendor/jspdf.umd.min.js')]); } catch (e) { toast(t('loadFail')); return; }
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    const { L, pages } = printJob();
    const W = L.P.w, H = L.P.h, orient = W > H ? 'landscape' : 'portrait';
    const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: [W, H], orientation: orient, compress: true });
    pdf.setProperties({ title: state.name || 'Stickers', creator: 'Sticker Creator' });
    const host = h('div', { style: 'position:fixed;left:-20000px;top:0;' }); document.body.append(host);
    try {
      for (let i = 0; i < Math.min(pages.length, 200); i++) {
        const page = renderPage(state, L, pages[i], 'print', pageOpts());
        host.innerHTML = ''; host.append(page);
        const canvas = await renderPageCanvas(page, dpi);
        if (i > 0) pdf.addPage([W, H], orient);
        pdf.addImage(canvas, 'PNG', 0, 0, W, H, undefined, 'FAST');
      }
      saveBlob(pdf.output('blob'), fileName(state.name).replace(/\.sticker\.json$/, '.pdf'));
      logPrint('PDF');
      if (state.print.remember) rememberPrinted();
      toast(t('exported'));
    } catch (e) { toast(t('loadFail')); }
    host.remove();
  }
  async function exportPNG() {
    const dpi = +$('#pngDpi').value || 300;
    toast(t('exporting'));
    try { await loadScript('vendor/html2canvas.min.js'); } catch (e) { toast(t('loadFail')); return; }
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    const { L, pages } = printJob();
    const host = h('div', { style: 'position:fixed;left:-20000px;top:0;' });
    document.body.append(host);
    const base = fileName(state.name).replace(/\.sticker\.json$/, '');
    try {
      for (let i = 0; i < Math.min(pages.length, 50); i++) {
        const page = renderPage(state, L, pages[i], 'print', pageOpts());
        host.innerHTML = ''; host.append(page);
        const canvas = await renderPageCanvas(page, dpi);
        const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
        saveBlob(blob, `${base}-${t('page')}-${i + 1}.png`);
      }
      toast(t('exported'));
    } catch (e) { toast(t('loadFail')); }
    host.remove();
  }

  /* ================= label sheet library (gLabels DB) ================= */
  function libLoad() { return loadScript('data/label-db.js').then(() => window.LABEL_DB || []); }
  function sheetSVG(r) {
    const [, , paper, , shape, w, hh, rad, nx, ny, x0, y0, gx, gy] = r;
    const [pw, ph] = PAGE_SIZES[paper] || PAGE_SIZES.A4;
    let body = '';
    for (let j = 0; j < Math.min(ny, 40); j++) for (let i = 0; i < Math.min(nx, 20); i++) {
      const x = x0 + i * (w + gx), y = y0 + j * (hh + gy);
      body += shape === 'r' ? `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${Math.min(rad, w / 2, hh / 2)}"/>`
        : `<ellipse cx="${x + w / 2}" cy="${y + hh / 2}" rx="${w / 2}" ry="${hh / 2}"/>`;
    }
    return `<svg viewBox="0 0 ${pw} ${ph}" preserveAspectRatio="xMidYMid meet"><rect width="${pw}" height="${ph}" fill="#fff" stroke="#bbb" stroke-width="1.5"/><g fill="#fde8db" stroke="#e8651d" stroke-width="0.8">${body}</g></svg>`;
  }
  async function openLibrary() {
    let db; try { db = await libLoad(); } catch (e) { toast(t('loadFail')); return; }
    const paperSel = $('#libPaper'), shapeSel = $('#libShape');
    if (!paperSel.options.length || paperSel.dataset.lang !== lang) {
      const papers = [...new Set(db.map((r) => r[2]))];
      paperSel.innerHTML = ''; paperSel.append(h('option', { value: '' }, t('allPapers')), ...papers.map((p) => h('option', { value: p }, p)));
      paperSel.value = state.page.size in PAGE_SIZES && papers.includes(state.page.size) ? state.page.size : 'A4';
      shapeSel.innerHTML = '';
      shapeSel.append(...[['', t('allShapes')], ['r', t('shapeRect')], ['o', t('shapeRound')], ['e', t('shapeEllipse')]].map(([v, l]) => h('option', { value: v }, l)));
      paperSel.dataset.lang = lang;
    }
    renderLibrary();
    $('#libraryDlg').showModal();
    $('#libSearch').focus();
  }
  function renderLibrary() {
    const db = window.LABEL_DB || [];
    const q = $('#libSearch').value.trim().toLowerCase().replace(/[×*]/g, 'x');
    const paper = $('#libPaper').value, shape = $('#libShape').value;
    const terms = q.split(/\s+/).filter(Boolean);
    const res = db.filter((r) => {
      if (paper && r[2] !== paper) return false;
      if (shape && r[4] !== shape) return false;
      if (!terms.length) return true;
      const hay = `${r[0]} ${r[1]} ${r[3]} ${r[5]}x${r[6]} ${r[8]}x${r[9]} ${r[8] * r[9]}`.toLowerCase();
      return terms.every((tm) => hay.includes(tm));
    });
    const list = $('#libList'); list.innerHTML = '';
    if (!res.length) { list.append(h('div', { class: 'empty-msg' }, t('noResults'))); return; }
    for (const r of res.slice(0, 240)) {
      const btn = h('button', { class: 'lib-item', type: 'button', title: r[3] });
      const thumb = h('span'); thumb.innerHTML = sheetSVG(r);
      const dims = r[4] === 'o' ? `Ø${r[5]}` : `${r[5]} × ${r[6]}`;
      btn.append(thumb.firstChild, h('span', { class: 'li-txt' }, h('strong', null, `${r[0]} ${r[1]}`), h('small', null, r[3]),
        h('small', { dir: 'ltr' }, `${r[2]} · ${r[8]}×${r[9]} = ${r[8] * r[9]} · ${dims} mm`)));
      btn.addEventListener('click', () => applySheet(r));
      list.append(btn);
    }
    if (res.length > 240) list.append(h('div', { class: 'info', style: 'grid-column:1/-1' }, `${t('showing')} 240 ${t('of')} ${res.length}`));
  }
  function applySheet(r) {
    const [brand, part, paper, , shape, w, hh, rad, nx, ny, x0, y0, gx, gy] = r;
    Object.assign(state.page, { size: paper, orientation: 'portrait' });
    Object.assign(state.layout, { cols: nx, rows: ny, labelW: w, labelH: hh, gapX: gx, gapY: gy, ml: x0, mt: y0,
      radius: shape === 'r' ? rad : Math.min(w, hh) / 2, sizeMode: 'fixed', center: false, sheetRef: `${brand} ${part}` });
    state.data.skipList = [];
    if (state.data.mode === 'copies') state.data.copies = nx * ny;
    normalizeDesign(state); zoomAuto = true;
    $('#libraryDlg').close();
    renderAll(); commit();
    toast(`${brand} ${part}`);
  }

  /* ================= print history ================= */
  function logPrint(kind) {
    const { printed, pages } = printJob(); if (!printed.length) return;
    const log = getJSON('printLog', []);
    log.unshift({ at: Date.now(), kind, project: state.name || '', sheet: state.layout.sheetRef || `${state.layout.cols}×${state.layout.rows}`,
      count: printed.length, pages: pages.length, first: printed[0].rec.n, last: printed[printed.length - 1].rec.n });
    setJSON('printLog', log.slice(0, 500));
  }
  function openLog() {
    const box = $('#logBody'); box.innerHTML = '';
    const log = getJSON('printLog', []);
    if (!log.length) box.append(h('p', { class: 'empty-msg' }, t('noLog')));
    else {
      const tb = h('table', { class: 'log-table' });
      tb.append(h('tr', null, ...['logWhen', 'logKind', 'logProject', 'logSheet', 'logCount', 'logRange'].map((k) => h('th', null, t(k)))));
      for (const r of log) tb.append(h('tr', null, h('td', null, new Date(r.at).toLocaleString(lang === 'ar' ? 'ar' : 'en-GB')), h('td', null, r.kind),
        h('td', { dir: 'auto' }, r.project), h('td', { dir: 'ltr' }, r.sheet), h('td', null, String(r.count)), h('td', { dir: 'ltr' }, `${r.first} → ${r.last}`)));
      box.append(h('div', { class: 'log-wrap' }, tb));
    }
    box.append(h('div', { class: 'dlg-actions' },
      h('button', { class: 'btn', type: 'button', disabled: !log.length, onclick: () => {
        const rows = [['date', 'type', 'project', 'sheet', 'count', 'pages', 'first', 'last'],
          ...log.map((r) => [new Date(r.at).toISOString(), r.kind, r.project, r.sheet, r.count, r.pages, r.first, r.last])];
        download('print-history.csv', '\ufeff' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv');
      } }, t('exportCsv')),
      h('button', { class: 'btn danger', type: 'button', disabled: !log.length, onclick: () => { if (confirm(t('confirmDelete'))) { setJSON('printLog', []); openLog(); } } }, t('clearLog'))));
    if (!$('#logDlg').open) $('#logDlg').showModal();
  }

  /* ================= share link (design packed into the URL hash) ================= */
  const b64u = { enc: (u8) => { let s2 = ''; for (let i = 0; i < u8.length; i += 0x8000) s2 += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s2).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
    dec: (str) => { const b = atob(str.replace(/-/g, '+').replace(/_/g, '/')); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; } };
  async function streamBytes(u8, Ctor, fmt) { const cs = new Ctor(fmt); const out = new Response(new Blob([u8]).stream().pipeThrough(cs)); return new Uint8Array(await out.arrayBuffer()); }
  async function makeShareLink() {
    const st = clone(state); st.id = null; st.data.lastPrinted = null;
    let stripped = false;
    const size = () => JSON.stringify(st).length;
    if (size() > 150000) {
      for (const e of st.label.elements) if (e.type === 'image' && e.src) { e.src = ''; stripped = true; }
      if (st.label.bgImage) { st.label.bgImage = ''; stripped = true; }
    }
    const raw = new TextEncoder().encode(JSON.stringify({ v: 1, state: st }));
    let token;
    if (window.CompressionStream) token = 'z' + b64u.enc(await streamBytes(raw, CompressionStream, 'deflate-raw'));
    else token = 'r' + b64u.enc(raw);
    return { url: location.href.split('#')[0] + '#d=' + token, stripped };
  }
  async function openShare() {
    const { url, stripped } = await makeShareLink();
    $('#shareUrl').value = url;
    $('#shareWarn').hidden = !stripped;
    $('#shareLen').textContent = `${Math.round(url.length / 1024)} KB`;
    $('#shareDlg').showModal(); $('#shareUrl').select();
  }
  async function readShareLink() {
    const m = /^#d=([zr])([A-Za-z0-9_-]+)$/.exec(location.hash || ''); if (!m) return null;
    try {
      let bytes = b64u.dec(m[2]);
      if (m[1] === 'z') bytes = await streamBytes(bytes, DecompressionStream, 'deflate-raw');
      const obj = JSON.parse(new TextDecoder().decode(bytes));
      window.history.replaceState(null, '', location.pathname + location.search);
      if (!obj || !obj.state || !obj.state.layout) return null;
      if (safeGet('autosave') && !confirm(t('openShared'))) return null;
      return migrate(obj.state);
    } catch (e) { console.warn('share link', e); return null; }
  }

  /* ================= guided tour ================= */
  const TOUR = [['.settings', 'tour1'], ['.toolbar', 'tour2'], ['#stage', 'tour3'], ['.inspector', 'tour4'], ['.tab[data-tab=data]', 'tour5'], ['.preview-head', 'tour6'], ['.topbar .actions', 'tour7']];
  let tourStep = -1;
  function maybeStartTour() { if (!safeGet('tourDone') && !navigator.webdriver) setTimeout(() => startTour(), 600); }
  function startTour() { tourStep = 0; showTourStep(); }
  function endTour() { tourStep = -1; $('#tour').hidden = true; safeSet('tourDone', '1'); }
  function showTourStep() {
    const [sel, key] = TOUR[tourStep]; const target = $(sel);
    const tour = $('#tour'); tour.hidden = false;
    if (target) target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    const r = target ? target.getBoundingClientRect() : { left: innerWidth / 2 - 50, top: innerHeight / 2 - 50, width: 100, height: 100 };
    const spot = $('.tour-spot', tour);
    const pad = 6, top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad);
    const w = Math.min(innerWidth - left - 4, r.width + pad * 2), hh = Math.min(innerHeight - top - 4, r.height + pad * 2);
    Object.assign(spot.style, { top: top + 'px', left: left + 'px', width: w + 'px', height: hh + 'px' });
    const bub = $('.tour-bubble', tour);
    $('.tour-text', bub).textContent = t(key);
    $('.tour-count', bub).textContent = `${tourStep + 1} / ${TOUR.length}`;
    $('[data-tour=prev]', bub).disabled = tourStep === 0;
    $('[data-tour=next]', bub).textContent = tourStep === TOUR.length - 1 ? t('done') : t('next');
    const bw = Math.min(320, innerWidth - 24);
    bub.style.width = bw + 'px';
    let by = top + hh + 10; if (by + 170 > innerHeight) by = Math.max(10, top - 180);
    if (hh > innerHeight * 0.6) by = Math.min(innerHeight - 190, top + 20);
    let bx = clamp(left + w / 2 - bw / 2, 12, innerWidth - bw - 12);
    Object.assign(bub.style, { top: by + 'px', left: bx + 'px' });
  }

  /* ================= i18n apply / theme ================= */
  function applyLang() {
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('appTitle');
    for (const el of $$('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    for (const el of $$('[data-i18n-title]')) el.title = t(el.dataset.i18nTitle);
    for (const el of $$('[data-i18n-ph]')) el.placeholder = t(el.dataset.i18nPh);
    $('[data-act=lang]').textContent = lang === 'ar' ? 'EN' : 'ع';
  }
  function applyTheme() {
    const th = safeGet('theme');
    if (th) document.documentElement.dataset.theme = th; else delete document.documentElement.dataset.theme;
  }

  function renderAll() {
    syncSettingsUI(); renderPresets(); renderVarChips(); renderLastPrinted(); updateEditedInfo(); renderEditor(); renderInspector(); renderLayers(); renderSheet(); updateSaveState(); updateUndoButtons();
  }

  /* ================= wiring ================= */
  function wire() {
    bindSettings();
    $$('.tab').forEach((b) => b.addEventListener('click', () => {
      $$('.tab').forEach((x) => x.classList.toggle('active', x === b));
      $$('.tabpane').forEach((p) => p.classList.toggle('active', p.dataset.pane === b.dataset.tab));
    }));
    $$('[data-add]').forEach((b) => b.addEventListener('click', () => addElement(b.dataset.add)));
    const acts = {
      new: () => { if (isDirty() && !confirm(t('confirmNew'))) return; newFromState(TEMPLATES.find((x) => x.key === 'Blank').make()); },
      templates: openTemplates, projects: openProjects, save: saveProject, undo, redo,
      export: exportFile, import: () => $('#importInput').click(), print: openPrintDlg,
      doPrint: () => doPrint(false), testPrint: () => doPrint(true), exportPng: exportPNG, library: openLibrary,
      exportPdf: exportPDF, share: openShare, printLog: openLog, help: startTour,
      copyShare: async () => { const v = $('#shareUrl').value; try { await navigator.clipboard.writeText(v); } catch (e) { $('#shareUrl').select(); document.execCommand('copy'); } toast(t('linkCopied')); },
      clearEdits: () => { if (!confirm(t('confirmDelete'))) return; state.data.overrides = {}; commit(); renderSheet(); updateEditedInfo(); },
      lang: () => { lang = lang === 'ar' ? 'en' : 'ar'; safeSet('lang', lang); applyLang(); renderAll(); },
      theme: () => {
        const dark = document.documentElement.dataset.theme === 'dark' ||
          (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
        safeSet('theme', dark ? 'light' : 'dark'); applyTheme();
      },
      zoomIn: () => { zoomAuto = false; editorZoom = clamp(editorZoom * 1.25, 0.2, 12); renderEditor(); },
      zoomOut: () => { zoomAuto = false; editorZoom = clamp(editorZoom / 1.25, 0.2, 12); renderEditor(); },
      zoomFit: () => { zoomAuto = true; renderEditor(); },
      fillPage: () => { const L = computeLayout(state); state.data.copies = Math.max(1, L.per - skipSet(state, L.per).size); syncSettingsUI(); scheduleSheet(); commit(); },
      loadCsv: () => $('#csvInput').click(),
    };
    document.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-act]'); if (b && acts[b.dataset.act]) acts[b.dataset.act]();
    });
    $('#importInput').addEventListener('change', (ev) => { const f = ev.target.files[0]; ev.target.value = ''; if (f) importFile(f); });
    $('#csvInput').addEventListener('change', (ev) => {
      const f = ev.target.files[0]; ev.target.value = ''; if (!f) return;
      const done = (txt) => { state.data.csv = txt; csvCache.text = null; syncSettingsUI(); renderVarChips(); renderEditor(); scheduleSheet(); commit(); };
      const r = new FileReader();
      if (/\.(xlsx|xlsm|xlsb|xls|ods)$/i.test(f.name)) {
        r.onload = async () => {
          try {
            await loadScript('vendor/xlsx.mini.min.js');
            const wb = window.XLSX.read(new Uint8Array(r.result), { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            done(window.XLSX.utils.sheet_to_csv(ws, { blankrows: false }));
            toast(`${wb.SheetNames[0]} ✓`);
          } catch (e) { toast(t('importBad')); }
        };
        r.readAsArrayBuffer(f);
      } else { r.onload = () => done(String(r.result)); r.readAsText(f); }
    });
    $('#projectName').addEventListener('input', (ev) => { state.name = ev.target.value; scheduleCommit(); });
    $('#previewZoom').addEventListener('input', () => { safeSet('previewZoom', $('#previewZoom').value); scheduleSheet(); });
    const pz = safeGet('previewZoom'); if (pz) $('#previewZoom').value = pz;

    const stage = $('#stage');
    stage.addEventListener('pointerdown', stagePointerDown);
    stage.addEventListener('pointermove', stagePointerMove);
    stage.addEventListener('pointerup', stagePointerUp);
    stage.addEventListener('pointercancel', stagePointerUp);
    stage.addEventListener('wheel', (ev) => {
      if (!ev.ctrlKey) return; ev.preventDefault(); zoomAuto = false;
      editorZoom = clamp(editorZoom * (ev.deltaY < 0 ? 1.1 : 1 / 1.1), 0.2, 12); renderEditor();
    }, { passive: false });
    stage.addEventListener('dblclick', (ev) => {
      const n = ev.target.closest('.el'); if (!n) return;
      const e = findEl(n.dataset.id);
      if (e && e.type === 'image') { if (e.src) openImageEditor(e); else pickImage((src) => { e.src = src; afterDesignChange(true); }); }
      else { const ta = $('#inspector textarea, #inspector input[type=text]'); if (ta) { ta.focus(); ta.select(); } }
    });

    document.addEventListener('keydown', (ev) => {
      const tag = (ev.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || ev.target.isContentEditable;
      const mod = ev.ctrlKey || ev.metaKey;
      if (mod && ev.key.toLowerCase() === 's') { ev.preventDefault(); saveProject(); return; }
      if (mod && ev.key.toLowerCase() === 'p') { ev.preventDefault(); openPrintDlg(); return; }
      if (typing) return;
      if (mod && ev.key.toLowerCase() === 'z') { ev.preventDefault(); ev.shiftKey ? redo() : undo(); return; }
      if (mod && ev.key.toLowerCase() === 'y') { ev.preventDefault(); redo(); return; }
      if (document.querySelector('dialog[open]')) return;
      if (mod && ev.key.toLowerCase() === 'a') { ev.preventDefault(); selSetIds(state.label.elements.map((x) => x.id)); refreshSelection(); return; }
      if (mod && ev.key.toLowerCase() === 'v') { ev.preventDefault(); paste(); return; }
      if (!selSet.size) return;
      if (mod && ev.key.toLowerCase() === 'c') { ev.preventDefault(); copySelected(); return; }
      if (mod && ev.key.toLowerCase() === 'x') { ev.preventDefault(); copySelected(); removeSelected(); return; }
      if (mod && ev.key.toLowerCase() === 'd') { ev.preventDefault(); duplicateSelected(); return; }
      if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); removeSelected(); return; }
      if (ev.key === 'Escape') { selSetIds([]); refreshSelection(); return; }
      const step = ev.shiftKey ? 1 : 0.25;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[ev.key];
      if (d) {
        ev.preventDefault();
        for (const e of selectedEls()) if (!e.locked) { e.x = round(e.x + d[0]); e.y = round(e.y + d[1]); }
        renderEditor(); syncPosFields(); scheduleSheet(); scheduleCommit();
      }
    });

    window.addEventListener('beforeprint', () => renderPrint(printingTest));
    $$('[data-pmode]').forEach((b) => b.addEventListener('click', () => {
      previewMode = b.dataset.pmode; $$('[data-pmode]').forEach((x) => x.classList.toggle('on', x === b));
      $('#sheetPreview').classList.toggle('edit-mode', previewMode === 'edit');
    }));
    imgEdPointer();
    $$('[data-img]').forEach((b) => b.addEventListener('click', () => { imgEdOps[b.dataset.img](); if (b.dataset.img !== 'apply') drawImgEd(); }));
    $('#tour').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-tour]'); if (!b) return;
      const a = b.dataset.tour;
      if (a === 'skip') return endTour();
      tourStep += a === 'next' ? 1 : -1;
      if (tourStep >= TOUR.length) return endTour();
      showTourStep();
    });
    window.addEventListener('resize', () => { if (tourStep >= 0) showTourStep(); });
    loadScript('data/icons.js').then(() => { if (selSet.size) renderInspector(); renderEditor(); scheduleSheet(); }).catch(() => {});
    wirePrintDlg();
    $('#gridToggle').checked = showGrid;
    $('#gridToggle').addEventListener('change', (ev) => { showGrid = ev.target.checked; safeSet('grid', showGrid ? '1' : '0'); renderEditor(); });
    $('#libSearch').addEventListener('input', debounce(renderLibrary, 120));
    $('#libPaper').addEventListener('change', renderLibrary);
    $('#libShape').addEventListener('change', renderLibrary);
    window.addEventListener('resize', debounce(() => { if (zoomAuto) renderEditor(); renderSheet(); }, 150));
    window.addEventListener('beforeunload', (ev) => { if (state.id && snapshot() !== lastSavedSnap) { ev.preventDefault(); ev.returnValue = ''; } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitCache.clear(); barcodeCache.clear(); renderEditor(); renderSheet(); });
  }

  /* ================= boot ================= */
  async function boot() {
    applyTheme();
    applyLang();
    await KV.init();
    await loadUserFonts();
    const fromLink = await readShareLink();
    loadInitial();
    wire();
    if (fromLink) { state = fromLink; state.id = null; lastSavedSnap = null; toast(t('linkOpened')); }
    commit();
    renderAll();
    maybeStartTour();
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  boot().then(() => {
  libLoad().then((db) => { $('#libCount').textContent = db.length; }).catch(() => {});
  });
  // Expose for debugging / tests
  window.StickerCreator = { get state() { return state; }, paginate: () => paginate(state), fmt: (str, rec) => fillTpl(str, rec || {}), KV };
})();
