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

  // Tutorials
  tutorialFinish: string;
  tutorialNext: string;
  tutorialSkip: string;
  signupStep1Title: string;
  signupStep1Desc: string;
  signupStep2Title: string;
  signupStep2Desc: string;
  signupStep3Title: string;
  signupStep3Desc: string;
  loginStep1Title: string;
  loginStep1Desc: string;
  loginStep2Title: string;
  loginStep2Desc: string;
  loginStep3Title: string;
  loginStep3Desc: string;
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
    tutorialFinish: 'Finish',
    tutorialNext: 'Next Step',
    tutorialSkip: 'Skip All',
    signupStep1Title: 'Choose Your Role',
    signupStep1Desc: 'Select Renter to search for luxury homes, or Landlord to list and manage your properties with ease.',
    signupStep2Title: 'Built on Trust',
    signupStep2Desc: 'Kira-Net is a verified ecosystem. Landlords who provide Government IDs are highlighted as "Verified" and get 3x more views.',
    signupStep3Title: 'Secure Access',
    signupStep3Desc: 'Your phone number is your primary key. We use SMS verification to keep your data and agreements safe.',
    loginStep1Title: 'Welcome Back',
    loginStep1Desc: 'Your premium property journey continues here. Sign in to access your saved listings or manage your properties.',
    loginStep2Title: 'Localized for Ethiopia',
    loginStep2Desc: 'Tap the globe icon to switch between English, Amharic, and Oromo at any time.',
    loginStep3Title: 'Secure Environment',
    loginStep3Desc: 'Kira-Net uses high-grade encryption for all communications. Your data and lease agreements are always protected.',
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
    tutorialFinish: 'Xumuri',
    tutorialNext: 'Tarkaanfii Itti Aanu',
    tutorialSkip: 'Hunda Irra Darbi',
    signupStep1Title: 'Shoora Keetti Filadhu',
    signupStep1Desc: 'Manneen qananii barbaaduuf Kireeffataa, yookiin manneen keessan galmeessuuf fi bulchuuf Abbaa Manaa filadhaa.',
    signupStep2Title: 'Amanummaa Irratti Hundaa\'e',
    signupStep2Desc: 'Kira-Net ecosystemii mirkanaa\'aadha. Abbootii manaa eenyummeessaa mootummaa dhiyeessan "Mirkanaa\'aa" jedhamanii mul\'atu, akkasumas view dacha 3 argatu.',
    signupStep3Title: 'Seensa Nagahaa',
    signupStep3Desc: 'Lakkoofsi bilbila keessanii kii furtuu keessani. Odeeffannoo fi waliigaltee keessan eeguuf mirkaneessa SMS fayyadamna.',
    loginStep1Title: 'Baga Deebi\'tan',
    loginStep1Desc: 'Imalli keessan inni jireenya qananii asitti itti fufa. Galmeelee qusattaniitti seenuuf yookiin manneen keessan bulchuuf seeni.',
    loginStep2Title: 'Itoophiyaaf Kan Mijaaye',
    loginStep2Desc: 'Afwan Ingiliffaa, Amaariffaa fi Oromifaa gidduutti jijjiiruuf mallattoo globe tuqi.',
    loginStep3Title: 'Naannoo Nagahaa',
    loginStep3Desc: 'Kira-Net qunnamtii hundaaf iccitii sadarkaa olaanaa qabu fayyadama. Odeeffannoon keessanii fi waliigalteen kireeffannaa yeroo mara eegamaadha.',
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
    tutorialFinish: 'ጨርስ',
    tutorialNext: 'የሚቀጥለው ደረጃ',
    tutorialSkip: 'ሁሉንም ዝለል',
    signupStep1Title: 'ሚናዎን ይምረጡ',
    signupStep1Desc: 'የቅንጦት ቤቶችን ለመፈለግ "ተከራይ"ን ይምረጡ፣ ወይም ቤቶችዎን ለመመዝገብ እና ለማስተዳደር "የቤት ባለቤት"ን ይምረጡ።',
    signupStep2Title: 'በእምነት ላይ የተገነባ',
    signupStep2Desc: 'Kira-Net የተረጋገጠ ሥርዓት ነው። የመንግስት መታወቂያ የሚያቀርቡ የቤት ባለቤቶች "የተረጋገጠ" ተብለው ጎልተው ይታያሉ፣ እንዲሁም 3 እጥፍ ለቤት ፈላጊዎች ይታያሉ።',
    signupStep3Title: 'ደህንነቱ የተጠበቀ መግቢያ',
    signupStep3Desc: 'የስልክ ቁጥርዎ ዋናው ቁልፍዎ ነው። መረጃዎን እና ውሎችን ደህንነት ለመጠበቅ በኤስኤምኤስ (SMS) ማረጋገጫ እንጠቀማለን።',
    loginStep1Title: 'እንኳን ደህና መጡ',
    loginStep1Desc: 'የእርስዎ የቅንጦት ቤት ፍለጋ ጉዞ እዚህ ይቀጥላል። የተቀመጡ ቤቶችን ለማየት ወይም ቤቶችዎን ለማስተዳደር ይግቡ።',
    loginStep2Title: 'ለኢትዮጵያ ተስማሚ የተደረገ',
    loginStep2Desc: 'በእንግሊዝኛ፣ በአማርኛ እና በአፋን ኦሮሞ ለመቀያየር የዓለምን ምልክት (globe) ይንኩ።',
    loginStep3Title: 'ደህንነቱ የተጠበቀ አካባቢ',
    loginStep3Desc: 'Kira-Net ለሁሉም ግንኙነቶች ከፍተኛ ጥበቃን ይጠቀማል። የእርስዎ መረጃ እና የኪራይ ውል ሁል ጊዜ የተጠበቁ ናቸው።',
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
