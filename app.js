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
    },
  };
  let lang = safeGet('lang') || 'ar';
  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;

  /* ================= utils ================= */
  function safeGet(k) { try { return localStorage.getItem(STORE + k); } catch (e) { return null; } }
  function safeSet(k, v) {
    try { localStorage.setItem(STORE + k, v); return true; }
    catch (e) { toast(t('storageFull')); return false; }
  }
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
  function download(name, text, type = 'application/json') {
    const a = h('a', { href: URL.createObjectURL(new Blob([text], { type })), download: name });
    document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  const todayStr = () => new Date().toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-GB');

  /* ================= model ================= */
  const PAGE_SIZES = { A4: [210, 297], A5: [148, 210], A3: [297, 420], Letter: [215.9, 279.4], Legal: [215.9, 355.6] };
  const FONTS = ['Cairo', 'Tajawal', 'Amiri', 'Noto Kufi Arabic', 'Changa', 'Inter', 'Oswald', 'Roboto Mono', 'Arial', 'Times New Roman', 'Courier New'];
  const BARCODE_FORMATS = ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14', 'ITF', 'MSI', 'codabar', 'pharmacode'];

  const ELEMENT_DEFAULTS = {
    text: { w: 40, h: 10, text: '', font: 'Cairo', size: 12, color: '#000000', bold: false, italic: false, underline: false,
      align: 'center', valign: 'middle', lineHeight: 1.2, letter: 0, bg: '', pad: 0, fit: false },
    barcode: { w: 45, h: 16, value: '{n}', format: 'CODE128', showText: true, textSize: 8, color: '#000000', bg: '' },
    qr: { w: 20, h: 20, value: 'https://example.com/{n}', ecc: 'M', color: '#000000', bg: '', quiet: 0 },
    image: { w: 20, h: 20, src: '', fitMode: 'contain', radius: 0 },
    rect: { w: 30, h: 15, fill: '#fde8db', stroke: '#e8651d', strokeW: 0.3, radius: 1, dashed: false },
    ellipse: { w: 20, h: 20, fill: '#fde8db', stroke: '#e8651d', strokeW: 0.3, dashed: false },
    line: { w: 40, h: 2, stroke: '#000000', strokeW: 0.4, dashed: false },
  };
  function makeEl(type, props) {
    return Object.assign({ id: uid(), type, x: 2, y: 2, rot: 0, opacity: 1, locked: false, name: '' }, clone(ELEMENT_DEFAULTS[type]), props || {});
  }

  function baseState() {
    return {
      v: 1, id: null, name: t('untitled'),
      page: { size: 'A4', orientation: 'portrait', w: 210, h: 297 },
      layout: { cols: 3, rows: 8, sizeMode: 'fixed', labelW: 70, labelH: 37, center: true,
        mt: 0, mb: 0, ml: 0, mr: 0, gapX: 0, gapY: 0, radius: 2, order: 'row-ltr', scaleContent: true },
      label: { bg: '#ffffff', bgImage: '', borderPreview: true, borderPrint: false, borderColor: '#9a9a9a', borderWidth: 0.2,
        designW: 70, designH: 37, elements: [] },
      data: { mode: 'copies', copies: 24, csv: '', csvCopies: 1, skip: 0, skipList: [],
        serial: { start: 1, step: 1, pad: 0, prefix: '', suffix: '' } },
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
  let editorZoom = 4;
  let zoomAuto = true;
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
    if (selectedId && !findEl(selectedId)) selectedId = null;
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
    const D = s.data, today = todayStr();
    let base = [];
    if (D.mode === 'csv') {
      const { rows } = parseCSV(D.csv); const cp = Math.max(1, Math.floor(+D.csvCopies || 1));
      for (const r of rows) for (let c = 0; c < cp; c++) base.push(r);
    } else {
      const n = clamp(Math.floor(+D.copies || 0), 0, 20000);
      base = Array.from({ length: n }, () => ({}));
    }
    return base.map((r, i) => Object.assign({}, r, { n: serial(s, i), i: String(i + 1), date: today }));
  }
  function sampleRecord(s) {
    const recs = getRecords(s);
    if (recs.length) return recs[0];
    const r = { n: serial(s, 0), i: '1', date: todayStr() };
    if (s.data.mode === 'csv') for (const hd of parseCSV(s.data.csv).headers) r[hd] = '{' + hd + '}';
    return r;
  }
  function fillTpl(str, rec) {
    return String(str == null ? '' : str).replace(/\{([^{}]+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(rec, k.trim()) ? rec[k.trim()] : m));
  }
  function skipSet(s, per) {
    const set = new Set();
    for (let k = 0; k < Math.min(+s.data.skip || 0, per); k++) set.add(k);
    for (const k of s.data.skipList || []) if (k < per) set.add(k);
    return set;
  }
  function paginate(s) {
    const L = computeLayout(s), recs = getRecords(s), skips = skipSet(s, L.per);
    const pages = []; let ri = 0;
    do {
      const pg = [];
      for (let k = 0; k < L.per; k++) {
        if (pages.length === 0 && skips.has(k)) pg.push({ k, skip: true });
        else if (ri < recs.length) pg.push({ k, rec: recs[ri++] });
        else pg.push({ k, empty: true });
      }
      pages.push(pg);
      if (skips.size >= L.per && pages.length === 1 && ri === 0 && recs.length === 0) break;
    } while (ri < recs.length && pages.length < MAX_PAGES);
    return { L, pages, total: recs.length };
  }

  /* ================= rendering: elements ================= */
  const barcodeCache = new Map();
  function barcodeSVG(e, value) {
    const key = [value, e.format, e.showText, e.textSize, e.color, round(e.w, 1), round(e.h, 1)].join('|');
    if (barcodeCache.has(key)) return barcodeCache.get(key);
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
  function fittedSize(e, text) {
    const key = [text, e.font, e.size, e.bold, e.italic, e.letter, e.lineHeight, e.pad, round(e.w, 1), round(e.h, 1)].join('|');
    if (fitCache.has(key)) return fitCache.get(key);
    if (!measurer) {
      measurer = h('div', { style: 'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;' });
      document.body.append(measurer);
    }
    const box = h('div', { style: `width:${e.w}mm;height:${e.h}mm;padding:${e.pad || 0}mm;box-sizing:border-box;overflow:hidden;` });
    const inner = h('div', { style: `white-space:pre-wrap;word-break:break-word;font-family:'${e.font}',sans-serif;font-weight:${e.bold ? 700 : 400};font-style:${e.italic ? 'italic' : 'normal'};line-height:${e.lineHeight};letter-spacing:${e.letter || 0}mm;` }, text);
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
        const txt = h('div', { class: 'txt', dir: 'auto' }, text);
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
    }
    return node;
  }

  function renderLabel(s, L, rec, mode) {
    const lab = s.label;
    const node = h('div', { class: 'label' });
    node.style.cssText = `width:${L.w}mm;height:${L.h}mm;border-radius:${L.radius}mm;background-color:${lab.bg || '#fff'};`;
    if (lab.bgImage) node.style.backgroundImage = `url("${lab.bgImage}")`, node.style.backgroundSize = 'cover', node.style.backgroundPosition = 'center';
    if (rec) for (const e of lab.elements) node.append(renderElement(e, rec));
    const showBorder = mode === 'print' ? lab.borderPrint : (lab.borderPreview || lab.borderPrint);
    if (showBorder) {
      const o = h('div', { class: 'outline' });
      o.style.cssText = `position:absolute;inset:0;pointer-events:none;border-radius:${L.radius}mm;border:${Math.max(0.05, +lab.borderWidth || 0.2)}mm ${mode === 'print' || lab.borderPrint ? 'solid' : 'dashed'} ${lab.borderColor};`;
      node.append(o);
    }
    return node;
  }

  function renderPage(s, L, pg, mode) {
    const page = h('div', { class: 'page' });
    page.style.width = L.P.w + 'mm'; page.style.height = L.P.h + 'mm';
    for (const slot of pg) {
      const p = slotPos(L, slot.k);
      const lab = renderLabel(s, L, slot.rec || (slot.skip || slot.empty ? null : {}), mode);
      lab.style.left = p.x + 'mm'; lab.style.top = p.y + 'mm';
      lab.dataset.k = slot.k;
      if (slot.skip) lab.classList.add('skipped');
      if (slot.empty) lab.classList.add('empty');
      if (mode === 'print' && (slot.skip || slot.empty)) continue;
      page.append(lab);
    }
    return page;
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
      if (i === 0) page.addEventListener('click', onPreviewClick);
      host.append(h('div', { class: 'page-wrap' }, h('span', { class: 'page-num' }, `${t('page')} ${i + 1} / ${pages.length}`), scaler));
    });
    if (pages.length > MAX_PREVIEW_PAGES) host.append(h('div', { class: 'info' }, `+${pages.length - MAX_PREVIEW_PAGES} ${t('morePages')}`));
    $('#previewInfo').textContent = `${total} ${t('labelsTotal')} · ${pages.length} ${t('pages')}`;
  }
  function onPreviewClick(ev) {
    const lab = ev.target.closest('.label'); if (!lab) return;
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
  function renderEditor() {
    const stage = $('#stage');
    const L = computeLayout(state);
    if (zoomAuto) fitZoom();
    const rec = sampleRecord(state);
    const lab = renderLabel(state, L, rec, 'editor');
    lab.classList.add('editor', 'editor-label');
    lab.style.position = 'absolute'; lab.style.left = '0'; lab.style.top = '0';
    lab.style.transformOrigin = '0 0'; lab.style.transform = `scale(${editorZoom})`;
    lab.style.overflow = 'visible';
    // clip content but keep handles visible: content clip via inner clip-path
    lab.style.clipPath = 'none';
    for (const n of $$('.el', lab)) {
      const e = findEl(n.dataset.id);
      if (e.locked) n.classList.add('locked');
      if (e.id === selectedId) {
        n.classList.add('sel');
        if (!e.locked) for (const d of ['nw', 'ne', 'sw', 'se', 'e', 's']) {
          const hd = h('div', { class: 'handle ' + d, 'data-h': d });
          hd.style.transform = `scale(${1 / editorZoom})`;
          n.append(hd);
        }
      }
    }
    const inner = h('div', { class: 'stage-inner', style: `width:${L.w * MM * editorZoom}px;height:${L.h * MM * editorZoom}px` }, lab);
    stage.innerHTML = ''; stage.append(inner);
    $('#zoomLabel').textContent = Math.round(editorZoom * 100) + '%';
  }

  /* ================= editor interaction ================= */
  const findEl = (id) => state.label.elements.find((e) => e.id === id);
  let drag = null;
  function stagePointerDown(ev) {
    if (ev.button !== 0 && ev.pointerType === 'mouse') return;
    const handle = ev.target.closest('.handle');
    const node = ev.target.closest('.el');
    if (!node) { if (selectedId) { selectedId = null; renderEditor(); renderInspector(); renderLayers(); } return; }
    const e = findEl(node.dataset.id);
    if (selectedId !== e.id) { selectedId = e.id; renderEditor(); renderInspector(); renderLayers(); }
    if (e.locked) return;
    ev.preventDefault();
    $('#stage').setPointerCapture(ev.pointerId);
    drag = { id: e.id, mode: handle ? handle.dataset.h : 'move', sx: ev.clientX, sy: ev.clientY, o: { x: e.x, y: e.y, w: e.w, h: e.h }, moved: false };
  }
  function stagePointerMove(ev) {
    if (!drag) return;
    const e = findEl(drag.id); if (!e) return;
    const k = editorZoom * MM;
    const dx = (ev.clientX - drag.sx) / k, dy = (ev.clientY - drag.sy) / k;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 0.2) return;
    drag.moved = true;
    const snapOn = $('#snapToggle').checked && !ev.altKey;
    const sn = (v) => (snapOn ? Math.round(v * 2) / 2 : round(v, 2));
    const o = drag.o, L = computeLayout(state);
    const guides = [];
    if (drag.mode === 'move') {
      let x = o.x + dx, y = o.y + dy;
      if (snapOn) {
        const tol = 1.2;
        const cx = x + o.w / 2, cy = y + o.h / 2;
        if (Math.abs(cx - L.w / 2) < tol) { x = L.w / 2 - o.w / 2; guides.push(['v', L.w / 2]); }
        else if (Math.abs(x) < tol) { x = 0; guides.push(['v', 0]); }
        else if (Math.abs(x + o.w - L.w) < tol) { x = L.w - o.w; guides.push(['v', L.w]); }
        else x = sn(x);
        if (Math.abs(cy - L.h / 2) < tol) { y = L.h / 2 - o.h / 2; guides.push(['h', L.h / 2]); }
        else if (Math.abs(y) < tol) { y = 0; guides.push(['h', 0]); }
        else if (Math.abs(y + o.h - L.h) < tol) { y = L.h - o.h; guides.push(['h', L.h]); }
        else y = sn(y);
      }
      e.x = round(x, 2); e.y = round(y, 2);
    } else {
      const m = drag.mode; let { x, y, w, h: hh } = o;
      if (m.includes('e')) w = o.w + dx;
      if (m.includes('s')) hh = o.h + dy;
      if (m.includes('w')) { w = o.w - dx; x = o.x + dx; }
      if (m.includes('n')) { hh = o.h - dy; y = o.y + dy; }
      if ((e.type === 'qr' || ev.shiftKey) && m.length === 2) { // keep aspect
        const r = o.w / o.h; if (w / hh > r) hh = w / r; else w = hh * r;
        if (m.includes('w')) x = o.x + o.w - w;
        if (m.includes('n')) y = o.y + o.h - hh;
      }
      e.w = round(Math.max(1, sn(w)), 2); e.h = round(Math.max(0.5, sn(hh)), 2);
      e.x = round(m.includes('w') ? o.x + o.w - e.w : x, 2); e.y = round(m.includes('n') ? o.y + o.h - e.h : y, 2);
    }
    const node = $(`#stage .el[data-id="${e.id}"]`);
    if (node) {
      node.style.left = e.x + 'mm'; node.style.top = e.y + 'mm'; node.style.width = e.w + 'mm'; node.style.height = e.h + 'mm';
      const lab = node.parentElement;
      $$('.guide', lab).forEach((g) => g.remove());
      for (const [d, v] of guides) {
        const g = h('div', { class: 'guide ' + d });
        if (d === 'v') g.style.left = v + 'mm'; else g.style.top = v + 'mm';
        g.style[d === 'v' ? 'width' : 'height'] = (1 / editorZoom) + 'px';
        lab.append(g);
      }
    }
    syncPosFields();
  }
  function stagePointerUp() {
    if (!drag) return;
    const moved = drag.moved; drag = null;
    if (moved) { renderEditor(); scheduleSheet(); commit(); }
  }
  function syncPosFields() {
    const e = findEl(selectedId); if (!e) return;
    for (const k of ['x', 'y', 'w', 'h']) { const inp = $(`#inspector [data-k="${k}"]`); if (inp && document.activeElement !== inp) inp.value = e[k]; }
  }

  /* ================= element operations ================= */
  function addElement(type) {
    const L = computeLayout(state);
    const def = ELEMENT_DEFAULTS[type];
    let w = Math.min(def.w, L.w * 0.8), hh = Math.min(def.h, L.h * 0.8);
    if (type === 'qr') w = hh = Math.min(def.w, L.w * 0.8, L.h * 0.8);
    const e = makeEl(type, { w: round(w), h: round(hh), x: round((L.w - w) / 2), y: round((L.h - hh) / 2) });
    if (type === 'text') e.text = t('defaultText');
    state.label.elements.push(e);
    selectedId = e.id;
    afterDesignChange(true);
    if (type === 'image') pickImage((src) => { e.src = src; afterDesignChange(true); });
  }
  function removeSelected() {
    if (!selectedId) return;
    state.label.elements = state.label.elements.filter((e) => e.id !== selectedId);
    selectedId = null; afterDesignChange(true);
  }
  function duplicateSelected() {
    const e = findEl(selectedId); if (!e) return;
    const c = Object.assign(clone(e), { id: uid(), x: round(e.x + 2), y: round(e.y + 2) });
    const idx = state.label.elements.indexOf(e);
    state.label.elements.splice(idx + 1, 0, c); selectedId = c.id; afterDesignChange(true);
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
  function onPropChange(opts) {
    renderEditor(); scheduleSheet(); renderLayers();
    if (opts.full) { commit(); if (opts.rebuild) renderInspector(); } else scheduleCommit();
  }

  function renderInspector() {
    const box = $('#inspector'); box.innerHTML = '';
    const e = findEl(selectedId);
    if (!e) return renderLabelInspector(box);
    const typeName = t('el' + { text: 'Text', barcode: 'Barcode', qr: 'Qr', image: 'Image', rect: 'Rect', ellipse: 'Ellipse', line: 'Line' }[e.type]);
    box.append(h('div', { class: 'insp-title' }, h('h2', null, typeName),
      h('button', { class: 'btn small', onclick: () => { selectedId = null; renderEditor(); renderInspector(); renderLayers(); } }, '✕')));
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
        g.append(selectField(e, 'font', t('font'), FONTS, { cls: 'span2' }));
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
        break;
      case 'barcode':
        g.append(textField(e, 'value', t('value')));
        g.append(varChipsRow());
        g.append(selectField(e, 'format', t('format'), BARCODE_FORMATS, { cls: 'span2' }));
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
        g.append(selectField(e, 'fitMode', t('fitMode'), [['contain', t('contain')], ['cover', t('cover')], ['stretch', t('stretch')]]));
        g.append(numField(e, 'radius', t('radius'), { step: 0.5, min: 0 }));
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

  function renderLabelInspector(box) {
    const lab = state.label;
    box.append(h('h2', null, t('labelSettings')));
    box.append(h('p', { class: 'hint' }, t('noSelection')));
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
    const v = ['n', 'i', 'date'];
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
    const typeLbl = { text: 'Text', barcode: 'Barcode', qr: 'Qr', image: 'Image', rect: 'Rect', ellipse: 'Ellipse', line: 'Line' };
    [...state.label.elements].reverse().forEach((e) => {
      const nm = e.name || (e.type === 'text' ? e.text : e.type === 'barcode' || e.type === 'qr' ? e.value : '') || t('el' + typeLbl[e.type]);
      const li = h('li', { class: e.id === selectedId ? 'sel' : '' },
        h('span', { class: 'ltype' }, t('el' + typeLbl[e.type])),
        h('span', { class: 'lname', dir: 'auto' }, String(nm).split('\n')[0]),
        e.locked ? h('span', null, '🔒') : null);
      li.addEventListener('click', () => { selectedId = e.id; renderEditor(); renderInspector(); renderLayers(); });
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
    sel.onchange = () => {
      if (sel.value === '') return;
      const [c, r, w, hh, gx, gy, rad] = PRESETS[+sel.value];
      Object.assign(state.page, { size: 'A4', orientation: 'portrait' });
      Object.assign(state.layout, { cols: c, rows: r, labelW: w, labelH: hh, gapX: gx, gapY: gy, radius: rad, sizeMode: 'fixed', center: true });
      state.data.skipList = [];
      if (state.data.mode === 'copies') state.data.copies = c * r;
      normalizeDesign(state); zoomAuto = true;
      const keep = sel.value;
      renderAll(); commit(); sel.value = keep;
    };
  }

  /* ================= templates & projects ================= */
  function isDirty() { return state.id ? snapshot() !== lastSavedSnap : state.label.elements.length > 0 && history.length > 1; }
  function newFromState(s) {
    state = s; state.id = null; selectedId = null; lastSavedSnap = null; zoomAuto = true;
    history = []; hIdx = -1; commit(); renderAll();
  }
  function openTemplates() {
    const grid = $('#templateGrid'); grid.innerHTML = '';
    for (const tp of TEMPLATES) {
      const s = tp.make(); const L = computeLayout(s);
      const sc = Math.min(170 / (L.w * MM), 110 / (L.h * MM));
      const lab = renderLabel(s, L, sampleRecord(s), 'preview');
      lab.style.position = 'relative'; lab.style.transform = `scale(${sc})`; lab.style.transformOrigin = '0 0';
      lab.style.boxShadow = '0 1px 4px rgba(0,0,0,.2)';
      const holder = h('div', { class: 'tpl-holder', style: `width:${L.w * MM * sc}px;height:${L.h * MM * sc}px` }, lab);
      const card = h('button', { class: 'tpl', type: 'button' }, h('div', { class: 'thumb' }, holder),
        h('strong', null, t('tpl' + tp.key)), h('small', null, t('tpl' + tp.key + 'D')));
      card.addEventListener('click', () => {
        if (isDirty() && !confirm(t('confirmNew'))) return;
        $('#templatesDlg').close(); newFromState(tp.make());
      });
      grid.append(card);
    }
    $('#templatesDlg').showModal();
  }
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
          state = migrate(pr.state); state.id = pr.id; lastSavedSnap = snapshot(); selectedId = null; zoomAuto = true;
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
        h('button', { class: 'btn small', onclick: () => download(fileName(pr.name), JSON.stringify({ app: 'sticker-creator', v: 1, state: pr.state }, null, 1)) }, '⬇'),
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
    download(fileName(state.name), JSON.stringify({ app: 'sticker-creator', v: 1, state }, null, 1));
    toast(t('fileSaved'));
  }
  function importFile(file) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const obj = JSON.parse(r.result);
        const s = obj.state || obj;
        if (!s.layout || !s.label) throw new Error('bad');
        const ns = migrate(s); ns.id = null;
        newFromState(ns); toast(t('importOk'));
      } catch (e) { toast(t('importBad')); }
    };
    r.readAsText(file);
  }

  /* ================= print ================= */
  function renderPrint() {
    const area = $('#printArea'); area.innerHTML = '';
    const { L, pages } = paginate(state);
    for (const pg of pages) area.append(renderPage(state, L, pg, 'print'));
    let st = $('#pageStyle');
    if (!st) { st = h('style', { id: 'pageStyle' }); document.head.append(st); }
    st.textContent = `@page { size: ${L.P.w}mm ${L.P.h}mm; margin: 0; }`;
  }
  async function doPrint() {
    renderPrint();
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    await Promise.all($$('#printArea img').map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
    window.print();
  }

  /* ================= i18n apply / theme ================= */
  function applyLang() {
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('appTitle');
    for (const el of $$('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    for (const el of $$('[data-i18n-title]')) el.title = t(el.dataset.i18nTitle);
    $('[data-act=lang]').textContent = lang === 'ar' ? 'EN' : 'ع';
  }
  function applyTheme() {
    const th = safeGet('theme');
    if (th) document.documentElement.dataset.theme = th; else delete document.documentElement.dataset.theme;
  }

  function renderAll() {
    syncSettingsUI(); renderPresets(); renderVarChips(); renderEditor(); renderInspector(); renderLayers(); renderSheet(); updateSaveState(); updateUndoButtons();
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
      export: exportFile, import: () => $('#importInput').click(), print: doPrint,
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
      const r = new FileReader();
      r.onload = () => { state.data.csv = String(r.result); csvCache.text = null; syncSettingsUI(); renderVarChips(); renderEditor(); scheduleSheet(); commit(); };
      r.readAsText(f);
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
      if (e && e.type === 'image') pickImage((src) => { e.src = src; afterDesignChange(true); });
      else { const ta = $('#inspector textarea, #inspector input[type=text]'); if (ta) { ta.focus(); ta.select(); } }
    });

    document.addEventListener('keydown', (ev) => {
      const tag = (ev.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || ev.target.isContentEditable;
      const mod = ev.ctrlKey || ev.metaKey;
      if (mod && ev.key.toLowerCase() === 's') { ev.preventDefault(); saveProject(); return; }
      if (mod && ev.key.toLowerCase() === 'p') { ev.preventDefault(); doPrint(); return; }
      if (typing) return;
      if (mod && ev.key.toLowerCase() === 'z') { ev.preventDefault(); ev.shiftKey ? redo() : undo(); return; }
      if (mod && ev.key.toLowerCase() === 'y') { ev.preventDefault(); redo(); return; }
      const e = findEl(selectedId); if (!e) return;
      if (mod && ev.key.toLowerCase() === 'd') { ev.preventDefault(); duplicateSelected(); return; }
      if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); removeSelected(); return; }
      if (ev.key === 'Escape') { selectedId = null; renderEditor(); renderInspector(); renderLayers(); return; }
      const step = ev.shiftKey ? 1 : 0.25;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[ev.key];
      if (d && !e.locked) { ev.preventDefault(); e.x = round(e.x + d[0]); e.y = round(e.y + d[1]); renderEditor(); syncPosFields(); scheduleSheet(); scheduleCommit(); }
    });

    window.addEventListener('beforeprint', renderPrint);
    window.addEventListener('resize', debounce(() => { if (zoomAuto) renderEditor(); renderSheet(); }, 150));
    window.addEventListener('beforeunload', (ev) => { if (state.id && snapshot() !== lastSavedSnap) { ev.preventDefault(); ev.returnValue = ''; } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitCache.clear(); barcodeCache.clear(); renderEditor(); renderSheet(); });
  }

  /* ================= boot ================= */
  applyTheme();
  applyLang();
  loadInitial();
  wire();
  commit();
  renderAll();
  // Expose for debugging
  window.StickerCreator = { get state() { return state; }, paginate: () => paginate(state) };
})();
