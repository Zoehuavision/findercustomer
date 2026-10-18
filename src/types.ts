export interface Lead {
  id: string;
  companyName: string;
  phoneNumber: string;
  description: string;
  originalDescription?: string;
  website?: string;
  websiteAccessible?: boolean;
  websiteCheckDone?: boolean;
  country: string;
  addressInCluster?: string;
  relationshipToSeed?: string;
}

export interface SeedCompanyInvestigation {
  companyName: string;
  address: string;
  phoneNumber: string;
  website: string;
  chineseDescription: string;
  mainBrands: string[];
  businessType: string;
}

export interface RegionalClusterAnalysis {
  industrialParkOrStreet: string;
  cityAndCountry: string;
  clusterDensity: string;
  clusterOverview: string;
  keyIndustryTypes: string[];
}

export interface PrecisionFissionResult {
  seedCompany: SeedCompanyInvestigation;
  clusterAnalysis: RegionalClusterAnalysis;
  fissionLeads: Lead[];
}

export interface BenchmarkCandidate {
  companyName: string;
  seedAddress: string;
  clusterName: string;
  city: string;
  country: string;
  phoneNumber?: string;
  website?: string;
  chineseDescription: string;
  mainBrands?: string[];
  businessType?: string;
  whyGoodForFission: string;
  recommendedFocus?: string;
}

export interface Country {
  name: string;
  code: string;
  prefix: string;
  localLanguage: string;
  nativeName: string;
  isRegion?: boolean;
  countriesInRegion?: string[];
}

export interface SearchPreset {
  category: string;
  keywords: string[];
}

export interface RecentSearchQuery {
  id: string;
  countryCode: string;
  countryName: string;
  countryPrefix: string;
  keywords: string;
  selectedKeywords?: string[];
  customKeyword?: string;
  useLocalLanguage?: boolean;
  timestamp: number;
}

export interface CompanyNoteEntry {
  companyName: string;
  notes: string;
  updatedAt: number;
}
