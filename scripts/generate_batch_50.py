#!/usr/bin/env python3
"""
generate_batch_50.py

Generates and updates all 50 high-intent SEO + GEO pages for URPASS (October 3, 2026 batch)
Following the strict 10-point standard:
1. Primary search query H1
2. 40-70 word Direct Answer immediately after H1
3. H2: What is [keyword]? (Definition for Google snippets / AI search)
4. H2: How URPASS works for [use case] (6 steps: Create -> Register -> Approve/pay -> Issue pass -> Scan -> Track)
5. H2: Features (relevant to query)
6. H2: Who should use it? (3-6 personas)
7. H2: How QR check-in works (technical explanation)
8. H2: URPASS vs manual workflow / competitor comparison table
9. H2: Frequently asked questions (6-10 query-specific questions)
10. H2: Start your event (Commercial CTA)

Schemas: SoftwareApplication, WebPage, BreadcrumbList, FAQPage, Organization, (and Place/Service for locations)
"""

import os
import sys
import json
import re

# Add scripts directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

import data_uk_pages
import data_vertical_pages
import data_comparison_pages
import data_feature_pages

EXTRA_FAQS = {
    '/hackathon-registration-software': [
        {'q': 'Can URPASS prevent unregistered walk-ins from entering overnight?', 'a': 'Yes. Every attendee QR code is cryptographically tied to an approved registration. If an unregistered walk-in presents an unverified or screenshot code, the browser scanner instantly flashes red with an invalid pass warning.'},
        {'q': 'Can teams or group registrations be tracked together?', 'a': 'Yes. Organizers can add custom team name fields during registration and group attendees by project or team for streamlined badge printing and check-in.'}
    ],
    '/workshop-registration-software': [
        {'q': 'Can I cap workshop capacity to prevent overbooking?', 'a': 'Yes. You can set hard ticket limits per session. Once the quota is reached, registration automatically closes or moves attendees to a waitlist.'},
        {'q': 'Can attendees add workshop tickets to their Apple or Google Wallet?', 'a': 'Yes. Digital pass links can be saved directly on mobile browsers or added to digital wallets for instant offline retrieval at the classroom door.'}
    ],
    '/seminar-registration-software': [
        {'q': 'Can we issue Continuing Professional Development (CPD) or attendance certificates after the seminar?', 'a': 'Yes. URPASS records exact entry timestamps for every attendee, allowing you to filter verified attendees and export verified attendance lists for CPD certificate distribution.'},
        {'q': 'Can we collect attendee job titles and organization names at registration?', 'a': 'Yes. The registration form builder lets you add mandatory fields for organization name, job title, and professional accreditation numbers.'}
    ],
    '/meetup-registration-software': [
        {'q': 'How does URPASS reduce no-shows at free community meetups?', 'a': 'URPASS sends automated confirmation emails with digital QR passes, calendar invite files (.ics), and timely reminders, keeping RSVP commitment high compared to generic web forms.'},
        {'q': 'Can co-organizers scan tickets at the meetup entrance?', 'a': 'Yes. You can invite team members or venue hosts as check-in scanners with a single role-based link or passcode without sharing administrative account credentials.'}
    ],
    '/exhibition-registration-software': [
        {'q': 'Can URPASS handle multi-day exhibition visitor badges?', 'a': 'Yes. Each visitor QR pass can be configured for single-day or multi-day badge access, recording daily re-entries without resetting attendee records.'},
        {'q': 'Can exhibitor staff scan visitor passes for lead capture?', 'a': 'Yes. URPASS supports exhibitor pass scanning permissions, allowing booth managers to scan visitor QR passes to capture consent-based delegate contact details.'}
    ],
    '/trade-show-registration-software': [
        {'q': 'Can we categorize trade show passes into VIP, Buyer, Press, and Exhibitor tiers?', 'a': 'Yes. You can define distinct badge categories with customized branding, access privileges, and different entry gate allowances.'},
        {'q': 'What happens if trade show Wi-Fi drops during morning peak hours?', 'a': 'URPASS browser scanners cache attendee cryptographic signatures locally, allowing door staff to validate passes offline without delay and sync updates once connection returns.'}
    ],
    '/festival-registration-software': [
        {'q': 'Does URPASS support wristband exchange stations?', 'a': 'Yes. Box office staff can scan the attendee\'s digital QR ticket at the gate to mark their ticket as redeemed before issuing an official festival wristband.'},
        {'q': 'Can volunteers scan tickets in low-light festival environments?', 'a': 'Yes. The browser scanner includes a built-in torch/flashlight toggle button to illuminate paper tickets or dimly lit phone screens in outdoor evening conditions.'}
    ],
    '/alumni-event-registration': [
        {'q': 'Can we capture graduation year and department during alumni registration?', 'a': 'Yes. Custom form fields can be configured to collect graduation year, degree program, current employer, and reunion table seating preferences.'},
        {'q': 'Can alumni pay for dinner tickets or partner passes during registration?', 'a': 'Yes. Paid ticket tiers allow alumni to purchase single admission, couple passes, or sponsor packages with direct online payment processing.'}
    ],
    '/startup-event-registration': [
        {'q': 'Can we review pitch competition applicants before issuing entry passes?', 'a': 'Yes. Organizer approval workflows let you screen applications, review founder pitch decks, and send QR passes only to vetted founders and investors.'},
        {'q': 'Can we segment attendee passes for Founders, VCs, and General Attendees?', 'a': 'Yes. Different ticket tiers carry color-coded digital badges so your greeting staff can immediately identify VIP investors and founders at check-in.'}
    ],
    '/networking-event-registration': [
        {'q': 'Does URPASS support instant badge printing at the venue?', 'a': 'Yes. Check-in events trigger instant webhook notifications that can integrate with on-site label printers to generate printed name tags upon QR scan.'},
        {'q': 'Can organizers send follow-up announcements to verified attendees?', 'a': 'Yes. Organizers can filter the attendee list by "Checked In" status and send follow-up emails, resource links, and feedback surveys exclusively to attendees who showed up.'}
    ],
    '/training-event-registration-software': [
        {'q': 'Can corporate training departments track mandatory employee session attendance?', 'a': 'Yes. URPASS logs precise check-in timestamps, giving HR and compliance teams auditable proof of attendance for regulatory training.'},
        {'q': 'Can we restrict training registrations to corporate email domains?', 'a': 'Yes. Domain validation rules can be applied to ensure only employees with authorized company email addresses (@company.com) can register.'}
    ],
    '/employee-event-registration': [
        {'q': 'Can employees register their plus-ones or family members for company retreats?', 'a': 'Yes. Organizers can allow multi-seat registrations or create dependent ticket tiers to capture family member details and dietary preferences.'},
        {'q': 'Is employee data kept private and confidential?', 'a': 'Yes. URPASS enforces strict role-based access control, data encryption in transit and at rest, and zero third-party data sharing or retargeting ads.'}
    ],
    '/google-forms-event-registration-alternative': [
        {'q': 'Can I migrate my existing Google Sheets attendee list into URPASS?', 'a': 'Yes. You can export your Google Sheet as a CSV and import it into URPASS in seconds to instantly issue secure digital QR passes to your entire list.'},
        {'q': 'How does URPASS compare to Google Forms in preventing ticket fraud?', 'a': 'Google Forms only collects text responses with no ticket generation or scanning. URPASS generates cryptographically signed QR codes and immediately alerts entrance staff if a ticket is presented twice.'}
    ],
    '/zoho-backstage-alternative': [
        {'q': 'How does URPASS pricing compare to Zoho Backstage subscriptions?', 'a': 'Zoho Backstage requires monthly or annual software subscriptions plus per-event fees. URPASS offers zero platform commission, direct payment gateway payouts, and pay-as-you-grow transparency.'},
        {'q': 'Is URPASS easier to set up than Zoho Backstage?', 'a': 'Yes. While Zoho Backstage has complex multi-module configuration steps, URPASS allows organizers to create a complete registration and ticketing page in under 3 minutes.'}
    ],
    '/event-registration-with-qr-code': [
        {'q': 'Can attendees take a screenshot of their QR code and use it?', 'a': 'Yes. Screenshots can be scanned, but once the first attendee enters, any duplicate screenshot scan will be rejected instantly as "Already Checked In".'},
        {'q': 'Can I resend a lost QR code pass to an attendee?', 'a': 'Yes. Organizers can resend digital passes via email or copy the direct pass URL from the dashboard with a single click.'}
    ],
    '/qr-code-attendance-system-for-events': [
        {'q': 'Does the attendance system work for multi-session conferences?', 'a': 'Yes. You can track attendance per track, workshop room, or keynote hall to understand room utilization and attendee movement.'},
        {'q': 'How quickly can an attendee be scanned and verified?', 'a': 'URPASS camera scanning verifies valid passes in under 300 milliseconds (<0.3 seconds), preventing bottleneck queues at entrances.'}
    ],
    '/event-entry-management-software': [
        {'q': 'What happens if an attendee shows an unapproved or cancelled ticket?', 'a': 'The scanner screen turns red with a prominent warning message showing the cancellation status and timestamp, preventing unauthorized entry.'},
        {'q': 'Can entrance staff see attendee notes during check-in?', 'a': 'Yes. Dietary restrictions, VIP status, or outstanding payment balances display directly on the scanning screen upon QR verification.'}
    ],
    '/multi-gate-event-check-in': [
        {'q': 'How do multiple scanners stay in sync across different venue gates?', 'a': 'Scanners communicate via real-time WebSocket connections. When Gate 1 scans a pass, Gate 2 and Gate 3 receive the check-in event in under 100ms.'},
        {'q': 'What if one gate loses cellular internet connection?', 'a': 'The gate falls back to local IndexedDB storage to continue scanning, queueing check-ins and synchronizing immediately once connectivity is restored.'}
    ],
    '/event-check-in-app': [
        {'q': 'Does the check-in app require downloading from the App Store or Google Play?', 'a': 'No. It is a Progressive Web App (PWA) that runs instantly in Safari, Chrome, or any mobile browser, saving volunteers from downloading large apps.'},
        {'q': 'Does the check-in app drain phone battery quickly?', 'a': 'No. The scanning engine is optimized for low CPU and GPU usage with smart camera sleep intervals between attendees.'}
    ],
    '/digital-event-pass-generator': [
        {'q': 'Can we customize the digital pass design with our event branding?', 'a': 'Yes. You can upload custom logos, set brand colors, display venue maps, and configure personalized attendee fields on every digital pass.'},
        {'q': 'Does the pass work on lock screens or mobile wallets?', 'a': 'Yes. Attendees can bookmark their pass URL, save it to their home screen, or take an offline screenshot for instant entry.'}
    ],
    '/online-ticket-generator-for-events': [
        {'q': 'Can we generate unique serial numbers and barcodes alongside QR codes?', 'a': 'Yes. Each ticket features a human-readable 6-character alphanumeric code alongside the dynamic 2D QR code for manual lookup if needed.'},
        {'q': 'Can we generate complimentary or sponsor tickets in bulk?', 'a': 'Yes. Organizers can generate and email batches of complimentary VIP or guest passes directly from the dashboard without processing payment.'}
    ],
    '/event-qr-code-generator': [
        {'q': 'How does a dynamic event QR code differ from a static QR code?', 'a': 'Static QR codes just store fixed text or URLs. URPASS dynamic event QR codes connect to live ticket states in the database, updating from "Valid" to "Used" upon scan.'},
        {'q': 'Can the QR code be scanned from both printed paper and mobile screens?', 'a': 'Yes. High-contrast QR encoding ensures instant camera detection whether printed on A4 paper, PVC badges, or displayed on smartphones.'}
    ],
    '/event-attendance-tracking-software': [
        {'q': 'Can I export attendance data to Excel or CSV?', 'a': 'Yes. You can export complete attendance reports including registration data, check-in timestamps, and gate numbers with a single click.'},
        {'q': 'Can I view live check-in percentage charts during the event?', 'a': 'Yes. The organizer dashboard displays real-time attendance velocity, percentage of checked-in delegates, and peak entry hours.'}
    ],
    '/event-registration-form-builder': [
        {'q': 'Can I add conditional logic or dropdown fields to the registration form?', 'a': 'Yes. Add text fields, dropdown selectors, checkboxes, file uploads, and conditional questions tailored to your event requirements.'},
        {'q': 'Can I embed the registration form on my own WordPress or Webflow website?', 'a': 'Yes. You can embed the registration widget via a lightweight iframe snippet or link directly to your custom-branded event URL.'}
    ],
    '/paid-event-registration-software': [
        {'q': 'What payment gateways are supported for paid event registrations?', 'a': 'URPASS supports direct integration with Stripe and Razorpay, allowing organizers to accept credit cards, debit cards, UPI, and net banking worldwide.'},
        {'q': 'Does URPASS withhold ticket funds or delay payouts?', 'a': 'No. Ticket payments go directly into your connected Stripe or Razorpay account with zero intermediary holding or payout delays.'}
    ],
    '/free-event-ticketing-software': [
        {'q': 'Are there hidden fees for free event tickets on URPASS?', 'a': 'No. URPASS is 100% free for free events. No credit card required, no per-ticket fees, and no attendee limits on free tiers.'},
        {'q': 'Can I approve or reject free registrations before tickets are sent?', 'a': 'Yes. You can enable "Require Approval" mode so only vetted applicants receive a valid QR entry pass.'}
    ],
    '/zero-commission-event-ticketing': [
        {'q': 'How can URPASS offer zero platform commission?', 'a': 'URPASS operates on transparent SaaS subscription plans or optional organizer upgrades, never taking a percentage cut from your ticket sales.'},
        {'q': 'Do attendees pay booking fees or convenience charges on checkout?', 'a': 'No. Organizers can choose to absorb standard payment gateway fees (e.g., Stripe/Razorpay) so attendees pay exactly the face value of the ticket.'}
    ],
    '/event-ticketing-with-razorpay': [
        {'q': 'Does Razorpay ticketing support instant UPI payments and Google Pay?', 'a': 'Yes. Attendees can pay instantly via UPI apps (Google Pay, PhonePe, Paytm, CRED), credit/debit cards, and net banking.'},
        {'q': 'Do organizers need an active Razorpay merchant account?', 'a': 'Yes. You connect your own Razorpay Key ID and Secret in settings, ensuring 100% of event proceeds settle directly into your business bank account.'}
    ],
    '/event-ticketing-with-whatsapp': [
        {'q': 'How are event passes delivered via WhatsApp?', 'a': 'Once an attendee completes registration or payment, an automated message with their direct digital QR pass link is sent to their WhatsApp number.'},
        {'q': 'Can attendees open their QR ticket directly from WhatsApp?', 'a': 'Yes. Clicking the link in WhatsApp opens their mobile-optimized digital pass in their phone browser without requiring login or password entry.'}
    ]
}

def get_component_name(url):
    cleaned = re.sub(r'[^a-zA-Z0-9]', ' ', url)
    words = cleaned.split()
    return ''.join(w.capitalize() for w in words) + 'Page'

def generate_page(p, repo_root):
    u = p['url']
    rel_path = ('app' + u + '/page.tsx') if u != '/' else 'app/page.tsx'
    target_file = os.path.join(repo_root, rel_path)
    os.makedirs(os.path.dirname(target_file), exist_ok=True)

    # Merge extra FAQs if any
    faqs = list(p.get('faqs', []))
    if u in EXTRA_FAQS:
        faqs.extend(EXTRA_FAQS[u])

    # Determine unique icons used in features
    used_icons = sorted(list(set(f['icon'] for f in p.get('features', []))))
    icon_imports = ', '.join(used_icons)

    # Component name
    comp_name = get_component_name(u)

    # Determine locale
    if u.startswith('/uk') or u == '/eventbrite-alternative-uk':
        locale = 'en_GB'
    elif u == '/eventbrite-alternative-india' or u == '/event-ticketing-with-razorpay':
        locale = 'en_IN'
    else:
        locale = 'en_US'

    # Build metadata
    title_og = p['title'] if 'URPASS' in p['title'] else f"{p['title']} | URPASS"
    
    geo = p.get('geo')
    geo_other = ""
    if geo:
        geo_pos_comma = geo['position'].replace(';', ', ')
        geo_other = f""",
  other: {{
    "geo.region": {json.dumps(geo['region'])},
    "geo.placename": {json.dumps(geo['placename'])},
    "geo.position": {json.dumps(geo['position'])},
    "ICBM": {json.dumps(geo_pos_comma)},
  }}"""

    # Build config dict
    config_dict = {
        'badge': p.get('badge', 'URPASS · EVENT TECH'),
        'h1': p.get('h1'),
        'canonicalUrl': f"https://urpass.space{u}",
        'description': p.get('metaDescription'),
        'ctaLabel': p.get('ctaLabel', 'Get Started Free →'),
        'ctaTitle': p.get('ctaTitle', 'Start Your Event With URPASS'),
        'ctaDescription': p.get('ctaDescription', 'Create your event registration page, issue instant QR passes, and scan attendees with sub-second camera check-in.'),
        'directAnswer': p.get('directAnswer'),
        'whatIs': p.get('whatIs'),
        'howItWorksTitle': p.get('howItWorksTitle'),
        'howItWorksSubtitle': p.get('howItWorksSubtitle'),
        'steps': p.get('steps'),
        'featuresTitle': p.get('featuresTitle'),
        'featuresSubtitle': p.get('featuresSubtitle'),
        'features': p.get('features'),
        'whoShouldUse': p.get('whoShouldUse'),
        'howQrCheckInWorks': p.get('howQrCheckInWorks'),
    }

    if p.get('keyFactsTable'):
        config_dict['keyFactsTable'] = p.get('keyFactsTable')
    if p.get('competitorComparison'):
        config_dict['competitorComparison'] = p.get('competitorComparison')
    
    config_dict['faqs'] = faqs
    config_dict['relatedLinks'] = p.get('relatedLinks', [])
    if geo:
        config_dict['geo'] = geo
    if p.get('isArticle'):
        config_dict['isArticle'] = True

    raw_json = json.dumps(config_dict, indent=2, ensure_ascii=False)
    # Replace `"icon": "IconName"` with `icon: IconName`
    cleaned_config = re.sub(r'\"icon\":\s*\"([A-Za-z0-9]+)\"', r'icon: \1', raw_json)

    content = f"""import type {{ Metadata }} from "next";
import {{ {icon_imports} }} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {{
  title: {json.dumps(p['title'])},
  description: {json.dumps(p['metaDescription'])},
  keywords: {json.dumps(p.get('keywords', []))},
  alternates: {{
    canonical: "https://urpass.space{u}",
  }},
  openGraph: {{
    title: {json.dumps(title_og)},
    description: {json.dumps(p['metaDescription'])},
    url: "https://urpass.space{u}",
    locale: "{locale}",
    type: "website",
  }}{geo_other},
}};

export default function {comp_name}() {{
  return (
    <SEOPage
      config={{{cleaned_config}}}
    />
  );
}}
"""

    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Generated {u} -> {rel_path} (FAQs: {len(faqs)})")

def update_sitemap(all_urls, repo_root):
    sitemap_path = os.path.join(repo_root, "app/sitemap.ts")
    with open(sitemap_path, "r", encoding="utf-8") as f:
        sitemap_code = f.read()

    # Create batch50Pages array code
    formatted_urls = ",\n    ".join([f'"{u}"' for u in all_urls])
    batch50_block = f"""  const batch50Pages = [
    {formatted_urls},
  ].map((path) => ({{ url: `${{BASE}}${{path}}`, priority: 0.95, changeFrequency: "daily" as const }}));
"""

    if "const batch50Pages =" in sitemap_code:
        # Replace existing block
        sitemap_code = re.sub(r'  const batch50Pages = \[[\s\S]*?\].map\([\s\S]*?\);\n', batch50_block, sitemap_code)
    else:
        # Insert before rawStaticEntries
        target_marker = "  const rawStaticEntries = ["
        if target_marker in sitemap_code:
            sitemap_code = sitemap_code.replace(target_marker, f"{batch50_block}\n{target_marker}\n    ...batch50Pages,")
        else:
            print("ERROR: could not find rawStaticEntries in app/sitemap.ts")
            return

    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(sitemap_code)
    print("Updated app/sitemap.ts with batch50Pages!")

def main():
    repo_root = os.path.abspath(os.path.join(script_dir, ".."))
    all_pages = (
        data_uk_pages.UK_PAGES +
        data_vertical_pages.VERTICAL_PAGES +
        data_comparison_pages.COMPARISON_PAGES +
        data_feature_pages.FEATURE_PAGES
    )

    print(f"Starting batch generation of {len(all_pages)} pages...")
    all_urls = []
    for i, p in enumerate(all_pages, 1):
        u = p['url']
        all_urls.append(u)
        generate_page(p, repo_root)

    print(f"\nAll {len(all_pages)} pages written successfully!")
    print("\nUpdating app/sitemap.ts...")
    update_sitemap(all_urls, repo_root)
    print("\nBatch generation complete!")

if __name__ == "__main__":
    main()
