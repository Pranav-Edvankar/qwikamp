import React, { useState, useEffect, useRef, FormEvent, TouchEvent, MouseEvent, WheelEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Bike, Star, Award, Check, ChevronDown, ChevronUp, 
  MapPin, Calendar, Clock, AlertCircle, Sparkles, Shield, Search, X,
  Plus, Minus, RotateCcw, Locate, List, Camera, Info, Truck, Percent,
  Zap, Lock
} from 'lucide-react';
import { Booking } from '../types';

interface QuotePolicyDisclaimerProps {
  returnFee: number;
  isDarkMode?: boolean;
}

const QuotePolicyDisclaimer: React.FC<QuotePolicyDisclaimerProps> = ({ returnFee, isDarkMode }) => {
  return (
    <div className={`rounded-xl p-3 border text-left select-text ${isDarkMode ? 'bg-amber-950/20 border-amber-900/40 text-amber-300' : 'bg-amber-50/50 border-amber-100/60 text-slate-600'}`}>
      <p className="text-[11px] leading-normal">
        💡 <strong>Please Note:</strong> This amount is a preliminary estimate. A final itemized quotation will be provided after structural inspection at the repair center. You retain full control to accept or decline the final quote. If declined, the mandatory return delivery fee of ₹{returnFee.toFixed(2)} remains payable.
      </p>
    </div>
  );
};

interface DeliverySlabWidgetProps {
  repairCost: number;
  isDarkMode?: boolean;
}

const DeliverySlabWidget: React.FC<DeliverySlabWidgetProps> = ({ repairCost, isDarkMode }) => {
  const isSlab1 = repairCost <= 800;
  const isSlab2 = repairCost > 800 && repairCost <= 1500;
  const isSlab3 = repairCost > 1500;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm mb-4 text-left select-none ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-white border-slate-200/80'}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Truck className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`} />
        <h4 className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
          DELIVERY CHARGE SLABS
        </h4>
      </div>

      <div className="space-y-3">
        {/* Row 1 */}
        <div className="flex justify-between items-center">
          <span className={`text-xs ${isSlab1 ? `font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}` : 'text-slate-400 font-medium'}`}>
            Repair Cost up to ₹800
          </span>
          {isSlab1 ? (
            <span className={`border rounded-lg px-2 py-0.5 text-xs font-bold ${isDarkMode ? 'bg-lime-950/40 border-lime-800 text-[#CAEF00]' : 'bg-lime-50 border-lime-300 text-slate-900'}`}>
              ₹169 + GST
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              ₹169 + GST
            </span>
          )}
        </div>

        {/* Row 2 */}
        <div className="flex justify-between items-center">
          <span className={`text-xs ${isSlab2 ? `font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}` : 'text-slate-400 font-medium'}`}>
            Repair Cost ₹801 to ₹1500
          </span>
          {isSlab2 ? (
            <span className={`border rounded-lg px-2 py-0.5 text-xs font-bold ${isDarkMode ? 'bg-lime-950/40 border-lime-800 text-[#CAEF00]' : 'bg-lime-50 border-lime-300 text-slate-900'}`}>
              ₹129 + GST
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              ₹129 + GST
            </span>
          )}
        </div>

        {/* Row 3 */}
        <div className="flex justify-between items-center">
          <span className={`text-xs ${isSlab3 ? `font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}` : 'text-slate-400 font-medium'}`}>
            Repair Cost above ₹1500
          </span>
          {isSlab3 ? (
            <span className={`border rounded-lg px-2 py-0.5 text-xs font-bold ${isDarkMode ? 'bg-lime-950/40 border-lime-800 text-[#CAEF00]' : 'bg-lime-50 border-lime-300 text-slate-900'}`}>
              ₹99 + GST
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              ₹99 + GST
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface DeliveryTaxSummaryWidgetProps {
  repairCost: number;
  isDarkMode?: boolean;
}

const DeliveryTaxSummaryWidget: React.FC<DeliveryTaxSummaryWidgetProps> = ({ repairCost, isDarkMode }) => {
  let base = 99;
  let label = 'Repair Cost above ₹1500';
  if (repairCost <= 800) {
    base = 169;
    label = 'Repair Cost up to ₹800';
  } else if (repairCost <= 1500) {
    base = 129;
    label = 'Repair Cost ₹801 to ₹1500';
  }

  const cgst = Number((base * 0.09).toFixed(2));
  const sgst = Number((base * 0.09).toFixed(2));
  const totalTax = Number((base * 0.18).toFixed(2));
  const total = Number((base + totalTax).toFixed(2));

  return (
    <div className={`rounded-2xl border p-5 shadow-sm mb-4 text-left select-none ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-white border-slate-200/80'}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Percent className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`} />
        <h4 className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
          MATHEMATICAL TAX SUMMARY
        </h4>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Base Delivery Fee ({label})</span>
          <span className={`font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>₹{base.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Central GST (CGST 9%)</span>
          <span className={`font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">State GST (SGST 9%)</span>
          <span className={`font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>₹{sgst.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between items-center text-xs border-t pt-2 ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100/50'}`}>
          <span className="text-slate-500 font-medium">Total GST Tax (18%)</span>
          <span className={`font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>₹{totalTax.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between items-center text-xs border rounded-xl p-2.5 mt-1 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
          <span className={`font-bold ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-900'}`}>Total Pickup & Drop Fee</span>
          <span className={`font-extrabold px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-lime-950/40 border border-lime-800/40 text-[#CAEF00]' : 'bg-lime-100/60 text-slate-950'}`}>
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const getDeliveryFee = (price: number): number => {
  if (price <= 800) return 199.42;
  if (price <= 1500) return 152.22;
  return 116.82;
};

interface RepairViewProps {
  initialServiceType?: 'repair' | 'service' | 'doorstep';
  initialView?: 'plans' | 'hubs';
  onNavigate: (tab: 'Home' | 'Cycle Shop' | 'Repair' | 'Bookings' | 'Profile', params?: any) => void;
  onAddBooking: (booking: {
    serviceId: string;
    serviceName: string;
    cycleModel: string;
    date: string;
    timeSlot: string;
    location: string;
    notes?: string;
    price: number;
  }) => void;
  onDrawerOpenChange?: (isOpen: boolean) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface ServicePlan {
  id: string;
  title: string;
  price: number;
  badge?: string;
  badgeColor?: string;
  icon: 'bike' | 'star' | 'award';
  features: string[];
  initialVisibleCount: number;
}

const SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'basic',
    title: 'Basic Servicing',
    price: 413,
    badge: 'TRIAL COVER',
    badgeColor: 'text-blue-600 bg-blue-50 border-blue-100',
    icon: 'bike',
    features: [
      'Gear Tune-up',
      'Hubs Checks & Alignments of free-wheel',
      'Bottom Bracket Check-up',
      'Check and adjust brakes',
      'Check and Lube Chain & Cables',
      'Wipe clean the bicycle'
    ],
    initialVisibleCount: 3
  },
  {
    id: 'standard',
    title: 'Standard Servicing',
    price: 649,
    badge: 'MOST POPULAR',
    badgeColor: 'text-amber-600 bg-amber-50 border-amber-100',
    icon: 'star',
    features: [
      'Gear Tune-up',
      'Hubs Checks & Alignments of free-wheel',
      'Bottom Bracket Check-up',
      'Check and adjust brakes',
      'Check and Lube Chain & Cables',
      'Wipe clean the bicycle',
      'Wheel truing (one wheel band)',
      'Checking bolt nuts to correct pressure',
      'Checking and tightening all components and bolts',
      'Derailleur Hanger adjustment'
    ],
    initialVisibleCount: 4
  },
  {
    id: 'premium',
    title: 'Premium Servicing',
    price: 1003,
    badge: 'PREMIUM CARE',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    icon: 'award',
    features: [
      'Bike Wash',
      'Basic Tune-up',
      'Lubrication of key joints',
      'Full frame wipe down',
      'Safety diagnostics inspection',
      'Gear and brake adjustments',
      'Checking all bolts to manufacturer\'s specifications',
      'Check wheel truing both wheels',
      'Tighten spoke tension on all wheels'
    ],
    initialVisibleCount: 4
  }
];

interface ServiceHub {
  id: string;
  name: string;
  distance: string;
  distanceVal: number;
  address: string;
  hours: string;
  rating: number;
  openNow: boolean;
}

const SERVICE_HUBS: ServiceHub[] = [
  {
    id: 'qwikamp-sf-hub',
    name: 'QWIKAMP SF Hub',
    distance: '0.3 km away',
    distanceVal: 0.3,
    address: '120 Mission St, SoMa, San Francisco',
    hours: '10:00 AM - 6:00 PM',
    rating: 4.5,
    openNow: true,
  },
  {
    id: 'speedtech-hub',
    name: 'SpeedTech Service Hub',
    distance: '1.2 km away',
    distanceVal: 1.2,
    address: 'Marina District, San Francisco',
    hours: '9:00 AM - 8:00 PM',
    rating: 4.8,
    openNow: true,
  },
  {
    id: 'firefox-hub',
    name: 'Firefox Bikes Hub',
    distance: '1.8 km away',
    distanceVal: 1.8,
    address: 'Mission District, San Francisco',
    hours: '9:00 AM - 8:00 PM',
    rating: 4.6,
    openNow: true,
  },
  {
    id: 'mumbai-moto-hub',
    name: 'Bay Area Moto Care',
    distance: '4.5 km away',
    distanceVal: 4.5,
    address: 'Soma Industrial Area, San Francisco',
    hours: '8:00 AM - 9:00 PM',
    rating: 4.4,
    openNow: false,
  }
];

interface PartAction {
  name: string;
  label: string;
  price: number;
  description: string;
}

interface PartItem {
  id: string;
  name: string;
  actions: PartAction[];
}

const PARTS_DATA: PartItem[] = [
  {
    id: 'CHAIN',
    name: 'CHAIN',
    actions: [
      { name: 'Chain Check & Tensioning', label: 'Check', price: 50, description: 'Inspect chain tension, align links, and lubricate with high-performance wet lube' },
      { name: 'New Chain Replacement', label: 'New', price: 100, description: 'Install premium rust-resistant heavy-duty electric vehicle chain' },
      { name: 'Chain Repair & Link Fix', label: 'Repair', price: 80, description: 'Remove stiff or damaged links, replace connection pins, and balance drivetrain' }
    ]
  },
  {
    id: 'TYRE',
    name: 'TYRE',
    actions: [
      { name: 'Puncture Fix & Tubeless Sealant', label: 'Repair', price: 60, description: 'Locate tread leaks, apply vulcanized internal patches, and inject high-viscosity tubeless sealant' },
      { name: 'New High-Grip Tyre Bead', label: 'New', price: 140, description: 'Mount all-weather wire-bead puncture-resistant dynamic compound tyre' },
      { name: 'Wheel True & Tension Check', label: 'Check', price: 90, description: 'Calibrate spoke tension and realign wheel rim to eliminate vertical/lateral wobble' }
    ]
  },
  {
    id: 'BRAKES',
    name: 'BRAKES',
    actions: [
      { name: 'Hydraulic Brake Bleed', label: 'Check', price: 150, description: 'Flush stale brake fluid, bleed air bubbles from system, and restore crisp mechanical leverage' },
      { name: 'New Brake Pads', label: 'New', price: 120, description: 'Install high-performance metallic compound disc brake pads for maximum thermal safety' },
      { name: 'Caliper Realignment', label: 'Repair', price: 70, description: 'Re-center hydraulic brake calipers to eliminate rubbing noises and optimize lever throw' }
    ]
  },
  {
    id: 'MOTOR',
    name: 'MOTOR',
    actions: [
      { name: 'Software Diagnostics', label: 'Check', price: 90, description: 'Connect system scanner to extract real-time fault codes, update firmware, and log telemetry' },
      { name: 'Wiring & Contact Check', label: 'Check', price: 60, description: 'Inspect high-voltage harness connectors for moisture ingress and verify terminal continuity' },
      { name: 'Motor Assembly Repair', label: 'Repair', price: 1200, description: 'Deep rebuild of mechanical internals, replacing worn planet gears or sealed bearing stacks' }
    ]
  },
  {
    id: 'PEDALS',
    name: 'PEDALS',
    actions: [
      { name: 'Pedal Thread Cleaning & Greasing', label: 'Check', price: 40, description: 'Clean crank threads, apply waterproof anti-seize grease, and torque pedals to specification' },
      { name: 'New Non-Slip Platform Pedals', label: 'New', price: 110, description: 'Install ultra-wide high-traction polymer pedals with dual sealed bearings' },
      { name: 'Crank Arm Realignment', label: 'Repair', price: 80, description: 'Repair stripped threads using precision helicoil inserts or realign bent aluminum crank arms' }
    ]
  },
  {
    id: 'HANDLEBAR',
    name: 'HANDLEBAR',
    actions: [
      { name: 'Grip Replacement & Ergonomics', label: 'New', price: 50, description: 'Install soft dual-density locking grips and adjust roll angle to relieve wrist fatigue' },
      { name: 'Stem Bolt Torqueing & Alignment', label: 'Check', price: 30, description: 'Verify stem clamp torque values and realign bar with front wheel fork assembly' },
      { name: 'Handlebar Riser Adjustment', label: 'Repair', price: 60, description: 'Raise or lower cockpit height using anodized aluminum spacer rings and lock stem' }
    ]
  },
  {
    id: 'SEAT & STEM',
    name: 'SEAT & STEM',
    actions: [
      { name: 'Saddle Tilt & Position Tuning', label: 'Check', price: 30, description: 'Calibrate rail fore-aft position and saddle nose angle for optimal sit-bone support' },
      { name: 'Dropper Post Service & Bleeding', label: 'Repair', price: 120, description: 'Service remote cable actuation tension or bleed hydraulic dropper seatpost lines' },
      { name: 'New Comfort Gel Saddle', label: 'New', price: 180, description: 'Install medical-grade relief gel memory foam saddle with breathable central ventilation' }
    ]
  },
  {
    id: 'GEAR SET',
    name: 'GEAR SET',
    actions: [
      { name: 'Derailleur Hanger Alignment', label: 'Repair', price: 90, description: 'Straighten bent derailleur frame hangers using a precision laser alignment tool' },
      { name: 'Cable Tension Indexing', label: 'Check', price: 70, description: 'Micro-adjust shifter cable tension barrel adjusters for crisp, silent gear changes' },
      { name: 'New Shifter & Slick Cable', label: 'New', price: 210, description: 'Install ultra-low friction stainless steel inner cables and fresh outer housings' }
    ]
  }
];

interface UploadSlotWidgetProps {
  imgUrl?: string;
  onUpload: () => void;
  onRemove: () => void;
  index: number;
  isDarkMode?: boolean;
}

const UploadSlotWidget: React.FC<UploadSlotWidgetProps> = ({ imgUrl, onUpload, onRemove, index, isDarkMode }) => {
  if (imgUrl) {
    return (
      <div className={`w-16 h-16 rounded-xl overflow-hidden relative border shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`} id={`upload-slot-active-${index}`}>
        <img src={imgUrl} className="w-full h-full object-cover" alt="Verification" referrerPolicy="no-referrer" />
        <button 
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 bg-slate-950/80 hover:bg-slate-950 text-white p-1 rounded-full transition-colors z-10"
          id={`upload-slot-active-remove-${index}`}
        >
          <X className="w-3 h-3 stroke-[3]" />
        </button>
      </div>
    );
  }

  return (
    <button 
      type="button"
      onClick={onUpload}
      className={`w-16 h-16 border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'}`}
      id={`upload-slot-placeholder-${index}`}
    >
      <Camera className="w-5 h-5 text-slate-400 mb-1" />
      <span className="text-[8px] font-black tracking-wider text-slate-400 leading-none uppercase">ADD PHOTO</span>
    </button>
  );
};

interface AddressBannerWidgetProps {
  address: string;
  onChangeClick: () => void;
  id?: string;
  isDarkMode?: boolean;
}

const AddressBannerWidget: React.FC<AddressBannerWidgetProps> = ({ address, onChangeClick, id, isDarkMode }) => {
  return (
    <div className="flex flex-col w-full" id={id}>
      {/* Top Line: Keep the green pin container inline with the bold header */}
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 text-[#10B981] ${isDarkMode ? 'bg-emerald-950/40' : 'bg-emerald-50'}`}>
          <MapPin className="w-5 h-5" />
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>Saved Home Address</p>
      </div>

      {/* Middle Line: complete home address string in full-bleed text */}
      <p className={`text-xs mt-3 leading-normal ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
        {address}
      </p>

      {/* Bottom Line: place a clean, wide secondary text button capsule directly beneath */}
      <button
        type="button"
        onClick={onChangeClick}
        className={`mt-3.5 w-full py-2.5 border text-[10px] font-black rounded-xl transition-colors uppercase tracking-wider cursor-pointer text-center ${isDarkMode ? 'bg-[#1E293B] hover:bg-[#334155] border-slate-700 text-[#F8FAFC]' : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-800'}`}
        id={`${id}-change-btn`}
      >
        CHANGE ADDRESS
      </button>
    </div>
  );
};

const SAVED_LOCATIONS = [
  { id: 'home', label: 'Saved Home Address', address: 'QWIKAMP SF Hub, 120 Mission St, SoMa, San Francisco' },
  { id: 'office', label: 'Saved Office Address', address: '350 Bush St, Financial District, San Francisco' },
  { id: 'gym', label: 'Saved Gym Address', address: 'Marina District, San Francisco, CA' }
];

export default function RepairView({ onNavigate, onAddBooking, initialView, initialServiceType, onDrawerOpenChange, isDarkMode = false, onToggleDarkMode }: RepairViewProps) {
  const [viewState, setViewState] = useState<'plans' | 'hubs' | 'troubleshoot'>(
    initialServiceType === 'repair' ? 'hubs' : (initialView || 'plans')
  );
  const [selectedHub, setSelectedHub] = useState<string>('QWIKAMP SF Hub');
  const [searchQueryHubs, setSearchQueryHubs] = useState('');
  const [activeHubFilter, setActiveHubFilter] = useState<'Nearest' | 'Top Rated' | 'Open Now'>('Nearest');

  // Troubleshoot view states
  const [searchQueryParts, setSearchQueryParts] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('CHAIN');
  const [selectedActions, setSelectedActions] = useState<{ partId: string; actionName: string; price: number }[]>([
    { partId: 'CHAIN', actionName: 'Chain Check & Tensioning', price: 50 }
  ]);
  const [modelName, setModelName] = useState('QWIK-VOLT CARBON R');
  const [cycleColor, setCycleColor] = useState('Neon Lime');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [issueDetails, setIssueDetails] = useState('');
  const [serviceAddress, setServiceAddress] = useState('450 Mission St, San Francisco, CA');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const getTodayFormattedString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [troubleshootDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [troubleshootTime, setTroubleshootTime] = useState<string>('09:00 AM - 01:00 PM');

  const formatHour12 = (hour24: number) => {
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${String(h).padStart(2, '0')}:00 ${period}`;
  };

  const getSameDayPickupInfo = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    let startHour = 9;
    if (currentHour < 9) {
      startHour = 9;
    } else if (currentMinutes > 0) {
      startHour = currentHour + 1;
    } else {
      startHour = currentHour;
    }

    // Cutoff check: 7:00 PM (19:00) hard cutoff. After 7:00 PM (7:01 PM or later), booking is disabled.
    if (currentHour > 19 || (currentHour === 19 && currentMinutes > 0) || startHour > 19) {
      return {
        isPastCutoff: true,
        slots: []
      };
    }

    interface PickupSlot {
      id: string;
      period: 'Morning' | 'Afternoon' | 'Evening';
      range: string;
    }

    const slots: PickupSlot[] = [];

    if (startHour < 13) {
      slots.push({
        id: 'slot-morning',
        period: 'Morning',
        range: '09:00 AM - 01:00 PM'
      });
      slots.push({
        id: 'slot-afternoon',
        period: 'Afternoon',
        range: '01:00 PM - 05:00 PM'
      });
      slots.push({
        id: 'slot-evening',
        period: 'Evening',
        range: '05:00 PM - 08:00 PM'
      });
    } else if (startHour < 17) {
      slots.push({
        id: 'slot-afternoon',
        period: 'Afternoon',
        range: '01:00 PM - 05:00 PM'
      });
      slots.push({
        id: 'slot-evening',
        period: 'Evening',
        range: '05:00 PM - 08:00 PM'
      });
    } else {
      slots.push({
        id: 'slot-evening',
        period: 'Evening',
        range: '05:00 PM - 08:00 PM'
      });
    }

    return {
      isPastCutoff: false,
      slots
    };
  };

  const sameDayInfo = getSameDayPickupInfo();

  useEffect(() => {
    if (!sameDayInfo.isPastCutoff && sameDayInfo.slots.length > 0) {
      const validRanges = sameDayInfo.slots.map(s => s.range);
      if (!validRanges.includes(troubleshootTime)) {
        setTroubleshootTime(sameDayInfo.slots[0].range);
      }
    }
  }, [sameDayInfo.slots, sameDayInfo.isPastCutoff]);

  // Bottom sheet state: collapsed (peek), focused (detailed info), or list (list of hubs)
  const [sheetState, setSheetState] = useState<'collapsed' | 'focused' | 'list'>('focused');

  // Map zoom and pan interaction states
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    // Don't start panning if clicking a pin or map marker elements
    if (target.closest('.cursor-pointer')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isPanning) return;
    setMapPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Touch support for mobile devices
  const [touchStartMap, setTouchStartMap] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStartMap = (e: TouchEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target.closest('.cursor-pointer')) return;
    if (e.touches.length === 1) {
      setTouchStartMap({ x: e.touches[0].clientX - mapPan.x, y: e.touches[0].clientY - mapPan.y });
    }
  };

  const handleTouchMoveMap = (e: TouchEvent<SVGSVGElement>) => {
    if (!touchStartMap || e.touches.length !== 1) return;
    setMapPan({
      x: e.touches[0].clientX - touchStartMap.x,
      y: e.touches[0].clientY - touchStartMap.y
    });
  };

  const handleTouchEndMap = () => {
    setTouchStartMap(null);
  };

  const handleWheel = (e: WheelEvent<SVGSVGElement>) => {
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setMapZoom(prev => Math.max(0.6, Math.min(2.5, prev * zoomFactor)));
  };

  const handleDoubleClick = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target.closest('.cursor-pointer')) return;
    setMapZoom(prev => Math.min(prev + 0.3, 2.5));
  };

  const getSheetHeight = () => {
    if (sheetState === 'collapsed') return '76px';
    if (sheetState === 'list') return '58%';
    return '38%';
  };

  const getToggleBottom = () => {
    if (sheetState === 'collapsed') return '92px';
    if (sheetState === 'list') return 'calc(58% + 12px)';
    return 'calc(38% + 12px)';
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 35; // threshold in px to snap
    if (info.offset.y < -threshold) {
      // dragged upwards
      if (sheetState === 'collapsed') {
        setSheetState('focused');
      } else if (sheetState === 'focused') {
        setSheetState('list');
        const bounds = getFitBoundsForFilter(activeHubFilter);
        if (bounds) {
          setMapZoom(bounds.zoom);
          setMapPan(bounds.pan);
        }
      }
    } else if (info.offset.y > threshold) {
      // dragged downwards
      if (sheetState === 'list') {
        setSheetState('focused');
      } else if (sheetState === 'focused') {
        handleCollapseSheet();
      }
    }
  };

  const selectAndCenterHub = (hubName: string) => {
    setSelectedHub(hubName);
    const hub = SERVICE_HUBS.find(h => h.name === hubName);
    if (!hub) return;
    
    let x = 150;
    let y = 240;
    if (hub.id === 'qwikamp-sf-hub') { x = 130; y = 140; }
    else if (hub.id === 'speedtech-hub') { x = 270; y = 160; }
    else if (hub.id === 'firefox-hub') { x = 200; y = 380; }
    else if (hub.id === 'mumbai-moto-hub') { x = 70; y = 280; }

    setMapZoom(1.4);
    setMapPan({
      x: (175 - x) * 1.4,
      y: (190 - y) * 1.4
    });
    setSheetState('focused');
  };

  const handleCollapseSheet = () => {
    setSheetState('collapsed');
    const bounds = getFitBoundsForFilter(activeHubFilter);
    if (bounds) {
      setMapZoom(bounds.zoom);
      setMapPan(bounds.pan);
    } else {
      setMapZoom(1);
      setMapPan({ x: 0, y: 0 });
    }
  };

  const handleSelectHub = (hubName: string, pinX: number, pinY: number) => {
    setSelectedHub(hubName);
    setMapZoom(1.4);
    setMapPan({
      x: (175 - pinX) * 1.4,
      y: (190 - pinY) * 1.4
    });
    setSheetState('focused');
  };

  const getFitBoundsForFilter = (filter: 'Nearest' | 'Top Rated' | 'Open Now', query = searchQueryHubs) => {
    // Determine which hubs are active under this filter
    const activeHubs = SERVICE_HUBS.filter(hub => {
      const matchesSearch = hub.name.toLowerCase().includes(query.toLowerCase()) || 
                            hub.address.toLowerCase().includes(query.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'Open Now') return hub.openNow;
      if (filter === 'Top Rated') return hub.rating >= 4.5;
      return true; // Nearest shows all
    });

    if (activeHubs.length === 0) return null;

    // Get coordinates for active hubs
    const coords = activeHubs.map(hub => {
      let x = 150;
      let y = 240;
      if (hub.id === 'qwikamp-sf-hub') { x = 130; y = 140; }
      else if (hub.id === 'speedtech-hub') { x = 270; y = 160; }
      else if (hub.id === 'firefox-hub') { x = 200; y = 380; }
      else if (hub.id === 'mumbai-moto-hub') { x = 70; y = 280; }
      return { x, y, name: hub.name };
    });

    const minX = Math.min(...coords.map(c => c.x));
    const maxX = Math.max(...coords.map(c => c.x));
    const minY = Math.min(...coords.map(c => c.y));
    const maxY = Math.max(...coords.map(c => c.y));

    const w = maxX - minX;
    const h = maxY - minY;

    // Safe visual padding dimensions (viewport is 350x500)
    // To make sure all matched elements are comfortably within the visible area
    const safeWidth = 240;
    const safeHeight = 220;

    let z = 1.0;
    if (w > 0 && h > 0) {
      const zoomX = safeWidth / w;
      const zoomY = safeHeight / h;
      z = Math.max(0.75, Math.min(1.4, Math.min(zoomX, zoomY)));
    } else {
      z = 1.3; // Default zoom if single hub matches
    }

    // Center coordinates of matched bounding box
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // Translate relative to center midpoint (175, 200) to account for bottom sheet
    const tx = (175 - cx) * z;
    const ty = (200 - cy) * z;

    return { zoom: z, pan: { x: tx, y: ty }, hubs: activeHubs };
  };

  const applyHubFilter = (filter: 'Nearest' | 'Top Rated' | 'Open Now') => {
    setActiveHubFilter(filter);
    
    const bounds = getFitBoundsForFilter(filter);
    if (bounds) {
      setMapZoom(bounds.zoom);
      setMapPan(bounds.pan);
      
      // Auto-select the first hub of the filtered list if current selection is no longer matching or visible
      const isCurrentSelectedValid = bounds.hubs.some(h => h.name === selectedHub);
      if (!isCurrentSelectedValid && bounds.hubs.length > 0) {
        setSelectedHub(bounds.hubs[0].name);
      }
    }
  };

  useEffect(() => {
    if (initialServiceType === 'repair') {
      setViewState('hubs');
    } else if (initialView) {
      setViewState(initialView);
    }
  }, [initialView, initialServiceType]);

  // Tabs for sub-navigation header: "Plans" and "My Bookings"
  const [activeSubTab, setActiveSubTab] = useState<'Plans' | 'My Bookings'>('Plans');
  const [selectedMatrixPlanIdx, setSelectedMatrixPlanIdx] = useState<number>(1); // 0 = Basic, 1 = Standard, 2 = Premium
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Auto-hide the swipe hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const [carouselTouchX, setCarouselTouchX] = useState<number | null>(null);

  const handleCarouselTouchStart = (e: TouchEvent) => {
    setCarouselTouchX(e.touches[0].clientX);
  };

  const handleCarouselTouchEnd = (e: TouchEvent) => {
    if (carouselTouchX === null) return;
    const diffX = carouselTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped left -> Next card
        setSelectedMatrixPlanIdx(prev => Math.min(2, prev + 1));
      } else {
        // Swiped right -> Prev card
        setSelectedMatrixPlanIdx(prev => Math.max(0, prev - 1));
      }
    }
    setCarouselTouchX(null);
  };

  const filteredHubs = SERVICE_HUBS.filter(hub => {
    const matchesSearch = hub.name.toLowerCase().includes(searchQueryHubs.toLowerCase()) || 
                          hub.address.toLowerCase().includes(searchQueryHubs.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeHubFilter === 'Open Now') {
      return hub.openNow;
    }
    if (activeHubFilter === 'Top Rated') {
      return hub.rating >= 4.5;
    }
    return true;
  }).sort((a, b) => {
    if (activeHubFilter === 'Top Rated') {
      return b.rating - a.rating;
    }
    return a.distanceVal - b.distanceVal;
  });

  // Tracks which plans are expanded for viewing more features
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({
    basic: false,
    standard: true, // Standard open by default for premium layout density
    premium: false
  });

  // State for booking scheduler modal
  const [selectedPlanForBooking, setSelectedPlanForBooking] = useState<ServicePlan | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'location' | 'details'>('details');
  const [cycleModel, setCycleModel] = useState<string>('QWIK-VOLT CARBON R');
  const [appointmentDate, setAppointmentDate] = useState<string>('2026-07-10');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [locationType, setLocationType] = useState<'hub' | 'doorstep'>('doorstep');
  const [doorstepAddress, setDoorstepAddress] = useState<string>('QWIKAMP SF Hub, 120 Mission St, SoMa, San Francisco');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // New Booking Address selection drawer state
  const [showBookingAddressDrawer, setShowBookingAddressDrawer] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('');

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setTimeout(() => {
        setDoorstepAddress('120 Mission St, SoMa, San Francisco, CA');
        setIsDetectingLocation(false);
      }, 800);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDoorstepAddress(`120 Mission St, SoMa, San Francisco (GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°W)`);
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setTimeout(() => {
          setDoorstepAddress('120 Mission St, SoMa, San Francisco, CA');
          setIsDetectingLocation(false);
        }, 1000);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selectedPlanForBooking and showEstimateModal state to parent components (to conditionally hide bottom navbar)
  useEffect(() => {
    onDrawerOpenChange?.(!!selectedPlanForBooking || showEstimateModal);
    return () => {
      onDrawerOpenChange?.(false);
    };
  }, [selectedPlanForBooking, showEstimateModal, onDrawerOpenChange]);

  useEffect(() => {
    if (selectedPlanForBooking) {
      setCheckoutStep('details');
    }
  }, [selectedPlanForBooking]);

  const toggleExpandPlan = (planId: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleOpenBookingModal = (plan: ServicePlan) => {
    setSelectedPlanForBooking(plan);
  };

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForBooking) return;

    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      setIsSubmitting(false);
      
      const doorstepFee = getDeliveryFee(selectedPlanForBooking.price);
      const finalPrice = selectedPlanForBooking.price + (locationType === 'doorstep' ? doorstepFee : 0);
      const loc = locationType === 'doorstep' ? doorstepAddress : selectedHub;
      
      onAddBooking({
        serviceId: selectedPlanForBooking.id,
        serviceName: `${selectedPlanForBooking.title} Package`,
        cycleModel,
        date: new Date(appointmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        timeSlot,
        location: loc,
        notes: notes.trim() || 'No additional details provided.',
        price: finalPrice
      });

      setSelectedPlanForBooking(null);
      // Automatically navigate to Bookings tab to view live tracking state!
      onNavigate('Bookings');
    }, 1200);
  };

  const renderIcon = (type: 'bike' | 'star' | 'award') => {
    const classNames = "w-5 h-5 text-slate-800";
    switch (type) {
      case 'bike':
        return <Bike className={classNames} />;
      case 'star':
        return <Star className={classNames} />;
      case 'award':
        return <Award className={classNames} />;
    }
  };

  const handleToggleAction = (partId: string, actionName: string, price: number) => {
    setSelectedActions(prev => {
      const exists = prev.some(act => act.partId === partId && act.actionName === actionName);
      if (exists) {
        return prev.filter(act => !(act.partId === partId && act.actionName === actionName));
      } else {
        return [...prev, { partId, actionName, price }];
      }
    });
  };

  const removeSelectedAction = (partId: string, actionName: string) => {
    setSelectedActions(prev => prev.filter(act => !(act.partId === partId && act.actionName === actionName)));
  };

  const handleMockUpload = (index: number) => {
    const mockImages = [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1618945037843-441144d1602b?auto=format&fit=crop&w=120&q=80'
    ];
    setUploadedImages(prev => {
      const next = [...prev];
      next[index] = mockImages[index % mockImages.length];
      return next;
    });
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next.filter(Boolean);
    });
  };

  const handleTroubleshootContinue = () => {
    setShowEstimateModal(true);
  };

  const handleConfirmRepairBooking = () => {
    const basePrice = selectedActions.reduce((sum, act) => sum + act.price, 0) || 50;
    const deliveryFee = getDeliveryFee(basePrice);
    const totalEstimatePrice = basePrice + deliveryFee;
    const notesText = `Repair Troubleshoot: ${selectedActions.map(act => `${act.partId} (${act.actionName})`).join(', ')}. Details: ${issueDetails || 'None'}`;
    
    // Convert YYYY-MM-DD from troubleshootDate to "Month Day, Year" format for display
    const formattedDate = troubleshootDate 
      ? new Date(troubleshootDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    onAddBooking({
      serviceId: 'custom-repair-troubleshoot',
      serviceName: 'Custom Diagnostics & Repair',
      cycleModel: modelName,
      date: formattedDate,
      timeSlot: troubleshootTime,
      location: serviceAddress,
      notes: notesText,
      price: Number(totalEstimatePrice.toFixed(2))
    });

    setShowEstimateModal(false);
    onNavigate('Bookings');
  };

  if (viewState === 'troubleshoot') {
    const Total_Parts_Labor_Cost = selectedActions.reduce((sum, act) => sum + act.price, 0) || 50;
    const Base_Delivery_Fee = Total_Parts_Labor_Cost <= 800 ? 169 : (Total_Parts_Labor_Cost <= 1500 ? 129 : 99);
    const Calculated_Tax_Amount = Base_Delivery_Fee * 0.18;
    const Initial_Estimated_Total = Total_Parts_Labor_Cost + Base_Delivery_Fee + Calculated_Tax_Amount;
    
    const activePartItem = PARTS_DATA.find(p => p.id === activeCategory);
    const filteredActions = activePartItem 
      ? activePartItem.actions.filter(act => 
          act.name.toLowerCase().includes(searchQueryParts.toLowerCase()) ||
          act.description.toLowerCase().includes(searchQueryParts.toLowerCase())
        )
      : [];

    return (
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}>
        {/* Navigation Bar */}
        <div className={`border-b pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-3.5 shrink-0 z-10 shadow-xs select-none transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 text-white' : 'bg-white border-slate-200/50 text-slate-900'}`}>
          <div className="relative flex items-center justify-center px-5 min-h-[36px]">
            <button 
              onClick={() => onNavigate('Home')}
              className={`absolute left-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
              id="troubleshoot-back-btn"
            >
              <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
            <h2 className={`text-base font-black tracking-tight text-center uppercase ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
              REPAIR TROUBLESHOOT
            </h2>
            <span className="absolute right-5 text-[9px] font-black tracking-widest text-[#0F172A] bg-[#CAEF00] px-2.5 py-0.5 rounded-md uppercase">
              Garage
            </span>
          </div>
        </div>

        {/* Scrollable Step Cards */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">
          
          {/* Step 1: Component Selection - Category & Choice Cards */}
          <div className={`mb-6 p-5 rounded-2xl border text-left transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-md' : 'bg-white border-slate-200/90 shadow-sm'}`}>
            <div className={`flex items-center space-x-2.5 pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={isDarkMode ? 'bg-[#CAEF00] text-[#0B0F17] font-black text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0' : 'bg-[#0B0F17] text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0'}>
                1
              </div>
              <h3 className={isDarkMode ? 'text-slate-100 font-extrabold text-base tracking-tight' : 'text-slate-900 font-extrabold text-base tracking-tight'}>
                Select Components & Services
              </h3>
            </div>
            
            {/* Search Input field */}
            <div className="relative mb-4 select-none">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQueryParts}
                onChange={(e) => setSearchQueryParts(e.target.value)}
                placeholder="Search parts..."
                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none transition-all ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
              />
            </div>

            {/* Top Horizon Filter Row with fade mask and bleed-out peek */}
            <div className="relative -mx-5 px-5 mb-4 overflow-hidden select-none" id="filter-chip-wrapper">
              <div className={`flex overflow-x-auto pb-2.5 scrollbar-none border-b pr-16 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`} id="filter-chip-scroll-container">
                {['CHAIN', 'TYRE', 'BRAKES', 'MOTOR', 'PEDALS', 'HANDLEBAR', 'SEAT & STEM', 'GEAR SET'].map(cat => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-none w-[28vw] mr-3 py-2.5 rounded-full text-[9px] font-black tracking-tight transition-all cursor-pointer uppercase text-center truncate px-1.5 ${
                        isActive 
                          ? isDarkMode ? 'bg-[#F8FAFC] text-slate-950 font-bold' : 'bg-[#0F172A] text-white shadow-xs' 
                          : isDarkMode ? 'bg-[#1E293B] text-slate-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      id={`filter-chip-${cat.toLowerCase().replace(/\s/g, '-')}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {/* Edge-Fading Linear Mask over absolute right edge */}
              <div className={`absolute right-0 top-0 bottom-2.5 w-8 pointer-events-none z-10 bg-gradient-to-r from-transparent ${isDarkMode ? 'to-[#161D2A]' : 'to-white'}`} id="filter-chip-fade-mask" />
            </div>

            {/* Flat Choice Cards (Direct Action) */}
            <div className="space-y-3">
              {filteredActions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No matching services found in this category.</p>
              ) : (
                filteredActions.map(action => {
                  const isSelected = selectedActions.some(
                    act => act.partId === activeCategory && act.actionName === action.name
                  );
                  return (
                    <div
                      key={action.name}
                      onClick={() => handleToggleAction(activeCategory, action.name, action.price)}
                      className={`flex items-start space-x-3.5 rounded-xl border p-4 cursor-pointer transition-all select-none ${
                        isSelected 
                          ? isDarkMode ? 'border-[#CAEF00] bg-[#1E293B] ring-1 ring-[#CAEF00]/30' : 'border-[#CAEF00] bg-[#CAEF00]/5 ring-1 ring-[#CAEF00]/30' 
                          : isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Left: Large checkbox block */}
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                        isSelected 
                          ? 'bg-[#CAEF00] border-[#CAEF00] text-[#0F172A]' 
                          : isDarkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3.5] text-[#0F172A]" />}
                      </div>

                      {/* Center: Typography */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                          {action.name}
                        </h4>
                        <p className={`text-[10px] font-medium leading-relaxed mt-1 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                          {action.description}
                        </p>
                      </div>

                      {/* Right: Price tag */}
                      <div className="shrink-0">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${isDarkMode ? 'text-[#F8FAFC] bg-slate-800' : 'text-[#0F172A] bg-slate-100'}`}>
                          ₹{action.price}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Dismissible Chips */}
            {selectedActions.length > 0 && (
              <div className={`flex flex-wrap gap-2 mt-4 pt-3.5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                {selectedActions.map((act, idx) => (
                  <div 
                    key={idx}
                    className={`inline-flex items-center space-x-1.5 font-black text-[10px] px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-slate-900 text-[#F8FAFC]' : 'bg-slate-100 text-slate-800'}`}
                  >
                    <span>{act.partId} - {act.actionName.replace('Chain ', '').replace('Brake ', '').replace('Motor ', '').replace('Battery ', '').replace('Puncture ', '').replace('New ', '').replace('Wheel ', '')} (₹{act.price})</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedAction(act.partId, act.actionName)}
                      className={`transition-colors cursor-pointer ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Cycle Characteristics Inputs */}
          <div className={`mb-6 p-5 rounded-2xl border text-left transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-md' : 'bg-white border-slate-200/90 shadow-sm'}`}>
            <div className={`flex items-center space-x-2.5 pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={isDarkMode ? 'bg-[#CAEF00] text-[#0B0F17] font-black text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0' : 'bg-[#0B0F17] text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0'}>
                2
              </div>
              <h3 className={isDarkMode ? 'text-slate-100 font-extrabold text-base tracking-tight' : 'text-slate-900 font-extrabold text-base tracking-tight'}>
                Cycle Characteristics
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className={`text-[9px] font-black uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  CYCLE MODEL NAME
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. QWIK-VOLT CARBON R"
                  className={`w-full rounded-xl px-3.5 py-3 text-xs font-bold focus:outline-none transition-all border ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[9px] font-black uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  CYCLE COLOR
                </label>
                <input
                  type="text"
                  value={cycleColor}
                  onChange={(e) => setCycleColor(e.target.value)}
                  placeholder="e.g. Neon Lime"
                  className={`w-full rounded-xl px-3.5 py-3 text-xs font-bold focus:outline-none transition-all border ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Pickup Time Slot (Same-Day Express Only) */}
          <div className={`mb-6 p-5 rounded-2xl border text-left transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-md' : 'bg-white border-slate-200/90 shadow-sm'}`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b gap-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center space-x-2.5">
                <div className={isDarkMode ? 'bg-[#CAEF00] text-[#0B0F17] font-black text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0' : 'bg-[#0B0F17] text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0'}>
                  3
                </div>
                <h3 className={isDarkMode ? 'text-slate-100 font-extrabold text-base tracking-tight' : 'text-slate-900 font-extrabold text-base tracking-tight'}>
                  Pickup Time Slot
                </h3>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-xs font-semibold w-fit ${
                isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                Same-Day • Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>

            {sameDayInfo.isPastCutoff ? (
              <div className={`p-4 rounded-xl flex gap-3 items-start ${
                isDarkMode 
                  ? 'bg-amber-950/40 border border-amber-800/60' 
                  : 'bg-amber-50 border border-amber-300'
              }`}>
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className={`font-extrabold text-sm mb-1 flex items-center gap-1.5 ${
                    isDarkMode ? 'text-amber-200' : 'text-amber-950'
                  }`}>
                    Same-Day Booking Cutoff Reached (7:00 PM)
                  </p>
                  <p className={`font-semibold text-xs leading-relaxed ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    Same-day express pickups close at 7:00 PM to ensure our delivery partners can complete all pickups before our 8:00 PM operational closing time. Please check back tomorrow morning at 9:00 AM.
                  </p>
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                      isDarkMode ? 'bg-[#CAEF00] text-[#0B0F17]' : 'bg-slate-900 text-white'
                    }`}>
                      <Lock className="w-3.5 h-3.5" />
                      Priority First-Slot Locked for Tomorrow Morning (9:00 AM)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Horizontal Slot Cards with Period-Based Titles */}
                <div className="space-y-2">
                  {sameDayInfo.slots.map((slot) => {
                    const isSelected = troubleshootTime === slot.range;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => setTroubleshootTime(slot.range)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-[#CAEF00]/15 border-2 border-[#CAEF00] text-slate-100'
                              : 'bg-[#CAEF00]/10 border-2 border-[#CAEF00] text-slate-900'
                            : isDarkMode
                              ? 'bg-[#161D2A] border border-slate-800 text-slate-300 hover:border-slate-700'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {/* Left Side: Radio Circle + Period Title & Sub-window */}
                        <div className="flex items-center space-x-3">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? 'bg-[#CAEF00] border-[#CAEF00] text-[#0B0F17]'
                              : isDarkMode
                                ? 'border-slate-600 bg-transparent'
                                : 'border-slate-300 bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5] text-[#0B0F17]" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${
                              isDarkMode ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              {slot.period}
                            </span>
                            <span className={`text-xs font-medium ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              ({slot.range})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer ETA Expectation Note */}
                <div className={`mt-3 pt-3 border-t space-y-1.5 ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <div className={`text-xs font-semibold flex items-center gap-1.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                    <span>Operating Hours: 9:00 AM – 8:00 PM Daily</span>
                  </div>
                  <div className={`text-xs font-medium flex items-center gap-1.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                    <span>Pickup ETA: 1–2 hrs in normal conditions (up to 6 hrs during peak demand).</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Visual Verification Media Row */}
          <div className={`mb-6 p-5 rounded-2xl border text-left transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-md' : 'bg-white border-slate-200/90 shadow-sm'}`}>
            <div className={`flex items-center space-x-2.5 pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={isDarkMode ? 'bg-[#CAEF00] text-[#0B0F17] font-black text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0' : 'bg-[#0B0F17] text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0'}>
                4
              </div>
              <h3 className={isDarkMode ? 'text-slate-100 font-extrabold text-base tracking-tight' : 'text-slate-900 font-extrabold text-base tracking-tight'}>
                Upload Issue Photos (Optional)
              </h3>
            </div>
            <div className="flex flex-col space-y-4 w-full">
              {/* Top Row (Instructional Text) - flat text, no boxed background */}
              <div className={`flex items-start gap-2.5 text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} id="upload-tip-panel">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="font-medium">
                  Upload close-up photos of the specific issue (like loose chains, worn brakes, or leaks) to receive a more accurate upfront diagnostic estimate.
                </p>
              </div>

              {/* Bottom Row (Media Strip) - full horizontal width */}
              <div className="flex flex-row gap-3 items-center overflow-x-auto scrollbar-none py-1 w-full" id="dynamic-upload-strip">
                <AnimatePresence initial={false}>
                  {uploadedImages.map((imgUrl, index) => (
                    <motion.div
                      key={`uploaded-${index}-${imgUrl}`}
                      initial={{ opacity: 0, scale: 0.85, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      layout
                    >
                      <UploadSlotWidget
                        index={index}
                        imgUrl={imgUrl}
                        onUpload={() => {}}
                        onRemove={() => handleRemoveImage(index)}
                        isDarkMode={isDarkMode}
                      />
                    </motion.div>
                  ))}
                  {uploadedImages.length < 3 && (
                    <motion.div
                      key="upload-trigger"
                      initial={{ opacity: 0, scale: 0.85, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      layout
                    >
                      <UploadSlotWidget
                        index={uploadedImages.length}
                        onUpload={() => handleMockUpload(uploadedImages.length)}
                        onRemove={() => {}}
                        isDarkMode={isDarkMode}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Step 5: Contextual Description & Location Cards */}
          <div className={`mb-6 p-5 rounded-2xl border text-left transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-md' : 'bg-white border-slate-200/90 shadow-sm'}`}>
            <div className={`flex items-center space-x-2.5 pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={isDarkMode ? 'bg-[#CAEF00] text-[#0B0F17] font-black text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0' : 'bg-[#0B0F17] text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0'}>
                5
              </div>
              <h3 className={isDarkMode ? 'text-slate-100 font-extrabold text-base tracking-tight' : 'text-slate-900 font-extrabold text-base tracking-tight'}>
                Issue Details (Optional)
              </h3>
            </div>
            <textarea
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              placeholder="Optional: Mention custom gear ratios, spongy braking, or minor frame squeaks..."
              rows={3}
              className={`w-full rounded-xl px-4 py-3 text-xs focus:outline-none transition-all resize-none font-medium border ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC] placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
            />
          </div>

          {/* Service Address Card */}
          <div className={`mb-6 p-5 rounded-2xl border text-left transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-md' : 'bg-white border-slate-200/90 shadow-sm'}`}>
            <div className={`pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <h3 className={isDarkMode ? 'text-slate-100 font-extrabold text-base tracking-tight' : 'text-slate-900 font-extrabold text-base tracking-tight'}>
                Repair Location
              </h3>
            </div>
            <AddressBannerWidget
              id="service-address-banner"
              address={serviceAddress}
              onChangeClick={() => setShowAddressModal(true)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Sticky Action Layer */}
        <div className={`border-t p-4 shrink-0 z-10 transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200/40 shadow-[0_-8px_30px_rgb(15,23,42,0.06)]'}`}>
          <div className="px-1 pb-[calc(env(safe-area-inset-bottom,16px))]">
            <button
              type="button"
              onClick={handleTroubleshootContinue}
              className="w-full py-4 bg-[#CAEF00] text-[#0F172A] font-black tracking-wider rounded-2xl hover:bg-[#b0d000] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 uppercase text-xs cursor-pointer shadow-md"
            >
              <span>Request Service</span>
            </button>
          </div>
        </div>

        {/* Change Address Modal */}
        <AnimatePresence>
          {showAddressModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 z-50 flex items-end justify-center select-none"
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className={`rounded-t-3xl w-full p-6 space-y-4 shadow-xl text-left transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] text-white border-t border-slate-800' : 'bg-white text-slate-900'}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`text-sm font-black uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Change Service Address</h3>
                  <button 
                    onClick={() => setShowAddressModal(false)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input 
                  type="text"
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  placeholder="Enter service address..."
                  className={`w-full border rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'}`}
                />
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="w-full py-3.5 bg-[#CAEF00] text-slate-950 font-black rounded-xl text-xs uppercase"
                >
                  Save Address
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estimate / Quote Summary Modal */}
        <AnimatePresence>
          {showEstimateModal && (
            <div className="fixed inset-0 bg-slate-950/60 z-[100] flex flex-col justify-end">
              {/* Backdrop click closer */}
              <div className="absolute inset-0" onClick={() => setShowEstimateModal(false)} />

              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className={`relative z-10 max-h-[85vh] flex flex-col rounded-t-[32px] w-full overflow-hidden shadow-2xl text-left border-t transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`}
              >
                {/* Fixed Header (Non-scrolling) */}
                <div className={`flex-none p-5 pb-3 border-b bg-inherit ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  {/* Top drag indicator */}
                  <div className={`w-12 h-1 rounded-full mx-auto mb-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  
                  <div className="flex justify-between items-center">
                    <h3 className={`text-sm font-black uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Repair Estimate</h3>
                    <button 
                      onClick={() => setShowEstimateModal(false)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Body Container */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain">
                  {/* Unified Cost Summary Component */}
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors duration-200 ${isDarkMode ? 'bg-[#1E293B] border-slate-800/60' : 'bg-slate-50 border-[#CAD5E2]'}`}>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">VEHICLE DETAILS</span>
                      <p className={`text-xs font-black mt-0.5 uppercase ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>{modelName} ({cycleColor})</p>
                    </div>

                    <div className={`border-t pt-3.5 space-y-2.5 ${isDarkMode ? 'border-slate-800' : 'border-[#CAD5E2]'}`}>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">REPAIR ITEM BREAKDOWN</span>
                      
                      {selectedActions.length === 0 ? (
                        <div className={`flex justify-between items-start text-xs border-b pb-2.5 ${isDarkMode ? 'border-slate-800' : 'border-[#CAD5E2]'}`}>
                          <div>
                            <p className={`font-black uppercase text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>DIAGNOSTICS</p>
                            <p className={`text-[10px] font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Standard Diagnostic Inspection</p>
                          </div>
                          <span className={`font-black shrink-0 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>₹50</span>
                        </div>
                      ) : (
                        selectedActions.map((act, index) => {
                          const part = PARTS_DATA.find(p => p.id === act.partId);
                          const action = part?.actions.find(a => a.name === act.actionName);
                          const description = action?.description || act.actionName;

                          return (
                            <div key={index} className={`flex justify-between items-start text-xs border-b pb-2.5 ${isDarkMode ? 'border-slate-800' : 'border-[#CAD5E2]'}`}>
                              <div className="pr-4">
                                <p className={`font-black uppercase text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{act.partId}</p>
                                <p className={`text-[10px] font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
                              </div>
                              <span className={`font-black shrink-0 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>₹{act.price}</span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className={`border-t pt-3.5 space-y-2.5 ${isDarkMode ? 'border-slate-800' : 'border-[#CAD5E2]'}`}>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">ESTIMATE SUMMARY</span>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold">Repair Cost (Parts & Labor)</span>
                        <span className={`font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>₹{Total_Parts_Labor_Cost.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold">Pickup & Drop Charge</span>
                        <span className={`font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>₹{Base_Delivery_Fee.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold">Estimated GST Tax (18%)</span>
                        <span className={`font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>₹{Calculated_Tax_Amount.toFixed(2)}</span>
                      </div>

                      <div className={`border-t my-3 ${isDarkMode ? 'border-slate-800' : 'border-[#CAD5E2]'}`} />

                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-black uppercase ${isDarkMode ? 'text-[#CAEF00]' : 'text-slate-900'}`}>INITIAL ESTIMATED TOTAL</span>
                        <span className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{Initial_Estimated_Total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Slabs & Tax Summary for absolute transparency */}
                  <div className="space-y-0">
                    <DeliverySlabWidget repairCost={Total_Parts_Labor_Cost} isDarkMode={isDarkMode} />
                    <DeliveryTaxSummaryWidget repairCost={Total_Parts_Labor_Cost} isDarkMode={isDarkMode} />
                  </div>

                  {/* Policy Disclaimer */}
                  <QuotePolicyDisclaimer returnFee={Base_Delivery_Fee + Calculated_Tax_Amount} isDarkMode={isDarkMode} />
                </div>

                {/* Fixed Sticky Footer CTA (Non-scrolling) */}
                <div className={`flex-none p-5 pt-3 border-t bg-inherit pb-8 sm:pb-5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <button
                    onClick={handleConfirmRepairBooking}
                    className="w-full py-4 bg-[#CAEF00] text-slate-950 font-black rounded-2xl text-xs uppercase shadow-md flex items-center justify-center space-x-2 animate-fade-in cursor-pointer"
                  >
                    <span>CONFIRM REPAIR BOOKING</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (viewState === 'hubs') {
    return (
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}>
        {/* Clean Top Navigation Header */}
        <div className={`absolute top-0 inset-x-0 backdrop-blur-md border-b pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-3.5 z-30 select-none transition-colors duration-200 ${
          isDarkMode ? 'bg-[#161D2A]/95 border-slate-800' : 'bg-white/95 border-slate-200/50'
        }`}>
          <div className="relative flex items-center justify-center px-5 min-h-[36px]">
            <button 
              type="button"
              onClick={() => onNavigate('Home')}
              className={`absolute left-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-350' : 'hover:bg-slate-50 text-slate-700'
              }`}
              id="hubs-back-btn"
              title="Go back to home"
            >
              <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
            <h2 className={`text-base font-black tracking-tight text-center uppercase ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              SELECT HUB LOCATION
            </h2>
            <div className="w-8" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Interactive Vector Map Section */}
          <div id="map-container" className="absolute inset-0 w-full h-full overflow-hidden bg-[#F1F5F9] z-0">
            <svg 
              viewBox="0 0 350 500" 
              preserveAspectRatio="xMidYMid slice" 
              className={`w-full h-full select-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStartMap}
              onTouchMove={handleTouchMoveMap}
              onTouchEnd={handleTouchEndMap}
              onWheel={handleWheel}
              onDoubleClick={handleDoubleClick}
            >
              <defs>
                {/* High-end gradients for water and green spaces */}
                <linearGradient id="waterGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDarkMode ? '#082F49' : '#E0F2FE'} />
                  <stop offset="100%" stopColor={isDarkMode ? '#0C4A6E' : '#BAE6FD'} />
                </linearGradient>
                <linearGradient id="parkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDarkMode ? '#022C22' : '#F0FDF4'} />
                  <stop offset="100%" stopColor={isDarkMode ? '#064E3B' : '#DCFCE7'} />
                </linearGradient>
                <pattern id="dotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill={isDarkMode ? '#1E293B' : '#E2E8F0'} />
                </pattern>
              </defs>

              <g 
                transform={`translate(${mapPan.x}, ${mapPan.y}) scale(${mapZoom})`}
                style={{ 
                  transformOrigin: '175px 250px', 
                  transition: isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' 
                }}
              >
                {/* Base land mass with a subtle dot grid overlay */}
                <rect width="350" height="500" fill={isDarkMode ? '#0B0F17' : '#F8FAFC'} />
                <rect width="350" height="500" fill="url(#dotGrid)" />

                {/* Bay Area Water Body (top/right) */}
                <path d="M 230,0 Q 255,160 350,195 L 350,0 Z" fill="url(#waterGradient)" opacity="0.9" />
                {/* Wave accents inside the water body */}
                <path d="M 270,40 Q 290,90 320,110" stroke={isDarkMode ? '#0284C7' : '#93C5FD'} strokeWidth="1.5" strokeDasharray="5,4" fill="none" opacity="0.6" />
                <path d="M 300,20 Q 315,60 340,75" stroke={isDarkMode ? '#0284C7' : '#93C5FD'} strokeWidth="1.5" strokeDasharray="5,4" fill="none" opacity="0.6" />

                {/* Green Parks with styled decorative elements */}
                <path d="M 0,410 Q 55,440 45,500 L 0,500 Z" fill="url(#parkGradient)" stroke={isDarkMode ? '#064E3B' : '#DCFCE7'} strokeWidth="1" />
                <path d="M 290,420 Q 320,440 340,500 L 280,500 Z" fill="url(#parkGradient)" stroke={isDarkMode ? '#064E3B' : '#DCFCE7'} strokeWidth="1" />

                {/* Tiny styled trees inside parks */}
                <circle cx="15" cy="460" r="2.5" fill={isDarkMode ? '#10B981' : '#22C55E'} opacity="0.6" />
                <circle cx="25" cy="480" r="3" fill={isDarkMode ? '#10B981' : '#22C55E'} opacity="0.6" />
                <circle cx="310" cy="465" r="3" fill={isDarkMode ? '#10B981' : '#22C55E'} opacity="0.6" />

                {/* Elegant Gray Road Grids (Primary Arteries) */}
                <path d="M 0,100 L 350,100" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                <path d="M 0,100 L 350,100" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />

                <path d="M 0,350 L 350,350" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                <path d="M 0,350 L 350,350" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />

                <path d="M 120,0 L 120,500" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                <path d="M 120,0 L 120,500" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />

                <path d="M 240,0 L 240,500" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                <path d="M 240,0 L 240,500" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />
                
                {/* Secondary streets */}
                <path d="M 0,220 Q 180,240 350,220" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="3.5" fill="none" opacity="0.85" />
                <path d="M 0,220 Q 180,240 350,220" stroke={isDarkMode ? '#1E293B' : '#F1F5F9'} strokeWidth="1" fill="none" />

                <path d="M 180,0 Q 170,250 180,500" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="3.5" fill="none" opacity="0.85" />
                <path d="M 180,0 Q 170,250 180,500" stroke={isDarkMode ? '#1E293B' : '#F1F5F9'} strokeWidth="1" fill="none" />

                {/* Faint Street Label Texts */}
                <text x="60" y="94" fill={isDarkMode ? '#475569' : '#94A3B8'} fontSize="6.5" fontWeight="bold" letterSpacing="1" className="font-sans select-none pointer-events-none opacity-80 uppercase">
                  Mission Blvd
                </text>
                <text x="60" y="344" fill={isDarkMode ? '#475569' : '#94A3B8'} fontSize="6.5" fontWeight="bold" letterSpacing="1" className="font-sans select-none pointer-events-none opacity-80 uppercase">
                  Soma Avenue
                </text>
                <text x="126" y="200" fill={isDarkMode ? '#475569' : '#94A3B8'} fontSize="6.5" fontWeight="bold" letterSpacing="1" className="font-sans select-none pointer-events-none opacity-80 uppercase" transform="rotate(90, 126, 200)">
                  Marina Drive
                </text>

                {/* Landmark Badges */}
                <g transform="translate(305, 45)" className="opacity-75 pointer-events-none">
                  <text x="0" y="0" fill={isDarkMode ? '#0284C7' : '#0369A1'} fontSize="5.5" fontWeight="black" letterSpacing="0.5" className="font-sans text-center" textAnchor="middle">
                    PACIFIC BAY
                  </text>
                </g>
                <g transform="translate(35, 435)" className="opacity-75 pointer-events-none">
                  <text x="0" y="0" fill={isDarkMode ? '#059669' : '#15803D'} fontSize="5.5" fontWeight="black" letterSpacing="0.5" className="font-sans text-center" textAnchor="middle">
                    MISSION GREEN
                  </text>
                </g>
                
                {/* Pulsing "You Are Here" Marker */}
                <circle cx="150" cy="240" r="22" fill="#3B82F6" fillOpacity="0.06" className="animate-pulse" />
                <circle cx="150" cy="240" r="12" fill="#3B82F6" fillOpacity="0.12" />
                <circle cx="150" cy="240" r="6" fill={isDarkMode ? '#1E293B' : '#FFFFFF'} className="shadow-sm" />
                <circle cx="150" cy="240" r="4" fill="#3B82F6" />

                {/* Pins indicating nearby QWIKAMP service hubs */}
                {SERVICE_HUBS.map((hub) => {
                  let x = 150;
                  let y = 240;
                  if (hub.id === 'qwikamp-sf-hub') { x = 130; y = 140; }
                  if (hub.id === 'speedtech-hub') { x = 270; y = 160; }
                  if (hub.id === 'firefox-hub') { x = 200; y = 380; }
                  if (hub.id === 'mumbai-moto-hub') { x = 70; y = 280; }

                  const isSelected = selectedHub === hub.name;
                  
                  // Dynamic filter checks
                  const matchesSearch = hub.name.toLowerCase().includes(searchQueryHubs.toLowerCase()) || 
                                        hub.address.toLowerCase().includes(searchQueryHubs.toLowerCase());
                  if (!matchesSearch) return null;
                  if (activeHubFilter === 'Open Now' && !hub.openNow) return null;
                  if (activeHubFilter === 'Top Rated' && hub.rating < 4.5) return null;

                  return (
                    <g 
                      key={hub.id} 
                      className="cursor-pointer group"
                      onClick={() => handleSelectHub(hub.name, x, y)}
                    >
                      {/* Pulse highlight ring for active selection */}
                      {isSelected ? (
                        <>
                          <circle cx={x} cy={y - 10} r="22" fill="#CAEF00" fillOpacity="0.2" />
                          <circle cx={x} cy={y - 10} r="14" fill="none" stroke="#CAEF00" strokeWidth="2" fillOpacity="0.3" strokeOpacity="0.8" className="animate-ping" style={{ transformOrigin: `${x}px ${y - 10}px`, animationDuration: '2s' }} />
                        </>
                      ) : (
                        <circle cx={x} cy={y - 10} r="12" fill="#0F172A" fillOpacity="0.04" className="group-hover:fill-opacity-10 transition-all" />
                      )}
                      
                      {/* Pin base shadow */}
                      <ellipse cx={x} cy={y} rx="5" ry="2" fill="#0F172A" fillOpacity="0.25" />

                      {/* Beautiful Custom Map Marker */}
                      <g transform={`translate(${x}, ${y - 10}) scale(${isSelected ? 1.25 : 1})`} className="transition-all duration-300">
                        <path 
                          d="M 0,10 C -5,2 -10,-2 -10,-8 C -10,-14 -5.5,-18 0,-18 C 5.5,-18 10,-14 10,-8 C 10,-2 5,2 0,10 Z" 
                          fill={isSelected ? '#0F172A' : '#FFFFFF'} 
                          stroke={isSelected ? '#CAEF00' : '#0F172A'}
                          strokeWidth="2"
                          className="filter drop-shadow-md"
                        />
                        {/* Tiny icon or letter representation inside the pin */}
                        {isSelected ? (
                          <circle cx="0" cy="-8" r="4.5" fill="#CAEF00" />
                        ) : (
                          <circle cx="0" cy="-8" r="4" fill="#0F172A" />
                        )}
                        {isSelected ? (
                          <path d="M -2,-8 L -0.5,-6.5 L 2,-9.5" stroke="#0F172A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        ) : (
                          <path d="M-1.5 -8 L1.5 -8 M0 -9.5 L0 -6.5" stroke="#FFFFFF" strokeWidth="1" />
                        )}
                      </g>

                      {/* Faint, beautiful hover/inactive mini-badge */}
                      {!isSelected && (
                        <g transform={`translate(${x}, ${y - 32})`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <rect x="-45" y="-16" width="90" height="16" rx="5" fill="#0F172A" />
                          <polygon points="0,3 -3,0 3,0" fill="#0F172A" transform="translate(0, -1)" />
                          <text x="0" y="-6" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" className="font-sans">
                            {hub.name.replace(" Service Hub", "").replace(" Bikes Hub", "")}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Floating Zoom / Reset Map controls on the right */}
            <div className="absolute top-[calc(env(safe-area-inset-top,24px)+135px)] right-4 z-20 flex flex-col space-y-2 select-none">
              <button
                type="button"
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 2.5))}
                className={`w-9 h-9 rounded-full backdrop-blur-md shadow-md border flex items-center justify-center active:scale-90 font-black cursor-pointer transition-transform focus:outline-none ${isDarkMode ? 'bg-[#161D2A]/95 border-slate-800 text-slate-300 hover:text-slate-100' : 'bg-white/95 border-slate-200/40 text-slate-700 hover:text-slate-900'}`}
                title="Zoom In"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
              <button
                type="button"
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.6))}
                className={`w-9 h-9 rounded-full backdrop-blur-md shadow-md border flex items-center justify-center active:scale-90 font-black cursor-pointer transition-transform focus:outline-none ${isDarkMode ? 'bg-[#161D2A]/95 border-slate-800 text-slate-300 hover:text-slate-100' : 'bg-white/95 border-slate-200/40 text-slate-700 hover:text-slate-900'}`}
                title="Zoom Out"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMapZoom(1);
                  setMapPan({ x: 0, y: 0 });
                }}
                className={`w-9 h-9 rounded-full backdrop-blur-md shadow-md border flex items-center justify-center active:scale-90 font-black cursor-pointer transition-transform focus:outline-none ${isDarkMode ? 'bg-[#161D2A]/95 border-slate-800 text-slate-300 hover:text-slate-100' : 'bg-white/95 border-slate-200/40 text-slate-700 hover:text-slate-900'}`}
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  // Center perfectly on the current user position (150, 240)
                  setMapZoom(1.3);
                  setMapPan({ x: 175 - 150 * 1.3, y: 250 - 240 * 1.3 });
                }}
                className={`w-9 h-9 rounded-full backdrop-blur-md shadow-md border flex items-center justify-center active:scale-90 font-black cursor-pointer transition-transform focus:outline-none ${isDarkMode ? 'bg-[#161D2A]/95 border-slate-800 text-[#CAEF00]' : 'bg-white/95 border-slate-200/40 text-[#3B82F6] hover:text-blue-650'}`}
                title="My Location"
              >
                <Locate className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Global Search pill-shaped bar - FLOATING */}
            <div className="absolute top-[calc(env(safe-area-inset-top,24px)+72px)] inset-x-4 z-20 select-none">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQueryHubs}
                  onChange={(e) => setSearchQueryHubs(e.target.value)}
                  placeholder="Search near your location..."
                  className={`w-full pl-12 pr-10 py-3.5 text-sm rounded-full border shadow-xs focus:outline-none focus:ring-2 focus:ring-[#CAEF00] focus:border-transparent transition-all ${isDarkMode ? 'bg-[#161D2A] text-[#F8FAFC] placeholder-slate-500 border-slate-800/80' : 'bg-white text-slate-800 placeholder-slate-400 border-slate-200/50'}`}
                />
                {searchQueryHubs && (
                  <button
                    type="button"
                    onClick={() => setSearchQueryHubs('')}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Floating Segmented Toggle for Active Hub Filters */}
          <motion.div 
            initial={{ bottom: '40.5%' }}
            animate={{ bottom: getToggleBottom() }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute left-1/2 -translate-x-1/2 w-[280px] z-30 select-none"
          >
            <div className={`backdrop-blur-md p-1 rounded-full flex border shadow-lg ${isDarkMode ? 'bg-[#161D2A]/85 border-slate-800' : 'bg-white/85 border-slate-200/40'}`}>
              {(['Nearest', 'Top Rated', 'Open Now'] as const).map((filter) => {
                const isActive = activeHubFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => applyHubFilter(filter)}
                    className={`flex-1 text-center py-2 text-[9.5px] font-black tracking-wider uppercase rounded-full transition-all cursor-pointer ${
                      isActive
                        ? isDarkMode ? 'bg-slate-900 text-[#CAEF00] shadow-xs' : 'bg-white text-[#0F172A] shadow-xs'
                        : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Modern Bottom Sheet Container */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            initial={{ height: '38%' }}
            animate={{ height: getSheetHeight() }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className={`absolute bottom-0 inset-x-0 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-20 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-t border-slate-800' : 'bg-white'}`}
          >
            {/* Centered Premium Drag Handle */}
            <div className={`w-12 h-1.5 rounded-full my-2.5 mx-auto shrink-0 transition-colors cursor-row-resize ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200/80 hover:bg-slate-300'}`} />

            {sheetState === 'collapsed' ? (
              /* COLLAPSED PEEK LAYOUT */
              <div className="px-5 pb-3 h-full flex items-center justify-between select-none">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
                    <MapPin className="w-4.5 h-4.5 text-[#86b500] stroke-[2.5]" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-0.5">Selected Hub</span>
                    <span className={`text-[11px] font-black truncate block max-w-[160px] ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                      {selectedHub}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSheetState('focused')}
                    className="px-3 py-1.5 bg-[#CAEF00] text-[#0F172A] text-[9.5px] font-black rounded-lg uppercase tracking-wider hover:bg-[#b0d000] transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSheetState('list');
                      const bounds = getFitBoundsForFilter(activeHubFilter);
                      if (bounds) {
                        setMapZoom(bounds.zoom);
                        setMapPan(bounds.pan);
                      }
                    }}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-100'}`}
                    title="View All Hubs"
                  >
                    <List className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ) : (
              /* EXPANDED CONTENT (FOCUSED OR LIST) */
              <>
                {sheetState === 'focused' ? (
                  /* FOCUSED ACTION BAR HEADER */
                  <div className={`px-5 pb-2.5 flex items-center justify-between shrink-0 select-none border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100/40'}`}>
                    <button
                      type="button"
                      onClick={handleCollapseSheet}
                      className={`p-1 rounded-lg text-slate-400 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-900 hover:text-slate-200' : 'hover:bg-slate-50 hover:text-slate-600'}`}
                      title="Collapse Panel"
                    >
                      <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Hub Details
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSheetState('list');
                        const bounds = getFitBoundsForFilter(activeHubFilter);
                        if (bounds) {
                          setMapZoom(bounds.zoom);
                          setMapPan(bounds.pan);
                        }
                      }}
                      className={`p-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                      title="View All Hubs List"
                    >
                      <List className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">List</span>
                    </button>
                  </div>
                ) : (
                  /* LIST HEADER */
                  <div className={`px-5 pb-2.5 flex items-center justify-between shrink-0 select-none border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100/40'}`}>
                    <div className="text-left">
                      <h3 className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                        {activeHubFilter} Service Hubs
                      </h3>
                      <span className="text-[8px] text-slate-400 font-extrabold block mt-0.5 uppercase tracking-wider">
                        {filteredHubs.length} locations available
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setSheetState('focused')}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={handleCollapseSheet}
                        className={`p-1 rounded-lg text-slate-400 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-900 hover:text-slate-200' : 'hover:bg-slate-50 hover:text-slate-600'}`}
                        title="Collapse Panel"
                      >
                        <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* BODY AREA */}
                {sheetState === 'focused' ? (
                  /* Single Focused Hub Info Card */
                  (() => {
                    const currentHub = SERVICE_HUBS.find(h => h.name === selectedHub) || SERVICE_HUBS[0];
                    if (!currentHub) return null;
                    return (
                      <div className="px-5 flex-1 flex flex-col justify-center">
                        <div className={`p-3.5 rounded-2xl border select-none shadow-2xs transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100/80'}`}>
                          <div className="flex items-center space-x-3.5 overflow-hidden">
                            <div className={`w-11 h-11 rounded-xl shadow-3xs flex items-center justify-center shrink-0 border transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-[#F8FAFC]' : 'bg-white border-slate-100 text-slate-800'}`}>
                              <Bike className={`w-5.5 h-5.5 stroke-[2] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} />
                            </div>
                            <div className="text-left overflow-hidden">
                              <div className="flex items-center space-x-2">
                                <h4 className={`text-[13.5px] font-black leading-tight truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                                  {currentHub.name}
                                </h4>
                                {currentHub.openNow ? (
                                  <span className="shrink-0 bg-emerald-500/10 text-emerald-600 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded flex items-center">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-ping" />
                                    Open
                                  </span>
                                ) : (
                                  <span className="shrink-0 bg-slate-200 text-slate-500 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded">
                                    Closed
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                                  {currentHub.distance.toUpperCase()}
                                </span>
                                <span className="text-slate-300 text-[10px]">•</span>
                                <span className="text-[9.5px] text-slate-400 font-semibold flex items-center">
                                  <Clock className="w-2.5 h-2.5 text-slate-400 mr-1 stroke-[2.5]" />
                                  {currentHub.hours}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <div className="flex text-amber-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${i < Math.floor(currentHub.rating) ? 'fill-current' : 'text-slate-200'}`} 
                                    />
                                  ))}
                                </div>
                                <span className={`text-[10px] font-black ml-1 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                                  {currentHub.rating}
                                </span>
                                <span className="text-[9px] text-slate-400">
                                  (150+ reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-[#CAEF00] text-[#0F172A] flex items-center justify-center shadow-xs shrink-0 ml-2">
                            <Check className="w-4.5 h-4.5 stroke-[3.5]" />
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* Scrollable List of matching Hubs */
                  <div 
                    onPointerDown={(e) => e.stopPropagation()} 
                    className={`flex-1 overflow-y-auto p-4 space-y-2.5 select-none transition-colors duration-200 ${isDarkMode ? 'bg-slate-950/20' : 'bg-slate-50/40'}`}
                  >
                    {filteredHubs.map((hub) => {
                      const isSelected = selectedHub === hub.name;
                      return (
                        <div
                          key={hub.id}
                          onClick={() => selectAndCenterHub(hub.name)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-3xs ${
                            isSelected 
                              ? isDarkMode ? 'border-[#CAEF00] bg-[#CAEF00]/5 ring-1 ring-[#CAEF00]/30' : 'border-[#CAEF00] ring-1 ring-[#CAEF00]/50'
                              : isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected 
                                ? isDarkMode ? 'bg-[#CAEF00]/20 text-[#CAEF00]' : 'bg-[#CAEF00]/10 text-slate-950'
                                : isDarkMode ? 'bg-slate-950 text-slate-400 border border-slate-800' : 'bg-slate-50 text-slate-400'
                            }`}>
                              <Bike className="w-4.5 h-4.5 stroke-[2]" />
                            </div>
                            
                            <div className="flex-1 min-w-0 text-left space-y-0.5">
                              <div className="flex items-center space-x-1.5">
                                <h4 className={`text-[11.5px] font-black truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                  {hub.name}
                                </h4>
                                {hub.openNow && (
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                )}
                              </div>
                              <p className="text-[9.5px] text-slate-400 font-medium truncate">
                                {hub.address}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm ${isDarkMode ? 'bg-slate-950 border border-slate-800 text-[#F8FAFC]' : 'bg-slate-100 text-[#0F172A]'}`}>
                                  {hub.distance}
                                </span>
                                <span className="text-slate-300 text-[8px]">•</span>
                                <span className="text-amber-500 font-black text-[9px] flex items-center">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                                  {hub.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isSelected 
                              ? isDarkMode ? 'bg-[#CAEF00] text-slate-950 scale-105' : 'bg-[#CAEF00] text-[#0F172A] scale-105'
                              : isDarkMode ? 'bg-slate-950 border border-slate-800 text-slate-700' : 'bg-slate-100 text-slate-300'
                          }`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Anchored Sticky Checkout Footer */}
                <div 
                  onPointerDown={(e) => e.stopPropagation()} 
                  className={`p-5 shrink-0 select-none space-y-3 border-t transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100/80'}`}
                >
                  <div className="flex justify-between items-center px-1">
                    <div className="text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Selected Location</span>
                      <span className={`text-xs font-black truncate block max-w-[190px] ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                        {selectedHub || 'Select a hub above'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Est. Cost</span>
                      <span className={`text-sm font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>₹649</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const selectedHubData = SERVICE_HUBS.find(h => h.name === selectedHub);
                      if (selectedHubData) {
                        setServiceAddress(`${selectedHubData.name}, ${selectedHubData.address}`);
                      } else {
                        setServiceAddress(selectedHub);
                      }
                      setViewState('troubleshoot');
                    }}
                    disabled={!selectedHub}
                    className="w-full py-4 bg-[#CAEF00] text-[#0F172A] font-black tracking-wider rounded-2xl hover:bg-[#b0d000] disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center space-x-2 uppercase text-xs cursor-pointer shadow-md"
                    id="confirm-hubs-btn"
                  >
                    <span>PROCEED TO TROUBLESHOOT</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>

        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}
    >
      {/* 1. TOP NAVIGATION HEADER */}
      <div className={`pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-3.5 shrink-0 z-10 shadow-xs select-none border-b transition-colors duration-200 ${
        isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-white border-slate-200/50'
      }`}>
        <div className="relative flex items-center justify-center px-5 min-h-[36px]">
          {/* Back Arrow */}
          <button 
            onClick={() => onNavigate('Home')}
            className={`absolute left-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
            }`}
            id="back-to-home-btn"
          >
            <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>

          {/* Screen Title */}
          <h2 className={`text-base font-black tracking-tight text-center ${
            isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'
          }`}>
            Service Plans
          </h2>

          {/* QWIKAMP Badge Pill */}
          <span className={`absolute right-5 text-[9px] font-black tracking-widest bg-[#CAEF00] px-2.5 py-0.5 rounded-md uppercase ${
            isDarkMode ? 'text-slate-950' : 'text-[#0F172A]'
          }`}>
            Plans
          </span>
        </div>
      </div>

      {/* 2. PREMIUM INTERACTIVE MATRIX & CAROUSEL LAYOUT */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-3 flex flex-col justify-start space-y-1">
        {activeSubTab === 'Plans' ? (
          <>
            {/* Header intro text with high contrast dark charcoal text */}
            <div className="text-center pb-0.5 select-none shrink-0">
              <p className={`text-[10px] font-black tracking-widest uppercase ${
                isDarkMode ? 'text-[#CAEF00]' : 'text-[#0F172A]'
              }`}>Official QWIKAMP Garage</p>
              <h3 className={`text-[10.5px] font-bold mt-0.5 px-4 leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>Choose a comprehensive diagnostic & tune-up package</h3>
            </div>

            {/* UPPER COMPARISON MATRIX */}
            <div className={`rounded-3xl p-3.5 shadow-xs mb-1.5 select-none flex-1 flex flex-col justify-between transition-colors duration-200 border ${
              isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-white border-slate-100'
            }`}>
              {/* Header Columns */}
              <div className={`flex items-center px-3 py-1.5 rounded-xl mb-1.5 transition-colors ${
                isDarkMode ? 'bg-slate-900/60' : 'bg-slate-100/60'
              }`}>
                <div className={`w-[34%] text-[9px] font-black tracking-wider uppercase text-left ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>Service</div>
                <button 
                  type="button"
                  onClick={() => setSelectedMatrixPlanIdx(0)}
                  className={`w-[22%] text-[9.5px] font-black tracking-wider uppercase text-center transition-all ${
                    selectedMatrixPlanIdx === 0 
                      ? isDarkMode ? 'text-white font-black scale-105' : 'text-[#0F172A] font-black scale-105' 
                      : 'text-slate-400'
                  }`}
                >
                  Basic
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedMatrixPlanIdx(1)}
                  className={`w-[22%] text-[9.5px] font-black tracking-wider uppercase text-center transition-all ${
                    selectedMatrixPlanIdx === 1 
                      ? isDarkMode ? 'text-white font-black scale-105' : 'text-[#0F172A] font-black scale-105' 
                      : 'text-slate-400'
                  }`}
                >
                  Standard
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedMatrixPlanIdx(2)}
                  className={`w-[22%] text-[9.5px] font-black tracking-wider uppercase text-center transition-all ${
                    selectedMatrixPlanIdx === 2 
                      ? isDarkMode ? 'text-white font-black scale-105' : 'text-[#0F172A] font-black scale-105' 
                      : 'text-slate-400'
                  }`}
                >
                  Premium
                </button>
              </div>

              {/* Rows (Spaced cleanly to prevent vertical overflows) */}
              <div className="flex-1 flex flex-col justify-between">
                {[
                  { name: 'Gear Tune-up', basic: true, standard: true, premium: true },
                  { name: 'Brakes Adjust', basic: true, standard: true, premium: true },
                  { name: 'Chain & Cables Lube', basic: true, standard: true, premium: true },
                  { name: 'Bottom Bracket Check', basic: true, standard: true, premium: true },
                  { name: 'Wheel Truing', basic: false, standard: true, premium: true },
                  { name: 'Derailleur Hanger Adj.', basic: false, standard: true, premium: true },
                  { name: 'Deep Wash & Polish', basic: false, standard: false, premium: true },
                  { name: 'Safety Diagnostics', basic: false, standard: false, premium: true },
                ].map((row, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center px-2 py-1 last:border-0 transition-colors flex-1 border-b ${
                      isDarkMode ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-50 hover:bg-slate-50/40'
                    }`}
                  >
                    {/* Service Label */}
                    <div className="w-[34%] text-left">
                      <span className={`text-[10px] font-bold block truncate leading-tight ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{row.name}</span>
                    </div>

                    {/* Basic Column */}
                    <div 
                      onClick={() => setSelectedMatrixPlanIdx(0)}
                      className={`w-[22%] py-1 rounded-xl transition-all cursor-pointer ${
                        selectedMatrixPlanIdx === 0 ? 'bg-[#CAEF00]/15 border border-[#CAEF00]/40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]' : 'border border-transparent'
                      }`}
                    >
                      {row.basic ? (
                        <Check className={`w-3 h-3 mx-auto stroke-[3] ${selectedMatrixPlanIdx === 0 ? isDarkMode ? 'text-[#CAEF00]' : 'text-slate-900' : 'text-emerald-500'}`} />
                      ) : (
                        <X className={`w-3 h-3 mx-auto stroke-[2.5] ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                      )}
                    </div>

                    {/* Standard Column */}
                    <div 
                      onClick={() => setSelectedMatrixPlanIdx(1)}
                      className={`w-[22%] py-1 rounded-xl transition-all cursor-pointer ${
                        selectedMatrixPlanIdx === 1 ? 'bg-[#CAEF00]/15 border border-[#CAEF00]/40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]' : 'border border-transparent'
                      }`}
                    >
                      {row.standard ? (
                        <Check className={`w-3 h-3 mx-auto stroke-[3] ${selectedMatrixPlanIdx === 1 ? isDarkMode ? 'text-[#CAEF00]' : 'text-slate-900' : 'text-emerald-500'}`} />
                      ) : (
                        <X className={`w-3 h-3 mx-auto stroke-[2.5] ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                      )}
                    </div>

                    {/* Premium Column */}
                    <div 
                      onClick={() => setSelectedMatrixPlanIdx(2)}
                      className={`w-[22%] py-1 rounded-xl transition-all cursor-pointer ${
                        selectedMatrixPlanIdx === 2 ? 'bg-[#CAEF00]/15 border border-[#CAEF00]/40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]' : 'border border-transparent'
                      }`}
                    >
                      {row.premium ? (
                        <Check className={`w-3 h-3 mx-auto stroke-[3] ${selectedMatrixPlanIdx === 2 ? isDarkMode ? 'text-[#CAEF00]' : 'text-slate-900' : 'text-emerald-500'}`} />
                      ) : (
                        <X className={`w-3 h-3 mx-auto stroke-[2.5] ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flexible Spacer to absorb tall heights and prevent blank empty spaces below carousel dots */}
            <div className="h-2 shrink-0" />

            {/* LOWER PRICE CARD CAROUSEL */}
            <div className="relative w-full overflow-hidden py-1 mb-1 select-none shrink-0">
              <div 
                onTouchStart={handleCarouselTouchStart}
                onTouchEnd={handleCarouselTouchEnd}
                className="w-full overflow-visible relative h-[240px] flex items-center justify-center"
              >
                {/* Horizontal Sliding Track */}
                <div 
                  className="absolute left-1/2 flex items-center transition-transform duration-300 ease-out gap-4 shrink-0"
                  style={{
                    transform: `translateX(calc(-152.5px - ${selectedMatrixPlanIdx * 321}px))`
                  }}
                >
                  {[
                    {
                      idx: 0,
                      id: 'basic',
                      title: 'BASIC',
                      price: 413,
                      badge: 'TRIAL COVER',
                      desc: 'Essential coverage for casual commutes',
                    },
                    {
                      idx: 1,
                      id: 'standard',
                      title: 'STANDARD',
                      price: 649,
                      badge: 'MOST POPULAR',
                      desc: 'Complete tuning for daily enthusiasts',
                    },
                    {
                      idx: 2,
                      id: 'premium',
                      title: 'PREMIUM',
                      price: 1003,
                      badge: 'PREMIUM CARE',
                      desc: 'Pro-level restoration and diagnostics',
                    }
                  ].map((card) => {
                    const isActive = selectedMatrixPlanIdx === card.idx;
                    return (
                      <div
                        key={card.id}
                        onClick={() => {
                          if (!isActive) {
                            setSelectedMatrixPlanIdx(card.idx);
                          }
                        }}
                        className={`w-[305px] shrink-0 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 select-none ${
                          isActive 
                            ? `${isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-white border-slate-100'} shadow-[0_20px_40px_rgba(15,23,42,0.18)] border scale-[1.03] z-10 opacity-100 h-[215px]` 
                            : `${isDarkMode ? 'bg-[#161D2A]/60 border-slate-800/40' : 'bg-white/80 border-slate-200/40'} opacity-40 scale-90 border cursor-pointer hover:opacity-60 z-0 shadow-sm h-[165px]`
                        }`}
                      >
                        {/* Card Header & Badge */}
                        <div className="flex justify-between items-start">
                          <div className="text-left">
                            <span className="text-[8px] font-black tracking-wider text-slate-400 block uppercase">
                              Maintenance Plan
                            </span>
                            <h4 className={`text-xs font-black tracking-tight uppercase leading-none mt-0.5 ${
                              isDarkMode ? 'text-white' : 'text-[#0F172A]'
                            }`}>
                              {card.title}
                            </h4>
                          </div>
                          {card.badge && (
                            <span className={`text-[7px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-md ${
                              isDarkMode 
                                ? card.id === 'basic' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/55' :
                                  card.id === 'standard' ? 'bg-lime-950/40 text-lime-400 border border-lime-900/55' :
                                  'bg-emerald-950/40 text-emerald-400 border border-emerald-900/55'
                                : card.id === 'basic' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  card.id === 'standard' ? 'bg-lime-50 text-lime-700 border border-lime-200' :
                                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {card.badge}
                            </span>
                          )}
                        </div>

                        {/* Pricing stack */}
                        <div className="text-left mt-1">
                          <div className="flex items-baseline space-x-1">
                            <span className={`text-2xl font-black tracking-tight leading-none animate-fade-in ${
                              isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'
                            }`}>
                              ₹{card.price}
                            </span>
                          </div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mt-0.5 leading-none">
                             Per service
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[9.5px] text-slate-400 text-left font-semibold leading-normal my-1 h-7 overflow-hidden">
                          {card.desc}
                        </p>

                        {/* CTA Button */}
                        <div className="mt-1">
                          <button
                            type="button"
                            disabled={!isActive}
                            onClick={(e) => {
                              e.stopPropagation();
                              const planObj = SERVICE_PLANS.find(p => p.id === card.id);
                              if (planObj) {
                                handleOpenBookingModal(planObj);
                              }
                            }}
                            className={`w-full py-2 font-black tracking-wider rounded-lg transition-all flex items-center justify-center space-x-1 uppercase text-[9.5px] select-none ${
                              isActive 
                                ? 'bg-[#CAEF00] text-[#0F172A] hover:bg-[#b0d000] active:scale-[0.98] cursor-pointer shadow-sm' 
                                : isDarkMode ? 'bg-slate-800 text-slate-600 cursor-default' : 'bg-slate-100 text-slate-300 cursor-default'
                            }`}
                          >
                            <span>Buy Plan</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Minimal carousel dots with pill for active node */}
              <div className="flex justify-center items-center space-x-2 pt-2 pb-1 select-none">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedMatrixPlanIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      selectedMatrixPlanIdx === i 
                        ? 'bg-[#CAEF00] w-5' 
                        : isDarkMode ? 'bg-slate-700 w-1.5' : 'bg-slate-300 w-1.5'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* 3. BOOKING SCHEDULER DRAWER MODAL (POPUP BOTTOM SHEET) */}
      <AnimatePresence>
        {selectedPlanForBooking && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 210 }}
            className={`absolute inset-x-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden transition-colors duration-200 ${
              isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'
            }`}
          >
            {checkoutStep === 'details' ? (
              /* ================= STEP 1: FILL DETAILS & CONFIRM TYPE ================= */
              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Clean Top Navigation Header */}
                <div className={`border-b pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-3.5 shrink-0 z-10 select-none transition-colors duration-200 ${
                  isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-white border-slate-200/50'
                }`}>
                  <div className="flex items-center justify-between px-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedPlanForBooking(null)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                      id="step1-back-btn"
                      title="Cancel booking"
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <h2 className={`text-sm font-black tracking-tight text-center uppercase ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Confirm Details
                    </h2>
                    <div className="w-8" />
                  </div>
                </div>

                {/* Form Elements Scroll Stack */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  
                  {/* Service Details Header Summary Card */}
                  <div className={`p-4 rounded-2xl select-none transition-colors duration-200 border ${
                    isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-xs' : 'bg-white border-slate-100 shadow-2xs'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[9px] font-extrabold tracking-widest uppercase ${
                          isDarkMode ? 'text-[#CAEF00]' : 'text-[#86b500]'
                        }`}>Selected Plan</span>
                        <h3 className={`text-sm font-black leading-tight mt-0.5 ${
                          isDarkMode ? 'text-white' : 'text-[#0F172A]'
                        }`}>
                          {selectedPlanForBooking.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-slate-400 block uppercase">Base Price</span>
                        <span className={`text-sm font-black ${
                          isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'
                        }`}>
                          ₹{selectedPlanForBooking.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1. SERVICE ADDRESS SELECTION CARD */}
                  <div className={`p-4 rounded-2xl border transition-colors ${
                    isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80 shadow-sm'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase block select-none">
                        1. SERVICE ADDRESS
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowBookingAddressDrawer(true)}
                        className={`font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer select-none ${
                          isDarkMode 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                            : 'bg-slate-200/80 hover:bg-slate-300 text-slate-800 border border-slate-300/80'
                        }`}
                        id="change-booking-address-btn"
                      >
                        CHANGE ADDRESS
                      </button>
                    </div>

                    <div className={`rounded-xl p-3.5 flex items-start space-x-3 border transition-colors ${
                      isDarkMode ? 'bg-[#1E293B] border-slate-700/80 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}>
                      <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${
                        isDarkMode ? 'text-[#CAEF00]' : 'text-[#86b500]'
                      }`} />
                      <div className="text-left flex-1 min-w-0">
                        <span className={`font-black block text-xs mb-1 ${
                          isDarkMode ? 'text-white' : 'text-[#0F172A]'
                        }`}>
                          {SAVED_LOCATIONS.find(loc => loc.address === doorstepAddress)?.label || 'Saved Home Address'}
                        </span>
                        <span className={`font-medium block text-[11px] leading-relaxed ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {doorstepAddress}
                        </span>
                      </div>
                    </div>
                  </div>




                  {/* 2. Registered Vehicle Selection */}
                  <div className={`p-4 rounded-2xl border transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-xs' : 'bg-white border-slate-100 shadow-2xs'
                  } space-y-2.5`}>
                    <label htmlFor="cycle-model" className="text-[10px] font-black tracking-widest text-slate-400 uppercase block select-none">
                      2. Select Registered Vehicle
                    </label>
                    <div className="relative">
                      <select
                        id="cycle-model"
                        value={cycleModel}
                        onChange={(e) => setCycleModel(e.target.value)}
                        className={`w-full appearance-none rounded-xl pl-3.5 pr-10 py-3 text-xs focus:outline-none font-black cursor-pointer transition-colors border ${
                          isDarkMode ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-[#F4F6F9] border border-slate-200/40 text-slate-800'
                        }`}
                      >
                        <option value="QWIK-VOLT CARBON R">QWIK-VOLT CARBON R (Pranav's Bike)</option>
                        <option value="QWIK-GRAVEL ULTRALIGHT">QWIK-GRAVEL ULTRALIGHT</option>
                        <option value="QWIK-CITY STEALTH S">QWIK-CITY STEALTH S</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  {/* 3. Appointment Date & Time selectors */}
                  <div className={`p-4 rounded-2xl border transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-xs' : 'bg-white border-slate-100 shadow-2xs'
                  } space-y-3`}>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block select-none">
                      3. Appointment Schedule
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="appt-date" className="text-[9px] font-bold text-slate-400 block select-none">Date</label>
                        <input
                          type="date"
                          id="appt-date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className={`w-full rounded-xl px-3 py-3 text-xs focus:outline-none font-medium transition-colors border ${
                            isDarkMode ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-[#F4F6F9] border border-slate-200/40 text-slate-800'
                          }`}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="appt-time" className="text-[9px] font-bold text-slate-400 block select-none">Time Slot</label>
                        <div className="relative">
                          <select
                            id="appt-time"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className={`w-full appearance-none rounded-xl pl-3 pr-10 py-3 text-xs focus:outline-none font-medium cursor-pointer transition-colors border ${
                              isDarkMode ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-[#F4F6F9] border border-slate-200/40 text-slate-800'
                            }`}
                          >
                            <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                            <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                            <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                            <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Special Instructions notes */}
                  <div className={`p-4 rounded-2xl border transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-xs' : 'bg-white border-slate-100 shadow-2xs'
                  } space-y-2.5`}>
                    <label htmlFor="issue-notes" className="text-[10px] font-black tracking-widest text-slate-400 uppercase block select-none">
                      4. Special Instructions (Optional)
                    </label>
                    <textarea
                      id="issue-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mention custom gear ratios, spongy braking, or minor frame squeaks..."
                      rows={2}
                      className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none resize-none font-medium transition-colors border ${
                        isDarkMode ? 'bg-[#1E293B] border-slate-700 text-white placeholder-slate-500' : 'bg-[#F4F6F9] border border-slate-200/40 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  {/* Cost breakdown receipt block */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 select-none transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#161D2A] border-slate-800/80 shadow-xs' : 'bg-white border-[#CAD5E2] shadow-2xs'
                  }`}>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Cost Summary</span>
                    <div className={`flex justify-between items-center text-xs font-medium ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <span>{selectedPlanForBooking.title} Base package</span>
                      <span>₹{selectedPlanForBooking.price}</span>
                    </div>
                    <div className={`border-t pt-2.5 flex justify-between items-center font-black text-sm transition-colors ${
                      isDarkMode ? 'border-slate-800 text-white' : 'border-[#CAD5E2] text-[#0F172A]'
                    }`}>
                      <span>Estimated Total</span>
                      <span>₹{selectedPlanForBooking.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Pricing Disclaimer */}
                  <div className={`rounded-xl p-3 text-[10px] leading-relaxed flex items-start space-x-2 select-none border transition-colors ${
                    isDarkMode ? 'bg-slate-900 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200/40 text-slate-500'
                  }`}>
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      Price includes full diagnostics checklist. No payment is charged until your cycle repair has been completed and signed off.
                    </span>
                  </div>

                  {/* Submit / Proceed CTA Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleBookingSubmit}
                      disabled={isSubmitting}
                      className={`w-full py-4 bg-[#CAEF00] text-[#0F172A] font-black tracking-wider rounded-2xl hover:bg-[#b0d000] transition-all flex items-center justify-center space-x-2 uppercase text-xs cursor-pointer shadow-md select-none ${
                        isDarkMode ? 'disabled:bg-slate-800 disabled:text-slate-600' : 'disabled:bg-slate-200 disabled:text-slate-400'
                      }`}
                      id="confirm-booking-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Booking...</span>
                        </>
                      ) : (
                        <span>Confirm & Book Service</span>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              /* ================= STEP 2: SELECT HUB LOCATION ================= */
              <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200 ${
                isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'
              }`}>
                {/* Clean Top Navigation Header */}
                <div className={`absolute top-0 inset-x-0 backdrop-blur-md border-b pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-3.5 z-30 select-none transition-colors duration-200 ${
                  isDarkMode ? 'bg-[#161D2A]/95 border-slate-800' : 'bg-white/95 border-slate-200/50'
                }`}>
                  <div className="flex items-center justify-between px-4">
                    <button 
                      type="button"
                      onClick={() => setCheckoutStep('details')}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                      id="step2-back-btn"
                      title="Go back to details"
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <h2 className={`text-sm font-black tracking-tight text-center uppercase ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Select Hub Location
                    </h2>
                    <div className="w-8" />
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  
                  {/* Interactive Vector Map Section */}
                  <div id="map-container" className={`absolute inset-0 w-full h-full overflow-hidden z-0 transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F1F5F9]'
                  }`}>
                    <svg 
                      viewBox="0 0 350 500" 
                      preserveAspectRatio="xMidYMid slice" 
                      className={`w-full h-full select-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={handleTouchStartMap}
                      onTouchMove={handleTouchMoveMap}
                      onTouchEnd={handleTouchEndMap}
                      onWheel={handleWheel}
                      onDoubleClick={handleDoubleClick}
                    >
                      <defs>
                        {/* High-end gradients for water and green spaces */}
                        <linearGradient id="waterGradient2" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={isDarkMode ? '#082F49' : '#E0F2FE'} />
                          <stop offset="100%" stopColor={isDarkMode ? '#0C4A6E' : '#BAE6FD'} />
                        </linearGradient>
                        <linearGradient id="parkGradient2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isDarkMode ? '#022C22' : '#F0FDF4'} />
                          <stop offset="100%" stopColor={isDarkMode ? '#064E3B' : '#DCFCE7'} />
                        </linearGradient>
                        <pattern id="dotGrid2" width="16" height="16" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill={isDarkMode ? '#1E293B' : '#E2E8F0'} />
                        </pattern>
                      </defs>

                      <g 
                        transform={`translate(${mapPan.x}, ${mapPan.y}) scale(${mapZoom})`}
                        style={{ 
                          transformOrigin: '175px 250px', 
                          transition: isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' 
                        }}
                      >
                        {/* Base land mass with a subtle dot grid overlay */}
                        <rect width="350" height="500" fill={isDarkMode ? '#0B0F17' : '#F8FAFC'} />
                        <rect width="350" height="500" fill="url(#dotGrid2)" />

                        {/* Bay Area Water Body (top/right) */}
                        <path d="M 230,0 Q 255,160 350,195 L 350,0 Z" fill="url(#waterGradient2)" opacity="0.9" />
                        {/* Wave accents inside the water body */}
                        <path d="M 270,40 Q 290,90 320,110" stroke={isDarkMode ? '#0284C7' : '#93C5FD'} strokeWidth="1.5" strokeDasharray="5,4" fill="none" opacity="0.6" />
                        <path d="M 300,20 Q 315,60 340,75" stroke={isDarkMode ? '#0284C7' : '#93C5FD'} strokeWidth="1.5" strokeDasharray="5,4" fill="none" opacity="0.6" />

                        {/* Green Parks with styled decorative elements */}
                        <path d="M 0,410 Q 55,440 45,500 L 0,500 Z" fill="url(#parkGradient2)" stroke={isDarkMode ? '#064E3B' : '#DCFCE7'} strokeWidth="1" />
                        <path d="M 290,420 Q 320,440 340,500 L 280,500 Z" fill="url(#parkGradient2)" stroke={isDarkMode ? '#064E3B' : '#DCFCE7'} strokeWidth="1" />

                        {/* Tiny styled trees inside parks */}
                        <circle cx="15" cy="460" r="2.5" fill={isDarkMode ? '#10B981' : '#22C55E'} opacity="0.6" />
                        <circle cx="25" cy="480" r="3" fill={isDarkMode ? '#10B981' : '#22C55E'} opacity="0.6" />
                        <circle cx="310" cy="465" r="3" fill={isDarkMode ? '#10B981' : '#22C55E'} opacity="0.6" />

                        {/* Elegant Gray Road Grids (Primary Arteries) */}
                        <path d="M 0,100 L 350,100" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                        <path d="M 0,100 L 350,100" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />

                        <path d="M 0,350 L 350,350" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                        <path d="M 0,350 L 350,350" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />

                        <path d="M 120,0 L 120,500" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                        <path d="M 120,0 L 120,500" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />

                        <path d="M 240,0 L 240,500" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="5.5" fill="none" />
                        <path d="M 240,0 L 240,500" stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="1.5" fill="none" />
                        
                        {/* Secondary streets */}
                        <path d="M 0,220 Q 180,240 350,220" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="3.5" fill="none" opacity="0.85" />
                        <path d="M 0,220 Q 180,240 350,220" stroke={isDarkMode ? '#1E293B' : '#F1F5F9'} strokeWidth="1" fill="none" />

                        <path d="M 180,0 Q 170,250 180,500" stroke={isDarkMode ? '#1E293B' : '#FFFFFF'} strokeWidth="3.5" fill="none" opacity="0.85" />
                        <path d="M 180,0 Q 170,250 180,500" stroke={isDarkMode ? '#1E293B' : '#F1F5F9'} strokeWidth="1" fill="none" />

                        {/* Faint Street Label Texts */}
                        <text x="60" y="94" fill={isDarkMode ? '#475569' : '#94A3B8'} fontSize="6.5" fontWeight="bold" letterSpacing="1" className="font-sans select-none pointer-events-none opacity-80 uppercase">
                          Mission Blvd
                        </text>
                        <text x="60" y="344" fill={isDarkMode ? '#475569' : '#94A3B8'} fontSize="6.5" fontWeight="bold" letterSpacing="1" className="font-sans select-none pointer-events-none opacity-80 uppercase">
                          Soma Avenue
                        </text>
                        <text x="126" y="200" fill={isDarkMode ? '#475569' : '#94A3B8'} fontSize="6.5" fontWeight="bold" letterSpacing="1" className="font-sans select-none pointer-events-none opacity-80 uppercase" transform="rotate(90, 126, 200)">
                          Marina Drive
                        </text>

                        {/* Landmark Badges */}
                        <g transform="translate(305, 45)" className="opacity-75 pointer-events-none">
                          <text x="0" y="0" fill={isDarkMode ? '#0284C7' : '#0369A1'} fontSize="5.5" fontWeight="black" letterSpacing="0.5" className="font-sans text-center" textAnchor="middle">
                            PACIFIC BAY
                          </text>
                        </g>
                        <g transform="translate(35, 435)" className="opacity-75 pointer-events-none">
                          <text x="0" y="0" fill={isDarkMode ? '#059669' : '#15803D'} fontSize="5.5" fontWeight="black" letterSpacing="0.5" className="font-sans text-center" textAnchor="middle">
                            MISSION GREEN
                          </text>
                        </g>
                        
                        {/* Pulsing "You Are Here" Marker */}
                        <circle cx="150" cy="240" r="22" fill="#3B82F6" fillOpacity="0.06" className="animate-pulse" />
                        <circle cx="150" cy="240" r="12" fill="#3B82F6" fillOpacity="0.12" />
                        <circle cx="150" cy="240" r="6" fill={isDarkMode ? '#1E293B' : '#FFFFFF'} className="shadow-sm" />
                        <circle cx="150" cy="240" r="4" fill="#3B82F6" />

                        {/* Pins indicating nearby QWIKAMP service hubs */}
                        {SERVICE_HUBS.map((hub) => {
                          let x = 150;
                          let y = 240;
                          if (hub.id === 'qwikamp-sf-hub') { x = 130; y = 140; }
                          if (hub.id === 'speedtech-hub') { x = 270; y = 160; }
                          if (hub.id === 'firefox-hub') { x = 200; y = 380; }
                          if (hub.id === 'mumbai-moto-hub') { x = 70; y = 280; }

                          const isSelected = selectedHub === hub.name;
                          
                          // Dynamic filter checks
                          const matchesSearch = hub.name.toLowerCase().includes(searchQueryHubs.toLowerCase()) || 
                                                hub.address.toLowerCase().includes(searchQueryHubs.toLowerCase());
                          if (!matchesSearch) return null;
                          if (activeHubFilter === 'Open Now' && !hub.openNow) return null;
                          if (activeHubFilter === 'Top Rated' && hub.rating < 4.5) return null;

                          return (
                            <g 
                              key={hub.id} 
                              className="cursor-pointer group"
                              onClick={() => handleSelectHub(hub.name, x, y)}
                            >
                              {/* Pulse highlight ring for active selection */}
                              {isSelected ? (
                                <>
                                  <circle cx={x} cy={y - 10} r="22" fill="#CAEF00" fillOpacity="0.2" />
                                  <circle cx={x} cy={y - 10} r="14" fill="none" stroke="#CAEF00" strokeWidth="2" fillOpacity="0.3" strokeOpacity="0.8" className="animate-ping" style={{ transformOrigin: `${x}px ${y - 10}px`, animationDuration: '2s' }} />
                                </>
                              ) : (
                                <circle cx={x} cy={y - 10} r="12" fill="#0F172A" fillOpacity="0.04" className="group-hover:fill-opacity-10 transition-all" />
                              )}
                              
                              {/* Pin base shadow */}
                              <ellipse cx={x} cy={y} rx="5" ry="2" fill="#0F172A" fillOpacity="0.25" />

                              {/* Beautiful Custom Map Marker */}
                              <g transform={`translate(${x}, ${y - 10}) scale(${isSelected ? 1.25 : 1})`} className="transition-all duration-300">
                                <path 
                                  d="M 0,10 C -5,2 -10,-2 -10,-8 C -10,-14 -5.5,-18 0,-18 C 5.5,-18 10,-14 10,-8 C 10,-2 5,2 0,10 Z" 
                                  fill={isSelected ? '#0F172A' : '#FFFFFF'} 
                                  stroke={isSelected ? '#CAEF00' : '#0F172A'}
                                  strokeWidth="2"
                                  className="filter drop-shadow-md"
                                />
                                {/* Tiny icon or letter representation inside the pin */}
                                {isSelected ? (
                                  <circle cx="0" cy="-8" r="4.5" fill="#CAEF00" />
                                ) : (
                                  <circle cx="0" cy="-8" r="4" fill="#0F172A" />
                                )}
                                {isSelected ? (
                                  <path d="M -2,-8 L -0.5,-6.5 L 2,-9.5" stroke="#0F172A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                ) : (
                                  <path d="M-1.5 -8 L1.5 -8 M0 -9.5 L0 -6.5" stroke="#FFFFFF" strokeWidth="1" />
                                )}
                              </g>

                              {/* Faint, beautiful hover/inactive mini-badge */}
                              {!isSelected && (
                                <g transform={`translate(${x}, ${y - 32})`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  <rect x="-45" y="-16" width="90" height="16" rx="5" fill="#0F172A" />
                                  <polygon points="0,3 -3,0 3,0" fill="#0F172A" transform="translate(0, -1)" />
                                  <text x="0" y="-6" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" className="font-sans">
                                    {hub.name.replace(" Service Hub", "").replace(" Bikes Hub", "")}
                                  </text>
                                </g>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    </svg>

                    {/* Floating Zoom / Reset Map controls on the right */}
                    <div className="absolute top-[calc(env(safe-area-inset-top,24px)+135px)] right-4 z-20 flex flex-col space-y-2 select-none">
                      <button
                        type="button"
                        onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 2.5))}
                        className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center font-black cursor-pointer transition-transform focus:outline-none ${
                          isDarkMode ? 'bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white' : 'bg-white/95 backdrop-blur-md border border-slate-200/40 text-slate-700 hover:text-slate-900'
                        }`}
                        title="Zoom In"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.6))}
                        className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center font-black cursor-pointer transition-transform focus:outline-none ${
                          isDarkMode ? 'bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white' : 'bg-white/95 backdrop-blur-md border border-slate-200/40 text-slate-700 hover:text-slate-900'
                        }`}
                        title="Zoom Out"
                      >
                        <Minus className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMapZoom(1);
                          setMapPan({ x: 0, y: 0 });
                        }}
                        className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center font-black cursor-pointer transition-transform focus:outline-none ${
                          isDarkMode ? 'bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white' : 'bg-white/95 backdrop-blur-md border border-slate-200/40 text-slate-700 hover:text-slate-900'
                        }`}
                        title="Reset View"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Center perfectly on the current user position (150, 240)
                          setMapZoom(1.3);
                          setMapPan({ x: 175 - 150 * 1.3, y: 250 - 240 * 1.3 });
                        }}
                        className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center font-black cursor-pointer transition-transform focus:outline-none ${
                          isDarkMode ? 'bg-slate-900/95 backdrop-blur-md border border-slate-800 text-[#CAEF00] hover:text-[#b0d000]' : 'bg-white/95 backdrop-blur-md border border-slate-200/40 text-[#3B82F6] hover:text-blue-600'
                        }`}
                        title="My Location"
                      >
                        <Locate className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    {/* Global Search pill-shaped bar - FLOATING */}
                    <div className="absolute top-[calc(env(safe-area-inset-top,24px)+72px)] inset-x-4 z-20 select-none">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Search className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={searchQueryHubs}
                          onChange={(e) => setSearchQueryHubs(e.target.value)}
                          placeholder="Search near your location..."
                          className={`w-full pl-12 pr-10 py-3.5 text-sm rounded-full border shadow-xs focus:outline-none focus:ring-2 focus:ring-[#CAEF00] focus:border-transparent transition-all ${
                            isDarkMode ? 'bg-[#161D2A] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200/50 text-slate-800 placeholder-slate-400'
                          }`}
                        />
                        {searchQueryHubs && (
                          <button
                            type="button"
                            onClick={() => setSearchQueryHubs('')}
                            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Floating Segmented Toggle for Active Hub Filters (matching Plans/My Bookings bottom panel style) */}
                  <motion.div 
                    initial={{ bottom: '40.5%' }}
                    animate={{ bottom: getToggleBottom() }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    className="absolute left-1/2 -translate-x-1/2 w-[280px] z-30 select-none"
                  >
                    <div className={`p-1 rounded-full flex shadow-lg border transition-colors ${
                      isDarkMode ? 'bg-slate-900/85 backdrop-blur-md border-slate-800' : 'bg-white/85 backdrop-blur-md border-slate-200/40'
                    }`}>
                      {(['Nearest', 'Top Rated', 'Open Now'] as const).map((filter) => {
                        const isActive = activeHubFilter === filter;
                        return (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => applyHubFilter(filter)}
                            className={`flex-1 text-center py-2 text-[9.5px] font-black tracking-wider uppercase rounded-full transition-all cursor-pointer ${
                              isActive
                                ? isDarkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-[#0F172A] shadow-xs'
                                : 'text-slate-400 hover:text-slate-500'
                            }`}
                          >
                            {filter}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Modern Bottom Sheet Container */}
                  <motion.div 
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEnd}
                    initial={{ height: '38%' }}
                    animate={{ height: getSheetHeight() }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    className={`absolute bottom-0 inset-x-0 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-20 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors duration-200 ${
                      isDarkMode ? 'bg-[#161D2A] border-t border-slate-800/80' : 'bg-white'
                    }`}
                  >
                    {/* Centered Premium Drag Handle */}
                    <div className={`w-12 h-1.5 rounded-full my-2.5 mx-auto shrink-0 transition-colors cursor-row-resize ${
                      isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200/80 hover:bg-slate-300'
                    }`} />

                    {sheetState === 'collapsed' ? (
                      /* COLLAPSED PEEK LAYOUT */
                      <div className="px-5 pb-3 h-full flex items-center justify-between select-none">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-800'
                          }`}>
                            <MapPin className="w-4.5 h-4.5 text-[#86b500] stroke-[2.5]" />
                          </div>
                          <div className="text-left overflow-hidden">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-0.5">Selected Hub</span>
                            <span className={`text-[11px] font-black truncate block max-w-[160px] ${
                              isDarkMode ? 'text-white' : 'text-[#0F172A]'
                            }`}>
                              {selectedHub}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setSheetState('focused')}
                            className="px-3 py-1.5 bg-[#CAEF00] text-[#0F172A] text-[9.5px] font-black rounded-lg uppercase tracking-wider hover:bg-[#b0d000] transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSheetState('list');
                              const bounds = getFitBoundsForFilter(activeHubFilter);
                              if (bounds) {
                                setMapZoom(bounds.zoom);
                                setMapPan(bounds.pan);
                              }
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-750' : 'bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-100'
                            }`}
                            title="View All Hubs"
                          >
                            <List className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* EXPANDED CONTENT (FOCUSED OR LIST) */
                      <>
                        {sheetState === 'focused' ? (
                          /* FOCUSED ACTION BAR HEADER */
                          <div className={`px-5 pb-2.5 flex items-center justify-between shrink-0 select-none border-b transition-colors ${
                            isDarkMode ? 'border-slate-800' : 'border-slate-100/40'
                          }`}>
                            <button
                              type="button"
                              onClick={handleCollapseSheet}
                              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-300' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'
                              }`}
                              title="Collapse Panel"
                            >
                              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                            </button>
                            
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              Hub Details
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => {
                                setSheetState('list');
                                const bounds = getFitBoundsForFilter(activeHubFilter);
                                if (bounds) {
                                  setMapZoom(bounds.zoom);
                                  setMapPan(bounds.pan);
                                }
                              }}
                              className={`p-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                                isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                              }`}
                              title="View All Hubs List"
                            >
                              <List className="w-4 h-4 stroke-[2.5]" />
                              <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">List</span>
                            </button>
                          </div>
                        ) : (
                          /* LIST HEADER */
                          <div className={`px-5 pb-2.5 flex items-center justify-between border-b shrink-0 select-none transition-colors ${
                            isDarkMode ? 'border-slate-800' : 'border-slate-100/40'
                          }`}>
                            <div className="text-left">
                              <h3 className={`text-[11px] font-black uppercase tracking-wider ${
                                isDarkMode ? 'text-white' : 'text-[#0F172A]'
                              }`}>
                                {activeHubFilter} Service Hubs
                              </h3>
                              <span className="text-[8px] text-slate-400 font-extrabold block mt-0.5 uppercase tracking-wider">
                                {filteredHubs.length} locations available
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setSheetState('focused')}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                Detail
                              </button>
                              <button
                                type="button"
                                onClick={handleCollapseSheet}
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-300' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'
                                }`}
                                title="Collapse Panel"
                              >
                                <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* BODY AREA */}
                        {sheetState === 'focused' ? (
                          /* Single Focused Hub Info Card */
                          (() => {
                            const currentHub = SERVICE_HUBS.find(h => h.name === selectedHub) || SERVICE_HUBS[0];
                            if (!currentHub) return null;
                            return (
                              <div className="px-5 flex-1 flex flex-col justify-center">
                                <div className={`p-3.5 rounded-2xl border flex items-center justify-between select-none shadow-2xs transition-colors duration-200 ${
                                  isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-100/80'
                                }`}>
                                  <div className="flex items-center space-x-3.5 overflow-hidden">
                                    <div className={`w-11 h-11 rounded-xl shadow-3xs flex items-center justify-center shrink-0 border transition-colors ${
                                      isDarkMode ? 'bg-[#161D2A] border-slate-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'
                                    }`}>
                                      <Bike className={`w-5.5 h-5.5 stroke-[2] animate-pulse ${
                                        isDarkMode ? 'text-[#CAEF00]' : 'text-slate-700'
                                      }`} />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                      <div className="flex items-center space-x-2">
                                        <h4 className={`text-[13.5px] font-black leading-tight truncate ${
                                          isDarkMode ? 'text-white' : 'text-[#0F172A]'
                                        }`}>
                                          {currentHub.name}
                                        </h4>
                                        {currentHub.openNow ? (
                                          <span className="shrink-0 bg-emerald-500/10 text-emerald-600 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded flex items-center">
                                            <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1 animate-ping" />
                                            Open
                                          </span>
                                        ) : (
                                          <span className={`shrink-0 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded transition-colors ${
                                            isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'
                                          }`}>
                                            Closed
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                                          {currentHub.distance.toUpperCase()}
                                        </span>
                                        <span className="text-slate-300 text-[10px]">•</span>
                                        <span className="text-[9.5px] text-slate-400 font-semibold flex items-center">
                                          <Clock className="w-2.5 h-2.5 text-slate-400 mr-1 stroke-[2.5]" />
                                          {currentHub.hours}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1 mt-1">
                                        <div className="flex text-amber-400">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                              key={i} 
                                              className={`w-3 h-3 ${i < Math.floor(currentHub.rating) ? 'fill-current text-amber-400' : isDarkMode ? 'text-slate-800' : 'text-slate-200'}`} 
                                            />
                                          ))}
                                        </div>
                                        <span className={`text-[10px] font-black ml-1 ${
                                          isDarkMode ? 'text-white' : 'text-[#0F172A]'
                                        }`}>
                                          {currentHub.rating}
                                        </span>
                                        <span className="text-[9px] text-slate-400">
                                          (150+ reviews)
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-9 h-9 rounded-full bg-[#CAEF00] text-[#0F172A] flex items-center justify-center shadow-xs shrink-0 ml-2">
                                    <Check className="w-4.5 h-4.5 stroke-[3.5]" />
                                  </div>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          /* Scrollable List of matching Hubs */
                          <div 
                            onPointerDown={(e) => e.stopPropagation()} 
                            className={`flex-1 overflow-y-auto p-4 space-y-2.5 select-none transition-colors duration-200 ${
                              isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50/40'
                            }`}
                          >
                            {filteredHubs.map((hub) => {
                              const isSelected = selectedHub === hub.name;
                              return (
                                <div
                                  key={hub.id}
                                  onClick={() => selectAndCenterHub(hub.name)}
                                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-3xs ${
                                    isSelected 
                                      ? 'border-[#CAEF00] ring-1 ring-[#CAEF00]/50 ' + (isDarkMode ? 'bg-slate-900/60' : 'bg-white')
                                      : isDarkMode ? 'bg-[#161D2A] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                      isSelected 
                                        ? 'bg-[#CAEF00]/10 text-[#CAEF00]' 
                                        : isDarkMode ? 'bg-slate-900 border border-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400'
                                    }`}>
                                      <Bike className="w-4.5 h-4.5 stroke-[2]" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 text-left space-y-0.5">
                                      <div className="flex items-center space-x-1.5">
                                        <h4 className={`text-[11.5px] font-black truncate ${
                                          isDarkMode ? 'text-white' : 'text-slate-900'
                                        }`}>
                                          {hub.name}
                                        </h4>
                                        {hub.openNow && (
                                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                        )}
                                      </div>
                                      <p className="text-[9.5px] text-slate-400 font-medium truncate">
                                        {hub.address}
                                      </p>
                                      <div className="flex items-center space-x-2">
                                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                                          isDarkMode ? 'text-slate-300 bg-slate-900' : 'text-[#0F172A] bg-slate-100'
                                        }`}>
                                          {hub.distance}
                                        </span>
                                        <span className="text-slate-300 text-[8px]">•</span>
                                        <span className="text-amber-500 font-black text-[9px] flex items-center">
                                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                                          {hub.rating}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                    isSelected 
                                      ? 'bg-[#CAEF00] text-[#0F172A] scale-105' 
                                      : isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300'
                                  }`}>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Anchored Sticky Checkout Footer */}
                        <div 
                          onPointerDown={(e) => e.stopPropagation()} 
                          className={`p-5 shrink-0 select-none space-y-3 border-t transition-colors duration-200 ${
                            isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-white border-slate-100/80'
                          }`}
                        >
                          <div className="flex justify-between items-center px-1">
                            <div className="text-left">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Selected Location</span>
                              <span className={`text-xs font-black truncate block max-w-[190px] ${
                                isDarkMode ? 'text-white' : 'text-slate-800'
                              }`}>
                                {selectedHub || 'Select a hub above'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Est. Cost</span>
                              <span className={`text-sm font-black ${
                                isDarkMode ? 'text-white' : 'text-[#0F172A]'
                              }`}>₹{selectedPlanForBooking.price}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleBookingSubmit}
                            disabled={isSubmitting || !selectedHub}
                            className={`w-full py-4 bg-[#CAEF00] text-[#0F172A] font-black tracking-wider rounded-2xl hover:bg-[#b0d000] transition-all flex items-center justify-center space-x-2 uppercase text-xs cursor-pointer shadow-md ${
                              isDarkMode ? 'disabled:bg-slate-800 disabled:text-slate-600' : 'disabled:bg-slate-200 disabled:text-slate-400'
                            }`}
                            id="confirm-booking-btn"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Scheduling...</span>
                              </>
                            ) : (
                              <span>Confirm & Schedule booking</span>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>

                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Address Selection Drawer */}
      <AnimatePresence>
        {showBookingAddressDrawer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/65 z-55 flex items-end justify-center select-none"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={`rounded-t-[32px] w-full p-6 space-y-4 shadow-2xl text-left max-h-[90%] overflow-y-auto transition-colors duration-200 border-t ${
                isDarkMode 
                  ? 'bg-[#161D2A] text-white border-slate-800' 
                  : 'bg-white text-slate-900 border-slate-200/50'
              }`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-700/30">
                <div>
                  <h3 className={`text-sm font-black uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select Service Address</h3>
                  <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Choose where we should service your ride</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowBookingAddressDrawer(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Saved Locations List */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">SAVED LOCATIONS</span>
                {SAVED_LOCATIONS.map((loc) => {
                  const isSelected = doorstepAddress === loc.address;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setDoorstepAddress(loc.address);
                        setShowBookingAddressDrawer(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-start space-x-3 transition-all cursor-pointer ${
                        isSelected
                          ? isDarkMode
                            ? 'bg-[#CAEF00]/10 border-[#CAEF00] text-white'
                            : 'bg-slate-900 border-slate-900 text-white'
                          : isDarkMode
                            ? 'bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'text-white' 
                          : 'text-slate-400'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <span className={`font-black text-xs block ${isSelected ? 'text-white' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {loc.label}
                        </span>
                        <span className={`text-[11px] font-semibold mt-0.5 block leading-relaxed ${
                          isSelected 
                            ? isDarkMode ? 'text-slate-300' : 'text-slate-200' 
                            : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {loc.address}
                        </span>
                      </div>
                      {isSelected && (
                        <div className={`rounded-full p-1 ${isDarkMode ? 'bg-[#CAEF00]/20' : 'bg-lime-500/20'}`}>
                          <Check className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#CAEF00]' : 'text-lime-600'}`} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Input New Address Form */}
              <div className={`border-t pt-4 space-y-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">OR ADD A NEW ADDRESS</span>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="new-street" className="text-[9px] font-bold text-slate-400 block uppercase">Street Address</label>
                    <input 
                      type="text"
                      id="new-street"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. 500 Howard St"
                      className={`w-full border rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-1 transition-colors ${
                        isDarkMode 
                          ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:ring-[#CAEF00]' 
                          : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-slate-400'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="new-landmark" className="text-[9px] font-bold text-slate-400 block uppercase">Landmark</label>
                      <input 
                        type="text"
                        id="new-landmark"
                        value={newLandmark}
                        onChange={(e) => setNewLandmark(e.target.value)}
                        placeholder="e.g. Near Salesforce Park"
                        className={`w-full border rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-1 transition-colors ${
                          isDarkMode 
                            ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:ring-[#CAEF00]' 
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-slate-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="new-pincode" className="text-[9px] font-bold text-slate-400 block uppercase">Pincode/Zip</label>
                      <input 
                        type="text"
                        id="new-pincode"
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                        placeholder="e.g. 94105"
                        className={`w-full border rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-1 transition-colors ${
                          isDarkMode 
                            ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:ring-[#CAEF00]' 
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newStreet.trim()) return;
                      const completeAddress = [
                        newStreet.trim(),
                        newLandmark.trim(),
                        newPincode.trim()
                      ].filter(Boolean).join(', ');
                      setDoorstepAddress(completeAddress);
                      setShowBookingAddressDrawer(false);
                      setNewStreet('');
                      setNewLandmark('');
                      setNewPincode('');
                    }}
                    disabled={!newStreet.trim()}
                    className="w-full py-3.5 bg-[#CAEF00] text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 select-none cursor-pointer"
                  >
                    Save & Apply Address
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
