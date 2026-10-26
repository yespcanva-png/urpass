import type { ExploreCategory, ExploreDateFilter, ExploreEventItem, ExplorePricingFilter } from "./types";

export type ExploreSeoPageType = "city" | "category" | "seasonal" | "intent";
export type ExploreSeoPriority = "P1" | "P2" | "P3";
export const MIN_EXPLORE_COLLECTION_EVENTS = 3;

export interface ExploreSeoHighlight {
  title: string;
  desc: string;
  tag?: string;
}

export interface ExploreSeoFaq {
  q: string;
  a: string;
}

export interface ExploreSeoPageConfig {
  slug: string;
  type: ExploreSeoPageType;
  priority: ExploreSeoPriority;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  badgeText: string;
  badgeTone: "violet" | "emerald" | "amber" | "indigo";
  directAnswer: string;
  contentSynopsis: string;
  cityFilter?: string;
  categoryFilter?: ExploreCategory;
  dateFilter?: ExploreDateFilter;
  pricingFilter?: ExplorePricingFilter;
  queryKeywords?: string[];
  highlights: ExploreSeoHighlight[];
  faqs: ExploreSeoFaq[];
  popularSearchQueries: string[];
  relatedSlugs: string[];
  ctaText: string;
}

export function matchesExploreSeoPage(event: ExploreEventItem, page: ExploreSeoPageConfig, now = new Date()): boolean {
  if (page.cityFilter && event.city.toLowerCase() !== page.cityFilter.toLowerCase()) return false;
  if (page.categoryFilter && page.categoryFilter !== "all" && event.category !== page.categoryFilter) return false;
  if (page.pricingFilter === "free" && !event.isFree && event.minPricePaise > 0) return false;
  if (page.pricingFilter === "paid" && (event.isFree || event.minPricePaise === 0)) return false;

  if (page.dateFilter && page.dateFilter !== "all") {
    const today = now.toISOString().slice(0, 10);
    if (page.dateFilter === "today" && event.eventDate !== today) return false;
    if (page.dateFilter === "this_month" && !event.eventDate.startsWith(today.slice(0, 7))) return false;
    if (page.dateFilter === "this_weekend") {
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      if (![saturday.toISOString().slice(0, 10), sunday.toISOString().slice(0, 10)].includes(event.eventDate)) return false;
    }
  }

  if (page.queryKeywords?.length) {
    const searchable = `${event.name} ${event.description || ""} ${event.venue} ${event.city}`.toLowerCase();
    if (!page.queryKeywords.some((keyword) => searchable.includes(keyword.toLowerCase()))) return false;
  }

  return true;
}

export const EXPLORE_SEO_PAGES: ExploreSeoPageConfig[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. CITY-BASED EVENT DISCOVERY (15 Pages)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "bangalore",
    type: "city",
    priority: "P1",
    h1: "Discover Events in Bangalore",
    seoTitle: "Events in Bangalore | Discover & Book Tickets – UrPass",
    metaDescription:
      "Explore upcoming concerts, workshops, festivals, meetups and experiences in Bangalore. Find event details and book tickets on UrPass Explore.",
    badgeText: "Bangalore Event Guide",
    badgeTone: "violet",
    directAnswer:
      "Looking for events in Bangalore? UrPass Explore features curated tech summits, live indie concerts, stand-up comedy, and creative workshops across Koramangala, Indiranagar, Whitefield, and Central Bengaluru with instant 0.3s digital QR passes and 0% platform ticket fees.",
    contentSynopsis:
      "Bengaluru is India's tech and cultural capital, hosting over 2,000 live events annually ranging from hackathons and founder mixers in HSR Layout to open-air music festivals at Palace Grounds. Whether you are searching for weekend gigs, college fests, or intimate culinary masterclasses, UrPass connects you directly to verified hosts with real-time pass generation.",
    cityFilter: "Bengaluru",
    highlights: [
      { title: "Koramangala & Indiranagar", desc: "Craft beer microbreweries, stand-up comedy clubs, acoustic music gigs, and weekend social mixers.", tag: "Nightlife & Social" },
      { title: "Whitefield & Outer Ring Road", desc: "Developer summits, enterprise AI summits, tech unconferences, and corporate networking meetups.", tag: "Tech & Networking" },
      { title: "Palace Grounds & Manpho", desc: "Large-scale music concerts, international EDM tours, college cultural fests, and multi-day food expos.", tag: "Mega Venues" },
      { title: "HSR Layout & Jayanagar", desc: "Founder pitch events, indie creator workshops, art classes, and community running clubs.", tag: "Startups & Arts" },
    ],
    faqs: [
      { q: "Where can I find upcoming events in Bangalore?", a: "You can discover verified Bangalore events directly on UrPass Explore (/explore/bangalore). Filter by concerts, tech conferences, workshops, comedy, and free weekend activities with transparent pricing." },
      { q: "How do I book tickets for Bangalore events on UrPass?", a: "Select your preferred Bangalore event, click 'Get Tickets', choose your tier, and complete guest checkout via UPI or card. Your verified QR pass is delivered immediately via WhatsApp and email." },
      { q: "What are the most popular event venues in Bengaluru?", a: "Top venues include Palace Grounds (Sankey Road), Manpho Convention Centre (Nagavara), UB City Amphitheatre, Bangalore International Centre (Domlur), and WeWork Galaxy (Residency Road)." },
      { q: "Are free events available in Bangalore?", a: "Yes, Bangalore hosts dozens of free developer meetups, open-source workshops, art exhibitions, and park runs every week. Use the Free Events filter on UrPass to browse zero-cost passes." },
    ],
    popularSearchQueries: ["events in bangalore this weekend", "music concerts in bangalore", "things to do in bangalore today", "startup meetups bangalore 2026", "comedy shows in indiranagar"],
    relatedSlugs: ["tech-events", "music-concerts", "this-weekend", "free-events", "chennai", "hyderabad"],
    ctaText: "Explore Bangalore Events",
  },
  {
    slug: "chennai",
    type: "city",
    priority: "P1",
    h1: "Discover Events in Chennai",
    seoTitle: "Events in Chennai | Discover & Book Tickets – UrPass",
    metaDescription:
      "Discover music concerts, cultural fests, tech meetups, and coastal weekend events in Chennai. Reserve verified passes with instant QR check-in on UrPass.",
    badgeText: "Chennai Event Guide",
    badgeTone: "violet",
    directAnswer:
      "Searching for upcoming events in Chennai? UrPass Explore features live classical & indie music concerts, beach festivals along ECR, college culturals, and tech meetups across OMR, Nungambakkam, and Alwarpet with sub-second entry passes.",
    contentSynopsis:
      "Chennai blends rich heritage with a booming SaaS and tech corridor. From the revered December Margazhi music season in Mylapore to high-energy cultural festivals at IIT Madras and beachside retreats along the East Coast Road, discover verified event listings with instant confirmation.",
    cityFilter: "Chennai",
    highlights: [
      { title: "OMR & Guindy Tech Corridor", desc: "SaaS conferences, engineering hackathons, design meetups, and enterprise developer summits.", tag: "Tech & Business" },
      { title: "Mylapore & Nungambakkam", desc: "Carnatic concerts, traditional theatre, art retrospectives, and cultural festivals.", tag: "Heritage & Culture" },
      { title: "ECR & Besant Nagar", desc: "Beachside acoustic shows, indie pop gigs, outdoor cinema screenings, and weekend flea markets.", tag: "Weekend & Music" },
      { title: "T. Nagar & Anna Nagar", desc: "Food carnivals, comedy club nights, shopping popups, and family workshops.", tag: "Social & Lifestyle" },
    ],
    faqs: [
      { q: "Where can I find concerts and gigs in Chennai?", a: "Browse UrPass Explore Chennai (/explore/chennai) for upcoming live shows across Music Academy, Sir Mutha Venkatasubba Rao Hall, Bay 146, and open-air beach venues." },
      { q: "How do I get passes for Chennai college cultural festivals?", a: "UrPass partners directly with premier institutions like IIT Madras, Loyola College, and Anna University. You can claim digital QR student or guest passes seamlessly on UrPass." },
      { q: "Are tickets on UrPass verified for entry?", a: "Yes. Every UrPass ticket contains an anti-counterfeit encrypted QR code scanned by gate crew in under 0.3 seconds, guaranteeing genuine admission." },
    ],
    popularSearchQueries: ["events in chennai this weekend", "music concerts in chennai 2026", "things to do in chennai", "standup comedy chennai", "college fests chennai"],
    relatedSlugs: ["cultural-events", "music-concerts", "college-fests", "coimbatore", "bangalore"],
    ctaText: "Explore Chennai Events",
  },
  {
    slug: "hyderabad",
    type: "city",
    priority: "P1",
    h1: "Discover Events in Hyderabad",
    seoTitle: "Events in Hyderabad | Discover & Book Tickets – UrPass",
    metaDescription:
      "Find upcoming tech summits, music gigs, food carnivals and nightlife events in Hyderabad. Book tickets with zero platform fees on UrPass Explore.",
    badgeText: "Hyderabad Event Guide",
    badgeTone: "violet",
    directAnswer:
      "Discover the best events in Hyderabad on UrPass Explore. From cybersecurity summits in HITEC City and Gachibowli to music nights in Jubilee Hills and heritage food festivals at Gachibowli Stadium, get verified passes delivered instantly to your phone.",
    contentSynopsis:
      "Hyderabad has emerged as a premier hub for high-energy concerts, tech conventions, and culinary festivals. UrPass brings you verified access to events across HITEC City, Jubilee Hills, Banjara Hills, and the Financial District with zero commission fees.",
    cityFilter: "Hyderabad",
    highlights: [
      { title: "HITEC City & Gachibowli", desc: "Global tech summits, AI conferences, developer days, and hackathons at HITEX Exhibition Centre.", tag: "Tech & Innovation" },
      { title: "Jubilee Hills & Banjara Hills", desc: "Stand-up comedy gigs, live electronic music, rooftop networking, and food trails.", tag: "Nightlife & Dining" },
      { title: "Secunderabad & Begumpet", desc: "Heritage walks, sports tournaments, club socials, and flea markets.", tag: "Community & Sports" },
    ],
    faqs: [
      { q: "What events are happening in Hyderabad this weekend?", a: "Check UrPass Explore Hyderabad (/explore/hyderabad) for live weekend listings, including live concerts, stand-up shows in Jubilee Hills, and workshops." },
      { q: "Where are major exhibitions held in Hyderabad?", a: "Major expos and conventions are held at HITEX Exhibition Centre and Hyderabad International Convention Centre (HICC) in Novotel campus." },
    ],
    popularSearchQueries: ["events in hyderabad this weekend", "tech events in hyderabad 2026", "standup comedy hyderabad", "parties in jubilee hills"],
    relatedSlugs: ["tech-events", "business-networking", "this-weekend", "bangalore"],
    ctaText: "Explore Hyderabad Events",
  },
  {
    slug: "coimbatore",
    type: "city",
    priority: "P1",
    h1: "Discover Events in Coimbatore",
    seoTitle: "Events in Coimbatore | Discover & Book Tickets – UrPass",
    metaDescription:
      "Explore industrial expos, college symposiums, marathons and workshops in Coimbatore. Book verified entry passes with instant QR scanning on UrPass.",
    badgeText: "Coimbatore Event Guide",
    badgeTone: "violet",
    directAnswer:
      "Looking for upcoming events in Coimbatore? UrPass Explore features engineering symposiums, industrial trade expos at CODISSIA, marathons along Avinashi Road, and entrepreneurial meetups in RS Puram with zero booking fees.",
    contentSynopsis:
      "Known as the Manchester of South India, Coimbatore is a vibrant academic and industrial epicenter. UrPass connects university students, industrialists, runners, and families with verified events across PSG Tech, CODISSIA Trade Fair Complex, and Race Course.",
    cityFilter: "Coimbatore",
    highlights: [
      { title: "CODISSIA Complex", desc: "International industrial trade fairs, agricultural expos, and business summits.", tag: "Industrial Expos" },
      { title: "Avinashi Road & Peelamedu", desc: "College hackathons, technical paper symposiums, and university culturals across PSG & CIT.", tag: "Colleges & Youth" },
      { title: "Race Course & RS Puram", desc: "Marathons, charity cycling rallies, outdoor farmers markets, and wellness workshops.", tag: "Sports & Community" },
    ],
    faqs: [
      { q: "Where can I find college fests in Coimbatore?", a: "Browse UrPass Explore Coimbatore (/explore/coimbatore) for inter-college technical symposiums, sports tournaments, and cultural fests across Coimbatore colleges." },
      { q: "How do CODISSIA trade fair visitor passes work on UrPass?", a: "Register on UrPass Explore to receive an instant digital QR badge on your phone for direct gate entry without waiting in paper counter queues." },
    ],
    popularSearchQueries: ["events in coimbatore this weekend", "codissia expos 2026", "college symposiums coimbatore", "marathon coimbatore 2026"],
    relatedSlugs: ["college-fests", "exhibitions", "sports-events", "chennai", "madurai"],
    ctaText: "Explore Coimbatore Events",
  },
  {
    slug: "mumbai",
    type: "city",
    priority: "P1",
    h1: "Discover Events in Mumbai",
    seoTitle: "Events in Mumbai | Discover & Book Tickets – UrPass",
    metaDescription:
      "Find concerts, theatre performances, comedy nights, and Bollywood events in Mumbai. Book verified passes with instant delivery on UrPass Explore.",
    badgeText: "Mumbai Event Guide",
    badgeTone: "violet",
    directAnswer:
      "Discover the finest events in Mumbai. From live arena concerts at Jio World Garden and theatre at NCPA to stand-up comedy in Bandra and film screenings in Andheri, UrPass Explore offers instant digital QR ticketing with zero hidden surcharges.",
    contentSynopsis:
      "Mumbai is India's entertainment powerhouse. Every week brings world-class Broadway tours, comedy lineups, design exhibitions at Nesco, and college festivals across St. Xavier's and IIT Bombay. Find your next experience on UrPass Explore.",
    cityFilter: "Mumbai",
    highlights: [
      { title: "Bandra & Khar", desc: "Stand-up comedy clubs, acoustic singer-songwriter nights, pop-up markets, and indie art shows.", tag: "Nightlife & Comedy" },
      { title: "BKC & Jio World", desc: "International concert tours, luxury lifestyle expos, and global investor conventions.", tag: "Arena & Luxury" },
      { title: "Colaba & Nariman Point", desc: "Heritage art gallery walks, NCPA plays, symphony orchestra recitals, and maritime events.", tag: "Arts & Theatre" },
      { title: "Goregaon (Nesco)", desc: "Mega industrial trade fairs, consumer conventions, and comic cons.", tag: "Expos & Fairs" },
    ],
    faqs: [
      { q: "How do I find live events in Mumbai this weekend?", a: "Visit UrPass Explore Mumbai (/explore/mumbai) to filter live events across Bandra, BKC, South Bombay, and Andheri with real-time seat availability." },
      { q: "Are tickets delivered immediately on UrPass?", a: "Yes. As soon as you confirm your reservation, an encrypted QR pass is generated instantly for hassle-free mobile gate scanning." },
    ],
    popularSearchQueries: ["events in mumbai this weekend", "concerts in mumbai 2026", "comedy shows in bandra", "ncpa plays mumbai", "jio world convention centre events"],
    relatedSlugs: ["music-concerts", "standup-comedy", "food-festivals", "pune", "delhi-ncr"],
    ctaText: "Explore Mumbai Events",
  },
  {
    slug: "delhi-ncr",
    type: "city",
    priority: "P1",
    h1: "Discover Events in Delhi NCR",
    seoTitle: "Events in Delhi NCR | Discover & Book Tickets – UrPass",
    metaDescription:
      "Explore music concerts, food festivals, cultural carnivals and conferences in Delhi, Gurgaon & Noida. Book verified tickets on UrPass Explore.",
    badgeText: "Delhi NCR Event Guide",
    badgeTone: "violet",
    directAnswer:
      "Explore upcoming events across Delhi NCR, Gurugram, and Noida on UrPass Explore. Discover mega concerts at JLN Stadium, trade expos at Bharat Mandapam, culinary festivals, and startup summits at Cyber Hub with lightning QR check-in.",
    contentSynopsis:
      "The National Capital Region hosts India's most expansive calendar of cultural exhibitions, diplomatic summits, live music spectacles, and literary gatherings. UrPass brings you verified ticketing across Delhi, Gurugram, and Noida with direct host confirmation.",
    cityFilter: "Delhi NCR",
    highlights: [
      { title: "Central Delhi & Pragati Maidan", desc: "Bharat Mandapam expos, international book fairs, crafts festivals, and diplomatic cultural nights.", tag: "Expos & Culture" },
      { title: "JLN Stadium & Siri Fort", desc: "Mega stadium concerts, Sufi music evenings, regional food fests, and sports championships.", tag: "Concerts & Gigs" },
      { title: "Cyber Hub & Golf Course Road", desc: "Enterprise tech conclaves, startup mixers, microbrewery comedy nights, and corporate masterclasses.", tag: "Gurgaon Tech" },
      { title: "Noida Expo Mart", desc: "Automotive trade expos, sustainable energy summits, and university youth festivals.", tag: "Noida Trade" },
    ],
    faqs: [
      { q: "What events are happening in Delhi NCR today?", a: "Check UrPass Explore Delhi NCR (/explore/delhi-ncr) to see verified live music, theatre, exhibitions, and networking events happening today across Delhi, Gurgaon, and Noida." },
      { q: "Where can I book tickets for Bharat Mandapam events?", a: "UrPass features official registration and ticketing for public exhibitions and conferences hosted at Bharat Mandapam and Pragati Maidan." },
    ],
    popularSearchQueries: ["events in delhi this weekend", "jln stadium concerts 2026", "gurgaon comedy shows", "food festivals delhi 2026", "bharat mandapam expos"],
    relatedSlugs: ["music-concerts", "exhibitions", "cultural-events", "mumbai", "jaipur"],
    ctaText: "Explore Delhi NCR Events",
  },
  {
    slug: "pune",
    type: "city",
    priority: "P2",
    h1: "Discover Events in Pune",
    seoTitle: "Events in Pune | Discover & Book Tickets – UrPass",
    metaDescription:
      "Discover college fests, indie music gigs, tech hackathons and outdoor treks in Pune. Book verified tickets with zero commission on UrPass Explore.",
    badgeText: "Pune Event Guide",
    badgeTone: "indigo",
    directAnswer:
      "Looking for events in Pune? UrPass Explore features university hackathons, outdoor camping fests, indie music gigs in Koregaon Park, and auto tech summits in Hinjawadi with fast, reliable QR ticketing.",
    contentSynopsis:
      "Known as the Oxford of the East, Pune is celebrated for its youthful energy, thriving indie music culture, and vibrant tech corridors. UrPass connects students, engineers, and creatives with verified passes to the city's best gatherings.",
    cityFilter: "Pune",
    highlights: [
      { title: "Koregaon Park & Kalyani Nagar", desc: "Acoustic music nights, comedy venues, rooftop mixers, and artisan workshops.", tag: "Music & Social" },
      { title: "Hinjawadi & Baner", desc: "Software developer meetups, startup roundtables, and tech hackathons.", tag: "Tech & Work" },
      { title: "Lonavala & Kamshet Belt", desc: "Weekend music campouts, trekking excursions, and cycling brevets.", tag: "Outdoors & Treks" },
    ],
    faqs: [
      { q: "Where are live gigs hosted in Pune?", a: "Popular live music hotspots include High Spirits (Koregaon Park), Phoenix Marketcity, and seasonal outdoor amphitheatre venues in Baner and Balewadi." },
    ],
    popularSearchQueries: ["events in pune this weekend", "koregaon park gigs", "college fests pune", "things to do in pune"],
    relatedSlugs: ["college-fests", "music-concerts", "mumbai", "this-weekend"],
    ctaText: "Explore Pune Events",
  },
  {
    slug: "kochi",
    type: "city",
    priority: "P2",
    h1: "Discover Events in Kochi",
    seoTitle: "Events in Kochi | Discover & Book Tickets – UrPass",
    metaDescription:
      "Discover art exhibitions, indie music gigs, tech conclaves and coastal festivals in Kochi. Book verified passes on UrPass Explore.",
    badgeText: "Kochi Event Guide",
    badgeTone: "indigo",
    directAnswer:
      "Explore upcoming events in Kochi. From contemporary art exhibitions in Fort Kochi and heritage walks to tech conclaves at Infopark Kakkanad and food carnivals at Marine Drive, book tickets with instant QR passes on UrPass.",
    contentSynopsis:
      "Kochi is Kerala's commercial and creative capital, famous for the Kochi-Muziris Biennale, maritime heritage, and vibrant indie startup culture. Discover verified concerts, art shows, and tech meetups on UrPass Explore.",
    cityFilter: "Kochi",
    highlights: [
      { title: "Fort Kochi & Mattancherry", desc: "Contemporary art biennials, heritage photo walks, jazz nights, and café literary sessions.", tag: "Art & Heritage" },
      { title: "Kakkanad & Infopark", desc: "Developer meetups, cloud computing summits, startup pitch sessions, and maker workshops.", tag: "Tech & Startups" },
      { title: "Marine Drive & Panampilly Nagar", desc: "Street food festivals, sunset music concerts, and lifestyle pop-up markets.", tag: "Waterfront & Food" },
    ],
    faqs: [
      { q: "How do I find art and music events in Fort Kochi?", a: "Visit UrPass Explore Kochi (/explore/kochi) to discover verified indie concerts, art gallery openings, and heritage walking tours." },
    ],
    popularSearchQueries: ["events in kochi this weekend", "fort kochi art events", "things to do in kochi", "infopark meetups kochi"],
    relatedSlugs: ["art-workshops", "cultural-events", "thiruvananthapuram", "chennai"],
    ctaText: "Explore Kochi Events",
  },
  {
    slug: "thiruvananthapuram",
    type: "city",
    priority: "P2",
    h1: "Discover Events in Trivandrum",
    seoTitle: "Events in Trivandrum | Discover & Book Tickets – UrPass",
    metaDescription:
      "Find tech symposiums at Technopark, cultural celebrations and youth fests in Thiruvananthapuram. Book verified event passes on UrPass Explore.",
    badgeText: "Trivandrum Event Guide",
    badgeTone: "indigo",
    directAnswer:
      "Find upcoming events in Thiruvananthapuram (Trivandrum). Browse aerospace and IT summits in Technopark, classical dance festivals at Nishagandhi Auditorium, and college symposiums on UrPass Explore.",
    contentSynopsis:
      "Kerala's capital blends stately cultural traditions with Technopark's tech ecosystem. UrPass provides organizers and attendees with seamless QR ticket reservations across museums, open-air auditoriums, and tech parks.",
    cityFilter: "Thiruvananthapuram",
    highlights: [
      { title: "Technopark Campus", desc: "Developer conferences, AI sprints, aerospace symposiums, and corporate sports leagues.", tag: "Technopark" },
      { title: "Kanakakunnu & Nishagandhi", desc: "Classical dance fests, flower shows, handloom exhibitions, and state cultural carnivals.", tag: "Heritage" },
      { title: "Kowdiar & Manaveeyam Veedhi", desc: "Open street cultural performances, poetry slams, and acoustic music nights.", tag: "Arts & Youth" },
    ],
    faqs: [
      { q: "Where are classical dance and music festivals held in Trivandrum?", a: "The Nishagandhi Open Air Auditorium and Kanakakunnu Palace grounds host the annual Nishagandhi Dance Festival and state cultural events." },
    ],
    popularSearchQueries: ["events in trivandrum this weekend", "technopark events 2026", "nishagandhi auditorium events", "things to do in thiruvananthapuram"],
    relatedSlugs: ["cultural-events", "tech-events", "kochi", "coimbatore"],
    ctaText: "Explore Trivandrum Events",
  },
  {
    slug: "madurai",
    type: "city",
    priority: "P2",
    h1: "Discover Events in Madurai",
    seoTitle: "Events in Madurai | Discover & Book Tickets – UrPass",
    metaDescription:
      "Discover cultural celebrations, educational seminars, college symposiums and trade fairs in Madurai. Book tickets with instant QR passes on UrPass.",
    badgeText: "Madurai Event Guide",
    badgeTone: "indigo",
    directAnswer:
      "Looking for events in the Temple City? UrPass Explore features cultural festivals, college technical symposiums across Thiagarajar College, trade expos at IDA Scudder Auditorium, and culinary festivals in Madurai.",
    contentSynopsis:
      "Madurai, celebrated for its ancient Meenakshi Temple and historic Tamil sangams, is also a rapidly expanding regional hub for universities, trade exhibitions, and medical conferences. UrPass makes reserving passes fast and verifiable.",
    cityFilter: "Madurai",
    highlights: [
      { title: "TCE & Anna University Campuses", desc: "Engineering symposiums, student hackathons, and technical design summits.", tag: "Engineering" },
      { title: "Tamukkam Grounds & Gandhi Museum", desc: "Book fairs, handicraft exhibitions, food carnivals, and cultural pageants.", tag: "Public Expos" },
      { title: "Bypass Road & KK Nagar", desc: "Business seminars, trade meetings, and youth entrepreneurial workshops.", tag: "Business" },
    ],
    faqs: [
      { q: "How can I book passes for Madurai exhibitions on UrPass?", a: "Select the Madurai event on UrPass Explore, enter your contact details, and your QR code ticket is issued instantly for direct entrance scanning." },
    ],
    popularSearchQueries: ["events in madurai this weekend", "madurai college symposiums", "tamukkam grounds expos", "things to do in madurai"],
    relatedSlugs: ["cultural-events", "college-fests", "coimbatore", "chennai"],
    ctaText: "Explore Madurai Events",
  },
  {
    slug: "erode",
    type: "city",
    priority: "P2",
    h1: "Discover Events in Erode",
    seoTitle: "Events in Erode | Discover & Book Tickets – UrPass",
    metaDescription:
      "Explore textile expos, agricultural summits, college symposiums and community events in Erode. Reserve verified tickets on UrPass Explore.",
    badgeText: "Erode Event Guide",
    badgeTone: "indigo",
    directAnswer:
      "Discover events in Erode on UrPass Explore. Book passes for textile innovation expos, agricultural technology summits, university symposiums, and cultural events with zero platform commissions.",
    contentSynopsis:
      "Known as the Turmeric City and Textile Hub of Tamil Nadu, Erode hosts crucial B2B trade fairs, engineering symposiums at Kongu Engineering College, and community celebrations. Experience fast, paperless gate entry with UrPass QR passes.",
    cityFilter: "Erode",
    highlights: [
      { title: "Perundurai & Kongu Belt", desc: "State-level technical symposiums, robotics challenges, and hackathons.", tag: "Colleges" },
      { title: "Texvalley & Parimalam Ground", desc: "Textile machinery fairs, apparel trade expos, and wholesale buyer meets.", tag: "Textiles" },
      { title: "Brough Road & Collectorate Zone", desc: "Civic exhibitions, youth marathons, and local cultural festivals.", tag: "Community" },
    ],
    faqs: [
      { q: "Where are major exhibitions held in Erode?", a: "Texvalley on the Salem-Kochi Highway is South India's largest integrated textile marketplace and hosts premier trade expositions." },
    ],
    popularSearchQueries: ["events in erode this weekend", "texvalley expos 2026", "kongu engineering college symposium", "things to do in erode"],
    relatedSlugs: ["exhibitions", "college-fests", "tiruppur", "coimbatore"],
    ctaText: "Explore Erode Events",
  },
  {
    slug: "tiruppur",
    type: "city",
    priority: "P2",
    h1: "Discover Events in Tiruppur",
    seoTitle: "Events in Tiruppur | Discover & Book Tickets – UrPass",
    metaDescription:
      "Find apparel trade fairs, manufacturing conclaves, sports tournaments and youth fests in Tiruppur. Get instant QR passes on UrPass Explore.",
    badgeText: "Tiruppur Event Guide",
    badgeTone: "indigo",
    directAnswer:
      "Find upcoming events in India's Knitwear Capital. UrPass Explore features apparel sourcing summits, export manufacturing conclaves, college fests, and local sports tournaments across Tiruppur.",
    contentSynopsis:
      "Tiruppur's dynamic global garment industry drives an active calendar of export seminars, machinery trade fairs at IKFA Hall, and university symposiums. Discover and reserve tickets with fast mobile QR check-in on UrPass.",
    cityFilter: "Tiruppur",
    highlights: [
      { title: "IKFA Complex (Kangeyam Road)", desc: "International knitwear trade fairs, textile fashion shows, and export conferences.", tag: "Garments & Trade" },
      { title: "Avinashi Road Hubs", desc: "College technical symposiums, coding sprints, and management conclaves.", tag: "Colleges" },
      { title: "Chikkanna College & VOC Grounds", desc: "City sports tournaments, district cricket leagues, and public festivals.", tag: "Sports" },
    ],
    faqs: [
      { q: "How do I register for Tiruppur industrial trade fairs?", a: "Search Tiruppur on UrPass Explore to get direct trade visitor digital passes with sub-second QR entry at IKFA Complex." },
    ],
    popularSearchQueries: ["events in tiruppur this weekend", "ikfa trade fairs tiruppur", "garment expos tiruppur", "things to do in tiruppur"],
    relatedSlugs: ["exhibitions", "business-networking", "coimbatore", "erode"],
    ctaText: "Explore Tiruppur Events",
  },
  {
    slug: "kolkata",
    type: "city",
    priority: "P2",
    h1: "Discover Events in Kolkata",
    seoTitle: "Events in Kolkata | Discover & Book Tickets – UrPass",
    metaDescription:
      "Explore literary fests, music concerts, cultural celebrations, and tech summits in Kolkata. Book verified passes on UrPass Explore.",
    badgeText: "Kolkata Event Guide",
    badgeTone: "indigo",
    directAnswer:
      "Discover events in Kolkata on UrPass Explore. From the International Book Fair and music concerts at Science City to indie theatre in Rabindra Sadan and tech meetups in Salt Lake Sector V, book your tickets with zero platform fees.",
    contentSynopsis:
      "Kolkata is the cultural nerve-center of Eastern India, famed for its devotion to literature, cinema, football, and performing arts. UrPass connects attendees with verified live events across Park Street, Salt Lake, New Town, and South Kolkata.",
    cityFilter: "Kolkata",
    highlights: [
      { title: "Science City & Biswa Bangla Mela", desc: "Mega exhibitions, international conventions, and arena music concerts.", tag: "Conventions" },
      { title: "Salt Lake & New Town (Sector V)", desc: "Tech conferences, startup pitch sessions, and university hackathons.", tag: "Tech & IT" },
      { title: "Park Street & Southern Avenue", desc: "Live jazz nights, stand-up comedy clubs, culinary masterclasses, and art popups.", tag: "Nightlife & Dining" },
      { title: "Nandan & Rabindra Sadan", desc: "Independent film screenings, theatrical plays, and classical music soirees.", tag: "Arts & Cinema" },
    ],
    faqs: [
      { q: "Where can I find book fairs and cultural festivals in Kolkata?", a: "Biswa Bangla Mela Prangan and Central Park Salt Lake host the premier annual book fairs and state cultural festivals." },
    ],
    popularSearchQueries: ["events in kolkata this weekend", "science city kolkata events 2026", "park street gigs", "things to do in kolkata"],
    relatedSlugs: ["cultural-events", "music-concerts", "delhi-ncr", "this-weekend"],
    ctaText: "Explore Kolkata Events",
  },
  {
    slug: "ahmedabad",
    type: "city",
    priority: "P3",
    h1: "Discover Events in Ahmedabad",
    seoTitle: "Events in Ahmedabad | Discover & Book Tickets – UrPass",
    metaDescription:
      "Find business conclaves, Garba nights, food festivals and startup meetups in Ahmedabad. Book tickets with instant QR check-in on UrPass.",
    badgeText: "Ahmedabad Event Guide",
    badgeTone: "amber",
    directAnswer:
      "Discover events in Ahmedabad on UrPass Explore. Browse entrepreneurship summits at IIM Ahmedabad, trade exhibitions at Mahatma Mandir, cultural nights on Sabarmati Riverfront, and live music with zero booking commissions.",
    contentSynopsis:
      "Ahmedabad, India's first UNESCO World Heritage City, combines rich mercantile traditions with dynamic modern startups and educational giants. UrPass powers digital passes for summits, cultural nights, and sporting events across Ahmedabad and Gandhinagar.",
    cityFilter: "Ahmedabad",
    highlights: [
      { title: "Sabarmati Riverfront", desc: "International kite festivals, open-air cultural performances, marathons, and food festivals.", tag: "Riverfront" },
      { title: "Mahatma Mandir (Gandhinagar)", desc: "Vibrant Gujarat global summits, national industrial expos, and business conventions.", tag: "Conventions" },
      { title: "SG Highway & Vastrapur", desc: "Startup mixers, campus fests at IIMA & NID, stand-up comedy, and acoustic café gigs.", tag: "Youth & Startups" },
    ],
    faqs: [
      { q: "How do I book tickets for Riverfront festivals in Ahmedabad?", a: "Visit UrPass Explore Ahmedabad (/explore/ahmedabad) to browse public registrations and reserve instant entry QR passes." },
    ],
    popularSearchQueries: ["events in ahmedabad this weekend", "sabarmati riverfront events", "things to do in ahmedabad", "startup events ahmedabad"],
    relatedSlugs: ["business-networking", "food-festivals", "mumbai", "pune"],
    ctaText: "Explore Ahmedabad Events",
  },
  {
    slug: "jaipur",
    type: "city",
    priority: "P3",
    h1: "Discover Events in Jaipur",
    seoTitle: "Events in Jaipur | Discover & Book Tickets – UrPass",
    metaDescription:
      "Discover literature festivals, palace concerts, royal cultural events and craft exhibitions in Jaipur. Book verified tickets on UrPass Explore.",
    badgeText: "Jaipur Event Guide",
    badgeTone: "amber",
    directAnswer:
      "Discover events in the Pink City on UrPass Explore. From the Jaipur Literature Festival and royal heritage music nights to craft exhibitions at JECC and startup meetups in Malviya Nagar, reserve tickets with fast mobile QR check-in.",
    contentSynopsis:
      "Jaipur is world-renowned for its heritage forts, palace galas, literature conclaves, and vibrant arts scene. UrPass connects locals and visitors with verified entry passes to Jaipur's finest cultural and commercial events.",
    cityFilter: "Jaipur",
    highlights: [
      { title: "JECC (Sitapura)", desc: "Mega trade conventions, jewelry expos, stone marts, and national conferences.", tag: "Expos" },
      { title: "Clarks Amer & Diggi Palace", desc: "Literary fests, musical baithaks, fashion showcases, and poetry recitals.", tag: "Literature & Art" },
      { title: "C-Scheme & MI Road", desc: "Stand-up comedy, acoustic café shows, food pop-ups, and indie shopping fairs.", tag: "Nightlife & Dining" },
    ],
    faqs: [
      { q: "Where can I find tickets for literature and cultural festivals in Jaipur?", a: "UrPass Explore Jaipur (/explore/jaipur) lists verified tickets, author talk passes, and cultural festival admissions." },
    ],
    popularSearchQueries: ["events in jaipur this weekend", "jaipur literature festival passes", "things to do in jaipur", "jecc sitapura events 2026"],
    relatedSlugs: ["cultural-events", "exhibitions", "delhi-ncr", "this-weekend"],
    ctaText: "Explore Jaipur Events",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. EVENT CATEGORY PAGES (15 Pages)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "music-concerts",
    type: "category",
    priority: "P1",
    h1: "Discover Upcoming Music Concerts & Live Shows",
    seoTitle: "Upcoming Music Concerts in India | UrPass Explore",
    metaDescription:
      "Find upcoming music concerts, live performances and shows. Explore artists, venues, dates and available tickets on UrPass Explore.",
    badgeText: "Music & Live Gigs",
    badgeTone: "violet",
    directAnswer:
      "Where can I find upcoming music concerts in India? UrPass Explore (/explore/music-concerts) curates live stadium tours, acoustic gigs, electronic music festivals, and indie concerts across Bengaluru, Mumbai, Delhi, and Chennai with direct ticket booking.",
    contentSynopsis:
      "From high-octane stadium spectacles and Bollywood arena tours to intimate jazz lounges and indie singer-songwriter evenings, UrPass delivers verified concert tickets with 0% platform fee and lightning 0.3s gate QR passes.",
    categoryFilter: "music",
    queryKeywords: ["concert", "live music", "band", "gig", "singer"],
    highlights: [
      { title: "Stadium & Arena Tours", desc: "Major international tours, Bollywood spectacles, and headline EDM festivals.", tag: "Mega Shows" },
      { title: "Indie & Singer-Songwriter", desc: "Acoustic showcases, folk fusions, and intimate pub gigs.", tag: "Indie" },
      { title: "Classical & Heritage Recitals", desc: "Carnatic concerts, Hindustani classical baithaks, and jugalbandis.", tag: "Classical" },
      { title: "Electronic & DJ Sets", desc: "Techno warehouse nights, deep house sundowners, and festival stages.", tag: "Electronic" },
    ],
    faqs: [
      { q: "Where can I find upcoming concerts near me?", a: "Browse UrPass Explore Music Concerts (/explore/music-concerts) and filter by your city (Bangalore, Mumbai, Delhi, Chennai, etc.) to view verified upcoming concerts." },
      { q: "How do I book concert tickets on UrPass?", a: "Select your concert, pick your tier (General, VIP, Fan Pit), checkout via UPI or card, and receive your digital QR pass instantly." },
      { q: "Are tickets transferable or refundable?", a: "Cancellation and transfer rules are determined by each verified organizer and displayed transparently on the event booking page before checkout." },
    ],
    popularSearchQueries: ["music concerts near me", "upcoming concerts in india 2026", "live gigs bangalore", "mumbai concert tickets", "delhi music festivals"],
    relatedSlugs: ["dance-dj-events", "cultural-events", "bangalore", "mumbai", "this-weekend"],
    ctaText: "Find Concerts & Gigs",
  },
  {
    slug: "standup-comedy",
    type: "category",
    priority: "P1",
    h1: "Live Stand-up Comedy Shows & Open Mics",
    seoTitle: "Stand-up Comedy Shows in India | UrPass Explore",
    metaDescription:
      "Book tickets for live stand-up comedy specials, trial shows, and open mics across India. Reserve verified seats on UrPass Explore.",
    badgeText: "Stand-up Comedy",
    badgeTone: "amber",
    directAnswer:
      "Looking for stand-up comedy shows? UrPass Explore lists the funniest comedy specials, open mics, and crowd-work tours in Bangalore, Mumbai, Delhi, Hyderabad, and Chennai with instant booking.",
    contentSynopsis:
      "Enjoy an evening of nonstop laughs with India's top stand-up comedians and rising talents. Discover comedy club nights, trial shows, and festival lineups with zero extra booking fees.",
    categoryFilter: "arts",
    queryKeywords: ["comedy", "standup", "stand-up", "open mic", "comic"],
    highlights: [
      { title: "Solo Specials & National Tours", desc: "Top touring comedians testing new one-hour specials.", tag: "Solo Special" },
      { title: "Comedy Clubs & Lineup Shows", desc: "Weekend multi-comic showcases featuring 4 to 6 performers.", tag: "Lineup" },
      { title: "Open Mics & Raw Material", desc: "Unfiltered new jokes from emerging and veteran comics.", tag: "Open Mic" },
    ],
    faqs: [
      { q: "What is the age limit for stand-up comedy shows?", a: "Most live stand-up comedy shows are for ages 16+ or 18+. Age restrictions are clearly marked on each event's details page." },
      { q: "Do I get reserved seats or first-come-first-served?", a: "Seating is generally open seating on a first-come, first-served basis unless a specific VIP or reserved table tier is selected." },
    ],
    popularSearchQueries: ["standup comedy near me", "comedy shows in bangalore", "comedy nights mumbai", "stand up comedy delhi ncr"],
    relatedSlugs: ["music-concerts", "this-weekend", "things-to-do-with-friends", "bangalore"],
    ctaText: "Find Comedy Shows",
  },
  {
    slug: "food-festivals",
    type: "category",
    priority: "P1",
    h1: "Food Festivals & Culinary Experiences",
    seoTitle: "Upcoming Food Festivals in India | UrPass Explore",
    metaDescription:
      "Discover food truck festivals, craft beer tastings, dessert fests, and culinary popups across India. Book entry passes on UrPass Explore.",
    badgeText: "Food & Drink",
    badgeTone: "emerald",
    directAnswer:
      "Discover top food festivals, culinary masterclasses, and street food carnivals in India. UrPass Explore features verified food events with fast digital QR entry.",
    contentSynopsis:
      "Indulge your palate at India's most exciting food and beverage festivals. From craft beer carnivals and barbecue weekends to artisanal coffee tastings and heritage regional cuisine fairs, explore verified food events.",
    categoryFilter: "food_drink",
    queryKeywords: ["food", "culinary", "beer", "wine", "tasting", "carnival"],
    highlights: [
      { title: "Food Truck Carnivals", desc: "Dozens of gourmet mobile food trucks, live acoustic music, and lawn games.", tag: "Carnivals" },
      { title: "Craft Beer & Wine Festivals", desc: "Microbrewery showcases, sommelier wine tastings, and cocktail mixing sessions.", tag: "Craft Brews" },
      { title: "Chef Tables & Masterclasses", desc: "Intimate dinners, pasta making workshops, and specialty coffee cupping.", tag: "Gourmet" },
    ],
    faqs: [
      { q: "Are food festival tickets inclusive of food and beverages?", a: "Entry tickets typically cover general festival admission and live entertainment. Food and beverages are purchased directly from stalls unless an all-inclusive tasting pass is specified." },
    ],
    popularSearchQueries: ["food festivals near me", "food carnivals bangalore 2026", "beer festivals mumbai", "things to do this weekend food"],
    relatedSlugs: ["weekend-activities", "things-to-do-with-friends", "bangalore", "delhi-ncr"],
    ctaText: "Explore Food Festivals",
  },
  {
    slug: "business-networking",
    type: "category",
    priority: "P1",
    h1: "Business Networking & Professional Mixers",
    seoTitle: "Business Networking Events in India | UrPass Explore",
    metaDescription:
      "Connect with founders, investors, enterprise leaders, and professionals. Discover business networking events and mixers on UrPass Explore.",
    badgeText: "Business & Networking",
    badgeTone: "indigo",
    directAnswer:
      "Looking for professional networking events in India? UrPass Explore features curated founder mixers, B2B industry roundtables, investor demo days, and executive breakfasts across major Indian metropolitan hubs.",
    contentSynopsis:
      "Accelerate your career and expand your business relationships. UrPass curates high-caliber networking evenings, CXO dinners, and industry forums where you can meet prospective partners, co-founders, and clients.",
    categoryFilter: "business",
    queryKeywords: ["networking", "business", "mixer", "founders", "executives", "b2b"],
    highlights: [
      { title: "Founder & Investor Mixers", desc: "Connect with angel syndicates, seed funds, and fellow startup operators.", tag: "Founders" },
      { title: "B2B Industry Roundtables", desc: "Focused peer discussions across SaaS, manufacturing, retail, and fintech.", tag: "Roundtables" },
      { title: "Executive Breakfasts & Dinners", desc: "Curated, high-trust closed-door gatherings for directors and VPs.", tag: "Executive" },
    ],
    faqs: [
      { q: "Who attends UrPass business networking events?", a: "Attendees include startup founders, angel investors, corporate directors, product leaders, and verified industry professionals." },
      { q: "Is registration approval required?", a: "Some exclusive executive mixers require host approval. Your status will show as 'Pending' until the organizer reviews your profile." },
    ],
    popularSearchQueries: ["business networking events near me", "founder mixers bangalore", "b2b networking mumbai", "investor meetups hyderabad"],
    relatedSlugs: ["startup-events", "tech-events", "bangalore", "mumbai", "hyderabad"],
    ctaText: "Discover Networking Mixers",
  },
  {
    slug: "workshops",
    type: "category",
    priority: "P1",
    h1: "Interactive Workshops, Masterclasses & Bootcamps",
    seoTitle: "Workshops & Classes in India | UrPass Explore",
    metaDescription:
      "Learn new skills with hands-on workshops in pottery, AI coding, baking, photography, and painting. Book your seat on UrPass Explore.",
    badgeText: "Hands-on Learning",
    badgeTone: "emerald",
    directAnswer:
      "Where can I find workshops and masterclasses in India? UrPass Explore (/explore/workshops) curates verified offline and online classes in pottery, photography, generative AI, cooking, and creative arts.",
    contentSynopsis:
      "Upgrade your skills or discover a fulfilling weekend hobby. UrPass features hands-on classes led by certified master artists, engineers, and chefs with materials provided and verifiable attendance credentials.",
    categoryFilter: "workshops",
    queryKeywords: ["workshop", "class", "masterclass", "bootcamp", "training"],
    highlights: [
      { title: "Creative Arts & Pottery", desc: "Wheel pottery, fluid acrylics, resin art, and canvas painting with all materials included.", tag: "Art" },
      { title: "Tech, AI & Data Sprints", desc: "Prompt engineering, Python fundamentals, full-stack development, and UI/UX masterclasses.", tag: "Tech" },
      { title: "Culinary & Baking", desc: "Sourdough bread, artisanal chocolates, specialty coffee, and international cooking.", tag: "Culinary" },
    ],
    faqs: [
      { q: "Are materials provided for in-person workshops?", a: "Yes, in-person art, culinary, and craft workshops include all required raw materials and tools unless explicitly noted in the event prerequisites." },
    ],
    popularSearchQueries: ["workshops near me", "pottery workshop bangalore", "weekend workshops mumbai", "ai workshop 2026", "photography class chennai"],
    relatedSlugs: ["art-workshops", "tech-events", "weekend-activities", "bangalore"],
    ctaText: "Find Hands-on Workshops",
  },
  {
    slug: "college-fests",
    type: "category",
    priority: "P1",
    h1: "College Cultural & Technical Fests",
    seoTitle: "College Fests & Hackathons in India | UrPass Explore",
    metaDescription:
      "Find inter-college cultural festivals, hackathons, robotics challenges, and sports fests across premier Indian universities. Reserve passes on UrPass.",
    badgeText: "College Fests & Hackathons",
    badgeTone: "violet",
    directAnswer:
      "Looking for upcoming college fests? UrPass Explore features inter-collegiate cultural fests, pro-nites, hackathons, and symposiums at IITs, NITs, BITS, and premier universities with digital QR passes.",
    contentSynopsis:
      "Experience the unmatched electric energy of India's biggest university cultural festivals and competitive hackathons. UrPass partners directly with student councils to offer verified attendee passes with instant gate verification.",
    categoryFilter: "festivals",
    queryKeywords: ["college fest", "symposium", "hackathon", "culturals", "pro nite", "campus"],
    highlights: [
      { title: "Cultural Fests & Celebrity Pro-Nites", desc: "Concerts by headline playback singers, battle of the bands, and dance competitions.", tag: "Culturals" },
      { title: "24-48H Hackathons & Buildathons", desc: "Competitive software sprints, AI challenges, mentors, and cash prize pools.", tag: "Hackathons" },
      { title: "Engineering & Technical Symposiums", desc: "Paper presentations, robotics combat, drone racing, and coding contests.", tag: "Technical" },
    ],
    faqs: [
      { q: "Can students from other colleges attend?", a: "Yes. Inter-collegiate cultural fests and hackathons welcome external students. Bring a valid college ID along with your UrPass QR code." },
      { q: "Are hackathons on UrPass free to enter?", a: "Most college hackathons offer free registration with meals and swag provided to approved teams." },
    ],
    popularSearchQueries: ["college fests in india 2026", "hackathons in bangalore", "college culturals chennai", "engineering symposiums coimbatore"],
    relatedSlugs: ["tech-events", "cultural-events", "music-concerts", "coimbatore", "chennai"],
    ctaText: "Explore College Fests",
  },
  {
    slug: "cultural-events",
    type: "category",
    priority: "P1",
    h1: "Cultural Festivals, Traditional Arts & Theatre",
    seoTitle: "Cultural Events in India | UrPass Explore",
    metaDescription:
      "Discover traditional dance recitals, heritage walks, theatrical plays, and cultural festivals across India. Book verified tickets on UrPass Explore.",
    badgeText: "Culture & Theatre",
    badgeTone: "indigo",
    directAnswer:
      "Discover the richness of Indian cultural events on UrPass Explore. From classical Bharatanatyam and Kathak recitals to Marathi and Bengali theatre, heritage temple walks, and folk carnivals.",
    contentSynopsis:
      "Immerse yourself in India's unmatched artistic heritage. UrPass curates classical performing arts festivals, theatrical drama productions, and regional heritage celebrations with verified seat reservations.",
    categoryFilter: "arts",
    queryKeywords: ["cultural", "theatre", "heritage", "classical dance", "drama", "folk"],
    highlights: [
      { title: "Classical Music & Dance", desc: "Bharatanatyam, Kathak, Odissi recitals, and Carnatic vocal concerts.", tag: "Classical" },
      { title: "Theatrical Plays & Drama", desc: "Hindi, English, Bengali, and Marathi dramatic productions at leading auditoriums.", tag: "Theatre" },
      { title: "Heritage Walks & Storytelling", desc: "Guided architectural walks through historic old quarters and monuments.", tag: "Heritage" },
    ],
    faqs: [
      { q: "Where can I book theatre tickets on UrPass?", a: "Browse UrPass Explore Cultural Events (/explore/cultural-events) for stage plays at NCPA (Mumbai), Ranga Shankara (Bangalore), and Siri Fort (Delhi)." },
    ],
    popularSearchQueries: ["cultural events near me", "theatre plays bangalore", "classical dance recitals chennai", "heritage walks delhi 2026"],
    relatedSlugs: ["music-concerts", "art-workshops", "chennai", "kolkata", "jaipur"],
    ctaText: "Discover Cultural Events",
  },
  {
    slug: "tech-events",
    type: "category",
    priority: "P1",
    h1: "Tech Events, AI Summits & Developer Meetups",
    seoTitle: "Tech Events & Conferences in India | UrPass Explore",
    metaDescription:
      "Discover developer conferences, generative AI summits, cloud computing meetups, and open-source hackathons. Reserve tickets on UrPass Explore.",
    badgeText: "Tech & Innovation",
    badgeTone: "violet",
    directAnswer:
      "Looking for tech events in India? UrPass Explore features premier developer conferences, AI & LLM summits, cloud computing meetups, and open-source sprints in Bengaluru, Hyderabad, Delhi NCR, and Pune.",
    contentSynopsis:
      "Stay ahead of technological frontiers. UrPass connects software engineers, founders, data scientists, and CTOs with top-tier technology conferences and developer meetups with lightning digital badges.",
    categoryFilter: "business",
    queryKeywords: ["tech", "developer", "ai", "cloud", "software", "conference", "hackathon"],
    highlights: [
      { title: "Generative AI & LLM Summits", desc: "Keynotes on frontier models, autonomous agents, and AI infrastructure.", tag: "AI & ML" },
      { title: "Developer & Open Source Days", desc: "Hands-on workshops in Rust, Go, Kubernetes, and full-stack cloud architecture.", tag: "Devs" },
      { title: "Product & Engineering Leadership", desc: "Conferences on scaling engineering teams, system design, and product strategy.", tag: "Leadership" },
    ],
    faqs: [
      { q: "Are free tech meetups available?", a: "Yes, dozens of developer community meetups (Google Developer Groups, AWS user groups, Python communities) offer free registration on UrPass." },
      { q: "How do I get an invoice for corporate reimbursement?", a: "Every paid ticket booked on UrPass automatically issues a GST-compliant tax invoice sent directly to your registered email." },
    ],
    popularSearchQueries: ["tech conferences in india 2026", "ai events bangalore", "developer meetups hyderabad", "hackathons delhi ncr"],
    relatedSlugs: ["startup-events", "business-networking", "bangalore", "hyderabad", "pune"],
    ctaText: "Find Tech Conferences",
  },
  {
    slug: "sports-events",
    type: "category",
    priority: "P2",
    h1: "Sports Events, Marathons & Fitness Tournaments",
    seoTitle: "Sports Events & Marathons in India | UrPass Explore",
    metaDescription:
      "Register for 10K marathons, badminton tournaments, cycling brevets, and fitness challenges across India. Reserve entry bibs on UrPass Explore.",
    badgeText: "Sports & Fitness",
    badgeTone: "emerald",
    directAnswer:
      "Find upcoming sports tournaments and running events in India on UrPass Explore. Register for 5K/10K marathons, corporate football leagues, badminton championships, and cycling rallies.",
    contentSynopsis:
      "Fuel your competitive spirit and fitness goals. UrPass powers digital passes, race bib assignments, and sub-second gate check-ins for athletic tournaments and marathons across India.",
    categoryFilter: "sports",
    queryKeywords: ["sports", "marathon", "running", "badminton", "football", "cycling", "tournament"],
    highlights: [
      { title: "City Marathons & Half Marathons", desc: "Timed road running challenges with finisher medals, bibs, and hydration support.", tag: "Running" },
      { title: "Racket & Turf Tournaments", desc: "Weekend amateur and semi-pro badminton, tennis, and box cricket leagues.", tag: "Turf Sports" },
      { title: "Cycling Brevets & Rallies", desc: "Scenic highway and countryside endurance rides with checkpoint tracking.", tag: "Cycling" },
    ],
    faqs: [
      { q: "Do marathon registrations on UrPass include race bibs and timing chips?", a: "Yes, timed marathon events specify bib pickup and RFID chip details directly in the booking confirmation." },
    ],
    popularSearchQueries: ["marathons in india 2026", "10k run bangalore", "badminton tournament chennai", "sports events this weekend"],
    relatedSlugs: ["wellness-events", "weekend-activities", "coimbatore", "bangalore"],
    ctaText: "Discover Sports Events",
  },
  {
    slug: "startup-events",
    type: "category",
    priority: "P2",
    h1: "Startup Pitch Nights, Demo Days & Founder Mixers",
    seoTitle: "Startup Events & Demo Days in India | UrPass Explore",
    metaDescription:
      "Discover angel pitch nights, startup demo days, incubator showcases, and venture capital panels across India. Book tickets on UrPass Explore.",
    badgeText: "Startup Ecosystem",
    badgeTone: "indigo",
    directAnswer:
      "Looking for startup events in India? UrPass Explore features angel pitch competitions, incubator demo days, venture capital summits, and early-stage founder roundtables in Bengaluru, Mumbai, and Delhi.",
    contentSynopsis:
      "Connect with the innovators shaping the future. UrPass is the go-to discovery platform for founders, operators, angels, and venture capital investors across India's vibrant startup corridors.",
    categoryFilter: "business",
    queryKeywords: ["startup", "pitch", "demo day", "founders", "investors", "venture capital"],
    highlights: [
      { title: "Angel Pitch Competitions", desc: "Early-stage startups presenting to active angels and syndicate leads.", tag: "Pitching" },
      { title: "Accelerator & Incubator Demo Days", desc: "Cohort graduations and showcase presentations from top incubators.", tag: "Demo Days" },
      { title: "Growth & Product Masterclasses", desc: "Deep-dives into go-to-market strategies, unit economics, and fundraising.", tag: "Growth" },
    ],
    faqs: [
      { q: "How can early-stage founders apply to pitch at UrPass-listed events?", a: "Events that accept pitch applications include a dedicated 'Apply to Pitch' form on the event page." },
    ],
    popularSearchQueries: ["startup events bangalore", "pitch nights mumbai", "demo days india 2026", "founder mixers hyderabad"],
    relatedSlugs: ["business-networking", "tech-events", "bangalore", "mumbai"],
    ctaText: "Explore Startup Events",
  },
  {
    slug: "art-workshops",
    type: "category",
    priority: "P2",
    h1: "Art, Pottery & Creative Craft Workshops",
    seoTitle: "Art & Creative Workshops in India | UrPass Explore",
    metaDescription:
      "Join hands-on ceramic pottery, fluid painting, resin art, calligraphy, and woodworking workshops. Reserve your materials & seat on UrPass Explore.",
    badgeText: "Creative Crafts",
    badgeTone: "emerald",
    directAnswer:
      "Discover the best art and creative workshops near you on UrPass Explore. Learn ceramic wheel pottery, fluid acrylic painting, resin art, and calligraphy with materials provided.",
    contentSynopsis:
      "Unleash your creativity in inspiring studio spaces. UrPass curates guided weekend craft sessions led by expert artisans, providing all raw materials for a fulfilling creative experience.",
    categoryFilter: "arts",
    queryKeywords: ["art workshop", "pottery", "painting", "craft", "resin", "calligraphy"],
    highlights: [
      { title: "Wheel & Hand Pottery", desc: "Learn centering, shaping, and glazing ceramic clay with studio pottery wheels.", tag: "Pottery" },
      { title: "Fluid & Canvas Painting", desc: "Acrylic pouring, texture art on canvas, and watercolours for beginners.", tag: "Painting" },
      { title: "Botanical Resin & Crafts", desc: "Preserved flower coasters, resin trays, and candle making sessions.", tag: "Resin Art" },
    ],
    faqs: [
      { q: "Can complete beginners join these art workshops?", a: "Yes. All featured art workshops are beginner-friendly with step-by-step guidance from professional artists." },
    ],
    popularSearchQueries: ["pottery classes near me", "art workshops bangalore", "resin art classes mumbai", "creative workshops this weekend"],
    relatedSlugs: ["workshops", "weekend-activities", "things-to-do-with-friends", "bangalore"],
    ctaText: "Discover Art Workshops",
  },
  {
    slug: "dance-dj-events",
    type: "category",
    priority: "P2",
    h1: "Dance Nights, DJ Sets & Electronic Music Festivals",
    seoTitle: "Dance & DJ Nights in India | UrPass Explore",
    metaDescription:
      "Find electronic music gigs, rooftop DJ nights, techno warehouse parties, and salsa socials across India. Book verified entry passes on UrPass.",
    badgeText: "Dance & Nightlife",
    badgeTone: "violet",
    directAnswer:
      "Looking for DJ nights and dance events? UrPass Explore features progressive house, techno warehouse sets, rooftop sundowners, and Latin salsa socials in Mumbai, Bangalore, Goa, and Delhi.",
    contentSynopsis:
      "Dance through the night with premier Indian and international electronic DJs. UrPass ensures seamless, queue-free entry with encrypted QR tickets scanned in 0.3s at nightclub gates.",
    categoryFilter: "music",
    queryKeywords: ["dj", "techno", "electronic music", "dance night", "salsa", "nightclub"],
    highlights: [
      { title: "Techno & Deep House", desc: "Immersive audio-visual club nights featuring underground techno producers.", tag: "Techno" },
      { title: "Rooftop Sundowners", desc: "Sunset cocktails, melodic house grooves, and skyline views.", tag: "Sundowners" },
      { title: "Salsa & Bachata Socials", desc: "Beginner workshops followed by open social dancing with Latin DJs.", tag: "Latin Social" },
    ],
    faqs: [
      { q: "Is there a dress code or couple entry rule?", a: "Specific club policies regarding dress code and couple/stag entry are published directly by the organizer on the UrPass ticket details card." },
    ],
    popularSearchQueries: ["dj nights near me", "techno parties bangalore", "club events mumbai", "dance events this weekend"],
    relatedSlugs: ["music-concerts", "weekend-activities", "things-to-do-with-friends", "mumbai"],
    ctaText: "Find Dance & DJ Nights",
  },
  {
    slug: "family-kids-events",
    type: "category",
    priority: "P2",
    h1: "Family & Kids Activities, Carnivals & Plays",
    seoTitle: "Family & Kids Events in India | UrPass Explore",
    metaDescription:
      "Find kid-friendly carnivals, puppet theatre, science exhibitions, and family weekend experiences across India. Book tickets on UrPass Explore.",
    badgeText: "Family & Kids",
    badgeTone: "emerald",
    directAnswer:
      "Discover the best family and kids activities on UrPass Explore. Find interactive science shows, children's theatre, puppet festivals, and weekend amusement carnivals in top Indian cities.",
    contentSynopsis:
      "Make lasting memories with your loved ones. UrPass curates safe, engaging, and enriching family events designed for children, parents, and grandparents with family ticket bundles.",
    categoryFilter: "community",
    queryKeywords: ["kids", "family", "children", "puppet", "carnival", "science expo"],
    highlights: [
      { title: "Children's Theatre & Puppetry", desc: "Live musical plays, shadow puppets, and interactive storytelling for toddlers and teens.", tag: "Theatre" },
      { title: "Science & Robotics Fairs", desc: "Hands-on experiments, rocket building, planetarium shows, and DIY robotics.", tag: "STEM" },
      { title: "Weekend Family Carnivals", desc: "Inflatable obstacle courses, craft stations, magic shows, and family food stalls.", tag: "Carnivals" },
    ],
    faqs: [
      { q: "Are family passes available at discounted rates?", a: "Yes, many family events offer bundled tickets (e.g., 2 Adults + 2 Kids) at special combo pricing on UrPass." },
    ],
    popularSearchQueries: ["kids events near me", "things to do with kids bangalore", "family events mumbai this weekend", "weekend activities for kids"],
    relatedSlugs: ["family-activities", "weekend-activities", "free-events", "bangalore"],
    ctaText: "Find Family & Kids Events",
  },
  {
    slug: "exhibitions",
    type: "category",
    priority: "P2",
    h1: "Exhibitions, Trade Expos & Consumer Fairs",
    seoTitle: "Exhibitions & Trade Shows in India | UrPass Explore",
    metaDescription:
      "Discover industrial trade exhibitions, auto shows, consumer home fairs, and art expos across India. Book digital visitor passes on UrPass Explore.",
    badgeText: "Exhibitions & Expos",
    badgeTone: "indigo",
    directAnswer:
      "Looking for trade exhibitions and expos in India? UrPass Explore features B2B manufacturing expos at Bharat Mandapam, auto shows at BIEC, textile fairs in Tiruppur, and art expos with fast digital visitor passes.",
    contentSynopsis:
      "Source new suppliers, discover groundbreaking industrial innovations, and explore consumer fairs. UrPass provides visitor registration and exhibitor badge generation with sub-second digital check-in.",
    categoryFilter: "business",
    queryKeywords: ["exhibition", "trade show", "expo", "fair", "consumer show", "b2b expo"],
    highlights: [
      { title: "B2B Manufacturing & Industrial Expos", desc: "Machinery, automation, chemical, and green energy trade exhibitions.", tag: "Industrial" },
      { title: "Consumer Lifestyle & Home Fairs", desc: "Interior design popups, furniture expos, and fashion apparel showcases.", tag: "Lifestyle" },
      { title: "Fine Art & Photography Expos", desc: "Curated gallerist booths, sculpture showcases, and photography installations.", tag: "Fine Art" },
    ],
    faqs: [
      { q: "Are trade exhibitions free to visit for business professionals?", a: "Many B2B trade expos offer complimentary digital passes to pre-registered business visitors on UrPass." },
    ],
    popularSearchQueries: ["exhibitions near me", "trade shows in india 2026", "biec bangalore expos", "pragati maidan exhibitions"],
    relatedSlugs: ["business-networking", "tech-events", "coimbatore", "delhi-ncr"],
    ctaText: "Explore Trade Exhibitions",
  },
  {
    slug: "wellness-events",
    type: "category",
    priority: "P2",
    h1: "Wellness Retreats, Yoga & Mindful Living Sessions",
    seoTitle: "Wellness & Fitness Events in India | UrPass Explore",
    metaDescription:
      "Discover sunrise yoga sessions, breathwork workshops, sound baths, and wellness retreats across India. Book verified passes on UrPass Explore.",
    badgeText: "Wellness & Mindfulness",
    badgeTone: "emerald",
    directAnswer:
      "Find upcoming wellness events on UrPass Explore. Reserve seats for sound healing baths, morning rooftop yoga, guided breathwork, and holistic wellness retreats across India.",
    contentSynopsis:
      "Rebalance your mind and body. UrPass curates restorative wellness gatherings, meditation retreats, sound therapy sessions, and holistic fitness workshops led by certified practitioners.",
    categoryFilter: "sports",
    queryKeywords: ["wellness", "yoga", "meditation", "breathwork", "sound bath", "retreat", "mindfulness"],
    highlights: [
      { title: "Sound Healing & Gong Baths", desc: "Tibetan singing bowl resonance, binaural relaxation, and restorative deep rest.", tag: "Sound Healing" },
      { title: "Sunrise Rooftop Yoga", desc: "Vinyasa flow and Hatha sessions with city sunrise views and herbal infusions.", tag: "Yoga Flow" },
      { title: "Mindfulness & Breathwork", desc: "Pranayama techniques, somatic release, and stress-reduction masterclasses.", tag: "Mindfulness" },
    ],
    faqs: [
      { q: "What should I bring to a wellness or yoga session?", a: "Bring a comfortable yoga mat, a water bottle, and wear loose, breathable clothing. Additional props like bolsters are usually provided." },
    ],
    popularSearchQueries: ["wellness events near me", "yoga workshops bangalore", "sound healing mumbai", "meditation retreats near me"],
    relatedSlugs: ["sports-events", "workshops", "weekend-activities", "bangalore"],
    ctaText: "Discover Wellness Sessions",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. FESTIVAL AND SEASONAL PAGES (10 Pages)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "halloween-events-2026",
    type: "seasonal",
    priority: "P1",
    h1: "Halloween Events & Costume Parties 2026",
    seoTitle: "Halloween Events 2026 in India | UrPass Explore",
    metaDescription:
      "Discover Halloween costume parties, spooky themed club nights, and haunted house experiences for Halloween 2026 across India. Book tickets on UrPass.",
    badgeText: "Halloween 2026 Special",
    badgeTone: "amber",
    directAnswer:
      "Looking for Halloween 2026 events in India? UrPass Explore features costume contests, spooky DJ nights, rooftop horror film screenings, and themed parties on October 30-31, 2026 with instant QR entry.",
    contentSynopsis:
      "Celebrate Halloween 2026 in style! Across Bengaluru, Mumbai, Delhi, and Goa, top venues host costume masquerades, haunted cocktail lounges, and dance nights. Secure your verified pass on UrPass Explore.",
    queryKeywords: ["halloween", "costume party", "spooky", "horror", "trick or treat"],
    highlights: [
      { title: "Costume Contests & Cash Prizes", desc: "Prizes for most creative, scariest, and best couple Halloween outfits.", tag: "Costumes" },
      { title: "Haunted Rooftop Parties", desc: "Themed cocktails, horror decor, and live DJ sets under the October sky.", tag: "Nightlife" },
      { title: "Family Spooktaculars", desc: "Daytime pumpkin carving, candy scavenger hunts, and kid-friendly magic shows.", tag: "Kids & Family" },
    ],
    faqs: [
      { q: "When are Halloween 2026 events taking place in India?", a: "Halloween 2026 falls on Saturday, October 31, 2026. Parties and themed club nights run throughout the weekend from Friday, October 30 to Sunday, November 1." },
      { q: "Is costume mandatory for Halloween parties?", a: "Most Halloween parties strongly encourage costumes, with many offering free drinks or contest prizes for attendees in costume." },
    ],
    popularSearchQueries: ["halloween events 2026 near me", "halloween parties bangalore 2026", "halloween costume party mumbai", "spooky events delhi 2026"],
    relatedSlugs: ["dance-dj-events", "music-concerts", "this-weekend", "christmas-events-2026"],
    ctaText: "Find Halloween Events",
  },
  {
    slug: "christmas-events-2026",
    type: "seasonal",
    priority: "P1",
    h1: "Christmas Celebrations & Holiday Markets 2026",
    seoTitle: "Christmas Events 2026 in India | UrPass Explore",
    metaDescription:
      "Explore Christmas 2026 carol concerts, winter flea markets, festive brunch feasts, and Eve celebrations in India. Book tickets on UrPass Explore.",
    badgeText: "Christmas 2026 Special",
    badgeTone: "emerald",
    directAnswer:
      "Where can I find Christmas 2026 events in India? UrPass Explore curates choral concerts, winter European-style flea markets, Christmas Eve galas, and lavish holiday brunches in Goa, Bengaluru, Mumbai, and Kolkata.",
    contentSynopsis:
      "Embrace the warmth and holiday cheer of Christmas 2026. UrPass brings you verified access to choir performances, Christmas tree lighting galas, artisanal gift markets, and traditional feasts.",
    queryKeywords: ["christmas", "xmas", "carols", "holiday market", "christmas eve", "winter fest"],
    highlights: [
      { title: "Choral Concerts & Candlelight Services", desc: "Symphony choirs singing classic Christmas carols in historic cathedrals.", tag: "Carols" },
      { title: "Artisanal Holiday Flea Markets", desc: "Handcrafted decorations, gingerbread, mulled drinks, and festive gift stalls.", tag: "Markets" },
      { title: "Christmas Eve Galas & Dinners", desc: "Multi-course holiday feasts with live jazz and acoustic seasonal melodies.", tag: "Dinners" },
    ],
    faqs: [
      { q: "When do Christmas 2026 events start?", a: "Christmas holiday markets and carol concerts begin in mid-December, peaking on Christmas Eve (Dec 24) and Christmas Day (Dec 25, 2026)." },
    ],
    popularSearchQueries: ["christmas events 2026 near me", "christmas parties bangalore", "christmas markets mumbai 2026", "christmas eve dinner kolkata"],
    relatedSlugs: ["new-year-parties-2027", "new-years-eve-2026", "family-activities", "bangalore"],
    ctaText: "Discover Christmas Events",
  },
  {
    slug: "new-year-parties-2027",
    type: "seasonal",
    priority: "P1",
    h1: "New Year Parties & Celebrations 2027",
    seoTitle: "New Year Parties 2027 in India | UrPass Explore",
    metaDescription:
      "Ring in 2027 with top New Year parties, Bollywood DJ nights, luxury resort galas, and countdown concerts in India. Book passes on UrPass.",
    badgeText: "New Year 2027",
    badgeTone: "violet",
    directAnswer:
      "Where are the best New Year 2027 parties in India? UrPass Explore features exclusive resort galas, Bollywood countdown nights, open-bar club events, and family celebrations across Bengaluru, Goa, Mumbai, and Delhi.",
    contentSynopsis:
      "Welcome 2027 with an unforgettable celebration. From high-energy electronic music festivals in Goa and 5-star hotel grand ballrooms to peaceful countryside campouts, book verified New Year passes with zero scalping on UrPass.",
    queryKeywords: ["new year party 2027", "nye party", "new year celebration", "countdown 2027", "open bar"],
    highlights: [
      { title: "5-Star Grand Ballroom Galas", desc: "Unlimited gourmet buffets, premium beverages, live bands, and champagne toasts.", tag: "Luxury Galas" },
      { title: "Nightclub & DJ Countdowns", desc: "High-octane electronic beats, laser shows, and dance floors until the early hours.", tag: "Clubs & DJs" },
      { title: "Nature Campouts & Stargazing", desc: "Lakeside bonfires, acoustic guitar jams, barbecue grills, and sunrise welcomes.", tag: "Campouts" },
    ],
    faqs: [
      { q: "Do New Year party tickets include food and drinks?", a: "Most commercial NYE party passes are 'All-Inclusive' (covering unlimited buffet food and selected beverages). Details are clearly stated on each ticket tier." },
      { q: "How early should I book New Year 2027 passes?", a: "Early bird tickets go on sale in November and typically sell out 2 to 3 weeks prior to December 31. Early booking guarantees the best rates." },
    ],
    popularSearchQueries: ["new year parties 2027 near me", "nye 2027 bangalore", "new year parties goa 2027", "mumbai new year parties 2027"],
    relatedSlugs: ["new-years-eve-2026", "christmas-events-2026", "dance-dj-events", "bangalore"],
    ctaText: "Book New Year 2027 Passes",
  },
  {
    slug: "new-years-eve-2026",
    type: "seasonal",
    priority: "P1",
    h1: "New Year's Eve 2026 Events & Countdowns",
    seoTitle: "New Year's Eve 2026 Events in India | UrPass Explore",
    metaDescription:
      "Count down to midnight on December 31, 2026. Find verified NYE concerts, rooftop bashes, and countdown parties on UrPass Explore.",
    badgeText: "Dec 31 Countdowns",
    badgeTone: "violet",
    directAnswer:
      "Looking for New Year's Eve 2026 events? Find verified countdown bashes, rooftop midnight toasts, and arena concerts on December 31, 2026 across India with instant QR ticket confirmation.",
    contentSynopsis:
      "Celebrate the final hours of 2026 with unmatched excitement. UrPass lists verified New Year's Eve events across India with transparent pricing, verified host guarantee, and rapid gate scanning.",
    queryKeywords: ["new years eve 2026", "december 31 party", "nye countdown", "midnight toast 2026"],
    highlights: [
      { title: "Rooftop Midnight Countdowns", desc: "Panoramic city skyline fireworks views, curated DJ sets, and craft cocktails.", tag: "Rooftops" },
      { title: "Family-Friendly Countdowns", desc: "Kid-friendly dinner galas, illusionist shows, and family dance floors.", tag: "Family" },
    ],
    faqs: [
      { q: "What time do NYE countdown parties start?", a: "Most New Year's Eve 2026 events begin between 7:00 PM and 8:30 PM on December 31, 2026, running well past midnight." },
    ],
    popularSearchQueries: ["new years eve 2026 events", "december 31 events near me", "nye countdown bangalore", "new years eve tickets mumbai"],
    relatedSlugs: ["new-year-parties-2027", "christmas-events-2026", "music-concerts", "mumbai"],
    ctaText: "Discover NYE 2026 Events",
  },
  {
    slug: "pongal-events-2027",
    type: "seasonal",
    priority: "P2",
    h1: "Pongal Festivals & Cultural Celebrations 2027",
    seoTitle: "Pongal Celebrations 2027 | UrPass Explore",
    metaDescription:
      "Celebrate Thai Pongal 2027 with traditional harvest feasts, folk dances, Jallikattu tours, and village carnivals in Tamil Nadu. Book on UrPass.",
    badgeText: "Pongal 2027 Harvest",
    badgeTone: "amber",
    directAnswer:
      "Discover Pongal 2027 celebrations and cultural festivals across Chennai, Madurai, Coimbatore, and rural Tamil Nadu on UrPass Explore.",
    contentSynopsis:
      "Celebrate the auspicious Tamil harvest festival with joy and tradition. UrPass features verified registrations for village harvest experiences, traditional Parai Attam and Silambam showcases, and festive culinary feasts.",
    cityFilter: "Chennai",
    queryKeywords: ["pongal", "thai pongal 2027", "harvest festival", "tamil nadu", "jallikattu", "pongal fest"],
    highlights: [
      { title: "Traditional Village Harvest Festivals", desc: "Clay pot Pongal cooking, sugarcane feasts, and bullock cart rides.", tag: "Village Experience" },
      { title: "Folk Arts & Martial Arts Shows", desc: "Live Karagattam, Oyilattam, and ancient Silambam martial arts displays.", tag: "Folk Arts" },
    ],
    faqs: [
      { q: "When is Pongal 2027 celebrated?", a: "Pongal 2027 celebrations run from January 14 to January 17, 2027 (Bhogi, Thai Pongal, Mattu Pongal, and Kaanum Pongal)." },
    ],
    popularSearchQueries: ["pongal events 2027 chennai", "pongal cultural festivals", "thai pongal celebrations coimbatore", "things to do in pongal 2027"],
    relatedSlugs: ["cultural-events", "chennai", "madurai", "coimbatore"],
    ctaText: "Explore Pongal Celebrations",
  },
  {
    slug: "makar-sankranti-events-2027",
    type: "seasonal",
    priority: "P2",
    h1: "Makar Sankranti & Kite Festivals 2027",
    seoTitle: "Makar Sankranti Events 2027 | UrPass Explore",
    metaDescription:
      "Join the colorful kite flying competitions, cultural melas, and sweets festivals for Makar Sankranti 2027 across India. Book on UrPass Explore.",
    badgeText: "Makar Sankranti 2027",
    badgeTone: "amber",
    directAnswer:
      "Looking for Makar Sankranti 2027 kite festivals? UrPass Explore features verified international kite flying competitions, rooftop gatherings, and cultural melas in Ahmedabad, Jaipur, and Hyderabad.",
    contentSynopsis:
      "Look up at the colorful skies of Makar Sankranti 2027! UrPass brings you tickets and registrations for international kite flying festivals, traditional til-gul sweets tastings, and heritage music gatherings.",
    queryKeywords: ["makar sankranti", "kite festival 2027", "uttarayan", "kite flying", "sankranti mela"],
    highlights: [
      { title: "International Kite Flying Expos", desc: "Master kite flyers from across the world showcasing giant artistic inflatables.", tag: "Kite Expos" },
      { title: "Rooftop Patang Competitions", desc: "Classic aerial kite duels accompanied by music, dhol beats, and Undhiyu feasts.", tag: "Rooftops" },
    ],
    faqs: [
      { q: "When is Makar Sankranti 2027?", a: "Makar Sankranti will be celebrated on Thursday, January 14, 2027 across India." },
    ],
    popularSearchQueries: ["makar sankranti events 2027", "kite festival ahmedabad 2027", "uttarayan 2027 jaipur", "kite flying events near me"],
    relatedSlugs: ["cultural-events", "ahmedabad", "jaipur", "hyderabad"],
    ctaText: "Discover Kite Festivals",
  },
  {
    slug: "republic-day-events-2027",
    type: "seasonal",
    priority: "P2",
    h1: "Republic Day 2027 Celebrations & Runs",
    seoTitle: "Republic Day Events 2027 | UrPass Explore",
    metaDescription:
      "Participate in patriotic freedom runs, military band recitals, and cultural celebrations for Republic Day 2027 across India. Book on UrPass.",
    badgeText: "Republic Day 2027",
    badgeTone: "emerald",
    directAnswer:
      "Celebrate Republic Day 2027 in India on UrPass Explore. Register for verified morning patriotic marathons, heritage cycling rallies, and symphony concerts on January 26, 2027.",
    contentSynopsis:
      "Honor the Constitution and spirit of India on January 26, 2027. UrPass curates community marathons, tricolor cyclothons, and patriotic orchestral performances in Delhi, Bengaluru, Mumbai, and Chennai.",
    queryKeywords: ["republic day 2027", "january 26 run", "tricolor marathon", "patriotic events"],
    highlights: [
      { title: "Tricolor Freedom Marathons (5K/10K)", desc: "Morning fitness runs with commemorative medals, dry-fit jerseys, and breakfast.", tag: "Marathons" },
      { title: "Patriotic Orchestral Recitals", desc: "Vande Mataram and patriotic symphony evenings by leading orchestras.", tag: "Music" },
    ],
    faqs: [
      { q: "When is Republic Day 2027?", a: "Republic Day is celebrated on Tuesday, January 26, 2027." },
    ],
    popularSearchQueries: ["republic day run 2027", "january 26 events near me", "republic day events delhi", "marathon january 26 2027"],
    relatedSlugs: ["sports-events", "delhi-ncr", "bangalore", "chennai"],
    ctaText: "Find Republic Day Events",
  },
  {
    slug: "valentines-day-events-2027",
    type: "seasonal",
    priority: "P2",
    h1: "Valentine's Day 2027 Concerts & Dates",
    seoTitle: "Valentine's Day Events 2027 | UrPass Explore",
    metaDescription:
      "Celebrate Valentine's Day 2027 with romantic candlelight dinners, acoustic love concerts, pottery date nights, and comedy. Book on UrPass.",
    badgeText: "Valentine's 2027",
    badgeTone: "violet",
    directAnswer:
      "Planning Valentine's Day 2027? Discover romantic candlelight concerts, couples' pottery date workshops, rooftop sunset dining, and comedy shows across India on UrPass Explore.",
    contentSynopsis:
      "Make Valentine's Day 2027 unforgettable. UrPass curates couples' experiences ranging from romantic violin candlelit recitals and stargazing glamping getaways to private pottery classes and fine dining popups.",
    queryKeywords: ["valentines day 2027", "romantic dinner", "couple date night", "candlelight concert", "february 14"],
    highlights: [
      { title: "Candlelight String Quartet Concerts", desc: "Romantic film anthems and classical love melodies in intimate candlelit halls.", tag: "Concerts" },
      { title: "Couples Pottery & Art Date Nights", desc: "Shared ceramic wheel crafting with sparkling drinks and dessert bites.", tag: "Date Nights" },
    ],
    faqs: [
      { q: "When do Valentine's Day 2027 events take place?", a: "Celebrations take place throughout Valentine's Week (Feb 7-14), peaking on Sunday, February 14, 2027." },
    ],
    popularSearchQueries: ["valentines day 2027 events near me", "candlelight dinner bangalore 2027", "couple date night mumbai", "romantic concerts feb 14"],
    relatedSlugs: ["music-concerts", "art-workshops", "weekend-activities", "bangalore"],
    ctaText: "Explore Valentine's Events",
  },
  {
    slug: "holi-events-2027",
    type: "seasonal",
    priority: "P2",
    h1: "Holi Color Parties & Rain Dance Festivals 2027",
    seoTitle: "Holi Events 2027 in India | UrPass Explore",
    metaDescription:
      "Celebrate Holi 2027 with organic color parties, rain dances, live Punjabi dhol, and EDM festivals across India. Book verified passes on UrPass.",
    badgeText: "Holi 2027 Special",
    badgeTone: "amber",
    directAnswer:
      "Where are the best Holi 2027 parties in India? UrPass Explore features organic herbal gulal festivals, open-air rain dances, Punjabi dhol stages, and EDM countdowns across Mumbai, Delhi NCR, and Bengaluru.",
    contentSynopsis:
      "Celebrate the festival of colors with joy, safety, and music! UrPass partners with verified organizers using 100% skin-safe organic herbal colors, live food trucks, and celebrity DJ stages.",
    queryKeywords: ["holi 2027", "holi party", "rain dance", "organic gulal", "color festival"],
    highlights: [
      { title: "Organic Gulal & Eco-Friendly Zones", desc: "100% natural flower petals and skin-safe herbal colors with shower facilities.", tag: "Eco Holi" },
      { title: "Live Dhol & Electronic Music Stages", desc: "High-energy Punjabi dhol artists combined with national EDM headliners.", tag: "DJs & Dhol" },
    ],
    faqs: [
      { q: "When is Holi 2027 celebrated in India?", a: "Holi 2027 will be celebrated in March 2027. Grand daytime rain dances run from 10:00 AM to 5:00 PM." },
    ],
    popularSearchQueries: ["holi parties 2027 near me", "holi events bangalore 2027", "holi rain dance mumbai", "organic holi delhi ncr"],
    relatedSlugs: ["dance-dj-events", "music-concerts", "delhi-ncr", "mumbai"],
    ctaText: "Find Holi 2027 Parties",
  },
  {
    slug: "womens-day-events-2027",
    type: "seasonal",
    priority: "P2",
    h1: "International Women's Day 2027 Summits & Runs",
    seoTitle: "Women's Day Events 2027 | UrPass Explore",
    metaDescription:
      "Celebrate International Women's Day 2027 with leadership summits, women entrepreneur showcases, runs, and art exhibitions on UrPass Explore.",
    badgeText: "Women's Day 2027",
    badgeTone: "violet",
    directAnswer:
      "Discover International Women's Day 2027 events on UrPass Explore. Register for women in tech summits, female founder pitch nights, 5K empowerment runs, and panel debates on March 8, 2027.",
    contentSynopsis:
      "Champion innovation and gender equality on March 8, 2027. UrPass curates inspiring conferences, wellness workshops, and networking mixers honoring women leaders across India.",
    queryKeywords: ["womens day 2027", "march 8", "women in tech", "women founders", "empowerment run"],
    highlights: [
      { title: "Women in Tech & Leadership Summits", desc: "Keynotes by female venture capitalists, engineers, and corporate executives.", tag: "Leadership" },
      { title: "All-Women 5K & 10K Fitness Runs", desc: "Scenic city runs celebrating health, sisterhood, and community empowerment.", tag: "Fitness Runs" },
    ],
    faqs: [
      { q: "When is International Women's Day 2027?", a: "International Women's Day is observed globally on Monday, March 8, 2027." },
    ],
    popularSearchQueries: ["womens day events 2027 near me", "women leadership summit bangalore", "march 8 runs india 2027"],
    relatedSlugs: ["business-networking", "sports-events", "bangalore", "mumbai"],
    ctaText: "Explore Women's Day Events",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. HIGH-INTENT DISCOVERY PAGES (10 Pages)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "this-weekend",
    type: "intent",
    priority: "P1",
    h1: "Discover Events Happening This Weekend",
    seoTitle: "Events This Weekend Near You | UrPass Explore",
    metaDescription:
      "Find concerts, workshops, festivals, comedy shows and activities happening this weekend. Browse available events and book tickets with UrPass.",
    badgeText: "Happening This Weekend",
    badgeTone: "violet",
    directAnswer:
      "What events are happening this weekend? UrPass Explore (/explore/this-weekend) features verified live music gigs, stand-up comedy shows, food festivals, and creative workshops happening this Saturday and Sunday.",
    contentSynopsis:
      "Make your weekend count! Whether you want to catch an electrifying live concert, unwind at a pottery workshop, or laugh out loud at a comedy club, UrPass brings you live weekend listings with guaranteed tickets.",
    dateFilter: "this_weekend",
    highlights: [
      { title: "Saturday Night Live Gigs", desc: "High-energy concerts, rooftop DJ sets, and microbrewery comedy shows.", tag: "Saturday Night" },
      { title: "Sunday Morning Workshops", desc: "Art classes, sourdough baking, pet adoption drives, and park yoga.", tag: "Sunday Morning" },
      { title: "Weekend Food Carnivals", desc: "Outdoor street food festivals, artisan markets, and family fairs.", tag: "All Weekend" },
    ],
    faqs: [
      { q: "How do I filter weekend events by city?", a: "Use the city selector at the top of the UrPass Explore page to toggle between Bangalore, Mumbai, Delhi NCR, Chennai, Hyderabad, and other major hubs." },
      { q: "Can I book last-minute tickets on the weekend?", a: "Yes. As long as tickets are available, you can book on your phone and receive your digital QR pass in under 5 seconds for immediate entry." },
    ],
    popularSearchQueries: ["events this weekend near me", "things to do this weekend", "weekend events in bangalore", "saturday night events mumbai", "sunday events delhi"],
    relatedSlugs: ["weekend-activities", "today", "tomorrow", "free-events", "bangalore"],
    ctaText: "Explore This Weekend's Events",
  },
  {
    slug: "today",
    type: "intent",
    priority: "P1",
    h1: "Events Happening Today Near You",
    seoTitle: "Events Today Near You | UrPass Explore",
    metaDescription:
      "Find live events, concerts, comedy shows, and activities happening today. Book instant tickets with sub-second QR entry on UrPass Explore.",
    badgeText: "Happening Today",
    badgeTone: "emerald",
    directAnswer:
      "Looking for something to do today? UrPass Explore (/explore/today) lists verified live events, evening gigs, comedy lineups, and workshops happening today with instant digital ticket delivery.",
    contentSynopsis:
      "Spontaneous plans? UrPass has you covered. Discover verified live events happening today in your city with real-time seat availability and instant QR passes delivered straight to your phone.",
    dateFilter: "today",
    highlights: [
      { title: "Tonight's Gigs & Performances", desc: "Live band showcases, acoustic singer-songwriters, and comedy open mics.", tag: "Tonight" },
      { title: "Evening Networking Mixers", desc: "After-work founder mixers, tech discussions, and business drinks.", tag: "Evening" },
    ],
    faqs: [
      { q: "Are tickets for today's events instantly confirmed?", a: "Yes. UrPass issues your digital pass immediately upon payment. Simply display the QR code at the venue door." },
    ],
    popularSearchQueries: ["events today near me", "things to do today bangalore", "comedy show tonight mumbai", "live gigs today delhi"],
    relatedSlugs: ["tomorrow", "this-weekend", "free-events", "bangalore"],
    ctaText: "Discover Events Today",
  },
  {
    slug: "tomorrow",
    type: "intent",
    priority: "P1",
    h1: "Events Happening Tomorrow Near You",
    seoTitle: "Events Tomorrow Near You | UrPass Explore",
    metaDescription:
      "Plan ahead for tomorrow. Discover upcoming concerts, workshops, sports fests, and evening mixers across India on UrPass Explore.",
    badgeText: "Happening Tomorrow",
    badgeTone: "indigo",
    directAnswer:
      "Plan your day tomorrow with UrPass Explore. Browse concerts, startup meetups, masterclasses, and comedy shows taking place tomorrow across India's top cities.",
    contentSynopsis:
      "Never miss out on tomorrow's best experiences. Lock in your tickets ahead of time and avoid gate queues with UrPass Explore's instant digital ticketing.",
    highlights: [
      { title: "Advance Ticket Reservations", desc: "Secure preferred seating and early entry privileges before venues reach capacity.", tag: "Book Ahead" },
    ],
    faqs: [
      { q: "Can I cancel tickets booked for tomorrow?", a: "Cancellation policies depend on the event organizer and are displayed on each event's checkout page." },
    ],
    popularSearchQueries: ["events tomorrow near me", "things to do tomorrow bangalore", "shows tomorrow mumbai"],
    relatedSlugs: ["today", "this-weekend", "free-events", "bangalore"],
    ctaText: "Explore Tomorrow's Events",
  },
  {
    slug: "free-events",
    type: "intent",
    priority: "P1",
    h1: "Free Events & Community Gatherings Near You",
    seoTitle: "Free Events Near You in India | UrPass Explore",
    metaDescription:
      "Discover free developer meetups, public art exhibitions, open mics, and fitness runs across India. Claim zero-cost passes on UrPass Explore.",
    badgeText: "100% Free Entry",
    badgeTone: "emerald",
    directAnswer:
      "Where can I find free events near me? UrPass Explore (/explore/free-events) features verified zero-cost developer meetups, public exhibitions, community runs, and college fests with instant QR passes.",
    contentSynopsis:
      "Enjoy world-class experiences without spending a single rupee. UrPass supports community organizers with free ticketing and lightning check-ins for public events, meetups, and rallies.",
    pricingFilter: "free",
    highlights: [
      { title: "Free Tech & Coding Meetups", desc: "Open-source user groups, machine learning study jams, and hackathons.", tag: "Tech" },
      { title: "Public Art & Cultural Exhibitions", desc: "Gallery walks, government museum fests, and public heritage trails.", tag: "Culture" },
      { title: "Community Fitness & Park Runs", desc: "Weekend 5K group runs, open-air yoga, and cycling clubs.", tag: "Fitness" },
    ],
    faqs: [
      { q: "Are free event tickets truly 100% free?", a: "Yes. Free events on UrPass have no hidden convenience fees or booking charges. You receive a verified pass completely free." },
    ],
    popularSearchQueries: ["free events near me", "free things to do in bangalore", "free workshops mumbai", "free events delhi ncr"],
    relatedSlugs: ["this-weekend", "workshops", "tech-events", "bangalore"],
    ctaText: "Claim Free Event Passes",
  },
  {
    slug: "ticketed-events",
    type: "intent",
    priority: "P2",
    h1: "Ticketed Events & Premium Experiences",
    seoTitle: "Paid Events & Ticketed Experiences | UrPass Explore",
    metaDescription:
      "Discover verified concerts, stadium tours, VIP business summits, and culinary masterclasses. Book tickets securely with zero platform fee on UrPass.",
    badgeText: "Verified Ticketed Events",
    badgeTone: "violet",
    directAnswer:
      "Looking for ticketed live experiences? UrPass Explore features verified paid concerts, theater productions, VIP conferences, and masterclasses with secure UPI/card checkout and 0% platform fee.",
    contentSynopsis:
      "Experience premium, world-class entertainment and professional enrichment. UrPass handles secure, zero-scalping ticket booking with direct Razorpay payments and immediate digital QR pass issuance.",
    pricingFilter: "paid",
    highlights: [
      { title: "Transparent 0% Platform Fees", desc: "Pay only what the host sets. No exorbitant convenience fees added at checkout.", tag: "Zero Fees" },
      { title: "Official Gate Entry QR Pass", desc: "High-contrast dynamic pass readable offline by gate staff in under 0.3s.", tag: "Fast Entry" },
    ],
    faqs: [
      { q: "What payment methods are supported on UrPass?", a: "UrPass supports UPI (Google Pay, PhonePe, Paytm), debit/credit cards, and net banking with instant verification." },
    ],
    popularSearchQueries: ["buy concert tickets online india", "paid events near me", "book tickets on urpass", "live show tickets bangalore"],
    relatedSlugs: ["music-concerts", "event-tickets", "this-weekend", "mumbai"],
    ctaText: "Browse Ticketed Experiences",
  },
  {
    slug: "online-events",
    type: "intent",
    priority: "P2",
    h1: "Virtual Events, Online Masterclasses & Livestreams",
    seoTitle: "Online Events & Virtual Masterclasses | UrPass Explore",
    metaDescription:
      "Join interactive virtual summits, online coding bootcamps, webinars, and live stream concerts from anywhere. Register on UrPass Explore.",
    badgeText: "Virtual & Remote",
    badgeTone: "indigo",
    directAnswer:
      "Discover verified online events and webinars on UrPass Explore. Attend live virtual conferences, generative AI coding masterclasses, and global workshops from the comfort of your home.",
    contentSynopsis:
      "Learn and connect without geographical boundaries. UrPass powers digital registration, private streaming link delivery, and verifiable attendance for interactive virtual masterclasses and global summits.",
    cityFilter: "Online",
    highlights: [
      { title: "Live Interactive Masterclasses", desc: "Zoom & Google Meet sessions with real-time Q&A and recorded replays.", tag: "Masterclass" },
      { title: "Global Developer Webinars", desc: "Cloud architecture, AI agents, and startup growth panels from international speakers.", tag: "Tech Webinars" },
    ],
    faqs: [
      { q: "How do I access the online event stream?", a: "Once registered, your private join link and calendar invite are sent to your email and accessible directly in your UrPass My Tickets portal." },
    ],
    popularSearchQueries: ["online events india", "virtual workshops 2026", "webinars near me", "online coding masterclass"],
    relatedSlugs: ["workshops", "tech-events", "free-events", "event-tickets"],
    ctaText: "Discover Online Events",
  },
  {
    slug: "weekend-activities",
    type: "intent",
    priority: "P1",
    h1: "Fun Weekend Activities & Experiences",
    seoTitle: "Weekend Activities & Experiences | UrPass Explore",
    metaDescription:
      "Discover outdoor weekend treks, pottery classes, artisan markets, comedy nights, and food trails across India. Book on UrPass Explore.",
    badgeText: "Weekend Fun",
    badgeTone: "emerald",
    directAnswer:
      "What are the most fun weekend activities in India? UrPass Explore curates outdoor camping trips, creative pottery classes, sunset music socials, and food festivals across Bengaluru, Mumbai, and Delhi.",
    contentSynopsis:
      "Break away from routine! UrPass brings you engaging weekend experiences designed for individuals, couples, and groups of friends seeking meaningful, fun-filled leisure activities.",
    dateFilter: "this_weekend",
    highlights: [
      { title: "Creative Art & Pottery Sessions", desc: "Spend a relaxing afternoon throwing clay or painting with friends.", tag: "Creative" },
      { title: "Nature Treks & Campouts", desc: "Guided hillside day treks, lake camping, and stargazing sessions.", tag: "Outdoors" },
    ],
    faqs: [
      { q: "Are weekend activities suitable for solo attendees?", a: "Absolutely. Many workshops, group treks, and social mixers on UrPass are popular with solo individuals looking to meet new people." },
    ],
    popularSearchQueries: ["weekend activities near me", "things to do on saturday bangalore", "sunday activities mumbai", "fun weekend ideas"],
    relatedSlugs: ["this-weekend", "things-to-do-with-friends", "workshops", "bangalore"],
    ctaText: "Explore Weekend Activities",
  },
  {
    slug: "things-to-do-with-friends",
    type: "intent",
    priority: "P2",
    h1: "Fun Things to Do with Friends in Your City",
    seoTitle: "Things to Do with Friends | UrPass Explore",
    metaDescription:
      "Find group activities, comedy nights, live gigs, food carnivals, and gaming tournaments to enjoy with friends. Book tickets on UrPass Explore.",
    badgeText: "Group & Social",
    badgeTone: "violet",
    directAnswer:
      "Looking for fun things to do with friends? UrPass Explore features group activities including live comedy shows, music festivals, escape rooms, culinary food trucks, and board game mixers.",
    contentSynopsis:
      "Gather your squad and make memories. UrPass makes it easy to find group experiences with bulk ticket discounts and easy pass sharing across WhatsApp.",
    queryKeywords: ["friends", "group activity", "social", "mixer", "comedy", "game night"],
    highlights: [
      { title: "Group Comedy & Live Gigs", desc: "Reserve a row of seats at comedy clubs or music festivals with your crew.", tag: "Live Shows" },
      { title: "Board Games & Social Mixers", desc: "Interactive game nights, pub quizzes, and trivia battles.", tag: "Social Gaming" },
    ],
    faqs: [
      { q: "Can I book multiple tickets for my friends?", a: "Yes. You can select multiple tickets during checkout. Each attendee receives their unique QR pass for entry." },
    ],
    popularSearchQueries: ["things to do with friends near me", "group activities bangalore", "fun places to go with friends mumbai", "weekend plans with friends"],
    relatedSlugs: ["weekend-activities", "this-weekend", "standup-comedy", "music-concerts"],
    ctaText: "Find Activities for Friends",
  },
  {
    slug: "family-activities",
    type: "intent",
    priority: "P2",
    h1: "Family Activities & Weekend Days Out",
    seoTitle: "Family Activities & Weekend Days Out | UrPass Explore",
    metaDescription:
      "Discover child-friendly museums, nature parks, science exhibits, puppet shows, and family carnivals across India. Book passes on UrPass.",
    badgeText: "Family Outings",
    badgeTone: "emerald",
    directAnswer:
      "Find the best family activities and outings on UrPass Explore. Discover kid-friendly science fairs, puppet theatre, heritage park walks, and family carnivals.",
    contentSynopsis:
      "Quality family time made simple. UrPass curates safe, stimulating, and joyful family outings suitable for all age groups with transparent family pass pricing.",
    queryKeywords: ["family", "outing", "children", "parents", "weekend family"],
    highlights: [
      { title: "Open-Air Family Carnivals", desc: "Games, food stalls, magic performances, and petting zoos.", tag: "Carnivals" },
      { title: "Hands-on Science & Planetariums", desc: "Interactive science experiments and astronomy sky shows.", tag: "Science" },
    ],
    faqs: [
      { q: "Are venues wheelchair and stroller accessible?", a: "Accessibility details are indicated in the venue specifications on each event's details page." },
    ],
    popularSearchQueries: ["family activities near me", "family weekend outings bangalore", "things to do with family mumbai", "places to visit with family"],
    relatedSlugs: ["family-kids-events", "weekend-activities", "free-events", "bangalore"],
    ctaText: "Explore Family Activities",
  },
  {
    slug: "event-tickets",
    type: "intent",
    priority: "P1",
    h1: "Event Tickets & Online Booking in India",
    seoTitle: "Event Tickets & Booking in India | UrPass Explore",
    metaDescription:
      "Book official tickets for music concerts, tech conferences, comedy tours, and festivals across India. Instant QR check-in & 0% fee on UrPass.",
    badgeText: "Official Ticket Hub",
    badgeTone: "violet",
    directAnswer:
      "Where can I book event tickets online in India with 0% platform fees? UrPass Explore (/explore/event-tickets) is the direct, verified event ticketing portal offering instant QR passes for concerts, conferences, and festivals.",
    contentSynopsis:
      "Skip unfair convenience fees and counterfeit paper tickets. UrPass delivers transparent, direct ticketing powered by Razorpay with sub-second QR code passes sent straight to your phone.",
    pricingFilter: "paid",
    highlights: [
      { title: "Direct Host Pricing (0% Hidden Fees)", desc: "No inflated internet handling charges or surprise processing markups.", tag: "Fair Pricing" },
      { title: "Anti-Counterfeit QR Security", desc: "Unique encrypted QR tickets verified directly at event entrances in under 0.3s.", tag: "Verified Entry" },
      { title: "WhatsApp & Apple Wallet Delivery", desc: "Access your tickets anytime on your smartphone without printing paper passes.", tag: "Mobile Passes" },
    ],
    faqs: [
      { q: "Why book event tickets on UrPass?", a: "UrPass eliminates high platform commissions, guarantees verified event host authenticity, and delivers instant, scannable QR passes directly to your phone." },
      { q: "Can I show the ticket on my phone at the venue?", a: "Yes. All UrPass passes are digital-first. You do not need to print paper; simply present the QR code on your phone screen." },
    ],
    popularSearchQueries: ["book event tickets online", "buy concert tickets india", "zero fee event ticketing", "ticket booking app india", "urpass tickets"],
    relatedSlugs: ["ticketed-events", "music-concerts", "tech-events", "this-weekend", "bangalore"],
    ctaText: "Browse All Event Tickets",
  },
];

// Helper Lookups
export function getExploreSeoPage(slug: string): ExploreSeoPageConfig | undefined {
  const normalized = slug.trim().toLowerCase();
  return EXPLORE_SEO_PAGES.find((p) => p.slug === normalized);
}

export function getAllExploreSeoPages(): ExploreSeoPageConfig[] {
  return EXPLORE_SEO_PAGES;
}

export function getAllExploreSeoSlugs(): string[] {
  return EXPLORE_SEO_PAGES.map((p) => p.slug);
}

export function getExploreSeoPagesByType(type: ExploreSeoPageType): ExploreSeoPageConfig[] {
  return EXPLORE_SEO_PAGES.filter((p) => p.type === type);
}
