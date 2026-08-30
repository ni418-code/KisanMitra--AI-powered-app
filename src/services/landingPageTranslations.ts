import { LanguageCode } from './translations.ts';

export interface LandingPageTexts {
  // Mandi Ticker
  liveArrivalsBadge: string;
  agmarknetMspSource: string;

  // Nav Items
  navLiveMandi: string;
  navDirectBuyers: string;
  navLogistics: string;
  navHowItWorks: string;
  navAiSahayak: string;
  loginBtn: string;
  registerBtn: string;
  selectPortalSignIn: string;
  selectPortalRegister: string;
  farmerPortal: string;
  farmerPortalDesc: string;
  buyerPortal: string;
  buyerPortalDesc: string;
  topMenuFeatures: string;
  mobileMandiDesc: string;
  mobileBuyersDesc: string;
  mobileLogisticsDesc: string;
  mobileWorkflowDesc: string;
  mobileAiDesc: string;

  // Hero Section
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  farmerCta: string;
  buyerCta: string;
  heroQuote: string;

  // Architecture Bridge
  bridgeEyebrow: string;
  bridgeTitle: string;
  farmerCardTitle: string;
  farmerBullet1: string;
  farmerBullet2: string;
  farmerBullet3: string;
  openFarmerLogin: string;
  engineTitle: string;
  engineSubtitle: string;
  badgeBetterPrice: string;
  badgeVerifiedBuyer: string;
  badgeFastLogistics: string;
  badgeMilestoneEscrow: string;
  buyerCardTitle: string;
  buyerBullet1: string;
  buyerBullet2: string;
  buyerBullet3: string;
  openBuyerLogin: string;
  protectedTransactionLabel: string;
  flowSteps: string[];

  // Carousel
  carouselEyebrow: string;
  carouselTitle: string;
  startAsFarmer: string;
  startAsBuyer: string;
  carouselSlides: Array<{
    badge: string;
    overlayText: string;
    description: string;
  }>;

  // 3 Core Capabilities
  coreCapabilities: string;
  transformingAgriTitle: string;
  transformingAgriSubtitle: string;

  card1Title: string;
  card1Desc: string;
  card1Bullet1: string;
  card1Bullet2: string;
  card1Bullet3: string;

  card2Title: string;
  card2Desc: string;
  card2Bullet1: string;
  card2Bullet2: string;
  card2Bullet3: string;

  card3Title: string;
  card3Desc: string;
  card3Bullet1: string;
  card3Bullet2: string;
  card3Bullet3: string;

  // How It Works
  lifecycleEyebrow: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // AI Copilot Banner
  copilotEyebrow: string;
  copilotTitle: string;
  copilotDesc: string;
  askAiNow: string;

  // Footer
  footerLiveSource: string;
  footerMspSchedule: string;
  footerCopyright: string;

  // Auth Modal
  authFarmerTitle: string;
  authBuyerTitle: string;
  authFarmerSubtitle: string;
  authBuyerSubtitle: string;
  demoFarmerLabel: string;
  demoBuyerLabel: string;
  demoFarmerBtn: string;
  demoBuyerBtn: string;
  prefLangLabel: string;
  farmerNameLabel: string;
  buyerNameLabel: string;
  farmerNamePlaceholder: string;
  buyerNamePlaceholder: string;
  farmerMobileLabel: string;
  buyerMobileLabel: string;
  districtLabel: string;
  farmerVillageLabel: string;
  buyerVillageLabel: string;
  cropsGrownLabel: string;
  cropsNeededLabel: string;
  sendOtpFarmerBtn: string;
  sendOtpBuyerBtn: string;
  enterOtpTitle: string;
  editDetailsBtn: string;
  verifyOtpFarmerBtn: string;
  verifyOtpBuyerBtn: string;
}

export const LANDING_PAGE_TRANSLATIONS: Record<LanguageCode, LandingPageTexts> = {
  en: {
    liveArrivalsBadge: 'Live Mandi Arrivals',
    agmarknetMspSource: 'GoI AGMARKNET + CACP MSP',

    navLiveMandi: 'Live Mandi',
    navDirectBuyers: 'Direct Buyers',
    navLogistics: 'Logistics & Storage',
    navHowItWorks: 'How It Works',
    navAiSahayak: 'AI Sahayak',
    loginBtn: 'Sign In',
    registerBtn: 'Register',
    selectPortalSignIn: 'Select Portal to Sign In',
    selectPortalRegister: 'Select Portal to Register',
    farmerPortal: 'Farmer Portal',
    farmerPortalDesc: 'Mandi intelligence & MSP',
    buyerPortal: 'Buyer Portal',
    buyerPortalDesc: 'Direct procurement & contracts',
    topMenuFeatures: 'Top Menu & Features',
    mobileMandiDesc: 'Real-time modal rates & APMC feeds',
    mobileBuyersDesc: 'KYC-verified food processors & mills',
    mobileLogisticsDesc: 'Farm-gate transit and cold warehouses',
    mobileWorkflowDesc: '4-step transparent transaction lifecycle',
    mobileAiDesc: 'Multilingual regional advisory copilot',

    heroBadge: '• Agri-Market Intelligence Platform',
    heroHeadline: 'From Farm Gate to the Right Buyer.',
    heroSubheadline: 'Discover better prices, verified buyers, real-time market intelligence and reliable logistics — all in one platform.',
    farmerCta: '🌾 Farmer Portal Login / Register',
    buyerCta: '🏢 Buyer Portal Login / Register',
    heroQuote: '“Answers the fundamental question: Should I sell now, where should I sell, and to whom?”',

    bridgeEyebrow: 'Interactive Transaction Bridge',
    bridgeTitle: 'Unified Agricultural Commerce Flow',
    farmerCardTitle: '🌾 Farmer / FPO',
    farmerBullet1: 'Create Digital Lots with Grade A/B/C',
    farmerBullet2: 'Live Mandi & MSP Comparison',
    farmerBullet3: 'Net-in-Pocket Profit Calculator',
    openFarmerLogin: 'Open Farmer Portal',
    engineTitle: '🛡️ KisanMitra Engine',
    engineSubtitle: 'Smart Matching & Trust Layer',
    badgeBetterPrice: '📈 Better Price',
    badgeVerifiedBuyer: '✓ Verified Buyer',
    badgeFastLogistics: '🚚 Fast Logistics',
    badgeMilestoneEscrow: '🔒 Milestone Escrow',
    buyerCardTitle: '🏢 Buyer / Processor',
    buyerBullet1: 'Post Bulk Purchase Demands',
    buyerBullet2: 'Source Directly from 10,000+ Farmers',
    buyerBullet3: 'Quality-Verified Digital Handoff',
    openBuyerLogin: 'Open Buyer Portal',
    protectedTransactionLabel: '7-Stage Protected Transaction:',
    flowSteps: ['Lot Created', 'Smart Match', 'Bilateral Offer', 'Digital Agreement', 'Milestone Fund', 'Transport', 'Delivery'],

    carouselEyebrow: 'Field Visuals & Real Operations',
    carouselTitle: 'KisanMitra in Action Across Rural India',
    startAsFarmer: 'Start as Farmer →',
    startAsBuyer: 'Start as Buyer →',
    carouselSlides: [
      {
        badge: 'Mandi Price Intelligence',
        overlayText: 'Never sell below true market potential again.',
        description: 'Empowering farmers with instant modal rates across 1,200+ APMCs and direct comparison with national MSP benchmarks.',
      },
      {
        badge: 'Verified Direct Trade',
        overlayText: 'Connect directly with food processors & institutional buyers.',
        description: 'Eliminate unnecessary middlemen. Secure guaranteed contracts and higher net returns directly at the farm gate.',
      },
      {
        badge: 'End-to-End Fulfilment',
        overlayText: 'From field pickup to escrow-secured digital payments.',
        description: 'Book verified logistics, locate climate-controlled cold storage, and receive immediate payment upon verified delivery.',
      },
    ],

    coreCapabilities: 'Core Capabilities',
    transformingAgriTitle: 'Transforming Agricultural Trade in India',
    transformingAgriSubtitle: 'Designed specifically for the ground realities of Indian farmers, FPOs, and processing industries.',

    card1Title: '📈 Better Price Discovery',
    card1Desc: 'Compares local Mandi modal rates against national MSP benchmarks with automatic 7-day trend forecasts.',
    card1Bullet1: 'Real-time AGMARKNET integration',
    card1Bullet2: 'Net in-pocket calculator minus transit',
    card1Bullet3: 'Optimal sale-window recommendations',

    card2Title: '🤝 Direct Buyer Connection',
    card2Desc: 'Smart 6-factor matching engine evaluates crop variety, distance, volume, price, and reliability score.',
    card2Bullet1: '100% KYC & GSTIN verified buyers',
    card2Bullet2: 'Bilateral counter-offer negotiation',
    card2Bullet3: 'Direct WhatsApp / In-app messaging',

    card3Title: '🚚 End-to-End Fulfilment',
    card3Desc: 'Integrated logistics carriers and storage warehouses ensure your harvest is transported safely and payments release on delivery.',
    card3Bullet1: 'Digital agreement & e-contract',
    card3Bullet2: 'Milestone secured payment release',
    card3Bullet3: 'Nearby cold storage & warehouse search',

    lifecycleEyebrow: 'Transaction Lifecycle',
    howItWorksTitle: 'How KisanMitra Works',
    howItWorksSubtitle: 'From initial registration to physical produce delivery and payment disbursement.',
    step1Title: 'Register & Choose Language',
    step1Desc: 'OTP verified onboarding with full agricultural localization in Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, or English.',
    step2Title: 'Create Lot / Post Demand',
    step2Desc: 'Farmers specify crop grade, moisture, harvest date & price. Buyers post bulk procurement specifications.',
    step3Title: 'Smart Match & Negotiate',
    step3Desc: 'AI matching engine connects compatible lots. Exchange bilateral counter-offers in real time.',
    step4Title: 'Secured Transport & Pay',
    step4Desc: 'Sign digital agreement, fund milestone payment, assign transport carrier, and confirm receipt.',

    copilotEyebrow: 'Grounded AI Agricultural Copilot',
    copilotTitle: 'Try AI KisanMitra Sahayak',
    copilotDesc: 'Ask in your preferred language for real-time rates, nearby buyers, MSP details, and crop preservation guidance.',
    askAiNow: 'Ask AI Assistant Now →',

    footerLiveSource: 'Live Data Source: AGMARKNET',
    footerMspSchedule: 'CACP MSP Schedule 2024-25',
    footerCopyright: '© 2026 KisanMitra Platform. Built for Indian Agriculture.',

    authFarmerTitle: 'Farmer Portal',
    authBuyerTitle: 'Buyer Portal',
    authFarmerSubtitle: 'Direct Mandi intelligence, MSP and verified buyers',
    authBuyerSubtitle: 'Procure agricultural lots directly from verified farmers',
    demoFarmerLabel: '⚡ 1-Click Instant Demo Farmer Login:',
    demoBuyerLabel: '⚡ 1-Click Instant Demo Buyer Login:',
    demoFarmerBtn: '🌾 Demo Farmer (Ramesh Kumar - Guntur)',
    demoBuyerBtn: '🏢 Demo Buyer (Rajesh Agro Foods Ltd)',
    prefLangLabel: 'Preferred Language (భాషను ఎంచుకోండి / भाषा चुनें)',
    farmerNameLabel: 'Farmer / FPO Name',
    buyerNameLabel: 'Company / Processing Mill / Buyer Name',
    farmerNamePlaceholder: 'Enter farmer name',
    buyerNamePlaceholder: 'Enter company / buyer name',
    farmerMobileLabel: 'Farmer Mobile (+91)',
    buyerMobileLabel: 'Buyer Business Mobile (+91)',
    districtLabel: 'District',
    farmerVillageLabel: 'Village / Mandal',
    buyerVillageLabel: 'Processing Hub / Locality',
    cropsGrownLabel: 'Crops Cultivated',
    cropsNeededLabel: 'Crops Required for Procurement',
    sendOtpFarmerBtn: 'Send Farmer Verification OTP →',
    sendOtpBuyerBtn: 'Send Buyer Verification OTP →',
    enterOtpTitle: 'Enter 6-Digit OTP',
    editDetailsBtn: 'Edit Details',
    verifyOtpFarmerBtn: 'Verify OTP & Enter Farmer Portal',
    verifyOtpBuyerBtn: 'Verify OTP & Enter Buyer Portal',
  },

  te: {
    liveArrivalsBadge: 'తాజా మార్కెట్ ధరలు (Live Mandi)',
    agmarknetMspSource: 'భారత ప్రభుత్వ AGMARKNET + CACP MSP',

    navLiveMandi: 'లైవ్ మార్కెట్',
    navDirectBuyers: 'బయ్యర్లు & వ్యాపారులు',
    navLogistics: 'రవాణా & నిల్వ',
    navHowItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    navAiSahayak: 'AI సహాయక్',
    loginBtn: 'లాగిన్',
    registerBtn: 'నమోదు',
    selectPortalSignIn: 'ప్రవేశించడానికి పోర్టల్‌ను ఎంచుకోండి',
    selectPortalRegister: 'నమోదు చేసుకోవడానికి పోర్టల్‌ను ఎంచుకోండి',
    farmerPortal: 'రైతు పోర్టల్',
    farmerPortalDesc: 'మార్కెట్ ధరలు & ప్రభుత్వ MSP',
    buyerPortal: 'బయ్యర్ పోర్టల్',
    buyerPortalDesc: 'నేరుగా కొనుగోలు & కాంట్రాక్టులు',
    topMenuFeatures: 'ప్రధాన విభాగాలు & సేవలు',
    mobileMandiDesc: 'నిజ-సమయ మోడల్ ధరలు & APMC వివరాలు',
    mobileBuyersDesc: 'ధ్రువీకృత ఆహార ప్రాసెసర్లు & మిల్లర్లు',
    mobileLogisticsDesc: 'కళ్లం వద్దకే వాహనాలు & కోల్డ్ స్టోరేజ్',
    mobileWorkflowDesc: '4 దశల పూర్తి పారదర్శక వ్యాపారం',
    mobileAiDesc: 'సహజ భాషలో వ్యవసాయ సలహాదారు',

    heroBadge: '• వ్యవసాయ మార్కెట్ ఇంటెలిజెన్స్ వేదిక',
    heroHeadline: 'కళ్లం నుండి సరైన బయ్యర్ వరకు.',
    heroSubheadline: 'ఉత్తమ ధరలు, ధ్రువీకరించబడిన బయ్యర్లు, ప్రత్యక్ష మార్కెట్ ధరలు మరియు విశ్వసనీయ రవాణా — అన్నీ ఒకే వేదికపై.',
    farmerCta: '🌾 Farmer Portal ప్రవేశం / నమోదు',
    buyerCta: '🏢 Buyer Portal ప్రవేశం / నమోదు',
    heroQuote: '“కీలకమైన ప్రశ్నలకు సరైన సమాధానం: నేను ఇప్పుడు పంట అమ్మాలా, ఎక్కడ అమ్మాలి మరియు ఎవరికి అమ్మాలి?”',

    bridgeEyebrow: 'డిజిటల్ లావాదేవీల వారధి',
    bridgeTitle: 'రైతులు మరియు బయ్యర్ల ప్రత్యక్ష అనుసంధానం',
    farmerCardTitle: '🌾 రైతు / రైతు ఉత్పత్తిదారుల సంఘం (FPO)',
    farmerBullet1: 'A/B/C గ్రేడ్ నాణ్యతతో డిజిటల్ లాట్ నమోదు',
    farmerBullet2: 'ప్రత్యక్ష మార్కెట్ ధరలు & MSP పోలిక',
    farmerBullet3: 'రవాణా తీసివేసిన నికర లాభం కాలిక్యులేటర్',
    openFarmerLogin: 'Farmer Portal తెరవండి',
    engineTitle: '🛡️ కిసాన్ మిత్ర ఇంజిన్',
    engineSubtitle: 'స్మార్ట్ మ్యాచింగ్ & విశ్వసనీయ రక్షణ',
    badgeBetterPrice: '📈 మెరుగైన ధర',
    badgeVerifiedBuyer: '✓ ధ్రువీకృత బయ్యర్',
    badgeFastLogistics: '🚚 వేగవంతమైన రవాణా',
    badgeMilestoneEscrow: '🔒 సురక్షిత ఎస్క్రో పేమెంట్',
    buyerCardTitle: '🏢 బయ్యర్ / ప్రాసెసింగ్ మిల్లు',
    buyerBullet1: 'బల్క్ కొనుగోలు అవసరాల ప్రకటన',
    buyerBullet2: '10,000+ రైతుల నుండి నేరుగా కొనుగోలు',
    buyerBullet3: 'నాణ్యత ధ్రువీకరించిన డిజిటల్ హ్యాండ్‌ఓవర్',
    openBuyerLogin: 'Buyer Portal తెరవండి',
    protectedTransactionLabel: '7 దశల సురక్షిత లావాదేవీ:',
    flowSteps: ['లాట్ సృష్టి', 'స్మార్ట్ సరిపోలిక', 'ధర ప్రతిపాదన', 'డిజిటల్ ఒప్పందం', 'రక్షిత నిధి', 'రవాణా', 'డెలివరీ & చెల్లింపు'],

    carouselEyebrow: 'క్షేత్రస్థాయి దృశ్యాలు & వాస్తవ కార్యకలాపాలు',
    carouselTitle: 'గ్రామీణ భారతదేశంలో కిసాన్ మిత్ర ప్రస్థానం',
    startAsFarmer: 'రైతుగా ప్రారంభించండి →',
    startAsBuyer: 'బయ్యర్‌గా ప్రారంభించండి →',
    carouselSlides: [
      {
        badge: 'మార్కెట్ ధరల సమాచారం',
        overlayText: 'మార్కెట్ వాస్తవ విలువ కంటే తక్కువ ధరకు ఎప్పుడూ అమ్మకండి.',
        description: '1,200 కంటే ఎక్కువ APMCల మోడల్ ధరలు మరియు జాతీయ మద్దతు ధర (MSP) పోలికతో రైతులకు పూర్తి సాధికారత.',
      },
      {
        badge: 'ధ్రువీకృత ప్రత్యక్ష వ్యాపారం',
        overlayText: 'ఆహార ప్రాసెసర్లు మరియు వ్యాపారులతో నేరుగా కనెక్ట్ అవ్వండి.',
        description: 'మధ్యవర్తులను తొలగించండి. కళ్లం వద్దే గ్యారెంటీ కాంట్రాక్టులు మరియు అధిక నికర ఆదాయాన్ని పొందండి.',
      },
      {
        badge: 'పూర్తి సురక్షిత రవాణా & చెల్లింపు',
        overlayText: 'కళ్లం నుండి పంట రవాణా మొదలుకొని సురక్షిత డిజిటల్ చెల్లింపుల వరకు.',
        description: 'ధ్రువీకరించిన వాహనాలను బుక్ చేయండి, కోల్డ్ స్టోరేజీలను గుర్తించండి, పంట చేరిన వెంటనే నేరుగా ఖాతాలో డబ్బు పొందండి.',
      },
    ],

    coreCapabilities: 'ప్రధాన సేవలు',
    transformingAgriTitle: 'భారతీయ వ్యవసాయ వాణిజ్యంలో నూతన విప్లవం',
    transformingAgriSubtitle: 'భారతీయ రైతులు, FPOలు మరియు ప్రాసెసింగ్ పరిశ్రమల వాస్తవ అవసరాల కోసం ప్రత్యేకంగా రూపొందించబడింది.',

    card1Title: '📈 మెరుగైన ధర గుర్తింపు',
    card1Desc: 'స్థానిక మార్కెట్ మోడల్ ధరలను జాతీయ MSPతో పోల్చి, రాబోయే 7 రోజుల ధరల అంచనాలను అందిస్తుంది.',
    card1Bullet1: 'రియల్-టైమ్ AGMARKNET సమాచారం',
    card1Bullet2: 'రవాణా ఖర్చు తీసివేసిన నికర రాబడి లెక్కింపు',
    card1Bullet3: 'ఉత్తమ అమ్మకపు సమయం సలహాలు',

    card2Title: '🤝 ధ్రువీకృత బయ్యర్లు',
    card2Desc: 'పంట రకం, దూరం, పరిమాణం, ధర మరియు విశ్వసనీయత స్కోర్‌ను విశ్లేషించే స్మార్ట్ మ్యాచింగ్ ఇంజిన్.',
    card2Bullet1: '100% KYC & GSTIN ధ్రువీకృత బయ్యర్లు',
    card2Bullet2: 'రెండు వైపులా బేరసారాలు & కౌంటర్ ఆఫర్లు',
    card2Bullet3: 'వాట్సాప్ & యాప్‌లోనే ప్రత్యక్ష సందేశాలు',

    card3Title: '🚚 పూర్తి లావాదేవీ రక్షణ',
    card3Desc: 'అనుసంధానించబడిన రవాణా వాహనాలు మరియు కోల్డ్ స్టోరేజ్‌లు మీ పంటను సురక్షితంగా చేరవేస్తాయి.',
    card3Bullet1: 'డిజిటల్ ఒప్పందం & ఈ-కాంట్రాక్ట్',
    card3Bullet2: 'మైల్‌స్టోన్ ఆధారిత సురక్షిత నిధుల విడుదల',
    card3Bullet3: 'సమీప కోల్డ్ స్టోరేజ్ & గిడ్డంగుల శోధన',

    lifecycleEyebrow: 'లావాదేవీల ప్రక్రియ',
    howItWorksTitle: 'కిసాన్ మిత్ర ఎలా పనిచేస్తుంది',
    howItWorksSubtitle: 'నమోదు నుండి పంట డెలివరీ మరియు బ్యాంక్ ఖాతాలో డబ్బు జమ అయ్యే వరకు.',
    step1Title: 'నమోదు & భాష ఎంపిక',
    step1Desc: 'మొబైల్ OTP ద్వారా క్షణాల్లో నమోదు. తెలుగు, హిందీ, ఇంగ్లీష్ సహా మీ అభిమాన భాషలో పూర్తి సమాచారం.',
    step2Title: 'పంట లాట్ నమోదు / బయ్యర్ అవసరాల ప్రకటన',
    step2Desc: 'రైతులు పంట గ్రేడ్, తేమ శాతం, ఆశించే ధర నమోదు చేస్తారు. బయ్యర్లు తమ కొనుగోలు అవసరాలను పోస్ట్ చేస్తారు.',
    step3Title: 'స్మార్ట్ మ్యాచింగ్ & బేరసారాలు',
    step3Desc: 'అనుకూలమైన లాట్‌లను AI గుర్తిస్తుంది. నిజ-సమయంలో పరస్పరం చర్చించి ధరను ఖరారు చేయవచ్చు.',
    step4Title: 'సురక్షిత రవాణా & చెల్లింపు',
    step4Desc: 'డిజిటల్ ఒప్పందం, ఎస్క్రో నిధి జమ, రవాణా వాహనం ఏర్పాటు మరియు డెలివరీతో తక్షణ చెల్లింపు.',

    copilotEyebrow: 'వ్యవసాయ AI సహాయకుడు',
    copilotTitle: 'AI కిసాన్ మిత్ర సహాయక్‌ను ఉపయోగించండి',
    copilotDesc: 'లైవ్ మార్కెట్ ధరలు, సమీప బయ్యర్లు, MSP వివరాలు మరియు పంట నిల్వ సలహాల గురించి తెలుగులో అడగండి.',
    askAiNow: 'AI సహాయకుడిని అడగండి →',

    footerLiveSource: 'ప్రత్యక్ష సమాచార మూలం: AGMARKNET',
    footerMspSchedule: 'కేంద్ర ప్రభుత్వ CACP MSP షెడ్యూల్ 2024-25',
    footerCopyright: '© 2026 కిసాన్ మిత్ర ప్లాట్‌ఫారమ్. భారతీయ వ్యవసాయం కోసం అంకితం.',

    authFarmerTitle: 'Farmer Portal',
    authBuyerTitle: 'Buyer Portal',
    authFarmerSubtitle: 'ప్రత్యక్ష మార్కెట్ ధరలు, MSP మరియు ధ్రువీకృత బయ్యర్లు',
    authBuyerSubtitle: 'రైతుల నుండి నాణ్యమైన పంటల ప్రత్యక్ష సేకరణ',
    demoFarmerLabel: '⚡ 1-క్లిక్ తక్షణ డెమో ప్రవేశం:',
    demoBuyerLabel: '⚡ 1-క్లిక్ తక్షణ డెమో బయ్యర్ ప్రవేశం:',
    demoFarmerBtn: '🌾 డెమో ప్రవేశం (రమేష్ కుమార్ - గుంటూరు)',
    demoBuyerBtn: '🏢 డెమో బయ్యర్ (రాజేష్ ఆగ్రో ఫుడ్స్)',
    prefLangLabel: 'భాషను ఎంచుకోండి (Preferred Language)',
    farmerNameLabel: 'రైతు / FPO పేరు',
    buyerNameLabel: 'కంపెనీ / మిల్లు / బయ్యర్ పేరు',
    farmerNamePlaceholder: 'పేరు నమోదు చేయండి',
    buyerNamePlaceholder: 'కంపెనీ పేరు నమోదు చేయండి',
    farmerMobileLabel: 'మొబైల్ నంబర్ (+91)',
    buyerMobileLabel: 'బయ్యర్ మొబైల్ నంబర్ (+91)',
    districtLabel: 'జిల్లా',
    farmerVillageLabel: 'గ్రామం / మండలం',
    buyerVillageLabel: 'ప్రాసెసింగ్ కేంద్రం / ప్రాంతం',
    cropsGrownLabel: 'పండించే పంటలు',
    cropsNeededLabel: 'కొనుగోలు చేయాల్సిన పంటలు',
    sendOtpFarmerBtn: 'ధ్రువీకరణ OTP పంపండి →',
    sendOtpBuyerBtn: 'బయ్యర్ ధ్రువీకరణ OTP పంపండి →',
    enterOtpTitle: '6 అంకెల OTP నమోదు చేయండి',
    editDetailsBtn: 'వివరాలు సవరించండి',
    verifyOtpFarmerBtn: 'OTP ధ్రువీకరించి పోర్టల్‌లోకి ప్రవేశించండి',
    verifyOtpBuyerBtn: 'OTP ధ్రువీకరించి బయ్యర్ పోర్టల్‌లోకి ప్రవేశించండి',
  },

  hi: {
    liveArrivalsBadge: 'ताज़ा मंडी आवक व भाव (Live Mandi)',
    agmarknetMspSource: 'भारत सरकार AGMARKNET + CACP MSP',

    navLiveMandi: 'लाइव मंडी',
    navDirectBuyers: 'सीधे खरीदार',
    navLogistics: 'परिवहन व भंडारण',
    navHowItWorks: 'यह कैसे काम करता है',
    navAiSahayak: 'AI सहायक',
    loginBtn: 'लॉग इन',
    registerBtn: 'पंजीकरण',
    selectPortalSignIn: 'लॉग इन के लिए पोर्टल चुनें',
    selectPortalRegister: 'पंजीकरण के लिए पोर्टल चुनें',
    farmerPortal: 'किसान पोर्टल',
    farmerPortalDesc: 'मंडी भाव व सरकारी MSP',
    buyerPortal: 'खरीदार पोर्टल',
    buyerPortalDesc: 'सीधी खरीद व अनुबंध',
    topMenuFeatures: 'शीर्ष मेनू और सुविधाएं',
    mobileMandiDesc: 'वास्तविक समय औसत दरें व APMC डेटा',
    mobileBuyersDesc: 'KYC सत्यापित प्रसंस्करण उद्योग व मिलें',
    mobileLogisticsDesc: 'खेत पर वाहन बुकिंग व कोल्ड स्टोरेज',
    mobileWorkflowDesc: '4 चरणों में पारदर्शी सुरक्षित व्यापार',
    mobileAiDesc: 'अपनी मातृभाषा में कृषि सलाहकार',

    heroBadge: '• कृषि-बाजार आसूचना व व्यापार मंच',
    heroHeadline: 'खेत से सीधे सही खरीदार तक।',
    heroSubheadline: 'बेहतर मंडी भाव, सत्यापित खरीदार, वास्तविक समय का बाजार विश्लेषण और सुरक्षित परिवहन — सब एक ही मंच पर।',
    farmerCta: '🌾 किसान पोर्टल लॉगिन / पंजीकरण',
    buyerCta: '🏢 खरीदार पोर्टल लॉगिन / पंजीकरण',
    heroQuote: '“किसानों के मूल प्रश्न का सटीक उत्तर: क्या मुझे अभी बेचना चाहिए, कहाँ बेचना चाहिए और किसे बेचना चाहिए?”',

    bridgeEyebrow: 'डिजिटल व्यापार सेतु',
    bridgeTitle: 'किसान और खरीदार का सीधा जुड़ाव',
    farmerCardTitle: '🌾 किसान / किसान उत्पादक संगठन (FPO)',
    farmerBullet1: 'A/B/C ग्रेड के साथ डिजिटल लॉट बनाएं',
    farmerBullet2: 'लाइव मंडी भाव व MSP से तुलना',
    farmerBullet3: 'भाड़ा काटकर शुद्ध मुनाफे का सटीक कैलकुलेटर',
    openFarmerLogin: 'किसान पोर्टल खोलें',
    engineTitle: '🛡️ किसान मित्र इंजन',
    engineSubtitle: 'स्मार्ट मैचिंग व सुरक्षा कवच',
    badgeBetterPrice: '📈 बेहतर भाव',
    badgeVerifiedBuyer: '✓ सत्यापित खरीदार',
    badgeFastLogistics: '🚚 तीव्र परिवहन',
    badgeMilestoneEscrow: '🔒 सुरक्षित एस्क्रो भुगतान',
    buyerCardTitle: '🏢 खरीदार / प्रसंस्करण मिल',
    buyerBullet1: 'थोक खरीद मांग दर्ज करें',
    buyerBullet2: '10,000+ किसानों से सीधे गुणवत्तापूर्ण उपज',
    buyerBullet3: 'गुणवत्ता सत्यापित डिजिटल हैंडओवर',
    openBuyerLogin: 'खरीदार पोर्टल खोलें',
    protectedTransactionLabel: '7-चरणीय सुरक्षित व्यापार प्रवाह:',
    flowSteps: ['लॉट निर्माण', 'स्मार्ट मिलान', 'मूल्य प्रस्ताव', 'डिजिटल अनुबंध', 'एस्क्रो फंड', 'वाहन परिवहन', 'वितरण व भुगतान'],

    carouselEyebrow: 'खेतों की वास्तविक झलकियाँ',
    carouselTitle: 'ग्रामीण भारत में किसान मित्र का सशक्त प्रभाव',
    startAsFarmer: 'किसान के रूप में शुरू करें →',
    startAsBuyer: 'खरीदार के रूप में शुरू करें →',
    carouselSlides: [
      {
        badge: 'मंडी भाव आसूचना',
        overlayText: 'फसल को कभी भी बाजार के सही मूल्य से कम पर न बेचें।',
        description: '1,200 से अधिक मंडियों के वास्तविक भाव और राष्ट्रीय न्यूनतम समर्थन मूल्य (MSP) से सीधी तुलना।',
      },
      {
        badge: 'सत्यापित सीधा व्यापार',
        overlayText: 'खाद्य प्रसंस्करण इकाइयों और थोक खरीदारों से सीधा संपर्क।',
        description: 'बिचौलियों की निर्भरता समाप्त करें। खेत पर ही पक्के सौदे और अधिक मुनाफा सुनिश्चित करें।',
      },
      {
        badge: 'सुरक्षित लॉजिस्टिक्स व भुगतान',
        overlayText: 'खेत से उठान से लेकर बैंक खाते में गारंटीड भुगतान तक।',
        description: 'विश्वसनीय वाहन बुक करें, नजदीकी कोल्ड स्टोरेज खोजें और माल पहुँचते ही तुरंत सुरक्षित भुगतान पाएँ।',
      },
    ],

    coreCapabilities: 'मुख्य क्षमताएं',
    transformingAgriTitle: 'भारतीय कृषि व्यापार का आधुनिकीकरण',
    transformingAgriSubtitle: 'भारतीय किसानों, FPO और खाद्य उद्योगों की जमीनी वास्तविकताओं को ध्यान में रखकर निर्मित।',

    card1Title: '📈 बेहतर मूल्य खोज',
    card1Desc: 'स्थानीय मंडी भावों की तुलना राष्ट्रीय MSP से करें और आगामी 7 दिनों के रुझान का पूर्वानुमान देखें।',
    card1Bullet1: 'वास्तविक समय AGMARKNET डेटा',
    card1Bullet2: 'परिवहन खर्च घटाकर शुद्ध मुनाफे की गणना',
    card1Bullet3: 'उपयुक्त बिक्री समय का सटीक सुझाव',

    card2Title: '🤝 सत्यापित खरीदार संपर्क',
    card2Desc: 'फसल की किस्म, दूरी, मात्रा, मूल्य और विश्वसनीयता स्कोर का विश्लेषण करने वाला 6-कारकीय स्मार्ट मिलान इंजन।',
    card2Bullet1: '100% KYC व GSTIN सत्यापित खरीदार',
    card2Bullet2: 'दोनों पक्षों में सीधा मोलभाव व काउंटर ऑफर',
    card2Bullet3: 'व्हाट्सएप व इन-ऐप सीधी बातचीत',

    card3Title: '🚚 संपूर्ण सुरक्षित सौदा',
    card3Desc: 'एकीकृत वाहन चालक व भंडारण गोदाम सुनिश्चित करते हैं कि फसल सुरक्षित पहुँचे और तुरंत भुगतान मिले।',
    card3Bullet1: 'डिजिटल अनुबंध व ई-एग्रीमेंट',
    card3Bullet2: 'माइलस्टोन आधारित सुरक्षित भुगतान रिलीज',
    card3Bullet3: 'नजदीकी कोल्ड स्टोरेज व वेयरहाउस खोज',

    lifecycleEyebrow: 'व्यापार चक्र',
    howItWorksTitle: 'किसान मित्र कैसे काम करता है',
    howItWorksSubtitle: 'पंजीकरण से लेकर फसल की सुपुर्दगी और बैंक खाते में भुगतान तक।',
    step1Title: 'पंजीकरण व भाषा चयन',
    step1Desc: 'मोबाइल OTP से आसान पंजीकरण। हिंदी, तेलुगु, अंग्रेजी सहित आपकी पसंदीदा भाषा में संपूर्ण जानकारी।',
    step2Title: 'लॉट दर्ज करें / मांग पोस्ट करें',
    step2Desc: 'किसान फसल ग्रेड, नमी व मूल्य दर्ज करते हैं। खरीदार अपनी आवश्यकताएं पोस्ट करते हैं।',
    step3Title: 'स्मार्ट मैचिंग व बातचीत',
    step3Desc: 'AI इंजन उपयुक्त खरीदार से मिलाता है। वास्तविक समय में काउंटर ऑफर भेजकर भाव तय करें।',
    step4Title: 'सुरक्षित परिवहन व भुगतान',
    step4Desc: 'डिजिटल अनुबंध साइन करें, एस्क्रो फंड जमा करें, वाहन जोड़ें और डिलीवरी पर भुगतान प्राप्त करें।',

    copilotEyebrow: 'कृषि AI सहायक',
    copilotTitle: 'AI किसान मित्र सहायक से पूछें',
    copilotDesc: 'लाइव मंडी भाव, नजदीकी खरीदार, MSP और फसल सुरक्षा के बारे में हिंदी में सहजता से पूछें।',
    askAiNow: 'AI सहायक से अभी पूछें →',

    footerLiveSource: 'लाइव डेटा स्रोत: AGMARKNET',
    footerMspSchedule: 'CACP MSP अनुसूची 2024-25',
    footerCopyright: '© 2026 किसान मित्र मंच। भारतीय कृषि के लिए समर्पित।',

    authFarmerTitle: 'किसान पोर्टल',
    authBuyerTitle: 'खरीदार पोर्टल',
    authFarmerSubtitle: 'मंडी भाव, MSP और सत्यापित खरीदारों से सीधा जुड़ाव',
    authBuyerSubtitle: 'सत्यापित किसानों से सीधे गुणवत्तापूर्ण उपज की खरीद',
    demoFarmerLabel: '⚡ 1-क्लिक त्वरित डेमो किसान लॉगिन:',
    demoBuyerLabel: '⚡ 1-क्लिक त्वरित डेमो खरीदार लॉगिन:',
    demoFarmerBtn: '🌾 डेमो किसान (रमेश कुमार - गुंटूर)',
    demoBuyerBtn: '🏢 डेमो खरीदार (राजेश एग्रो फूड्स)',
    prefLangLabel: 'पसंदीदा भाषा (Preferred Language)',
    farmerNameLabel: 'किसान / FPO का नाम',
    buyerNameLabel: 'कंपनी / मिल / खरीदार का नाम',
    farmerNamePlaceholder: 'किसान का नाम दर्ज करें',
    buyerNamePlaceholder: 'कंपनी का नाम दर्ज करें',
    farmerMobileLabel: 'किसान मोबाइल (+91)',
    buyerMobileLabel: 'खरीदार व्यावसायिक मोबाइल (+91)',
    districtLabel: 'ज़िला',
    farmerVillageLabel: 'गाँव / ब्लॉक',
    buyerVillageLabel: 'प्रसंस्करण केंद्र / इलाका',
    cropsGrownLabel: 'उगाई जाने वाली फसलें',
    cropsNeededLabel: 'खरीद के लिए आवश्यक फसलें',
    sendOtpFarmerBtn: 'किसान सत्यापन OTP भेजें →',
    sendOtpBuyerBtn: 'खरीदार सत्यापन OTP भेजें →',
    enterOtpTitle: '6-अंकीय OTP दर्ज करें',
    editDetailsBtn: 'विवरण बदलें',
    verifyOtpFarmerBtn: 'OTP सत्यापित करें और किसान पोर्टल में प्रवेश करें',
    verifyOtpBuyerBtn: 'OTP सत्यापित करें और खरीदार पोर्टल में प्रवेश करें',
  },

  ta: {
    liveArrivalsBadge: 'நேரடி மண்டி வரத்து & விலை',
    agmarknetMspSource: 'இந்திய அரசு AGMARKNET + CACP MSP',

    navLiveMandi: 'லைவ் மண்டி',
    navDirectBuyers: 'நேரடி வாங்குபவர்கள்',
    navLogistics: 'போக்குவரத்து & சேமிப்பு',
    navHowItWorks: 'செயல்படும் முறை',
    navAiSahayak: 'AI சகாயக்',
    loginBtn: 'உள்நுழை',
    registerBtn: 'பதிவு செய்க',
    selectPortalSignIn: 'உள்நுழைய போர்ட்டலைத் தேர்வுசெய்க',
    selectPortalRegister: 'பதிவுசெய்ய போர்ட்டலைத் தேர்வுசெய்க',
    farmerPortal: 'விவசாயி போர்டல்',
    farmerPortalDesc: 'மண்டி விலை & அரசு MSP',
    buyerPortal: 'வாங்குபவர் போர்டல்',
    buyerPortalDesc: 'நேரடி கொள்முதல் & ஒப்பந்தங்கள்',
    topMenuFeatures: 'முக்கிய அம்சங்கள்',
    mobileMandiDesc: 'நேரடி மண்டி விலைகள் & APMC தகவல்',
    mobileBuyersDesc: 'சரிபார்க்கப்பட்ட உணவு ஆலைகள்',
    mobileLogisticsDesc: 'பண்ணைக்கள போக்குவரத்து & கிடங்கு',
    mobileWorkflowDesc: '4 எளிய படிகளில் வெளிப்படையான வர்த்தகம்',
    mobileAiDesc: 'பிராந்திய மொழி வேளாண் ஆலோசகர்',

    heroBadge: '• வேளாண் சந்தை நுண்ணறிவு தளம்',
    heroHeadline: 'பண்ணையிலிருந்து சரியான வாங்குபவருக்கு.',
    heroSubheadline: 'சிறந்த விலைகள், சரிபார்க்கப்பட்ட வாங்குபவர்கள், நேரடி சந்தை விலைகள் மற்றும் நம்பகமான போக்குவரத்து — அனைத்தும் ஒரே தளத்தில்.',
    farmerCta: '🌾 விவசாயி போர்டல் உள்நுழைவு / பதிவு',
    buyerCta: '🏢 வாங்குபவர் போர்டல் உள்நுழைவு / பதிவு',
    heroQuote: '“முக்கிய கேள்விக்கு துல்லியமான பதில்: நான் இப்போது விற்க வேண்டுமா, எங்கு விற்க வேண்டும், யாருக்கு விற்க வேண்டும்?”',

    bridgeEyebrow: 'டிஜிட்டல் பரிவர்த்தனை பாலம்',
    bridgeTitle: 'விவசாயி மற்றும் வாங்குபவர் நேரடி இணைப்பு',
    farmerCardTitle: '🌾 விவசாயி / FPO',
    farmerBullet1: 'A/B/C தரத்துடன் டிஜிட்டல் லாட் பதிவு',
    farmerBullet2: 'நேரடி மண்டி விலை மற்றும் MSP ஒப்பீடு',
    farmerBullet3: 'போக்குவரத்து கழித்த நிகர லாபக் கணக்கீடு',
    openFarmerLogin: 'விவசாயி போர்டலைத் திறக்க',
    engineTitle: '🛡️ கிசான் மித்ரா என்ஜின்',
    engineSubtitle: 'ஸ்மார்ட் மேட்சிங் & பாதுகாப்பு தளம்',
    badgeBetterPrice: '📈 சிறந்த விலை',
    badgeVerifiedBuyer: '✓ சரிபார்க்கப்பட்டவர்',
    badgeFastLogistics: '🚚 வேகமான போக்குவரத்து',
    badgeMilestoneEscrow: '🔒 பாதுகாப்பான எஸ்க்ரோ',
    buyerCardTitle: '🏢 வாங்குபவர் / ஆலை',
    buyerBullet1: 'மொத்த கொள்முதல் தேவை பதிவு',
    buyerBullet2: '10,000+ விவசாயிகளிடமிருந்து நேரடி கொள்முதல்',
    buyerBullet3: 'தரம் சரிபார்க்கப்பட்ட டிஜிட்டல் ஒப்படைப்பு',
    openBuyerLogin: 'வாங்குபவர் போர்டலைத் திறக்க',
    protectedTransactionLabel: '7-படிநிலை பாதுகாப்பான வர்த்தகம்:',
    flowSteps: ['லாட் பதிவு', 'ஸ்மார்ட் பொருத்தம்', 'விலை வாய்ப்பு', 'டிஜிட்டல் ஒப்பந்தம்', 'பாதுகாப்பு நிதி', 'போக்குவரத்து', 'டெலிவரி & பணம்'],

    carouselEyebrow: 'களக் காட்சிகள் & நேரடி நடவடிக்கைகள்',
    carouselTitle: 'கிராமப்புற இந்தியாவில் கிசான் மித்ரா',
    startAsFarmer: 'விவசாயியாக தொடங்குக →',
    startAsBuyer: 'வாங்குபவராக தொடங்குக →',
    carouselSlides: [
      {
        badge: 'மண்டி விலை நுண்ணறிவு',
        overlayText: 'சரியான சந்தை மதிப்பை விட குறைவாக ஒருபோதும் விற்காதீர்கள்.',
        description: '1,200க்கும் மேற்பட்ட மண்டிகளின் நேரடி விலைகள் மற்றும் தேசிய குறைந்தபட்ச ஆதரவு விலை (MSP) ஒப்பீடு.',
      },
      {
        badge: 'சரிபார்க்கப்பட்ட நேரடி வர்த்தகம்',
        overlayText: 'உணவு பதப்படுத்தும் நிறுவனங்களுடன் நேரடியாக இணையுங்கள்.',
        description: 'இடைத்தரகர்களை நீக்குங்கள். பண்ணையிலேயே உத்தரவாதமான ஒப்பந்தங்கள் மற்றும் அதிக வருமானம் பெறுங்கள்.',
      },
      {
        badge: 'முழுமையான போக்குவரத்து & பணம்',
        overlayText: 'களத்திலிருந்து கொண்டு செல்லுதல் முதல் பாதுகாப்பான வங்கி வரவு வரை.',
        description: 'நம்பகமான வாகனங்களை பதிவு செய்யுங்கள், குளிர்பதனக் கிடங்குகளைக் கண்டறியுங்கள், உடனடி பாதுகாப்பான பணம் பெறுங்கள்.',
      },
    ],

    coreCapabilities: 'முக்கிய திறன்கள்',
    transformingAgriTitle: 'இந்திய வேளாண் வர்த்தகத்தில் புதிய புரட்சி',
    transformingAgriSubtitle: 'இந்திய விவசாயிகள், FPOக்கள் மற்றும் உணவு ஆலைகளின் தேவைகளுக்காக உருவாக்கப்பட்டது.',

    card1Title: '📈 சிறந்த விலை அறிதல்',
    card1Desc: 'உள்ளூர் மண்டி விலைகளை தேசிய MSP உடன் ஒப்பிட்டு, அடுத்த 7 நாட்களுக்கான விலை கணிப்பை வழங்குகிறது.',
    card1Bullet1: 'நேரடி AGMARKNET தரவு',
    card1Bullet2: 'போக்குவரத்து செலவு கழித்த நிகர வருவாய்',
    card1Bullet3: 'சிறந்த விற்பனை நேர பரிந்துரை',

    card2Title: '🤝 சரிபார்க்கப்பட்ட வாங்குபவர்கள்',
    card2Desc: 'பயிர் வகை, தூரம், அளவு, விலை மற்றும் நம்பகத்தன்மையை மதிப்பிடும் ஸ்மார்ட் மேட்சிங் என்ஜின்.',
    card2Bullet1: '100% KYC & GSTIN சரிபார்க்கப்பட்டவர்கள்',
    card2Bullet2: 'இருதரப்பு விலை பேரம் மற்றும் மாற்று வாய்ப்பு',
    card2Bullet3: 'நேரடி வாட்ஸ்அப் & ஆப் செய்தி உரையாடல்',

    card3Title: '🚚 முழுமையான வர்த்தக பாதுகாப்பு',
    card3Desc: 'ஒருங்கிணைந்த வாகனங்கள் மற்றும் சேமிப்பு கிடங்குகள் உங்கள் அறுவடையை பாதுகாப்பாக சேர்க்கின்றன.',
    card3Bullet1: 'டிஜிட்டல் ஒப்பந்தம் & இ-அக்ரீமென்ட்',
    card3Bullet2: 'மைல்ஸ்டோன் அடிப்படையிலான பாதுகாப்பான நிதி',
    card3Bullet3: 'அருகிலுள்ள குளிர்பதனக் கிடங்கு தேடல்',

    lifecycleEyebrow: 'வர்த்தக சுழற்சி',
    howItWorksTitle: 'கிசான் மித்ரா எவ்வாறு செயல்படுகிறது',
    howItWorksSubtitle: 'பதிவு முதல் விளைபொருள் டெலிவரி மற்றும் வங்கி கணக்கில் பணம் சேரும் வரை.',
    step1Title: 'பதிவு & மொழி தேர்வு',
    step1Desc: 'மொபைல் OTP மூலம் எளிதான பதிவு. தமிழ், தெலுங்கு, இந்தி, ஆங்கிலத்தில் முழுமையான விவரங்கள்.',
    step2Title: 'லாட் பதிவு / தேவை பதிவிடுதல்',
    step2Desc: 'விவசாயிகள் பயிர் தரம், விலை குறிப்பிடுகிறார்கள். வாங்குபவர்கள் கொள்முதல் தேவையை பதிவிடுகிறார்கள்.',
    step3Title: 'ஸ்மார்ட் மேட்சிங் & பேரம்',
    step3Desc: 'பொருத்தமான வாங்குபவர்களை AI இணைக்கிறது. நேரலையில் பேசி விலையை இறுதி செய்யுங்கள்.',
    step4Title: 'பாதுகாப்பான போக்குவரத்து & பணம்',
    step4Desc: 'டிஜிட்டல் ஒப்பந்தம், எஸ்க்ரோ வைப்பு நிதி, வாகனம் ஏற்பாடு மற்றும் டெலிவரியில் உடனடி பணம்.',

    copilotEyebrow: 'வேளாண் AI உதவியாளர்',
    copilotTitle: 'AI கிசான் மித்ரா சகாயக்',
    copilotDesc: 'மண்டி விலைகள், வாங்குபவர்கள், MSP விவரங்கள் மற்றும் பயிர் பாதுகாப்பு ஆலோசனைகளை தமிழில் கேளுங்கள்.',
    askAiNow: 'AI உதவியாளரிடம் கேளுங்கள் →',

    footerLiveSource: 'நேரடி தரவு மூலம்: AGMARKNET',
    footerMspSchedule: 'மத்திய அரசு CACP MSP பட்டியல் 2024-25',
    footerCopyright: '© 2026 கிசான் மித்ரா தளம். இந்திய விவசாயிகளுக்காக.',

    authFarmerTitle: 'விவசாயி போர்டல்',
    authBuyerTitle: 'வாங்குபவர் போர்டல்',
    authFarmerSubtitle: 'நேரடி மண்டி விலை, MSP மற்றும் சரிபார்க்கப்பட்ட வாங்குபவர்கள்',
    authBuyerSubtitle: 'விவசாயிகளிடமிருந்து நேரடியாக விளைபொருட்களை கொள்முதல் செய்யுங்கள்',
    demoFarmerLabel: '⚡ உடனடி டெமோ விவசாயி உள்நுழைவு (1-கிளிக்):',
    demoBuyerLabel: '⚡ உடனடி டெமோ வாங்குபவர் உள்நுழைவு (1-கிளிக்):',
    demoFarmerBtn: '🌾 டெமோ விவசாயி (ரமேஷ் குமார் - குண்டூர்)',
    demoBuyerBtn: '🏢 டெமோ வாங்குபவர் (ராஜேஷ் அக்ரோ ஃபுட்ஸ்)',
    prefLangLabel: 'விருப்பமான மொழி (Preferred Language)',
    farmerNameLabel: 'விவசாயி / FPO பெயர்',
    buyerNameLabel: 'நிறுவனம் / ஆலை / வாங்குபவர் பெயர்',
    farmerNamePlaceholder: 'விவசாயி பெயரை உள்ளிடவும்',
    buyerNamePlaceholder: 'நிறுவன பெயரை உள்ளிடவும்',
    farmerMobileLabel: 'விவசாயி மொபைல் (+91)',
    buyerMobileLabel: 'வாங்குபவர் வணிக மொபைல் (+91)',
    districtLabel: 'மாவட்டம்',
    farmerVillageLabel: 'கிராமம் / வட்டம்',
    buyerVillageLabel: 'பதப்படுத்தும் மையம் / பகுதி',
    cropsGrownLabel: 'பயிரிடப்படும் பயிர்கள்',
    cropsNeededLabel: 'கொள்முதல் செய்ய வேண்டிய பயிர்கள்',
    sendOtpFarmerBtn: 'விவசாயி சரிபார்ப்பு OTP அனுப்புக →',
    sendOtpBuyerBtn: 'வாங்குபவர் சரிபார்ப்பு OTP அனுப்புக →',
    enterOtpTitle: '6-இலக்க OTP ஐ உள்ளிடவும்',
    editDetailsBtn: 'விவரங்களை மாற்றுக',
    verifyOtpFarmerBtn: 'OTP சரிபார்த்து விவசாயி போர்டலுக்குள் நுழைக',
    verifyOtpBuyerBtn: 'OTP சரிபார்த்து வாங்குபவர் போர்டலுக்குள் நுழைக',
  },

  kn: {
    liveArrivalsBadge: 'ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು & ಆಗಮನ',
    agmarknetMspSource: 'ಭಾರತ ಸರ್ಕಾರ AGMARKNET + CACP MSP',

    navLiveMandi: 'ಲೈವ್ ಮಂಡಿ',
    navDirectBuyers: 'ನೇರ ಖರೀದಿದಾರರು',
    navLogistics: 'ಸಾರಿಗೆ ಮತ್ತು ಸಂಗ್ರಹಣೆ',
    navHowItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    navAiSahayak: 'AI ಸಹಾಯಕ',
    loginBtn: 'ಲಾಗಿನ್',
    registerBtn: 'ನೋಂದಣಿ',
    selectPortalSignIn: 'ಲಾಗಿನ್ ಮಾಡಲು ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ',
    selectPortalRegister: 'ನೋಂದಾಯಿಸಲು ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ',
    farmerPortal: 'Farmer Portal',
    farmerPortalDesc: 'ಮಂಡಿ ಬೆಲೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ MSP',
    buyerPortal: 'Buyer Portal',
    buyerPortalDesc: 'ನೇರ ಖರೀದಿ ಮತ್ತು ಒಪ್ಪಂದಗಳು',
    topMenuFeatures: 'ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು',
    mobileMandiDesc: 'ನೈಜ ಸಮಯದ ದರಗಳು & APMC ಮಾಹಿತಿ',
    mobileBuyersDesc: 'ಪರಿಶೀಲಿಸಿದ ಆಹಾರ ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು',
    mobileLogisticsDesc: 'ಕಣದ ಬಳಿಯೇ ವಾಹನಗಳು & ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್',
    mobileWorkflowDesc: '4 ಹಂತಗಳಲ್ಲಿ ಪಾರದರ್ಶಕ ವ್ಯಾಪಾರ',
    mobileAiDesc: 'ಪ್ರಾದೇಶಿಕ ಭಾಷೆಯಲ್ಲಿ ಕೃಷಿ ಸಲಹೆಗಾರ',

    heroBadge: '• ಕೃಷಿ-ಮಾರುಕಟ್ಟೆ ಬುದ್ಧಿಮತ್ತೆ ವೇದಿಕೆ',
    heroHeadline: 'ತೋಟದಿಂದ ನೇರವಾಗಿ ಸರಿಯಾದ ಬೈಯರ್‌ಗೆ.',
    heroSubheadline: 'ಉತ್ತಮ ಬೆಲೆಗಳು, ಪರಿಶೀಲಿಸಿದ ಬೈಯರ್‌ಗಳು, ನೈಜ ಸಮಯದ ಮಾರುಕಟ್ಟೆ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಸಾರಿಗೆ — ಎಲ್ಲವೂ ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ.',
    farmerCta: '🌾 Farmer Portal ಪ್ರವೇಶ / ನೋಂದಣಿ',
    buyerCta: '🏢 Buyer Portal ಪ್ರವೇಶ / ನೋಂದಣಿ',
    heroQuote: '“ಮೂಲಭೂತ ಪ್ರಶ್ನೆಗೆ ನಿಖರ ಉತ್ತರ: ನಾನು ಈಗಲೇ ಮಾರಾಟ ಮಾಡಬೇಕೇ, ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಕು ಮತ್ತು ಯಾರಿಗೆ ಮಾರಾಟ ಮಾಡಬೇಕು?”',

    bridgeEyebrow: 'ಡಿಜಿಟಲ್ ವಹಿವಾಟು ಸೇತು',
    bridgeTitle: 'ರೈತರು ಮತ್ತು ಬೈಯರ್‌ಗಳ ನೇರ ಸಂಪರ್ಕ',
    farmerCardTitle: '🌾 ಕೃಷಿಕ / FPO',
    farmerBullet1: 'A/B/C ಗ್ರೇಡ್ ಗುಣಮಟ್ಟದ ಡಿಜಿಟಲ್ ಲಾಟ್ ನೋಂದಣಿ',
    farmerBullet2: 'ಲೈವ್ ಮಂಡಿ ಮತ್ತು MSP ನೇರ ಹೋಲಿಕೆ',
    farmerBullet3: 'ಸಾರಿಗೆ ವೆಚ್ಚ ಕಡಿತದ ನಿವ್ವಳ ಲಾಭ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    openFarmerLogin: 'Farmer Portal ತೆರೆಯಿರಿ',
    engineTitle: '🛡️ ಕಿಸಾನ್ ಮಿತ್ರ ಇಂಜಿನ್',
    engineSubtitle: 'ಸ್ಮಾರ್ಟ್ ಮ್ಯಾಚಿಂಗ್ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ರಕ್ಷಣೆ',
    badgeBetterPrice: '📈 ಉತ್ತಮ ಬೆಲೆ',
    badgeVerifiedBuyer: '✓ ಪರಿಶೀಲಿಸಿದ ಬೈಯರ್',
    badgeFastLogistics: '🚚 ವೇಗದ ಸಾರಿಗೆ',
    badgeMilestoneEscrow: '🔒 ಸುರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ಪಾವತಿ',
    buyerCardTitle: '🏢 ಬೈಯರ್ / ಮಿಲ್',
    buyerBullet1: 'ಬೃಹತ್ ಖರೀದಿ ಬೇಡಿಕೆ ಪೋಸ್ಟ್ ಮಾಡಿ',
    buyerBullet2: '10,000+ ರೈತರಿಂದ ನೇರ ಖರೀದಿ',
    buyerBullet3: 'ಗುಣಮಟ್ಟ ಪರಿಶೀಲಿಸಿದ ಡಿಜಿಟಲ್ ಹಸ್ತಾಂತರ',
    openBuyerLogin: 'Buyer Portal ತೆರೆಯಿರಿ',
    protectedTransactionLabel: '7 ಹಂತಗಳ ಸುರಕ್ಷಿತ ವಹಿವಾಟು:',
    flowSteps: ['ಲಾಟ್ ಸೃಷ್ಟಿ', 'ಸ್ಮಾರ್ಟ್ ಹೊಂದಾಣಿಕೆ', 'ಬೆಲೆ ಪ್ರಸ್ತಾಪ', 'ಡಿಜಿಟಲ್ ಒಪ್ಪಂದ', 'ಎಸ್ಕ್ರೋ ಠೇವಣಿ', 'ಸಾರಿಗೆ', 'ವಿತರಣೆ & ಪಾವತಿ'],

    carouselEyebrow: 'ಕ್ಷೇತ್ರ ಮಟ್ಟದ ನೈಜ ಚಿತ್ರಣ',
    carouselTitle: 'ಗ್ರಾಮೀಣ ಭಾರತದಲ್ಲಿ ಕಿಸಾನ್ ಮಿತ್ರ ಹೆಜ್ಜೆಗಳು',
    startAsFarmer: 'ರೈತರಾಗಿ ಪ್ರಾರಂಭಿಸಿ →',
    startAsBuyer: 'ಖರೀದಿದಾರರಾಗಿ ಪ್ರಾರಂಭಿಸಿ →',
    carouselSlides: [
      {
        badge: 'ಮಂಡಿ ಬೆಲೆ ಮಾಹಿತಿ',
        overlayText: 'ಮಾರುಕಟ್ಟೆಯ ನಿಜವಾದ ಬೆಲೆಗಿಂತ ಕಡಿಮೆ ಬೆಲೆಗೆ ಎಂದಿಗೂ ಮಾರಬೇಡಿ.',
        description: '1,200 ಕ್ಕೂ ಹೆಚ್ಚು APMC ಮಂಡಿಗಳ ನೇರ ಬೆಲೆಗಳು ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP) ಹೋಲಿಕೆ.',
      },
      {
        badge: 'ಪರಿಶೀಲಿಸಿದ ನೇರ ವ್ಯಾಪಾರ',
        overlayText: 'ಆಹಾರ ಸಂಸ್ಕರಣಾ ಕಂಪನಿಗಳು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ.',
        description: 'ಮಧ್ಯವರ್ತಿಗಳನ್ನು ತಪ್ಪಿಸಿ. ತೋಟದ ಬಳಿಯೇ ಖಚಿತ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಹೆಚ್ಚಿನ ಆದಾಯ ಪಡೆಯಿರಿ.',
      },
      {
        badge: 'ಸಂಪೂರ್ಣ ಸಾರಿಗೆ & ಪಾವತಿ',
        overlayText: 'ಕಟಾವಿನ ಸ್ಥಳದಿಂದ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಗ್ಯಾರಂಟಿ ಪಾವತಿಯವರೆಗೆ.',
        description: 'ವಿಶ್ವಾಸಾರ್ಹ ವಾಹನ ಬುಕ್ ಮಾಡಿ, ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಹುಡುಕಿ, ಮಾಲು ತಲುಪಿದ ತಕ್ಷಣ ಸುರಕ್ಷಿತ ಹಣ ಪಡೆಯಿರಿ.',
      },
    ],

    coreCapabilities: 'ಪ್ರಮುಖ ಸಾಮರ್ಥ್ಯಗಳು',
    transformingAgriTitle: 'ಭಾರತೀಯ ಕೃಷಿ ವ್ಯಾಪಾರದಲ್ಲಿ ಹೊಸ ಕ್ರಾಂತಿ',
    transformingAgriSubtitle: 'ಭಾರತೀಯ ರೈತರು, FPOಗಳು ಮತ್ತು ಸಂಸ್ಕರಣಾ ಉದ್ಯಮಗಳ ವಾಸ್ತವ ಅಗತ್ಯಗಳಿಗಾಗಿ ರೂಪಿಸಲಾಗಿದೆ.',

    card1Title: '📈 ಉತ್ತಮ ಬೆಲೆ ಆವಿಷ್ಕಾರ',
    card1Desc: 'ಸ್ಥಳೀಯ ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ರಾಷ್ಟ್ರೀಯ MSP ಯೊಂದಿಗೆ ಹೋಲಿಸಿ ಮುಂದಿನ 7 ದಿನಗಳ ಬೆಲೆ ಮುನ್ಸೂಚನೆ ನೀಡುತ್ತದೆ.',
    card1Bullet1: 'ನೈಜ-ಸಮಯದ AGMARKNET ದತ್ತಾಂಶ',
    card1Bullet2: 'ಸಾರಿಗೆ ವೆಚ್ಚ ಕಳೆದ ನಂತರ ನಿವ್ವಳ ಲಾಭ',
    card1Bullet3: 'ಉತ್ತಮ ಮಾರಾಟ ಸಮಯದ ಶಿಫಾರಸು',

    card2Title: '🤝 ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರ ಸಂಪರ್ಕ',
    card2Desc: 'ಬೆಳೆಯ ತಳಿ, ದೂರ, ಪ್ರಮಾಣ, ಬೆಲೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್ ವಿಶ್ಲೇಷಿಸುವ ಸ್ಮಾರ್ಟ್ ಮ್ಯಾಚಿಂಗ್.',
    card2Bullet1: '100% KYC ಮತ್ತು GSTIN ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು',
    card2Bullet2: 'ದ್ವಿಪಕ್ಷೀಯ ನೇರ ಬೆಲೆ ಚೌಕಾಶಿ',
    card2Bullet3: 'ವಾಟ್ಸಾಪ್ ಮತ್ತು ಆ್ಯಪ್ ಚಾಟ್ ಸಂವಾದ',

    card3Title: '🚚 ಸಮಗ್ರ ಸುರಕ್ಷಿತ ವಹಿವಾಟು',
    card3Desc: 'ಸಂಯೋಜಿತ ವಾಹನಗಳು ಮತ್ತು ಶೈತ್ಯಾಗಾರಗಳು ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಗಮ್ಯಸ್ಥಾನಕ್ಕೆ ತಲುಪಿಸುತ್ತವೆ.',
    card3Bullet1: 'ಡಿಜಿಟಲ್ ಒಪ್ಪಂದ ಮತ್ತು ಇ-ಕಾಂಟ್ರಾಕ್ಟ್',
    card3Bullet2: 'ಮೈಲ್ಸ್‌ಸ್ಟೋನ್ ಆಧಾರಿತ ಸುರಕ್ಷಿತ ಪಾವತಿ',
    card3Bullet3: 'ಹತ್ತಿರದ ಶೀತಲ ಸಂಗ್ರಹಾಗಾರಗಳ ಹುಡುಕಾಟ',

    lifecycleEyebrow: 'ವಹಿವಾಟು ಜೀವನಚಕ್ರ',
    howItWorksTitle: 'ಕಿಸಾನ್ ಮಿತ್ರ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    howItWorksSubtitle: 'ನೋಂದಣಿಯಿಂದ ಬೆಳೆ ವಿತರಣೆ ಮತ್ತು ಖಾತೆಗೆ ಹಣ ಜಮೆಯಾಗುವವರೆಗೆ.',
    step1Title: 'ನೋಂದಣಿ & ಭಾಷೆ ಆಯ್ಕೆ',
    step1Desc: 'ಮೊಬೈಲ್ OTP ಯೊಂದಿಗೆ ಸುಲಭ ನೋಂದಣಿ. ಕನ್ನಡ, ತೆಲುಗು, ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.',
    step2Title: 'ಲಾಟ್ ನೋಂದಣಿ / ಬೇಡಿಕೆ ಪ್ರಕಟಣೆ',
    step2Desc: 'ರೈತರು ಬೆಳೆಯ ಗ್ರೇಡ್, ತೇವಾಂಶ ಮತ್ತು ನಿರೀಕ್ಷಿತ ಬೆಲೆ ನಮೂದಿಸುತ್ತಾರೆ. ಖರೀದಿದಾರರು ಬೇಡಿಕೆ ಹಾಕುತ್ತಾರೆ.',
    step3Title: 'ಸ್ಮಾರ್ಟ್ ಮ್ಯಾಚಿಂಗ್ & ಮಾತುಕತೆ',
    step3Desc: 'ಹೊಂದಾಣಿಕೆಯಾಗುವ ಖರೀದಿದಾರರನ್ನು AI ಜೋಡಿಸುತ್ತದೆ. ನೇರ ಚಾಟ್ ಮೂಲಕ ಬೆಲೆ ಅಂತಿಮಗೊಳಿಸಿ.',
    step4Title: 'ಸುರಕ್ಷಿತ ಸಾರಿಗೆ & ಪಾವತಿ',
    step4Desc: 'ಡಿಜಿಟಲ್ ಒಪ್ಪಂದ, ಎಸ್ಕ್ರೋ ಠೇವಣಿ, ವಾಹನ ವ್ಯವಸ್ಥೆ ಮತ್ತು ವಿತರಣೆ ಬಳಿಕ ತಕ್ಷಣದ ಪಾವತಿ.',

    copilotEyebrow: 'ಕೃಷಿ AI ಸಹಾಯಕ',
    copilotTitle: 'AI ಕಿಸಾನ್ ಮಿತ್ರ ಸಹಾಯಕ',
    copilotDesc: 'ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು, ಹತ್ತಿರದ ಖರೀದಿದಾರರು, MSP ವಿವರಗಳು ಮತ್ತು ಬೆಳೆ ರಕ್ಷಣೆ ಕುರಿತು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ.',
    askAiNow: 'AI ಸಹಾಯಕನನ್ನು ಈಗಲೇ ಕೇಳಿ →',

    footerLiveSource: 'ನೇರ ದತ್ತಾಂಶ ಮೂಲ: AGMARKNET',
    footerMspSchedule: 'ಕೇಂದ್ರ ಸರ್ಕಾರದ CACP MSP ವೇಳಾಪಟ್ಟಿ 2024-25',
    footerCopyright: '© 2026 ಕಿಸಾನ್ ಮಿತ್ರ ವೇದಿಕೆ. ಭಾರತೀಯ ಕೃಷಿಗಾಗಿ ಸಮರ್ಪಿತ.',

    authFarmerTitle: 'Farmer Portal',
    authBuyerTitle: 'Buyer Portal',
    authFarmerSubtitle: 'ನೇರ ಮಂಡಿ ಬೆಲೆಗಳು, MSP ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ಬೈಯರ್‌ಗಳು',
    authBuyerSubtitle: 'ರೈತರಿಂದ ನೇರವಾಗಿ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ಖರೀದಿ',
    demoFarmerLabel: '⚡ 1-ಕ್ಲಿಕ್ ತ್ವರಿತ ಡೆಮೊ ಪ್ರವೇಶ:',
    demoBuyerLabel: '⚡ 1-ಕ್ಲಿಕ್ ತ್ವರಿತ ಡೆಮೊ ಬೈಯರ್ ಪ್ರವೇಶ:',
    demoFarmerBtn: '🌾 ಡೆಮೊ ಪ್ರವೇಶ (ರಮೇಶ್ ಕುಮಾರ್ - ಗುಂಟೂರು)',
    demoBuyerBtn: '🏢 ಡೆಮೊ ಬೈಯರ್ (ರಾಜೇಶ್ ಅಗ್ರೋ ಫುಡ್ಸ್)',
    prefLangLabel: 'ಮೆಚ್ಚಿನ ಭಾಷೆ (Preferred Language)',
    farmerNameLabel: 'ಕೃಷಿಕ / FPO ಹೆಸರು',
    buyerNameLabel: 'ಕಂಪನಿ / ಮಿಲ್ / ಬೈಯರ್ ಹೆಸರು',
    farmerNamePlaceholder: 'ಹೆಸರು ನಮೂದಿಸಿ',
    buyerNamePlaceholder: 'ಕಂಪನಿ ಹೆಸರು ನಮೂದಿಸಿ',
    farmerMobileLabel: 'ಮೊಬೈಲ್ (+91)',
    buyerMobileLabel: 'ಬೈಯರ್ ಮೊಬೈಲ್ (+91)',
    districtLabel: 'ಜಿಲ್ಲೆ',
    farmerVillageLabel: 'ಗ್ರಾಮ / ತಾಲೂಕು',
    buyerVillageLabel: 'ಸಂಸ್ಕರಣಾ ಕೇಂದ್ರ / ಪ್ರದೇಶ',
    cropsGrownLabel: 'ಬೆಳೆಯುವ ಬೆಳೆಗಳು',
    cropsNeededLabel: 'ಖರೀದಿಗೆ ಬೇಕಾದ ಬೆಳೆಗಳು',
    sendOtpFarmerBtn: 'ಪರಿಶೀಲನೆ OTP ಕಳುಹಿಸಿ →',
    sendOtpBuyerBtn: 'ಬೈಯರ್ ಪರಿಶೀಲನೆ OTP ಕಳುಹಿಸಿ →',
    enterOtpTitle: '6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ',
    editDetailsBtn: 'ವಿವರ ಬದಲಾಯಿಸಿ',
    verifyOtpFarmerBtn: 'OTP ಪರಿಶೀಲಿಸಿ ಪೋರ್ಟಲ್‌ಗೆ ಪ್ರವೇಶಿಸಿ',
    verifyOtpBuyerBtn: 'OTP ಪರಿಶೀಲಿಸಿ ಬೈಯರ್ ಪೋರ್ಟಲ್‌ಗೆ ಪ್ರವೇಶಿಸಿ',
  },

  ml: {
    liveArrivalsBadge: 'തത്സമയ വിപണി വിലകൾ (Live Mandi)',
    agmarknetMspSource: 'ഭാരത സർക്കാർ AGMARKNET + CACP MSP',

    navLiveMandi: 'ലൈവ് വിപണി',
    navDirectBuyers: 'നേരിട്ടുള്ള വാങ്ങുന്നവർ',
    navLogistics: 'ഗതാഗതവും സംഭരണവും',
    navHowItWorks: 'പ്രവർത്തന രീതി',
    navAiSahayak: 'AI സഹായക്',
    loginBtn: 'ലോഗിൻ',
    registerBtn: 'രജിസ്റ്റർ ചെയ്യുക',
    selectPortalSignIn: 'ലോഗിൻ ചെയ്യാൻ പോർട്ടൽ തിരഞ്ഞെടുക്കുക',
    selectPortalRegister: 'രജിസ്റ്റർ ചെയ്യാൻ പോർട്ടൽ തിരഞ്ഞെടുക്കുക',
    farmerPortal: 'കർഷക പോർട്ടൽ',
    farmerPortalDesc: 'വിപണി വിലകളും സർക്കാർ MSP യും',
    buyerPortal: 'വാങ്ങുന്നയാളുടെ പോർട്ടൽ',
    buyerPortalDesc: 'നേരിട്ടുള്ള സംഭരണവും കരാറുകളും',
    topMenuFeatures: 'പ്രധാന സേവനങ്ങൾ',
    mobileMandiDesc: 'തത്സമയ നിരക്കുകളും APMC വിവരങ്ങളും',
    mobileBuyersDesc: 'സ്ഥിരീകരിച്ച ഭക്ഷ്യ സംസ്കരണ കമ്പനികൾ',
    mobileLogisticsDesc: 'പാടത്തുനിന്ന് വാഹനം & ശീതീകരണ സംഭരണം',
    mobileWorkflowDesc: '4 ഘട്ടങ്ങളിലുള്ള സുരക്ഷിത വ്യാപാരം',
    mobileAiDesc: 'മാതൃഭാഷയിൽ കാർഷിക ഉപദേശകൻ',

    heroBadge: '• കാർഷിക വിപണി ഇന്റലിജൻസ് പ്ലാറ്റ്‌ഫോം',
    heroHeadline: 'പാടത്തുനിന്ന് നേരിട്ട് ശരിയായ വാങ്ങുന്നയാളിലേക്ക്.',
    heroSubheadline: 'മികച്ച വിലകൾ, സ്ഥിരീകരിച്ച വാങ്ങുന്നവർ, തത്സമയ വിപണി വിവരങ്ങൾ, വിശ്വസനീയമായ ഗതാഗതം — എല്ലാം ഒരൊറ്റ പ്ലാറ്റ്‌ഫോമിൽ.',
    farmerCta: '🌾 കർഷക പോർട്ടൽ ലോഗിൻ / രജിസ്ട്രേഷൻ',
    buyerCta: '🏢 വാങ്ങുന്നയാളുടെ പോർട്ടൽ ലോഗിൻ / രജിസ്ട്രേഷൻ',
    heroQuote: '“കർഷകരുടെ പ്രധാന ചോദ്യത്തിന് കൃത്യമായ ഉത്തരം: ഞാൻ ഇപ്പോൾ വിൽക്കണമോ, എവിടെ വിൽക്കണം, ആർക്ക് വിൽക്കണം?”',

    bridgeEyebrow: 'ഡിജിറ്റൽ വ്യാപാര പാലം',
    bridgeTitle: 'കർഷകരും വാങ്ങുന്നവരും തമ്മിലുള്ള നേരിട്ടുള്ള ബന്ധം',
    farmerCardTitle: '🌾 കർഷകൻ / FPO',
    farmerBullet1: 'A/B/C ഗ്രേഡ് ഗുണനിലവാരത്തോടെ ഡിജിറ്റൽ ലോട്ട്',
    farmerBullet2: 'തത്സമയ വിപണി വിലയും MSP യും താരതമ്യം ചെയ്യുക',
    farmerBullet3: 'ഗതാഗത ചെലവ് കുറച്ചുള്ള കൃത്യമായ ലാഭ കണക്കുകൂട്ടൽ',
    openFarmerLogin: 'കർഷക പോർട്ടൽ തുറക്കുക',
    engineTitle: '🛡️ കിസാൻ മിത്ര എൻജിൻ',
    engineSubtitle: 'സ്മാർട്ട് പൊരുത്തവും സുരക്ഷാ കവചവും',
    badgeBetterPrice: '📈 മികച്ച വില',
    badgeVerifiedBuyer: '✓ സ്ഥിരീകരിച്ച വാങ്ങുന്നയാൾ',
    badgeFastLogistics: '🚚 വേഗതയേറിയ ഗതാഗതം',
    badgeMilestoneEscrow: '🔒 സുരക്ഷിത എസ്ക്രോ പേയ്മെന്റ്',
    buyerCardTitle: '🏢 വാങ്ങുന്നയാൾ / പ്രൊസസ്സർ',
    buyerBullet1: 'മൊത്ത സംഭരണ ആവശ്യങ്ങൾ രേഖപ്പെടുത്തുക',
    buyerBullet2: '10,000+ കർഷകരിൽ നിന്ന് നേരിട്ട് വാങ്ങുക',
    buyerBullet3: 'ഗുണനിലവാരം ഉറപ്പുവരുത്തിയ ഡിജിറ്റൽ കൈമാറ്റം',
    openBuyerLogin: 'വാങ്ങുന്നയാളുടെ പോർട്ടൽ തുറക്കുക',
    protectedTransactionLabel: '7 ഘട്ടങ്ങളുള്ള സുരക്ഷിത വ്യാപാരം:',
    flowSteps: ['ലോട്ട് സൃഷ്ടിക്കൽ', 'സ്മാർട്ട് പൊരുത്തം', 'വില നിർദ്ദേശം', 'ഡിജിറ്റൽ കരാർ', 'എസ്ക്രോ നിക്ഷേപം', 'ഗതാഗതം', 'ഡെലിവറിയും പേയ്മെന്റും'],

    carouselEyebrow: 'ഫീൽഡ് ദൃശ്യങ്ങളും തത്സമയ പ്രവർത്തനങ്ങളും',
    carouselTitle: 'ഗ്രാമീണ ഭാരതത്തിൽ കിസാൻ മിത്രയുടെ മുന്നേറ്റം',
    startAsFarmer: 'കർഷകനായി ആരംഭിക്കുക →',
    startAsBuyer: 'വാങ്ങുന്നയാളായി ആരംഭിക്കുക →',
    carouselSlides: [
      {
        badge: 'വിപണി വില വിവരങ്ങൾ',
        overlayText: 'വിളകൾ ഒരിക്കലും യഥാർത്ഥ വിപണി മൂല്യത്തേക്കാൾ കുറഞ്ഞ വിലയ്ക്ക് വിൽക്കരുത്.',
        description: '1,200 ലധികം മണ്ടികളിലെ തത്സമയ മോഡൽ നിരക്കുകളും ദേശീയ താങ്ങുവിലയും (MSP) തമ്മിലുള്ള താരതമ്യം.',
      },
      {
        badge: 'സ്ഥിരീകരിച്ച നേരിട്ടുള്ള വ്യാപാരം',
        overlayText: 'ഭക്ഷ്യ സംസ്കരണ കമ്പനികളുമായും വ്യാപാരികളുമായും നേരിട്ട് ബന്ധപ്പെടുക.',
        description: 'ഇടനിലക്കാരെ ഒഴിവാക്കുക. കൃഷിയിടത്തിൽ തന്നെ ഉറപ്പുള്ള കരാറുകളും ഉയർന്ന വരുമാനവും നേടുക.',
      },
      {
        badge: 'പൂർണ്ണ ഗതാഗതവും പേയ്മെന്റും',
        overlayText: 'കൃഷിയിടത്തിൽ നിന്ന് കൊണ്ടുപോകുന്നത് മുതൽ ബാങ്ക് അക്കൗണ്ടിൽ സുരക്ഷിത പണം വരെ.',
        description: 'വിശ്വസനീയമായ വാഹനങ്ങൾ ബുക്ക് ചെയ്യുക, ശീതീകരണ സംഭരണശാലകൾ കണ്ടെത്തുക, ഉൽപ്പന്നം എത്തുമ്പോൾ തൽക്ഷണം പണം നേടുക.',
      },
    ],

    coreCapabilities: 'പ്രധാന സവിശേഷതകൾ',
    transformingAgriTitle: 'ഇന്ത്യൻ കാർഷിക വ്യാപാരത്തിൽ പുതിയ മാറ്റം',
    transformingAgriSubtitle: 'ഇന്ത്യൻ കർഷകരുടെയും FPO കളുടെയും പ്രോസസ്സിംഗ് യൂണിറ്റുകളുടെയും ആവശ്യങ്ങൾക്കായി നിർമ്മിച്ചത്.',

    card1Title: '📈 മികച്ച വില കണ്ടെത്തൽ',
    card1Desc: 'പ്രാദേശിക വിപണി നിരക്കുകൾ ദേശീയ MSP യുമായി താരതമ്യം ചെയ്യുകയും വരും ദിവസങ്ങളിലെ വില പ്രവചനം നൽകുകയും ചെയ്യുന്നു.',
    card1Bullet1: 'തത്സമയ AGMARKNET ഡാറ്റ',
    card1Bullet2: 'യാത്രാച്ചെലവ് കുറച്ചുള്ള അറ്റാദായ കണക്കുകൂട്ടൽ',
    card1Bullet3: 'ഏറ്റവും അനുയോജ്യമായ വിൽപ്പന സമയം',

    card2Title: '🤝 സ്ഥിരീകരിച്ച വാങ്ങുന്നവർ',
    card2Desc: 'വിളയുടെ തരം, ദൂരം, അളവ്, വില, വിശ്വാസ്യത സ്കോർ എന്നിവ വിശകലനം ചെയ്യുന്ന സ്മാർട്ട് മാച്ചിംഗ്.',
    card2Bullet1: '100% KYC & GSTIN പരിശോധിച്ച വാങ്ങുന്നവർ',
    card2Bullet2: 'നേരിട്ടുള്ള വിലപേശലും കൗണ്ടർ ഓഫറുകളും',
    card2Bullet3: 'നേരിട്ടുള്ള വാട്ട്‌സ്ആപ്പ് & ആപ്പ് സന്ദേശങ്ങൾ',

    card3Title: '🚚 പൂർണ്ണ ഇടപാട് സുരക്ഷ',
    card3Desc: 'സംയോജിത വാഹനങ്ങളും സംഭരണശാലകളും നിങ്ങളുടെ വിളവ് സുരക്ഷിതമായി എത്തിക്കുന്നു.',
    card3Bullet1: 'ഡിജിറ്റൽ കരാറും ഇ-എഗ്രിമെന്റും',
    card3Bullet2: 'ഘട്ടം ഘട്ടമായുള്ള സുരക്ഷിത പേയ്മെന്റ്',
    card3Bullet3: 'സമീപത്തെ കോൾഡ് സ്റ്റോറേജ് കണ്ടെത്തൽ',

    lifecycleEyebrow: 'വ്യാപാര ചക്രം',
    howItWorksTitle: 'കിസാൻ മിത്ര എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    howItWorksSubtitle: 'രജിസ്ട്രേഷൻ മുതൽ ഉൽപ്പന്ന ഡെലിവറിയും ബാങ്ക് അക്കൗണ്ടിൽ പണം ലഭിക്കുന്നത് വരെ.',
    step1Title: 'രജിസ്ട്രേഷനും ഭാഷാ തിരഞ്ഞെടുപ്പും',
    step1Desc: 'മൊബൈൽ OTP വഴി ലളിതമായ രജിസ്ട്രേഷൻ. മലയാളം, തമിഴ്, തെലുങ്ക്, ഹിന്ദി, ഇംഗ്ലീഷ് ഭാഷകളിൽ ലഭ്യമാണ്.',
    step2Title: 'ലോട്ട് രജിസ്റ്റർ ചെയ്യുക / ആവശ്യം പോസ്റ്റ് ചെയ്യുക',
    step2Desc: 'കർഷകർ വിളയുടെ ഗ്രേഡും പ്രതീക്ഷിക്കുന്ന വിലയും നൽകുന്നു. വാങ്ങുന്നവർ തങ്ങളുടെ ആവശ്യങ്ങൾ പോസ്റ്റ് ചെയ്യുന്നു.',
    step3Title: 'സ്മാർട്ട് പൊരുത്തവും ചർച്ചയും',
    step3Desc: 'അനുയോജ്യമായ വാങ്ങുന്നവരെ AI കണ്ടെത്തുന്നു. നേരിട്ടുള്ള ചാറ്റ് വഴി വില അന്തിമമാക്കുക.',
    step4Title: 'സുരക്ഷിത ഗതാഗതവും പേയ്മെന്റും',
    step4Desc: 'ഡിജിറ്റൽ കരാർ, എസ്ക്രോ ഫണ്ട്, വാഹനം ഏർപ്പാടാക്കൽ, ഡെലിവറി സ്ഥിരീകരിച്ച ഉടൻ പണം.',

    copilotEyebrow: 'കാർഷിക AI സഹായി',
    copilotTitle: 'AI കിസാൻ മിത്ര സഹായക്',
    copilotDesc: 'വിപണി വിലകൾ, അടുത്തുള്ള വാങ്ങുന്നവർ, MSP വിശദാംശങ്ങൾ എന്നിവ മലയാളത്തിൽ ചോദിക്കുക.',
    askAiNow: 'AI സഹായിയോട് ചോദിക്കുക →',

    footerLiveSource: 'തത്സമയ ഡാറ്റാ ഉറവിടം: AGMARKNET',
    footerMspSchedule: 'കേന്ദ്ര സർക്കാർ CACP MSP ഷെഡ്യൂൾ 2024-25',
    footerCopyright: '© 2026 കിസാൻ മിത്ര പ്ലാറ്റ്‌ഫോം. ഇന്ത്യൻ കൃഷിക്കായി സമർപ്പിതം.',

    authFarmerTitle: 'കർഷക പോർട്ടൽ',
    authBuyerTitle: 'വാങ്ങുന്നയാളുടെ പോർട്ടൽ',
    authFarmerSubtitle: 'തത്സമയ വിപണി വില, MSP, സ്ഥിരീകരിച്ച വാങ്ങുന്നവർ',
    authBuyerSubtitle: 'കർഷകരിൽ നിന്ന് നേരിട്ട് ഗുണനിലവാരമുള്ള വിളകൾ സംഭരിക്കുക',
    demoFarmerLabel: '⚡ തത്സമയ ഡെമോ കർഷക ലോഗിൻ (1-ക്ലിക്ക്):',
    demoBuyerLabel: '⚡ തത്സമയ ഡെമോ വാങ്ങുന്നയാളുടെ ലോഗിൻ (1-ക്ലിക്ക്):',
    demoFarmerBtn: '🌾 ഡെമോ കർഷകൻ (രമേഷ് കുമാർ - ഗുണ്ടൂർ)',
    demoBuyerBtn: '🏢 ഡെമോ വാങ്ങുന്നയാൾ (രാജേഷ് അഗ്രോ ഫുഡ്സ്)',
    prefLangLabel: 'ഇഷ്ടപ്പെട്ട ഭാഷ (Preferred Language)',
    farmerNameLabel: 'കർഷകൻ / FPO പേര്',
    buyerNameLabel: 'കമ്പനി / മിൽ / വാങ്ങുന്നയാളുടെ പേര്',
    farmerNamePlaceholder: 'കർഷകന്റെ പേര് നൽകുക',
    buyerNamePlaceholder: 'കമ്പനിയുടെ പേര് നൽകുക',
    farmerMobileLabel: 'കർഷകന്റെ മൊബൈൽ (+91)',
    buyerMobileLabel: 'വാങ്ങുന്നയാളുടെ മൊബൈൽ (+91)',
    districtLabel: 'ജില്ല',
    farmerVillageLabel: 'ഗ്രാമം / താലൂക്ക്',
    buyerVillageLabel: 'പ്രൊസസ്സിംഗ് കേന്ദ്രം / പ്രദേശം',
    cropsGrownLabel: 'കൃഷി ചെയ്യുന്ന വിളകൾ',
    cropsNeededLabel: 'വാങ്ങാൻ ഉദ്ദേശിക്കുന്ന വിളകൾ',
    sendOtpFarmerBtn: 'കർഷക വെരിഫിക്കേഷൻ OTP അയക്കുക →',
    sendOtpBuyerBtn: 'വാങ്ങുന്നയാളുടെ വെരിഫിക്കേഷൻ OTP അയക്കുക →',
    enterOtpTitle: '6-അക്ക OTP നൽകുക',
    editDetailsBtn: 'വിവരങ്ങൾ തിരുത്തുക',
    verifyOtpFarmerBtn: 'OTP പരിശോധിച്ച് കർഷക പോർട്ടലിൽ പ്രവേശിക്കുക',
    verifyOtpBuyerBtn: 'OTP പരിശോധിച്ച് വാങ്ങുന്നയാളുടെ പോർട്ടലിൽ പ്രവേശിക്കുക',
  },

  mr: {
    liveArrivalsBadge: 'थेट बाजार भाव व आवक (Live Mandi)',
    agmarknetMspSource: 'भारत सरकार AGMARKNET + CACP MSP',

    navLiveMandi: 'थेट बाजार भाव',
    navDirectBuyers: 'थेट खरेदीदार',
    navLogistics: 'वाहतूक व साठवणूक',
    navHowItWorks: 'हे कसे कार्य करते',
    navAiSahayak: 'AI सहाय्यक',
    loginBtn: 'लॉग इन',
    registerBtn: 'नोंदणी',
    selectPortalSignIn: 'लॉग इनसाठी पोर्टल निवडा',
    selectPortalRegister: 'नोंदणीसाठी पोर्टल निवडा',
    farmerPortal: 'शेतकरी पोर्टल',
    farmerPortalDesc: 'बाजार भाव व हमीभाव (MSP)',
    buyerPortal: 'खरेदीदार पोर्टल',
    buyerPortalDesc: 'थेट खरेदी व करार',
    topMenuFeatures: 'प्रमुख वैशिष्ट्ये',
    mobileMandiDesc: 'थेट बाजार दर आणि APMC माहिती',
    mobileBuyersDesc: 'पडताळणी झालेले प्रक्रिया उद्योग व मिल',
    mobileLogisticsDesc: 'शेतावर थेट वाहन बुकिंग व शीतगृह',
    mobileWorkflowDesc: '4 सोप्या टप्प्यांत पारदर्शक व्यापार',
    mobileAiDesc: 'मातृभाषेत डिजिटल कृषी सल्लागार',

    heroBadge: '• कृषी बाजार माहिती व व्यापार मंच',
    heroHeadline: 'शेतातून थेट योग्य खरेदीदारापर्यंत.',
    heroSubheadline: 'उत्तम दर, पडताळलेले खरेदीदार, रीअल-टाइम बाजार भाव आणि विश्वासार्ह वाहतूक — सर्व एकाच मंचावर.',
    farmerCta: '🌾 शेतकरी पोर्टल लॉगिन / नोंदणी',
    buyerCta: '🏢 खरेदीदार पोर्टल लॉगिन / नोंदणी',
    heroQuote: '“शेतकऱ्यांच्या मूलभूत प्रश्नाचे अचूक उत्तर: मी आत्ताच विकावे का, कुठे विकावे आणि कोणाला विकावे?”',

    bridgeEyebrow: 'डिजिटल व्यापार सेतू',
    bridgeTitle: 'शेतकरी आणि खरेदीदारांचा थेट संवाद',
    farmerCardTitle: '🌾 शेतकरी / FPO',
    farmerBullet1: 'A/B/C ग्रेड गुणवत्तेसह डिजिटल लॉट नोंदणी',
    farmerBullet2: 'थेट बाजार भाव व हमीभावाची (MSP) तुलना',
    farmerBullet3: 'वाहतूक खर्च वजा करून निव्वळ नफा कॅल्क्युलेटर',
    openFarmerLogin: 'शेतकरी पोर्टल उघडा',
    engineTitle: '🛡️ किसान मित्र इंजिन',
    engineSubtitle: 'स्मार्ट मॅचिंग व सुरक्षा कवच',
    badgeBetterPrice: '📈 उत्तम दर',
    badgeVerifiedBuyer: '✓ पडताळलेला खरेदीदार',
    badgeFastLogistics: '🚚 जलद वाहतूक',
    badgeMilestoneEscrow: '🔒 सुरक्षित एस्क्रो पेमेंट',
    buyerCardTitle: '🏢 खरेदीदार / प्रक्रिया मिल',
    buyerBullet1: 'घाऊक खरेदी मागणी नोंदवा',
    buyerBullet2: '10,000+ शेतकऱ्यांकडून थेट खरेदी',
    buyerBullet3: 'गुणवत्ता तपासणीसह डिजिटल हस्तांतरण',
    openBuyerLogin: 'खरेदीदार पोर्टल उघडा',
    protectedTransactionLabel: '7-टप्प्यांची सुरक्षित व्यापार प्रक्रिया:',
    flowSteps: ['लॉट निर्मिती', 'स्मार्ट जुळणी', 'दर प्रस्ताव', 'डिजिटल करार', 'एस्क्रो सुरक्षित ठेव', 'वाहतूक', 'वितरण व हमी पेमेंट'],

    carouselEyebrow: 'प्रत्यक्ष शेतातील घडामोडी',
    carouselTitle: 'ग्रामीण भारतात किसान मित्रची भरारी',
    startAsFarmer: 'शेतकरी म्हणून सुरू करा →',
    startAsBuyer: 'खरेदीदार म्हणून सुरू करा →',
    carouselSlides: [
      {
        badge: 'बाजार भाव माहिती',
        overlayText: 'आपला शेतीमाल कधीही बाजार मूल्यापेक्षा कमी दराने विकू नका.',
        description: '1,200 पेक्षा जास्त बाजार समित्यांचे थेट दर आणि राष्ट्रीय किमान आधारभूत किंमत (MSP) यांच्याशी थेट तुलना.',
      },
      {
        badge: 'पडताळणी झालेला थेट व्यापार',
        overlayText: 'अन्न प्रक्रिया उद्योग व व्यापाऱ्यांशी थेट संपर्क साधा.',
        description: 'दलालांवर अवलंबून राहणे थांबवा. शेतातच खात्रीशीर सौदे आणि जास्त नफा मिळवा.',
      },
      {
        badge: 'सुरक्षित वाहतूक व पेमेंट',
        overlayText: 'शेतातून माल उचलण्यापासून ते बँक खात्यात थेट सुरक्षित पैशांपर्यंत.',
        description: 'विश्वासार्ह वाहने बुक करा, शीतगृह शोधा आणि माल पोहोचताच थेट सुरक्षित पैसे मिळवा.',
      },
    ],

    coreCapabilities: 'मुख्य वैशिष्ट्ये',
    transformingAgriTitle: 'भारतीय कृषी व्यापारात नवा बदल',
    transformingAgriSubtitle: 'भारतीय शेतकरी, FPO आणि प्रक्रिया उद्योगांच्या गरजा लक्षात घेऊन तयार केलेले.',

    card1Title: '📈 योग्य दर शोध',
    card1Desc: 'स्थानिक बाजार दरांची राष्ट्रीय MSP शी तुलना करा आणि पुढील 7 दिवसांचा दर अंदाज जाणून घ्या.',
    card1Bullet1: 'थेट AGMARKNET डेटा',
    card1Bullet2: 'वाहतूक खर्च वजा करून निव्वळ नफ्याची गणना',
    card1Bullet3: 'योग्य विक्री वेळेचा अचूक सल्ला',

    card2Title: '🤝 पडताळलेले थेट खरेदीदार',
    card2Desc: 'पिकाची जात, अंतर, प्रमाण, दर आणि विश्वासार्हता स्कोअर तपासणारे स्मार्ट मॅचिंग इंजिन.',
    card2Bullet1: '100% KYC व GSTIN पडताळलेले खरेदीदार',
    card2Bullet2: 'दोन्ही बाजूंचे थेट भाव तोडगे व काउंटर ऑफर',
    card2Bullet3: 'व्हॉट्सॲप व ॲपमध्ये थेट संदेश संवाद',

    card3Title: '🚚 संपूर्ण व्यवहार सुरक्षा',
    card3Desc: 'एकात्मिक वाहतूकदार आणि साठवणूक गोदामे आपला शेतीमाल सुरक्षित पोहोचवतात.',
    card3Bullet1: 'डिजिटल करार व ई-एग्रीमेंट',
    card3Bullet2: 'टप्प्याटप्प्याने सुरक्षित पेमेंट वितरण',
    card3Bullet3: 'जवळपासचे शीतगृह व गोदाम शोध',

    lifecycleEyebrow: 'व्यवहार चक्र',
    howItWorksTitle: 'किसान मित्र कसे कार्य करते',
    howItWorksSubtitle: 'नोंदणीपासून ते शेतीमाल वितरण आणि बँक खात्यात पैसे मिळेपर्यंत.',
    step1Title: 'नोंदणी व भाषा निवड',
    step1Desc: 'मोबाईल OTP द्वारे सोपी नोंदणी. मराठी, हिंदी, इंग्रजी, तेलुगू अशा आपल्या आवडीच्या भाषेत संपूर्ण माहिती.',
    step2Title: 'लॉट नोंदवा / मागणी पोस्ट करा',
    step2Desc: 'शेतकरी पिकाचा दर्जा, ओलावा आणि अपेक्षित दर नोंदवतात. खरेदीदार मागणी पोस्ट करतात.',
    step3Title: 'स्मार्ट जुळणी व चर्चा',
    step3Desc: 'AI इंजिन योग्य खरेदीदाराशी जुळवून देते. थेट चॅटद्वारे भाव नक्की करा.',
    step4Title: 'सुरक्षित वाहतूक व पेमेंट',
    step4Desc: 'डिजिटल करारावर स्वाक्षरी, एस्क्रो फंड, वाहन व्यवस्था आणि मालाची पावती मिळताच त्वरित पैसे.',

    copilotEyebrow: 'कृषी AI सहाय्यक',
    copilotTitle: 'AI किसान मित्र सहाय्यक',
    copilotDesc: 'थेट बाजार दर, जवळचे खरेदीदार, MSP माहिती आणि पीक संरक्षणाबद्दल मराठीत थेट विचारा.',
    askAiNow: 'AI सहाय्यकाला विचारा →',

    footerLiveSource: 'थेट डेटा स्रोत: AGMARKNET',
    footerMspSchedule: 'केंद्र शासन CACP MSP अनुसूची 2024-25',
    footerCopyright: '© 2026 किसान मित्र व्यासपीठ. भारतीय शेतीसाठी समर्पित.',

    authFarmerTitle: 'शेतकरी पोर्टल',
    authBuyerTitle: 'खरेदीदार पोर्टल',
    authFarmerSubtitle: 'थेट बाजार भाव, MSP आणि पडताळणी झालेले खरेदीदार',
    authBuyerSubtitle: 'शेतकऱ्यांकडून थेट दर्जेदार शेतीमालाची खरेदी',
    demoFarmerLabel: '⚡ 1-क्लिक झटपट डेमो शेतकरी लॉगिन:',
    demoBuyerLabel: '⚡ 1-क्लिक झटपट डेमो खरेदीदार लॉगिन:',
    demoFarmerBtn: '🌾 डेमो शेतकरी (रमेश कुमार - गुंटूर)',
    demoBuyerBtn: '🏢 डेमो खरेदीदार (राजेश ॲग्रो फूड्स)',
    prefLangLabel: 'पसंतीची भाषा (Preferred Language)',
    farmerNameLabel: 'शेतकरी / FPO नाव',
    buyerNameLabel: 'कंपनी / मिल / खरेदीदाराचे नाव',
    farmerNamePlaceholder: 'शेतकऱ्याचे नाव प्रविष्ट करा',
    buyerNamePlaceholder: 'कंपनीचे नाव प्रविष्ट करा',
    farmerMobileLabel: 'शेतकरी मोबाईल (+91)',
    buyerMobileLabel: 'खरेदीदार व्यावसायिक मोबाईल (+91)',
    districtLabel: 'जिल्हा',
    farmerVillageLabel: 'गाव / तालुका',
    buyerVillageLabel: 'प्रक्रिया केंद्र / परिसर',
    cropsGrownLabel: 'पिकवली जाणारी पिके',
    cropsNeededLabel: 'खरेदीसाठी आवश्यक पिके',
    sendOtpFarmerBtn: 'शेतकरी पडताळणी OTP पाठवा →',
    sendOtpBuyerBtn: 'खरेदीदार पडताळणी OTP पाठवा →',
    enterOtpTitle: '6-अंकी OTP टाका',
    editDetailsBtn: 'माहिती बदला',
    verifyOtpFarmerBtn: 'OTP पडताळा आणि शेतकरी पोर्टलमध्ये प्रवेश करा',
    verifyOtpBuyerBtn: 'OTP पडताळा आणि खरेदीदार पोर्टलमध्ये प्रवेश करा',
  },
};
