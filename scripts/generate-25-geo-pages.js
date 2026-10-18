const fs = require('fs');
const path = require('path');

const CITIES = [
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    region: 'GJ',
    lat: 23.0225,
    lng: 72.5714,
    badge: 'AHMEDABAD CONCLAVES & EXPOS',
    venues: 'Mahatma Mandir Convention Centre, Gujarat University Convention Hall, Science City Auditorium, Karnavati Club',
    colleges: 'IIM Ahmedabad, NID, CEPT University, Nirma University, Gujarat Technological University (GTU)',
    hubs: 'GIFT City, SG Highway, Prahlad Nagar, Ashram Road, Sanand Industrial Corridor',
    specialties: 'Diamond & textile trade expos, national startup summits, enterprise fintech forums, and engineering youth festivals'
  },
  {
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'WB',
    lat: 22.5726,
    lng: 88.3639,
    badge: 'KOLKATA FESTS & CONFERENCES',
    venues: 'Biswa Bangla Mela Prangan, Science City Convention Centre, Milan Mela, Dhono Dhanyo Auditorium, Eco Park',
    colleges: 'Jadavpur University, Presidency University, Calcutta University, St. Xavier\'s College, IIEST Shibpur',
    hubs: 'Salt Lake Sector V, Rajarhat New Town, Park Street, EM Bypass corporate corridor',
    specialties: 'Inter-college cultural fests, national medical conferences, publishing conclaves, and East India IT summits'
  },
  {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'RJ',
    lat: 26.9124,
    lng: 75.7873,
    badge: 'JAIPUR FESTIVALS & TECH SUMMITS',
    venues: 'JECC Sitapura, Birla Auditorium, Rajasthan International Centre (RIC), SMS Convention Hall',
    colleges: 'MNIT Jaipur, Manipal University Jaipur, LNMIIT, Rajasthan University, Amity Jaipur',
    hubs: 'Sitapura Industrial Area, Malviya Nagar, Mansarovar, Mahindra World City Jaipur',
    specialties: 'International literature forums, gems & jewellery expos, university hackathons, and corporate leadership offsites'
  },
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh',
    region: 'CH',
    lat: 30.7333,
    lng: 76.7794,
    badge: 'CHANDIGARH TECH & CAMPUS CONCLAVES',
    venues: 'CII Convention Centre Sector 31, Tagore Theatre Sector 18, Law Auditorium Panjab University, Indradhanush Auditorium',
    colleges: 'Panjab University (PU), PEC Chandigarh, Chandigarh University, Chitkara University, UIET',
    hubs: 'Rajiv Gandhi Chandigarh Technology Park (IT Park), Mohali IT Hub, Sector 17 Commercial Centre',
    specialties: 'Inter-university youth festivals, Tricity developer hackathons, agri-tech conferences, and corporate trade meets'
  },
  {
    slug: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    region: 'MP',
    lat: 22.7196,
    lng: 75.8577,
    badge: 'INDORE STARTUP & STUDENT SUMMITS',
    venues: 'Brilliant Convention Centre, Labh Mandapam, Amber Convention Centre, Ravindra Natya Grah',
    colleges: 'IIT Indore, IIM Indore, SGSITS, DAVV Indore, Medi-Caps University',
    hubs: 'Super Corridor, Vijay Nagar, Crystal IT Park, AB Road commercial hub',
    specialties: 'Central India startup showcases, engineering hackathons, pharma conferences, and national management conclaves'
  },
  {
    slug: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    region: 'UP',
    lat: 26.8467,
    lng: 80.9462,
    badge: 'LUCKNOW CONVENTIONS & CONCLAVES',
    venues: 'Indira Gandhi Pratishthan (IGP), Scientific Convention Centre KGMU, Sangeet Natak Akademi, Atal Bihari Vajpayee Scientific Convention Hall',
    colleges: 'IIM Lucknow, King George\'s Medical University (KGMU), Lucknow University, BBD University, IET Lucknow',
    hubs: 'Gomti Nagar, Vibhuti Khand, Hazratganj corporate district, Shaheed Path IT corridor',
    specialties: 'Healthcare congresses, government technology summits, inter-university cultural fests, and agro-industry meets'
  },
  {
    slug: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    region: 'MH',
    lat: 21.1458,
    lng: 79.0882,
    badge: 'NAGPUR CONFERENCES & LOGISTICS MEETS',
    venues: 'Suresh Bhat Auditorium, Vasantrao Deshpande Hall, MIHAN Conclave Hall, Chitnavis Centre',
    colleges: 'VNIT Nagpur, AIIMS Nagpur, IIM Nagpur, RTM Nagpur University, Ramdeobaba University',
    hubs: 'MIHAN SEZ, Civil Lines, Ramdaspeth, Hingna Industrial Area',
    specialties: 'Central India logistics expos, medical specialist conferences, engineering symposiums, and national trade conventions'
  },
  {
    slug: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    region: 'MP',
    lat: 23.2599,
    lng: 77.4126,
    badge: 'BHOPAL ACADEMIC & TECH FORUMS',
    venues: 'Ravindra Bhavan Convention Centre, Kushabhau Thakre International Convention Centre (Minto Hall), Bharat Bhavan',
    colleges: 'MANIT Bhopal, IISER Bhopal, AIIMS Bhopal, NLIU Bhopal, Barkatullah University',
    hubs: 'MP Nagar, Arera Colony, Mandideep Industrial Hub, Govindpura',
    specialties: 'National science conclaves, law university moot courts, state education festivals, and environmental summits'
  },
  {
    slug: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    region: 'GJ',
    lat: 21.1702,
    lng: 72.8311,
    badge: 'SURAT TRADE EXPOS & CONVENTIONS',
    venues: 'Surat International Exhibition & Convention Centre (SIECC) Sarsana, Pandit Dindayal Upadhyay Indoor Stadium, Sanjeev Kumar Auditorium',
    colleges: 'SVNIT Surat, Veer Narmad South Gujarat University (VNSGU), Auro University, Sarvajanik University',
    hubs: 'Surat Diamond Bourse (SDB), Ring Road textile district, Ichhapore, Hazira Industrial Belt',
    specialties: 'Textile machinery expos, diamond industry symposiums, engineering youth conferences, and business conclaves'
  },
  {
    slug: 'vadodara',
    name: 'Vadodara',
    state: 'Gujarat',
    region: 'GJ',
    lat: 22.3072,
    lng: 73.1812,
    badge: 'VADODARA CULTURAL & INDUSTRIAL SUMMITS',
    venues: 'Sir Sayajirao Diamond Jubilee Hall, Alembic City Art District, L&T Knowledge City Conclave Centre, C.C. Mehta Auditorium',
    colleges: 'MS University of Baroda (MSU), Parul University, ITM (SLS) Baroda University, Navrachana University',
    hubs: 'Alkapuri, Gorwa Industrial Area, Makarpura GIDC, Manjusar GIDC',
    specialties: 'Industrial power summits, international art conclaves, engineering symposiums, and cultural youth festivals'
  },
  {
    slug: 'visakhapatnam',
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    region: 'AP',
    lat: 17.6868,
    lng: 83.2185,
    badge: 'VIZAG TECH & MARITIME SUMMITS',
    venues: 'AU Convention Centre Beach Road, MGM Convention Hall, VMRDA Children\'s Arena, Port Stadium Indoor Complex',
    colleges: 'Andhra University (AU), GITAM Deemed University, IIM Visakhapatnam, Damodaram Sanjivayya National Law University',
    hubs: 'Fintech Valley Vizag, Rushikonda IT Park, Siripuram, Gajuwaka industrial zone',
    specialties: 'Maritime logistics expos, fintech conclaves, coastal university hackathons, and state biotech summits'
  },
  {
    slug: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    region: 'OD',
    lat: 20.2961,
    lng: 85.8245,
    badge: 'BHUBANESWAR IT & CAMPUS CONCLAVES',
    venues: 'Janata Maidan, KIIT Convention Centre, Rail Auditorium Chandrasekharpur, SOA University Auditorium',
    colleges: 'IIT Bhubaneswar, KIIT University, SOA University, Utkal University, AIIMS Bhubaneswar',
    hubs: 'Infocity, Chandrasekharpur IT corridor, Patia educational belt, Mancheswar',
    specialties: 'Inter-college mega fests, mining & metals technology conferences, medical symposiums, and eastern India hackathons'
  },
  {
    slug: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    region: 'KL',
    lat: 8.5241,
    lng: 76.9366,
    badge: 'TRIVANDRUM TECH & AEROSPACE MEETS',
    venues: 'Technopark Club House Amphitheatre, Travancore International Convention Centre, Nishagandhi Auditorium, Tagore Theatre',
    colleges: 'College of Engineering Trivandrum (CET), IIST Thiruvananthapuram, Kerala University, Government Engineering College (Barton Hill)',
    hubs: 'Technopark Phases 1–4, Kazhakkoottam, Kariavattom, Palayam government enclave',
    specialties: 'Space science & aerospace seminars, IT developer summits, college cultural fests, and digital media conferences'
  },
  {
    slug: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    region: 'UK',
    lat: 30.3165,
    lng: 78.0322,
    badge: 'DEHRADUN UNIVERSITY & NATIONAL MEETS',
    venues: 'Forest Research Institute (FRI) Convocation Hall, Graphic Era Convention Centre, UPES Bidholi Auditorium, Town Hall Dehradun',
    colleges: 'UPES Dehradun, Graphic Era University, DIT University, IMS Unison, Forest Research Institute',
    hubs: 'Rajpur Road, Sahastradhara IT Park, Subhash Nagar, Selaqui Industrial Area',
    specialties: 'Energy & sustainability summits, inter-university technical fests, forestry conventions, and mountain tourism meets'
  },
  {
    slug: 'mysore',
    name: 'Mysore',
    state: 'Karnataka',
    region: 'KA',
    lat: 12.2958,
    lng: 76.6394,
    badge: 'MYSURU HERITAGE & TECH CONCLAVES',
    venues: 'Infosys Mysore GEC Auditorium, KSOU Convocation Hall, Senate Bhavan Manasagangotri, Kalamandira',
    colleges: 'SJCE (JSS Science & Technology University), NIE Mysore, University of Mysore, Amrita Vishwa Vidyapeetham Mysuru',
    hubs: 'Hebbal Electronic City, Hootagalli Industrial Area, Vijayanagar, Saraswathipuram',
    specialties: 'Corporate developer training summits, university science congresses, heritage cultural festivals, and robotics symposiums'
  },
  {
    slug: 'ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    region: 'JH',
    lat: 23.3441,
    lng: 85.3096,
    badge: 'RANCHI INSTITUTIONAL & TECH MEETS',
    venues: 'Khelgaon Mega Sports Complex, BIT Mesra CAT Auditorium, Aryabhatta Auditorium Morabadi, Audrey House',
    colleges: 'BIT Mesra, IIM Ranchi, National University of Study and Research in Law (NUSRL), Ranchi University',
    hubs: 'Main Road commercial corridor, Namkum industrial belt, Kanke Road, Doranda',
    specialties: 'Mineral industry conventions, national moot courts, college engineering fests, and health research symposiums'
  },
  {
    slug: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    region: 'AS',
    lat: 26.1445,
    lng: 91.7362,
    badge: 'GUWAHATI NORTHEAST CONCLAVES',
    venues: 'Sarusajai Indoor Stadium, Srimanta Sankaradeva Kalakshetra, IIT Guwahati Central Auditorium, Maniram Dewan Trade Centre',
    colleges: 'IIT Guwahati, Gauhati University, Assam Engineering College (AEC), Cotton University, Royal Global University',
    hubs: 'GS Road commercial spine, Paltan Bazaar, Khanapara, Amingaon industrial area',
    specialties: 'Northeast business summits, international tea & biodiversity conclaves, inter-college youth festivals, and tech codefests'
  },
  {
    slug: 'vijayawada',
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    region: 'AP',
    lat: 16.5062,
    lng: 80.6480,
    badge: 'VIJAYAWADA COMMERCIAL & YOUTH SUMMITS',
    venues: 'A-Convention Centre, Siddhartha Auditorium, KL University Central Conclave Hall, Swarajya Maidan Grounds',
    colleges: 'KL University (Vaddeswaram), Andhra Loyola College, Siddhartha Engineering College, SRM University-AP',
    hubs: 'MG Road, Benz Circle, Auto Nagar industrial estate, Amaravati educational zone',
    specialties: 'Commercial business expos, technical college symposiums, healthcare conclaves, and agricultural technology meets'
  },
  {
    slug: 'raipur',
    name: 'Raipur',
    state: 'Chhattisgarh',
    region: 'CT',
    lat: 21.2514,
    lng: 81.6296,
    badge: 'RAIPUR INDUSTRIAL & CAMPUS FORUMS',
    venues: 'Pt. Deendayal Upadhyay Auditorium, AIIMS Raipur Conclave Centre, IGKV University Auditorium, Science College Ground',
    colleges: 'NIT Raipur, AIIMS Raipur, IIM Raipur, Hidayatullah National Law University (HNLU), Pandit Ravishankar Shukla University',
    hubs: 'Naya Raipur (Atal Nagar), Pandri, Urla Industrial Area, Telibandha corporate cluster',
    specialties: 'Steel & energy industrial expos, medical specialist symposiums, law university summits, and central India youth fests'
  },
  {
    slug: 'mangalore',
    name: 'Mangalore',
    state: 'Karnataka',
    region: 'KA',
    lat: 12.9141,
    lng: 74.8560,
    badge: 'MANGALORE MEDICAL & TECH CONCLAVES',
    venues: 'TMA Pai International Convention Centre, Town Hall Mangalore, NITK Surathkal Diamond Jubilee Auditorium, Kudmul Ranga Rao Hall',
    colleges: 'NITK Surathkal, Yenepoya University, Father Muller Medical College, St. Aloysius College, Nitte University',
    hubs: 'Kottara Chowki, Hampankatta, Baikampady Industrial Area, Derlakatte healthcare corridor',
    specialties: 'Medical & dental clinical conferences, coastal developer hackathons, collegiate sports tournaments, and maritime meets'
  },
  {
    slug: 'manipal',
    name: 'Manipal',
    state: 'Karnataka',
    region: 'KA',
    lat: 13.3409,
    lng: 74.7421,
    badge: 'MANIPAL MEGA UNIVERSITY FESTS',
    venues: 'KMC Greens, Dr. TMA Pai Hall MAHE, Fortune Inn Valley View Conclave Rooms, MIT Quadrangle Stage',
    colleges: 'Manipal Academy of Higher Education (MAHE), Manipal Institute of Technology (MIT), Kasturba Medical College (KMC), TAPMI',
    hubs: 'Tiger Circle, Madhav Nagar university campus, Eshwar Nagar, Udupi highway corridor',
    specialties: 'Pan-India engineering college fests (Revels, TechTatva), international medical congresses, management symposiums, and collegiate sports leagues'
  },
  {
    slug: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    region: 'PB',
    lat: 31.6340,
    lng: 74.8723,
    badge: 'AMRITSAR PROFESSIONAL & CULTURAL CONVENTIONS',
    venues: 'Guru Nanak Dev University (GNDU) Auditorium, Hartej Convention Centre, Ranjit\'s SVAASA Conclave, Guru Nanak Bhawan',
    colleges: 'GNDU Amritsar, Khalsa College, Government Medical College (GMC), IIM Amritsar',
    hubs: 'Mall Road, Ranjit Avenue, Court Road, Focal Point industrial complex',
    specialties: 'North India medical congresses, university cultural youth festivals, agricultural processing meets, and corporate seminars'
  },
  {
    slug: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'UP',
    lat: 25.3176,
    lng: 82.9739,
    badge: 'VARANASI SCIENTIFIC & CULTURAL SUMMITS',
    venues: 'Rudraksh International Cooperation & Convention Centre, Swatantrata Bhavan IIT BHU, Deendayal Hastkala Sankul (Bada Lalpur), KN Udupa Auditorium',
    colleges: 'IIT (BHU) Varanasi, Banaras Hindu University (BHU), Institute of Medical Sciences (IMS BHU), Mahatma Gandhi Kashi Vidyapith',
    hubs: 'Lanka (BHU Campus), Sigra, Cantonment commercial district, Shivpur corridor',
    specialties: 'International scientific symposiums, Sanskrit & cultural literature conclaves, IIT engineering fests (Technex, Kashiyatra), and medical meets'
  },
  {
    slug: 'nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    region: 'MH',
    lat: 19.9975,
    lng: 73.7898,
    badge: 'NASHIK INDUSTRIAL & WINE FEST MEETS',
    venues: 'Kalasmarak Auditorium, Sula Vineyards Open Amphitheatre, Gangapur Dam Conclave Grounds, Dadasaheb Gaikwad Sabhagruh',
    colleges: 'KK Wagh Institute of Engineering, Sandip University, MET Bhujbal Knowledge City, Yashwantrao Chavan Maharashtra Open University (YCMOU)',
    hubs: 'Ambad MIDC, Satpur MIDC, College Road, Gangapur Road IT corridor',
    specialties: 'Engineering college symposiums, automotive vendor conferences, agro-tourism & wine festivals, and regional sports tournaments'
  },
  {
    slug: 'navi-mumbai',
    name: 'Navi Mumbai',
    state: 'Maharashtra',
    region: 'MH',
    lat: 19.0330,
    lng: 73.0297,
    badge: 'NAVI MUMBAI EXPOS & MEGA CONVENTIONS',
    venues: 'CIDCO Exhibition Centre Vashi, Dr. DY Patil Sports Stadium, Vishnudas Bhave Natyagriha, Central Park Amphitheatre Kharghar',
    colleges: 'DY Patil University, SIES Graduate School of Technology, Bharati Vidyapeeth Kharghar, Pillai College of Engineering Panvel',
    hubs: 'Vashi Infotech Park, Mahape Millennium Business Park (MBP), CBD Belapur, Kharghar, TTC Industrial Area',
    specialties: 'National B2B industrial trade expos, inter-collegiate sports & esports championships, IT developer codefests, and mega medical conventions'
  }
];

function generatePageFile(city) {
  return `import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in ${city.name}",
  description: "Organizing a college fest, conference, trade expo, or corporate event in ${city.name}? URPASS delivers instant online registration, Razorpay UPI ticketing with 0% platform cuts, digital QR passes, and sub-0.3s gate scanning from any smartphone.",
  keywords: [
    "event registration software ${city.slug}",
    "event ticketing platform ${city.name}",
    "QR event check-in ${city.name}",
    "college event passes ${city.name}",
    "Razorpay event ticketing ${city.state}",
    "event attendance software ${city.name}",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-${city.slug}" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in ${city.name} | URPASS",
    description: "Organizing an event in ${city.name}? URPASS delivers instant online registrations, 0% commission Razorpay UPI ticketing, digital QR passes, and sub-0.3s gate check-in.",
    url: "https://urpass.space/event-registration-software-${city.slug}",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "${city.region}",
    "geo.placename": "${city.name}",
    "geo.position": "${city.lat};${city.lng}",
    "ICBM": "${city.lat}, ${city.lng}",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "${city.badge}",
        h1: "Event Registration & QR Check-In Software in ${city.name}",
        canonicalUrl: "https://urpass.space/event-registration-software-${city.slug}",
        geo: {
          region: "${city.region}",
          placename: "${city.name}",
          position: "${city.lat};${city.lng}",
          latitude: ${city.lat},
          longitude: ${city.lng},
        },
        description: "Organizing a college fest, conference, trade expo, or corporate summit in ${city.name}? URPASS powers end-to-end event registrations, automated QR pass delivery, native Razorpay UPI ticketing, and sub-0.3s door check-in on any smartphone.",
        ctaLabel: "Start your ${city.name} event free",
        directAnswer: {
          title: "How URPASS streamlines ${city.name} event operations",
          summary: "URPASS replaces error-prone Google Forms, physical paper tickets, and expensive ticketing aggregators for ${city.name} organizers. Registrants receive unique cryptographically generated QR passes via instant confirmation. Gate volunteers scan passes directly using their smartphone cameras in under 0.3s with zero app installation, eliminating venue entry queues entirely.",
          keyPoints: [
            "0% platform commission on ticket revenue (keep 100% of your ticket sales)",
            "Native Razorpay integration supporting Google Pay, PhonePe, Paytm, cards, and net banking",
            "Sub-0.3s door check-in speed that prevents bottleneck queues at venue gates",
            "Strict anti-duplicate pass lockout across all venue entrances simultaneously"
          ]
        },
        keyFactsTable: {
          title: "${city.name} Event Ticketing & Gate Control Comparison",
          subtitle: "Why event directors and student committees in ${city.name} switch to URPASS",
          headers: ["Operational Feature", "Traditional Ticketing Platforms", "URPASS Event Infrastructure"],
          rows: [
            { col1: "Ticket Commission", col2: "5% to 12% per ticket + convenience charges", col3: "0% platform commission fee (keep 100% of proceeds)" },
            { col1: "Gate Check-In Speed", col2: "15 to 45 seconds per attendee", col3: "Under 0.3 seconds via smartphone browser scanner" },
            { col1: "Volunteer Onboarding", col2: "Requires app store downloads, logins & training", col3: "Zero app download: works instantly on any phone camera" },
            { col1: "Pass Security", col2: "Easily duplicated via screenshots or forwarded emails", col3: "Cryptographic QR pass with real-time multi-gate duplicate lockout" },
            { col1: "Payout Timelines", col2: "Funds held until 7 to 14 days after event concludes", col3: "Direct Razorpay settlements straight to your organization bank account" }
          ]
        },
        features: [
          { icon: MapPin, title: "Engineered for ${city.name}", desc: "Direct INR billing, GST compliant tax invoices, and optimized performance for ${city.name} venues, colleges, and business districts." },
          { icon: Ticket, title: "0% Commission UPI Ticketing", desc: "Collect payments directly via Razorpay with Google Pay, PhonePe, Paytm, net banking, and cards with zero platform percentage fees." },
          { icon: QrCode, title: "Instant Digital QR Passes", desc: "Registrants receive personal digital passes formatted for mobile display, Apple Wallet, and WhatsApp sharing." },
          { icon: ScanLine, title: "Sub-0.3s Mobile Scanning", desc: "Volunteers and door staff scan passes at venue gates using any iOS or Android phone browser without renting barcode hardware." },
          { icon: Users, title: "Central Attendee Control", desc: "Review applications, approve VIP participants, manage waitlists, and issue delegate passes from a unified control console." },
          { icon: BarChart3, title: "Real-Time Gate Analytics", desc: "Track live footfall velocity, peak arrival intervals, and gate turnout percentages with one-click export for institutional audits." },
        ],
        callout: {
          badge: "POPULAR ${city.name.toUpperCase()} VENUES & INSTITUTES",
          title: "Trusted across venues and campuses in ${city.name}.",
          description: "Engineered for high-volume crowds across ${city.venues}. URPASS is trusted by ${city.colleges} to eliminate ticket fraud and eradicate entrance bottlenecks.",
          bullets: [
            "Local INR pricing with automated GST tax invoices",
            "Zero percentage commission deducted from ticket sales",
            "Instant multi-gate duplicate pass lockout",
            "Permanent free plan available for up to 100 registrations per month"
          ],
        },
        useCases: [
          "Engineering College Cultural & Technical Fests",
          "Corporate Conferences & Technology Summits",
          "Medical, Healthcare & Scientific Congresses",
          "Startup Pitch Conclaves & Hackathons",
          "Industry Trade Shows & Commercial Expos",
        ],
        faqs: [
          { q: "Can ${city.name} organizers accept payments via UPI with zero platform cuts?", a: "Yes. With native Razorpay integration, attendees pay via Google Pay, PhonePe, Paytm, cards, or net banking, and funds settle directly into your bank account with zero platform percentage commissions taken by URPASS." },
          { q: "How fast is check-in during peak entry at ${city.name} venues?", a: "Check-in takes under 0.3 seconds per attendee. Volunteers simply point their phone browser camera at the pass QR code. Instant audio-visual cues verify validity and block duplicates." },
          { q: "Can volunteers scan passes without installing an app from the App Store or Play Store?", a: "Yes. Volunteers access a secure web scanning link directly on their mobile browser. No downloads, installations, or app store accounts are required." },
          { q: "Is there a free tier for student communities and meetups in ${city.name}?", a: "Yes. Organizers can host events with up to 100 registrations per month completely free on our starter tier, with full access to QR passes and live scanning." },
        ],
        ctaTitle: "Power your ${city.name} event with URPASS",
        ctaDescription: "Permanent free tier available · Razorpay UPI settlements · Instant mobile browser scanning",
      }}
    />
  );
}
`;
}

console.log('Generating 25 programmatic SEO & GEO landing pages...');

for (const city of CITIES) {
  const dirName = 'event-registration-software-' + city.slug;
  const dirPath = path.join(__dirname, '..', 'app', dirName);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(filePath, generatePageFile(city), 'utf8');
  console.log('Generated:', dirName + '/page.tsx');
}

console.log('Successfully generated all 25 pages!');
