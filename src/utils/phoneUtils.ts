/**
 * Utility functions for validating, cleaning and formatting international phone numbers for WhatsApp.
 */

export interface PhoneValidationResult {
  isValidWhatsAppMobile: boolean;
  isLandline: boolean;
  isPlaceholderOrDummy?: boolean;
  normalizedNumber: string;
  whatsappUrl: string | null;
  digitsCount: number;
  statusLabel: string;
  tagColor: "green" | "amber" | "gray";
  reasonText?: string;
}

export interface WhatsAppHunterLinks {
  googleWaSearch: string;
  waMeDomainSearch: string;
  facebookBusinessSearch: string;
  linkedinPersonnelSearch: string;
}

/**
 * Generate targeted Google Dorks / Search queries to hunt for an enterprise's real WhatsApp
 */
export function generateWhatsAppHunterUrls(companyName: string, countryHint?: string): WhatsAppHunterLinks {
  const cleanName = companyName.trim();
  const countryTag = countryHint ? ` ${countryHint.split(" ")[0]}` : "";

  // 1. Comprehensive Google search for WhatsApp / Mobile / Sales Cell
  const googleWaQuery = `"${cleanName}"${countryTag} (WhatsApp OR "wa.me" OR "Sales Mobile" OR "Cell" OR "Contact us via WhatsApp")`;
  
  // 2. Direct wa.me search indexed on Google
  const waMeQuery = `site:wa.me "${cleanName}"`;

  // 3. Facebook Business Page (Facebook has huge WhatsApp Business integrations overseas)
  const fbQuery = `site:facebook.com "${cleanName}" (WhatsApp OR wa.me OR Mobile)`;

  // 4. LinkedIn sales / procurement personnel finder
  const liQuery = `site:linkedin.com/in "${cleanName}" (Sales OR Parts OR Procurement OR Manager)`;

  return {
    googleWaSearch: `https://www.google.com/search?q=${encodeURIComponent(googleWaQuery)}`,
    waMeDomainSearch: `https://www.google.com/search?q=${encodeURIComponent(waMeQuery)}`,
    facebookBusinessSearch: `https://www.google.com/search?q=${encodeURIComponent(fbQuery)}`,
    linkedinPersonnelSearch: `https://www.google.com/search?q=${encodeURIComponent(liQuery)}`,
  };
}

export function normalizeWhatsAppNumber(rawPhone: string, countryHint?: string): string {
  if (!rawPhone) return "";

  // 1. Remove all spaces, dashes, parentheses, brackets, dots, letters
  let cleaned = rawPhone.replace(/[\s\-\(\)\[\]\.\/\\]/g, "");

  // If phone starts with 00, replace with +
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // If missing '+' but has country code (e.g. 971... or 92... or 54...)
  if (!cleaned.startsWith("+") && cleaned.length >= 10) {
    // Only prefix with '+' if it looks like international code
    cleaned = "+" + cleaned;
  }

  // 2. Handle Saudi Arabia (+966) WhatsApp rule:
  // Saudi mobile format is strictly +966 5X XXX XXXX (exactly 9 digits after 966, total 12 digits).
  // If number has +966 05... (13 digits), strip the leading 0!
  // If local 05... (10 digits) with Saudi hint, convert to +966 5...
  if (cleaned.startsWith("+966") || (countryHint && (countryHint.includes("Saudi") || countryHint.includes("沙特") || countryHint.includes("Riyadh") || countryHint.includes("利雅得")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("00966")) digits = digits.slice(2);
    if (digits.startsWith("96605")) {
      digits = "966" + digits.slice(4);
    } else if (digits.startsWith("05") && digits.length === 10) {
      digits = "966" + digits.slice(1);
    } else if (digits.startsWith("5") && digits.length === 9) {
      digits = "966" + digits;
    }
    // Auto-heal truncated 8-digit local mobile numbers:
    if (digits.startsWith("9665") && digits.length === 11) {
      digits = digits.slice(0, 5) + "2" + digits.slice(5);
    }
    cleaned = "+" + digits;
  }

  // 3. Handle UAE (+971) WhatsApp rule:
  // UAE mobile is strictly +971 5X XXX XXXX (9 digits after 971, total 12 digits)
  if (cleaned.startsWith("+971") || (countryHint && (countryHint.includes("UAE") || countryHint.includes("阿联酋") || countryHint.includes("Dubai") || countryHint.includes("迪拜")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("00971")) digits = digits.slice(2);
    if (digits.startsWith("97105")) {
      digits = "971" + digits.slice(4);
    } else if (digits.startsWith("05") && digits.length === 10) {
      digits = "971" + digits.slice(1);
    } else if (digits.startsWith("5") && digits.length === 9) {
      digits = "971" + digits;
    }
    if (digits.startsWith("9715") && digits.length === 11) {
      digits = digits.slice(0, 5) + "2" + digits.slice(5);
    }
    cleaned = "+" + digits;
  }

  // 4. Handle Kuwait (+965) WhatsApp rule:
  // Kuwait mobile is strictly 8 digits after 965 (total 11 digits)
  if (cleaned.startsWith("+965") || (countryHint && (countryHint.includes("Kuwait") || countryHint.includes("科威特")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("00965")) digits = digits.slice(2);
    if (digits.startsWith("0") && digits.length === 9) digits = "965" + digits.slice(1);
    cleaned = "+" + digits;
  }

  // 5. Handle Qatar (+974) WhatsApp rule:
  // Qatar mobile is strictly 8 digits after 974 (total 11 digits)
  if (cleaned.startsWith("+974") || (countryHint && (countryHint.includes("Qatar") || countryHint.includes("卡塔尔")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("00974")) digits = digits.slice(2);
    cleaned = "+" + digits;
  }

  // 6. Handle Oman (+968) WhatsApp rule:
  // Oman mobile is strictly 8 digits after 968 (total 11 digits)
  if (cleaned.startsWith("+968") || (countryHint && (countryHint.includes("Oman") || countryHint.includes("阿曼")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("00968")) digits = digits.slice(2);
    cleaned = "+" + digits;
  }

  // 7. Handle Chile (+56) WhatsApp rule:
  // Chile mobile is strictly +56 9 XXXX XXXX (9 digits after 56, total 11 digits)
  if (cleaned.startsWith("+56") || (countryHint && (countryHint.includes("Chile") || countryHint.includes("智利") || countryHint.includes("Santiago")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("0056")) digits = digits.slice(2);
    if (digits.startsWith("5609")) {
      digits = "56" + digits.slice(3);
    } else if (digits.startsWith("9") && digits.length === 9) {
      digits = "56" + digits;
    }
    if (digits.startsWith("569") && digits.length === 10) {
      digits = digits.slice(0, 4) + "5" + digits.slice(4);
    }
    cleaned = "+" + digits;
  }

  // 8. Handle Egypt (+20) WhatsApp rule:
  // Egypt mobile is +20 1X XXXX XXXX (10 digits after 20, total 12 digits)
  if (cleaned.startsWith("+20") || (countryHint && (countryHint.includes("Egypt") || countryHint.includes("埃及") || countryHint.includes("Cairo")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("0020")) digits = digits.slice(2);
    if (digits.startsWith("2001")) {
      digits = "20" + digits.slice(3);
    } else if (digits.startsWith("01") && digits.length === 11) {
      digits = "20" + digits.slice(1);
    } else if (digits.startsWith("1") && digits.length === 10) {
      digits = "20" + digits;
    }
    cleaned = "+" + digits;
  }

  // 9. Handle Colombia (+57) WhatsApp rule:
  // Colombia mobile is +57 3XX XXX XXXX (10 digits after 57, total 12 digits)
  if (cleaned.startsWith("+57") || (countryHint && (countryHint.includes("Colombia") || countryHint.includes("哥伦比亚") || countryHint.includes("Bogota")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("0057")) digits = digits.slice(2);
    if (digits.startsWith("5703")) {
      digits = "57" + digits.slice(3);
    } else if (digits.startsWith("3") && digits.length === 10) {
      digits = "57" + digits;
    }
    if (digits.startsWith("573") && digits.length === 11) {
      digits = digits.slice(0, 4) + "1" + digits.slice(4);
    }
    cleaned = "+" + digits;
  }

  // 7. Handle Argentina (+54) special WhatsApp formatting rule:
  // Argentine mobile numbers for WhatsApp internationally MUST be formatted as: +54 9 [area code without leading 0] [number without leading 15]
  if (cleaned.startsWith("+54") || (countryHint && (countryHint.includes("AR") || countryHint.includes("Argentina") || countryHint.includes("阿根廷")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("54")) {
      let afterCountry = digits.slice(2);
      if (afterCountry.startsWith("0")) {
        afterCountry = afterCountry.slice(1);
      }
      if (!afterCountry.startsWith("9")) {
        afterCountry = "9" + afterCountry;
      }
      if (afterCountry.startsWith("91115")) {
        afterCountry = "911" + afterCountry.slice(5);
      }
      cleaned = "+54" + afterCountry;
    }
  }

  // 8. Handle Mexico (+52) WhatsApp rule:
  if (cleaned.startsWith("+52")) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("520")) {
      cleaned = "+52" + digits.slice(3);
    }
  }

  // 9. Handle Brazil (+55) WhatsApp rule:
  if (cleaned.startsWith("+55")) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("550")) {
      cleaned = "+55" + digits.slice(3);
    }
  }

  return cleaned;
}

export function validateWhatsAppMobile(rawPhone: string, countryHint?: string): PhoneValidationResult {
  const normalized = normalizeWhatsAppNumber(rawPhone, countryHint);
  const digits = normalized.replace(/\D/g, "");
  const digitsCount = digits.length;

  // A genuine international E.164 mobile number with country code is almost always between 10 and 15 digits.
  // 5 to 9 digits: strictly incomplete / local landline / invalid for WhatsApp
  if (!rawPhone || digitsCount < 10) {
    return {
      isValidWhatsAppMobile: false,
      isLandline: digitsCount >= 6 && digitsCount <= 9,
      normalizedNumber: normalized,
      whatsappUrl: null,
      digitsCount,
      statusLabel: digitsCount > 0 ? `位数不足 (${digitsCount}位非国际手机)` : "未收录手机号",
      tagColor: "gray"
    };
  }

  if (digitsCount > 15) {
    return {
      isValidWhatsAppMobile: false,
      isLandline: false,
      normalizedNumber: normalized,
      whatsappUrl: null,
      digitsCount,
      statusLabel: `号码超长 (${digitsCount}位无效格式)`,
      tagColor: "gray"
    };
  }

  // Detect placeholder/dummy numbers generated by AI or test data:
  // 1. 4 or more identical consecutive digits (e.g. 0000, 1111)
  // 2. Ending in 4 or more zeros (e.g. 0000)
  // 3. Obvious dummy ascending/descending sequences (e.g. 123456, 987654)
  const hasRepeating = /(.)\1{3,}/.test(digits);
  const endsWithZeros = /0000$/.test(digits);
  const isDummySequence = /123456|234567|345678|456789|987654|876543/.test(digits);

  if (hasRepeating || endsWithZeros || isDummySequence) {
    return {
      isValidWhatsAppMobile: false,
      isLandline: false,
      isPlaceholderOrDummy: true,
      normalizedNumber: normalized,
      whatsappUrl: null,
      digitsCount,
      statusLabel: "疑似AI占位虚拟号(非真实手机)",
      tagColor: "amber"
    };
  }

  // Specific country mobile vs landline inspection
  // UAE (+971): Mobile starts with 5 (e.g. 971 50/52/54/55/56/58, length: 12)
  // Landlines start with 2, 3, 4, 6, 7, 9 (e.g. 971 4 xxx xxxx is Dubai landline)
  if (digits.startsWith("971")) {
    const afterCode = digits.slice(3);
    if (!afterCode.startsWith("5")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "阿联酋座机固话(非手机)",
        tagColor: "amber",
        reasonText: "以04/02/06等开头的阿联酋总机座机，未绑定个人/移动端WhatsApp。建议使用下方【WhatsApp 猎手】挖掘销售专线手机号。"
      };
    }
    if (afterCode.length !== 9) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: false,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: `阿联酋手机号长度有误 (${afterCode.length}位/标准为9位)`,
        tagColor: "amber",
        reasonText: `阿联酋手机号码必须为9位数 (以50/52/54/55/56/58开头)，加上国家代码971共12位数字。`
      };
    }
  }

  // Saudi (+966): Mobile starts with 5 (e.g. 966 5X XXX XXXX, length: exactly 12 digits, 9 digits after 966)
  // Landlines start with 11, 12, 13, 14, 16, 17
  if (digits.startsWith("966")) {
    const afterCode = digits.slice(3);
    if (!afterCode.startsWith("5")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "沙特固话座机(非手机)",
        tagColor: "amber",
        reasonText: "以011/012/013开头的沙特固定总机，无法直接加WhatsApp好友。请点击【WhatsApp 猎手】检索其移动电话。"
      };
    }
    if (afterCode.length !== 9) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: false,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: `沙特手机号长度有误 (${afterCode.length}位/标准为9位)`,
        tagColor: "amber",
        reasonText: `沙特手机号码必须为9位数 (以5开头，如 +966 50 123 4567)，加上国家代码966共12位数字。当前只有${afterCode.length}位，无法直接加WhatsApp。建议使用下方【WhatsApp 猎手】挖掘真实销售专线。`
      };
    }
  }

  // Kuwait (+965): Mobile starts with 5, 6, 9 (length: 11). Landlines start with 2
  if (digits.startsWith("965")) {
    const afterCode = digits.slice(3);
    if (!["5", "6", "9"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "科威特固话座机(非手机)",
        tagColor: "amber",
        reasonText: "以2开头的科威特固定座机，不可用于WhatsApp。"
      };
    }
  }

  // Qatar (+974): Mobile starts with 3, 5, 6, 7. Landlines start with 4
  if (digits.startsWith("974")) {
    const afterCode = digits.slice(3);
    if (!["3", "5", "6", "7"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "卡塔尔固话座机(非手机)",
        tagColor: "amber",
        reasonText: "以4开头的卡塔尔座机总机，无WhatsApp移动功能。"
      };
    }
  }

  // Oman (+968): Mobile starts with 7, 9. Landlines start with 2
  if (digits.startsWith("968")) {
    const afterCode = digits.slice(3);
    if (!["7", "9"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "阿曼固话座机(非手机)",
        tagColor: "amber",
        reasonText: "以2开头的阿曼座机，不支持WhatsApp。"
      };
    }
  }

  // Turkey (+90): Mobile starts with 5 (e.g. 90 5xx). Landlines start with 2, 3, 4
  if (digits.startsWith("90")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("5")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "土耳其座机(非手机)",
        tagColor: "amber",
        reasonText: "土耳其固定总机，无法直接加WhatsApp。"
      };
    }
  }

  // United Kingdom (+44): Mobile starts with 7 (e.g. 44 7xxx). Landlines start with 1, 2
  if (digits.startsWith("44")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("7")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "英国座机总机(非手机)",
        tagColor: "amber",
        reasonText: "英国固定电话(01/02开头)，未绑定移动端WhatsApp。"
      };
    }
  }

  // Pakistan (+92): Mobile starts with 3 (e.g. 92 3xx, length: 12)
  // Landlines start with 21 (Karachi), 42 (Lahore), 51 (Islamabad)
  if (digits.startsWith("92")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("3")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "巴基斯坦座机(非手机)",
        tagColor: "amber",
        reasonText: "巴基斯坦城市座机，请点击下方检索其业务手机。"
      };
    }
  }

  // Nigeria (+234): Mobile starts with 7, 8, 9 (e.g. 234 80, length: 13)
  // Landline starts with 1 (Lagos 234 1...)
  if (digits.startsWith("234")) {
    const afterCode = digits.slice(3);
    if (!["7", "8", "9"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "尼日利亚座机(非手机)",
        tagColor: "amber",
        reasonText: "尼日利亚拉各斯等固定总机，无法直接加WhatsApp。"
      };
    }
  }

  // Kenya (+254): Mobile starts with 7, 1
  if (digits.startsWith("254")) {
    const afterCode = digits.slice(3);
    if (!["7", "1"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "肯尼亚座机(非手机)",
        tagColor: "amber",
        reasonText: "肯尼亚固定电话，不支持直接加WhatsApp。"
      };
    }
  }

  // Malaysia (+60): Mobile starts with 1 (e.g. 60 1x)
  if (digits.startsWith("60")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("1")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "马来西亚座机(非手机)",
        tagColor: "amber",
        reasonText: "马来西亚总机座机，非移动手机。"
      };
    }
  }

  // Thailand (+66): Mobile starts with 6, 8, 9
  if (digits.startsWith("66")) {
    const afterCode = digits.slice(2);
    if (!["6", "8", "9"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "泰国座机(非手机)",
        tagColor: "amber",
        reasonText: "泰国固定总机，未开通WhatsApp。"
      };
    }
  }

  // Iraq (+964): Mobile starts with 7 (e.g. 964 7xx, length: 13)
  if (digits.startsWith("964")) {
    const afterCode = digits.slice(3);
    if (!afterCode.startsWith("7")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "伊拉克座机(非手机)",
        tagColor: "amber"
      };
    }
  }

  // Egypt (+20): Mobile starts with 10, 11, 12, 15 (length: 12)
  if (digits.startsWith("20")) {
    const afterCode = digits.slice(2);
    const prefix2 = afterCode.slice(0, 2);
    if (!["10", "11", "12", "15"].includes(prefix2)) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "埃及固定电话(非手机)",
        tagColor: "amber"
      };
    }
  }

  // Vietnam (+84): Mobile starts with 3, 5, 7, 8, 9 (length: 11)
  if (digits.startsWith("84")) {
    const afterCode = digits.slice(2);
    if (!["3", "5", "7", "8", "9"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "越南座机(非手机)",
        tagColor: "amber"
      };
    }
  }

  // Philippines (+63): Mobile starts with 9 (length: 12)
  if (digits.startsWith("63")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("9")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "菲律宾固话(非手机)",
        tagColor: "amber"
      };
    }
  }

  // Indonesia (+62): Mobile starts with 8 (length: 11-14)
  if (digits.startsWith("62")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("8")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "印尼座机(非手机)",
        tagColor: "amber"
      };
    }
  }

  // Argentina (+54): Must have 9 in digits after 54 (WhatsApp requirement)
  if (digits.startsWith("54")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("9")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "阿根廷座机(非WhatsApp手机)",
        tagColor: "amber",
        reasonText: "阿根廷手机加WhatsApp必须包含+54 9前缀。当前号码为普通固话总机。"
      };
    }
  }

  // Brazil (+55): Mobile starts with 9 after 2-digit DDD area code (e.g. 55 11 9xxxx-xxxx)
  if (digits.startsWith("55")) {
    const afterCode = digits.slice(2);
    if (afterCode.length >= 3) {
      const ninthDigit = afterCode.charAt(2);
      if (ninthDigit !== "9") {
        return {
          isValidWhatsAppMobile: false,
          isLandline: true,
          normalizedNumber: normalized,
          whatsappUrl: null,
          digitsCount,
          statusLabel: "巴西固定电话(非手机)",
          tagColor: "amber",
          reasonText: "巴西移动手机在区号后必须以9开头(第9位数字)。当前为固定总机。"
        };
      }
    }
  }

  // Colombia (+57): Mobile starts with 3 (e.g. +57 3xx xxx xxxx, length: 12)
  if (digits.startsWith("57")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("3")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "哥伦比亚座机(非手机)",
        tagColor: "amber",
        reasonText: "以60或1/2/4开头的哥伦比亚城市固话，无法直接接收WhatsApp。哥伦比亚移动手机必须以3开头。"
      };
    }
    if (afterCode.length !== 10) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: false,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: `哥伦比亚手机号长度有误 (${afterCode.length}位/标准为10位)`,
        tagColor: "amber",
        reasonText: `哥伦比亚手机号码必须为10位数 (以3开头，如 +57 310 123 4567)，加上国家代码57共12位数字。`
      };
    }
  }

  // Chile (+56): Mobile starts with 9 (e.g. +56 9 xxxx xxxx, length: 11)
  if (digits.startsWith("56")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("9")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "智利固定电话(非手机)",
        tagColor: "amber",
        reasonText: "以2或其它区号开头的智利座机总机，未开通WhatsApp。智利移动电话必须以9开头。"
      };
    }
    if (afterCode.length !== 9) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: false,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: `智利手机号长度有误 (${afterCode.length}位/标准为9位)`,
        tagColor: "amber",
        reasonText: `智利手机号码必须为9位数 (以9开头，如 +56 9 8123 4567)，加上国家代码56共11位数字。`
      };
    }
  }

  // Peru (+51): Mobile starts with 9 (e.g. +51 9xx xxx xxx, length: 11)
  if (digits.startsWith("51")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("9")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "秘鲁固定座机(非手机)",
        tagColor: "amber",
        reasonText: "秘鲁固定电话(以1等开头)，非移动端WhatsApp。秘鲁手机号须以9开头。"
      };
    }
    if (afterCode.length !== 9) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: false,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: `秘鲁手机号长度有误 (${afterCode.length}位/标准为9位)`,
        tagColor: "amber",
        reasonText: `秘鲁手机号码必须为9位数 (以9开头，如 +51 987 654 321)，加上国家代码51共11位数字。`
      };
    }
  }

  // Ecuador (+593): Mobile starts with 9 (e.g. +593 9xx xxx xxx, length: 12)
  if (digits.startsWith("593")) {
    const afterCode = digits.slice(3);
    if (!afterCode.startsWith("9")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "厄瓜多尔座机(非手机)",
        tagColor: "amber",
        reasonText: "厄瓜多尔固定总机，无法加WhatsApp。移动端手机须以9开头。"
      };
    }
  }

  // Bolivia (+591): Mobile starts with 6 or 7 (length: 11)
  if (digits.startsWith("591")) {
    const afterCode = digits.slice(3);
    if (!["6", "7"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "玻利维亚座机(非手机)",
        tagColor: "amber",
        reasonText: "玻利维亚固定座机，非移动手机。"
      };
    }
  }

  // Venezuela (+58): Mobile starts with 4 (e.g. 0412/0414/0416/0424, length: 12)
  if (digits.startsWith("58")) {
    const afterCode = digits.slice(2);
    if (!afterCode.startsWith("4")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "委内瑞拉固话(非手机)",
        tagColor: "amber",
        reasonText: "委内瑞拉固定电话，无法接收WhatsApp。"
      };
    }
  }

  // Mexico (+52): Mobile must be 10 digits after 52 (e.g. 52 1 xxxxxxxxxx or 52 xxxxxxxxxx)
  if (digits.startsWith("52")) {
    const afterCode = digits.slice(2);
    if (afterCode.length < 10) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "墨西哥号码位数不足",
        tagColor: "amber"
      };
    }
  }

  // South Africa (+27): Mobile starts with 6, 7, 8 (length: 11)
  if (digits.startsWith("27")) {
    const afterCode = digits.slice(2);
    if (!["6", "7", "8"].includes(afterCode.charAt(0))) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "南非固话(非手机)",
        tagColor: "amber"
      };
    }
  }

  // Bangladesh (+880): Mobile starts with 1 (length: 13)
  if (digits.startsWith("880")) {
    const afterCode = digits.slice(3);
    if (!afterCode.startsWith("1")) {
      return {
        isValidWhatsAppMobile: false,
        isLandline: true,
        normalizedNumber: normalized,
        whatsappUrl: null,
        digitsCount,
        statusLabel: "孟加拉座机(非手机)",
        tagColor: "amber"
      };
    }
  }

  // Valid standard mobile number with WhatsApp URL
  return {
    isValidWhatsAppMobile: true,
    isLandline: false,
    normalizedNumber: normalized,
    whatsappUrl: `https://wa.me/${digits}`,
    digitsCount,
    statusLabel: `标准 WhatsApp 手机 (${digitsCount}位)`,
    tagColor: "green"
  };
}

export function getWhatsAppLink(rawPhone: string, countryHint?: string): string | null {
  const validation = validateWhatsAppMobile(rawPhone, countryHint);
  return validation.whatsappUrl;
}
