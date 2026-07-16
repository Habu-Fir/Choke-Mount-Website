/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Landmark, EventItem, GalleryItem, InvestorSector, Article } from './types';

export const LANDMARKS: Landmark[] = [
  {
    id: 'choke_mountain',
    name: 'Mount Choke Biosphere Reserve',
    localName: 'ጮቄ ተራራ',
    description: 'The "Water Tower" of East Africa and the crown jewel of Gojjam. Towering at over 4,100 meters, Mount Choke features majestic Afro-alpine ecosystems, endemic giant lobelias, and refreshing sacred streams that feed the Blue Nile basin. The peak is home to unique climates and critical natural ecosystems.',
    history: 'Mount Choke has been celebrated for centuries as a vital water tower and a spiritual sanctuary. Its high-altitude peatlands regulate water flow throughout the Nile basin. Legend states that the holy streams descending from Choke possess healing attributes, preserving its flora from deforestation through community forest guidelines.',
    category: 'nature',
    coordinates: { x: 50, y: 15 },
    image: '/src/assets/images/digo_tsion_hero_1782218859792.jpg',
    elevation: '4,100m+ above sea level',
    highlights: ['Endemic Giant Lobelias', 'Choke Wetland Peatlands', 'Panoramic Highland Trekking']
  },
  {
    id: 'digo_tsion_church',
    name: 'Digo Tsion Saint Mary Church',
    localName: 'ዲጎ ጽዮን ማርያም ቤተክርስቲያን',
    description: 'The ancient spiritual heart of Digo Tsion town. This beautifully constructed church features traditional Ethiopian Orthodox architecture, surrounded by a pristine sacred forest that protects the local biodiversity. Inside are magnificent paintings and centuries-old scrolls.',
    history: 'Serving as the historical and cultural anchor of Digo Tsion for centuries, this sanctuary is renowned for religious scholarly studies (Kene). It is the center of the town\'s major Christian festivals like Timkat, Meskel, and the annual Mariam feasts, gathering thousands of faithful in spectacular tapestries of white cotton (Netela) and liturgical song.',
    category: 'sacred',
    coordinates: { x: 45, y: 48 },
    image: 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?auto=format&fit=crop&q=80&w=1200',
    elevation: '2,820m above sea level',
    highlights: ['Sabbath Liturgy and Chanting', 'Choke Sacred Forest Canopy', 'Medieval Manuscripts']
  },
  {
    id: 'memsah_waterfalls',
    name: 'Memsah Highland Cascades',
    localName: 'የመምሳህ ፏፏቴ',
    description: 'A breathtaking series of waterfalls cascading down the basalt cliffs of Bibugn. Surrounded by lush high-altitude vegetation, it is one of the most serene and untouched natural sights in the wereda, ideal for eco-tourists and hikers.',
    history: 'The Memsah river flows directly from Choke watershed. Under ancient Gojjam agricultural practices, these riverbeds served as vital dry-season irrigation channels and natural geological markers, keeping the community connected through stone arches.',
    category: 'nature',
    coordinates: { x: 30, y: 72 },
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    elevation: '2,650m above sea level',
    highlights: ['Basalt Cliff Formations', 'Lush Fern Valleys', 'Bird Watching Trails']
  },
  {
    id: 'tuesday_market',
    name: 'Digo Tsion Maksengo Gebeya',
    localName: 'የማክሰኞ ገበያ',
    description: 'The primary marketplace where the rich agricultural bounty of Bibugn is traded. Famous for Gojjam’s renowned organic white honey, amber barley, mountain grains, and traditional stone-carved utensils, creating an unforgettable cultural exchange.',
    history: 'Dating back to the establishment of Digo Tsion as a key high-land commercial stop along Gojjam trade routes, the Tuesday market is an institution. Farmers trek miles down the slopes of Choke to trade goods and catch up on district councils.',
    category: 'culture',
    coordinates: { x: 55, y: 55 },
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=1200',
    elevation: '2,800m above sea level',
    highlights: ['Organic Mountain White Honey', 'Teff & High-Altiude Wheat Grains', 'Hand-woven Shamma Garments']
  },
  {
    id: 'equestrian_grounds',
    name: 'Equestrian Guild Fields',
    localName: 'የፈረሰኞች ወታደራዊ ሜዳ',
    description: 'The training and ceremonial pasture of the Digo Tsion Equestrian Association. Gojjam is renowned throughout Ethiopia for its ancient and elite culture of horseback riding, spear-casting, and equestrian sports.',
    history: 'Historically, Gojjam horsemen formed critical mobile defensive regiments. Today, this noble martial art persists through festive tournaments on Genna and Timkat, where riders wear lion-mane headpieces and parade magnificent stallions in complex choreographies.',
    category: 'culture',
    coordinates: { x: 25, y: 35 },
    image: '/src/assets/images/gojjam_culture_riders_1782218878158.jpg',
    elevation: '2,850m above sea level',
    highlights: ['Traditional Jousting (Guks) Demonstrations', 'Gojjam Equestrian Parades', 'Stallion Breeding Guides']
  },
  {
    id: 'municipal_center',
    name: 'Bibugn Municipal Office & Investment Desk',
    localName: 'የቢቡኝ ወረዳ ማዘጋጃ ቤት',
    description: 'The administrative heart of Bibugn Wereda based in Digo Tsion. Undergoing rapid expansion, it is the one-stop support center coordinating public services, environmental guidelines, and providing dynamic incentives for local investments.',
    history: 'As Digo Tsion transitioned into a modern municipal administrative hub, this office was established to bridge ancient community governance (Kire/Sembete) with regional policies, prioritizing ecotourism and high-value agriculture.',
    category: 'admin',
    coordinates: { x: 42, y: 65 },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    elevation: '2,810m above sea level',
    highlights: ['One-Stop Investor Registration', 'Ecotourism Land Allocation', 'Agricultural Grants Information']
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'timkat_guks',
    title: 'Timkat Equestrian Tournament',
    localTitle: 'የጥምቀት ፈረሰኞች ውድድር',
    date: 19,
    month: 'January',
    ethiopianDateStr: 'Tir 11',
    category: 'cultural',
    description: 'Witness the world-famous Gojjam horsemen in spectacular action. Following the Epiphany religious services, hundreds of riders from all over Bibugn gather dressed in lion-mane headpieces and multi-colored velvet cloaks to display equestrian combat games (Yeferas Guks).',
    location: 'Digo Tsion Equestrian Grounds',
    time: '2:00 PM - 6:00 PM',
    organizer: 'Bibugn Culture & Sports Association',
    isPopular: true
  },
  {
    id: 'mariycon_feast',
    title: 'Feast of Digo Tsion Mariam',
    localTitle: 'ዲጎ ጽዮን ማርያም ዓመታዊ ንግሥ',
    date: 30,
    month: 'November',
    ethiopianDateStr: 'Hidar 21',
    category: 'holiday',
    description: 'The main annual religious pilgrimage celebrating Digo Tsion Saint Mary. Preceded by night vigils with mesmerizing liturgical chanting by priests (Mahlet), the day is marked by spectacular outdoor processions of the Tabot (covenant replica) accompanied by massive feasts.',
    location: 'Digo Tsion Saint Mary Church',
    time: '5:00 AM - 4:00 PM',
    organizer: 'Digo Tsion Parish Administration',
    isPopular: true
  },
  {
    id: 'honey_festival',
    title: 'Tuesday Honey & Grain Bazaar',
    localTitle: 'የማክሰኞ የቆዳና ማር ባዛር',
    date: 7,
    month: 'Quarterly Tuesdays',
    ethiopianDateStr: 'Maksengo Maksengo',
    category: 'market',
    description: 'An expansive agricultural fair showcasing Choke Mountain’s world-famous purely organic white honey. Visitors can sample unique honeys processed by local cooperatives, buy Gojjam mountain wheat, and participate in bee-keeping workshops.',
    location: 'Central Market Square',
    time: '8:00 AM - 5:00 PM',
    organizer: 'Bibugn Cooperative Union Group',
    isPopular: false
  },
  {
    id: 'tourism_investment_summit',
    title: 'Bibugn Ecotourism & Agribusiness Forum',
    localTitle: 'የቢቡኝ ኢንቨስትመንት ፎረም',
    date: 12,
    month: 'October',
    ethiopianDateStr: 'Tekemt 02',
    category: 'investment',
    description: 'A key opportunity for domestic and international developers. The municipal cabinet hosts discussions on vacant lands near Mt. Choke, streamlining tax-free machinery import setups, and matchmaking local organic farming associations with agro-packaging developers.',
    location: 'Municipal Assembly Hall, Digo Tsion',
    time: '9:00 AM - 5:00 PM',
    organizer: 'Bibugn District Investment Bureau',
    isPopular: true
  },
  {
    id: 'choke_conservation',
    title: 'Mount Choke Green Legacy Day',
    localTitle: 'የጮቄ ተራራ አረንጓዴ አሻራ ቀን',
    date: 21,
    month: 'July',
    ethiopianDateStr: 'Hamle 14',
    category: 'cultural',
    description: 'Join thousands of local farmers, community elders, and eco-conscious tourists in planting over 100,000 endemic highland seedlings (including kosso, hagenia, and bamboo) on the water-catchment buffer zones of Choke mountain to combat erosion.',
    location: 'Choke Buffer Slopes',
    time: '7:30 AM - 2:00 PM',
    organizer: 'Bibugn Forestry & Environment Agency',
    isPopular: false
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g_rider',
    title: 'Equestrian Rider in Choke Meadows',
    category: 'culture',
    url: '/src/assets/images/gallery_ethiopian_rider_1782226707776.jpg',
    description: 'An elegant equestrian in local attire galloping across the lush green slopes of Choke Mountain.'
  },
  {
    id: 'g_huts',
    title: 'Misty Tukul Huts of Bibugn',
    category: 'nature',
    url: '/src/assets/images/gallery_misty_tukul_huts_1782226727645.jpg',
    description: 'Traditional thatch-roof circular tukuls enveloped in spectacular morning mountain fog.'
  },
  {
    id: 'g_trekking',
    title: 'Highland Horseback Safaris',
    category: 'investment',
    url: '/src/assets/images/gallery_horse_trekking_1782226741179.jpg',
    description: 'Adventurous eco-trekking across Mount Choke\'s massive sub-alpine plateaus.'
  },
  {
    id: 'g_dining',
    title: 'Communal Gathering and Injera Feast',
    category: 'cuisine',
    url: '/src/assets/images/gallery_communal_dining_1782226759641.jpg',
    description: 'Visitors sharing a traditional platter of organic high-altitude injera with our municipal elders.'
  }
];

export const INVESTMENT_SECTORS: InvestorSector[] = [
  {
    id: 'eco_tourism',
    name: 'Highland Eco-Lodges & Camping',
    localName: 'የደጋ የኢኮ-ሎጅ እና ካምፕ ልማት',
    demand: 'Critical',
    localDemand: 'በጣም ወሳኝ',
    growth: '18% YoY',
    localGrowth: '18% በዓመት',
    description: 'Developing low-impact, premium ecotourism lodges and high-altitude hiking trails on the slopes of Choke Mountains. High demand from domestic tourists escaping city heat and international conservation trekkers.',
    localDescription: 'በጮቄ ተራሮች ላይ አነስተኛ ተፅዕኖ ያላቸው ከፍተኛ ጥራት ያላቸው የስነ-ምህዳር ቱሪዝም ሎጆችን እና የደጋ የእግር ጉዞ መንገዶችን ማልማት። ከከተማ ሙቀት ለሚያመልጡ የሀገር ውስጥ ቱሪስቶች እና ለአለም አቀፍ ተጓዦች ከፍተኛ ፍላጎት አለው።',
    incentives: [
      '5-Year Regional Tax Holiday',
      'Free duty import of construction solar grids and vehicles',
      'Co-guaranteed security and municipal access roads'
    ],
    localIncentives: [
      'የ 5 ዓመት የክልል ግብር ነፃ መብት',
      'ለግንባታ የሚያገለግሉ የፀሐይ ኃይል ስርዓቶች እና ተሽከርካሪዎች ከቀረጥ ነፃ ማስገባት',
      'የተረጋገጠ የደህንነት እና የማዘጋጃ ቤት የመዳረሻ መንገዶች ግንባታ'
    ],
    minimumCapital: '$100,000 USD / 5M ETB',
    localMinimumCapital: '$100,000 ዶላር / 5 ሚሊዮን ብር',
    contactPerson: 'Director of Tourism Development Bureau (Ato Abebe Alemu)',
    localContactPerson: 'በአቶ አበበ ዓለሙ (የቱሪዝም ልማት ቢሮ ዳይሬክተር)'
  },
  {
    id: 'honey_forestry',
    name: 'Organic White Honey Processing',
    localName: 'የኦርጋኒክ ነጭ ማር ማጣሪያና ማሸጊያ',
    demand: 'High',
    localDemand: 'ከፍተኛ',
    growth: '25% YoY',
    localGrowth: '25% በዓመት',
    description: 'Establishing modern refining, certification, and eco-friendly packaging centers for Mount Choke’s organic white honey. Digo Tsion honey has immense premium export potential to European and Middle Eastern markets.',
    localDescription: 'ለጮቄ ተራራ ኦርጋኒክ ነጭ ማር ዘመናዊ የማጣራት፣ የማረጋገጫ እና ስነ-ምህዳር ተስማሚ ማሸጊያ ማዕከላትን ማቋቋም። የድጎ ጽዮን ማር ለአውሮፓ እና ለመካከለኛው ምስራቅ ገበያዎች ከፍተኛ የወጪ ንግድ አቅም አለው።',
    incentives: [
      'Immediate access to 15 regional agricultural cooperatives',
      'Export matching grants from Federal bureaus',
      'Subsidized warehouse leases at Bibugn Agro-Zone'
    ],
    localIncentives: [
      'በቀጥታ 15 የእርሻ ህብረት ስራ ማህበራትን ማግኘት መቻል',
      'ከፌዴራል ቢሮዎች የወጪ ንግድ ማውጫ የገንዘብ ድጋፍ',
      'በቢቡኝ የግብርና ዞን የስምምነት መጋዘን ኪራይ ድጎማ'
    ],
    minimumCapital: '$50,000 USD / 2.5M ETB',
    localMinimumCapital: '$50,000 ዶላር / 2.5 ሚሊዮን ብር',
    contactPerson: 'Agribusiness Advisor (W/ro Tigist Hailu)',
    localContactPerson: 'በወ/ሮ ትዕግስት ኃይሉ (የግብርና ቢሮ አማካሪ)'
  },
  {
    id: 'highland_agro',
    name: 'Modern Wheat & Barley Milling',
    localName: 'የዘመናዊ ስንዴ እና ገብስ ወፍጮ ልማት',
    demand: 'High',
    localDemand: 'ከፍተኛ',
    growth: '14% YoY',
    localGrowth: '14% በዓመት',
    description: 'Bibugn is a high-yielding wheat basket. Investors are needed to introduce modern agro-forestry, clean sorting machinery, organic pest control, and regional flour milling facilities to minimize transport post-harvest loss.',
    localDescription: 'ቢቡኝ ከፍተኛ ምርት የሚገኝበት የስንዴ ጎተራ ነው። ከምርት መሰብሰብ በኋላ የሚፈጠረውን ብክነት ለመቀነስ ዘመናዊ የግብርና-ደንን፣ ህክምናዎችን፣ የኦርጋኒክ ተባዮች መከላከያን እና የዱቄት መፍጫ ፋብሪካዎችን ለማልማት ባለሀብቶች ይፈለጋሉ።',
    incentives: [
      '99-Year arable agricultural land leasing guarantees',
      'Customs clearance in fast-track inland ports',
      'Access to local credit lines from Development Bank of Ethiopia'
    ],
    localIncentives: [
      'የ99-ዓመት የእርሻ መሬት የலிዝ መብት ዋስትና',
      'በፍጥነት በሚንቀሳቀሱ ወደቦች የጉምሩክ ክሊራንስ ማግኘት',
      'ከኢትዮጵያ ልማት ባንክ የአካባቢ የብድር መስመሮችን ማግኘት መቻል'
    ],
    minimumCapital: '$150,000 USD / 8M ETB',
    localMinimumCapital: '$150,000 ዶላር / 8 ሚሊዮን ብር',
    contactPerson: 'Agricultural Desk Representative (Ato Belay Fentahun)',
    localContactPerson: 'በአቶ በላይ ፈንታሁን (የግብርና ቢሮ ተወካይ)'
  }
];

