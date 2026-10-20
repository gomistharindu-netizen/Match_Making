export type Language = 'en' | 'si';

export interface Translations {
  brandName: string;
  brandTagline: string;
  nav: {
    home: string;
    proposals: string;
    horoscope: string;
    pricing: string;
    activity: string;
    messages: string;
    login: string;
    register: string;
    freeBadge: string;
  };
  hero: {
    title: string;
    highlight: string;
    subtitle: string;
    findMatch: string;
    lookingFor: string;
    bride: string;
    groom: string;
    ageRange: string;
    religion: string;
    location: string;
    searchBtn: string;
    allReligions: string;
    allLocations: string;
  };
  features: {
    verifiedTitle: string;
    verifiedDesc: string;
    privacyTitle: string;
    privacyDesc: string;
    horoscopeTitle: string;
    horoscopeDesc: string;
    globalTitle: string;
    globalDesc: string;
  };
  profiles: {
    title: string;
    subtitle: string;
    viewDetails: string;
    expressInterest: string;
    interestSent: string;
    contactApproved: string;
    requestContact: string;
    code: string;
    age: string;
    height: string;
    location: string;
    education: string;
    occupation: string;
    religion: string;
    maritalStatus: string;
    managedBy: string;
    horoscopeAvailable: string;
    verified: string;
    overseas: string;
    filters: string;
    clearFilters: string;
    noResults: string;
  };
  contactPrivacy: {
    heading: string;
    notice: string;
    ownerApprovalRequired: string;
    grantAccess: string;
    revealedTitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    guardian: string;
  };
  horoscopePage: {
    badge: string;
    title: string;
    subtitle: string;
    guestNotice: string;
    step1: string;
    step2: string;
    step3: string;
    subject1Title: string;
    subject2Title: string;
    fullName: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    chartUpload: string;
    chooseChart: string;
    orBirthDetails: string;
    feeNote: string;
    payOnline: string;
    bankTransfer: string;
    uploadSlip: string;
    submitOrder: string;
    sampleReportTitle: string;
    sampleReportDesc: string;
    downloadSamplePdf: string;
  };
  pricingPage: {
    title: string;
    subtitle: string;
    lifetimeTitle: string;
    lifetimeDesc: string;
    freeModeTitle: string;
    freeModeDesc: string;
    adminConfigNotice: string;
    featuresIncluded: string;
    featureList: string[];
    choosePayHere: string;
    chooseBankSlip: string;
    instantActivation: string;
    manualActivation: string;
  };
  activityPage: {
    title: string;
    subtitle: string;
    recentlyViewedTab: string;
    whoViewedMeTab: string;
    reciprocalNotice: string;
    privacyToggle: string;
    privacyToggleDesc: string;
    lastVisited: string;
    viewsCount: string;
  };
  chatPage: {
    title: string;
    subtitle: string;
    selectConversation: string;
    typeMessage: string;
    send: string;
    contactReleaseBadge: string;
    contactReleasePrompt: string;
    approveContactBtn: string;
  };
  demoBar: {
    title: string;
    currentRole: string;
    roleVisitor: string;
    roleMember: string;
    freeModeLabel: string;
    freeModeOn: string;
    freeModeOff: string;
    note: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'Sri Kalyana Matrimony',
    brandTagline: 'Trusted Marriage Proposals & Astrological Services',
    nav: {
      home: 'Home',
      proposals: 'Browse Proposals',
      horoscope: 'Horoscope Matching',
      pricing: 'Membership & Fees',
      activity: 'Viewer History',
      messages: 'Messages',
      login: 'Sign In',
      register: 'Register',
      freeBadge: 'Free Mode Active',
    },
    hero: {
      title: 'Find Your Lifelong Partner With',
      highlight: 'Trust, Privacy & Astrology',
      subtitle: 'Sri Lanka’s premier matrimonial and horoscope service for families locally and across the globe. Confidential, owner-approved contacts and verified profiles.',
      findMatch: 'Search Matrimonial Proposals',
      lookingFor: 'Looking For',
      bride: 'Bride (මනාලියක්)',
      groom: 'Groom (මනාලයෙක්)',
      ageRange: 'Age Range',
      religion: 'Religion',
      location: 'Location',
      searchBtn: 'Search Profiles',
      allReligions: 'All Religions',
      allLocations: 'All Locations (Sri Lanka & Overseas)',
    },
    features: {
      verifiedTitle: '100% Verified Profiles',
      verifiedDesc: 'Profiles and photos are verified by our dedicated agency staff to ensure authenticity and safety.',
      privacyTitle: 'Owner-Approved Contacts',
      privacyDesc: 'Phone numbers and personal contacts are never public. They are released only when the profile owner approves.',
      horoscopeTitle: 'In-House Astrologer Matching',
      horoscopeDesc: 'Independent horoscope matching reports prepared and signed by experienced Sri Lankan astrologers.',
      globalTitle: 'Sri Lanka & Overseas Reach',
      globalDesc: 'Connect with reputable Sri Lankan families residing locally as well as living abroad (UK, Australia, Canada, UAE, etc.).',
    },
    profiles: {
      title: 'Latest Matrimonial Proposals',
      subtitle: 'Browse public-safe candidate summaries. Register to express interest and communicate.',
      viewDetails: 'View Full Profile',
      expressInterest: 'Express Interest',
      interestSent: 'Interest Pending',
      contactApproved: 'Contact Approved',
      requestContact: 'Request Contact Release',
      code: 'Profile ID',
      age: 'Age',
      height: 'Height',
      location: 'Location',
      education: 'Education',
      occupation: 'Profession',
      religion: 'Religion',
      maritalStatus: 'Marital Status',
      managedBy: 'Managed By',
      horoscopeAvailable: 'Horoscope Available',
      verified: 'Verified Profile',
      overseas: 'Overseas',
      filters: 'Filter Proposals',
      clearFilters: 'Reset Filters',
      noResults: 'No proposals match your current filter criteria.',
    },
    contactPrivacy: {
      heading: 'Contact Privacy & Release Policy',
      notice: 'Contact information (phone numbers, full legal names, WhatsApp) is strictly protected and never shown in public search or directly upon interest acceptance.',
      ownerApprovalRequired: 'Owner approval is required to disclose phone numbers.',
      grantAccess: 'Owner has granted you direct contact access!',
      revealedTitle: 'Direct Contact Details',
      phone: 'Primary Phone',
      whatsapp: 'WhatsApp Number',
      email: 'Family Email',
      guardian: 'Contact Person',
    },
    horoscopePage: {
      badge: 'Separate Paid Astrological Service',
      title: 'Astrological Horoscope Matching (පොරොන්දම් ගැලපීම)',
      subtitle: 'Order an in-depth 10 & 20 Porondam astrological analysis with planetary positions and Dosha evaluation. Matrimonial membership is NOT required.',
      guestNotice: 'Open to everyone! Non-members can submit two horoscopes directly without creating a marriage profile.',
      step1: '1. Enter Birth Data or Upload Charts',
      step2: '2. Complete Payment (PayHere / Bank Slip)',
      step3: '3. Receive & Download Certified PDF Report',
      subject1Title: 'Bride / Candidate 1 Horoscope',
      subject2Title: 'Groom / Candidate 2 Horoscope',
      fullName: 'Name / Alias',
      birthDate: 'Date of Birth',
      birthTime: 'Exact Time of Birth',
      birthPlace: 'Place of Birth / City',
      chartUpload: 'Upload Horoscope Chart Image / PDF',
      chooseChart: 'Choose Horoscope Chart file (Rashi/Navamsha)',
      orBirthDetails: 'Or enter accurate birth details below:',
      feeNote: 'Horoscope Review Fee (Admin-Configurable): LKR 3,500',
      payOnline: 'Pay Online via PayHere (Instant Processing)',
      bankTransfer: 'Direct Bank Deposit (Upload Slip for Staff Review)',
      uploadSlip: 'Upload Bank Payment Receipt',
      submitOrder: 'Confirm & Place Horoscope Order',
      sampleReportTitle: 'Sample Astrological Report Preview',
      sampleReportDesc: 'Review how your final reviewed horoscope matching report looks with complete Porondam score and astrologer commentary.',
      downloadSamplePdf: 'Download Sample Astrological Report (PDF)',
    },
    pricingPage: {
      title: 'Transparent Membership & Fees',
      subtitle: 'One-time registration fee for lifetime access. No monthly deductions or renewal fees.',
      lifetimeTitle: 'Lifetime Matrimonial Membership',
      lifetimeDesc: 'Pay once, search and connect until you find your ideal match.',
      freeModeTitle: 'Free Mode Promotion (Admin Controlled)',
      freeModeDesc: 'When the agency activates Free Mode, new members enjoy 100% full feature parity without any registration payment.',
      adminConfigNotice: 'All fee amounts and Free Mode toggles are dynamically managed by agency administrators via the Filament Admin panel.',
      featuresIncluded: 'Everything Included in Lifetime Membership:',
      featureList: [
        'Send unlimited interest requests (with daily anti-spam limits)',
        'Private internal messaging with accepted matches',
        'Request and share private contact details with mutual consent',
        'See who viewed your profile and track recently visited proposals',
        'Direct phone and WhatsApp support from our agency team',
      ],
      choosePayHere: 'Pay Online via PayHere',
      chooseBankSlip: 'Pay via Bank Transfer',
      instantActivation: 'Instant Automatic Activation via PayHere webhook',
      manualActivation: 'Staff Verification within 1-2 business hours',
    },
    activityPage: {
      title: 'Profile Activity & Visitor History',
      subtitle: 'Track proposals you have inspected and see active members who viewed your candidate profile.',
      recentlyViewedTab: 'Recently Viewed by You',
      whoViewedMeTab: 'Who Viewed My Profile',
      reciprocalNotice: 'Reciprocal Privacy Rule: If you choose to hide your visits from other members, you will not be able to see the identities of members who visit your profile.',
      privacyToggle: 'Show my profile in others\' visitor history',
      privacyToggleDesc: 'Enabled: You can see who viewed you, and other members can see when you view them.',
      lastVisited: 'Last Viewed',
      viewsCount: 'Views',
    },
    chatPage: {
      title: 'Private Member Messaging',
      subtitle: 'Direct, secure communication between mutual accepted proposals before releasing telephone numbers.',
      selectConversation: 'Select a conversation on the left to start messaging.',
      typeMessage: 'Type your message...',
      send: 'Send',
      contactReleaseBadge: 'Owner Contact Released',
      contactReleasePrompt: 'Both parties are currently conversing securely. You can request phone number sharing at any time.',
      approveContactBtn: 'Approve & Share My Contact Details',
    },
    demoBar: {
      title: 'Interactive Client Demo Toolbar',
      currentRole: 'Simulated User Role:',
      roleVisitor: 'Public Visitor (Unregistered)',
      roleMember: 'Active Lifetime Member',
      freeModeLabel: 'System Mode:',
      freeModeOn: 'Free Mode ON (Full Parity)',
      freeModeOff: 'Paid Registration Required',
      note: 'Toggle these controls to demonstrate different customer journeys to stakeholders.',
    },
  },
  si: {
    brandName: 'ශ්‍රී කල්‍යාණ මංගල සේවාව',
    brandTagline: 'විශ්වාසනීය මංගල යෝජනා සහ ජ්‍යොතිෂ සේවාව',
    nav: {
      home: 'මුල් පිටුව',
      proposals: 'මංගල යෝජනා',
      horoscope: 'කේන්ද්‍ර ගැලපීම',
      pricing: 'සාමාජිකත්වය',
      activity: 'නැරඹුම් ඉතිහාසය',
      messages: 'පණිවිඩ',
      login: 'ඇතුල් වන්න',
      register: 'ලියාපදිංචි වන්න',
      freeBadge: 'නොමිලේ ලියාපදිංචිය සක්‍රියයි',
    },
    hero: {
      title: 'ඔබේ දිවිමඟ සහකරු/සහකාරිය සොයාගන්න',
      highlight: 'විශ්වාසය, පෞද්ගලිකත්වය සහ ජ්‍යොතිෂය පෙරදැරිව',
      subtitle: 'ශ්‍රී ලංකාව තුළ මෙන්ම විදේශගත ශ්‍රී ලාංකිකයන් සඳහාම වෙන්වූ ප්‍රමුඛ පෙළේ මංගල යෝජනා සහ කේන්ද්‍ර සේවාව. පෞද්ගලිකත්වය සුරැකි අනුමැතිය ලත් සබඳතා.',
      findMatch: 'මංගල යෝජනා සොයන්න',
      lookingFor: 'සොයන්නේ',
      bride: 'මනාලියක් (Bride)',
      groom: 'මනාලයෙක් (Groom)',
      ageRange: 'වයස් පරාසය',
      religion: 'ආගම',
      location: 'ප්‍රදේශය / රට',
      searchBtn: 'යෝජනා සොයන්න',
      allReligions: 'සියලුම ආගම්',
      allLocations: 'සියලුම ප්‍රදේශ (ලංකාවේ සහ විදේශගත)',
    },
    features: {
      verifiedTitle: '100% තහවුරු කළ යෝජනා',
      verifiedDesc: 'අපගේ කාර්ය මණ්ඩලය විසින් සෑම තොරතුරක්ම සහ ඡායාරූපයක්ම පරීක්ෂා කර තහවුරු කරනු ලැබේ.',
      privacyTitle: 'හිමිකරු අනුමත පෞද්ගලිකත්වය',
      privacyDesc: 'දුරකථන අංක කිසිවිටෙකත් ප්‍රසිද්ධියේ නොපෙන්වයි. අංක ලබාදෙන්නේ අයිතිකරුගේ නිශ්චිත අනුමැතියෙන් පමණි.',
      horoscopeTitle: 'ප්‍රවීණ ජ්‍යොතිෂවේදී පරීක්ෂාව',
      horoscopeDesc: 'විශේෂඥ ජ්‍යොතිෂවේදීන් විසින් පරීක්ෂා කර සහතික කරන ලද විධිමත් පොරොන්දම් ගැලපීමේ වාර්තා.',
      globalTitle: 'දේශීය සහ විදේශීය ආවරණය',
      globalDesc: 'ශ්‍රී ලංකාවේ මෙන්ම ඕස්ට්‍රේලියාව, එංගලන්තය, මැදපෙරදිග ඇතුළු විදේශගත පවුල්වල යෝජනා.',
    },
    profiles: {
      title: 'නවතම මංගල යෝජනා',
      subtitle: 'ප්‍රසිද්ධියට සුදුසු මූලික තොරතුරු මෙහි දැක්වේ. පණිවිඩ යැවීමට සහ සම්බන්ධ වීමට ලියාපදිංචි වන්න.',
      viewDetails: 'සම්පූර්ණ තොරතුරු බලන්න',
      expressInterest: 'කැමැත්ත ප්‍රකාශ කරන්න (Interest)',
      interestSent: 'කැමැත්ත යවා ඇත (Pending)',
      contactApproved: 'අංක හුවමාරුව අනුමතයි',
      requestContact: 'දුරකථන අංක ඉල්ලුම් කරන්න',
      code: 'යෝජනා අංකය',
      age: 'වයස',
      height: 'උස',
      location: 'ප්‍රදේශය / රට',
      education: 'අධ්‍යාපනය',
      occupation: 'රැකියාව',
      religion: 'ආගම',
      maritalStatus: 'විවාහක තත්ත්වය',
      managedBy: 'භාරකරු',
      horoscopeAvailable: 'කේන්ද්‍රය ඇත',
      verified: 'තහවුරු කළ යෝජනාවක්',
      overseas: 'විදේශගත',
      filters: 'පෙරහන් (Filters)',
      clearFilters: 'පෙරහන් ඉවත් කරන්න',
      noResults: 'ඔබ සෙවූ නිර්ණායකයන්ට ගැලපෙන යෝජනා හමු නොවීය.',
    },
    contactPrivacy: {
      heading: 'පෞද්ගලිකත්වය සහ අංක නිකුත් කිරීමේ ප්‍රතිපත්තිය',
      notice: 'දුරකථන අංක, නීත්‍යානුකූල සම්පූර්ණ නම් සහ WhatsApp විස්තර කිසිවිටෙක ප්‍රසිද්ධ සෙවුම්වල නොපෙන්වයි.',
      ownerApprovalRequired: 'දුරකථන අංක බැලීමට අදාළ සාමාජිකයාගේ අනුමැතිය අවශ්‍ය වේ.',
      grantAccess: 'අදාළ සාමාජිකයා විසින් සෘජු සම්බන්ධතා විස්තර බැලීමට අනුමැතිය දී ඇත!',
      revealedTitle: 'සෘජු සම්බන්ධතා තොරතුරු',
      phone: 'දුරකථන අංකය',
      whatsapp: 'WhatsApp අංකය',
      email: 'විද්‍යුත් ලිපිනය',
      guardian: 'සම්බන්ධ විය යුතු පුද්ගලයා',
    },
    horoscopePage: {
      badge: 'වෙනම ගෙවීම් සහිත ස්වාධීන ජ්‍යොතිෂ සේවාව',
      title: 'කේන්ද්‍ර / පොරොන්දම් ගැලපීම (Horoscope Matching)',
      subtitle: 'විසි පොරොන්දම්, දස පොරොන්දම්, ග්‍රහ පිහිටීම් සහ දෝෂ ඇතුළත් විධිමත් පරීක්ෂණ වාර්තාවක් ලබාගන්න. මංගල සාමාජිකත්වය අනිවාර්ය නොවේ.',
      guestNotice: 'ඕනෑම අයෙකුට විවෘතයි! සාමාජිකත්වය නොමැතිව වුවද කේන්ද්‍ර දෙකක විස්තර ලබා දී වාර්තාව ලබාගත හැක.',
      step1: '1. උපන් තොරතුරු ඇතුළත් කරන්න හෝ කේන්ද්‍ර පත්‍රය upload කරන්න',
      step2: '2. ගෙවීම් සම්පූර්ණ කරන්න (PayHere / බැංකු තැන්පතු)',
      step3: '3. සහතික කළ PDF වාර්තාව ලබාගන්න',
      subject1Title: 'මනාලිය / අපේක්ෂිකාවගේ කේන්ද්‍රය',
      subject2Title: 'මනාලයා / අපේක්ෂකයාගේ කේන්ද්‍රය',
      fullName: 'නම / අන්වර්ථ නාමය',
      birthDate: 'උපන් දිනය',
      birthTime: 'උපන් නිවැරදි වේලාව',
      birthPlace: 'උපන් නගරය',
      chartUpload: 'කේන්ද්‍ර සටහන (රාශි/නවාංශක) Upload කරන්න',
      chooseChart: 'කේන්ද්‍ර පත්‍රයේ ඡායාරූපය හෝ PDF තෝරන්න',
      orBirthDetails: 'නැතහොත් නිවැරදි උපන් තොරතුරු ඇතුළත් කරන්න:',
      feeNote: 'කේන්ද්‍ර පරීක්ෂණ ගාස්තුව (Admin මගින් සකසන): රු. 3,500',
      payOnline: 'PayHere හරහා ක්ෂණිකව ගෙවන්න (Card/Frimi/Genie)',
      bankTransfer: 'බැංකු තැන්පතු රිසිට්පත Upload කරන්න',
      uploadSlip: 'බැංකු රිසිට්පත මෙතැනින් Upload කරන්න',
      submitOrder: 'කේන්ද්‍ර ගැලපීමේ ඇණවුම තහවුරු කරන්න',
      sampleReportTitle: 'ආදර්ශ ජ්‍යොතිෂ වාර්තාවේ පෙරදසුන',
      sampleReportDesc: 'ජ්‍යොතිෂවේදියා විසින් සකසන ලද අවසන් වාර්තාවේ ආදර්ශ පිටපතක් මෙතැනින් පරීක්ෂා කළ හැක.',
      downloadSamplePdf: 'ආදර්ශ කේන්ද්‍ර වාර්තාව බාගත කරන්න (Sample PDF)',
    },
    pricingPage: {
      title: 'පැහැදිලි සාමාජිකත්වය සහ ගාස්තු',
      subtitle: 'ජීවිත කාලයටම එක් වරක් පමණක් ගෙවන ලියාපදිංචි ගාස්තුව. මාසික අලුත් කිරීම් හෝ සැඟවුණු ගාස්තු නැත.',
      lifetimeTitle: 'ජීවිත කාලීන සාමාජිකත්වය (Lifetime)',
      lifetimeDesc: 'එක් වරක් ගෙවා ඔබගේ සුදුසු සහකරු/සහකාරිය සොයාගන්නා තෙක්ම සේවාව ලබාගන්න.',
      freeModeTitle: 'නොමිලේ ලියාපදිංචි වීමේ විශේෂ අවස්ථාව (Free Mode)',
      freeModeDesc: 'පරිපාලක (Admin) විසින් Free Mode සක්‍රිය කර ඇති විට, කිසිදු ගෙවීමකින් තොරව සම්පූර්ණ පහසුකම් නොමිලේම ලැබේ.',
      adminConfigNotice: 'සියලුම ගාස්තු ප්‍රමාණ සහ Free Mode පහසුකම Filament Admin Panel එක හරහා පරිපාලක විසින් ඕනෑම වේලාවක වෙනස් කළ හැක.',
      featuresIncluded: 'ජීවිත කාලීන සාමාජිකත්වයට ඇතුළත් සියල්ල:',
      featureList: [
        'අසීමිතව යෝජනා සඳහා කැමැත්ත (Interests) ප්‍රකාශ කිරීම',
        'අනුමත වූ සාමාජිකයින් සමග පෞද්ගලිකව පණිවිඩ (Chat) හුවමාරුව',
        'දෙපාර්ශවයේ එකඟතාවය මත දුරකථන අංක හුවමාරු කරගැනීම',
        'ඔබගේ Profile එක බැලූ අය සහ ඔබ බැලූ අය පිළිබඳ ඉතිහාසය',
        'අපගේ කාර්ය මණ්ඩලයේ සෘජු දුරකථන සහ WhatsApp සහාය',
      ],
      choosePayHere: 'PayHere මගින් ඔන්ලයින් ගෙවන්න',
      chooseBankSlip: 'බැංකු තැන්පතුවක් මගින් ගෙවන්න',
      instantActivation: 'PayHere මගින් ක්ෂණිකව ගිණුම සක්‍රිය වේ',
      manualActivation: 'කාර්ය මණ්ඩලය විසින් පරීක්ෂා කර පැය 1-2ක් තුළ සක්‍රිය කෙරේ',
    },
    activityPage: {
      title: 'ක්‍රියාකාරකම් සහ නැරඹුම් ඉතිහාසය',
      subtitle: 'ඔබ බැලූ යෝජනා සහ ඔබගේ යෝජනාව බැලූ සාමාජිකයින් පිළිබඳ සවිස්තර වාර්තාව.',
      recentlyViewedTab: 'ඔබ මෑතකදී බැලූ යෝජනා',
      whoViewedMeTab: 'ඔබගේ Profile එක බැලූ සාමාජිකයින්',
      reciprocalNotice: 'අන්‍යෝන්‍ය පෞද්ගලිකත්ව නීතිය: ඔබ අන් අයගේ Profile බලන බව සඟවා ඇත්නම්, ඔබගේ Profile එක බැලූ අයගේ නම්ද ඔබට නොපෙනේ.',
      privacyToggle: 'අන් අයගේ නැරඹුම් ලැයිස්තුවේ මාව පෙන්වන්න',
      privacyToggleDesc: 'සක්‍රිය විට: ඔබගේ Profile එක බැලූ අය ඔබට පෙනෙන අතර, ඔබ අන් අයගේ Profile බලන විට ඔවුන්ටද පෙනේ.',
      lastVisited: 'අවසන් වරට බැලුවේ',
      viewsCount: 'නැරඹූ වාර',
    },
    chatPage: {
      title: 'පෞද්ගලික පණිවිඩ හුවමාරුව (Private Messaging)',
      subtitle: 'දුරකථන අංක හුවමාරු කිරීමට පෙර දෙපාර්ශවයට ආරක්ෂිතව සාකච්ඡා කිරීමේ පහසුකම.',
      selectConversation: 'පණිවිඩ කියවීමට වම්පස ඇති සංවාදයක් තෝරන්න.',
      typeMessage: 'ඔබේ පණිවිඩය මෙහි ටයිප් කරන්න...',
      send: 'යවන්න',
      contactReleaseBadge: 'සම්බන්ධතා අංක නිකුත් කර ඇත',
      contactReleasePrompt: 'දෙපාර්ශවයම ආරක්ෂිතව සංවාදයේ යෙදේ. ඕනෑම මොහොතක දුරකථන අංක ඉල්ලුම් කළ හැක.',
      approveContactBtn: 'මගේ දුරකථන අංක ලබාදීමට අනුමැතිය දෙන්න',
    },
    demoBar: {
      title: 'පාරිභෝගික ආදර්ශ පාලන පුවරුව (Interactive Demo Bar)',
      currentRole: 'වත්මන් පරිශීලක ස්වභාවය:',
      roleVisitor: 'අමුත්තෙක් (Unregistered Visitor)',
      roleMember: 'සක්‍රිය සාමාජිකයෙක් (Active Member)',
      freeModeLabel: 'පද්ධති තත්ත්වය:',
      freeModeOn: 'නොමිලේ ක්‍රමය සක්‍රියයි (Free Mode ON)',
      freeModeOff: 'ගෙවීම් අනිවාර්යයි (Paid Mode)',
      note: 'විවිධ අවස්ථාවන් පාරිභෝගිකයාට පෙන්වීමට මෙම බොත්තම් භාවිතා කරන්න.',
    },
  },
};
