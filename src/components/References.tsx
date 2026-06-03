/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Download, ExternalLink, Eye, ArrowRight, BookOpen, FileText, Check, Loader2 } from 'lucide-react';
import { REFERENCES_SYSTEM } from '../data';
import { ReferenceDocument } from '../types';

interface ReferencesProps {
  isArabic: boolean;
  references?: ReferenceDocument[];
}

export default function References({ isArabic, references = REFERENCES_SYSTEM }: ReferencesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedDoc, setSelectedDoc] = useState<ReferenceDocument | null>(null);
  const [downloadedCount, setDownloadedCount] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filterChips = [
    { label: isArabic ? "جميع المراجع" : "All References", value: "All" },
    { label: isArabic ? "أوراق السلامة SDS" : "SDS (Safety Data)", value: "SDS" },
    { label: isArabic ? "إجراءات التشغيل SOPs" : "SOPs", value: "SOP" },
    { label: isArabic ? "إرشادات OSHA" : "OSHA Guidelines", value: "OSHA" },
    { label: isArabic ? "بروتوكولات CDC" : "CDC Protocols", value: "CDC" },
    { label: isArabic ? "أدلة الأجهزة" : "Equipment Manuals", value: "MANUAL" }
  ];

  const filteredDocs = references.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || doc.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (docId: string, docTitle: string, directPdfUrl?: string) => {
    setDownloadedCount(prev => ({ ...prev, [docId]: true }));
    const msg = isArabic 
      ? `جاري فتح ومراجعة وتحميل مستند: "${docTitle}"`
      : `Opening official safety document: "${docTitle}"`;
    setToastMessage(msg);

    setTimeout(() => {
      setDownloadedCount(prev => ({ ...prev, [docId]: false }));
      setToastMessage(null);
      const finalPdfUrl = directPdfUrl || references.find(d => d.id === docId)?.pdfUrl;
      if (finalPdfUrl) {
        window.open(finalPdfUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1200);
  };

  const renderDocDetails = (doc: ReferenceDocument) => {
    switch (doc.id) {
      case 'ref-1': // HCl SDS
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-[#ba1a1a] dark:text-red-400 mt-2 uppercase tracking-wide flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              {isArabic ? "ملصق تصنيف مخاطر GHS الموحد" : "GHS CLASSIFICATION MANDATE - DANGER"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "الخصائص الكيميائية:" : "Chemical Properties:"}</strong> {isArabic ? "حامض كلور الماء المركّز (37 %)، معيار قطبي عالي التركيز وبخار حامضي مخرش (العيارية ~ 12.1 M)." : "Concentrated 37% Hydrochloric Acid (Molarity ~12.1 M). High vapor pressure, extremely corrosive."}</li>
              <li><strong>{isArabic ? "رتب الفطورة المعتمدة:" : "Assigned GHS Categories:"}</strong> {isArabic ? "مخرش لمجاري التنفس (فئة 3)، تلف العين بالكامل (فئة 1)، تآكل المعادن والأسطح الصلبة (فئة 1)." : "Corrosive to Metals (Category 1), Skin Corrosion (Category 1B), Serious Eye Damage (Category 1)."}</li>
              <li><strong>{isArabic ? "حواجز الوقاية المفروضة:" : "Required Safety Shielding:"}</strong> {isArabic ? "تلف قفازات النيتريل الرقيقة فوراً مع الاحتكاك المباشر. استخدام قفازات نيوبرين أو بيوتيل سميكة، نظارات splash مع درع كامل، ومئزر للبطن." : "Thin nitrile gloves fail rapidly with bulk acid spills. Don thick neoprene/butyl protective wear, indirect-vent safety goggles, and apron."}</li>
            </ul>
          </div>
        );
      case 'ref-2': // Ultracentrifuge
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white mt-2 text-xs uppercase">
              {isArabic ? "إدارة أجهزة الطرد المركزي فائقة السرعة:" : "High-Velocity Rotor Dynamics Control:"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "متطلبات الموازنة الهندسية:" : "Precision Calibration Target:"}</strong> {isArabic ? "يجب موازنة الكتل المتقابلة تماماً بفارق لا يتجاوز 0.1 جرام. خلل الموازنة مع السرعات الفائقة يولد طاقة حركية مدمرة قد تؤدي لانفجار غلاف الجهاز." : "Tubes must balance horizontally and symmetrically to within 0.1g. Improper weight balances translate into intense centrifugal wear and casing breaches."}</li>
              <li><strong>{isArabic ? "فحص دوار ميكانيكي:" : "Mechanical Rotor Integrity Inspection:"}</strong> {isArabic ? "امسح الأسطح بالكامل للتحقق من انعدام النقر الناتج عن الاحتكاك، التشققات المجهرية، أو الصدأ. يُحظر كلياً استخدام أي دوار تالف." : "Examine physical rotor patterns for micro-corrosion, hairline cracks, or metal fatigue. Scoring on aluminum rotor structures calls for immediate decommissioning."}</li>
              <li><strong>{isArabic ? "التحكم في الضغط الداخلي:" : "Active Vacuum Envelope:"}</strong> {isArabic ? "إغلاق فتحة العادم وتثبيت الغطاء لتفريغ حجرة الدوران بالكامل للحد من طاقة ومقاومات البخار والحرارة عند الدوران لتخطي ١٠,٠٠٠ دورة بالدقيقة." : "Confirm vacuum pump seal triggers before accelerating above 10,000 RPM. Dispersing air reduces friction-induced heat runaways."}</li>
            </ul>
          </div>
        );
      case 'ref-3': // OSHA HazCom 1910.1200
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white mt-2 text-xs uppercase">
              {isArabic ? "لوائح وإعلانات حق المعرفة المهنية:" : "Federal Employee Right-to-know Requirements:"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "رموز GHS التسعة الموحدة:" : "Standardized Label Elements:"}</strong> {isArabic ? "يلتزم المختبر بتسمية وتصنيف الحاويات بملصق GHS يحتوي على كلمة التنبيه، العبارات التحذيرية، والرموز البيانية الصحيحة للأحماض." : "Every chemical container requires standardized labeling capturing product identifier, signal words, hazard pictograms, and first aid guide codes."}</li>
              <li><strong>{isArabic ? "توفير فهارس SDS الكيميائية:" : "SDS Dossier Maintenances:"}</strong> {isArabic ? "الوصول الحر المباشر لجميع العاملين لأوراق السلامة طوال فترة المناوبة دون أي قيود إدارية أو عوائق." : "Employers must map and maintain updated physical or digital safety indexes, offering laborers unrestricted access on all operational shifts."}</li>
            </ul>
          </div>
        );
      case 'ref-4': // CDC BSL-2
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-teal-650 dark:text-teal-400 mt-2 text-xs uppercase">
              {isArabic ? "لوائح الأمان ومستويات الاحتواء الحيوي BSL-2:" : "BSL-2 Microbiological Barriers & Controls:"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "سلسلة الأحياء الميكروبية:" : "Target Bioagents:"}</strong> {isArabic ? "يتعامل هذا المستوى مع الكائنات مسببة لأمراض بشرية متوسطة كالإنفلونزا، السالمونيلا، والتهاب الكبد الوبائي." : "Regulates operations dealing with indigenous moderate-hazard biological culture-strains (Salmonella enterica, Influenza, etc.)."}</li>
              <li><strong>{isArabic ? "تطويق تشكل الرذاذ:" : "Aerosol Transmission Barriers:"}</strong> {isArabic ? "تشغيل كافة أجهزة رج الخلايا أو الفرز الميكروبي داخل كبائن السلامة الحيوية المزدوجة (BSC). يمنع استخدام الطاولات المفتوحة مسببة للرذاذ." : "Conduct aerosol-generating tasks (vibration, vortex mixing) strictly within Class II certified biological safety hoods."}</li>
              <li><strong>{isArabic ? "خطوات spill انسكاب الأحياء:" : "Aerosol Settling & Disinfection:"}</strong> {isArabic ? "في حال الشك في وجود رذاذ، اخلِ الغرفة فوراً، انتظر ٢٠ دقيقة لترسيب القطرات في فلاتر السحب السلبي، ثم نظف المنضدة بـ 10% كلور." : "For spill incidents, warn colleagues, evacuate, allow negative air cycles 20 minutes to settle particulate aerosol drops, then wash with 10% Bleach."}</li>
            </ul>
          </div>
        );
      case 'ref-5': // Chemical Fume Hood
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white mt-2 text-xs uppercase">
              {isArabic ? "بروتوكول فحص ومعايرة معدلات السحب للكبائن:" : "Fume Hood Face Velocity & Infiltration:"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "معايير تدفق الهواء السنوي:" : "Airflow Bounds (80-120 LFPM):"}</strong> {isArabic ? "تأكد من قراءة تدفق الهواء السطحي ومراوح السحب بحدود ممتازة ثابتة (٨٠-١٢٠ قدم خطي في الدقيقة) مع خلو مجرى العادم الفيدرالي." : "Verify physical exhaust velocity holds between 80 to 120 LFPM on calibrated monitors before executing volatile experiments."}</li>
              <li><strong>{isArabic ? "حدود حاجز الزجاج sash:" : "Sash Positioning Threshold:"}</strong> {isArabic ? "يُبقى على الحاجز منخفضًا وتحت مستوى الأشرطة المحددة (١٨ بوصة أو أدنى) لتشغيل دوامات الهواء السليم والدفاع ضد الانفجارات الحركية." : "Keep the sliding safety window at or below the 18-inch indicator notch. Elevated windows collapse local exhaust negative pressure."}</li>
              <li><strong>{isArabic ? "قاعدة مسافة الأمان الداخلية:" : "6-Inch Deep Clearance Rule:"}</strong> {isArabic ? "وضع الأدوات ومواقد التسخين بمسافة لا تقل عن ١٥ سم (٦ بوصات) من الحافة لضمان عدم تسلل الأبخرة الكيميائية العكسية لنطاق التنفس." : "Situate all beakers, heat blocks, and volatile samples at least 6 inches behind the window entrance curtain to eliminate edge eddies."}</li>
            </ul>
          </div>
        );
      case 'ref-6': // Nitric Acid SDS
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-rose-600 dark:text-rose-400 mt-2 text-xs uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
              {isArabic ? "محاذير حمض النيتريك المؤكسد 70%" : "POTENT NITRIC ACID (70%) OXIDIZER WARNING - DANGER"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "تفاعل السليلوز العنيف:" : "Violent Cellulose Ignition:"}</strong> {isArabic ? "حمض النيتريك المركز هو عامل أكسدة كيميائي عالي الخطورة. تلامسه مع الورق والمناديل العضوية يسبب احتراقاً تلقائياً طارداً للحرارة ولنيران فورية." : "Actively oxidizes organic substrates. Spilling over wood pulp or cellulose papers prompts immediate fires and explosive releases."}</li>
              <li><strong>{isArabic ? "أضرار التلامس الجلدي:" : "Dermal Permeation Limit:"}</strong> {isArabic ? "تتحلل وتتلف قفازات النيتريل الرقيقة العادية في أقل من دقيقتين مع حامض النيتريك. يرتدى في مناولة هذا الحجم قفازات نيوبرين سميكة مدعمة." : "Standard laboratory nitrile offers negligible chemical breakthrough protection (<2 min under exposure). Heavy neoprene is mandatory."}</li>
              <li><strong>{isArabic ? "غازات التفاعل والأبخرة:" : "Intoxicating Nitrogen Oxide Gases:"}</strong> {isArabic ? "يتسبب التفاعل في إخراج أبخرة حمضية مخرشة وجزيئية من غاز ثاني أكسيد النيتروجين بني اللون المميت للرئتين." : "Releases heavy red-brown Nitrogen Dioxide (NO2) vapor clouds. Work strictly inside continuous negative pressure ventilation hood structures."}</li>
            </ul>
          </div>
        );
      case 'ref-7': // Class II BSC SOP
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-[#0891b2] dark:text-[#22d3ee] mt-2 text-xs uppercase">
              {isArabic ? "بروتوكول السلامة الحيوية كبائن Class II:" : "Biosafety Cabinet Containment Mechanics:"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "تدفق الهواء المعقم بفلاتر HEPA:" : "HEPA Sterilizer Downflow:"}</strong> {isArabic ? "تنزيل هواء معقم رأسي (النسبة 70 % تدوير داخلي عبر فلاتر HEPA، والنسبة 30 % مخزن طارد معقم خارجي) لحماية المنتج والمتخصص." : "Maintains sterile downflow by recirculating 70% air through dynamic HEPA filters, protecting both cellular cultures and user barriers."}</li>
              <li><strong>{isArabic ? "موازنة الهواء الساحب والدافع:" : "Velocity Boundaries:"}</strong> {isArabic ? "الحفاظ المستقر على سرعة هواء سحب في الشبكة الأمامية (inflow) بمقدار ١٠٠-١١٠ قدم في الدقيقة لغلق مسار خلايا العدوى." : "Calibrate air intakes at 100-110 FPM on the front grill to secure negative containment pressures."}</li>
              <li><strong>{isArabic ? "بروتوكول التطهير السطحي:" : "Aseptic Disinfection standards:"}</strong> {isArabic ? "تطهير المنصات المعدنية بكحول أيزوبروبيلي 70% وتفادي تراكيب الكلور المركزة التي قد تتسبب في الصدأ للأرفف المعدنية الداخلية." : "Decontaminate tables with 70% Isopropanol. Restrict volatile solvents inside Class II cabinets to prevent flame/spark issues."}</li>
            </ul>
          </div>
        );
      case 'ref-8': // OSHA Chemical exposure 1910.1450
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white mt-2 text-xs uppercase">
              {isArabic ? "متطلبات خطة الرعاية الكيميائية CHP:" : "Federal Lab OSHA Chemical Hygiene Plan (CHP):"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "برنامج الإجراءات المكتوب CHP:" : "Mandated Written Program:"}</strong> {isArabic ? "قانون ١٩١٠,١٤٥٠ يلزم المختبرات بكتابة خطة واضحة ومسؤولة للوقاية والنظافة الكيميائية تتعهد بكل معايير ومقاييس التعرض الشخصي." : "Federal standard strictly mandates a documented written Chemical Hygiene Plan with clear safety rules, limits, and designated officer."}</li>
              <li><strong>{isArabic ? "مغاسل الطوارئ ومسافات الوصول:" : "Emergency Shower & Eyewash Spacings:"}</strong> {isArabic ? "يلزم القانون تثبيت مغسلة حمام كاملة وغاسل أعين سريع بدون حواجز بمسافة لا تتجاوز ١٠ ثوانٍ كحد أقصى من الأحماض." : "Requires fluid drench showers and hazard eyewashes inside a 10-second hazard perimeter, checked weekly for flow parameters."}</li>
              <li><strong>{isArabic ? "الرصد والملاحظة الطبية:" : "Medical Checks & Consultations:"}</strong> {isArabic ? "تمويل وتوفير الفحوص الطبية والمتابعة مجاناً للموظفين في حال استنشاق أو تلامس غازات أو انسكاب مفرط للمركبات السامة." : "Authorized zero-cost clinical checkups and monitoring for lab staff whenever safety systems leak or direct exposure occurs."}</li>
            </ul>
          </div>
        );
      case 'ref-9': // CDC disinfection guidelines
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-[#00478d] dark:text-blue-400 mt-2 text-xs uppercase">
              {isArabic ? "اشتراطات التعقيم البخاري وحرارة الموصدات:" : "CDC Steam Sterilization & Wet Thermodynamics:"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "معايير التعقيم الفزيائية:" : "Thermodynamic Rules (121°C at 15 PSI):"}</strong> {isArabic ? "توجيهات معاهد CDC تفرض تعريض الأكياس لدرجة ١٢١ مئوية تحت ضغط بخاري رطب ١٥ PSI لمدة تزيد عن ٣٠ دقيقة لإبادة الأبواغ الفتاكة." : "Saturated moist heat parameters demand continuous chamber holds of 121°C (250°F) under 15 PSI for 30-45 minutes to destroy high-resistance cell walls."}</li>
              <li><strong>{isArabic ? "التحقق البيولوجي بالأبواغ القياسية:" : "Biological Validation Indicators:"}</strong> {isArabic ? "توضع كبسولات Geobacillus stearothermophilus الحية أسبوعياً واختبار سلامة ومقاومة الأبواغ لضمان كفاءة الفصائل البكتيرية المعقمة." : "Validate sterilization batches using Geobacillus stearothermophilus vials. Outgrowths verify failure of valve steam saturations."}</li>
              <li><strong>{isArabic ? "فرز المخلفات ومحاذير الموصدة:" : "Incompatible Loadings:"}</strong> {isArabic ? "تجنب تماماً الموصدة على المواد الكيميائية الطيارة، الأحماض الحارقة، الشظايا المشعة لتفادي تسمم غلاف الموصدة أو الانفجار." : "Autoclaving volatile organic compounds, nitric acid containers, or toxic chemicals triggers high explosions and column corrosions."}</li>
            </ul>
          </div>
        );
      case 'ref-10': // Tuttnauer Autoclave
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white mt-2 text-xs uppercase">
              {isArabic ? "دليل ميكانيكا غلاف الموصدة ومحاذير الفتح:" : "Autoclave Superheat & Safe Unloading Procedures:"}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>{isArabic ? "فرط تسخين السوائل:" : "Extreme Fluid Superheating:"}</strong> {isArabic ? "تبقى السوائل حارة تفوق غليان الضغط الجوي بفعل الضغط الداخلي الموصد. هز الزجاجات أو فتح الباب بسرعة يفجر تسرب سريع ويحرق الذراع." : "Liquids maintain heat beyond boiling points due to pressure. Opening the seal swiftly drops pressure, inducing flash steam boiling expansions."}</li>
              <li><strong>{isArabic ? "خاصية التفريغ السلس للضغط:" : "Slow Depressurizing Standards:"}</strong> {isArabic ? "اختر بدقة دورة تبريد السوائل (Slow exhaust) لتسفيت الضغط تدريجياً، مع الامتناع عن سحب الزجاجات قبل هبوط قراءة الحرارة تحت ٨٠ مئوية." : "Operate slow exhaust profiles for liquid runs. Abstain from cracking the front door till chamber temperatures slide beneath 80°C."}</li>
              <li><strong>{isArabic ? "صمام الأمان وتفريغ الموصدة:" : "Mechanical Relief Valves:"}</strong> {isArabic ? "افحص وقم بمعايرة صمامات النحاس المخلصة لتفادي تآكل الحبال الرقيقة التي تسجل الضغوط الفوقية للغرفة وحمايتها من الانفجار." : "Routinely flush and inspect safety relief valves to prevent scale deposits from locking high-pressure relief channels."}</li>
            </ul>
          </div>
        );
      default:
        return (
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Overview:</strong> {doc.description}</p>
            <p><strong>Source / Publisher:</strong> {doc.source}</p>
            <p><strong>Document ID:</strong> {doc.id} - Revision: {doc.version}</p>
          </div>
        );
    }
  };

  return (
    <div id="references-container-main" className="flex flex-col gap-6 w-full animate-fadeIn pb-12">
      
      {/* Header Search Area */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-[#00478d] dark:text-blue-400">
            {isArabic ? "مكتبة المراجع وأوراق السلامة المعتمدة" : "Standard Reference Library"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
            {isArabic 
              ? "تصفح وافتح المراجع الفردية والوثائق الرسمية للسلامة وسرعة السحب وتأمين أحماض المختبرات واللوائح القياسية." 
              : "Search, view, and read official regulatory safety sheets, dynamic centrifuge manuals, and international laboratory standards."}
          </p>
        </div>

        {/* Input Text Box search bar styled like the Material 3 search layout */}
        <div className="sticky top-0 bg-[#f9f9ff] dark:bg-slate-900/95 backdrop-blur-md py-3 z-20 flex flex-col gap-3 -mx-4 px-4 sm:mx-0 sm:px-0 transition-colors">
          <div className="relative w-full max-w-2xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
              <Search className="w-5 h-5" />
            </span>
            <input
              id="ref-library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? "ابحث عن البروتوكولات، أوراق السلامة، والمعايير..." : "Search protocols, SDS, guidelines..."}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white rounded-xl py-3.5 pl-12 pr-4 shadow-sm transition-all outline-none text-sm placeholder:text-slate-400 h-14"
            />
          </div>

          {/* Scrolling filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterChips.map((chip) => (
              <button
                key={chip.value}
                id={`filter-chip-tab-${chip.value}`}
                onClick={() => setActiveFilter(chip.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-xs transition-all tracking-wide cursor-pointer ${
                  activeFilter === chip.value 
                    ? 'bg-[#00478d] text-white shadow-sm' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Materials standard document items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              id={`reference-document-card-${doc.id}`}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#00478d]/30 dark:hover:border-blue-500/35 transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.type === 'SDS' 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450' 
                    : doc.type === 'SOP' 
                      ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400'
                      : doc.type === 'MANUAL'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                }`}>
                  <FileText className="w-5 h-5 font-bold" />
                </div>

                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[9px] font-extrabold tracking-wider uppercase border border-slate-200/50 dark:border-slate-600/50">
                  {doc.type}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-md font-bold text-slate-800 dark:text-white group-hover:text-[#00478d] dark:group-hover:text-blue-300 transition-colors mb-2 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed mb-4 font-medium">
                  {doc.description}
                </p>
              </div>

              {/* Bottom meta row */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/80 mt-auto">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate max-w-[120px]">
                    {doc.source}
                  </span>
                  <div className="flex gap-2.5">
                    <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-200/40">
                      {doc.internal ? (isArabic ? 'داخلي' : 'Internal') : (isArabic ? 'خارجي' : 'External')}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-200/40">
                      {doc.version}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {/* View details drawer action */}
                  <button 
                    onClick={() => setSelectedDoc(doc)}
                    className="p-1.5 rounded-full text-slate-500 hover:text-[#00478d] hover:bg-slate-100 dark:hover:bg-slate-750 transition"
                    title={isArabic ? "عرض المعاينة" : "View Preview"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Visit Official Source Portal */}
                  {doc.url && (
                    <a 
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full text-[#00478d] dark:text-blue-400 hover:text-[#005db6] hover:bg-blue-50 dark:hover:bg-slate-750 transition"
                      title={isArabic ? "زيارة البوابة الرسمية" : "Visit Official Source"}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Interactive Download PDF standard */}
                  {doc.pdfUrl && (
                    <button
                      id={`download-docs-${doc.id}`}
                      onClick={() => handleDownload(doc.id, doc.title, doc.pdfUrl)}
                      className="p-1.5 rounded-full text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-slate-750 transition cursor-pointer"
                      title={isArabic ? "فتح ملف PDF المباشر" : "Download / Open PDF"}
                    >
                      {downloadedCount[doc.id] ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            {isArabic ? "لم يتم العثور على وثائق تطابق البحث." : "No safety references match your query."}
          </div>
        )}
      </div>

      {/* Drawer Overlay for Selected SOP Doc details */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-end items-stretch animate-fadeIn" onClick={() => setSelectedDoc(null)}>
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-800 shadow-xl overflow-y-auto transform transition-transform duration-300 p-8 flex flex-col gap-6 justify-between border-l border-slate-100 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-[#00478d]/10 text-[#00478d] dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider block mb-2 w-max">
                    {selectedDoc.type} DOCUMENT
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight font-headline-lg">
                    {selectedDoc.title}
                  </h2>
                </div>
                <button 
                  id="close-drawer-docs-btn"
                  onClick={() => setSelectedDoc(null)} 
                  className="p-1.5 border border-slate-200 dark:border-slate-600 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Detailed scientific content */}
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-700/80 pt-6">
                <p><strong>{isArabic ? "الوصف العام المستند:" : "Standard Overview:"}</strong> {selectedDoc.description}</p>
                
                {/* Dynamically render high-fidelity custom chemical and biological specifications */}
                {renderDocDetails(selectedDoc)}

                <div className="bg-[#f0f3ff] dark:bg-slate-700/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-3 mt-6">
                  <BookOpen className="w-5 h-5 text-[#00478d] dark:text-blue-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-250">{isArabic ? "المُصدِر والاعتماد التنظيمي" : "Regulating Issuer / Compliance Source"}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">{selectedDoc.source} | {selectedDoc.date} - Revision: {selectedDoc.version}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA block */}
            <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 dark:border-slate-700/80 pt-6 mt-6">
              {selectedDoc.pdfUrl && (
                <a
                  href={selectedDoc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleDownload(selectedDoc.id, selectedDoc.title)}
                  className="flex-1 bg-[#00478d] hover:bg-[#005db6] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>{isArabic ? "رابط مستند PDF المباشر" : "Direct Official PDF"}</span>
                </a>
              )}

              {selectedDoc.url && (
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer text-center border border-slate-200 dark:border-slate-600 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isArabic ? "زيارة البوابة الرسمية" : "Visit Regulator Hub"}</span>
                </a>
              )}

              <button 
                onClick={() => setSelectedDoc(null)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-xs text-center hover:bg-slate-200 dark:hover:bg-slate-700/60 transition cursor-pointer"
              >
                {isArabic ? "موافق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern, non-blocking toast indicator */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 border border-slate-700/80 text-white rounded-xl py-3.5 px-6 shadow-2xl z-50 flex items-center gap-3 animate-slideUp max-w-sm text-center">
          <Loader2 className="w-4 h-4 text-teal-400 shrink-0 animate-spin" />
          <span className="text-xs font-bold leading-normal">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
