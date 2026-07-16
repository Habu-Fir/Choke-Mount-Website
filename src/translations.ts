// src/translations.ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDict {
  // Navigation
  home: string;
  culturalMap: string;
  events: string;
  gallery: string;
  news: string;
  invest: string;
  aiChat: string;

  // Hero Section
  welcomeBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  exploreBtn: string;
  prospectusBtn: string;
  altChoke: string;
  tueMarket: string;
  taxHoliday: string;
  aiConcierge: string;

  // Culture Section
  cultureHeadline: string;
  culturePara1: string;
  culturePara2: string;
  orthodoxForests: string;
  chokeReserve: string;

  // Explore Section
  secHeadline: string;
  secSubtitle: string;
  tabMap: string;
  tabEvents: string;
  tabGallery: string;
  tabInvestor: string;
  tabChat: string;
  tabNews: string;

  // Section Descriptions
  mapDesc: string;
  eventDesc: string;
  galleryDesc: string;
  investorDesc: string;
  chatDesc: string;
  newsDesc: string;

  // Trivia
  triviaHeader: string;
  triviaSubtitle: string;
  triviaFact1Title: string;
  triviaFact1Desc: string;
  triviaFact2Title: string;
  triviaFact2Desc: string;

  // Footer
  footerPara: string;
  footerSections: string;
  footerContact: string;

  // Map Section
  visitedStatus: string;
  exploredPercent: string;
  allSites: string;
  natureFilter: string;
  cultureFilter: string;
  sacredFilter: string;
  adminFilter: string;

  // Events Section
  allEvents: string;
  marketFairs: string;
  religiousHolidays: string;
  investmentForums: string;
  scheduleFilter: string;
  myItinerary: string;
  savedEvents: string;
  emptyItinerary: string;
  emptyItineraryDesc: string;
  activeSpotlight: string;
  addToItinerary: string;
  removeFromItinerary: string;

  // Gallery Section
  allPhotos: string;
  nationalCulture: string;
  culinaryDelicacies: string;
  regionalAgrobiz: string;

  // Investment Section
  priorityFields: string;
  priorityTitle: string;
  prioritySubtitle: string;
  demandLevel: string;
  capitalMin: string;
  growthYoY: string;
  registeredIncentives: string;
  priorityRepDesk: string;
  licensingFramework: string;
  roadmapTitle: string;
  roadmapSubtitle: string;
  submitIntent: string;
  submitIntentDesc: string;
  companyName: string;
  investorName: string;
  selectSector: string;
  proposedBudget: string;
  contactEmail: string;
  contactPhone: string;
  projectBrief: string;
  sustainablePledge: string;
  submitBtn: string;
  activeRegistry: string;
  activeRegistryDesc: string;

  // AI Chat
  chatWelcome: string;
  askAssistant: string;
  offlineMode: string;

  // Admin
  adminLogin: string;
  adminDashboard: string;
  manageUsers: string;
  managePosts: string;
  manageGallery: string;
  manageEvents: string;
  manageInvestments: string;
  superAdminOnly: string;
  noPermission: string;

  // Common
  loading: string;
  error: string;
  retry: string;
  save: string;
  update: string;
  delete: string;
  cancel: string;
  confirm: string;
  search: string;
  filter: string;
  refresh: string;
  noResults: string;
  viewAll: string;
  readMore: string;
  showLess: string;
  back: string;
  share: string;
  bookmark: string;
  like: string;
  views: string;
  author: string;
  published: string;
  draft: string;
  pending: string;
  approved: string;
  rejected: string;
  status: string;
  category: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

export const translations: Record<'en' | 'am', TranslationDict> = {
  en: {
    // Navigation
    home: 'Home',
    culturalMap: 'Cultural Map',
    events: 'Events',
    gallery: 'Gallery',
    news: 'News',
    invest: 'Invest',
    aiChat: 'AI Guide',

    // Hero
    welcomeBadge: 'Welcome to Bibugn Wereda, Digo Tsion!',
    heroHeadline: 'Digo Tsion & Mount Choke',
    heroSubtitle: 'Explore the untouched cultural history, majestic Afro-alpine ecosystems, weekly organic honey markets, and booming eco-tourism projects in the high valleys of East Gojjam, Amhara.',
    exploreBtn: 'Explore Interactive Map',
    prospectusBtn: 'Investment Prospectus',
    altChoke: 'Alt. Mount Choke',
    tueMarket: 'Tuesday Market',
    taxHoliday: 'Investor Tax Holiday',
    aiConcierge: 'DigoAI Guide Concierge',

    // Culture
    cultureHeadline: 'An Ancient Culture Built in Harmony with Nature',
    culturePara1: 'Digo Tsion, the capital city of Bibugn District, stands proud at the southern foot slopes of the majestic Mount Choke mountains in East Gojjam. For generations, this region has served as a sanctuary of spiritual scholarship, organic highland agriculture, and noble martial arts.',
    culturePara2: 'From the legendary Tuesday Honey and Grains Market (where farmers trade the highly valued white organic honey processed from endemic highland flora) to the spectacular Timkat Equestrian Tournaments (where riders demonstrate spear-jousting on purebred stallions), Gojjam\'s heritage remains alive, safe, and immensely welcoming.',
    orthodoxForests: 'Orthodox Sacred Forests',
    chokeReserve: 'Choke Biosphere Reserve Hub',

    // Explore
    secHeadline: 'Interactive Explorer Console',
    secSubtitle: 'Toggle between the Interactive landmarks map, our cultural affairs calendar, the photo galleries, or the direct investment registration bureau.',
    tabMap: '🗺️ Map & History',
    tabEvents: '📅 Cultural Calendar',
    tabGallery: '📸 Photo Gallery',
    tabInvestor: '💼 Investment Portal',
    tabChat: '🤖 Ask DigoAI Guide',
    tabNews: '📰 News & History',

    // Section Descriptions
    mapDesc: 'Click the custom green (Nature), amber (Sacred) or yellow (Culture) pins directly on our topographic illustrated map canvas to learn local history, elevation profiles, and launch audio guide snippets!',
    eventDesc: 'Discover local affairs, market days, and annual pilgrimages. Track your itinerary dynamically inside your private board below.',
    galleryDesc: 'See authentic images of Mount Choke eco-lodge designs, Gojjame equestrian horsemen, and organic honey yields. Click any thumbnail to expand a metadata Lightbox.',
    investorDesc: 'Register your agribusiness, honey refinement, or alpine hotel model below to queue for land allocation. Print a PDF registration voucher upon successful queueing.',
    chatDesc: 'Have questions about Mount Choke trails, local municipal offices, honey pricing coordinates, or Gojjam transportation? Chat with our AI concierge below.',
    newsDesc: 'Stay updated on municipal announcements, explore centuries-old Gojjam historical essays, read interviews with local leaders, and watch majestic Choke media.',

    // Trivia
    triviaHeader: 'Did You Know? Quick Facts',
    triviaSubtitle: 'Discover unique details about East Gojjame history, the native species of Mount Choke peaks, and the ancient trade paths that defined Bibugn district.',
    triviaFact1Title: '🌾 Why is Bibugn wheat celebrated?',
    triviaFact1Desc: 'The deep-seated volcanic soil structure of Bibugn wereda, coupled with traditional organic composting, produces highly priced varieties of Emmer and Spelt Wheat used for delicious local flatbreads (Dabo).',
    triviaFact2Title: '🐝 Why is organic Choke Honey white?',
    triviaFact2Desc: 'Choke Mountains host extensive groves of native yellow daisies (Meskel flowers) and endemic cold-alpine floral species. Bees feeding uniquely on these blossoms produce a thick, milky-white honey celebrated for medicinal and culinary excellence.',

    // Footer
    footerPara: 'An interactive public portal managed by the Bibugn Wereda Culture, Sports, and Agribusiness Development cabinets. Promoting sustainable community engagement, tourism welfare, and high-standard investor stewardship.',
    footerSections: 'Core Sections',
    footerContact: 'Administrative Contact',

    // Map
    visitedStatus: 'DIGO TSION VISITED',
    exploredPercent: 'EXPLORED',
    allSites: 'All Sites',
    natureFilter: '🌿 Nature',
    cultureFilter: '🐴 Gojjam Culture',
    sacredFilter: '☦️ Sacred Sites',
    adminFilter: '🏛️ Development Bureau',

    // Events
    allEvents: '🗓️ All Events',
    marketFairs: '🍯 Markets',
    religiousHolidays: '⛪ Holidays',
    investmentForums: '💰 Forums',
    scheduleFilter: 'Filter Schedule:',
    myItinerary: 'My Visitor Itinerary',
    savedEvents: 'SAVED',
    emptyItinerary: 'Your itinerary is empty',
    emptyItineraryDesc: 'Browse Digo Tsion affairs above and click the "+" buttons to assemble an itinerary.',
    activeSpotlight: 'Active Event Spotlight',
    addToItinerary: 'Add to Personal Itinerary',
    removeFromItinerary: 'Remove from Itinerary',

    // Gallery
    allPhotos: '🗂️ All Photos',
    nationalCulture: '🐴 Cultural Rituals',
    culinaryDelicacies: '🍯 Local Delicacies',
    regionalAgrobiz: '📊 Regional Agribusiness',

    // Investment
    priorityFields: 'Priority Fields',
    priorityTitle: 'Select Investment Field',
    prioritySubtitle: 'Digo Tsion offers rapid-advancing avenues backed by Ethiopian regional cabinet sub-decrees.',
    demandLevel: 'Demand Level',
    capitalMin: 'Capital Minimum',
    growthYoY: 'growth',
    registeredIncentives: 'Guaranteed Regional Incentives',
    priorityRepDesk: 'Priority Representative Desk',
    licensingFramework: 'Licensing Framework',
    roadmapTitle: '4-Step Investor Registration Roadmap',
    roadmapSubtitle: 'Learn the complete legal process to secure your industrial land or cooperative partnership in Digo Tsion.',
    submitIntent: 'Submit Investment Intent',
    submitIntentDesc: 'Please declare your business credentials to register as a recognized Digo Tsion Investor and queue for consultation.',
    companyName: 'Company / Entity Name',
    investorName: 'Principal Investor Name',
    selectSector: 'Select Priority Sector',
    proposedBudget: 'Proposed Capital Budget',
    contactEmail: 'Contact Email Address',
    contactPhone: 'Active Contact Phone',
    projectBrief: 'Project Brief & Strategic Request',
    sustainablePledge: 'I solemnly pledge that this investment proposal corresponds to lawful funds, guarantees sustainable environmental procedures, and aligns with the Mount Choke Biosphere protection policies.',
    submitBtn: 'File Intent & Enter Public Registry',
    activeRegistry: 'Active Investment Registry',
    activeRegistryDesc: 'Public tracking ledger of submitted corporate plans for Digo Tsion & Bibugn.',

    // AI Chat
    chatWelcome: 'እንኳን ደህና መጡ! (Welcome!) Ask me anything about our magnificent Choke Mountains, Tuesday Market, local Gojjam riding sports, or priority agribusiness investments!',
    askAssistant: 'Ask DigoAI (e.g. altitude of Mount Choke, Tuesday market honey)...',
    offlineMode: 'DIGOAI LOCAL SPECIALIST',

    // Admin
    adminLogin: 'Admin Login',
    adminDashboard: 'Admin Dashboard',
    manageUsers: 'Manage Users',
    managePosts: 'Manage Posts',
    manageGallery: 'Manage Gallery',
    manageEvents: 'Manage Events',
    manageInvestments: 'Manage Investments',
    superAdminOnly: 'Super Admin Only',
    noPermission: 'You do not have permission to access this page',

    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    save: 'Save',
    update: 'Update',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search...',
    filter: 'Filter',
    refresh: 'Refresh',
    noResults: 'No results found',
    viewAll: 'View All',
    readMore: 'Read More',
    showLess: 'Show Less',
    back: 'Back',
    share: 'Share',
    bookmark: 'Bookmark',
    like: 'Like',
    views: 'views',
    author: 'Author',
    published: 'Published',
    draft: 'Draft',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    status: 'Status',
    category: 'Category',
    tags: 'Tags',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
  },
  am: {
    // Navigation
    home: 'መነሻ',
    culturalMap: 'የባህል ካርታ',
    events: 'ዝግጅቶች',
    gallery: 'ማህደር',
    news: 'ዜናዎች',
    invest: 'ኢንቨስት',
    aiChat: 'አይ መመሪያ',

    // Hero
    welcomeBadge: 'እንኳን ወደ ቢቡኝ ወረዳ ድጎ ጽዮን በደህና መጡ!',
    heroHeadline: 'ድጎ ጽዮን እና ጮቄ ተራራ',
    heroSubtitle: 'የማይነካውን የባህል ታሪክ፣ አስደናቂውን የአፍሮ-አልፓይን ስነ-ምህዳር፣ ሳምንታዊ የኦርጋኒክ ማር ገበያዎችን እና በምስራቅ ጎጃም፣ አማራ ከፍተኛ ሸለቆዎች ውስጥ እየጎለበተ የመጣውን የስነ-ምህዳር ቱሪዝም ፕሮጀክቶችን ያስሱ።',
    exploreBtn: 'ካርታውን ያስሱ',
    prospectusBtn: 'የኢንቨስትመንት መግለጫ',
    altChoke: 'የጮቄ ተራራ ከፍታ',
    tueMarket: 'የማክሰኞ ገበያ',
    taxHoliday: 'የኢንቨስተር ታክስ እረፍት',
    aiConcierge: 'የዲጎአይ ረዳት መሪ',

    // Culture
    cultureHeadline: 'ከተፈጥሮ ጋር ተስማምቶ የተገነባ ጥንታዊ ባህል',
    culturePara1: 'የቢቡኝ ወረዳ ዋና ከተማ የሆነችው ድጎ ጽዮን በምስራቅ ጎጃም ግርማ ሞገስ ካላቸው የጮቄ ተራሮች ደቡባዊ ግርጌ ላይ በኩራት ቆማለች። ለትውልድ ይህ ክልል የመንፈሳዊ ትምህርት፣ የኦርጋኒክ ደጋ ግብርና እና የተከበረ የፈረሰኞች ጥበብ ማደሪያ ሆኖ አገልግሏል።',
    culturePara2: 'ከታዋቂው የማክሰኞ የማርና እህል ገበያ (ገበሬዎች ከአካባቢው ደጋ አበቦች የተቀነባበረውን ከፍተኛ ዋጋ ያለው ነጭ ኦርጋኒክ ማር የሚሸጡበት) እስከ አስደናቂው የጥምቀት የፈረሰኞች ውድድር ድረስ የጎጃም ቅርስ ህያው፣ ደህንነቱ የተጠበቀ እና እጅግ በጣም እንግዳ ተቀባይ ሆኖ ቀጥሏል።',
    orthodoxForests: 'የቤተክርስቲያን ቅዱሳን ደኖች',
    chokeReserve: 'የጮቄ ባዮስፌር ጥበቃ ማእከል',

    // Explore
    secHeadline: 'የመፈለጊያ መቆጣጠሪያ ኮንሶል',
    secSubtitle: 'በአካባቢው ካርታ፣ በባህላዊ ጉዳዮች የቀን መቁጠሪያ፣ በፎቶ ጋለሪዎች ወይም በኢንቨስትመንት ምዝገባ ቢሮ መካከል ይቀያይሩ።',
    tabMap: '🗺️ ካርታ እና ታሪክ',
    tabEvents: '📅 የባህል ቀን መቁጠሪያ',
    tabGallery: '📸 የፎቶ ማህደር',
    tabInvestor: '💼 የኢንቨስትመንት በር',
    tabChat: '🤖 የዲጎአይ ረዳት',
    tabNews: '📰 ዜና እና ታሪክ',

    // Section Descriptions
    mapDesc: 'የአካባቢውን ታሪክ ፣ የከፍታ መገለጫዎችን ለማወቅ እና የድምጽ መመሪያዎችን ለማጫወት በካርታው ላይ ያሉትን አረንጓዴ (ተፈጥሮ) ፣ ብርቱካንማ (ቅዱስ) ወይም ቢጫ (ባህል) ምልክቶችን ጠቅ ያድርጉ!',
    eventDesc: 'የአካባቢውን ሁነቶች፣ የገበያ ቀናትን እና አመታዊ በዓላትን ያግኙ። የጉዞ ፕሮግራምዎን ከታች ባለው ሰሌዳ ላይ ይከታተሉ።',
    galleryDesc: 'የጮቄ ስነ-ምህዳር ሎጅ ንድፎችን፣ የጎጃም ፈረሰኞችን እና የኦርጋኒክ ማር ምርትን ትክክለኛ ምስሎችን ይመልከቱ። ለማጉላት ማንኛውንም ምስል ጠቅ ያድርጉ።',
    investorDesc: 'የመሬት ድልድል ለማግኘት የግብርና ንግድዎን፣ የማር ማጣራትዎን ወይም የተራራ ሆቴል እቅድዎን ከታች ይመዝግቡ። በስኬት ሲመዘገቡ የፒዲኤፍ ቫውቸር ያትሙ።',
    chatDesc: 'ስለ ጮቄ ተራራ መንገዶች፣ የአካባቢው ማዘጋጃ ቤት፣ የማር ዋጋ መጋጠሚያዎች ወይም ስለ ጎጃም መጓጓዣ ጥያቄዎች አሉዎት? ከታች ካለው የ AI መስተንግዶ ረዳት ጋር ይነጋገሩ።',
    newsDesc: 'የማዘጋጃ ቤቱን መግለጫዎች ይከታተሉ፥ የዘመናት የጎጃም ታሪክ ድርሳናትን ያንብቡ፥ ከአካባቢው መሪዎች ጋር የተደረጉ ውይይቶችን ያግኙ።',

    // Trivia
    triviaHeader: 'ይህን ያውቁ ኖሯል? ፈጣን እውነታዎች',
    triviaSubtitle: 'ስለ ምስራቅ ጎጃም ታሪክ፣ ስለ ጮቄ ተራራዎች ተወላጅ ዝርያዎች እና ስለ ቢቡኝ ወረዳ ጥንታዊ የንግድ መንገዶች ልዩ ዝርዝሮችን ያግኙ።',
    triviaFact1Title: '🌾 የቢቡኝ ስንዴ ለምን ይከበራል?',
    triviaFact1Desc: 'የቢቡኝ ወረዳ ጥልቅ የእሳተ ገሞራ አፈር መዋቅር ከባህላዊ ኦርጋኒክ ማዳበሪያ ጋር ተዳምሮ ለጣፋጭ የቤት ውስጥ ዳቦ የሚያገለግሉ ከፍተኛ ዋጋ ያላቸውን የስንዴ ዝርያዎችን ያመርታል።',
    triviaFact2Title: '🐝 ኦርጋኒክ የጮቄ ማር ለምን ነጭ ሆነ?',
    triviaFact2Desc: 'የጮቄ ተራሮች የአገር በቀል ቢጫ አበቦች (የመስቀል አበቦች) እና የቀዝቃዛ ደጋ አበቦች መኖሪያ ናቸው። በእነዚህ አበቦች ላይ ብቻ የሚመገቡ ንቦች ለመድኃኒትነት እና ለምግብነት የሚከበር ወፍራም፣ ወተት የመሰለ ነጭ ማር ያዘጋጃሉ።',

    // Footer
    footerPara: 'በቢቡኝ ወረዳ ባህል፣ ስፖርት እና የግብርና ልማት ካቢኔዎች የሚተዳደር በይነተገናኝ የህዝብ መግቢያ በር። ዘላቂ ማህበረሰብን ፣ ቱሪዝምን እና ከፍተኛ የኢንቨስትመንት መጋቢነትን ያበረታታል።',
    footerSections: 'ዋና ክፍሎች',
    footerContact: 'የማዘጋጃ ቤት መረጃ',

    // Map
    visitedStatus: 'የጎበኙት መዳረሻ',
    exploredPercent: 'የተፈተሸ',
    allSites: 'ሁሉንም መዳረሻዎች',
    natureFilter: '🌿 ተፈጥሮ',
    cultureFilter: '🐴 የጎጃም ባህል',
    sacredFilter: '☦️ ቅዱሳን ቦታዎች',
    adminFilter: '🏛️ የልማት ቢሮ',

    // Events
    allEvents: '🗓️ ሁሉም ዝግጅቶች',
    marketFairs: '🍯 የገበያ ቀናት',
    religiousHolidays: '⛪ በዓላት',
    investmentForums: '💰 መድረኮች',
    scheduleFilter: 'የጊዜ ሰሌዳ አጣራ:',
    myItinerary: 'የእኔ የጉዞ መርሃ ግብር',
    savedEvents: 'የተቀመጡ',
    emptyItinerary: 'የጉዞ መርሃ ግብርዎ ባዶ ነው',
    emptyItineraryDesc: 'ከላይ ያሉትን የድጎ ጽዮን ጉዳዮችን ያስሱ እና የጉዞ መርሃ ግብር ለመንደፍ የ "+" ቁልፎችን ጠቅ ያድርጉ።',
    activeSpotlight: 'ልዩ የዝግጅት ትኩረት',
    addToItinerary: 'ወደ መርሃ ግብር አስገባ',
    removeFromItinerary: 'ከመርሃ ግብር አስወግድ',

    // Gallery
    allPhotos: '🗂️ ሁሉም ፎቶዎች',
    nationalCulture: '🐴 ባህላዊ ስርዓቶች',
    culinaryDelicacies: '🍯 የሀገር በቀል ምግቦች',
    regionalAgrobiz: '📊 የግብርና ልማት',

    // Investment
    priorityFields: 'ቀዳሚ መስኮች',
    priorityTitle: 'የኢንቨስትመንት መስክ ይምረጡ',
    prioritySubtitle: 'ድጎ ጽዮን በኢትዮጵያ ክልላዊ ካቢኔ ንዑስ ድንጋጌዎች የተደገፉ ፈጣን እድገቶችን ያቀርባል።',
    demandLevel: 'የፈላጊ ደረጃ',
    capitalMin: 'አነስተኛ ካፒታል',
    growthYoY: 'እድገት',
    registeredIncentives: 'የተረጋገጡ የክልል ማበረታቻዎች',
    priorityRepDesk: 'የውይይት ተወካይ ጠረጴዛ',
    licensingFramework: 'የፈቃድ አሰጣጥ ሂደት',
    roadmapTitle: 'ባለ 4-ደረጃ የኢንቨስትመንት ፍኖተ ካርታ',
    roadmapSubtitle: 'በባህል ቱሪዝም ወይም በግብርና ልማት ላይ መሬት ለማግኘት ሙሉውን ህጋዊ ሂደት ይማሩ።',
    submitIntent: 'የኢንቨስትመንት ሃሳብ ያስገቡ',
    submitIntentDesc: 'ለኢንቨስትመንት ምክክር ለመመዝገብ እባክዎ የንግድ ማረጋገጫዎችዎን እና ሃሳብዎን ያሳውቁ።',
    companyName: 'የድርጅት / ህጋዊ አካል ስም',
    investorName: 'የዋና ኢንቨስተር ስም',
    selectSector: 'ቀዳሚውን ዘርፍ ይምረጡ',
    proposedBudget: 'የታቀደው ዓመታዊ በጀት',
    contactEmail: 'የመገናኛ ኢሜይል አድራሻ',
    contactPhone: 'የመገናኛ ስልክ ቁጥር',
    projectBrief: 'የፕሮጀክቱ አጭር መግለጫ እና ጥያቄ',
    sustainablePledge: 'ይህ የኢንቨስትመንት ሃሳብ ከህጋዊ ገንዘብ ጋር እንደሚዛመድ፣ አካባቢን እንደሚጠብቅ እና ከጮቄ ተራራ ጥበቃ ፖሊሲዎች ጋር እንደሚስማማ በቁርጠኝነት ቃል እገባለሁ።',
    submitBtn: 'ሃሳብ አስገባ እና መዝገብ ውስጥ መዝግብ',
    activeRegistry: 'ንቁ የኢንቨስትመንት መዝገብ',
    activeRegistryDesc: 'ለድጎ ጽዮን እና ቢቡኝ የቀረቡ የኮርፖሬት እቅዶች የህዝብ መከታተያ መዝገብ።',

    // AI Chat
    chatWelcome: 'እንኳን ደህና መጡ! እኔ የድጎአይ ረዳት ነኝ። ስለ ውቧ ጮቄ ተራራ፣ ስለ ማክሰኞ ገበያ፣ ስለ ፈረሰኞች ባህል ወይም ስለ ኢንቨስትመንት አማራጮች ማንኛውንም ነገር ይጠይቁኝ!',
    askAssistant: 'የዲጎአይ ረዳትን ይጠይቁ (ለምሳሌ የጮቄ ተራራ ከፍታ፣ የገበያ ማር)...',
    offlineMode: 'የዲጎአይ አካባቢ ረዳት',

    // Admin
    adminLogin: 'የአስተዳዳሪ መግቢያ',
    adminDashboard: 'የአስተዳዳሪ መረጃ ጠቋሚ',
    manageUsers: 'ተጠቃሚዎችን ያስተዳድሩ',
    managePosts: 'ጽሑፎችን ያስተዳድሩ',
    manageGallery: 'ማህደር ያስተዳድሩ',
    manageEvents: 'ዝግጅቶችን ያስተዳድሩ',
    manageInvestments: 'ኢንቨስትመንቶችን ያስተዳድሩ',
    superAdminOnly: 'ልዕለ አስተዳዳሪ ብቻ',
    noPermission: 'ይህን ገጽ ለማየት ፈቃድ የሎትም',

    // Common
    loading: 'በመጫን ላይ...',
    error: 'ስህተት ተከስቷል',
    retry: 'እንደገና ሞክር',
    save: 'አስቀምጥ',
    update: 'አሻሽል',
    delete: 'ሰርዝ',
    cancel: 'ይቅር',
    confirm: 'አረጋግጥ',
    search: 'ፈልግ...',
    filter: 'አጣራ',
    refresh: 'አድስ',
    noResults: 'ምንም ውጤቶች አልተገኙም',
    viewAll: 'ሁሉንም ተመልከት',
    readMore: 'ተጨማሪ ያንብቡ',
    showLess: 'አጥር',
    back: 'ተመለስ',
    share: 'አጋራ',
    bookmark: 'ማስታወሻ',
    like: 'ውደድ',
    views: 'እይታዎች',
    author: 'ደራሲ',
    published: 'የታተመ',
    draft: 'ረቂቅ',
    pending: 'በመጠበቅ ላይ',
    approved: 'ተፈቅዷል',
    rejected: 'ውድቅ ተደርጓል',
    status: 'ሁኔታ',
    category: 'ምድብ',
    tags: 'መለያዎች',
    createdAt: 'የተፈጠረበት ቀን',
    updatedAt: 'የተሻሻለበት ቀን',
  },
};