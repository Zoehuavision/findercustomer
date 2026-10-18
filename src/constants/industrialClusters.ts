export interface IndustrialClusterBenchmark {
  id: string;
  region: "中东" | "非洲" | "东南亚" | "拉美" | "南亚";
  country: string;
  city: string;
  clusterName: string;
  famousStreetOrPark: string;
  representativeSeedCompany: string;
  seedAddress: string;
  marketBackground: string;
  recommendedFocus: string;
  hotFeatures: string[];
  phoneNumber?: string;
  website?: string;
}

export const INDUSTRIAL_CLUSTER_BENCHMARKS: IndustrialClusterBenchmark[] = [
  // ========== 中东 (Middle East) ==========
  {
    id: "cluster-uae-alquoz",
    region: "中东",
    country: "阿联酋 (UAE)",
    city: "迪拜 (Dubai)",
    clusterName: "Al Quoz 4号机电重工区",
    famousStreetOrPark: "Al Quoz Industrial Area 4, Street 15 / 22",
    representativeSeedCompany: "Al-Futtaim Auto & Machinery (FAMCO)",
    seedAddress: "Street 15, Al Quoz Industrial Area 4, Dubai, UAE",
    phoneNumber: "+971506582914",
    website: "https://www.al-futtaim.com",
    marketBackground: "中东最大转口与工程机械集散地，聚集了数百家康明斯/珀金斯大修厂、备件贸易商及发电机组装厂。",
    recommendedFocus: "Perkins/Cummins发电机组配件、深海控制器(Deepsea)、AVR稳压板、整流模块及二极管",
    hotFeatures: ["转口贸易枢纽", "重型柴油机维修中心", "发电机组装与租赁"]
  },
  {
    id: "cluster-saudi-riyadh",
    region: "中东",
    country: "沙特阿拉伯 (Saudi Arabia)",
    city: "利雅得 (Riyadh)",
    clusterName: "第二工业城 (2nd Industrial City)",
    famousStreetOrPark: "2nd Industrial City, Street 67 / 198",
    representativeSeedCompany: "Jubaili Bros SAL",
    seedAddress: "Street 67, 2nd Industrial City, Riyadh, Saudi Arabia",
    phoneNumber: "+966506213492",
    website: "https://www.jubailibros.com",
    marketBackground: "沙特基建与油气开采核心动力装备产业区，发电机成套厂与控制柜分销商极为密集。",
    recommendedFocus: "发电机并机控制器(ComAp/Deif/SmartGen)、AVR自动电压调节板、发电机散热水箱及滤清器",
    hotFeatures: ["大型油气发电机配套", "并网并机控制系统", "原厂发电机备件分销"]
  },
  {
    id: "cluster-iraq-baghdad",
    region: "中东",
    country: "伊拉克 (Iraq)",
    city: "巴格达 (Baghdad)",
    clusterName: "Sheikh Omar 发电机汽配机械街",
    famousStreetOrPark: "Sheikh Omar Street (شارع الشيخ عمر), Rusafa District",
    representativeSeedCompany: "Al-Muhandis Generator & Power Solutions",
    seedAddress: "Sheikh Omar Street, Near Industrial Market, Baghdad, Iraq",
    phoneNumber: "+9647701284931",
    website: "",
    marketBackground: "伊拉克全国最大的发电机及机电零配件集中批发市场，全街数百家商铺专门批发发电机配件与二手柴油机。",
    recommendedFocus: "发电机控制器(众智SmartGen/深海Deepsea)、无刷AVR(SX460/AS440/GAVR)、浮充电器、停机电磁阀",
    hotFeatures: ["全伊拉克配件集散中心", "柴油机高频维修", "控制器与AVR消耗极大"]
  },

  // ========== 非洲 (Africa) ==========
  {
    id: "cluster-nigeria-lagos",
    region: "非洲",
    country: "尼日利亚 (Nigeria)",
    city: "拉各斯 (Lagos)",
    clusterName: "Ikeja / Ogba 动力工业区与机电市场",
    famousStreetOrPark: "Acme Road & Lateef Jakande Rd, Agidingbi / Ogba Industrial Estate",
    representativeSeedCompany: "Mikano International Limited",
    seedAddress: "Plot 8, Acme Road, Ogba Industrial Estate, Ikeja, Lagos, Nigeria",
    phoneNumber: "+2348033002314",
    website: "https://www.mikanointernational.com",
    marketBackground: "西非最大发电机需求国，电网脆弱，几乎所有工厂和住宅必备柴油发电机，配件消耗量巨大。",
    recommendedFocus: "珀金斯Perkins 1100/2000系列配件、深海DSE控制器、斯坦福/利莱森玛AVR、硅整流桥与机油泵",
    hotFeatures: ["西非发电机第一大市场", "高频维保配件消耗", "组装厂与大型维修车间林立"]
  },
  {
    id: "cluster-kenya-nairobi",
    region: "非洲",
    country: "肯尼亚 (Kenya)",
    city: "内罗毕 (Nairobi)",
    clusterName: "Industrial Area 机电产业带",
    famousStreetOrPark: "Enterprise Road & Commercial Street, Industrial Area",
    representativeSeedCompany: "Ryce East Africa Limited",
    seedAddress: "Enterprise Road, Industrial Area, Nairobi, Kenya",
    phoneNumber: "+254722819452",
    website: "https://www.ryce.co.ke",
    marketBackground: "东非工业与商业中心，辐射乌干达、卢旺达、坦桑尼亚，重型机械与发电机维修代理商扎堆此街区。",
    recommendedFocus: "柴油发电机组装配、自动转换开关ATS柜、蓄电池充电器、稳压板AVR及柴油泵滤芯",
    hotFeatures: ["辐射东非多国枢纽", "重机修造产业聚集", "ATS切换与控制柜配套需求旺"]
  },
  {
    id: "cluster-southafrica-joburg",
    region: "非洲",
    country: "南非 (South Africa)",
    city: "约翰内斯堡 (Johannesburg)",
    clusterName: "Jet Park / Alrode 重工产业带",
    famousStreetOrPark: "Jet Park Industrial Estate, Boksburg / Alrode, Germiston",
    representativeSeedCompany: "Barloworld Power (Cat & Perkins)",
    seedAddress: "Kelly Road, Jet Park, Boksburg, Johannesburg, South Africa",
    phoneNumber: "+27824593821",
    website: "https://www.barloworld-equipment.com",
    marketBackground: "受限电(Load Shedding)影响，南非矿山、数据中心和商业极为依赖柴油发电机，维修配件需求持续高涨。",
    recommendedFocus: "康明斯/卡特发电机备件、电控调速板(Governor)、执行器、并联控制器及电球整流二极管",
    hotFeatures: ["限电刚需备用电源", "矿用大功率发电机", "高端发电机控制系统"]
  },
  {
    id: "cluster-egypt-cairo",
    region: "非洲",
    country: "埃及 (Egypt)",
    city: "吉萨/开罗 (Cairo/Giza)",
    clusterName: "十月六日城工业区 (6th of October)",
    famousStreetOrPark: "Industrial Zone 3, 6th of October City, Giza",
    representativeSeedCompany: "Orascom Power & Generator Systems",
    seedAddress: "Central Axis, Industrial Zone 3, 6th of October City, Egypt",
    phoneNumber: "+201008472915",
    website: "https://www.orascom.com",
    marketBackground: "北非最大制造基地之一，集中了大量机电成套厂、工业发电机组装配与发电机租赁服务商。",
    recommendedFocus: "柴油机大修套件、发电机微电脑控制模块、调压板、电磁切断阀及并机柜成套配件",
    hotFeatures: ["北非制造业核心", "工业园区规模巨大", "外贸进口采购密集"]
  },

  // ========== 东南亚 (Southeast Asia) ==========
  {
    id: "cluster-indonesia-jakarta",
    region: "东南亚",
    country: "印度尼西亚 (Indonesia)",
    city: "雅加达 (Jakarta)",
    clusterName: "Glodok LTC 机械五金电气批发街区",
    famousStreetOrPark: "Jl. Hayam Wuruk, Lindeteves Trade Center (LTC Glodok)",
    representativeSeedCompany: "PT. Triputra Power Mandiri",
    seedAddress: "LTC Glodok Lt. GF2, Jl. Hayam Wuruk No.127, West Jakarta, Indonesia",
    phoneNumber: "+6281289012345",
    website: "",
    marketBackground: "印尼最著名的五金、发电机配件、电球及柴油机批发第一集散地，成百上千家机电贸易商聚集。",
    recommendedFocus: "发电机整流桥模块、通用AVR(SX460/GAVR-15A)、自动水温油压传感器、众智SmartGen控制器",
    hotFeatures: ["印尼最大机电现货市场", "千岛群岛矿山电力采购点", "配件批发档口林立"]
  },
  {
    id: "cluster-vietnam-hcmc",
    region: "东南亚",
    country: "越南 (Vietnam)",
    city: "胡志明市 (HCMC)",
    clusterName: "第5郡 Tạ Uyên 机械五金柴油机街",
    famousStreetOrPark: "Đường Tạ Uyên, Phường 15, Quận 5, TP. Hồ Chí Minh",
    representativeSeedCompany: "Công Ty Cơ Điện & Máy Phát Điện Nam Nguyên",
    seedAddress: "Đường Tạ Uyên, Phường 15, Quận 5, TP. Hồ Chí Minh, Vietnam",
    phoneNumber: "+84903128945",
    website: "",
    marketBackground: "越南华人和越南本土最大机械五金与柴油机发电机配件街，整条街全是发动机水泵、电机配件店铺与维修店。",
    recommendedFocus: "发电机微电脑控制器、AVR电压调节板、起动继电器、浮动充电器及柴油机缸套活塞",
    hotFeatures: ["著名五金柴油机一条街", "现货批发与维修结合", "制造业转移红利"]
  },
  {
    id: "cluster-philippines-manila",
    region: "东南亚",
    country: "菲律宾 (Philippines)",
    city: "马尼拉 (Manila)",
    clusterName: "Binondo 华人机电五金区 & Valenzuela工业带",
    famousStreetOrPark: "Soler Street & Tomas Mapua St, Binondo / Valenzuela",
    representativeSeedCompany: "Powertech Industrial Sales Inc.",
    seedAddress: "Soler St, Binondo, Manila, Metro Manila, Philippines",
    phoneNumber: "+639178392011",
    website: "",
    marketBackground: "马尼拉老牌机电进出口集散区，岛国台风频发，备用柴油发电机及维保配件需求极其稳定。",
    recommendedFocus: "斯坦福Stamford发电机配件、深海控制器、AVR稳压板、转子整流二极管模块",
    hotFeatures: ["岛屿离网发电需求", "台风季节备用电源", "成熟华人五金商会渠道"]
  },

  // ========== 拉美 (Latin America) ==========
  {
    id: "cluster-argentina-bsas",
    region: "拉美",
    country: "阿根廷 (Argentina)",
    city: "布宜诺斯艾利斯 (Buenos Aires)",
    clusterName: "San Martín 机电与工业走廊",
    famousStreetOrPark: "Av. 25 de Mayo & Ruta 8, General San Martín",
    representativeSeedCompany: "Motores Diésel San Martín S.A.",
    seedAddress: "Av. 25 de Mayo 1200, San Martín, Buenos Aires, Argentina",
    phoneNumber: "+5491158204912",
    website: "",
    marketBackground: "阿根廷重工制造与柴油发动机翻新维修第一重镇，聚集了大量的机电加工厂与柴油机配件进口商。",
    recommendedFocus: "柴油机重组翻新配件、发电机数字控制器、自动稳压板AVR、电池充电器与电磁阀",
    hotFeatures: ["柴油机大修之都", "农用与工业发电机制造", "进口配件分销中心"]
  },
  {
    id: "cluster-mexico-monterrey",
    region: "拉美",
    country: "墨西哥 (Mexico)",
    city: "蒙特雷 (Monterrey)",
    clusterName: "Apodaca 工业制造重镇",
    famousStreetOrPark: "Parque Industrial Monterrey, Apodaca, Nuevo León",
    representativeSeedCompany: "Generadores y Motores de México S.A.",
    seedAddress: "Av. Industrial 500, Parque Industrial Monterrey, Apodaca, Mexico",
    phoneNumber: "+528183749215",
    website: "",
    marketBackground: "墨西哥北部制造业心脏，紧邻美墨边境，汇聚了大量欧美工业品牌配套发电机组装厂与维修中心。",
    recommendedFocus: "重型工业备件、并网控制器、高精度AVR调压板、电涡流阻尼整流组件",
    hotFeatures: ["美墨近岸制造中心", "跨国制造业发电机配套", "重型电控配件采购量大"]
  },
  {
    id: "cluster-brazil-sp",
    region: "拉美",
    country: "巴西 (Brazil)",
    city: "圣保罗 (São Paulo)",
    clusterName: "Guarulhos / Cumbica 工业带",
    famousStreetOrPark: "Cumbica Industrial District, Guarulhos, São Paulo",
    representativeSeedCompany: "Stemac Grupos Geradores",
    seedAddress: "Av. Santos Dumont, Cumbica, Guarulhos, São Paulo, Brazil",
    phoneNumber: "+5511974125896",
    website: "https://www.stemac.com.br",
    marketBackground: "拉美第一大经济体核心机电集聚区，发电机原厂制造、组装与工程机械重修核心走廊。",
    recommendedFocus: "Scania/MWM/Cummins动力发电机备件、深海电控模块、发电机励磁系统调压板",
    hotFeatures: ["南美最大工业走廊", "本土组装巨头扎堆", "大马力柴油机维保集聚"]
  },
  {
    id: "cluster-peru-lima",
    region: "拉美",
    country: "秘鲁 (Peru)",
    city: "利马 (Lima)",
    clusterName: "Guillermo Dansey / Las Malvinas 机械电气街",
    famousStreetOrPark: "Av. Guillermo Dansey & Av. Argentina, Cercado de Lima",
    representativeSeedCompany: "Modasa (Motores Diesel Andinos S.A.)",
    seedAddress: "Av. Los Frutales 202, Ate / Guillermo Dansey, Lima, Peru",
    phoneNumber: "+51989741258",
    website: "https://www.modasa.com.pe",
    marketBackground: "秘鲁采矿业发达，利马集中了供应全国矿山、渔业及高海拔电站的发电机配件与维修集群。",
    recommendedFocus: "高原耐低温发电机配件、ComAp/Deepsea防潮抗震控制器、无刷电球AVR、电加热套",
    hotFeatures: ["矿业动力采购中心", "南美太平洋沿岸机电走廊", "高海拔发电机特种配件"]
  },
  {
    id: "cluster-colombia-bogota",
    region: "拉美",
    country: "哥伦比亚 (Colombia)",
    city: "波哥大 (Bogotá)",
    clusterName: "Puente Aranda & Paloquemao 机电重工业区",
    famousStreetOrPark: "Calle 13 & Carrera 38, Zona Industrial Puente Aranda, Bogotá",
    representativeSeedCompany: "Motores y Plantas Eléctricas de Colombia S.A.S.",
    seedAddress: "Carrera 38 No. 12-45, Zona Industrial Puente Aranda, Bogotá, Colombia",
    phoneNumber: "+573105829143",
    website: "",
    marketBackground: "哥伦比亚全国最大机电成套与工业装备制造基地，集中了大量柴油机大修、发电机组装及双电源ATS控制柜集成商。",
    recommendedFocus: "康明斯/珀金斯大修配件、深海DSE6120/7320控制器、无刷AVR自动稳压板、停机电磁阀",
    hotFeatures: ["安第斯工业制造枢纽", "重型柴油机维修中心", "发电机控制柜与ATS成套商集中"]
  },
  {
    id: "cluster-chile-santiago",
    region: "拉美",
    country: "智利 (Chile)",
    city: "圣地亚哥 (Santiago)",
    clusterName: "San Joaquín & Franklin 机械动力产业走廊",
    famousStreetOrPark: "Av. Vicuña Mackenna & Santa Rosa, San Joaquín, Santiago",
    representativeSeedCompany: "Generadores y Fuerza Motriz Diésel Chile SpA",
    seedAddress: "Av. Vicuña Mackenna 3200, San Joaquín, Región Metropolitana, Santiago, Chile",
    phoneNumber: "+56994182736",
    website: "",
    marketBackground: "智利矿业与农业供电核心装备集散地，因电网分布广及地震多发，工矿备用发电机组装与零配件维保需求极其强劲。",
    recommendedFocus: "矿用发电机控制模块、深海/科迈控制器、高抗震AVR调压板、蓄电池浮动充电器及二极管整流桥",
    hotFeatures: ["全球最大铜矿国动力后盾", "高可靠性发电机配件集散", "大功率静音柴油机组装"]
  },

  // ========== 南亚 (South Asia) ==========
  {
    id: "cluster-pakistan-karachi",
    region: "南亚",
    country: "巴基斯坦 (Pakistan)",
    city: "卡拉奇 (Karachi)",
    clusterName: "Korangi 重工与机电产业园",
    famousStreetOrPark: "Plot 24, Sector 15, Korangi Industrial Area",
    representativeSeedCompany: "Orient Energy Systems (Pvt) Ltd",
    seedAddress: "Plot 24, Sector 15, Korangi Industrial Area, Karachi, Pakistan",
    phoneNumber: "+923008471925",
    website: "https://www.orient-power.com",
    marketBackground: "巴基斯坦经济命脉，受国家负荷脱落限电影响，全国数千家纺织与工业厂房全靠工业发电机保障供电。",
    recommendedFocus: "柴油发电机组装、深海控制器(Deepsea)、成套发电机控制柜、珀金斯/康明斯机修耗材",
    hotFeatures: ["纺织重工业用电缺口大", "巴基斯坦发电机组装基地", "大型配件集散与翻新中心"]
  },
  {
    id: "cluster-bangladesh-dhaka",
    region: "南亚",
    country: "孟加拉国 (Bangladesh)",
    city: "达卡 (Dhaka)",
    clusterName: "Tejgaon 动力机电工业区",
    famousStreetOrPark: "Tejgaon Industrial Area, Dhaka 1208",
    representativeSeedCompany: "Energypac Power Generation Ltd",
    seedAddress: "Tejgaon Industrial Area, Dhaka 1208, Bangladesh",
    phoneNumber: "+8801713001234",
    website: "https://www.energypac.com",
    marketBackground: "孟加拉制衣成衣（RMG）出口工厂的电力后盾，聚集了全国最密集的发电机进口代理与工程公司。",
    recommendedFocus: "发电机并联控制系统、自动稳压器AVR、电磁执行器、蓄电池智能浮充电器",
    hotFeatures: ["服装纺织厂电力生命线", "发电机代理商全国总部汇集", "并机并网柜配件需求旺"]
  }
];
