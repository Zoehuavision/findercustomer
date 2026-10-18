import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  MapPin, 
  Search, 
  Sparkles, 
  Globe, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  MessageCircle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Download, 
  Loader2, 
  Compass, 
  ShieldAlert, 
  Factory, 
  Network, 
  Cpu, 
  Wrench, 
  Zap,
  Info,
  ChevronRight,
  BookOpen, 
  Filter, 
  X, 
  BadgeCheck,
  ThumbsUp,
  RotateCw,
  Edit3,
  SlidersHorizontal,
  CheckSquare,
  Square,
  Radio,
  Gauge,
  BatteryCharging,
  AlertCircle
} from "lucide-react";
import { PrecisionFissionResult, Lead, BenchmarkCandidate } from "../types";
import { investigateAndFissionLeads, locateBenchmarkCompany } from "../services/geminiService";
import { getWhatsAppLink, normalizeWhatsAppNumber, validateWhatsAppMobile, generateWhatsAppHunterUrls } from "../utils/phoneUtils";
import { INDUSTRIAL_CLUSTER_BENCHMARKS, IndustrialClusterBenchmark } from "../constants/industrialClusters";
import { SPARE_PARTS_CATEGORIES, SPARE_PARTS_PRESETS } from "../constants/sparePartsOptions";

export default function PrecisionFissionScout() {
  const [seedName, setSeedName] = useState("");
  const [seedAddress, setSeedAddress] = useState("");
  const [productFocus, setProductFocus] = useState("发电机微电脑控制器(深海DSE/众智SmartGen/科迈ComAp)、AVR自动电压调节板(SX460/AS440/MX321/R250/GAVR)、发电机旋转整流桥模块与高压二极管、智能蓄电池浮充电器(12V/24V BAC06A/SmartGen)");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fissionResult, setFissionResult] = useState<PrecisionFissionResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentStepText, setCurrentStepText] = useState("");
  const [filterValidWhatsAppOnly, setFilterValidWhatsAppOnly] = useState(true);
  const [fissionError, setFissionError] = useState<string | null>(null);
  const [editingFissionLeadId, setEditingFissionLeadId] = useState<string | null>(null);
  const [editFissionPhoneVal, setEditFissionPhoneVal] = useState<string>("");
  const [expandedHunterFissionId, setExpandedHunterFissionId] = useState<string | null>(null);

  // New Feature 1: Country-based auto-locating benchmark & preview state
  const [selectedTargetCountry, setSelectedTargetCountry] = useState<string>("沙特阿拉伯");
  const [isLocatingBenchmark, setIsLocatingBenchmark] = useState(false);
  const [benchmarkCandidate, setBenchmarkCandidate] = useState<BenchmarkCandidate | null>(null);
  const [candidateHistory, setCandidateHistory] = useState<string[]>([]);

  // New Feature 2: Selectable Spare Parts Focus items
  const [selectedParts, setSelectedParts] = useState<string[]>([
    "发电机微电脑控制器(深海DSE/众智SmartGen/科迈ComAp)",
    "AVR自动电压调节板(SX460/AS440/MX321/R250/GAVR)",
    "发电机旋转整流桥模块与高压二极管",
    "智能蓄电池浮充电器(12V/24V BAC06A/SmartGen)"
  ]);
  const [isPartsDrawerOpen, setIsPartsDrawerOpen] = useState(false);

  // Cluster Library Modal / Drawer state
  const [isClusterModalOpen, setIsClusterModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("全部");
  const [clusterSearchQuery, setClusterSearchQuery] = useState("");
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);

  const handleStartFission = async (overrideName?: string, overrideAddress?: string, overrideFocus?: string) => {
    const targetName = (overrideName || seedName).trim();
    const targetAddress = (overrideAddress || seedAddress).trim();
    const targetFocus = (overrideFocus || productFocus).trim();

    if (!targetName || !targetAddress) return;

    if (overrideName) setSeedName(overrideName);
    if (overrideAddress) setSeedAddress(overrideAddress);
    if (overrideFocus) setProductFocus(overrideFocus);

    setIsProcessing(true);
    setFissionResult(null);
    setFissionError(null);
    setCurrentStepText("1/3 正在全网深度背调目标种子企业...");

    const stepTimer1 = setTimeout(() => {
      setCurrentStepText("2/3 正在分析所在街道/工业区产业生态与机电集聚度...");
    }, 4500);

    const stepTimer2 = setTimeout(() => {
      setCurrentStepText("3/3 正在挖掘同园区/同街道同类企业、柴油机维修厂与配件买家...");
    }, 9000);

    try {
      const result = await investigateAndFissionLeads(targetName, targetAddress, targetFocus);
      setFissionResult(result);
    } catch (err: any) {
      console.error("Fission error:", err);
      setFissionError(err?.message || "深度裂变分析请求失败，请检查网络或稍后重试");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsProcessing(false);
      setCurrentStepText("");
    }
  };

  const handleAutoLocateBenchmark = async (forceNext = false) => {
    if (!selectedTargetCountry) return;
    setIsLocatingBenchmark(true);

    try {
      // 1. Check if we have matching curated cluster benchmarks in our 16 curated clusters database
      const countryMatches = INDUSTRIAL_CLUSTER_BENCHMARKS.filter(b => 
        b.country.toLowerCase().includes(selectedTargetCountry.toLowerCase()) || 
        selectedTargetCountry.toLowerCase().includes(b.country.split(" ")[0].toLowerCase())
      );

      const unshownCurated = countryMatches.find(b => !candidateHistory.includes(b.representativeSeedCompany));

      if (unshownCurated && !forceNext) {
        const candidate: BenchmarkCandidate = {
          companyName: unshownCurated.representativeSeedCompany,
          seedAddress: unshownCurated.seedAddress,
          clusterName: unshownCurated.clusterName,
          city: unshownCurated.city,
          country: unshownCurated.country,
          phoneNumber: "",
          website: "",
          chineseDescription: unshownCurated.marketBackground,
          businessType: "柴油发电机组装、成套与柴油机大修服务商",
          whyGoodForFission: `位于 ${unshownCurated.city} 核心机电街区【${unshownCurated.famousStreetOrPark}】，聚集了数百家发电机大修厂、备件贸易商及组装厂，周边同类客户密集，非常适合同业裂变。`,
          recommendedFocus: unshownCurated.recommendedFocus
        };
        setBenchmarkCandidate(candidate);
        setCandidateHistory(prev => [...prev, candidate.companyName]);
        setSeedName(candidate.companyName);
        setSeedAddress(candidate.seedAddress);
        if (candidate.recommendedFocus) {
          setProductFocus(candidate.recommendedFocus);
        }
      } else {
        // 2. Query Gemini with Google Search to actively locate a real, active benchmark company and address in this country
        const candidate = await locateBenchmarkCompany(selectedTargetCountry, candidateHistory);
        if (candidate) {
          setBenchmarkCandidate(candidate);
          setCandidateHistory(prev => [...prev, candidate.companyName]);
          setSeedName(candidate.companyName);
          setSeedAddress(candidate.seedAddress);
          if (candidate.recommendedFocus) {
            setProductFocus(candidate.recommendedFocus);
          }
        }
      }
    } catch (error) {
      console.error("Auto locate benchmark error:", error);
    } finally {
      setIsLocatingBenchmark(false);
    }
  };

  const handleTogglePart = (item: string) => {
    let next: string[];
    if (selectedParts.includes(item)) {
      next = selectedParts.filter(i => i !== item);
    } else {
      next = [...selectedParts, item];
    }
    setSelectedParts(next);
    if (next.length > 0) {
      setProductFocus(next.join("、"));
    }
  };

  const handleApplyPreset = (preset: typeof SPARE_PARTS_PRESETS[0]) => {
    setSelectedParts(preset.items);
    setProductFocus(preset.items.join("、"));
  };

  const handleClearParts = () => {
    setSelectedParts([]);
    setProductFocus("");
  };

  const loadClusterBenchmark = (cluster: IndustrialClusterBenchmark) => {
    setSeedName(cluster.representativeSeedCompany);
    setSeedAddress(cluster.seedAddress);
    setProductFocus(cluster.recommendedFocus);
    setActiveClusterId(cluster.id);
    setSelectedTargetCountry(cluster.country.split(" ")[0]);
    
    // Also build candidate card so user can review it
    const candidate: BenchmarkCandidate = {
      companyName: cluster.representativeSeedCompany,
      seedAddress: cluster.seedAddress,
      clusterName: cluster.clusterName,
      city: cluster.city,
      country: cluster.country,
      phoneNumber: "",
      website: "",
      chineseDescription: cluster.marketBackground,
      businessType: "柴油发电机组装、成套与柴油机大修服务商",
      whyGoodForFission: `位于 ${cluster.city} 核心机电街区【${cluster.famousStreetOrPark}】，聚集了数百家发电机大修厂、备件贸易商及组装厂，同业集聚度极高。`,
      recommendedFocus: cluster.recommendedFocus
    };
    setBenchmarkCandidate(candidate);
    setIsClusterModalOpen(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredClusters = INDUSTRIAL_CLUSTER_BENCHMARKS.filter(cluster => {
    const matchesRegion = selectedRegion === "全部" || cluster.region === selectedRegion;
    if (!matchesRegion) return false;

    if (!clusterSearchQuery.trim()) return true;
    const q = clusterSearchQuery.toLowerCase();
    return (
      cluster.country.toLowerCase().includes(q) ||
      cluster.city.toLowerCase().includes(q) ||
      cluster.clusterName.toLowerCase().includes(q) ||
      cluster.famousStreetOrPark.toLowerCase().includes(q) ||
      cluster.representativeSeedCompany.toLowerCase().includes(q) ||
      cluster.marketBackground.toLowerCase().includes(q) ||
      cluster.recommendedFocus.toLowerCase().includes(q)
    );
  });

  const exportFissionToCSV = () => {
    if (!fissionResult || fissionResult.fissionLeads.length === 0) return;

    const headers = [
      "Company Name",
      "Cluster Location / Address",
      "Relationship / Peer Type",
      "Phone Number",
      "WhatsApp Status",
      "Digits Count",
      "Website",
      "Business Scope & Description",
      "Target Industrial Cluster"
    ];

    const rows = fissionResult.fissionLeads.map(l => {
      const val = validateWhatsAppMobile(l.phoneNumber, l.country || fissionResult.clusterAnalysis.cityAndCountry);
      return [
        `"${l.companyName.replace(/"/g, '""')}"`,
        `"${(l.addressInCluster || "").replace(/"/g, '""')}"`,
        `"${(l.relationshipToSeed || "").replace(/"/g, '""')}"`,
        `"${val.normalizedNumber.replace(/"/g, '""')}"`,
        `"${val.statusLabel.replace(/"/g, '""')}"`,
        `"${val.digitsCount}"`,
        `"${(l.website || "").replace(/"/g, '""')}"`,
        `"${(l.description || "").replace(/"/g, '""')}"`,
        `"${(fissionResult.clusterAnalysis.industrialParkOrStreet || "").replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fission_Leads_${fissionResult.clusterAnalysis.industrialParkOrStreet.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Guide */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>智能产业带裂变引擎 (Cluster Fission Prospecting)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            从 1 个已知精准客户，裂变挖掘整个工业区/街道的同类买家
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            海外机电与发电机维修、配件批发商通常<strong>高度集中在特定的工业园区、汽配机械街或港口物流带</strong>。输入任意已知精准客户名称与地址，系统将自动背调该企业、研判其所在工业带的集聚度，并全网精准挖掘同街道、同园区的同行同类潜在客户。
          </p>

          {/* Flow Indicator Steps */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
              <span>精准种子企业</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
              <span>街道工业区定位</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
              <span>产业带集聚研判</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-950/70 px-3 py-2 rounded-xl border border-emerald-700/50 text-emerald-300">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
              <span>同类企业批量裂变</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  精准客户与地址输入
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Step 1 of 3</span>
            </div>

            {/* Feature 1: Country-Based Auto-Locating Benchmark & Review Section */}
            <div className="p-4 bg-gradient-to-br from-indigo-50/90 via-slate-50 to-blue-50/60 rounded-2xl border border-indigo-200/80 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>国家定位 & 标杆公司一键初审</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                        智能预审模式
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      选择国家，系统自动定位该国核心产业带与标杆企业地址供您核判
                    </p>
                  </div>
                </div>
              </div>

              {/* Country Picker Dropdown & Fast Switch Chips */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTargetCountry}
                    onChange={(e) => {
                      setSelectedTargetCountry(e.target.value);
                      setBenchmarkCandidate(null);
                    }}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs cursor-pointer"
                  >
                    <option value="阿根廷">🇦🇷 阿根廷 (Argentina) - 布宜诺斯艾利斯 San Martín</option>
                    <option value="哥伦比亚">🇨🇴 哥伦比亚 (Colombia) - 波哥大 Puente Aranda 工业带</option>
                    <option value="智利">🇨🇱 智利 (Chile) - 圣地亚哥 San Joaquín 机电区</option>
                    <option value="秘鲁">🇵🇪 秘鲁 (Peru) - 利马 Guillermo Dansey 机械街</option>
                    <option value="巴西">🇧🇷 巴西 (Brazil) - 圣保罗 Guarulhos 工业走廊</option>
                    <option value="墨西哥">🇲🇽 墨西哥 (Mexico) - 蒙特雷 Apodaca 工业区</option>
                    <option value="沙特阿拉伯">🇸🇦 沙特阿拉伯 (Saudi Arabia) - 利雅得/吉达工业城</option>
                    <option value="阿联酋">🇦🇪 阿联酋 (UAE) - 迪拜 Al Quoz / 沙迦工业区</option>
                    <option value="巴基斯坦">🇵🇰 巴基斯坦 (Pakistan) - 卡拉奇 Korangi / 拉合尔</option>
                    <option value="尼日利亚">🇳🇬 尼日利亚 (Nigeria) - 拉各斯 Ikeja / Ogba 动力带</option>
                    <option value="埃及">🇪🇬 埃及 (Egypt) - 开罗 / 十月六日城工业区</option>
                    <option value="伊拉克">🇮🇶 伊拉克 (Iraq) - 巴格达 Sheikh Omar 机电街</option>
                    <option value="越南">🇻🇳 越南 (Vietnam) - 胡志明市 第5郡 Tạ Uyên 机械街</option>
                    <option value="印度尼西亚">🇮🇩 印度尼西亚 (Indonesia) - 雅加达 Glodok LTC 五金街</option>
                    <option value="菲律宾">🇵🇭 菲律宾 (Philippines) - 马尼拉 Binondo / Valenzuela</option>
                    <option value="南非">🇿🇦 南非 (South Africa) - 约翰内斯堡 Jet Park 重工区</option>
                    <option value="肯尼亚">🇰🇪 肯尼亚 (Kenya) - 内罗毕 Enterprise Rd 产业带</option>
                    <option value="孟加拉国">🇧🇩 孟加拉国 (Bangladesh) - 达卡 Tejgaon 机电区</option>
                    <option value="利比亚">🇱🇾 利比亚 (Libya) - 的黎波里 / 班加西电力机修区</option>
                    <option value="土耳其">🇹🇷 土耳其 (Turkey) - 伊斯坦布尔 İkitelli 机电城</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleAutoLocateBenchmark(false)}
                    disabled={isLocatingBenchmark}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                  >
                    {isLocatingBenchmark ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>定位中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>自动定位标杆企业</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Popular Country Quick Pills */}
                <div className="flex flex-wrap gap-1 items-center pt-0.5">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">热门推荐:</span>
                  {[
                    { label: "阿根廷", value: "阿根廷" },
                    { label: "哥伦比亚", value: "哥伦比亚" },
                    { label: "智利", value: "智利" },
                    { label: "秘鲁", value: "秘鲁" },
                    { label: "巴西", value: "巴西" },
                    { label: "沙特", value: "沙特阿拉伯" },
                    { label: "阿联酋", value: "阿联酋" },
                    { label: "巴基斯坦", value: "巴基斯坦" },
                    { label: "尼日利亚", value: "尼日利亚" },
                    { label: "埃及", value: "埃及" },
                    { label: "越南", value: "越南" }
                  ].map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        setSelectedTargetCountry(c.value);
                        setBenchmarkCandidate(null);
                      }}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        selectedTargetCountry === c.value
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-900"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benchmark Locating Loading State */}
              {isLocatingBenchmark && (
                <div className="p-4 bg-white/90 border border-indigo-200 rounded-xl space-y-2 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在检索【{selectedTargetCountry}】知名柴油机电集聚区与标杆企业精准地址...</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    全网检索该国最大发电机组装厂、柴油机翻新大修车间与配件贸易行街道
                  </p>
                </div>
              )}

              {/* Benchmark Review & Judgment Card (The User Reviews & Decides to Direct Fission) */}
              <AnimatePresence>
                {benchmarkCandidate && !isLocatingBenchmark && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-4 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm space-y-3.5 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ 定位成功 · 待您核判
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {benchmarkCandidate.country} · {benchmarkCandidate.city}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5 pt-1">
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{benchmarkCandidate.companyName}</span>
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(benchmarkCandidate.companyName, "benchmark-name")}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 text-xs transition-colors shrink-0"
                        title="复制公司名称"
                      >
                        {copiedId === "benchmark-name" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Address & Cluster info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5 flex-1">
                          <div className="font-bold text-slate-900 flex items-center justify-between">
                            <span>详细物理地址 (Street Address):</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(benchmarkCandidate.seedAddress, "benchmark-addr")}
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold ml-2 inline-flex items-center gap-0.5"
                            >
                              {copiedId === "benchmark-addr" ? "已复制" : "复制地址"}
                            </button>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-mono font-medium text-[11px]">
                            {benchmarkCandidate.seedAddress}
                          </p>
                          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1">
                            <span className="font-semibold text-indigo-950">所在集聚街区/园区:</span>
                            <span className="font-bold text-indigo-700">{benchmarkCandidate.clusterName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Phone / WhatsApp status & Website */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {benchmarkCandidate.phoneNumber ? (
                          (() => {
                            const val = validateWhatsAppMobile(benchmarkCandidate.phoneNumber, benchmarkCandidate.country);
                            return (
                              <div className="flex items-center gap-1.5">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-semibold text-[11px] ${
                                  val.isValidWhatsAppMobile ? "bg-emerald-50 text-emerald-950 border-emerald-300" : "bg-slate-50 text-slate-700 border-slate-200"
                                }`}>
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{val.normalizedNumber}</span>
                                </div>
                                {val.whatsappUrl && (
                                  <a
                                    href={val.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all shadow-2xs"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>WhatsApp 直达</span>
                                  </a>
                                )}
                              </div>
                            );
                          })()
                        ) : null}

                        {benchmarkCandidate.website && (
                          <a
                            href={benchmarkCandidate.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-[11px] font-semibold bg-blue-50 px-2 py-1 rounded-lg border border-blue-200"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>访问官网</span>
                          </a>
                        )}
                      </div>

                      {/* Business Scope */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                          <span>主营业务与代理品牌:</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          {benchmarkCandidate.chineseDescription}
                        </p>
                      </div>

                      {/* Why Good For Fission Notice */}
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-[11px] text-emerald-950 space-y-0.5">
                        <span className="font-bold flex items-center gap-1 text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>为什么该地址极利于裂变拓客:</span>
                        </span>
                        <p className="text-emerald-900/90 leading-relaxed font-normal">
                          {benchmarkCandidate.whyGoodForFission}
                        </p>
                      </div>
                    </div>

                    {/* Key Action Bar: The user judges and either triggers direct fission or requests another candidate */}
                    <div className="pt-1 flex flex-col sm:flex-row items-stretch gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleStartFission(benchmarkCandidate.companyName, benchmarkCandidate.seedAddress, productFocus);
                        }}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <ThumbsUp className="w-4 h-4 text-emerald-100" />
                        <span>👍 确认合适，直接以此裂变</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAutoLocateBenchmark(true)}
                        disabled={isLocatingBenchmark || isProcessing}
                        className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shrink-0"
                        title="换一家该国其他核心产业带标杆企业"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>换一家标杆企业</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Global Industrial Clusters Library Trigger & Quick Chips (Curated 16 Benchmarks) */}
            <div className="space-y-3 p-3.5 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 rounded-xl border border-indigo-100/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>经典柴油机电产业集中街区智库 (16个名录)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClusterModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-800 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>全部名录</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {INDUSTRIAL_CLUSTER_BENCHMARKS.slice(0, 8).map((cluster) => {
                  const isCurrent = activeClusterId === cluster.id;
                  return (
                    <button
                      key={cluster.id}
                      type="button"
                      onClick={() => loadClusterBenchmark(cluster)}
                      className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                        isCurrent 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" 
                          : "bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border-slate-200"
                      }`}
                      title={cluster.marketBackground}
                    >
                      <span>📍</span>
                      <span className="font-bold">[{cluster.country.split(" ")[0]}]</span>
                      <span>{cluster.clusterName.split(" ")[0]}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setIsClusterModalOpen(true)}
                  className="text-[11px] font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg border border-indigo-200 transition-all flex items-center gap-1"
                >
                  <span>更多8个街区...</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Seed Company Name Input (Editable & Synced) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" /> 目标精准客户公司名称 (Seed Company Name) *
                </label>
                {seedName && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    已就绪
                  </span>
                )}
              </div>
              <input
                type="text"
                value={seedName}
                onChange={(e) => setSeedName(e.target.value)}
                placeholder="例如: Orient Energy Systems / FAMCO / Jubaili Bros..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Seed Company Address Input (Editable & Synced) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> 公司详细地址 / 所在街道 / 工业区 / 国家 (Address & Zone) *
                </label>
                {seedAddress && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    已就绪
                  </span>
                )}
              </div>
              <textarea
                rows={2}
                value={seedAddress}
                onChange={(e) => setSeedAddress(e.target.value)}
                placeholder="例如: Plot 24, Sector 15, Korangi Industrial Area, Karachi, Pakistan (包含工业区、街道或城市名称，越精确裂变越准)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 transition-all resize-none"
              />
            </div>

            {/* Feature 2: Selectable Spare Parts Focus Library & Presets */}
            <div className="space-y-2.5 p-3.5 bg-gradient-to-br from-amber-50/50 via-slate-50 to-indigo-50/40 rounded-xl border border-slate-200/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800">
                    配件关注方向备选项目 (多选/自选)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPartsDrawerOpen(!isPartsDrawerOpen)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-white hover:bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{isPartsDrawerOpen ? "收起备选库" : `展开全部备选库 (${selectedParts.length}项)`}</span>
                  </button>
                  {selectedParts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearParts}
                      className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors font-medium"
                    >
                      清空
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Quick Preset Bundles */}
              <div className="grid grid-cols-2 gap-1.5">
                {SPARE_PARTS_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group cursor-pointer shadow-2xs active:scale-98"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-900 truncate">
                        {preset.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {preset.badge} · {preset.items.length} 核心项
                    </p>
                  </button>
                ))}
              </div>

              {/* Expandable Categorized Option Chips */}
              {isPartsDrawerOpen && (
                <div className="space-y-3 pt-2 border-t border-slate-200/80 max-h-72 overflow-y-auto pr-1">
                  {SPARE_PARTS_CATEGORIES.map((category) => (
                    <div key={category.id} className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{category.categoryName}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {category.items.map((item) => {
                          const isSelected = selectedParts.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleTogglePart(item)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs font-semibold"
                                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200 font-normal"
                              }`}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-3 h-3 shrink-0 text-white" />
                              ) : (
                                <Square className="w-3 h-3 shrink-0 text-slate-400" />
                              )}
                              <span>{item}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Product Focus Text Display & Edit Box */}
              <div className="pt-1">
                <textarea
                  rows={2}
                  value={productFocus}
                  onChange={(e) => setProductFocus(e.target.value)}
                  placeholder="发电机微电脑控制器、AVR自动电压调节板、整流模块、蓄电池浮充电器、柴油机维修配件..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 transition-all resize-none shadow-2xs"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleStartFission()}
              disabled={isProcessing || !seedName.trim() || !seedAddress.trim()}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>正在执行深度调研与集群裂变...</span>
                </>
              ) : (
                <>
                  <Network className="w-5 h-5" />
                  <span>开始调研并裂变周边同类客户</span>
                </>
              )}
            </button>

            {/* Status Steps Indicator during Loading */}
            {isProcessing && (
              <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>{currentStepText || "正在分析中..."}</span>
                </div>
                <div className="w-full bg-indigo-200/50 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {fissionError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-rose-800">请求异常提示</div>
                  <div className="text-rose-600 mt-0.5 leading-relaxed">{fissionError}</div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Fission Results Display */}
        <div className="lg:col-span-7 space-y-6">
          
          {!fissionResult && !isProcessing && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Network className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">等待输入精准种子客户</h3>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                在左侧填入任意海外发电机/柴油机相关客户的公司名称与地址（或点击上方预设典型案例），点击<strong>“开始调研并裂变周边同类客户”</strong>，系统将自动化完成企业背调、工业区产业带研判，并挖掘同园区同类企业。
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-4">
              <div className="h-44 rounded-2xl bg-white border border-slate-200 animate-pulse p-5 space-y-3">
                <div className="h-5 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-16 bg-slate-50 rounded w-full" />
              </div>
              <div className="h-36 rounded-2xl bg-white border border-slate-200 animate-pulse p-5 space-y-3">
                <div className="h-5 bg-slate-100 rounded w-1/4" />
                <div className="h-14 bg-slate-50 rounded w-full" />
              </div>
              <div className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse p-5 space-y-3">
                <div className="h-5 bg-slate-100 rounded w-1/2" />
                <div className="h-20 bg-slate-50 rounded w-full" />
              </div>
            </div>
          )}

          {fissionResult && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Card 1: Seed Company Deep Investigation */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                        第一阶段: 种子企业深度背调 (Seed Profile)
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {fissionResult.seedCompany.companyName}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
                    {fissionResult.seedCompany.businessType || "发电机/柴油机服务商"}
                  </span>
                </div>

                {/* Seed Company Contact info */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="inline-flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{fissionResult.seedCompany.address}</span>
                  </div>

                  {(() => {
                    const seedVal = validateWhatsAppMobile(fissionResult.seedCompany.phoneNumber, fissionResult.seedCompany.address);
                    if (!fissionResult.seedCompany.phoneNumber) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`inline-flex items-center gap-2 font-mono font-semibold px-3 py-1.5 rounded-xl border ${
                          seedVal.isValidWhatsAppMobile 
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                            : seedVal.isLandline 
                            ? 'bg-amber-50 text-amber-900 border-amber-200' 
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          <Phone className={`w-3.5 h-3.5 ${seedVal.isValidWhatsAppMobile ? 'text-emerald-600' : seedVal.isLandline ? 'text-amber-600' : 'text-slate-500'}`} />
                          <span>{seedVal.normalizedNumber}</span>
                          <button
                            onClick={() => copyToClipboard(seedVal.normalizedNumber, 'seed-phone')}
                            className="ml-1 text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                            title="复制电话"
                          >
                            {copiedId === 'seed-phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        {seedVal.whatsappUrl && (
                          <a
                            href={seedVal.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp 直达</span>
                          </a>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          seedVal.isValidWhatsAppMobile 
                            ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' 
                            : seedVal.isLandline 
                            ? 'bg-amber-100/80 text-amber-800 border border-amber-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {seedVal.isValidWhatsAppMobile ? `✓ 标准手机 (${seedVal.digitsCount}位)` : seedVal.statusLabel}
                        </span>
                      </div>
                    );
                  })()}

                  {fissionResult.seedCompany.website && (
                    <a
                      href={fissionResult.seedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 bg-blue-50/60 px-3 py-1.5 rounded-xl border border-blue-200/80 font-semibold lowercase"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{fissionResult.seedCompany.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent('"' + fissionResult.seedCompany.companyName + '" ("WhatsApp" OR "wa.me" OR "Mobile")')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-xl transition-all"
                    title="在谷歌定向检索种子企业真实 WhatsApp 与销售手机"
                  >
                    <Search className="w-3 h-3" />
                    <span>🔍 谷歌搜种子企业 WhatsApp</span>
                  </a>
                </div>

                {/* Seed Main Brands handled */}
                {fissionResult.seedCompany.mainBrands && fissionResult.seedCompany.mainBrands.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">涉及核心品牌:</span>
                    {fissionResult.seedCompany.mainBrands.map((b, idx) => (
                      <span key={idx} className="text-[11px] font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                {/* Seed Chinese Description */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                  {fissionResult.seedCompany.chineseDescription}
                </div>
              </div>

              {/* Card 2: Regional Cluster & Industrial Zone Analysis */}
              <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-100 rounded-2xl p-5 shadow-sm space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                      <Factory className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                        第二阶段: 所在工业区/街道产业带集聚研判 (Cluster Intel)
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        📍 {fissionResult.clusterAnalysis.industrialParkOrStreet} ({fissionResult.clusterAnalysis.cityAndCountry})
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-black bg-indigo-600 text-white px-3 py-1 rounded-full shadow-xs">
                    集聚度评级: {fissionResult.clusterAnalysis.clusterDensity}
                  </span>
                </div>

                {/* Key Industry types in this cluster */}
                {fissionResult.clusterAnalysis.keyIndustryTypes && fissionResult.clusterAnalysis.keyIndustryTypes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-indigo-900 uppercase">区域核心业态:</span>
                    {fissionResult.clusterAnalysis.keyIndustryTypes.map((t, idx) => (
                      <span key={idx} className="text-[11px] font-bold bg-white text-indigo-900 px-2.5 py-0.5 rounded-lg border border-indigo-200 shadow-xs">
                        ⚡ {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                  {fissionResult.clusterAnalysis.clusterOverview}
                </div>
              </div>

              {/* Card 3: Fissioned Peer Leads List */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        第三阶段: 同工业区/同街道裂变潜客池
                      </h3>
                      <p className="text-xs text-slate-500">
                        在 {fissionResult.clusterAnalysis.industrialParkOrStreet} 成功挖掘到 {fissionResult.fissionLeads.length} 家同类企业与潜在买家
                      </p>
                    </div>
                  </div>

                  {fissionResult.fissionLeads.length > 0 && (
                    <button
                      onClick={exportFissionToCSV}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>导出本次裂变潜客 ({fissionResult.fissionLeads.length})</span>
                    </button>
                  )}
                </div>

                {/* WhatsApp Quality Filter Bar */}
                {fissionResult.fissionLeads.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-emerald-50/90 via-slate-50 to-slate-50 border border-emerald-200/90 rounded-2xl shadow-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={filterValidWhatsAppOnly}
                        onChange={(e) => setFilterValidWhatsAppOnly(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer accent-emerald-600"
                      />
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-800">
                          仅显示有效 WhatsApp 手机号
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full">
                          已自动过滤座机与位数异常号码
                        </span>
                      </div>
                    </label>

                    <div className="text-xs font-semibold text-slate-600">
                      展示 <strong className="text-emerald-700 font-bold">{
                        fissionResult.fissionLeads.filter(l => {
                          if (!filterValidWhatsAppOnly) return true;
                          return validateWhatsAppMobile(l.phoneNumber, l.country || fissionResult.clusterAnalysis.cityAndCountry).isValidWhatsAppMobile;
                        }).length
                      }</strong> / {fissionResult.fissionLeads.length} 家潜客
                      {filterValidWhatsAppOnly && fissionResult.fissionLeads.length - fissionResult.fissionLeads.filter(l => validateWhatsAppMobile(l.phoneNumber, l.country || fissionResult.clusterAnalysis.cityAndCountry).isValidWhatsAppMobile).length > 0 && (
                        <span className="text-slate-400 ml-1.5">
                          (已剔除 {fissionResult.fissionLeads.length - fissionResult.fissionLeads.filter(l => validateWhatsAppMobile(l.phoneNumber, l.country || fissionResult.clusterAnalysis.cityAndCountry).isValidWhatsAppMobile).length} 家固话/异常号码)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {fissionResult.fissionLeads
                    .filter(lead => {
                      if (!filterValidWhatsAppOnly) return true;
                      const val = validateWhatsAppMobile(lead.phoneNumber, lead.country || fissionResult.clusterAnalysis.cityAndCountry);
                      return val.isValidWhatsAppMobile;
                    })
                    .map((lead, idx) => {
                      const val = validateWhatsAppMobile(lead.phoneNumber, lead.country || fissionResult.clusterAnalysis.cityAndCountry);

                      return (
                        <div
                          key={lead.id}
                          className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3.5 relative"
                        >
                          {/* Company Name & Relationship Label */}
                          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center border border-slate-200">
                                  {idx + 1}
                                </span>
                                <h4 className="text-base font-bold text-slate-900">
                                  {lead.companyName}
                                </h4>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                {lead.relationshipToSeed && (
                                  <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                                    🔗 {lead.relationshipToSeed}
                                  </span>
                                )}
                                {lead.addressInCluster && (
                                  <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                    📍 {lead.addressInCluster}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => copyToClipboard(lead.companyName, `${lead.id}-name`)}
                              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                              title="复制公司名称"
                            >
                              {copiedId === `${lead.id}-name` ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 已复制</span>
                              ) : (
                                <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> 复制名称</span>
                              )}
                            </button>
                          </div>

                          {/* Phone / WhatsApp & Website Links */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2.5 text-xs">
                              {lead.phoneNumber ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  <div className={`inline-flex items-center gap-2 font-mono font-semibold px-3 py-1.5 rounded-xl border ${
                                    val.isValidWhatsAppMobile 
                                      ? "bg-emerald-50 text-emerald-950 border-emerald-300" 
                                      : val.isLandline 
                                      ? "bg-amber-50 text-amber-950 border-amber-300" 
                                      : "bg-slate-50 text-slate-700 border-slate-200"
                                  }`}>
                                    <Phone className={`w-3.5 h-3.5 ${val.isValidWhatsAppMobile ? "text-emerald-600" : val.isLandline ? "text-amber-600" : "text-slate-400"}`} />
                                    <span>{val.normalizedNumber}</span>
                                    
                                    <button
                                      onClick={() => copyToClipboard(val.normalizedNumber, `${lead.id}-phone`)}
                                      className="ml-1 text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                                      title="复制电话"
                                    >
                                      {copiedId === `${lead.id}-phone` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>

                                  {val.whatsappUrl && (
                                    <a
                                      href={val.whatsappUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs active:scale-95"
                                      title="发起 WhatsApp 聊天"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      <span>WhatsApp 直达</span>
                                    </a>
                                  )}

                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    val.isValidWhatsAppMobile 
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                      : val.isLandline 
                                      ? "bg-amber-100 text-amber-900 border border-amber-200" 
                                      : "bg-slate-100 text-slate-600 border border-slate-200"
                                  }`}>
                                    {val.isValidWhatsAppMobile ? `✓ 国际手机 (${val.digitsCount}位 · 可加WhatsApp)` : val.statusLabel}
                                  </span>

                                  <button
                                    onClick={() => {
                                      setEditingFissionLeadId(editingFissionLeadId === lead.id ? null : lead.id);
                                      setEditFissionPhoneVal(lead.phoneNumber || "");
                                    }}
                                    className="text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1 transition-all"
                                    title="修改或录入销售手机号"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>改号</span>
                                  </button>

                                  <button
                                    onClick={() => setExpandedHunterFissionId(expandedHunterFissionId === lead.id ? null : lead.id)}
                                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all border ${
                                      expandedHunterFissionId === lead.id 
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" 
                                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
                                    }`}
                                    title="打开 WhatsApp 深度猎手"
                                  >
                                    <Search className="w-3 h-3" />
                                    <span>WhatsApp 猎手 {expandedHunterFissionId === lead.id ? "▲" : "▼"}</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                                    未收录直接手机
                                  </span>
                                  
                                  <button
                                    onClick={() => {
                                      setEditingFissionLeadId(editingFissionLeadId === lead.id ? null : lead.id);
                                      setEditFissionPhoneVal("");
                                    }}
                                    className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>录入手机</span>
                                  </button>

                                  <button
                                    onClick={() => setExpandedHunterFissionId(expandedHunterFissionId === lead.id ? null : lead.id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
                                  >
                                    <Search className="w-3 h-3" />
                                    <span>🔍 WhatsApp 猎手 (穿透挖掘)</span>
                                  </button>
                                </div>
                              )}

                              {lead.website ? (
                                lead.websiteAccessible ? (
                                  <a 
                                    href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 transition-all text-xs"
                                    title="该企业官网已通过服务器连通性检测，可直接访问"
                                  >
                                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="max-w-[180px] truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                                    <span className="text-[9px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-black">
                                      ✓ 官网在线
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                                  </a>
                                ) : (
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <a 
                                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-all text-xs"
                                    >
                                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                                      <span className="max-w-[140px] truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                                        待探活
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-slate-400" />
                                    </a>
                                  </div>
                                )
                              ) : (
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent(lead.companyName + ' official website')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
                                >
                                  <Search className="w-3 h-3" />
                                  <span>🔍 谷歌实名穿透</span>
                                </a>
                              )}
                            </div>

                            {/* Inline Fission Phone Editor */}
                            {editingFissionLeadId === lead.id && (
                              <div className="p-3 bg-slate-50 border border-indigo-200 rounded-xl space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                  <span className="flex items-center gap-1.5 text-indigo-700">
                                    <Edit3 className="w-3.5 h-3.5" /> 录入/修改该企业的 WhatsApp 真实手机号:
                                  </span>
                                  <button 
                                    onClick={() => setEditingFissionLeadId(null)}
                                    className="text-slate-400 hover:text-slate-600 text-xs"
                                  >
                                    取消
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text"
                                    value={editFissionPhoneVal}
                                    onChange={(e) => setEditFissionPhoneVal(e.target.value)}
                                    placeholder="例如: +966 50 123 4567 或 +971 50 234 5678"
                                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                  />
                                  <button
                                    onClick={() => {
                                      const normalized = normalizeWhatsAppNumber(editFissionPhoneVal, lead.country || fissionResult.clusterAnalysis.cityAndCountry);
                                      if (fissionResult) {
                                        setFissionResult({
                                          ...fissionResult,
                                          fissionLeads: fissionResult.fissionLeads.map(l => l.id === lead.id ? { ...l, phoneNumber: normalized } : l)
                                        });
                                      }
                                      setEditingFissionLeadId(null);
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" /> 保存更新
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* WhatsApp Hunter Expanded Panel */}
                            {expandedHunterFissionId === lead.id && (() => {
                              const hunter = generateWhatsAppHunterUrls(lead.companyName, lead.country || fissionResult.clusterAnalysis.cityAndCountry);
                              return (
                                <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/60 border border-indigo-200 rounded-xl space-y-2.5 shadow-xs">
                                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>WhatsApp 深度猎手 · 全网穿透挖掘该企业销售专线</span>
                                    </div>
                                    <button 
                                      onClick={() => setExpandedHunterFissionId(null)}
                                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                                    >
                                      ✕
                                    </button>
                                  </div>

                                  <p className="text-[11px] text-slate-600 leading-relaxed">
                                    海外工业采购商常在 Facebook 商业主页、Google Maps 或官网 Contact 页面公开个人 WhatsApp 手机。点击下方定向语法一键穿透获取：
                                  </p>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <a
                                      href={hunter.googleWaSearch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-900 font-semibold transition-all group"
                                    >
                                      <span className="flex items-center gap-1.5 truncate">
                                        <Search className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                        <span className="truncate">1. 谷歌检索 WhatsApp/Mobile</span>
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                                    </a>

                                    <a
                                      href={hunter.facebookBusinessSearch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50/50 text-blue-900 font-semibold transition-all group"
                                    >
                                      <span className="flex items-center gap-1.5 truncate">
                                        <MessageCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                        <span className="truncate">2. Facebook 商业主页号码</span>
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                                    </a>

                                    <a
                                      href={hunter.waMeDomainSearch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-emerald-900 font-semibold transition-all group"
                                    >
                                      <span className="flex items-center gap-1.5 truncate">
                                        <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span className="truncate">3. 检索 wa.me 短链直达</span>
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                                    </a>

                                    <a
                                      href={hunter.linkedinPersonnelSearch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold transition-all group"
                                    >
                                      <span className="flex items-center gap-1.5 truncate">
                                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        <span className="truncate">4. LinkedIn 采购/销售人员</span>
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 shrink-0" />
                                    </a>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Landline Notice if landline detected */}
                            {val.isLandline && (
                              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <span className="font-bold">企业固话座机提醒：</span>
                                  <span className="text-[11px] text-amber-800 leading-relaxed block">
                                    {val.reasonText || "该号码为企业固定总机，无法直接接收移动端 WhatsApp 消息。建议点击上方【WhatsApp 猎手】检索其销售手机号。"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Business Profile (Simplified Chinese) */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>主营业务与经营范围 (Business Profile)</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-medium">
                              {lead.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Global Industrial Clusters Library Modal */}
      <AnimatePresence>
        {isClusterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      全球柴油机电产业集中街区与工业园区库
                    </h3>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      16 个典型产业重镇
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    精选中东、非洲、东南亚、拉美等高频需求发电机与柴油配件的知名机械五金街、大修聚集区与成套工业园。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsClusterModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Region Pills */}
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {(["全部", "中东", "非洲", "东南亚", "拉美", "南亚"] as const).map((reg) => {
                    const count = reg === "全部" 
                      ? INDUSTRIAL_CLUSTER_BENCHMARKS.length 
                      : INDUSTRIAL_CLUSTER_BENCHMARKS.filter(c => c.region === reg).length;
                    const isActive = selectedRegion === reg;

                    return (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setSelectedRegion(reg)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <span>{reg}</span>
                        <span className={`ml-1 text-[10px] px-1 py-0.2 rounded-full ${
                          isActive ? "bg-indigo-700 text-indigo-100" : "bg-slate-200 text-slate-600"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={clusterSearchQuery}
                    onChange={(e) => setClusterSearchQuery(e.target.value)}
                    placeholder="搜国家 / 城市 / 街区 / 配件..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  {clusterSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setClusterSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Body: Cards Grid */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-4">
                {filteredClusters.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    没有找到符合条件的产业街区，请尝试切换区域或搜索词。
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredClusters.map((cluster) => {
                      const isCurrent = activeClusterId === cluster.id;

                      return (
                        <div
                          key={cluster.id}
                          className={`bg-white rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 relative ${
                            isCurrent
                              ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                              : "border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                          }`}
                        >
                          <div className="space-y-2">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2 py-0.5 rounded-md">
                                    {cluster.region} · {cluster.country}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-500">
                                    {cluster.city}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mt-1">
                                  📍 {cluster.clusterName}
                                </h4>
                              </div>

                              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg shrink-0">
                                {cluster.famousStreetOrPark.split(",")[0]}
                              </span>
                            </div>

                            {/* Market Background */}
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-normal">
                              {cluster.marketBackground}
                            </p>

                            {/* Representative Seed Info */}
                            <div className="text-[11px] space-y-1 text-slate-600">
                              <div>
                                <span className="font-bold text-slate-800">典型种子企业: </span>
                                <span className="font-medium text-indigo-900">{cluster.representativeSeedCompany}</span>
                              </div>
                              <div className="truncate" title={cluster.seedAddress}>
                                <span className="font-bold text-slate-800">所在地址: </span>
                                <span>{cluster.seedAddress}</span>
                              </div>
                            </div>

                            {/* Recommended Focus */}
                            <div className="text-[11px] bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/60 text-indigo-950">
                              <span className="font-bold">🎯 核心推荐产品: </span>
                              <span>{cluster.recommendedFocus}</span>
                            </div>

                            {/* Hot Features Tags */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {cluster.hotFeatures.map((f, i) => (
                                <span key={i} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                                  ✓ {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(cluster.seedAddress, cluster.id)}
                              className="text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all flex items-center gap-1 active:scale-95"
                            >
                              {copiedId === cluster.id ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" /> 已复制地址
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Copy className="w-3 h-3" /> 复制地址
                                </span>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => loadClusterBenchmark(cluster)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                            >
                              <span>选用此街区并填入</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>💡 提示：选用街区后将自动带入种子企业名称、详细地址与推荐配件方向，点击“开始调研”即可启动全网裂变。</span>
                <button
                  type="button"
                  onClick={() => setIsClusterModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
