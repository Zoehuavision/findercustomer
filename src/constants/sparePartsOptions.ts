export interface SparePartCategory {
  id: string;
  categoryName: string;
  iconName: string;
  items: string[];
}

export interface SparePartPreset {
  id: string;
  title: string;
  badge: string;
  description: string;
  items: string[];
}

export const SPARE_PARTS_CATEGORIES: SparePartCategory[] = [
  {
    id: "control_protection",
    categoryName: "发电机电控与自动化系统",
    iconName: "Cpu",
    items: [
      "发电机微电脑控制器(深海DSE/众智SmartGen/科迈ComAp)",
      "双电源自动转换开关ATS控制器",
      "发电机并机并网控制屏与同步器",
      "柴油机故障自动报警与停机保护模块"
    ]
  },
  {
    id: "avr_excitation",
    categoryName: "励磁系统与AVR自动稳压板",
    iconName: "Zap",
    items: [
      "AVR自动电压调节板(SX460/AS440/MX321/R250/GAVR)",
      "发电机旋转整流桥模块与高压二极管",
      "无刷交流发电机励磁机转子/定子组件",
      "发电机励磁升压变压器与压敏电阻"
    ]
  },
  {
    id: "governor_actuator",
    categoryName: "电子调速与执行驱动系统",
    iconName: "Gauge",
    items: [
      "电子调速器控制板(ESD5500E/ESD5111/EG2000)",
      "电子执行器(Actuator ADC120/ADC225/3408324)",
      "柴油发动机磁电式转速传感器(MPU Speed Sensor)",
      "电子油门执行马达与连杆总成"
    ]
  },
  {
    id: "charger_starting",
    categoryName: "电源管理与机组起动系统",
    iconName: "BatteryCharging",
    items: [
      "智能蓄电池浮充电器(12V/24V BAC06A/SmartGen)",
      "发电机专用起动马达(Starter Motor 12V/24V)",
      "重型起动继电器与主接触器",
      "机组蓄电池切断开关与电源监控模块"
    ]
  },
  {
    id: "engine_overhaul",
    categoryName: "柴油机大修配件与易损机械件",
    iconName: "Wrench",
    items: [
      "珀金斯Perkins柴油机配件与大修包(1100/2000系列)",
      "康明斯Cummins发动机配件(4BT/6BT/NT855/KTA19)",
      "卡特彼勒CAT / 沃尔沃Volvo Penta柴油机备件",
      "停机断油电磁阀(12V/24V Fuel Shutoff Solenoid)",
      "螺纹式机油压力传感器 / 发动机水温感应塞",
      "发电机专用散热水箱(Radiator)与机械中冷器",
      "发电机维保三滤耗材(柴油滤/机油滤/空滤芯)"
    ]
  },
  {
    id: "genset_assembly",
    categoryName: "整机成套组装与静音箱附件",
    iconName: "Factory",
    items: [
      "柴油发电机组装配成套(10kVA - 2000kVA)",
      "静音发电机防雨静音箱重型门锁与铰链",
      "发电机高弹橡胶避震垫(Anti-Vibration Mounts)",
      "发电机排气波纹消音器与烟道配件"
    ]
  }
];

export const SPARE_PARTS_PRESETS: SparePartPreset[] = [
  {
    id: "preset_full_electrical",
    title: "⚡ 核心电气电控全套方案",
    badge: "高利润高流转",
    description: "涵盖控制器、AVR稳压板、整流模块及智能充电器，机修与组装厂刚需",
    items: [
      "发电机微电脑控制器(深海DSE/众智SmartGen/科迈ComAp)",
      "AVR自动电压调节板(SX460/AS440/MX321/R250/GAVR)",
      "发电机旋转整流桥模块与高压二极管",
      "智能蓄电池浮充电器(12V/24V BAC06A/SmartGen)",
      "双电源自动转换开关ATS控制器"
    ]
  },
  {
    id: "preset_quick_consumables",
    title: "🛠️ 机修易损高频耗材方案",
    badge: "回购率极高",
    description: "涵盖电磁阀、传感器、调速器、执行器与滤清耗材，售后维修必备",
    items: [
      "停机断油电磁阀(12V/24V Fuel Shutoff Solenoid)",
      "螺纹式机油压力传感器 / 发动机水温感应塞",
      "电子调速器控制板(ESD5500E/ESD5111/EG2000)",
      "电子执行器(Actuator ADC120/ADC225/3408324)",
      "柴油发动机磁电式转速传感器(MPU Speed Sensor)"
    ]
  },
  {
    id: "preset_engine_overhaul",
    title: "🔩 康明斯/珀金斯大修方案",
    badge: "大修厂首选",
    description: "专攻海外重型柴油机翻新维修车间，面向发动机总成与零配件批发商",
    items: [
      "珀金斯Perkins柴油机配件与大修包(1100/2000系列)",
      "康明斯Cummins发动机配件(4BT/6BT/NT855/KTA19)",
      "发电机专用散热水箱(Radiator)与机械中冷器",
      "发电机维保三滤耗材(柴油滤/机油滤/空滤芯)"
    ]
  },
  {
    id: "preset_genset_complete",
    title: "🏭 成套组装与控制柜方案",
    badge: "OEM配套",
    description: "面向当地组装厂商与系统集成商，供应控制器、并机柜及静音箱配件",
    items: [
      "柴油发电机组装配成套(10kVA - 2000kVA)",
      "发电机并机并网控制屏与同步器",
      "静音发电机防雨静音箱重型门锁与铰链",
      "发电机高弹橡胶避震垫(Anti-Vibration Mounts)",
      "发电机微电脑控制器(深海DSE/众智SmartGen/科迈ComAp)"
    ]
  }
];
