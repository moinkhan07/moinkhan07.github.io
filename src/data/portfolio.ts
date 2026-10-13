/* ------------------------------------------------------------------
 * Single source of truth for every word on the site.
 * Edit here — the train, HUD, sections and SEO metadata all read from it.
 * ------------------------------------------------------------------ */

export const profile = {
  name: "Moin Khan",
  first: "Moin",
  last: "Khan",
  title: "Full-Stack Web & Mobile App Developer",
  roles: [
    "Full-Stack Engineer",
    "React & Next.js Specialist",
    "React Native Developer",
    "Node.js API Builder",
  ],
  email: "moin6k@gmail.com",
  phone: "+91 9082846069",
  phoneHref: "tel:+919082846069",
  location: "Mumbai, India",
  timezone: "Asia/Kolkata",
  github: "https://github.com/moinkhan07",
  linkedin: "https://www.linkedin.com/in/moinkhan07/",
  whatsapp: "https://wa.me/919082846069",
  site: "https://moinkhan07.github.io",
  bio: "I design and engineer production-grade web platforms and mobile apps end-to-end — from pixel-perfect interfaces to scalable APIs, payments and AI integrations.",
};

/** One entry per coach. Order = order on the page = order on the train. */
export const stations = [
  { id: "departure", no: "01", short: "Hero", name: "Departure", color: "#ffb23f" },
  { id: "about", no: "02", short: "About", name: "The Driver", color: "#ff7a59" },
  { id: "skills", no: "03", short: "Skills", name: "Cargo Manifest", color: "#4fd1a5" },
  { id: "projects", no: "04", short: "Work", name: "Window Seat", color: "#5ab4ff" },
  { id: "experience", no: "05", short: "Career", name: "Route Map", color: "#b69cff" },
  { id: "playground", no: "06", short: "Lab", name: "Observation Car", color: "#ff6fa8" },
  { id: "contact", no: "07", short: "Contact", name: "Terminus", color: "#f5d06f" },
] as const;

export type StationId = (typeof stations)[number]["id"];

export const stats = [
  { value: 5, suffix: "+", label: "Years building" },
  { value: 15, suffix: "+", label: "Production projects" },
  { value: 3, suffix: "", label: "Apps on the stores" },
  { value: 200, suffix: "+", label: "Users served" },
];

/** Skills board — the "cargo manifest". */
export const skillGroups = [
  {
    code: "FE",
    name: "Frontend",
    platform: "P1",
    status: "On time",
    items: ["React.js", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    code: "MB",
    name: "Mobile",
    platform: "P2",
    status: "Boarding",
    items: ["React Native", "Expo"],
  },
  {
    code: "BE",
    name: "Backend",
    platform: "P3",
    status: "On time",
    items: ["Node.js", "Express.js", "REST APIs", "API Deployment"],
  },
  {
    code: "DB",
    name: "Databases",
    platform: "P4",
    status: "On time",
    items: ["MongoDB", "MySQL"],
  },
  {
    code: "CL",
    name: "Cloud & CI",
    platform: "P5",
    status: "Express",
    items: ["Firebase", "AWS", "GitHub Actions"],
  },
];

export type PreviewKind = "erp" | "spaces" | "commerce" | "crm" | "services";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  links: { label: string; url: string }[];
  preview: PreviewKind;
  color: string;
};

/**
 * Featured projects.
 * NOTE: descriptions/stacks for SearchSpaces, LekhaLooms, Webtrixz CRM and
 * Ontime were written from project briefs — review the wording and add live
 * links where you have them (links: [] simply hides the button).
 */
export const projects: Project[] = [
  {
    slug: "studyified",
    title: "Studyified",
    kind: "School ERP System",
    tagline: "The whole school, in one signed-in space.",
    description:
      "An all-in-one school management platform — attendance, grades, fees, timetables and teacher-parent messaging — with dedicated views for admins, teachers, parents and students.",
    highlights: ["Live attendance & grades for parents", "Fee receipts & automated reminders", "Direct teacher messaging"],
    stack: ["Next.js", "Node.js", "Express.js", "MySQL"],
    links: [{ label: "Visit live app", url: "https://app.studyified.com/" }],
    preview: "erp",
    color: "#5ab4ff",
  },
  {
    slug: "searchspaces",
    title: "SearchSpaces",
    kind: "Coworking Space Platform",
    tagline: "Find a desk anywhere in Mumbai — compare, shortlist, enquire.",
    description:
      "A commercial office-space discovery platform covering coworking, managed offices, meeting rooms and leasing across Mumbai’s key business districts, with brand hubs, building hubs and side-by-side comparison.",
    highlights: ["City, brand & building hub pages", "Filterable listings with comparison", "Lead capture & enquiry flows"],
    stack: ["React.js", "TypeScript", "Node.js", "Tailwind CSS"],
    links: [],
    preview: "spaces",
    color: "#4fd1a5",
  },
  {
    slug: "lekhalooms",
    title: "LekhaLooms",
    kind: "E-commerce Website & Mobile App",
    tagline: "A handloom store on the web and in your pocket.",
    description:
      "A full e-commerce experience for a textile brand — a storefront website and a companion mobile app sharing one backend for catalogue, cart, checkout, payments and order tracking.",
    highlights: ["Shared API for web & app", "Catalogue, cart & secure checkout", "Order tracking & admin tools"],
    stack: ["Next.js", "React Native", "Node.js", "MongoDB"],
    links: [],
    preview: "commerce",
    color: "#ff7a59",
  },
  {
    slug: "webtrixz-crm",
    title: "Webtrixz CRM",
    kind: "Internal Client Management",
    tagline: "Every client, document and deal — one pipeline.",
    description:
      "An internal CRM for a digital agency: client records, KYC document management, a deal pipeline and bulk Excel import/export, with role-based access for the team.",
    highlights: ["Client CRUD with KYC documents", "Excel import / export", "Paginated, searchable records"],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    links: [],
    preview: "crm",
    color: "#b69cff",
  },
  {
    slug: "ontime",
    title: "Ontime",
    kind: "Government Services Marketplace",
    tagline: "Government paperwork, booked like a cab.",
    description:
      "A marketplace that connects citizens with verified agents for government services — browse services, book a slot, upload documents and track every application step in real time.",
    highlights: ["Service catalogue & slot booking", "Document upload & verification", "Live application tracking"],
    stack: ["React Native", "Next.js", "Node.js", "MongoDB"],
    links: [],
    preview: "services",
    color: "#ff6fa8",
  },
];

/** Earlier shipped work — shown as a compact ticket rail under the featured window. */
export const alsoShipped = [
  { title: "Cash In Phone", note: "Resale ecosystem · web, app & admin", url: "https://cashinphone.com/" },
  { title: "Smart Resume Pro", note: "AI resume analysis · OpenAI", url: "https://smartresume.pro/" },
  { title: "C3 Fitness Science", note: "Gym app · 2000+ users", url: "https://apps.apple.com/in/app/c3-fitness-science/id6743337876" },
  { title: "Studio Refuel", note: "Studio booking app", url: "https://play.google.com/store/apps/details?id=org.studiorefuel" },
  { title: "MarkDeals", note: "E-commerce · Spring Boot", url: "https://markdeals.netlify.app/" },
];

/** Route map — oldest first, so the journey moves forward in time. */
export const journey = [
  {
    kind: "origin",
    title: "Bachelor of Computer Applications",
    org: "Chandigarh University",
    place: "Mohali, Punjab",
    period: "Jul 2021 — Jun 2024",
    points: ["Foundations in data structures, databases and software engineering.", "Certified by HackerRank in JavaScript, React, SQL and Problem Solving."],
    tech: ["Java", "JavaScript", "SQL"],
  },
  {
    kind: "work",
    title: "Junior Software Developer (Internship)",
    org: "Dhawks",
    place: "Mumbai · Onsite",
    period: "Jul 2024 — Sep 2024",
    points: [
      "Enhanced the company website with Next.js — better UI/UX and performance.",
      "Optimised responsiveness, component structure and page speed.",
      "Built a complete Computer Management System for shop operations.",
    ],
    tech: ["Next.js", "React.js", "Node.js"],
  },
  {
    kind: "work",
    title: "Senior Software Developer",
    org: "Global Web Technology",
    place: "Bangalore · Remote",
    period: "Oct 2024 — Dec 2025",
    points: [
      "Built and optimised mobile apps and websites for speed, UX and performance.",
      "Improved UI/UX designs to lift engagement and retention.",
      "Integrated React.js and Node.js for scalable web interfaces.",
    ],
    tech: ["React Native", "React.js", "Node.js", "MySQL"],
  },
  {
    kind: "now",
    title: "Software Developer",
    org: "Webtrixz",
    place: "Mumbai, Andheri West · Onsite",
    period: "Dec 2025 — Present",
    points: [
      "Developing web and mobile applications with React Native, Next.js, Node.js and MongoDB.",
      "Building scalable REST APIs and backend services for business applications.",
      "Shipping responsive, high-performance interfaces and cross-platform apps.",
    ],
    tech: ["React Native", "Next.js", "Node.js", "MongoDB"],
  },
] as const;
