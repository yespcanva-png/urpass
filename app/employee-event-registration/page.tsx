import type { Metadata } from "next";
import { BarChart3, Briefcase, Lock, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Employee Event Registration & QR Access | URPASS",
  description: "Employee event registration software for company offsites, annual celebrations, sports days, and town halls. Employee ID verification and fast QR check-in.",
  keywords: ["employee event registration software", "internal corporate event check-in", "company offsite registration", "employee sports day ticketing", "annual company party check-in", "employee qr pass access control"],
  alternates: {
    canonical: "https://urpass.space/employee-event-registration",
  },
  openGraph: {
    title: "Employee Event Registration & QR Access | URPASS",
    description: "Employee event registration software for company offsites, annual celebrations, sports days, and town halls. Employee ID verification and fast QR check-in.",
    url: "https://urpass.space/employee-event-registration",
    locale: "en_US",
    type: "website",
  },
};

export default function EmployeeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
  "badge": "EMPLOYEE & INTERNAL COMMS",
  "h1": "Employee Event Registration & QR Access",
  "canonicalUrl": "https://urpass.space/employee-event-registration",
  "description": "Employee event registration software for company offsites, annual celebrations, sports days, and town halls. Employee ID verification and fast QR check-in.",
  "ctaLabel": "Create Employee Event Free →",
  "ctaTitle": "Power Smooth Internal Company Celebrations",
  "ctaDescription": "Register staff for annual parties, offsites, and sports days, issue branded mobile passes, and admit hundreds of employees in seconds with smartphone check-in.",
  "directAnswer": {
    "title": "What is Employee Event Registration Software?",
    "summary": "URPASS is employee event registration and QR access control software built for corporate all-hands meetings, company offsites, annual holiday parties, and internal sports tournaments. It allows internal communications and HR teams to verify employee IDs, issue branded mobile passes, and admit colleagues in under 0.3 seconds on volunteer smartphones.",
    "keyPoints": [
      "Mandatory employee ID, department, office location, and dietary preference capture",
      "Family and guest pass allocations managed seamlessly under employee profiles",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "Strict data privacy with confidential guest lists and no public discovery"
    ]
  },
  "whatIs": {
    "title": "What is Employee Event Registration Software?",
    "definition": "Employee event registration software is an internal corporate event platform that manages staff RSVPs, dietary requirements, guest allocations, digital badge issuance, and entrance check-in for company celebrations and offsites.",
    "details": [
      "Ensures company event lists remain confidential without public exposure",
      "Replaces printed badge binders and manual reception sign-ins with instant digital QR passes",
      "Coordinates bus shuttles, hotel room allocations, and activity tracks for offsites",
      "Provides live arrival headcounts to ensure venue fire safety compliance"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Employee Events",
  "howItWorksSubtitle": "From internal invitation to party entrance check-in.",
  "steps": [
    {
      "n": "01",
      "title": "Configure employee event",
      "desc": "Set party details, venue capacity, guest ticket allocations, and dietary questions."
    },
    {
      "n": "02",
      "title": "Send internal invitations",
      "desc": "Distribute registration links via Slack, Microsoft Teams, or corporate email."
    },
    {
      "n": "03",
      "title": "Employees confirm attendance",
      "desc": "Colleagues confirm attendance, dietary restrictions, and guest details in seconds."
    },
    {
      "n": "04",
      "title": "Issue branded digital passes",
      "desc": "Staff receive personalized mobile passes with company branding and QR access."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Internal comms or reception volunteers scan passes in <0.3s with smartphone cameras."
    },
    {
      "n": "06",
      "title": "Live celebration analytics",
      "desc": "Monitor check-in velocity and total headcount live from the organizer dashboard."
    }
  ],
  "featuresTitle": "Features Built for Internal People & Culture Teams",
  "featuresSubtitle": "Employee ID capture, guest allocations, and sub-second phone scanning.",
  "features": [
    {
      icon: Users,
      "title": "Employee ID & Dept Fields",
      "desc": "Capture mandatory employee numbers, office locations, department cost centers, and dietary needs."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Entrance Scanning",
      "desc": "Admit 40+ employees per minute from your own phone camera. Prevent queues outside event venues."
    },
    {
      icon: Briefcase,
      "title": "Plus-One & Family Passes",
      "desc": "Allow staff to register spouses and children with dedicated digital passes under one primary booking."
    },
    {
      icon: Lock,
      "title": "Anti-Gatecrashing Protection",
      "desc": "Ensure only current employees and invited guests enter company parties. Passes cannot be duplicated."
    },
    {
      icon: ShieldCheck,
      "title": "Strict Corporate Privacy",
      "desc": "Employee personal data is stored securely without third-party advertising brokers or public exposure."
    },
    {
      icon: BarChart3,
      "title": "Catering Headcount Accuracy",
      "desc": "Accurately track checked-in guests versus RSVPs to optimize catering orders and reduce food waste."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Employee Event Software?",
    "subtitle": "From People & Culture teams to corporate sports committees.",
    "personas": [
      {
        "badge": "PEOPLE & HR",
        "title": "HR & People Operations",
        "desc": "Annual holiday galas, summer family picnics, milestone company celebrations, and town halls."
      },
      {
        "badge": "OFFSITES",
        "title": "Executive Assistants & Offsite Planners",
        "desc": "Multi-day company offsites, leadership retreats, and regional team-building weekends."
      },
      {
        "badge": "SPORTS",
        "title": "Corporate Sports & Social Clubs",
        "desc": "Inter-department football tournaments, 5K charity runs, and company bowling nights."
      },
      {
        "badge": "CSR",
        "title": "Corporate Volunteering & CSR",
        "desc": "Company-wide community volunteer days, tree-planting drives, and charity fundraisers."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Employee Event QR Check-In Works",
    "subtitle": "Warm, fast celebration entry.",
    "description": "Employees display their mobile QR pass on their phone screen as they arrive at the party venue. HR team members or reception staff open the URPASS scanner interface on their smartphones or tablets. In under 0.3 seconds, the camera validates the pass, displays the employee's name and department, and chimes green, providing a fast welcome without paper checklists.",
    "points": [
      "Zero equipment costs: runs directly on HR team members' smartphones.",
      "Instant verification displays employee name, department, and plus-one status.",
      "Fast manual search option if an employee's phone battery runs out.",
      "Real-time headcount updates on the organizer dashboard."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Manual Reception Binders",
    "subtitle": "How URPASS elevates internal employee events.",
    "headers": [
      "Employee Event Logistic",
      "Manual Printed Binders / Paper Lists",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Entrance Speed",
        "col2": "15 to 25 second delay searching alphabetized sheets",
        "col3": "<0.3s camera scan on HR volunteer's phone"
      },
      {
        "col1": "Plus-One Verification",
        "col2": "Confusion over who brought guests and family",
        "col3": "Dedicated plus-one passes linked to employee ID"
      },
      {
        "col1": "Confidentiality",
        "col2": "Printed paper roster exposed on reception table",
        "col3": "Encrypted digital records; zero public discovery"
      },
      {
        "col1": "Catering Optimization",
        "col2": "No-shows cause massive food waste and budget loss",
        "col3": "Live attendance numbers help manage catering in real time"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is employee event registration software?",
      "a": "It is an internal event platform designed for corporate HR and internal comms teams to manage employee RSVPs, distribute digital passes, and check staff in at company celebrations and offsites."
    },
    {
      "q": "Can employees register their plus-ones or family members?",
      "a": "Yes. You can configure guest allocations allowing employees to register spouses, partners, or children, generating individual passes for each guest."
    },
    {
      "q": "Can we collect dietary restrictions for catering?",
      "a": "Yes. Custom intake fields let you capture dietary needs (e.g. vegan, gluten-free, halal), T-shirt sizes, and activity preferences."
    },
    {
      "q": "How does URPASS prevent unauthorized party crashers?",
      "a": "Each pass has an encrypted cryptographic QR code that can only be validated once. When scanned, it immediately displays the employee's name and department."
    },
    {
      "q": "Do employees need to download an app?",
      "a": "No. Passes display cleanly in any mobile browser or email, and door teams scan using web browsers without installing native apps."
    },
    {
      "q": "Can employees register their plus-ones or family members for company retreats?",
      "a": "Yes. Organizers can allow multi-seat registrations or create dependent ticket tiers to capture family member details and dietary preferences."
    },
    {
      "q": "Is employee data kept private and confidential?",
      "a": "Yes. URPASS enforces strict role-based access control, data encryption in transit and at rest, and zero third-party data sharing or retargeting ads."
    }
  ],
  "relatedLinks": [
    {
      "title": "Corporate Event Registration & Attendee Check-In",
      "href": "/corporate-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Training Registration & Attendance Tracking",
      "href": "/training-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Networking Event Registration Software",
      "href": "/networking-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Event Entry Management & QR Access Control",
      "href": "/event-entry-management-software",
      "category": "Product"
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
      "category": "Product"
    }
  ]
}}
    />
  );
}
