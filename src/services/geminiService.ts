import { Lead, PrecisionFissionResult, BenchmarkCandidate } from "../types";

// Helper to safely execute a POST request and parse JSON without ever triggering HTML/doctype SyntaxErrors
async function safePostJson<T>(
  endpoint: string,
  payload: any,
  endpointName: string,
  timeoutMs: number = 28000
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    console.error(`Network error calling ${endpoint}:`, err);
    if (err?.name === "TimeoutError" || err?.message?.includes("timeout")) {
      throw new Error(`${endpointName} 请求超时，请稍后刷新重试。`);
    }
    throw new Error(`${endpointName} 无法连接后台服务，服务正在重启或网络波动，请稍候 3 秒后重试。`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const rawText = await response.text().catch(() => "");
    if (!response.ok) {
      if (response.status === 504 || rawText.includes("504 Gateway Time-out")) {
        throw new Error("服务器计算超时，请重试或简化搜索关键词。");
      }
      if (response.status === 502 || response.status === 503) {
        throw new Error("服务暂未就绪，请稍后刷新重试。");
      }
      throw new Error(`服务返回非JSON响应 (状态码 ${response.status})`);
    }
    // If response was 200 but returned HTML (e.g. during dev server restart)
    throw new Error(`服务正在初始化中，请稍候 2 秒后重试。`);
  }

  let data: any;
  try {
    data = await response.json();
  } catch (err: any) {
    throw new Error(`${endpointName} 数据解析失败，请重新尝试。`);
  }

  if (!response.ok) {
    throw new Error(data?.error || `服务器响应异常 (状态码: ${response.status})`);
  }

  return data as T;
}

/**
 * Searches for B2B leads by calling the server-side Gemini API route.
 */
export async function searchLeads(
  country: string,
  prefix: string,
  keyword: string,
  language: string,
  useLocalLanguage: boolean,
  isRegion?: boolean,
  countriesInRegion?: string[]
): Promise<Lead[]> {
  try {
    const data = await safePostJson<Lead[]>(
      "/api/gemini/search",
      {
        country,
        prefix,
        keyword,
        language,
        useLocalLanguage,
        isRegion,
        countriesInRegion,
      },
      "关键词拓客",
      28000
    );
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Error in keyword lead search:", error);
    throw error;
  }
}

/**
 * Executes the 3-step Precision Fission Intelligence workflow by calling
 * the server-side Gemini API route.
 */
export async function investigateAndFissionLeads(
  seedCompanyName: string,
  seedAddress: string,
  focusDescription: string
): Promise<PrecisionFissionResult | null> {
  try {
    const data = await safePostJson<PrecisionFissionResult>(
      "/api/gemini/fission",
      {
        seedCompanyName,
        seedAddress,
        focusDescription,
      },
      "产业集聚裂变",
      28000
    );
    return data;
  } catch (error: any) {
    console.error("Error in precision fission prospecting:", error);
    throw error;
  }
}

/**
 * Automatically locates an authentic, active benchmark seed company and exact street address
 * in a target country's primary industrial machinery / diesel generator cluster.
 */
export async function locateBenchmarkCompany(
  countryName: string,
  excludeNames: string[] = []
): Promise<BenchmarkCandidate | null> {
  try {
    const data = await safePostJson<BenchmarkCandidate>(
      "/api/gemini/benchmark",
      {
        countryName,
        excludeNames,
      },
      "标杆企业挖掘",
      25000
    );
    return data;
  } catch (error: any) {
    console.error("Error locating benchmark company:", error);
    throw error;
  }
}
