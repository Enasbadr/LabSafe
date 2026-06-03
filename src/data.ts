/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReferenceDocument, ScenarioQuestion } from './types';

export interface LessonCard {
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  imageUrl: string;
  iconType: 'eye' | 'hand' | 'coat' | 'beaker' | 'flame' | 'shield' | 'bio' | 'temp' | 'warning';
}

export interface DetailedLesson {
  id: string;
  title: string;
  titleAr: string;
  labType: string;
  duration: string;
  durationAr: string;
  category: string;
  categoryAr: string;
  videoUrl?: string; // dyn video url
  objectives: string[];
  objectivesAr: string[];
  citation: string;
  citationAr: string;
  cards: LessonCard[];
  warning: {
    title: string;
    titleAr: string;
    text: string;
    textAr: string;
  };
  scenarioId: string; // link to DRILL_SCENARIOS
}

export const DRILL_SCENARIOS: ScenarioQuestion[] = [
  {
    id: "scen-chem-1",
    title: "HAZARD: Corrosive Acid Splash",
    scenarioText: "Concentrated Hydrochloric Acid (37%) has splashed onto your workspace. What is your immediate personal protection and containment action?",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4CVLWOKF6byW-TjDl7KaJ1qIZ2aDkf1ziBKYmQBHA1mnik5Ep14fBNwAtbZY_iQtablsgjA42uA-Uds7CFJqHas8s3s9uPjX5juLcuTF4qPMXDkTZokx-ltcKmYsj9XUe4IpbwQTSSCVupz39TfRI45uJY_hqpIuHP7OjkGZDNJ88g6KeAUvQQVTViNcp2Df321ktVWfSEWoqBvaszQ0AzAkuYNKu1sUODIFhZZLmiPciTF5kHKQzfd9T-eIO91g5J3MsRHIFxziB",
    options: [
      {
        id: "bare-hands",
        text: "Apply alkaline neutralizer directly with bare hands",
        explanation: "Never handle corrosive concentrated acids or operate without standard chemical-resistant neoprene/nitrile barriers."
      },
      {
        id: "spill-kit-ppe",
        text: "Deploy chemical spill absorbent under specialized PPE protection",
        explanation: "Correct! Immediately notify colleagues, don thick nitrile/neoprene gloves and heavy-splash goggles, then isolate the area and safely deploy specialized chemical absorbent pillows."
      },
      {
        id: "paper-towels",
        text: "Wipe down with standard paper towels",
        explanation: "Wiping concentrated strong acids with standard paper towels is unsafe because cellulose can react violently with oxidizing/highly concentrated chemicals."
      }
    ],
    correctOptionId: "spill-kit-ppe",
    standardCitation: "OSHA Standard 1910.1450 Appendix A - Occupational Exposure to Hazardous Chemicals in Laboratories",
    dangerAlert: {
      title: "Acid Contact Safeguard",
      text: "Standard Nitrile gloves provide basic transient protection. Heavy spills of concentrated acids demand thick nitrile or neoprene barriers to prevent rapid dermal breakthrough."
    }
  },
  {
    id: "scen-chem-2",
    title: "EMERGENCY: Concentrated Acid Spill on Floor",
    scenarioText: "Concentrated Nitric Acid (70%) is accidentally spilled on the concrete aisle. Standard cellulose paper is highly flammable under oxidizing acids. What is the correct response?",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4CVLWOKF6byW-TjDl7KaJ1qIZ2aDkf1ziBKYmQBHA1mnik5Ep14fBNwAtbZY_iQtablsgjA42uA-Uds7CFJqHas8s3s9uPjX5juLcuTF4qPMXDkTZokx-ltcKmYsj9XUe4IpbwQTSSCVupz39TfRI45uJY_hqpIuHP7OjkGZDNJ88g6KeAUvQQVTViNcp2Df321ktVWfSEWoqBvaszQ0AzAkuYNKu1sUODIFhZZLmiPciTF5kHKQzfd9T-eIO91g5J3MsRHIFxziB",
    options: [
      {
        id: "neutralize",
        text: "Isolate, notify colleagues, and neutralize slowly with granular Sodium Bicarbonate",
        explanation: "Correct! Slowly sprinkle granular sodium bicarbonate (NaHCO3) from the perimeter of the spill inward. This neutralizes the acid securely, transforming it into harmless salts and carbon dioxide."
      },
      {
        id: "water-dilution",
        text: "Shed plenty of tap water directly to dilute the strong acid",
        explanation: "Adding water to highly concentrated nitric/sulfuric acid produces intensive heat (highly exothermic reaction), causing immediate boiling, corrosive splashing, and toxic nitrogen dioxide fumes."
      },
      {
        id: "dilution-mop",
        text: "Use standard hospital floor mops to clean standard floor spills",
        explanation: "Never mop strong corrosive acids with organic string/cellulose mops. The acid will instantly destroy the material and generate toxic corrosive fumes."
      }
    ],
    correctOptionId: "neutralize",
    standardCitation: "OSHA Hazard Communication Standard 1910.1200 & Title 29 CFR HAZWOPER",
    dangerAlert: {
      title: "Cellulose Ignitibility",
      text: "Nitric acid is a potent oxidizer. Contact with organic cellulose like paper towels or wood-derived pulp can ignite fires instantly."
    }
  },
  {
    id: "scen-chem-3",
    title: "EMERGENCY: Solvent Ignition inside Fume Hood",
    scenarioText: "A heating beaker containing highly volatile Acetone catches fire alongside your hot heating plate. What do you do?",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp3_0_yH_kktU8tZnoWkyEi01pr09c7N5W63KUPIyh9Mb5pgrfVNeeb6i_lbHNzS6XNp5PiIBInhh4bQA2F44vPPRlRBztGIWv1TsuPSbQcvsgx1_MRs9i4UdeCXvCMADck6dT0DaaxMDlkv4-Wgn-8CwJvjQ-_OUGzMKOwu6PLzOccCoIAP7GGiUFGnxEFjGNRDAoFDTsoxP0Bg7wZLhr9xxUBQPsTIl8cxhyzaSGGJWz4_Y43zlDpM0NMtrwDngrabi7ezcCPRNc",
    options: [
      {
        id: "co2-ext",
        text: "Pull the fume hood sash down fully, then utilize a Class B CO2 extinguisher",
        explanation: "Correct! Lowering the glass sash immediately prevents oxygen ingress and shields against splashes. Class B Carbon Dioxide extinguishes organic chemical fires safely without equipment damage."
      },
      {
        id: "sink-water",
        text: "Throw high pressure water from washing flasks directly into the beaker",
        explanation: "Water is denser than acetone and won't put out class B fires. Instead, it will instantly splash the burning solvent out of the hood, spreading flames to the entire lab."
      },
      {
        id: "fume-close",
        text: "Quickly slide hands in and cover the fiery beaker with a notebook",
        explanation: "Placing paper/cardboard on an active solvent blaze will only ignite the notebook and cause severe burns to your hands."
      }
    ],
    correctOptionId: "co2-ext",
    standardCitation: "NFPA 45: Standard on Fire Protection for Laboratories Using Chemicals, Chapter 11",
    dangerAlert: {
      title: "Fume Hood Shielding",
      text: "The sliding sash acts as your primary explosion and fire shield. Keeping the sash properly positioned at or below 18 inches prevents volatile thermal drafts from escaping."
    }
  },
  {
    id: "scen-micro-1",
    title: "HAZARD: Pathogenic Biological Release",
    scenarioText: "A liquid flask container containing clinically infectious Salmonella enterica is dropped and shatters, dispersing aerosols in the BSL-2 lab. What is the correct protocol?",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
    options: [
      {
        id: "direct-wipe",
        text: "Grab a standard sponge and immediately wipe the raw infection to dry the surface",
        explanation: "Never wipe infectious biological spills immediately with standard sponges. This creates high levels of aerosol contamination, risking respiratory exposure."
      },
      {
        id: "evacuate-settle",
        text: "Evacuate room, warn others, wait 20 minutes for aerosols to settle, then decontaminate with 10% bleach",
        explanation: "Correct! For BSL-2 aerosol spills, you must immediately leave the room to avoid inhaling droplets. Wait 20 minutes to allow aerosols to settle under negative pressure, then clean using 10% sodium hypochlorite (bleach)."
      },
      {
        id: "re-autoclave",
        text: "Use high pressure steam directly on the wet floor tiles to sterilize the bacteria",
        explanation: "Steam cannot be applied directly to concrete floor tiles without causing serious steam burns and vaporizing the pathogens."
      }
    ],
    correctOptionId: "evacuate-settle",
    standardCitation: "CDC/NIH Biosafety in Microbiological and Biomedical Laboratories (BMBL) 6th Edition, BSL-2 Section",
    dangerAlert: {
      title: "Biological Aerosols",
      text: "Moderate pathogens travel easily in droplets. Allowing negative air cycles to clear airborne particles for 20 minutes prevents dangerous lung exposure."
    }
  },
  {
    id: "scen-micro-2",
    title: "HAZARD: Autoclave Validation Spore Test Failure",
    scenarioText: "After autoclaving biohazardous waste, the incubated Geobacillus stearothermophilus spore test retains its bright purple color, indicating failure. What is the standard containment action?",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
    options: [
      {
        id: "dispose",
        text: "Assume the load is sterile anyway and discard standard bags in the generic municipal trash bins",
        explanation: "Never dispose of waste when validation tests fail. Disposing of raw, potentially active clinical biohazardous waste violates CDC guidelines and environmental laws."
      },
      {
        id: "quarantine-report",
        text: "Quarantine the load, flag the autoclave as out of service, report the failure, and re-run under calibration check",
        explanation: "Correct! If the biological indicator fails (bacterial spores survived), sterilization was unsuccessful. You must immediately quarantine all bags from that batch, mark the device out of service, notify safety officers, and calibrate the steam valves."
      },
      {
        id: "dilute-sink",
        text: "Open the bags under the sink Tap water and rinse with biological soap",
        explanation: "Opening biohazardous bags in an open sink is a critical safety breach that will contaminate the local plumbing system and water supply."
      }
    ],
    correctOptionId: "quarantine-report",
    standardCitation: "CDC Guidelines for Environmental Infection Control, Section III (Sterilization and Disinfection)",
    dangerAlert: {
      title: "Biological Validation Standard",
      text: "Purple/Positive spore results indicate the high-resistance Geobacillus spores survived. This occurs when pressure seals leak or steam saturation temperatures fail to hit 121°C."
    }
  }
];

export const LAB_LESSONS_DATA: DetailedLesson[] = [
  {
    id: "chem-l1",
    title: "Chemical Hygiene & PPE Basics",
    titleAr: "أساسيات النظافة الكيميائية ومعدات الوقاية الشخصية",
    labType: "chemistry",
    duration: "3 min",
    durationAr: "٣ دقائق",
    category: "General Hygiene",
    categoryAr: "السلامة العامة",
    objectives: [
      "Classify categories of laboratory chemical protective equipment.",
      "Identify Breakthrough protection limits of nitrile and neoprene barriers.",
      "Understand why certain synthetic clothes should be banned in high-temperature chemical spaces."
    ],
    objectivesAr: [
      "تصنيف مستويات وأنواع معدات الوقاية الكيميائية المختلفة.",
      "تمييز زمن النفاذ المقاوم للمطاط النيتريل والنيوبرين للأحماض.",
      "فهم سبب حظر الملابس الاصطناعية سريعة الانصهار في المختبرات الحرارية."
    ],
    citation: "OSHA Standard 29 CFR 1910.132 - Personal Protective Equipment General Requirements",
    citationAr: "مستند معايير إدارة السلامة والصحة المهنية الأمريكية OSHA 29 CFR 1910.132",
    warning: {
      title: "PPE is the Last Line of Defense",
      titleAr: "معدات الوقاية هي خط الدفاع الأخير",
      text: "PPE behaves purely as a barrier. You must prioritize engineering controls (such as negative fume cupboards) before relying solely on personal clothing.",
      textAr: "معدات الوقاية الشخصية هي دائماً خط دفاعك الأخير. يجب إعطاء الأولوية للضوابط الهندسية (ككبائن الغازات الساحبة) قبل الاعتماد عليها."
    },
    scenarioId: "scen-chem-1",
    cards: [
      {
        title: "Ocular Protection Standard",
        titleAr: "معايير حماية العين البصرية",
        desc: "Impact-resistant glasses with solid side shields represent the absolute minimum. Avoid contact lenses during solvent handling as concentrated chemical vapors can absorb under the lens, accelerating corneal injury.",
        descAr: "نظارات مقاومة للصدمات مزودة بحواجز صلبة جانبية هي الحد الأدنى المفروض. تجنب العدسات اللاصقة لكونها تمتص الغازات وتضاعف تضرر القرنية.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Ws_vXiUBGC3A5HaY0hHRuLFISAfb2rnaYX4QxjXj3P4WGbnmJvo3tIV452A70yq7pliExxIOwz7gqGtV0dCLqMR4w8E-FC7ev9Y45tJNmoX5fktjHeYUc1Ra1jUZtmkl-HD3AcjUuzuP3OSbi4JyG9D0uWkCF_3UFUCmY5TJZAxqtWL6hLbY_Dysn4pEUfzHH86PrylqnUy7bMtDzgYZleE_ZYxw-nDQVZBNg_VoYrZXY-5BJ2rkL6Yoj6xHFXRKslblqCaXcuiG",
        iconType: "eye"
      },
      {
        title: "Dermal Barriers",
        titleAr: "حواجز اليد البشرية الوقائية",
        desc: "Standard thin nitrile gloves hold outstanding resistance for temporary chemical splashes. Corrosive strong acids (like concentrated HCl or nitric) require thick specialized neoprene or butyl gloves to provide standard breakthrough threshold defense.",
        descAr: "توفر قفازات النيتريل العادية حماية ممتازة للانسكابات العابرة السريعة. غير أن التعامل مع الأحماض الحارقة يتطلب حواجز نيوبرين سميكة.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "hand"
      },
      {
        title: "Torso Shielding Coat",
        titleAr: "معطف الوقاية القطني الأبيض",
        desc: "Lab coats must remain 100% heavy cotton and fully buttoned down. Synthetic polymer fibers (like polyester blends) will instantly melt during combustion, sticking to skin cells and severely escalating thermal burns.",
        descAr: "يجب اختيار معطف قطن ١٠٠٪ وإغلاق سائر الأزرار. تذوب ألياف البوليستر الاصطناعية على الفور مع النار مسببة تشوه جلدي حاد.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
        iconType: "coat"
      }
    ]
  },
  {
    id: "chem-l2",
    title: "Acid Spill Isolation & Liquid Containment",
    titleAr: "بروتوكول احتواء وتحييد انسكاب الأحماض المركزة",
    labType: "chemistry",
    duration: "4 min",
    durationAr: "٤ دقائق",
    category: "Chemical Handling",
    categoryAr: "التعامل الكيميائي",
    objectives: [
      "Mitigate risks of highly concentrated Sulfuric (98%) and Nitric (70%) oxidizing acids spill response.",
      "Safely apply granular Sodium Bicarbonate dry neutralizer starting from borders inward.",
      "Understand why cellulose structures (such as organic wood-pulp paper towels) can prompt active fires with strong oxidizers."
    ],
    objectivesAr: [
      "تقييم مخاطر انسكاب أحماض مركزة عالية الفعالية كحمض الكبريتيك ٩٨٪ والنيتريك ٧٠٪.",
      "تحييد الأحماض تدريجياً وبأمان بنثر بيكربونات الصوديوم الجافة من الحدود نحو الداخل.",
      "فهم دور عوازل السليلوز (كالمناديل الورقية) في تفجير تفاعلات أكسدة واشتعال حاد."
    ],
    citation: "OSHA Title 29 CFR 1910.120 - Hazardous Waste Operations and Emergency Response (HAZWOPER)",
    citationAr: "المواصفة الفيدرالية للأمان وإدارة النفايات الخطرة OSHA Title 29 CFR 1910.120",
    warning: {
      title: "Highly Exothermic Reactions",
      titleAr: "تفاعلات طاردة للحرارة الشديدة",
      text: "Never dilute strong concentrated acids by pouring high quantities of water directly onto the liquid. Doing so results in explosive boiling, spitting droplets of corrosive acid into your face.",
      textAr: "لا تصب الماء أبداً فوق حمض مركز لتخفيفه، التفاعل يولد طاقة حرارية هائلة تسبب فوراناً انفجارياً فورياً ورش الحمض في وجهك."
    },
    scenarioId: "scen-chem-2",
    cards: [
      {
        title: "Chemical Spill Boundaries",
        titleAr: "إجراءات تطويق منطقة الانسكاب",
        desc: "Immediately signal emergency alerts to other peers, isolate the physical workspace, and restrict access starting 3 meters from spill center. Proper containment kit deployment stops corrosive migration into structural surfaces.",
        descAr: "أبلغ الزملاء فوراً، وطوق المنطقة المحيطة بمسافة ٣ أمتار مربع من بؤرة الانسكاب لتقييد المرور لسلامة الأفراد.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4CVLWOKF6byW-TjDl7KaJ1qIZ2aDkf1ziBKYmQBHA1mnik5Ep14fBNwAtbZY_iQtablsgjA42uA-Uds7CFJqHas8s3s9uPjX5juLcuTF4qPMXDkTZokx-ltcKmYsj9XUe4IpbwQTSSCVupz39TfRI45uJY_hqpIuHP7OjkGZDNJ88g6KeAUvQQVTViNcp2Df321ktVWfSEWoqBvaszQ0AzAkuYNKu1sUODIFhZZLmiPciTF5kHKQzfd9T-eIO91g5J3MsRHIFxziB",
        iconType: "shield"
      },
      {
        title: "Dry Neutralization Agent",
        titleAr: "عامل التحييد بيكربونات الصوديوم",
        desc: "Dust granular Sodium Bicarbonate (NaHCO3) gently onto the spill starting from the outer margins towards the center. This pattern isolates the boundary, neutralizes pH, and controls heat release without causing splatters.",
        descAr: "انثر مسحوق بيكربونات الصوديوم تدريجياً ابتداءً من الحواف المتطرفة نحو الداخل للتحكم بالطاقة المتولدة وغاز CO₂.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "beaker"
      },
      {
        title: "Zero Cellulose Constraint",
        titleAr: "حظر الأوراق والسليلوز العضوي",
        desc: "Strong concentrated mineral acids, especially nitric acid, act as rapid oxidizing chemistry agents. Cleaning up with common wood-derived paper towels can trigger rapid exothermic reactions and immediate fire ignition.",
        descAr: "الأحماض المعدنية القوية والنيتريك خصوصاً تعمل كمؤكسدات فورية. تنظيفها بالمناديل الورقية يسبب اشتعالاً غير متوقّع للغابة الورقية.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
        iconType: "warning"
      }
    ]
  },
  {
    id: "chem-l3",
    title: "Fume Hood Airflow & Volatile Vapor Controls",
    titleAr: "بروتوكول ساحبات الغازات والتعامل مع السوائل الطيارة",
    labType: "chemistry",
    duration: "3.5 min",
    durationAr: "٣.٥ دقيقة",
    category: "Fume Hood Safety",
    categoryAr: "كبائن الأمان والغازات",
    objectives: [
      "Observe negative pressure exhaust systems inside modern chemical fume hoods.",
      "Calibrate front sliding sash elevation below the safe 18-inch threshold.",
      "Maintain the 6-inch working clearance deep inside the hood to prevent face velocity disruptions."
    ],
    objectivesAr: [
      "فهم آليات ضغط الهواء وتجدد دورته لمنع تراكم الأبخرة الكيميائية.",
      "ضبط علو حاجز الزجاج sash ليكون تحت علامة الأمان المعتمدة (١٨ بوصة).",
      "الالتزام بمسافة العمل البالغة ١٥ سم داخل عمق الكابينة لضمان استقرار السحب الهوائي."
    ],
    citation: "ANSI/ASHRAE Standard 110-2016 - Methods of Testing Performance of Laboratory Fume Hoods",
    citationAr: "المواصفة القياسية العالمية ANSI/ASHRAE Standard 110-2016 لثبات سحب غازات كبائن الفحص",
    warning: {
      title: "Explosion Barrier Shield",
      titleAr: "الحاجز الزجاجي الواقي من الانفجار",
      text: "The glass sash is not only for airflow. In the case of unexpected thermal runaway, pressurized explosion, or flash fire, the sash serves as your primary physical protection barrier against severe shrapnel.",
      textAr: "زجاج الساحبة لا ينظم الهواء فحسب. بل هو درع مادي يحميك من أي تناثر زجاجي، شظايا، أو نيران في حال حدوث انفجار غير متوقع."
    },
    scenarioId: "scen-chem-3",
    cards: [
      {
        title: "Exhaust Flow Calibration",
        titleAr: "معايرة تدفق سحب الهواء",
        desc: "Fume hood air sweeps hazardous chemical vapors outward. Always verify air velocity registers between 80 to 120 Linear Feet Per Minute (LFPM) on the monitor before beginning any work with volatile solvents.",
        descAr: "تسحب കැබينة الغاز الأبخرة بدقة. تأكد دائماً أن سرعة الهواء المسجلة تتراوح بين ٨٠ و١٢٠ قدماً في الدقيقة لثبات السحب الآمن.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Ws_vXiUBGC3A5HaY0hHRuLFISAfb2rnaYX4QxjXj3P4WGbnmJvo3tIV452A70yq7pliExxIOwz7gqGtV0dCLqMR4w8E-FC7ev9Y45tJNmoX5fktjHeYUc1Ra1jUZtmkl-HD3AcjUuzuP3OSbi4JyG9D0uWkCF_3UFUCmY5TJZAxqtWL6hLbY_Dysn4pEUfzHH86PrylqnUy7bMtDzgYZleE_ZYxw-nDQVZBNg_VoYrZXY-5BJ2rkL6Yoj6xHFXRKslblqCaXcuiG",
        iconType: "beaker"
      },
      {
        title: "The 6-Inch Safety Clearance",
        titleAr: "مسافة الأمان العميقة ١٥ سم",
        desc: "Always run burners, hold flasks, and conduct heating at least 6 inches deep behind the sash entry plane. Swirl gaps occurring right at the border can easily pull volatile vapors back into your local respiratory field.",
        descAr: "أجرِ سائر تجارب التسخين كحد أدنى على مسافة ١٥ سم داخل عمق الساقية لمنع الدوامات الطرفية من سحب الروائح لنطاق تنفسك الطبيعي.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "shield"
      },
      {
        title: "Solvent Ignition Standard",
        titleAr: "معايير السيطرة على اشتعال المذيبات",
        desc: "Highly volatile and organic solvents (like ethers, alcohols, acetone) catch fire rapidly next to active heat sources. Close the sash fully to isolate the emergency immediately and deploy standard Class B Carbon Dioxide suppressants.",
        descAr: "المذيبات الكيميائية تشتعل بخطورة عالية بجوار السخانات. أغلق فاصل الكابينة تماماً واستخدم مطفأة غاز ثاني أكسيد الكربون Class B.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp3_0_yH_kktU8tZnoWkyEi01pr09c7N5W63KUPIyh9Mb5pgrfVNeeb6i_lbHNzS6XNp5PiIBInhh4bQA2F44vPPRlRBztGIWv1TsuPSbQcvsgx1_MRs9i4UdeCXvCMADck6dT0DaaxMDlkv4-Wgn-8CwJvjQ-_OUGzMKOwu6PLzOccCoIAP7GGiUFGnxEFjGNRDAoFDTsoxP0Bg7wZLhr9xxUBQPsTIl8cxhyzaSGGJWz4_Y43zlDpM0NMtrwDngrabi7ezcCPRNc",
        iconType: "flame"
      }
    ]
  },
  {
    id: "micro-l1",
    title: "Biosafety Level (BSL) Rules & Physical Barriers",
    titleAr: "تصنيف مستويات السلامة البيولوجية (BSL) والضوابط الوقائية",
    labType: "microbiology",
    duration: "4 min",
    durationAr: "٤ دقائق",
    category: "Biosafety Levels",
    categoryAr: "مستويات الأمان الحيوي",
    objectives: [
      "Understand biosafety classifications from basic BSL-1 to extreme high-containment BSL-4.",
      "Analyze negative air pressure limits and sterile HEPA filtration circuits.",
      "Examine how standard Biosafety Cabinets Class II protect both researchers and biological cell cultures."
    ],
    objectivesAr: [
      "فهم تصنيفات مستويات الأمان البيولوجي من BSL-1 حتى غرف الحجر الفائقة BSL-4.",
      "معرفة ديناميكيات عزل تدفق الهواء وفلاتر HEPA عالية الجسر البيولوجي.",
      "تمييز عمل كبائن السلامة الحيوية Class II لمنح الحماية المتبادلة للمستنبت والباحث."
    ],
    citation: "CDC/NIH Biosafety in Microbiological and Biomedical Laboratories (BMBL) 6th Edition",
    citationAr: "دليل مركز السيطرة على الأمراض CDC والمعاهد الوطنية للصحة BMBL الطبعة السادسة",
    warning: {
      title: "Biological Aerosol Risk",
      titleAr: "مخاطر التعلق الهوائي الميكروبي",
      text: "Unlike heavy chemical liquids, biological pathogens can drift easily in fine microscopic aerosol droplets. Open benches are dangerous for aerosol pathogens and demand sterile Biosafety Cabinets.",
      textAr: "على عكس السوائل الكيميائية الثقيلة، مسببات الأمراض تسبح مع الرذاذ الدقيق المحلق؛ لذا يمنع فتح عبواتها خارج كبائن السلامة البيولوجية."
    },
    scenarioId: "scen-micro-1",
    cards: [
      {
        title: "HEPA Biosafety Cabinets",
        titleAr: "كبائن السلامة البيولوجية بفلاتر HEPA",
        desc: "Unlike chemical fume hoods that exhaust air raw, Biosafety Cabinets (BSCs Class II) use HEPA sterilizers to filter internal recirculation downflow and exhaust. This creates complete product sterility while preserving user skin barrier parameters.",
        descAr: "تختلف الكبائن الكيميائية عن الحيوية؛ كبائن السلامة (BSC Class II) تطهر الهواء الداخل والخارج عبر فلتر HEPA لحماية الأنسجة والباحث.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Ws_vXiUBGC3A5HaY0hHRuLFISAfb2rnaYX4QxjXj3P4WGbnmJvo3tIV452A70yq7pliExxIOwz7gqGtV0dCLqMR4w8E-FC7ev9Y45tJNmoX5fktjHeYUc1Ra1jUZtmkl-HD3AcjUuzuP3OSbi4JyG9D0uWkCF_3UFUCmY5TJZAxqtWL6hLbY_Dysn4pEUfzHH86PrylqnUy7bMtDzgYZleE_ZYxw-nDQVZBNg_VoYrZXY-5BJ2rkL6Yoj6xHFXRKslblqCaXcuiG",
        iconType: "bio"
      },
      {
        title: "Infection Classifications",
        titleAr: "تصنيف درجات العدوى الحيوية",
        desc: "BSL-1 handles low-risk agents (benign E. coli). BSL-2 manages moderate native pathogens (such as Salmonella or Influenza). BSL-3 covers highly lethal aerosol contagions (such as Tuberculosis, Anthrax) demanding special respirator locks.",
        descAr: "BSL-1 للعوامل البسيطة، BSL-2 للمسببات المرضية المتوسطة كالمكورات والسالمونيلا، BSL-3 لأوبئة الرئتين الفتاكة كالسل الجرثومي.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "shield"
      },
      {
        title: "Pressure Isolation Differential",
        titleAr: "الضغط السلبي التفاضلي للعزل",
        desc: "Advanced containment zones (BSL-3 & BSL-4) hold permanent negative indoor air pressure. This maintains a physical vacuum force where ambient outdoor air drafts strictly flow inward, ensuring zero leaks of airborne pathogens.",
        descAr: "نطاقات الاحتواء المتقدمة تستند لضغط تفاضلي سلبي مستمر؛ يسحب الهواء للداخل باستمرار ليضمن عدم هرب الميكروبات للخارج مطلقاً.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
        iconType: "warning"
      }
    ]
  },
  {
    id: "micro-l2",
    title: "Autoclave Sterilization & Biological Validation",
    titleAr: "تعقيم النفايات الحيوية بالبخار المضغوط والتحقق البيولوجي",
    labType: "microbiology",
    duration: "4.5 min",
    durationAr: "٤.٥ دقيقة",
    category: "Sterilization SOP",
    categoryAr: "بروتوكولات التعقيم الجرثومي",
    objectives: [
      "Operate steam autoclaves under proper thermodynamic parameters (121°C/250°F at 15 psi for 30-45 minutes).",
      "Validate sterilization cycles with heat-resistant Geobacillus stearothermophilus biological spore tests.",
      "Understand and avoid fatal boiling-over thermal shock explosions during autoclave door unloading."
    ],
    objectivesAr: [
      "تشغيل المحم البخاري بالمعايير الحرارية المصنفة (١٢١ مئوية تحت ضغط ١٥PSI لمدة تزيد عن ٣٠ دقيقة).",
      "التحقق القياسي لفاعلية التعقيم بست غازات من الأبواغ الحية Geobacillus stearothermophilus المقاومة للحرارة.",
      "تجنب الغليان الانفجاري للمحاليل مفرطة التسخين نتيجة الفتح المتسرع لأبواب غرف الضغط."
    ],
    citation: "CDC Guidelines for Environmental Disinfection and Sterilization in Healthcare & Laboratory Facilities",
    citationAr: "توجيهات مركز السيطرة على الأمراض CDC والمعهد القومي لتعقيم المختبرات الميكروبيولوجية",
    warning: {
      title: "Autoclave Superheating Hazards",
      titleAr: "خطر فرط غليان السوائل الحراري",
      text: "Liquids under high pressure can stay hot way past their atmospheric boiling limits. Striking the chamber handle or opening the door before temperature falls below 80°C triggers flash steam and violent boiling eruptions.",
      textAr: "تبقى السوائل حارة تفوق درجة الغليان تحت ضغط الموصدة. فتح الباب أو هزه سريعاً قبل هبوط الحرارة لثمانين درجة مئوية يحدث فوراناً انفجارياً يحرق الوجه والجلد."
    },
    scenarioId: "scen-micro-2",
    cards: [
      {
        title: "Saturated Steam Thermodynamics",
        titleAr: "ديناميكا البخار الرطب المشبع",
        desc: "Moist heat sterilization transfers extensive heat energy way faster than dry hot ovens. When pressurized steam hits cold bacteria cells, it condenses immediately, instantly denaturing microbiological cellular proteins and destroying viral vectors.",
        descAr: "الحرارة البخارية الرطبة المضغوطة تفوق الأفران الجافة بمئات المرات في سرعة تفتت الجدران والنيوكليوتيدات للكائنات الحية الممرضة.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
        iconType: "temp"
      },
      {
        title: "Biological Spore Verification",
        titleAr: "التحقق بالأبواغ الحيوية القياسية",
        desc: "Colorimetric chemical indicators (autoclave tape) only verify that the temperature changed. You must validate target sterility by placing bio-indicators containing Geobacillus stearothermophilus spores inside the chamber, then incubating to check for cell outgrowth.",
        descAr: "الأشرطة الكيميائية تقيس ملامسة الحرارة فقط، لكن التأكد المطلق للتعقيم يتطلب أبواغ بكتيرية حية واختبار تغير اللون بعد التحضين المعتمد.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Ws_vXiUBGC3A5HaY0hHRuLFISAfb2rnaYX4QxjXj3P4WGbnmJvo3tIV452A70yq7pliExxIOwz7gqGtV0dCLqMR4w8E-FC7ev9Y45tJNmoX5fktjHeYUc1Ra1jUZtmkl-HD3AcjUuzuP3OSbi4JyG9D0uWkCF_3UFUCmY5TJZAxqtWL6hLbY_Dysn4pEUfzHH86PrylqnUy7bMtDzgYZleE_ZYxw-nDQVZBNg_VoYrZXY-5BJ2rkL6Yoj6xHFXRKslblqCaXcuiG",
        iconType: "beaker"
      },
      {
        title: "Bio-Waste Segregation SOP",
        titleAr: "فرز النفايات الحيوية المصنفة",
        desc: "Infectious plates, bacterial swabs, and pathogen tubes must sit in red physical biohazard safety bags containing autoclave water. All waste must pass standard autoclave sterilization before departing outside clinical bounds.",
        descAr: "النفايات والمزارع والمحاليل البيولوجية توضع بأكياس الخطر الحيوي الحمراء المرطبة وتوصد بالكامل قبل خروجها الميداني.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "warning"
      }
    ]
  },
  {
    id: "chem-l4",
    title: "Chemical Compatibility & Hazardous Storage",
    titleAr: "توافق المواد الكيميائية ومخاطر التخزين غير الآمن",
    labType: "chemistry",
    duration: "4 min",
    durationAr: "٤ دقائق",
    category: "Safety Storage",
    categoryAr: "التخزين الآمن",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chemical-pouring-in-a-laboratory-analytical-experiment-40227-large.mp4",
    objectives: [
      "Understand GHS hazard group separation and chemical segregation principles.",
      "Recognize explosive peroxide-forming compounds (ethers, THF) and their testing timelines.",
      "Determine why strong acids and organic solvents must never be stored in the same safety cabinet."
    ],
    objectivesAr: [
      "فهم تصنيفات المجموعات الكيميائية المتعارضة ومبادئ عزلها واحتوائها.",
      "تمييز المركبات الكيميائية التي تشكل بيروكسيدات متفجرة كالإيثرات وتواريخ فحصها.",
      "معرفة سبب حظر تخزين الأحماض المعدنية القوية والفتائل مع المذيبات العضوية في كابينة واحدة."
    ],
    citation: "OSHA Hazard Communication Standard 1910.1200 & NFPA 45 Laboratory Safety Standard",
    citationAr: "مواصفة إدارة السلامة والصحة المهنية OSHA 1910.1200 والمعيار الوطني للوقاية من الحرائق NFPA 45",
    warning: {
      title: "Peroxide Forming Chemical Explosion",
      titleAr: "انفجار المركبات المكونة للبيروكسيدات تلقائياً",
      text: "Certain organic solvents like diethyl ether and tetrahydrofuran absorb ambient oxygen over time, forming shock-sensitive, explosive crystalline peroxides. Never shake or force open an expired peroxide-former container.",
      textAr: "تمتص بعض المذيبات كالإيثرات الأكسجين الجوي مكونة بيروكسيدات بلورية سريعة الانفجار عند الحركة أو الفتح العنيف؛ لذا يحظر رج زجاجاتها القديمة غير المفطونة."
    },
    scenarioId: "scen-chem-2",
    cards: [
      {
        title: "Chemical Segregation SOP",
        titleAr: "بروتوكول عزل المواد المتعارضة",
        desc: "Never store nitric acid next to organic acids like acetic or formic acid, and keep strong oxidizers completely segregated from flammable solvents. Accidental leaks can spark rapid fires, immediate carbonization, or toxic emissions.",
        descAr: "يحظر تخزين حمض النيتريك بجوار الأحماض العضوية (كالخليك) أو بجانب المذيبات سريعة الاشتعال وعوامل الأكسدة، تجنباً لحدوث اشتعال تلقائي أو انبعاثات شديدة السمية.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
        iconType: "shield"
      },
      {
        title: "Explosive Peroxides",
        titleAr: "مخاطر البيروكسيدات المتفجرة",
        desc: "Label organic peroxide formers with opening and expiration dates. Test solvents every 3 to 12 months for peroxide concentrations using starch-iodide strips before doing vacuum distillations or heating cycles.",
        descAr: "سجل تواريخ فتح واستخدام المواد العضوية من فئة البيروكسيدات وافحص تركيزها تراكمياً بأشرطة النشا واليود دورياً لتلافي حدوث انفجارات عنيفة عند التسخين.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "warning"
      }
    ]
  },
  {
    id: "micro-l3",
    title: "Decontamination Protocols & Needle Safety",
    titleAr: "بروتوكولات التطهير والتعامل الآمن مع الأدوات الحادة",
    labType: "microbiology",
    duration: "4 min",
    durationAr: "٤ دقائق",
    category: "Waste & Sharp Control",
    categoryAr: "إدارة النفايات الحادة",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-scientist-working-with-a-microscope-40225-large.mp4",
    objectives: [
      "Recall proper disinfectant exposure times for clinical microbiology workbenches.",
      "Utilize puncture-proof biohazard sharps containers for needles and broken contaminated glass.",
      "Learn why syringe needles must never be recapped or bent after biological sampling."
    ],
    objectivesAr: [
      "تطبيق أوقات التلامس الكافية للمطهرات لضمان خلو أسطح العمل من البكتيريا والفيروسات المتبقية.",
      "استخدام حاويات الأدوات الحادة الصلبة المقاومة للثقب للتخلص الفوري من الإبر الملوثة والزجاج المكسور.",
      "استيعاب حظر إعادة تغطية الإبر المستعملة يدوياً أو التوائها لتلافي خطر وخزات التلوث البيولوجي الحاد."
    ],
    citation: "CDC/NIH Biosafety in Microbiological and Biomedical Laboratories (BMBL) - Safety Equipment Guidelines",
    citationAr: "دليل مراكز السيطرة على الأمراض CDC والمعاهد الوطنية للصحة BMBL لمعايير الحد من الإصابات الحادة",
    warning: {
      title: "Accidental Puncture Infection",
      titleAr: "عدوى وخز الإبر الملوثة العارض",
      text: "Sharps and needles are the highest source of pathogen transmission and body-fluid exposure. Always discard syringes immediately into high-density puncture-proof sharps boxes, and never attempt to recap using two hands.",
      textAr: "تعتبر الإبر والأدوات الحادة المصدر الأعلى عالمياً لنقل العدوى الميكروبية العارضة؛ تخلص منها فوراً في العبوات المخصصة المقاومة للثقب دون محاولة ثنيها أو إغلاقها يدوياً."
    },
    scenarioId: "scen-micro-1",
    cards: [
      {
        title: "Surface Decontamination Duration",
        titleAr: "زمن تلامس المطهرات الفعال",
        desc: "Deploy fresh 10% sodium hypochlorite (bleach) or 70% isopropyl alcohol onto workspace surfaces and allow a minimum of 10 minutes wet exposure time to guarantee full denaturing of resilient viral and biological cell membrane barriers.",
        descAr: "رُش محلول الكلور المخفف ١٠٪ أو كحول الأيزوبروبيل ٧٠٪ على كافة مساحة الأسطح، واتركه رطباً لمدة ١٠ دقائق متواصلة لضمان القضاء التام على الأغشية الفيروسية والبكتيرية الدقيقة.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Ws_vXiUBGC3A5HaY0hHRuLFISAfb2rnaYX4QxjXj3P4WGbnmJvo3tIV452A70yq7pliExxIOwz7gqGtV0dCLqMR4w8E-FC7ev9Y45tJNmoX5fktjHeYUc1Ra1jUZtmkl-HD3AcjUuzuP3OSbi4JyG9D0uWkCF_3UFUCmY5TJZAxqtWL6hLbY_Dysn4pEUfzHH86PrylqnUy7bMtDzgYZleE_ZYxw-nDQVZBNg_VoYrZXY-5BJ2rkL6Yoj6xHFXRKslblqCaXcuiG",
        iconType: "bio"
      },
      {
        title: "Sharps Box Discard Regulations",
        titleAr: "ضوابط تفريغ وسلة المخلفات الحادة",
        desc: "Place medical needles, lancets, scalpels, and microscopic slides directly into yellow or red puncture-resistant sharps containers. Once the container reaches 3/4 capacity, seal it permanently and forward for clinical incineration.",
        descAr: "تخلص من كافة الحقن والمراود الزجاجية والمشارط مباشرة بوضعها في الحاويات المقاومة للثقب بلونها الأصفر أو الأحمر؛ وعند بلوغ السعة ٣/٤ يجب إقفالها نهائياً لإرسالها للحرق الطبي الآمن.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "warning"
      }
    ]
  },
  {
    id: "water-l1",
    title: "Chlorine Gas Containment & Sodium Hypochlorite Safety",
    titleAr: "أنظمة احتواء غاز الكلور وسلامة هيبوكلوريت الصوديوم",
    labType: "water",
    duration: "5 min",
    durationAr: "٥ دقائق",
    category: "Disinfection Chemicals",
    categoryAr: "كيماويات التطهير",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chemical-pouring-in-a-laboratory-analytical-experiment-40227-large.mp4",
    objectives: [
      "Check safety parameters for concentrated gaseous and liquid chlorine disinfection handling.",
      "Respond to emergency chlorine leaks using ammonia indicator mist tests.",
      "Identify appropriate industrial respirators equipped with acid gas chemical cartridges."
    ],
    objectivesAr: [
      "مراقبة معايير أمان التعامل مع غاز الكلور السام والمحاليل المطهرة عالية التركيز في المحطات والوحدات.",
      "الاستجابة الفورية لتهريب وتطاير الغازات باختبار رذاذ الأمونيا الكاشف للثقوب بأنابيب الكلور.",
      "اختيار أقنعة التنفس الصناعية الملائمة والمزودة بمرشحات الغازات الكاوية والأبخرة الحمضية الخضراء."
    ],
    citation: "AWWA Standard G100-11 - Water Treatment Plant Operation & Safety Standards",
    citationAr: "معيار الجمعية الأمريكية لأعمال المياه AWWA G100-11 وإرشادات لوائح تحلية المياه الدولية",
    warning: {
      title: "Chlorine Vapor Inhalation Risk",
      titleAr: "مخاطر استنشاق غاز الكلور السام والخانق",
      text: "Gaseous chlorine reacts with respiratory moisture to spawn highly corrosive hydrochloric and hypochlorous acids in minutes. Work under positive air locks and wear full self-contained breathing apparatus (SCBA) in leak zones.",
      textAr: "يتفاعل الكلور غازياً بسرعة مع رطوبة الجهاز القصبى الرئوي مخلفاً أحماضاً حارقة تسبب تلف الخلايا الحيوية؛ لذا يفرض ارتداء أجهزة التنفس المستقلة المزودة باسطوانة هواء مضغوطة ذكية."
    },
    scenarioId: "scen-chem-1",
    cards: [
      {
        title: "Chlorine Leak Detection SOP",
        titleAr: "كشف تسرب غاز الكلور بالأمونيا",
        desc: "Chlorine fumes react with ammonia vapor to build dense, visible ammonium chloride white smoke. Squeeze plastic ammonia vapor squeeze canisters around pressure lines to easily trace micro-fissures in gas tank cylinders.",
        descAr: "تتفاعل أبخرة الكلور المتسللة فوراً مع بخار الأمونيا منتجة سحباً بيضاء قطيفة كثيفة؛ وجه بخاخ الأمونيا السائل حول الوصلات ومفاتيح الغاز لحصر التهريبات بدقة مجهرية.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
        iconType: "warning"
      },
      {
        title: "Confined Space Entry Standards",
        titleAr: "الأمان بالأماكن المغلقة والخزانات المظلمة",
        desc: "Ensure entry permits, multi-gas air meters, and safety body harnesses are deployed before descending into water vaults. Ventilation blowers must operate continuously to refresh toxic headspace gases.",
        descAr: "تأكد من تفعيل تصاريح الدخول، وفحص نسبة الأكسجين بثلاث مستويات بجهاز قياس الغازات المحمول، وربط حبل النجاة وحزام الجسم قبل نزول غرف الصمامات وفحص خزانات المعالجة.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Ws_vXiUBGC3A5HaY0hHRuLFISAfb2rnaYX4QxjXj3P4WGbnmJvo3tIV452A70yq7pliExxIOwz7gqGtV0dCLqMR4w8E-FC7ev9Y45tJNmoX5fktjHeYUc1Ra1jUZtmkl-HD3AcjUuzuP3OSbi4JyG9D0uWkCF_3UFUCmY5TJZAxqtWL6hLbY_Dysn4pEUfzHH86PrylqnUy7bMtDzgYZleE_ZYxw-nDQVZBNg_VoYrZXY-5BJ2rkL6Yoj6xHFXRKslblqCaXcuiG",
        iconType: "shield"
      }
    ]
  },
  {
    id: "petroleum-l1",
    title: "Hydrocarbon Volatility, Hydrogen Sulfide & Flashpoint Rules",
    titleAr: "مخاطر الغازات النفطية وكبريتيد الهيدروجين وجداول درجة الوميض",
    labType: "petroleum",
    duration: "5 min",
    durationAr: "٥ دقائق",
    category: "Hydrocarbon Safety",
    categoryAr: "أمان الهيدروكربونات والغازات",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chemical-pouring-in-a-laboratory-analytical-experiment-40227-large.mp4",
    objectives: [
      "Evaluate flashpoint limits and vapor density ratings for raw crude and heavy gasoline.",
      "Implement safety and personal protection rules for H2S hydrogen sulfide exposure (the silent killer).",
      "Identify high-risk ignition zones and understand non-sparking beryllium-copper tools protocols."
    ],
    objectivesAr: [
      "قياس وتحديد درجات درجة وميض المواد البترولية المخزنة ومستويات تبخرها الهيدروكربوني الساخن.",
      "حماية الباحثين والمهندسين من مخاطر غاز كبريتيد الهيدروجين H2S في منشآت الفرز والتكرير.",
      "استخدام عدد يدوية مقاومة لإحداث الشرر ومصنوعة من خامات برونز النحاس والبريليوم في مناطق التركيب والقياس."
    ],
    citation: "API Recommended Practice 49 - Safe Drilling and Operating with Hydrogen Sulfide",
    citationAr: "ممارسات معهد البترول الأمريكي الموصى بها API RP 49 للتشغيل في بيئات غاز H2S الفتاك",
    warning: {
      title: "H2S Olfactory Fatigue Danger",
      titleAr: "خطر تلف وشلل عصب الشم بكبريتيد الهيدروجين",
      text: "Hydrogen Sulfide (H2S) smells like rotten eggs at very low levels (1 ppm). At higher dangerous margins (>100 ppm), it instantly paralyzes your olfactory sensing tissue, making it impossible to smell the toxic trap.",
      textAr: "يملك غاز H2S رائحة تشبه البيض الفاسد بالتراكيز الدنيا، لكن فور تجاوزه عتبة ١٠٠ جزء بالمليون فإنه يسبب شللاً تاماً لعصب الشم فيتوهم الباحث تشتت الغاز بينما هو يتشبع بالسمية القاتلة."
    },
    scenarioId: "scen-chem-3",
    cards: [
      {
        title: "Hydrogen Sulfide Monitor Alerts",
        titleAr: "كواشف ومستشعرات غاز H2S الفردية",
        desc: "Clip single-gas H2S personal electronic monitors within 10 inches of your normal breathing path. The moment the sensor screams at 10 ppm, halt actions and immediately retreat upwind to safety.",
        descAr: "ثبّت مستشعر الغاز الإلكتروني الفردي على كتفك في نطاق تنفسك المباشر؛ وفي اللحظة التي تصرخ فيها صافرة الإنذار عند ١٠ جزء بالمليون توقف فوراً وغادر عكس اتجاه هبوب الرياح.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTnzgff77nk6_6y9vQBpre9dwSKj6S9dAFMrOVvwRjXrwlzrxIwkHOwxqzUL_Hsbz_oLF__-A2zja5ONjVfxYZuq5FweufU2llhmgW45MX0uy_M_P65WUuz30jgBwZprW56zDigmOOT_bF28l4US8XPyxSS3enx7gQZktiie809RUCs_cUJnBQOSRQktlgj5B-oiAEI4AnhfRywofmqrBMp2aOuqNVUIhUXKmJjgZofOyQbqcorVLmfrSXDL4oLW-vSIFh_q54HRG",
        iconType: "warning"
      },
      {
        title: "Non-Sparking Explosion Proof Tools",
        titleAr: "الاستعمال الفريضي للمعدات المقاومة للشرر",
        desc: "Standard steel mechanical wrenches generate hot electrostatic sparks when dropped or struck against steel pipeline flanges. Petroleum safety mandates solid Bronze, Brass, or Beryllium-Copper non-sparking materials.",
        descAr: "تولد أدوات الحديد العادية شرارات ساخنة كافية لإحداث كوارث نيران بأبخرة البترول المتطايرة؛ لذا يتم إلزام فني التكرير باستخدام عدد ومطارق ومفاتيح برونزية أو نحاسية آمنة تماماً ضد التكثيف الشراري.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_odtiS7RX6VUCwucTL2J07bHpiAi-GVTmMSafHD1f6mRaZb5OYfsMo63mcT-lcGmW9jnn6l57GZIodlhPKtFd5IDR7VxCP5FZMfmDh2X7Tr7og86HMQ4qGG5bZEp36d6BnMUQ1x1Itz-4vB2r7z8B3EQAkfX105RXRTU7DjO0jQhKq1-VcuyO0S_YuqYXw3W7l27Lac4pzkxDKKNrMdkgzkajfrfXvaQriQUWqc8jpySNof_Aun3aqJDDjanlG6zhmeAkgKwbMZIV",
        iconType: "shield"
      }
    ]
  }
];

export const REFERENCES_SYSTEM: ReferenceDocument[] = [
  {
    id: "ref-1",
    title: "Hydrochloric Acid (HCl) 37%",
    type: "SDS",
    description: "Complete safety data sheet including safe handling parameters, temperature storage, toxic vapors, and specialized emergency response procedures for concentrated corrosive HCl.",
    version: "v2.4",
    date: "Oct 2023",
    internal: false,
    source: "Sigma-Aldrich SDS",
    downloadable: true,
    url: "https://www.sigmaaldrich.com/US/en/product/sigald/h1758",
    pdfUrl: "https://www.purdue.edu/ehps/rem/documents/msds/hcl.pdf"
  },
  {
    id: "ref-2",
    title: "Ultracentrifuge Operation & Maintenance",
    type: "SOP",
    description: "Standard operating procedure for the Beckman Coulter Optima XE high-velocity system. Deeply covers rotor inspection, balancing procedures, safe vacuum run set-up, and emergency shutdown protocols.",
    version: "v1.1",
    date: "Jan 2024",
    internal: true,
    source: "Beckman Coulter Optima Manual",
    downloadable: true,
    url: "https://www.beckman.com/centrifuges/ultracentrifuges/optima-xe",
    pdfUrl: "https://bme.wisc.edu/wp-content/uploads/sites/1183/2020/09/Beckman-Coulter-Ultracentrifuge-SOP.pdf"
  },
  {
    id: "ref-3",
    title: "Hazard Communication Standard",
    type: "OSHA",
    description: "Comprehensive regulatory guidelines aligning strictly with the Globally Harmonized System (GHS) for chemical labeling container requirements, OSHA sheets, and safety right-to-know.",
    version: "29 CFR 1910.1200",
    date: "Revised 2022",
    internal: false,
    source: "US Department of Labor",
    downloadable: true,
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
    pdfUrl: "https://www.osha.gov/sites/default/files/laws-regs/federalregister/2012-03-26.pdf"
  },
  {
    id: "ref-4",
    title: "Biosafety Level 2 (BSL-2) Practices",
    type: "CDC",
    description: "BMBL 6th Edition requirements and biological safety recommendations for safe handling of moderate-risk clinically infectious cell-lines, culture media, and sample isolation controls.",
    version: "BMBL v6",
    date: "Dec 2020",
    internal: false,
    source: "CDC / NIH Publication",
    downloadable: true,
    url: "https://www.cdc.gov/labs/bmbl/CDC_AAref_Val=https://www.cdc.gov/labs/bmbl.html",
    pdfUrl: "https://www.cdc.gov/labs/pdf/SF__19_307521-A_Book_BMBL_6th_Edition_CPC_QA_508_v2.pdf"
  },
  {
    id: "ref-5",
    title: "Chemical Fume Hood Calibration Manual",
    type: "MANUAL",
    description: "Manufacturer engineering benchmarks and step-by-step air velocity calibration controls for standard laboratory negative pressure glass cabinets. Includes visual baffle test standards.",
    version: "LabC-900",
    date: "Nov 2023",
    internal: false,
    source: "LabConco Engineering",
    downloadable: true,
    url: "https://www.labconco.com/category/chemical-fume-hoods",
    pdfUrl: "https://ehs.fiu.edu/_resources/docs/chemical-safety/laboratory-fume-hood-safety-guide.pdf"
  },
  {
    id: "ref-6",
    title: "Nitric Acid (HNO3) 70%",
    type: "SDS",
    description: "Official GHS Safety Data Sheet detailing concentrated Nitric Acid hazard warnings, reactive zero-cellulose limits, dermal contact safeguards, and vapor ventilation protocols.",
    version: "v4.1",
    date: "Jan 2024",
    internal: false,
    source: "Merck Millipore SDS",
    downloadable: true,
    url: "https://www.sigmaaldrich.com/US/en/product/sigald/438073",
    pdfUrl: "https://www.purdue.edu/ehps/rem/documents/msds/nitric.pdf"
  },
  {
    id: "ref-7",
    title: "Biosafety Cabinet Class II Operation",
    type: "SOP",
    description: "Standard operating procedures for Microbiological Containment Hoods. Covers laminar flow rates, HEPA filtration recirculations, physical sash clearance, and biological swipe protocols.",
    version: "v2.0",
    date: "Mar 2024",
    internal: true,
    source: "Labconco Purifier Manual",
    downloadable: true,
    url: "https://www.labconco.com/category/biosafety-cabinets",
    pdfUrl: "https://www.cuanschutz.edu/docs/librariesprovider124/default-document-library/biological-safety-cabinets-selection-use-and-installation.pdf"
  },
  {
    id: "ref-8",
    title: "Occupational Chemical Exposure Standard",
    type: "OSHA",
    description: "The classic general laboratory standard requiring chemical hygiene plans, workplace threshold monitor limits, secure splash PPE safety wear, and immediate hazardous release guides.",
    version: "29 CFR 1910.1450",
    date: "Revised 2023",
    internal: false,
    source: "US Department of Labor",
    downloadable: true,
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1450",
    pdfUrl: "https://www.osha.gov/sites/default/files/publications/OSHA3404laboratory.pdf"
  },
  {
    id: "ref-9",
    title: "Disinfection & Biological Sterilization Guidelines",
    type: "CDC",
    description: "Authorized CDC/IC guidelines defining wet saturated autoclave thermodynamic parameters, sterile steam exposures (121°C/15 PSI), and biological indicator spore controls.",
    version: "CDC-2008",
    date: "Updated May 2019",
    internal: false,
    source: "Centers for Disease Control",
    downloadable: true,
    url: "https://www.cdc.gov/infection-control/hcp/disinfection-and-sterilization/?CDC_AAref_Val=https://www.cdc.gov/infectioncontrol/guidelines/disinfection/",
    pdfUrl: "https://www.cdc.gov/infection-control/media/pdfs/guideline-disinfection-h.pdf?CDC_AAref_Val=https://www.cdc.gov/infectioncontrol/pdf/guidelines/disinfection-guidelines-H.pdf"
  },
  {
    id: "ref-10",
    title: "Tuttnauer Sterilizer Maintenance & Operations",
    type: "MANUAL",
    description: "Mechanical autoclave validation manual mapping pressure chamber safety locks, steam-run cycles, biological spore indicator testing, and rapid discharge boil-over prevention.",
    version: "EL-Chamber",
    date: "Dec 2023",
    internal: false,
    source: "Tuttnauer Engineering",
    downloadable: true,
    url: "https://tuttnauer.com/laboratory-autoclaves",
    pdfUrl: "https://ehs.cornell.edu/sites/default/files/autoclave_guidelines.pdf"
  }
];

export const ARABIC_DICTIONARY = {
  appName: "لاب سيف",
  tagline: "تعلم سلامة المختبرات من خلال سيناريوهات حقيقية",
  skip: "تخطي",
  continue: "متابعة",
  welcomeTitle: "مرحباً بك في لابسيف",
  welcomeSub: "منصة تعليمية تفاعلية وإرشادية للسلامة في المختبرات العلمية.",
  learnTitle: "التعلم بالممارسة والتطبيق",
  learnSub: "عش تجربة واقعية مع سيناريوهات المختبر، واحصل على ملاحظات فورية مبنية على معايير علمية صارمة.",
  miniLessons: "دروس مصغرة",
  interScen: "سيناريوهات تفاعلية",
  instFeed: "ملاحظات فورية",
  masterTitle: "احترف سلامة المختبرات",
  masterSub: "اكتسب نقاط الخبرة (XP)، وافتح شارات معتمدة، وابنِ ملفك التعريفي كخبير سلامة محترف.",
  initializing: "جاري الحف وتجهيز المهد",
  getStarted: "ابدأ الآن",
  signIn: "تسجيل الدخول",
  forgot: "نسيت؟",
  emailLabel: "البريد الإلكتروني للمؤسسة",
  passLabel: "كلمة المرور",
  continueGuest: "الدخول كزائر",
  createAccount: "إنشاء حساب",
  ecrNote: "اتصال آمن ومشفّر بالكامل",
  greeting: "صباح الخير، أحمد",
  dashboardSub: "هل أنت مستعد لفحوصات السلامة اليوم؟",
  streak: "أيام متتالية",
  dailyChallenge: "التحدي اليومي",
  dailyChallengeSub: "اختبر سرعة استجابتك في سيناريو افتراضي لانسكاب حامض كيميائي المركب.",
  resumeLesson: "استئناف الدرس",
  recommended: "دروس موصى بها",
  viewAll: "عرض الكل",
  currentTopic: "المادة الكيميائية النشطة",
  progress: "التقدم الحالي",
  xpToNext: "نقطة للمستوى التالي",
  recentActivity: "النشاطات الأخيرة",
  generalSafety: "قواعد السلامة العامة",
  chemHandling: "التعامل الكيميائي",
  biohazard: "المخاطر البيولوجية",
  fireProcedures: "إجراءات الحريق",
  themeSettings: "إعدادات المظهر",
  lightMode: "الوضع المضيء",
  darkMode: "الوضع الداكن",
  systemDefault: "تلقائي حسب النظام",
  searchPlaceholder: "ابحث عن البروتوكولات، أوراق السلامة، والمعايير..."
};
