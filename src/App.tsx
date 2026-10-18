import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Globe, 
  Phone, 
  Building2, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  Languages,
  Loader2,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Trash2,
  MessageCircle,
  ShieldCheck,
  Download,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Layers,
  Network,
  Target,
  AlertCircle,
  MapPin,
  Edit3,
  Send,
  HelpCircle,
  History,
  Clock,
  RotateCw,
  X
} from "lucide-react";
import { COUNTRIES, SEARCH_PRESETS } from "./constants";
import { Lead, Country, RecentSearchQuery } from "./types";
import { searchLeads } from "./services/geminiService";
import PrecisionFissionScout from "./components/PrecisionFissionScout";
import { validateWhatsAppMobile, normalizeWhatsAppNumber, generateWhatsAppHunterUrls } from "./utils/phoneUtils";

const RECENT_SEARCHES_STORAGE_KEY = "powerlead_recent_searches";

export default function App() {
  const [activeTab, setActiveTab] = useState<"precision_fission" | "keyword">("precision_fission");
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editPhoneValue, setEditPhoneValue] = useState<string>("");
  const [expandedHunterLeadId, setExpandedHunterLeadId] = useState<string | null>(null);

  // Store selected keywords for each preset category
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    SEARCH_PRESETS.map((p, idx) => 
      idx === 0 || idx === 6 ? p.keywords[0] : ""
    )
  );
  const [customKeyword, setCustomKeyword] = useState("");
  const [useLocalLanguage, setUseLocalLanguage] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterValidWhatsAppOnly, setFilterValidWhatsAppOnly] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Recent Searches state stored in local storage (last 5 searches)
  const [recentSearches, setRecentSearches] = useState<RecentSearchQuery[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 5);
        }
      }
    } catch (e) {
      console.error("Failed to load recent searches from localStorage:", e);
    }
    return [];
  });

  const activeKeywordList = [...selectedKeywords.filter(k => Boolean(k)), customKeyword].filter(k => Boolean(k));
  const combinedKeyword = activeKeywordList.join(" ");

  const saveRecentSearch = (
    country: Country,
    keywordString: string,
    localLang: boolean,
    keywordsArray: string[],
    customKw: string
  ) => {
    const trimmed = keywordString.trim();
    if (!trimmed) return;

    setRecentSearches(prev => {
      // Remove any prior duplicate with same country and keyword
      const filtered = prev.filter(
        item => !(item.countryCode === country.code && item.keywords.trim().toLowerCase() === trimmed.toLowerCase())
      );

      const newItem: RecentSearchQuery = {
        id: `${country.code}-${Date.now()}`,
        countryCode: country.code,
        countryName: country.name,
        countryPrefix: country.prefix,
        keywords: trimmed,
        selectedKeywords: keywordsArray,
        customKeyword: customKw,
        useLocalLanguage: localLang,
        timestamp: Date.now(),
      };

      const updated = [newItem, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist recent searches to localStorage:", e);
      }
      return updated;
    });
  };

  const executeSearch = async (
    targetCountry: Country,
    keywordsStr: string,
    targetUseLocal: boolean,
    targetSelectedKeywords?: string[],
    targetCustomKw?: string
  ) => {
    const cleanKeywords = keywordsStr.trim();
    if (!cleanKeywords) return;

    setIsSearching(true);
    setSearchError(null);

    // Persist to recent searches
    saveRecentSearch(
      targetCountry,
      cleanKeywords,
      targetUseLocal,
      targetSelectedKeywords || selectedKeywords,
      targetCustomKw !== undefined ? targetCustomKw : customKeyword
    );

    try {
      const results = await searchLeads(
        targetCountry.name,
        targetCountry.prefix,
        cleanKeywords,
        targetCountry.localLanguage,
        targetUseLocal,
        targetCountry.isRegion,
        targetCountry.countriesInRegion
      );
      setLeads(results);
    } catch (error: any) {
      console.error(error);
      setSearchError(error?.message || "搜索请求失败，请检查网络或稍后重试");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!combinedKeyword) return;
    executeSearch(selectedCountry, combinedKeyword, useLocalLanguage, selectedKeywords, customKeyword);
  };

  const handleRerunSearch = (item: RecentSearchQuery) => {
    const matchedCountry = COUNTRIES.find(c => c.code === item.countryCode) || COUNTRIES[0];
    
    // Set UI filters state
    setSelectedCountry(matchedCountry);
    setUseLocalLanguage(Boolean(item.useLocalLanguage));
    
    if (item.selectedKeywords && item.selectedKeywords.length === SEARCH_PRESETS.length) {
      setSelectedKeywords(item.selectedKeywords);
      setCustomKeyword(item.customKeyword || "");
    } else {
      setSelectedKeywords(SEARCH_PRESETS.map(() => ""));
      setCustomKeyword(item.keywords);
    }

    // Switch to keyword search tab
    setActiveTab("keyword");

    // Immediately execute search
    executeSearch(
      matchedCountry,
      item.keywords,
      Boolean(item.useLocalLanguage),
      item.selectedKeywords,
      item.customKeyword
    );
  };

  const handleLoadQueryOnly = (item: RecentSearchQuery) => {
    const matchedCountry = COUNTRIES.find(c => c.code === item.countryCode) || COUNTRIES[0];
    setSelectedCountry(matchedCountry);
    setUseLocalLanguage(Boolean(item.useLocalLanguage));

    if (item.selectedKeywords && item.selectedKeywords.length === SEARCH_PRESETS.length) {
      setSelectedKeywords(item.selectedKeywords);
      setCustomKeyword(item.customKeyword || "");
    } else {
      setSelectedKeywords(SEARCH_PRESETS.map(() => ""));
      setCustomKeyword(item.keywords);
    }

    setActiveTab("keyword");
  };

  const handleDeleteRecentSearch = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to delete recent search:", err);
      }
      return updated;
    });
  };

  const handleClearAllRecentSearches = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear recent searches:", err);
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "刚刚";
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`;
    return new Date(timestamp).toLocaleDateString();
  };

  const randomizeAllKeywords = () => {
    setSelectedKeywords(
      SEARCH_PRESETS.map(p => p.keywords[Math.floor(Math.random() * p.keywords.length)])
    );
  };

  const clearAllKeywords = () => {
    setSelectedKeywords(SEARCH_PRESETS.map(() => ""));
    setCustomKeyword("");
  };

  const removeKeywordAtIndex = (index: number) => {
    const newKeywords = [...selectedKeywords];
    newKeywords[index] = "";
    setSelectedKeywords(newKeywords);
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...selectedKeywords];
    newKeywords[index] = value;
    setSelectedKeywords(newKeywords);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ["Company Name", "Country", "Phone Number", "WhatsApp Status", "Digits Count", "Website", "Business Description"];
    const rows = leads.map(l => {
      const val = validateWhatsAppMobile(l.phoneNumber, l.country || selectedCountry.name);
      return [
        `"${l.companyName.replace(/"/g, '""')}"`,
        `"${(l.country || selectedCountry.name).replace(/"/g, '""')}"`,
        `"${val.normalizedNumber.replace(/"/g, '""')}"`,
        `"${val.statusLabel.replace(/"/g, '""')}"`,
        `"${val.digitsCount}"`,
        `"${(l.website || "").replace(/"/g, '""')}"`,
        `"${(l.description || "").replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `B2B_Prospects_${selectedCountry.code}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Top Professional Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-900/50">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">PowerLead B2B</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                  PRO V3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Generator Parts & Power Equipment Lead Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {leads.length > 0 && (
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV ({leads.length})</span>
              </button>
            )}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Web Search Ready</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Hero Banner */}
        <header className="mb-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>Global B2B Market Prospecting Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Generator Spare Parts & Equipment Lead Scout
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover verified overseas buyers, repair centers, wholesalers, and panel builders for generator controllers, AVRs, rectifiers, battery chargers, solenoids, and diesel engine parts.
              </p>
            </div>

            <div className="flex sm:flex-col gap-3 justify-start lg:items-end">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 min-w-[200px] text-left lg:text-right">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center lg:justify-end gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hardware Clusters</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">8 Product Modules</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mode Navigation Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/90 rounded-2xl w-full sm:w-fit mb-8 border border-slate-300/70 shadow-xs">
          <button
            onClick={() => setActiveTab("precision_fission")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === "precision_fission"
                ? "bg-white text-indigo-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Network className="w-4 h-4 text-indigo-600" />
            <span>精准客户拓展 (产业带裂变)</span>
            <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              NEW
            </span>
          </button>

          <button
            onClick={() => setActiveTab("keyword")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === "keyword"
                ? "bg-white text-indigo-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Search className="w-4 h-4 text-indigo-600" />
            <span>关键词全域检索 (Keyword Search)</span>
            {recentSearches.length > 0 && (
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                {recentSearches.length} 历史
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Precision Client Fission Prospecting */}
        {activeTab === "precision_fission" && (
          <PrecisionFissionScout />
        )}

        {/* Tab 2: Keyword Search Interface */}
        {activeTab === "keyword" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Search & Filters Panel (Sidebar) */}
            <div className="lg:col-span-5 space-y-6">

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Search Configuration
                  </h2>
                </div>
                <button 
                  onClick={clearAllKeywords}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              {/* Target Country / Region */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" /> Target Market / Country
                </label>
                <div className="relative">
                  <select 
                    value={selectedCountry.code}
                    onChange={(e) => setSelectedCountry(COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer transition-all"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.nativeName}) {c.prefix}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Language Search Strategy */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-indigo-600" /> Search Term Strategy
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                  <button
                    onClick={() => setUseLocalLanguage(false)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      !useLocalLanguage 
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English Direct
                  </button>
                  <button
                    onClick={() => setUseLocalLanguage(true)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      useLocalLanguage 
                        ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Native Bilingual
                  </button>
                </div>
              </div>

              {/* Product Category Selectors */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" /> Product & Category Filters
                  </label>
                  <button 
                    onClick={randomizeAllKeywords}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:bg-indigo-50 px-2 py-0.5 rounded transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Randomize
                  </button>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {SEARCH_PRESETS.map((preset, idx) => (
                    <div key={preset.category} className="relative">
                      <select
                        value={selectedKeywords[idx] || ""}
                        onChange={(e) => updateKeyword(idx, e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-medium transition-all appearance-none cursor-pointer ${
                          selectedKeywords[idx] 
                            ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <option value="" className="bg-white text-slate-400">-- Any / All ({preset.category}) --</option>
                        {preset.keywords.map(kw => (
                          <option key={kw} value={kw} className="bg-white text-slate-800 font-medium">{kw}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Model / Keyword Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-indigo-600" /> Custom Part / Brand Model
                </label>
                <input 
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="e.g. DGS6120N / RSK5001 / Leroy Somer..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* Active Search Filter Tags */}
              {activeKeywordList.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Active Query Signals:</span>
                    <span className="text-indigo-600 font-bold">{activeKeywordList.length} criteria</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedKeywords.map((kw, idx) => kw ? (
                      <span 
                        key={`kw-${idx}`}
                        onClick={() => removeKeywordAtIndex(idx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-semibold border border-indigo-200 cursor-pointer hover:bg-indigo-200 transition-colors"
                      >
                        {kw} ×
                      </span>
                    ) : null)}
                    {customKeyword && (
                      <span 
                        onClick={() => setCustomKeyword("")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-[11px] font-semibold border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors"
                      >
                        {customKeyword} ×
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Trigger Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching || !combinedKeyword}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    联网挖掘与工业实体校验中...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Initiate Lead Search
                  </>
                )}
              </button>

              {searchError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-rose-800">搜索请求异常</div>
                    <div className="text-rose-600 mt-0.5 leading-relaxed">{searchError}</div>
                  </div>
                </div>
              )}

            </div>

            {/* Recent Searches Section in the Sidebar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Recent Searches
                  </h2>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                    {recentSearches.length}/5
                  </span>
                </div>
                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearAllRecentSearches}
                    className="text-xs text-slate-400 hover:text-rose-600 font-medium flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Clear all recent search history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {recentSearches.length === 0 ? (
                <div className="py-6 px-4 text-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200 space-y-2">
                  <Clock className="w-7 h-7 text-slate-300 mx-auto" />
                  <div className="text-xs font-semibold text-slate-600">
                    No recent searches yet
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Your last 5 searches (target country + keywords) will be saved in local storage for quick one-click re-runs.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentSearches.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-3 space-y-2.5 transition-all shadow-2xs hover:shadow-xs relative"
                    >
                      {/* Top Line: Country & Time & Delete */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                            <Globe className="w-3 h-3 text-indigo-600" />
                            <span>{item.countryName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({item.countryPrefix})</span>
                          </span>
                          {item.useLocalLanguage && (
                            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded">
                              Bilingual
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimeAgo(item.timestamp)}
                          </span>
                          <button
                            onClick={(e) => handleDeleteRecentSearch(item.id, e)}
                            className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1 rounded transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                            title="Delete this search"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Line: Keywords display */}
                      <div 
                        onClick={() => handleLoadQueryOnly(item)}
                        className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-indigo-200 transition-colors group/kw"
                        title="Click to load these query parameters into the search form"
                      >
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <Search className="w-3 h-3 text-slate-400 shrink-0 group-hover/kw:text-indigo-600 transition-colors" />
                          <span className="truncate flex-1 font-mono text-[11px] text-slate-800">
                            {item.keywords}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action: Re-run button & Load button */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <button
                          onClick={() => handleLoadQueryOnly(item)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
                          title="Load keywords and country into form without searching"
                        >
                          Load Query
                        </button>

                        <button
                          onClick={() => handleRerunSearch(item)}
                          disabled={isSearching}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3 py-1 rounded-lg transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                          title="Re-run search immediately"
                        >
                          <RotateCw className={`w-3 h-3 ${isSearching ? "animate-spin" : ""}`} />
                          <span>Re-run Now</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Verified Leads Output List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Discovered Industry Prospects
                </h2>
              </div>
              {leads.length > 0 && (
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                  {leads.length} Verified B2B Leads
                </span>
              )}
            </div>

            {/* WhatsApp Quality Filter Bar */}
            {leads.length > 0 && (
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
                    leads.filter(l => {
                      if (!filterValidWhatsAppOnly) return true;
                      return validateWhatsAppMobile(l.phoneNumber, l.country || selectedCountry.name).isValidWhatsAppMobile;
                    }).length
                  }</strong> / {leads.length} 家潜客
                  {filterValidWhatsAppOnly && leads.length - leads.filter(l => validateWhatsAppMobile(l.phoneNumber, l.country || selectedCountry.name).isValidWhatsAppMobile).length > 0 && (
                    <span className="text-slate-400 ml-1.5">
                      (已剔除 {leads.length - leads.filter(l => validateWhatsAppMobile(l.phoneNumber, l.country || selectedCountry.name).isValidWhatsAppMobile).length} 家固话/异常号码)
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {leads.length === 0 && !isSearching && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white border border-slate-200 rounded-2xl shadow-sm"
                  >
                    <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">Awaiting Search Trigger</h3>
                    <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                      Select your target market region and required spare part categories (e.g., DGS6120N, AVR, Rectifiers), then click <strong>Initiate Lead Search</strong> to discover overseas buyers.
                    </p>
                  </motion.div>
                )}

                {isSearching && (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-40 rounded-2xl bg-white border border-slate-200 animate-pulse p-5 space-y-3">
                        <div className="h-5 bg-slate-100 rounded w-1/3" />
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                        <div className="h-12 bg-slate-50 rounded w-full" />
                      </div>
                    ))}
                  </div>
                )}

                {leads
                  .filter(lead => {
                    if (!filterValidWhatsAppOnly) return true;
                    const val = validateWhatsAppMobile(lead.phoneNumber, lead.country || selectedCountry.name);
                    return val.isValidWhatsAppMobile;
                  })
                  .map((lead, idx) => {
                    const val = validateWhatsAppMobile(lead.phoneNumber, lead.country || selectedCountry.name);
                    return (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3.5 relative"
                      >
                        {/* Top Header Row: Company Name & Country */}
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                {lead.companyName}
                              </h3>
                            </div>
                            {lead.country && (
                              <span className="inline-block text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                📍 {lead.country}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => copyToClipboard(lead.companyName, `${lead.id}-name`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                            title="Copy Company Name"
                          >
                            {copiedId === `${lead.id}-name` ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copied</span>
                            ) : (
                              <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy Name</span>
                            )}
                          </button>
                        </div>

                        {/* Phone / WhatsApp & Official Website Links */}
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
                                    title="打开 WhatsApp 立即对话"
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
                                    setEditingLeadId(editingLeadId === lead.id ? null : lead.id);
                                    setEditPhoneValue(lead.phoneNumber || "");
                                  }}
                                  className="text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1 transition-all"
                                  title="修改或录入销售手机号"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>改号</span>
                                </button>

                                <button
                                  onClick={() => setExpandedHunterLeadId(expandedHunterLeadId === lead.id ? null : lead.id)}
                                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all border ${
                                    expandedHunterLeadId === lead.id 
                                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" 
                                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
                                  }`}
                                  title="打开 WhatsApp 深度猎手：定向挖掘该企业业务员手机与WhatsApp"
                                >
                                  <Search className="w-3 h-3" />
                                  <span>WhatsApp 猎手 {expandedHunterLeadId === lead.id ? "▲" : "▼"}</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                                  未收录直接手机
                                </span>

                                <button
                                  onClick={() => {
                                    setEditingLeadId(editingLeadId === lead.id ? null : lead.id);
                                    setEditPhoneValue("");
                                  }}
                                  className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>录入手机</span>
                                </button>

                                <button
                                  onClick={() => setExpandedHunterLeadId(expandedHunterLeadId === lead.id ? null : lead.id)}
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
                                  title="域名存在但当前探活超时，可能需要海外网络或代理"
                                >
                                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="max-w-[140px] truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                                    待探活/直连
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent(lead.companyName + ' ' + (lead.country || '') + ' official website')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
                                  title="直接在谷歌实名检索官方主页、企业社媒或黄页"
                                >
                                  <Search className="w-3 h-3" />
                                  <span>谷歌实名直达</span>
                                </a>
                              </div>
                            )
                          ) : (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                                暂无独立域名
                              </span>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(lead.companyName + ' ' + (lead.country || '') + ' official website')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
                                title="在谷歌实名检索该企业官网与主页"
                              >
                                <Search className="w-3 h-3" />
                                <span>🔍 谷歌实名穿透</span>
                              </a>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.companyName + ' ' + (lead.country || ''))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-xl transition-all"
                                title="在 Google Maps 查看其实景与商户主页"
                              >
                                <MapPin className="w-3 h-3 text-rose-500" />
                                <span>地图主页</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Inline Phone Quick Editor */}
                        {editingLeadId === lead.id && (
                          <div className="p-3 bg-slate-50 border border-indigo-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                              <span className="flex items-center gap-1.5 text-indigo-700">
                                <Edit3 className="w-3.5 h-3.5" /> 录入/修改该企业的 WhatsApp 真实手机号:
                              </span>
                              <button 
                                onClick={() => setEditingLeadId(null)}
                                className="text-slate-400 hover:text-slate-600 text-xs"
                              >
                                取消
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                value={editPhoneValue}
                                onChange={(e) => setEditPhoneValue(e.target.value)}
                                placeholder="例如: +966 50 123 4567 或 +971 50 234 5678"
                                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                              />
                              <button
                                onClick={() => {
                                  const normalized = normalizeWhatsAppNumber(editPhoneValue, lead.country || selectedCountry.name);
                                  setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, phoneNumber: normalized } : l));
                                  setEditingLeadId(null);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> 保存更新
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              提示：输入国际区号与手机号（如沙特+966 5开头，阿联酋+971 5开头），保存后将自动生成 WhatsApp 聊天按钮。
                            </div>
                          </div>
                        )}

                        {/* WhatsApp Hunter Expanded Panel */}
                        {expandedHunterLeadId === lead.id && (() => {
                          const hunter = generateWhatsAppHunterUrls(lead.companyName, lead.country || selectedCountry.name);
                          return (
                            <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/60 border border-indigo-200 rounded-xl space-y-2.5 shadow-xs">
                              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>WhatsApp 深度猎手 · 全网穿透挖掘该企业销售专线</span>
                                </div>
                                <button 
                                  onClick={() => setExpandedHunterLeadId(null)}
                                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                                >
                                  ✕
                                </button>
                              </div>

                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                海外工业采购商通常在 Facebook 商业主页、Google Maps 或官网 Contact 页面公开个人 WhatsApp 手机。点击下方定向语法一键穿透获取：
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

                      {/* Business Profile & Chinese Translation Description */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>公司简介与业务范围 (Business Profile)</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {lead.description}
                        </p>
                        {lead.originalDescription && (
                          <p className="text-[11px] text-slate-400 italic border-t border-slate-200/60 pt-1 mt-1">
                            Ref: {lead.originalDescription}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
        )}
      </main>


      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-1">
          <p className="font-semibold text-slate-700">
            PowerLead B2B Prospector • Global Generator Equipment Intelligence Platform
          </p>
          <p className="text-[11px] text-slate-400">
            Automated B2B Lead Scraping & Market Discovery
          </p>
        </div>
      </footer>
    </div>
  );
}
