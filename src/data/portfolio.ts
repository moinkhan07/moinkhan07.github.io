export const profile = {
  name: "Moin Khan",
  title: "Full-Stack Web & Mobile App Developer",
  email: "moin6k@gmail.com",
  phone: "+91 9082846069",
  location: "Mumbai, India",
  github: "https://github.com/moinkhan07",
  linkedin: "https://www.linkedin.com/in/moinkhan07/",
  whatsapp: "https://wa.me/+919082846069",
  bio: "I design and engineer production-grade web platforms and mobile apps end-to-end — from pixel-perfect interfaces to scalable APIs, payments, and AI integrations.",
};

export const experience = [
  {
    role: "Software Developer",
    company: "Webtrixz",
    location: "Mumbai, Andheri West (Onsite)",
    period: "Dec 2025 – Present",
    points: [
      "Developing and maintaining web and mobile applications using React Native, Next.js, Node.js, and MongoDB.",
      "Building scalable REST APIs and backend services for business applications.",
      "Creating responsive, high-performance web interfaces and cross-platform mobile apps.",
      "Collaborating on full-stack development, feature implementation, and application optimization.",
    ],
  },
  {
    role: "Senior Software Developer",
    company: "Global Web Technology",
    location: "Bangalore (WFH)",
    period: "Oct 2024 – Dec 2025",
    points: [
      "Built and optimized mobile apps and websites for better speed, UX, and overall performance.",
      "Improved UI/UX designs to increase user engagement and retention.",
      "Integrated React.js and Node.js for scalable web interfaces.",
    ],
  },
  {
    role: "Junior Software Developer (Internship)",
    company: "Dhawks",
    location: "Mumbai (Onsite)",
    period: "Jul 2024 – Sep 2024",
    points: [
      "Enhanced company website using Next.js with improved UI/UX and performance.",
      "Optimized responsiveness, component structure, and page speed.",
      "Built a complete Computer Management System for shop operations.",
    ],
  },
];

export type Project = {
  title: string;
  tagline: string;
  description: string;
  period?: string;
  stack: string[];
  links: { label: string; url: string; primary?: boolean }[];
  highlights: string[];
  accent: string; // tailwind gradient classes
  category: "Flagship" | "Mobile" | "Web" | "Clone";
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Cash In Phone",
    tagline: "Cashify-like ecosystem — Web, Mobile & Admin",
    description:
      "A complete resale ecosystem with customer app, admin website and vendor app — including pricing engine, repair workflow, vendor operations, dashboards and real-time order tracking.",
    period: "Aug 2025 – Dec 2025",
    stack: ["React Native", "Next.js", "Node.js", "Express", "MySQL"],
    links: [
      { label: "Live Website", url: "https://cashinphone.com/", primary: true },
      {
        label: "Play Store",
        url: "https://play.google.com/store/apps/details?id=com.cashinphone",
      },
    ],
    highlights: [
      "Built full backend: pricing engine, repair workflow, vendor ops",
      "3 connected products: customer app, admin web, vendor app",
      "Order tracking, auth, dashboards & responsive UI",
    ],
    accent: "from-amber-400 via-orange-500 to-rose-500",
    category: "Flagship",
  },
  {
    title: "Smart Resume Pro",
    tagline: "AI Resume Analysis Platform",
    description:
      "An AI-powered resume platform with 3 apps — main platform, admin panel and college panel — using OpenAI for ATS scoring, keyword analysis, grammar and actionable suggestions.",
    period: "Jun 2025 – Aug 2025",
    stack: ["Next.js", "Node.js", "MySQL", "OpenAI API"],
    links: [
      { label: "Live Website", url: "https://smartresume.pro/", primary: true },
    ],
    highlights: [
      "OpenAI API: ATS score, keywords, grammar, suggestions",
      "Role-based access, analytics, student onboarding",
      "Built 3 connected dashboards from scratch",
    ],
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
    category: "Flagship",
  },
  {
    title: "C3 Fitness Science",
    tagline: "Gym Management System • 2000+ users",
    description:
      "A complete fitness ecosystem with User App, Trainer App and Admin Panel — slot booking, BMI tracking, diet & exercise plans, notifications and reports.",
    period: "Apr 2025 – Jun 2025",
    stack: ["React Native", "Node.js", "Express", "MySQL"],
    links: [
      {
        label: "iOS App",
        url: "https://apps.apple.com/in/app/c3-fitness-science/id6743337876",
        primary: true,
      },
      {
        label: "Android App",
        url: "https://play.google.com/store/apps/details?id=com.c3fitness",
      },
    ],
    highlights: [
      "User App: slot booking, BMI, diet/exercise plans",
      "Trainer App: schedule, assigned clients, tracking",
      "Admin Panel: users, plans, slots & reports",
    ],
    accent: "from-emerald-400 via-teal-500 to-cyan-500",
    category: "Mobile",
  },
  {
    title: "Studyified",
    tagline: "School Management System",
    description:
      "An all-in-one school management portal — grades, attendance, fees and teacher messages in a single signed-in space for parents and students.",
    stack: ["Next.js", "Node.js", "MySQL"],
    links: [
      {
        label: "Live Website",
        url: "https://app.studyified.com/",
        primary: true,
      },
    ],
    highlights: [
      "Live attendance and grades for parents",
      "Direct messaging with teachers",
      "Fee receipts and reminders",
    ],
    accent: "from-blue-500 via-indigo-500 to-violet-500",
    category: "Web",
  },
  {
    title: "Studio Refuel",
    tagline: "Fitness Studio Booking App",
    description:
      "A native Android booking experience for a premium fitness studio — class schedules, member profile and seamless reservations.",
    stack: ["React Native", "Node.js", "MySQL"],
    links: [
      {
        label: "Play Store",
        url: "https://play.google.com/store/apps/details?id=org.studiorefuel",
        primary: true,
      },
    ],
    highlights: [
      "Native-feel mobile UX",
      "Real-time class availability",
      "Member-first booking flow",
    ],
    accent: "from-rose-500 via-pink-500 to-fuchsia-500",
    category: "Mobile",
  },
  {
    title: "MarkDeals",
    tagline: "E-commerce platform",
    description:
      "A full-stack e-commerce website built solo — product catalog, cart, auth and order management.",
    stack: ["Spring Boot", "Java", "MySQL", "JPA", "Hibernate"],
    links: [
      { label: "Live", url: "https://markdeals.netlify.app/", primary: true },
      { label: "Code", url: "https://github.com/moinkhan07/MarkDeals" },
    ],
    highlights: [
      "Solo build in 28 days",
      "Spring Data JPA + Hibernate backend",
      "Vanilla JS frontend",
    ],
    accent: "from-amber-500 via-orange-500 to-red-500",
    category: "Web",
  },
  {
    title: "Go 4 Food",
    tagline: "Online Food Delivery REST API",
    description:
      "A clean REST API for an online food-delivery application with order, restaurant and user flows.",
    stack: ["Spring Boot", "Java", "MySQL", "JPA"],
    links: [
      {
        label: "Demo Video",
        url: "https://drive.google.com/file/d/1F0wMp7ld0vTYAdj5o3Q26754K90rmxgg/view",
        primary: true,
      },
      {
        label: "Code",
        url: "https://github.com/moinkhan07/Online-Food-Delivery-App",
      },
    ],
    highlights: [
      "RESTful architecture",
      "5-day sprint build",
      "Spring Data JPA persistence",
    ],
    accent: "from-lime-400 via-green-500 to-emerald-500",
    category: "Web",
  },
  {
    title: "Mytheresa Clone",
    tagline: "Luxury e-commerce clone",
    description:
      "Team clone of mytheresa.com — implemented navbar and footer in a team of 7 developers.",
    stack: ["HTML", "CSS", "JavaScript"],
    links: [
      {
        label: "Live",
        url: "https://sunny-bubblegum-120988.netlify.app/",
        primary: true,
      },
      {
        label: "Code",
        url: "https://github.com/Mozakir178/Mytheresa.com-Clone",
      },
    ],
    highlights: ["Team of 7 devs", "Pixel-accurate UI", "5-day sprint"],
    accent: "from-slate-400 via-gray-500 to-zinc-500",
    category: "Clone",
  },
  {
    title: "Lumen5 Clone",
    tagline: "Video creation platform clone",
    description:
      "Team-lead role on a clone of lumen5.com — managed git, team and built the pricing page.",
    stack: ["HTML", "CSS", "JavaScript"],
    links: [
      {
        label: "Live",
        url: "https://lumen5project2.netlify.app/",
        primary: true,
      },
      { label: "Code", url: "https://github.com/moinkhan07/Lumen5.com-clone" },
    ],
    highlights: [
      "Team Leader of 5 devs",
      "Managed git repository",
      "Built pricing page",
    ],
    accent: "from-sky-400 via-blue-500 to-indigo-500",
    category: "Clone",
  },
];

export const skills = {
  Languages: ["Java", "JavaScript", "TypeScript", "Python", "PHP"],
  "Frontend & Mobile": [
    "React.js",
    "Next.js",
    "React Native",
    "Tailwind CSS",
    "HTML",
    "CSS",
  ],
  "Backend & APIs": [
    "Node.js",
    "Express",
    "Spring Boot",
    "Hibernate",
    "REST APIs",
  ],
  "Databases & Cloud": ["MySQL", "MongoDB", "AWS", "Railway"],
  Tools: ["VS Code", "Postman", "Git", "GitHub", "STS", "Eclipse"],
};

export const stats = [
  { value: "5+", label: "Years Building" },
  { value: "15+", label: "Production Projects" },
  { value: "200+", label: "Users Served" },
  { value: "3", label: "Apps on Stores" },
];

export const education = [
  {
    title: "Bachelor of Computer Application",
    org: "Chandigarh University",
    period: "Jul 2021 – Jun 2024",
    location: "Mohali, Punjab",
  },
  {
    title: "Higher Secondary (12th)",
    org: "Rizvi College of Arts, Science & Commerce",
    period: "Jul 2019 – Apr 2021",
    location: "Mumbai",
  },
  {
    title: "High School",
    org: "Shree Mumbadevi Vidya Mandir",
    period: "Jun 2018 – Mar 2019",
    location: "Mumbai",
  },
];

export const certificates = [
  "JavaScript (Intermediate) — HackerRank",
  "SQL (Basic) — HackerRank",
  "React (Basic) — HackerRank",
  "Problem Solving (Basic) — HackerRank",
];
