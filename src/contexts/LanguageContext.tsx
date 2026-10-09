import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'gu' | 'hi';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'shivam_language_v1';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top strip
    'strip.flagship': 'SHIVAM ELECTRONICS FLAGSHIP SHOWROOM · JOLVA, GUJARAT',
    'strip.authorized': '✦ Authorized Brand Partner (Sony, Samsung, LG, Voltas, Bosch)',
    'strip.hours': 'Open Today: 10:00 AM – 9:00 PM',

    // Nav Links
    'nav.home': 'Home',
    'nav.collections': 'Collections',
    'nav.shop': 'Shop All',
    'nav.brands': 'Brands',
    'nav.gallery': 'Gallery',
    'nav.offers': 'Festive Deals',
    'nav.showroom': 'Showroom & Map',
    'nav.tokens': 'My Tokens',

    // Header Actions
    'header.search': 'Search',
    'header.searchPlaceholder': 'Search 4K OLED TVs, Refrigerators, Teakwood Beds, Inverter ACs...',
    'header.cart': 'Showroom Cart',
    'header.signIn': 'Sign In',
    'header.account': 'Account',
    'header.signOut': 'Sign Out',
    'header.bookVisit': 'Book Showroom Visit',
    'header.bookShort': 'Book Visit',
    'header.call': 'Call Showroom',
    'header.tokensVoucher': 'Showroom Voucher Pass',

    // CTAs & Badges
    'cta.addToCart': 'Add to Cart & Lock Price',
    'cta.lockShowroomPrice': 'Lock Showroom Price',
    'cta.whatsappQuote': 'WhatsApp Quote',
    'cta.bookDemo': 'Book In-Store Demo',
    'cta.inStock': 'In Stock at Jolva Showroom',
    'cta.zeroEmi': '0% Zero-Cost EMI Available',
    'cta.saved': 'Saved',
    'cta.perMonth': 'month',

    // Mobile Bottom
    'mobile.home': 'Home',
    'mobile.shop': 'Shop',
    'mobile.cart': 'Cart',
    'mobile.tokens': 'Tokens',
    'mobile.showroom': 'Showroom',
  },

  gu: {
    // Top strip (Gujarati)
    'strip.flagship': 'શિવમ ઇલેક્ટ્રોનિક્સ ફ્લેગશિપ શોરૂમ · જોલવા, ગુજરાત',
    'strip.authorized': '✦ અધિકૃત બ્રાન્ડ પાર્ટનર (Sony, Samsung, LG, Voltas, Bosch)',
    'strip.hours': 'આજે ખુલ્લું: સવારે 10:00 – રાત્રે 9:00',

    // Nav Links
    'nav.home': 'હોમ',
    'nav.collections': 'કલેક્શન',
    'nav.shop': 'બધા ઉત્પાદનો',
    'nav.brands': 'બ્રાન્ડ્સ',
    'nav.gallery': 'શોરૂમ ગેલેરી',
    'nav.offers': 'તહેવાર ઑફર્સ',
    'nav.showroom': 'શોરૂમ અને નકશો',
    'nav.tokens': 'મારા ટોકન',

    // Header Actions
    'header.search': 'શોધો',
    'header.searchPlaceholder': '4K ટીવી, ફ્રિજ, સાગના પલંગ, ઇન્વર્ટર AC શોધો...',
    'header.cart': 'શોરૂમ કાર્ટ',
    'header.signIn': 'સાઇન ઇન',
    'header.account': 'ખાતું',
    'header.signOut': 'સાઇન આઉટ',
    'header.bookVisit': 'શોરૂમ મુલાકાત બુક કરો',
    'header.bookShort': 'મુલાકાત બુક કરો',
    'header.call': 'શોરૂમ સંપર્ક કરો',
    'header.tokensVoucher': 'શોરૂમ વાઉચર પાસ',

    // CTAs & Badges
    'cta.addToCart': 'કાર્ટમાં ઉમેરો અને ભાવ લોક કરો',
    'cta.lockShowroomPrice': 'શોરૂમ ભાવ લોક કરો',
    'cta.whatsappQuote': 'WhatsApp પૂછપરછ',
    'cta.bookDemo': 'લાઇવ ડેમો બુક કરો',
    'cta.inStock': 'જોલવા શોરૂમમાં સ્ટોક ઉપલબ્ધ છે',
    'cta.zeroEmi': '0% વ્યાજ વગર EMI ઉપલબ્ધ',
    'cta.saved': 'બચત',
    'cta.perMonth': 'મહિને',

    // Mobile Bottom
    'mobile.home': 'હોમ',
    'mobile.shop': 'શોપ',
    'mobile.cart': 'કાર્ટ',
    'mobile.tokens': 'ટોકન',
    'mobile.showroom': 'શોરૂમ',
  },

  hi: {
    // Top strip (Hindi)
    'strip.flagship': 'शिवम इलेक्ट्रॉनिक्स फ्लैगशिप शोरूम · जोलवा, गुजरात',
    'strip.authorized': '✦ अधिकृत ब्रांड पार्टनर (Sony, Samsung, LG, Voltas, Bosch)',
    'strip.hours': 'आज खुला है: सुबह 10:00 – रात 9:00',

    // Nav Links
    'nav.home': 'होम',
    'nav.collections': 'कलेक्शन',
    'nav.shop': 'सभी प्रोडक्ट्स',
    'nav.brands': 'ब्रांड्स',
    'nav.gallery': 'शोरूम गैलरी',
    'nav.offers': 'फेस्टिव ऑफर्स',
    'nav.showroom': 'शोरूम और मैप',
    'nav.tokens': 'मेरे टोकन',

    // Header Actions
    'header.search': 'खोजें',
    'header.searchPlaceholder': '4K टीवी, फ्रिज, सागवान बेड, इन्वर्टर AC खोजें...',
    'header.cart': 'शोरूम कार्ट',
    'header.signIn': 'साइन इन',
    'header.account': 'अकाउंट',
    'header.signOut': 'साइन आउट',
    'header.bookVisit': 'शोरूम विजिट बुक करें',
    'header.bookShort': 'विजिट बुक करें',
    'header.call': 'शोरूम कॉल करें',
    'header.tokensVoucher': 'शोरूम वाउचर पास',

    // CTAs & Badges
    'cta.addToCart': 'कार्ट में जोड़ें और रेट लॉक करें',
    'cta.lockShowroomPrice': 'शोरूम रेट लॉक करें',
    'cta.whatsappQuote': 'WhatsApp पूछताछ',
    'cta.bookDemo': 'लाइव स्टोर डेमो',
    'cta.inStock': 'जोलवा शोरूम में स्टॉक उपलब्ध है',
    'cta.zeroEmi': '0% ब्याज EMI उपलब्ध',
    'cta.saved': 'बचत',
    'cta.perMonth': 'माह',

    // Mobile Bottom
    'mobile.home': 'होम',
    'mobile.shop': 'शॉप',
    'mobile.cart': 'कार्ट',
    'mobile.tokens': 'टोकन',
    'mobile.showroom': 'शोरूम',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language;
      if (stored === 'en' || stored === 'gu' || stored === 'hi') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
