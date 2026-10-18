import { Country, SearchPreset } from "./types";

export const COUNTRIES: Country[] = [
  { 
    name: "南美区域混合搜索 (除巴西)", 
    code: "REGION_SA_EX_BR", 
    prefix: "南美混合", 
    localLanguage: "Spanish", 
    nativeName: "South America (ex. Brazil)",
    isRegion: true,
    countriesInRegion: ["Argentina", "Colombia", "Peru", "Chile", "Ecuador", "Venezuela", "Bolivia"]
  },
  { 
    name: "中东区域混合搜索 (除伊朗)", 
    code: "REGION_ME_EX_IR", 
    prefix: "中东混合", 
    localLanguage: "Arabic", 
    nativeName: "Middle East (ex. Iran)",
    isRegion: true,
    countriesInRegion: ["Saudi Arabia", "UAE", "Egypt", "Iraq", "Jordan", "Libya"]
  },
  { 
    name: "亚洲区域混合搜索 (除越泰菲印)", 
    code: "REGION_AS_EX_VTP", 
    prefix: "亚洲混合", 
    localLanguage: "English/Malay/Bengali/Urdu", 
    nativeName: "Asia (ex. VN/TH/PH/IN)",
    isRegion: true,
    countriesInRegion: ["Indonesia", "Pakistan", "Bangladesh", "Malaysia"]
  },
  { name: "印度", code: "IN", prefix: "+91", localLanguage: "Hindi", nativeName: "India" },
  { name: "印度尼西亚", code: "ID", prefix: "+62", localLanguage: "Indonesian", nativeName: "Indonesia" },
  { name: "巴基斯坦", code: "PK", prefix: "+92", localLanguage: "Urdu", nativeName: "Pakistan" },
  { name: "尼日利亚", code: "NG", prefix: "+234", localLanguage: "English", nativeName: "Nigeria" },
  { name: "巴西", code: "BR", prefix: "+55", localLanguage: "Portuguese", nativeName: "Brazil" },
  { name: "阿根廷", code: "AR", prefix: "+54", localLanguage: "Spanish", nativeName: "Argentina" },
  { name: "孟加拉国", code: "BD", prefix: "+880", localLanguage: "Bengali", nativeName: "Bangladesh" },
  { name: "俄罗斯", code: "RU", prefix: "+7", localLanguage: "Russian", nativeName: "Russia" },
  { name: "墨西哥", code: "MX", prefix: "+52", localLanguage: "Spanish", nativeName: "Mexico" },
  { name: "埃塞俄比亚", code: "ET", prefix: "+251", localLanguage: "Amharic", nativeName: "Ethiopia" },
  { name: "菲律宾", code: "PH", prefix: "+63", localLanguage: "Tagalog", nativeName: "Philippines" },
  { name: "埃及", code: "EG", prefix: "+20", localLanguage: "Arabic", nativeName: "Egypt" },
  { name: "利比亚", code: "LY", prefix: "+218", localLanguage: "Arabic", nativeName: "Libya" },
  { name: "越南", code: "VN", prefix: "+84", localLanguage: "Vietnamese", nativeName: "Vietnam" },
  { name: "刚果金", code: "CD", prefix: "+243", localLanguage: "French", nativeName: "DR Congo" },
  { name: "土耳其", code: "TR", prefix: "+90", localLanguage: "Turkish", nativeName: "Turkey" },
  { name: "伊朗", code: "IR", prefix: "+98", localLanguage: "Persian", nativeName: "Iran" },
  { name: "泰国", code: "TH", prefix: "+66", localLanguage: "Thai", nativeName: "Thailand" },
  { name: "坦桑尼亚", code: "TZ", prefix: "+255", localLanguage: "Swahili", nativeName: "Tanzania" },
  { name: "南非", code: "ZA", prefix: "+27", localLanguage: "English", nativeName: "South Africa" },
  { name: "肯尼亚", code: "KE", prefix: "+254", localLanguage: "Swahili", nativeName: "Kenya" },
  { name: "缅甸", code: "MM", prefix: "+95", localLanguage: "Burmese", nativeName: "Myanmar" },
  { name: "哥伦比亚", code: "CO", prefix: "+57", localLanguage: "Spanish", nativeName: "Colombia" },
  { name: "乌干达", code: "UG", prefix: "+256", localLanguage: "English", nativeName: "Uganda" },
  { name: "苏丹", code: "SD", prefix: "+249", localLanguage: "Arabic", nativeName: "Sudan" },
  { name: "阿尔及利亚", code: "DZ", prefix: "+213", localLanguage: "Arabic", nativeName: "Algeria" },
  { name: "伊拉克", code: "IQ", prefix: "+964", localLanguage: "Arabic", nativeName: "Iraq" },
  { name: "阿富汗", code: "AF", prefix: "+93", localLanguage: "Pashto", nativeName: "Afghanistan" },
  { name: "摩洛哥", code: "MA", prefix: "+212", localLanguage: "Arabic", nativeName: "Morocco" },
  { name: "沙特阿拉伯", code: "SA", prefix: "+966", localLanguage: "Arabic", nativeName: "Saudi Arabia" },
  { name: "安哥拉", code: "AO", prefix: "+244", localLanguage: "Portuguese", nativeName: "Angola" },
  { name: "乌兹别克斯坦", code: "UZ", prefix: "+998", localLanguage: "Uzbek", nativeName: "Uzbekistan" },
  { name: "也门", code: "YE", prefix: "+967", localLanguage: "Arabic", nativeName: "Yemen" },
  { name: "秘鲁", code: "PE", prefix: "+51", localLanguage: "Spanish", nativeName: "Peru" },
  { name: "马来西亚", code: "MY", prefix: "+60", localLanguage: "Malay", nativeName: "Malaysia" },
  { name: "加纳", code: "GH", prefix: "+233", localLanguage: "English", nativeName: "Ghana" },
  { name: "莫桑比克", code: "MZ", prefix: "+258", localLanguage: "Portuguese", nativeName: "Mozambique" },
  { name: "尼泊尔", code: "NP", prefix: "+977", localLanguage: "Nepali", nativeName: "Nepal" },
  { name: "马达加斯加", code: "MG", prefix: "+261", localLanguage: "French", nativeName: "Madagascar" },
  { name: "委内瑞拉", code: "VE", prefix: "+58", localLanguage: "Spanish", nativeName: "Venezuela" },
  { name: "喀麦隆", code: "CM", prefix: "+237", localLanguage: "French", nativeName: "Cameroon" },
  { name: "尼日尔", code: "NE", prefix: "+227", localLanguage: "French", nativeName: "Niger" },
  { name: "马里", code: "ML", prefix: "+223", localLanguage: "French", nativeName: "Mali" },
  { name: "布基纳法索", code: "BF", prefix: "+226", localLanguage: "French", nativeName: "Burkina Faso" },
  { name: "斯里兰卡", code: "LK", prefix: "+94", localLanguage: "Sinhala", nativeName: "Sri Lanka" },
  { name: "赞比亚", code: "ZM", prefix: "+260", localLanguage: "English", nativeName: "Zambia" },
  { name: "哈萨克斯坦", code: "KZ", prefix: "+7", localLanguage: "Kazakh", nativeName: "Kazakhstan" },
  { name: "智利", code: "CL", prefix: "+56", localLanguage: "Spanish", nativeName: "Chile" },
  { name: "马拉维", code: "MW", prefix: "+265", localLanguage: "English", nativeName: "Malawi" },
  { name: "厄瓜多尔", code: "EC", prefix: "+593", localLanguage: "Spanish", nativeName: "Ecuador" },
  { name: "危地马拉", code: "GT", prefix: "+502", localLanguage: "Spanish", nativeName: "Guatemala" },
  { name: "塞内加尔", code: "SN", prefix: "+221", localLanguage: "French", nativeName: "Senegal" },
  { name: "柬埔寨", code: "KH", prefix: "+855", localLanguage: "Khmer", nativeName: "Cambodia" },
  { name: "乍得", code: "TD", prefix: "+235", localLanguage: "French", nativeName: "Chad" },
  { name: "索马里", code: "SO", prefix: "+252", localLanguage: "Somali", nativeName: "Somalia" },
  { name: "津巴布韦", code: "ZW", prefix: "+263", localLanguage: "English", nativeName: "Zimbabwe" },
  { name: "几内亚", code: "GN", prefix: "+224", localLanguage: "French", nativeName: "Guinea" },
  { name: "卢旺达", code: "RW", prefix: "+250", localLanguage: "Kinyarwanda", nativeName: "Rwanda" },
  { name: "贝宁", code: "BJ", prefix: "+229", localLanguage: "French", nativeName: "Benin" },
  { name: "突尼斯", code: "TN", prefix: "+216", localLanguage: "Arabic", nativeName: "Tunisia" },
  { name: "玻利维亚", code: "BO", prefix: "+591", localLanguage: "Spanish", nativeName: "Bolivia" },
  { name: "海地", code: "HT", prefix: "+509", localLanguage: "French", nativeName: "Haiti" },
  { name: "约旦", code: "JO", prefix: "+962", localLanguage: "Arabic", nativeName: "Jordan" },
  { name: "阿联酋", code: "AE", prefix: "+971", localLanguage: "Arabic", nativeName: "UAE" },
];

export const SEARCH_PRESETS: SearchPreset[] = [
  {
    category: "Generator Controllers",
    keywords: [
      "DGS6120N Controller", "DGS6110N Controller", "DSE702AS Controller", "DSE890MKII Controller", 
      "HGM1970N Controller", "EIM BASIC 258-9753", "EIM BASIC 258-9755", "DKG105 Controller", "DKG307 Controller",
      "DSE6020 MKII", "DSE7320 MKII", "DSE3110", "DSE4520 MKII", "DSE7420", "DSE8610 MKII",
      "HGM410 Controller", "HGM420 Controller", "HGM6110 Controller", "HGM6120 Controller", "HGM9510 Controller",
      "ComAp MRS10", "ComAp MRS16", "ComAp AMF20", "ComAp AMF25",
      "Deepsea DSE7320", "Deepsea DSE6110", "Deepsea DSE4520", "SmartGen HGM6110",
      "HAT520 Controller", "HAT530 Controller", "HAT630 Controller", "D300-MK3 Controller"
    ],
  },
  {
    category: "Automatic Voltage Regulators (AVR)",
    keywords: [
      "Stamford AVR", "SX460 AVR", "SX440 AVR", "AS440 AVR", "AS480 AVR", "MX321 AVR", "MX341 AVR", "MX350 AVR",
      "Leroy Somer R230", "Leroy Somer R250", "Leroy Somer R438", "Leroy Somer R448", "Leroy Somer R450", "Leroy Somer R120", "Leroy Somer R180",
      "Denyo AN-5-203", "Denyo NTA-5A-2D",
      "Caterpillar VR6", "Caterpillar VR3",
      "Mecc Alte UVR6", "Mecc Alte SR7-2G", "Mecc Alte DSR", "Mecc Alte DER1",
      "Marelli M40FA640A", "Marelli M16FA655A",
      "Marathon DVR2000E+", "Marathon SE350", "SE350 AVR",
      "Basler AVC63-7", "Basler AVC63-4", "Basler VR6",
      "GAVR-8A Regulator", "GAVR-15A Regulator", "GAVR-20A Regulator"
    ],
  },
  {
    category: "Rectifiers & Diode Kits",
    keywords: [
      "RSK5001 Rectifier", "RSK1101 Rectifier", "RSK6001 Rectifier", "MXG(Y)50-15 Module", 
      "SSAYEC432 Diode", "330-25777 Rectifier", "LSA50.1 Diode Kit", "LSA51.2 Diode Kit",
      "Rotary Diode Kit", "Varistor Diode Module"
    ],
  },
  {
    category: "Engine Speed Governors & Control Modules",
    keywords: [
      "ESD5500E Speed Governor", "ESD5111 Speed Governor", "ESD5550E Speed Governor", "ESD5221 Speed Governor",
      "ADC120-12V Actuator", "ADC120-24V Actuator", "3408324 Actuator", "3044196 Actuator",
      "S6700H Speed Governor", "Magnetic Pickup Sensor", "Oil Pressure Sensor", "Water Temp Sensor", "Diode Kit"
    ],
  },
  {
    category: "Battery Charger Series",
    keywords: [
      "CH2810 Charger", "BA-5A-P Charger",
      "BAC06A Charger", "BAC2410 Charger", "BAC1210 Charger", 
      "DSE9150 Charger", "DSE9255 Charger", "DSE9470 Charger"
    ],
  },
  {
    category: "Solenoid Valve Series",
    keywords: [
      "3991624 Solenoid", "3991167 Solenoid", "4946639 Solenoid", "3921978 Solenoid", 
      "SA-3838 Solenoid", "A044F796 Solenoid", "3932545 Solenoid", "3930233 Solenoid", 
      "3932017 Solenoid", "SA-5174 Solenoid", "2001-12S6U1B5S1A Solenoid"
    ],
  },
  {
    category: "Business Identity & Industry",
    keywords: [
      "Generator Repair Workshop", "Diesel Engine Service", "Power Plant Maintenance", 
      "Electrical Spare Parts Dealer", "Industrial Machinery Importer", "Generator Rental Fleet",
      "Generator Spare Parts Wholesaler", "Diesel Engine Overhaul Center", "Power Generation Equipment Distributor",
      "AVR & Controller Specialist", "Genset Assembly Plant", "Marine Diesel Engine Repair",
      "Electrical Control Panel Manufacturer", "Heavy Machinery Spare Parts Trading"
    ],
  },
  {
    category: "Engine Models & Brands",
    keywords: [
      "PERKINS 403D-15", "PERKINS 404D-22", "PERKINS 1103C-33", "PERKINS 1104C-44", 
      "PERKINS 2206C Engine", "PERKINS 2506C Engine", "Cummins 4BT Engine", "Cummins 6BT Engine", 
      "Cummins 6CT Engine", "Cummins NT855 Parts", "Cummins KTA19 Parts", "Cummins KTA38 Parts", 
      "Cummins KTA50 Parts", "Weichai Engine Parts", "Volvo Penta Generator", "Ricardo Engine Service", 
      "Kubota Engine Maintenance"
    ],
  },
];
