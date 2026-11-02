export interface MatrimonialProfile {
  id: string;
  code: string;
  gender: 'groom' | 'bride';
  age: number;
  height: string;
  location: string;
  country: string;
  isOverseas: boolean;
  religion: string;
  casteSubcaste?: string;
  education: string;
  educationDetails: string;
  occupation: string;
  workplace: string;
  monthlyIncome?: string;
  maritalStatus: string;
  managedBy: 'Mother' | 'Father' | 'Self' | 'Guardian';
  photoUrl: string;
  photoIsPrivate: boolean;
  photoVisibility?: 'public' | 'members_only' | 'on_request';
  professionCategory?: string;
  habitsSmoking?: string;
  habitsDrinking?: string;
  dietaryHabits?: string;
  horoscopeAvailable: boolean;
  rashi?: string;
  nekatha?: string;
  porondamScore?: number;
  aboutCandidate: {
    en: string;
    si: string;
  };
  familyDetails: {
    en: string;
    si: string;
  };
  partnerPreferences: {
    en: string;
    si: string;
  };
  // Private details (Only revealed upon owner release)
  privateContacts: {
    fullName: string;
    phone: string;
    whatsapp: string;
    email: string;
    contactPerson: string;
    relationship: string;
    address: string;
  };
  interestStatus?: 'none' | 'pending' | 'accepted' | 'declined';
  contactReleased?: boolean;
}

export const mockProfiles: MatrimonialProfile[] = [
  {
    id: 'p-1',
    code: 'MP-2026-001',
    gender: 'groom',
    age: 29,
    height: "5' 10\"",
    location: 'Colombo, Western Province',
    country: 'Sri Lanka',
    isOverseas: false,
    religion: 'Buddhist',
    education: 'BSc (Hons) in Software Engineering',
    educationDetails: 'University of Moratuwa',
    occupation: 'Senior Lead Software Architect',
    workplace: 'Top Tier US Tech Firm (Colombo Branch)',
    maritalStatus: 'Never Married',
    managedBy: 'Mother',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    photoIsPrivate: false,
    horoscopeAvailable: true,
    rashi: 'Kanya (කන්‍යා)',
    nekatha: 'Hastha (හත)',
    porondamScore: 18,
    aboutCandidate: {
      en: 'Teetotaler, non-smoker, gentle natured, well-mannered young professional who respects traditional Buddhist cultural values while embracing a modern worldview.',
      si: 'සුරාසූදුවෙන් තොර, ගුණගරුක, බෞද්ධ සාරධර්ම අගයන ප්‍රමුඛ පෙළේ ආයතනයක සේවය කරන කාරුණික තරුණයෙකි.',
    },
    familyDetails: {
      en: 'Father is a retired Central Bank Executive; Mother is a retired government graduate teacher. Only sister is married and living in the UK.',
      si: 'පියා ශ්‍රී ලංකා මහ බැංකුවේ විශ්‍රාමික විධායක නිලධාරියෙකි. මව විශ්‍රාමික උපාධිධාරී ගුරුවරියකි. එකම සොහොයුරිය විවාහ වී එංගලන්තයේ පදිංචිව සිටී.',
    },
    partnerPreferences: {
      en: 'Looking for an educated, kind-hearted, professionally qualified Buddhist bride aged 24-28 with compatible horoscope.',
      si: 'වයස 24-28 අතර, උගත්, රැකියාවැති, කාරුණික බෞද්ධ මනාලියක් සොයයි. කේන්ද්‍ර ගැලපීම සලකා බැලේ.',
    },
    privateContacts: {
      fullName: 'Kasun Priyantha Senanayake',
      phone: '+94 77 345 6789',
      whatsapp: '+94 77 345 6789',
      email: 'senanayake.family@example.com',
      contactPerson: 'Mrs. K. Senanayake (Mother)',
      relationship: 'Mother',
      address: 'No. 45/2, Havelock Road, Colombo 05',
    },
    interestStatus: 'none',
    contactReleased: false,
  },
  {
    id: 'p-2',
    code: 'MP-2026-002',
    gender: 'bride',
    age: 26,
    height: "5' 4\"",
    location: 'Kandy, Central Province',
    country: 'Sri Lanka',
    isOverseas: false,
    religion: 'Buddhist',
    education: 'MBBS Doctor',
    educationDetails: 'Faculty of Medicine, University of Peradeniya',
    occupation: 'Medical Doctor (Grade II Medical Officer)',
    workplace: 'Teaching Hospital Peradeniya',
    maritalStatus: 'Never Married',
    managedBy: 'Father',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    photoIsPrivate: false,
    horoscopeAvailable: true,
    rashi: 'Meena (මීන)',
    nekatha: 'Revathi (රේවතී)',
    porondamScore: 19,
    aboutCandidate: {
      en: 'Fair, charming, compassionate doctor from a respectable Kandyan family. Enjoys classical music and reading.',
      si: 'පැහැපත්, කාරුණික, උඩරට වැදගත් පවුල් පසුබිමක් සහිත වෛද්‍යවරියකි. සාම්ප්‍රදායික ගුණධර්ම අගය කරයි.',
    },
    familyDetails: {
      en: 'Father is an Attorney-at-Law in Kandy; Mother is a Specialist Nursing Officer. One younger brother studying Engineering at university.',
      si: 'පියා නීතීඥවරයෙකි; මව විශේෂඥ හෙද නිලධාරිනියකි. බාල සොහොයුරා ඉංජිනේරු පීඨයේ ඉගෙනුම ලබයි.',
    },
    partnerPreferences: {
      en: 'Seeking an educated doctor, engineer, or high-tier professional partner from a respectable family background.',
      si: 'වෛද්‍ය, ඉංජිනේරු හෝ උසස් වෘත්තියක නියුතු වැදගත් පවුල් පසුබිමක් සහිත සහකරුවෙකු අපේක්ෂා කෙරේ.',
    },
    privateContacts: {
      fullName: 'Dr. Sanduni Nimanthi Dissanayake',
      phone: '+94 71 889 1234',
      whatsapp: '+94 71 889 1234',
      email: 'dissanayake.legal@example.com',
      contactPerson: 'Mr. Sunil Dissanayake (Father)',
      relationship: 'Father',
      address: '22, Lake Round, Kandy',
    },
    interestStatus: 'accepted',
    contactReleased: false,
  },
  {
    id: 'p-3',
    code: 'MP-2026-003',
    gender: 'groom',
    age: 32,
    height: "5' 11\"",
    location: 'Melbourne, Victoria',
    country: 'Australia',
    isOverseas: true,
    religion: 'Buddhist',
    education: 'BSc Eng (Civil), MEng (Australia)',
    educationDetails: 'RMIT University Melbourne & Moratuwa',
    occupation: 'Chartered Senior Civil Engineer (Permanent Resident)',
    workplace: 'Victoria State Infrastructure Project',
    maritalStatus: 'Never Married',
    managedBy: 'Self',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    photoIsPrivate: false,
    horoscopeAvailable: true,
    rashi: 'Mesha (මේෂ)',
    nekatha: 'Ashwini (අස්විද)',
    porondamScore: 17,
    aboutCandidate: {
      en: 'Australian PR holder, owns modern home in Melbourne. Athletic, travels often, grounded in Sri Lankan heritage and family bonds.',
      si: 'ඕස්ට්‍රේලියාවේ ස්ථිර පදිංචි (PR) හිමි, මෙල්බර්න් හි නිවසක් හිමි, උසස් රැකියාවැති විදේශගත තරුණයෙකි.',
    },
    familyDetails: {
      en: 'Parents reside in Kurunegala in their family estate. Sister is a Chartered Accountant in Auckland, New Zealand.',
      si: 'දෙමාපියන් කුරුණෑගල පාරම්පරික වතු හිමි පවුලක ජීවත් වේ. සොහොයුරිය නවසීලන්තයේ ගණකාධිකාරිනියකි.',
    },
    partnerPreferences: {
      en: 'Willing to migrate to Australia. Looking for an educated, cheerful partner who values companionship and cultural harmony.',
      si: 'ඕස්ට්‍රේලියාවට සංක්‍රමණය වීමට කැමති, උගත් සහ සාමකාමී මනාලියක් සොයයි.',
    },
    privateContacts: {
      fullName: 'Eng. Janith Chamara Alahakoon',
      phone: '+61 412 345 678',
      whatsapp: '+61 412 345 678',
      email: 'janith.alahakoon@example.com.au',
      contactPerson: 'Janith Alahakoon (Self)',
      relationship: 'Self',
      address: 'Point Cook, Melbourne, VIC 3030, Australia',
    },
    interestStatus: 'none',
    contactReleased: false,
  },
  {
    id: 'p-4',
    code: 'MP-2026-004',
    gender: 'bride',
    age: 28,
    height: "5' 5\"",
    location: 'London, Greater London',
    country: 'United Kingdom',
    isOverseas: true,
    religion: 'Christian / Catholic',
    education: 'MSc in Data Science & AI',
    educationDetails: 'University College London (UCL)',
    occupation: 'Lead AI Data Analyst at Financial Institution',
    workplace: 'Canary Wharf Financial Firm, London',
    maritalStatus: 'Never Married',
    managedBy: 'Mother',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    photoIsPrivate: true,
    photoVisibility: 'on_request',
    horoscopeAvailable: false,
    aboutCandidate: {
      en: 'British Citizen (Sri Lankan origin). Sophisticated, humble, cheerful, fluent in English and Sinhala, deeply connected to family roots.',
      si: 'එංගලන්ත පුරවැසිභාවය හිමි, ලන්ඩන් නුවර උසස් රැකියාවක නියුතු, සිංහල සහ ඉංග්‍රීසි භාෂා ද්විත්වයම චතුර ලෙස කතා කළ හැකි තරුණියකි.',
    },
    familyDetails: {
      en: 'Father is an IT Director in the UK; Mother is a retired NHS Pharmacist. Highly respected family residing in London for over 25 years.',
      si: 'දෙමාපියන් වසර 25කට වැඩි කාලයක් එංගලන්තයේ පදිංචිව සිටින ගෞරවනීය පවුලකි.',
    },
    partnerPreferences: {
      en: 'Seeking a professionally qualified groom living in the UK, Europe, or willing to relocate to London.',
      si: 'එක්සත් රාජධානියේ හෝ යුරෝපයේ පදිංචි, උසස් රැකියාවැති සහකරුවෙකු අපේක්ෂා කෙරේ.',
    },
    privateContacts: {
      fullName: 'Natasha Michelle Fernando',
      phone: '+44 7911 123456',
      whatsapp: '+44 7911 123456',
      email: 'fernando.family.uk@example.co.uk',
      contactPerson: 'Mrs. Anne Fernando (Mother)',
      relationship: 'Mother',
      address: 'Richmond, London TW10, United Kingdom',
    },
    interestStatus: 'none',
    contactReleased: false,
  },
  {
    id: 'p-5',
    code: 'MP-2026-005',
    gender: 'groom',
    age: 31,
    height: "5' 9\"",
    location: 'Gampaha, Western Province',
    country: 'Sri Lanka',
    isOverseas: false,
    religion: 'Buddhist',
    education: 'BSc (Hons) Quantity Surveying, MRICS',
    educationDetails: 'University of Moratuwa',
    occupation: 'Chartered Quantity Surveyor & Construction Director',
    workplace: 'Family-owned Construction Consultancy',
    maritalStatus: 'Never Married',
    managedBy: 'Mother',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    photoIsPrivate: false,
    horoscopeAvailable: true,
    rashi: 'Simha (සිංහ)',
    nekatha: 'Maha (මා)',
    porondamScore: 16,
    aboutCandidate: {
      en: 'Hardworking entrepreneur managing family enterprise and properties. Excellent character, non-smoker, enjoys gardening and classic cars.',
      si: 'පවුලේ ඉදිකිරීම් ව්‍යාපාරය මෙහෙයවන, ඉඩකඩම් හිමි, උගත් ගුණගරුක ව්‍යාපාරික තරුණයෙකි.',
    },
    familyDetails: {
      en: 'Both parents are well-known business personalities in Gampaha district. Youngest sister is an architect.',
      si: 'දෙමාපියන් ගම්පහ දිස්ත්‍රික්කයේ ප්‍රකට ව්‍යාපාරික පවුලකි. බාල සොහොයුරිය වාස්තු විද්‍යාඥවරියකි.',
    },
    partnerPreferences: {
      en: 'Looking for a cultured, pleasant, educated lady who values family life.',
      si: 'පවුල් ජීවිතය අගයන, ප්‍රියමනාප, උගත් මනාලියක් සොයයි.',
    },
    privateContacts: {
      fullName: 'Tharindu Malinda Gunasekara',
      phone: '+94 77 901 2345',
      whatsapp: '+94 77 901 2345',
      email: 'gunasekara.props@example.com',
      contactPerson: 'Mrs. Manel Gunasekara (Mother)',
      relationship: 'Mother',
      address: '44, Miriswatta, Gampaha',
    },
    interestStatus: 'none',
    contactReleased: false,
  },
  {
    id: 'p-6',
    code: 'MP-2026-006',
    gender: 'bride',
    age: 27,
    height: "5' 3\"",
    location: 'Galle, Southern Province',
    country: 'Sri Lanka',
    isOverseas: false,
    religion: 'Buddhist',
    education: 'BA & MA in English Literature',
    educationDetails: 'University of Kelaniya',
    occupation: 'Lecturer in English Language & Linguistics',
    workplace: 'State University',
    maritalStatus: 'Never Married',
    managedBy: 'Mother',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    photoIsPrivate: false,
    horoscopeAvailable: true,
    rashi: 'Dhanu (ධනු)',
    nekatha: 'Moola (මුල)',
    porondamScore: 20,
    aboutCandidate: {
      en: 'Charming, soft-spoken university lecturer from Galle Fort area. Passionate about arts, literature, and social service.',
      si: 'ගාල්ල ප්‍රදේශයේ වැදගත් පවුල් පසුබිමක් සහිත, රාජ්‍ය විශ්වවිද්‍යාලයක කථිකාචාර්යවරියකි.',
    },
    familyDetails: {
      en: 'Father was a retired Additional District Secretary; Mother is a retired Bank Manager.',
      si: 'පියා විශ්‍රාමික අතිරේක දිස්ත්‍රික් ලේකම්වරයෙකි; මව විශ්‍රාමික බැංකු කළමනාකාරිනියකි.',
    },
    partnerPreferences: {
      en: 'Looking for an executive, government officer, or university academic groom with noble qualities.',
      si: 'විධායක නිලධාරී, රාජ්‍ය සේවයේ හෝ විශ්වවිද්‍යාල ආචාර්ය උසස් ගුණැති සහකරුවෙකු අපේක්ෂා කෙරේ.',
    },
    privateContacts: {
      fullName: 'Dulanjali Kaveesha Jayawardena',
      phone: '+94 70 234 5678',
      whatsapp: '+94 70 234 5678',
      email: 'jayawardena.galle@example.com',
      contactPerson: 'Mrs. Rohini Jayawardena (Mother)',
      relationship: 'Mother',
      address: '15, Fort Walk, Galle',
    },
    interestStatus: 'none',
    contactReleased: false,
  },
];
