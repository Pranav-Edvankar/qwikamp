import { CycleProduct, ServiceCard, Booking, UserStats } from './types';

export const BATTERY_SVG_DATA = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="100%" height="100%"><defs><radialGradient id="neonGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23CAEF00" stop-opacity="0.15" /><stop offset="100%" stop-color="%23CAEF00" stop-opacity="0" /></radialGradient><linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232D3139" /><stop offset="30%" stop-color="%231E2229" /><stop offset="70%" stop-color="%2312151A" /><stop offset="100%" stop-color="%23090B0D" /></linearGradient><linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23FFFFFF" stop-opacity="0.15" /><stop offset="50%" stop-color="%23FFFFFF" stop-opacity="0" /><stop offset="100%" stop-color="%23000000" stop-opacity="0.4" /></linearGradient><linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%2312151A" /><stop offset="100%" stop-color="%231F242E" /></linearGradient><radialGradient id="lockGrad" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="%2394A3B8" /><stop offset="70%" stop-color="%23475569" /><stop offset="100%" stop-color="%231E293B" /></radialGradient><radialGradient id="dropShadow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23000000" stop-opacity="0.6" /><stop offset="100%" stop-color="%23000000" stop-opacity="0" /></radialGradient></defs><circle cx="250" cy="350" r="220" fill="url(%23neonGlow)" /><ellipse cx="230" cy="610" rx="140" ry="25" fill="url(%23dropShadow)" /><g transform="rotate(-5, 250, 350)"><path d="M 120 540 L 150 565 L 180 565 L 150 540 Z" fill="%23334155" opacity="0.8" /><path d="M 140 550 L 310 260 L 320 265 L 150 555 Z" fill="%231E293B" /><path d="M 330 110 C 345 105, 365 115, 375 130 L 395 180 C 400 190, 400 205, 395 215 L 225 565 C 215 585, 185 595, 160 580 L 125 560 C 105 545, 105 520, 115 500 L 285 160 Z" fill="url(%23bodyGrad)" stroke="%23000000" stroke-width="2" /><path d="M 330 110 C 345 105, 365 115, 375 130 L 395 180 C 400 190, 400 205, 395 215 L 225 565" fill="none" stroke="%23FFFFFF" stroke-width="3" opacity="0.12" /><path d="M 285 240 C 290 230, 320 220, 330 170 L 260 310 C 220 390, 180 470, 140 550 L 155 550 L 270 320 Z" fill="%230B0D10" opacity="0.9" /><path d="M 285 240 C 290 230, 320 220, 330 170" fill="none" stroke="%23CAEF00" stroke-width="1.5" opacity="0.5" /><path d="M 315 135 L 355 120 L 375 155 L 335 170 Z" fill="url(%23panelGrad)" stroke="%23090B0D" stroke-width="1.5" /><circle cx="330" cy="148" r="4" fill="%23CAEF00" /><circle cx="340" cy="144" r="4" fill="%23CAEF00" /><circle cx="350" cy="140" r="4" fill="%23CAEF00" /><circle cx="360" cy="136" r="4" fill="%231E293B" /><rect x="325" y="158" width="12" height="6" rx="3" fill="%23334155" /><circle cx="331" cy="161" r="1.5" fill="%23475569" /><circle cx="170" cy="510" r="12" fill="url(%23lockGrad)" stroke="%230F172A" stroke-width="1.5" /><circle cx="170" cy="510" r="8" fill="%231E293B" /><rect x="168" y="504" width="4" height="12" rx="1" fill="%23475569" /><text x="210" y="440" fill="%23475569" font-family="monospace" font-size="10" font-weight="bold" transform="rotate(-60, 210, 440)" letter-spacing="2">QWIK-VOLT BMS v4.2</text></g></svg>';

export const CYCLE_PRODUCTS: CycleProduct[] = [
  {
    id: 'qwik-volt-carbon-r',
    name: 'QWIK-VOLT CARBON R',
    category: 'FLAGSHIP BIKE',
    price: 3499,
    rating: 4.9,
    reviewsCount: 240,
    // High-quality minimalist bike photo from Unsplash
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    tag: 'LIMITED EDITION',
    description: 'Our ultimate performance electric urban bike. Boasting an ultra-light aerospace-grade monocoque carbon fiber frame, integrated battery, and silent carbon belt drive, the Carbon R is engineered to dominate city streets.',
    specs: {
      range: '75 miles',
      speed: '28 mph',
      weight: '31.2 lbs',
      battery: '500Wh Samsung Cells',
      frame: 'Toray T800 Carbon Fiber'
    },
    colors: ['#E2E8F0', '#1E293B', '#CAEF00']
  },
  {
    id: 'qwik-gravel-x',
    name: 'QWIK-GRAVEL ULTRALIGHT',
    category: 'ALL-TERRAIN EV',
    price: 2899,
    rating: 4.8,
    reviewsCount: 118,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    tag: 'BEST SELLER',
    description: 'Adventure without boundaries. The Gravel Ultralight blends high-torque hub motor capabilities with flared gravel handlebars and robust tubeless-ready tires to handle dirt paths and asphalt seamlessly.',
    specs: {
      range: '65 miles',
      speed: '25 mph',
      weight: '35.4 lbs',
      battery: '420Wh Panasonic Cells',
      frame: 'Custom Hydroformed Alloy'
    },
    colors: ['#0F172A', '#475569', '#3F6212']
  },
  {
    id: 'qwik-city-stealth',
    name: 'QWIK-CITY STEALTH S',
    category: 'URBAN COMMUTER',
    price: 1999,
    rating: 4.7,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1544192240-4a34feb0104c?auto=format&fit=crop&w=800&q=80',
    tag: 'NEW LAUNCH',
    description: 'An elegant, low-maintenance single speed electric commuter bike featuring hidden integrated cabling, active hydraulic disc brakes, and dynamic torque sensing for super smooth pedal assistance.',
    specs: {
      range: '50 miles',
      speed: '20 mph',
      weight: '34.0 lbs',
      battery: '360Wh LG Cells',
      frame: '6061 Double-Butted Aluminum'
    },
    colors: ['#1E293B', '#B91C1C', '#0F766E']
  },
  {
    id: 'qwik-volt-battery-pack',
    name: 'QWIK-VOLT High-Capacity Battery Pack',
    category: 'ECOSYSTEM UPGRADE',
    price: 399,
    rating: 4.9,
    reviewsCount: 156,
    image: BATTERY_SVG_DATA,
    tag: 'ESSENTIAL SPARES',
    description: 'Sleek, wrapped high-density lithium battery cells with neon accents. Guaranteed to deliver 30% more range with active intelligent cooling and smart battery management system.',
    specs: {
      range: '+25 Miles (Boost)',
      speed: 'Optimized Discharge',
      weight: '4.8 lbs',
      battery: 'QWIK-VOLT Cells',
      frame: 'N/A'
    },
    colors: ['#0F172A', '#CAEF00'],
    isPart: true
  },
  {
    id: 'qwik-battery-cell',
    name: 'Replacement EV Battery Cell',
    category: 'ESSENTIAL SPARES',
    price: 199,
    rating: 4.8,
    reviewsCount: 92,
    image: BATTERY_SVG_DATA,
    tag: 'ECOSYSTEM UPGRADE',
    description: 'Direct drop-in replacement lithium battery cells. Certified for high-duty cycling, extreme temperature resistance, and ultra-fast charging capabilities.',
    specs: {
      range: '+15 Miles (Boost)',
      speed: 'Standard Discharge',
      weight: '2.1 lbs',
      battery: 'Premium LG Chem Cells',
      frame: 'N/A'
    },
    colors: ['#1E293B', '#38BDF8'],
    isPart: true
  }
];

export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'repair',
    title: 'REPAIR YOUR CYCLE',
    description: 'Identify issues & book instant repairs.',
    iconType: 'wrench',
    colorTheme: 'amber',
    longDescription: 'Direct mechanical repairs for punctures, chain breakages, gear indexing issues, hydraulic brake bleeds, or minor structural alignments.',
    priceEstimate: '₹2,500 - ₹11,000'
  },
  {
    id: 'service',
    title: 'SERVICE YOUR CYCLE',
    description: 'Choose customizable maintenance tune-ups.',
    iconType: 'shield',
    colorTheme: 'green',
    longDescription: 'Comprehensive premium maintenance. Covers firmware diagnostics, battery health checkups, motor tuning, sensor calibration, wheel truing, and deep drive-train wash.',
    priceEstimate: '₹7,500 - ₹17,000'
  },
  {
    id: 'buy',
    title: 'BUY CYCLES & GEAR',
    description: 'Explore premium electric cycles and order online.',
    iconType: 'shopping-bag',
    colorTheme: 'blue',
    longDescription: 'Browse custom performance electric bikes, modular utility racks, replacement tires, high-capacity lock systems, and protective smart helmets.',
    priceEstimate: 'Custom'
  },
  {
    id: 'doorstep',
    title: 'DOORSTEP SERVICE',
    description: 'Get your cycle repaired at your home convenience.',
    iconType: 'truck',
    colorTheme: 'purple',
    longDescription: 'No time to visit our Hub? Our certified QWIKAMP EV mechanics will drive to your location with a fully equipped mobile workstation van.',
    priceEstimate: '+₹3,200 Call-out Fee'
  }
];

export const INITIAL_USER_STATS: UserStats = {
  name: 'Pranav Canva',
  email: 'pranavcanva15@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  joinedDate: 'October 2025',
  cycleModel: 'QWIK-VOLT CARBON R',
  totalMiles: 1248,
  co2SavedKg: 499.2, // ~0.4kg per mile saved vs. average car
  batteryHealth: 98,
  serviceIntervalDays: 45 // Days remaining until recommended routine service
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-9804',
    serviceId: 'doorstep',
    serviceName: 'Doorstep Hydraulic Brake Bleed & Rotor Adjustment',
    cycleModel: 'QWIK-VOLT CARBON R',
    date: 'July 10, 2026',
    timeSlot: '10:00 AM - 12:00 PM',
    location: '450 Mission St, San Francisco, CA',
    status: 'technician_dispatched',
    price: 68,
    notes: 'Slightly spongy rear brake lever feel, squeaking rotors under hard braking.',
    steps: [
      {
        title: 'Booking Confirmed',
        description: 'Service scheduled & certified mobile technician assigned.',
        time: 'July 08, 2026 at 3:15 PM',
        completed: true,
        active: false
      },
      {
        title: 'Workstation Packed',
        description: 'Parts & tools checked for QWIK-VOLT series.',
        time: 'July 08, 2026 at 5:00 PM',
        completed: true,
        active: false
      },
      {
        title: 'Technician Dispatched',
        description: 'Mobile Service Van #14 is heading to your doorstep.',
        time: 'Active Now',
        completed: false,
        active: true
      },
      {
        title: 'Diagnostics & Repair',
        description: 'Estimated service duration of 45 minutes.',
        time: 'Awaiting arrival',
        completed: false,
        active: false
      },
      {
        title: 'Completed & Certified',
        description: 'Digital service invoice & battery diagnostics report generated.',
        time: 'Awaiting repair',
        completed: false,
        active: false
      }
    ]
  },
  {
    id: 'BK-9122',
    serviceId: 'service',
    serviceName: '500-Mile Complete Hub-Diagnostic Tune-Up',
    cycleModel: 'QWIK-VOLT CARBON R',
    date: 'May 14, 2026',
    timeSlot: '2:00 PM - 4:00 PM',
    location: 'San Francisco Hub (SoMa)',
    status: 'completed',
    price: 129,
    notes: 'Routine service. Motor firmware upgraded to v2.4.2.',
    steps: [
      {
        title: 'Booking Confirmed',
        description: 'Scheduled at San Francisco Hub (SoMa).',
        time: 'May 12, 2026',
        completed: true,
        active: false
      },
      {
        title: 'Cycle Received',
        description: 'Pre-service inspection finished.',
        time: 'May 14, 2026 at 2:05 PM',
        completed: true,
        active: false
      },
      {
        title: 'Tune-Up & Diagnostic Complete',
        description: 'Firmware updated, chain tensioned, bolts torque-checked.',
        time: 'May 14, 2026 at 3:10 PM',
        completed: true,
        active: false
      },
      {
        title: 'Completed',
        description: 'Cycle collected by user. 90-day warranty active.',
        time: 'May 14, 2026 at 3:45 PM',
        completed: true,
        active: false
      }
    ]
  }
];
