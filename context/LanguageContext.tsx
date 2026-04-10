import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'om' | 'am';

export interface Translations {
  // Onboarding
  slide1Title: string;
  slide1Sub: string;
  slide2Title: string;
  slide2Sub: string;
  slide3Title: string;
  slide3Sub: string;
  getStarted: string;
  next: string;
  skip: string;

  // Login
  welcomeBack: string;
  secureAccess: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signIn: string;
  forgotPassword: string;
  noAccount: string;
  signUpLink: string;

  // Signup
  createAccount: string;
  joinEcosystem: string;
  fullName: string;
  fullNamePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  iAmA: string;
  renter: string;
  landlord: string;
  agreeTerms: string;
  alreadyHave: string;
  signInLink: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    slide1Title: 'Find Your\nPerfect Home',
    slide1Sub: 'Browse hundreds of verified rentals across Addis Ababa — studios, apartments, villas, and more.',
    slide2Title: 'Smart Filters\n& AI Matching',
    slide2Sub: 'Filter by price, deposit, and utilities. Our AI recommends listings tailored just for your lifestyle.',
    slide3Title: 'Verified Listings\nYou Can Trust',
    slide3Sub: 'Every listing has been physically inspected by the Kira-Net team. No scams, no fake photos.',
    getStarted: 'Get Started',
    next: 'Next',
    skip: 'Skip',
    welcomeBack: 'Welcome back.',
    secureAccess: 'Secure access to the Kira-Net ecosystem.',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    signIn: 'Sign In',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign Up',
    createAccount: 'Create Account',
    joinEcosystem: 'Join the Kira-Net ecosystem.',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Abebe Bekele',
    phone: 'Phone Number',
    phonePlaceholder: '+251 9XX XXX XXX',
    iAmA: 'I am a...',
    renter: 'Renter',
    landlord: 'Landlord',
    agreeTerms: 'I agree to the Terms & Privacy Policy',
    alreadyHave: 'Already have an account?',
    signInLink: 'Sign In',
  },
  om: {
    slide1Title: 'Mana\nBarbaadde Argadhu',
    slide1Sub: 'Addi Ababaa keessatti kiraa manaawwan hedduutti ilaalaa — studio, kutaa, fi villaawwan.',
    slide2Title: 'Fiiltera Ogummaa\n& AI Walsimsiisuun',
    slide2Sub: 'Gatii, kaappaa, fi tajaajila irratti fiili. AI keenya mijeefama jireenya keetti kireefi sirf sirreessa.',
    slide3Title: 'Galmeewwan Mirkannaa\'aman\nAmanamoo',
    slide3Sub: 'Galmeewwan hundumtuu garee Kira-Net tiin qoratamaniiru. Gowwomsi fi suuraa sobaa hin jiru.',
    getStarted: 'Jalqabi',
    next: 'Itti aanu',
    skip: 'Irri darbii',
    welcomeBack: 'Baga deebi\'te.',
    secureAccess: 'Seensa nagahaa Kira-Net geeggeessa.',
    emailLabel: 'Teessoo Imeelii',
    emailPlaceholder: 'ati@fakkeenya.com',
    passwordLabel: 'Jecha-darbii',
    passwordPlaceholder: '••••••••',
    signIn: 'Seeni',
    forgotPassword: 'Jecha-darbii dagatteettaa?',
    noAccount: 'Akkaawuntii hin qabduu?',
    signUpLink: 'Galmaa\'i',
    createAccount: 'Akkaawuntii Hojjedhu',
    joinEcosystem: 'Ecosystemii Kira-Net keessatti makamaa.',
    fullName: 'Maqaa Guutuu',
    fullNamePlaceholder: 'Ababbaa Baqqalaa',
    phone: 'Lakkoofsa Bilbilaa',
    phonePlaceholder: '+251 9XX XXX XXX',
    iAmA: 'Ani...',
    renter: 'Kiraa fuudha',
    landlord: 'Abbaa Mana',
    agreeTerms: 'Gosaawwan & Imaammata Dhuunfaa waliin waliigala',
    alreadyHave: 'Dursitee akkaawuntii qabdaa?',
    signInLink: 'Seeni',
  },
  am: {
    slide1Title: 'ቤትህን\nፈልግ',
    slide1Sub: 'በአዲስ አበባ በሙሉ የተረጋገጡ ቤቶችን ፈልግ — ስቱዲዮ፣ አፓርትማ፣ ቪላ እና ሌሎች።',
    slide2Title: 'ብልህ ፍልተራ\nእና AI ጥምርታ',
    slide2Sub: 'በዋጋ፣ ዲፖዚት እና አገልግሎቶች ፍለጋ ያድርጉ። AI ስርዓታችን ለሕይወትዎ የሚስማማ ቤት ያቀርባል።',
    slide3Title: 'የተረጋገጡ ዝርዝሮች\nማመን ይችላሉ',
    slide3Sub: 'እያንዳንዱ ዝርዝር በ Kira-Net ቡድን ተፈትሾ የተረጋገጠ ነው። ምንም ማጭበርበር የለም።',
    getStarted: 'ጀምር',
    next: 'ቀጣይ',
    skip: 'ዝለል',
    welcomeBack: 'እንኳን ደህና መጡ።',
    secureAccess: 'ወደ Kira-Net ሥርዓት ደህንነቱ የተጠበቀ ቀጣይ።',
    emailLabel: 'የኢሜይል አድራሻ',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'የሚስጥር ቁጥር',
    passwordPlaceholder: '••••••••',
    signIn: 'ግባ',
    forgotPassword: 'የሚስጥር ቁጥር ረሳህ?',
    noAccount: 'መለያ የለህም?',
    signUpLink: 'ተመዝገብ',
    createAccount: 'መለያ ፍጠር',
    joinEcosystem: 'ወደ Kira-Net ሥርዓት ተቀላቀሉ።',
    fullName: 'ሙሉ ስም',
    fullNamePlaceholder: 'አበበ በቀለ',
    phone: 'ስልክ ቁጥር',
    phonePlaceholder: '+251 9XX XXX XXX',
    iAmA: 'እኔ ነኝ...',
    renter: 'ተከራይ',
    landlord: 'የቤት ባለቤት',
    agreeTerms: 'ከሁኔታዎች እና የግላዊነት ፖሊሲ ጋር እስማማለሁ',
    alreadyHave: 'ቀደም ሲል መለያ አለህ?',
    signInLink: 'ግባ',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('@kira_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
