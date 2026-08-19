import { useState, TouchEvent, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Lock, Truck, Check, CheckCircle2, ChevronRight, Info, ShieldAlert, Sparkles, Loader2,
  ArrowUpDown, SlidersHorizontal, X, AlertTriangle, Phone
} from 'lucide-react';
import { Booking } from '../types';

interface BookingsViewProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onNavigate?: (tab: 'Home' | 'Cycle Shop' | 'Repair' | 'Bookings' | 'Profile' | 'CART', params?: any) => void;
  onDrawerOpenChange?: (isOpen: boolean) => void;
  initialCartSegment?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function BookingsView({ bookings: initialBookings, onCancelBooking, onNavigate, onDrawerOpenChange, initialCartSegment, isDarkMode, onToggleDarkMode }: BookingsViewProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [selectedEcosystem, setSelectedEcosystem] = useState<'Repair' | 'Service' | 'Shop' | 'Doorstep'>('Service');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'All' | 'Pending' | 'Completed' | 'Cancelled'>('All');
  const [sortBy, setSortBy] = useState<'Recent' | 'Upcoming'>('Recent');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Helper to resolve which ecosystem tab a booking belongs to
  const getBookingEcosystem = (booking: any): 'Repair' | 'Service' | 'Shop' | 'Doorstep' => {
    if (booking.type === 'SHOP' || booking.type === 'Shop' || booking.cartSegment === 'SHOP' || booking.serviceId === 'shop') {
      return 'Shop';
    }
    const serviceId = (booking.serviceId || '').toLowerCase();
    const name = (booking.serviceName || '').toLowerCase();

    if (
      serviceId === 'custom-repair-troubleshoot' || 
      serviceId === 'repair' || 
      name.includes('repair') || 
      name.includes('link fix') || 
      name.includes('puncture') || 
      name.includes('brake bleed') ||
      name.includes('diagnostics')
    ) {
      return 'Repair';
    }
    if (serviceId === 'doorstep' || name.includes('doorstep')) {
      return 'Doorstep';
    }
    if (serviceId === 'buy' || serviceId === 'shop' || name.includes('buy') || name.includes('purchase')) {
      return 'Shop';
    }
    return 'Service';
  };

  // Tracking state for cancelled and completed bookings dynamically
  const [cancelledBookingIds, setCancelledBookingIds] = useState<Record<string, boolean>>({
    'BK-0188': true, // Mock cancelled booking
  });
  const [completedBookingIds, setCompletedBookingIds] = useState<Record<string, boolean>>({
    'BK-0199': true, // Mock completed booking
  });

  // High-fidelity pre-configured list of bookings matching user's specific request
  const [localBookings, setLocalBookings] = useState<any[]>([
    {
      id: 'BK-0270',
      serviceId: 'service',
      serviceName: 'Basic Servicing',
      cycleModel: 'QWIK-VOLT CARBON R • Silver',
      date: '2 Jul 2026',
      timeSlot: '09:00 AM - 11:00 AM',
      price: 413,
      maintenanceId: '270',
      partnerName: 'Marcus Vance',
      partnerPhone: '+1 (555) 381-0294',
      rawDate: new Date('2026-07-02'),
    },
    {
      id: 'BK-0241',
      serviceId: 'service',
      serviceName: 'Standard Servicing',
      cycleModel: 'QWIK-GRAVEL ULTRALIGHT • Charcoal',
      date: '27 Jan 2026',
      timeSlot: '10:00 AM - 12:00 PM',
      price: 649,
      maintenanceId: '241',
      partnerName: 'Dave Kessler',
      partnerPhone: '+1 (555) 940-1120',
      rawDate: new Date('2026-01-27'),
    },
    {
      id: 'BK-0239',
      serviceId: 'service',
      serviceName: 'Premium Servicing',
      cycleModel: 'QWIK-CITY STEALTH S • Crimson',
      date: '26 Jun 2026',
      timeSlot: '01:00 PM - 03:00 PM',
      price: 1003,
      maintenanceId: '239',
      partnerName: 'Sarah Lin',
      partnerPhone: '+1 (555) 203-8849',
      rawDate: new Date('2026-06-26'),
    },
    {
      id: 'BK-0199',
      serviceId: 'service',
      serviceName: 'Express Servicing',
      cycleModel: 'QWIK-METRO COMMUTER • Cobalt Blue',
      date: '15 Jun 2026',
      timeSlot: '04:00 PM - 06:00 PM',
      price: 450,
      maintenanceId: '199',
      partnerName: 'Alex Mercer',
      partnerPhone: '+1 (555) 432-8821',
      rawDate: new Date('2026-06-15'),
      isCompleted: true,
    },
    {
      id: 'BK-0188',
      serviceId: 'service',
      serviceName: 'Eco Servicing',
      cycleModel: 'QWIK-KIDS FUNEXPLORER • Bumblebee',
      date: '10 Jun 2026',
      timeSlot: '11:00 AM - 01:00 PM',
      price: 320,
      maintenanceId: '188',
      partnerName: 'James Dean',
      partnerPhone: '+1 (555) 123-9988',
      rawDate: new Date('2026-06-10'),
      isCancelled: true,
    },
    {
      id: 'BK-0155',
      serviceId: 'custom-repair-troubleshoot',
      serviceName: 'Chain Repair & Link Fix',
      cycleModel: 'QWIK-VOLT CARBON R • Gold Edition',
      date: '14 Jul 2026',
      timeSlot: '02:00 PM - 04:00 PM',
      price: 80,
      maintenanceId: '155',
      partnerName: 'Marcus Vance',
      partnerPhone: '+1 (555) 381-0294',
      rawDate: new Date('2026-07-14'),
    }
  ]);

  // Merge with any custom bookings created by the user in-app (custom items placed first so they render at the top)
  const allBookings = [
    ...initialBookings
      .filter(b => !['BK-0270', 'BK-0241', 'BK-0239', 'BK-0199', 'BK-0188', 'BK-0155'].includes(b.id))
      .map(b => ({
        id: b.id,
        serviceId: b.serviceId,
        serviceName: b.serviceName,
        cycleModel: b.cycleModel || 'QWIK-VOLT CARBON R • Midnight Blue',
        date: b.date,
        timeSlot: b.timeSlot,
        price: b.price || 413,
        notes: b.notes,
        maintenanceId: (b as any).maintenanceId || b.id.replace('BK-', ''),
        partnerName: (b as any).partnerName || 'QWIK Logistics Hub',
        partnerPhone: (b as any).partnerPhone || '+1 (555) 019-2834',
        type: (b as any).type || (b.serviceId === 'shop' || b.serviceId === 'buy' ? 'SHOP' : undefined),
        rawDate: (b as any).rawDate || new Date()
      })),
    ...localBookings
  ];

  // Auto-focus the ecosystem tab based on initialCartSegment or newest booking
  useEffect(() => {
    if (initialCartSegment) {
      const segUpper = initialCartSegment.toUpperCase();
      if (segUpper === 'SHOP') {
        setSelectedEcosystem('Shop');
      } else if (segUpper === 'REPAIR') {
        setSelectedEcosystem('Repair');
      } else if (segUpper === 'SERVICE') {
        setSelectedEcosystem('Service');
      } else if (segUpper === 'DOORSTEP') {
        setSelectedEcosystem('Doorstep');
      }
    } else if (initialBookings && initialBookings.length > 0) {
      const newestBooking = initialBookings[0];
      const ecosystem = getBookingEcosystem(newestBooking);
      setSelectedEcosystem(ecosystem);
    }
  }, [initialBookings, initialCartSegment]);

  // Tracking state for verified bookings
  const [verifiedBookings, setVerifiedBookings] = useState<Record<string, boolean>>({
    'BK-0241': true, // Mock verify one initially for immediate visual contrast if desired
  });

  // Safe Date parsing helper for robust sorting
  const parseBookingDate = (b: any) => {
    if (b.rawDate) return b.rawDate.getTime();
    try {
      const parts = b.date.split(' ');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames.indexOf(parts[1]);
        const year = parseInt(parts[2], 10);
        if (month !== -1 && !isNaN(day) && !isNaN(year)) {
          return new Date(year, month, day).getTime();
        }
      }
    } catch (e) {}
    return Date.now();
  };

  // 3-Tier Status Priority Sorting Logic
  const getBookingTier = (booking: any): number => {
    const isCancelled = booking.isCancelled || cancelledBookingIds[booking.id];
    const isCompleted = booking.isCompleted || completedBookingIds[booking.id];
    const isVerified = verifiedBookings[booking.id];

    if (isCancelled || isCompleted) {
      return 3; // Tier 3 (Terminal History / Archived Phase)
    }
    if (isVerified) {
      return 2; // Tier 2 (Workshop Authorization Phase)
    }
    return 1; // Tier 1 (Pin Entry Phase)
  };

  // Sort and Filter Bookings based on 3-Tier Status Priority Array & Status Tab
  const sortedAndFilteredBookings = allBookings
    .filter(booking => {
      // 1. Filter by Status Tab
      const isCancelled = booking.isCancelled || cancelledBookingIds[booking.id];
      const isCompleted = booking.isCompleted || completedBookingIds[booking.id];
      const status = isCancelled ? 'Cancelled' : isCompleted ? 'Completed' : 'Pending';

      if (selectedStatusTab !== 'All' && status !== selectedStatusTab) {
        return false;
      }

      // 2. Filter by selected ecosystem tab
      return getBookingEcosystem(booking) === selectedEcosystem;
    })
    .sort((a, b) => {
      const tierA = getBookingTier(a);
      const tierB = getBookingTier(b);

      if (tierA !== tierB) {
        return tierA - tierB; // Tier 1 (top), Tier 2 (middle), Tier 3 (bottom)
      }

      // Fallback stable sorting for items in the same tier
      const timeA = parseBookingDate(a);
      const timeB = parseBookingDate(b);
      return timeB - timeA;
    });

  // Tracking state for transit status steps:
  // 1 = Delivery Partner Assigned
  // 2 = Bicycle Picked Up. In Transit to Service Center
  // 3 = Bicycle at Service Center. Under Servicing
  const [transitSteps, setTransitSteps] = useState<Record<string, number>>({
    'BK-0241': 2, // Second step active
  });

  const [bookingTrackerStates, setBookingTrackerStates] = useState<Record<string, 'transit' | 'pending_approval' | 'declined' | 'under_repair'>>({
    'BK-0241': 'transit', // Set to transit initially
  });

  // Automatically transition from 'transit' to 'pending_approval' after 3.5 seconds for a dynamic live feel!
  useEffect(() => {
    const transitBookingIds = Object.entries(bookingTrackerStates)
      .filter(([_, state]) => state === 'transit')
      .map(([id]) => id);

    const timers = transitBookingIds.map((id) => {
      return setTimeout(() => {
        setBookingTrackerStates(prev => ({
          ...prev,
          [id]: 'pending_approval'
        }));
      }, 3500);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [bookingTrackerStates]);

  // Modal active states
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [activePinBookingId, setActivePinBookingId] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isDeclineConfirmOpen, setIsDeclineConfirmOpen] = useState(false);

  // Bottom sheet details state
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState<any | null>(null);

  const Total_Parts_Labor_Cost = selectedDetailsBooking ? selectedDetailsBooking.price : 0;
  const Base_Delivery_Fee = Total_Parts_Labor_Cost <= 800 ? 169 : (Total_Parts_Labor_Cost <= 1500 ? 129 : 99);
  const Calculated_Tax_Amount = Base_Delivery_Fee * 0.18;
  const Final_Quotation_Amount = Total_Parts_Labor_Cost + Base_Delivery_Fee + Calculated_Tax_Amount;

  // Sync selectedDetailsBooking state to parent components (to conditionally hide bottom navbar)
  useEffect(() => {
    onDrawerOpenChange?.(!!selectedDetailsBooking);
    return () => {
      onDrawerOpenChange?.(false);
    };
  }, [selectedDetailsBooking, onDrawerOpenChange]);

  // Swipe detection for tab swapping
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;
    const diffX = touchStart.x - e.changedTouches[0].clientX;
    const diffY = touchStart.y - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX < 0 && onNavigate) {
        // Swiped Right -> Go back to Repair (Service Plans)
        onNavigate('Repair');
      }
    }
    setTouchStart(null);
  };

  // Open the Verify PIN Modal
  const handleTriggerVerifyPin = (bookingId: string) => {
    setActivePinBookingId(bookingId);
    setEnteredPin('');
    setPinError(false);
    setIsPinModalOpen(true);
  };

  // Open Details Bottom Sheet
  const handleOpenDetails = (booking: any) => {
    setSelectedDetailsBooking(booking);
  };

  // Close Details Bottom Sheet
  const handleCloseDetails = () => {
    setSelectedDetailsBooking(null);
  };

  // Process PIN Verification
  const handleVerifySubmit = () => {
    if (enteredPin.length < 6) return;
    
    setIsVerifying(true);
    setPinError(false);
    const targetBookingId = activePinBookingId!;

    // Simulate 0.9s network delay
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedBookings(prev => ({
        ...prev,
        [targetBookingId]: true
      }));
      setBookingTrackerStates(prev => ({
        ...prev,
        [targetBookingId]: 'transit'
      }));
      setTransitSteps(prev => ({
        ...prev,
        [targetBookingId]: 2 // Auto set to step 2 (In Transit) upon verification
      }));
      setIsPinModalOpen(false);
      
      // If the details sheet was open, refresh the details context
      if (selectedDetailsBooking && selectedDetailsBooking.id === targetBookingId) {
        setSelectedDetailsBooking(prev => ({ ...prev }));
      }

      // AUTOMATIC PROGRESSION: Automatically advance to Step 3 (At Service Center) after 3.5 seconds
      setTimeout(() => {
        setTransitSteps(prev => ({
          ...prev,
          [targetBookingId]: 3
        }));
      }, 3500);

    }, 900);
  };

  // Handle visual input click for keypads or keystrokes
  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setEnteredPin(val);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}
    >


      {/* --- TITLE & SORTING BAR --- */}
      <div className={`px-5 pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-3.5 select-none shrink-0 flex justify-between items-center border-b transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-white border-slate-100/80'}`}>
        <div className="text-left">
          <span className={`text-[13px] font-black uppercase tracking-wider block leading-none ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
            Active Schedules
          </span>
        </div>

        {/* Sort Menu Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer border ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
            id="sort-menu-trigger"
          >
            <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
              Sort: {sortBy}
            </span>
            <SlidersHorizontal className={`w-3.5 h-3.5 stroke-[2.5] ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`} />
          </button>

          {/* Premium Sort Popover Dropdown */}
          <AnimatePresence>
            {isSortDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsSortDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.12 }}
                  className={`absolute right-0 mt-2 w-40 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden border ${isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-white border-slate-100'}`}
                >
                  {[
                    { key: 'Recent', label: 'Recent Date', desc: 'Latest schedule first' },
                    { key: 'Upcoming', label: 'Upcoming Date', desc: 'Nearest schedule first' }
                  ].map((opt) => {
                    const isSelected = sortBy === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.key as any);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left transition-colors flex flex-col cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/60 active:bg-slate-800' : 'hover:bg-slate-50 active:bg-slate-100'}`}
                      >
                        <span className={`text-[11px] font-black ${isSelected ? 'text-[#86b500]' : isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[8.5px] font-semibold text-slate-400">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- BOOKINGS CONTENT LIST --- */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEcosystem}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-4"
          >
            {sortedAndFilteredBookings.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-16 rounded-3xl border shadow-xs text-center px-6 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-white border-slate-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-slate-400 mb-3 border ${isDarkMode ? 'bg-slate-900 border-slate-800/60' : 'bg-slate-50 border-slate-100'}`}>
                  <Truck className="w-5.5 h-5.5" />
                </div>
                <p className="text-xs font-black text-slate-800">No active bookings found</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Go back to the Service Plans tab to select a tune-up package.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAndFilteredBookings.map((booking) => {
                  const isCancelled = booking.isCancelled || cancelledBookingIds[booking.id];
                  const isCompleted = booking.isCompleted || completedBookingIds[booking.id];
                  const isVerified = verifiedBookings[booking.id];

                  // --- STATE 1: CANCELLED CARD ---
                  if (isCancelled) {
                    return (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`rounded-[20px] p-4 border flex flex-col space-y-3 relative opacity-75 ${isDarkMode ? 'bg-[#161D2A]/60 border-slate-800/60' : 'bg-slate-50/60 border-slate-100'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 min-w-0 flex-1 pr-3 text-left">
                            <span className="text-[8.5px] font-mono font-black text-slate-400 tracking-widest block uppercase">
                              ID: #{booking.maintenanceId}
                            </span>
                            <h4 className={`text-[13px] font-black leading-tight truncate line-through ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {booking.serviceName}
                            </h4>
                            <p className="text-[10.5px] text-slate-400 font-bold truncate">
                              {booking.cycleModel}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1.5 shrink-0 text-right">
                            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border line-through ${isDarkMode ? 'text-slate-400 bg-[#1E293B]/50 border-slate-800' : 'text-slate-400 bg-slate-50 border-slate-200'}`}>
                              ₹{booking.price}
                            </span>
                            <span className="bg-rose-50 border border-rose-100/60 text-rose-500 text-[8px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full">
                              Cancelled
                            </span>
                          </div>
                        </div>
                        <div className={`text-[10px] text-slate-400 font-bold text-left pt-2 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-[#CAD5E2]'}`}>
                          Cancelled on scheduled date: {booking.date}
                        </div>
                      </motion.div>
                    );
                  }

                  // --- STATE 2: COMPLETED CARD ---
                  if (isCompleted) {
                    return (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={() => handleOpenDetails(booking)}
                        className={`rounded-[24px] p-5 border shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col space-y-3.5 cursor-pointer active:scale-[0.99] transition-all ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:border-slate-800' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 min-w-0 flex-1 pr-3 text-left">
                            <span className="text-[8.5px] font-mono font-black text-emerald-600 tracking-widest block uppercase">
                              ID: #{booking.maintenanceId} • COMPLETED
                            </span>
                            <h4 className={`text-[14px] font-black leading-tight truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                              {booking.serviceName}
                            </h4>
                            <p className="text-[11px] text-[#64748B] font-bold mt-1">
                              {booking.cycleModel}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1.5 shrink-0 text-right">
                            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${isDarkMode ? 'text-slate-100 bg-[#1E293B] border-slate-700' : 'text-slate-900 bg-slate-100 border-slate-200'}`}>
                              ₹{booking.price}
                            </span>
                            <span className="inline-flex items-center space-x-0.5 bg-emerald-50 text-emerald-600 text-[8.5px] font-black tracking-wide uppercase">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Serviced</span>
                            </span>
                          </div>
                        </div>

                        <div className={`flex justify-between items-center text-[10.5px] pt-2 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-[#CAD5E2]'}`}>
                          <span className="font-bold text-[#64748B]">Service Completed</span>
                          <span className={`font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{booking.date}</span>
                        </div>
                      </motion.div>
                    );
                  }

                  // --- ACTIVE CARDS (TIER 1 & 2) ---
                  return (
                    <motion.div
                      key={booking.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      onClick={() => handleOpenDetails(booking)}
                      className={`border flex flex-col transition-all relative overflow-hidden text-left cursor-pointer active:scale-[0.99] ${
                        isVerified
                          ? 'rounded-[20px] p-4.5 shadow-[0_2px_12px_rgba(15,23,42,0.02)] hover:border-slate-800 space-y-3'
                          : 'rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4'
                      } ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-white border-slate-100/80'}`}
                    >
                      {/* Unified Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                            {!isVerified && (
                              <span className="text-[8.5px] font-mono font-black text-slate-400 tracking-widest block uppercase w-full">
                                Maintenance ID: #{booking.maintenanceId}
                              </span>
                            )}
                            <h4 className={`text-[13.5px] font-black leading-tight truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                              {booking.serviceName}
                            </h4>
                            {isVerified && (
                              <span className="inline-flex items-center space-x-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded tracking-wide shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>IN TRANSIT</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] text-[#64748B] font-bold mt-0.5 truncate">
                            {booking.cycleModel}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 text-right">
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${isDarkMode ? 'text-slate-100 bg-[#1E293B] border-slate-700' : 'text-slate-900 bg-slate-100 border-slate-200'}`}>
                            ₹{booking.price}
                          </span>
                          {!isVerified && (
                            <ChevronRight className="w-4 h-4 text-[#64748B] hover:translate-x-0.5 transition-transform stroke-[3]" />
                          )}
                        </div>
                      </div>

                      {/* Animated transition area inside card */}
                      <AnimatePresence mode="wait">
                        {!isVerified ? (
                          <motion.div
                            key="pin-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                          >
                            {/* Delivery Status Sub-card */}
                            <div className={`border rounded-[18px] p-3.5 flex items-center space-x-3 select-none ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#F8FAFC] border-slate-100/60'}`}>
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-850 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                <Truck className="w-5 h-5 stroke-[2]" />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                  Pickup Progress
                                </p>
                                <p className={`text-[11px] font-black leading-tight mt-0.5 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                  Delivery Partner Assigned
                                </p>
                              </div>
                            </div>

                            {/* Booking Date Info */}
                            {(() => {
                              const scheduleValueClass = isDarkMode 
                                ? "text-slate-100 font-bold" 
                                : "text-slate-800 font-bold";

                              const scheduleLabelClass = isDarkMode 
                                ? "text-slate-400 font-semibold" 
                                : "text-slate-500 font-semibold";

                              return (
                                <div className={`flex items-center justify-between py-2 border-t mb-3 ${isDarkMode ? 'border-slate-800/80' : 'border-[#CAD5E2]'}`}>
                                  <span className={`text-xs ${scheduleLabelClass} text-left`}>
                                    Scheduled pickup slot
                                  </span>
                                  <span className={`text-xs ${scheduleValueClass} text-right`}>
                                    {booking.date} • {booking.timeSlot || '10:00 AM - 12:00 PM'}
                                  </span>
                                </div>
                              );
                            })()}

                            {/* Action Button */}
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  handleTriggerVerifyPin(booking.id);
                                }}
                                className="w-full py-3.5 bg-[#CAEF00] text-[#0F172A] font-black tracking-widest rounded-xl hover:bg-[#b0d000] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 uppercase text-[11px] cursor-pointer shadow-md border border-[#CAEF00]"
                              >
                                <Lock className="w-3.5 h-3.5 text-[#0F172A] stroke-[2.5]" />
                                <span>Enter Pickup PIN</span>
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="transit-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            <div className={`border rounded-xl p-2.5 flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800/80' : 'bg-[#F8FAFC] border-slate-100/50'}`}>
                              <div className="flex items-center space-x-2">
                                <Truck className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                                <span className={`text-[10px] font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {transitSteps[booking.id] === 3 ? 'Bicycle at Station' : 'Partner En Route'}
                                </span>
                              </div>
                              <span className="text-[9px] font-black text-[#86b500] uppercase tracking-wide">
                                Step {transitSteps[booking.id] || 2} of 3
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>



      {/* --- PREMIUM VERIFY PICKUP PIN OVERLAY MODAL --- */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 select-none">
            {/* Dark background blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPinModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            {/* Modal Dialog Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className={`relative w-full max-w-[320px] rounded-[28px] p-6 shadow-2xl border flex flex-col text-center overflow-hidden z-10 transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800 text-[#F8FAFC]' : 'bg-white border-slate-100'}`}
            >
              {/* Padlock icon header */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shrink-0 shadow-3xs border transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
                <Lock className={`w-5 h-5 stroke-[2.5] ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`} />
              </div>

              {/* Title & Description */}
              <h4 className={`text-base font-black tracking-tight leading-snug ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                Verify Pickup PIN
              </h4>
              <p className={`text-[11px] font-medium mt-1 px-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                Enter the 6-digit PIN shown by the delivery partner to verify identity and hand over bicycle.
              </p>

              {/* Segmented Inputs */}
              <div className="relative flex justify-center space-x-1.5 my-5">
                {Array.from({ length: 6 }).map((_, i) => {
                  const char = enteredPin[i] || '';
                  const isFocused = enteredPin.length === i || (enteredPin.length === 6 && i === 5);
                  return (
                    <div
                      key={i}
                      className={`w-9 h-11 rounded-xl border text-sm font-black flex items-center justify-center transition-all ${
                        isFocused
                          ? isDarkMode ? 'border-[#CAEF00] ring-2 ring-[#CAEF00]/20 bg-slate-900 text-[#F8FAFC]' : 'border-slate-950 ring-2 ring-slate-950/10 bg-slate-50'
                          : char
                          ? isDarkMode ? 'border-slate-700 bg-slate-900 text-[#F8FAFC]' : 'border-slate-300 bg-slate-50 text-slate-900'
                          : isDarkMode ? 'border-slate-800 bg-[#161D2A] text-slate-500' : 'border-slate-200 bg-white text-slate-400'
                      }`}
                    >
                      {char || (isFocused ? <span className="w-1 h-3.5 bg-slate-900 animate-pulse rounded-full" /> : '')}
                    </div>
                  );
                })}
                
                {/* Invisible input wrapper for keyboard triggers */}
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={enteredPin}
                  onChange={handlePinChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {/* Suggestive helper badge matching screenshots */}
              <div className={`mb-4 rounded-lg py-1.5 px-3 flex items-center justify-center space-x-1.5 border transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
                <Info className="w-3.5 h-3.5 text-[#86b500] shrink-0" />
                <span className={`text-[9.5px] font-extrabold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Try default PIN: <span className="text-[#86b500] font-black">343122</span>
                </span>
              </div>

              {/* Symmetrical Actions Footer */}
              <div className="flex space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className={`flex-1 py-3 border font-black text-[11px] rounded-xl transition-colors uppercase cursor-pointer ${isDarkMode ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifySubmit}
                  disabled={isVerifying || enteredPin.length < 6}
                  className={`flex-1 py-3 font-black text-[11px] rounded-xl transition-colors flex items-center justify-center space-x-1.5 uppercase cursor-pointer ${isDarkMode ? 'bg-[#CAEF00] text-slate-950 hover:bg-[#b0d000] disabled:bg-slate-800 disabled:text-slate-600' : 'bg-slate-950 text-white hover:bg-slate-850 disabled:bg-slate-200 disabled:text-slate-400'}`}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying</span>
                    </>
                  ) : (
                    <span>Verify</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DECLINE QUOTE CONFIRMATION OVERLAY MODAL --- */}
      <AnimatePresence>
        {isDeclineConfirmOpen && selectedDetailsBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 select-none">
            {/* Dark background blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeclineConfirmOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            {/* Modal Dialog Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className={`relative w-full max-w-[320px] rounded-[28px] p-6 shadow-2xl border flex flex-col text-center overflow-hidden z-10 transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800 text-[#F8FAFC]' : 'bg-white border-slate-100'}`}
            >
              {/* Alert Triangle Icon Header */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shrink-0 shadow-3xs border transition-colors duration-200 ${isDarkMode ? 'bg-rose-950/20 border-rose-900/40 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>

              {/* Title & Description */}
              <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-950'}`}>
                Decline Repair?
              </h4>
              <p className={`text-[11.5px] font-medium mt-2 px-1 leading-relaxed text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Are you sure you want to decline this repair quotation? As per our service center terms, a mandatory return delivery fee of ₹{Base_Delivery_Fee} + ₹{Calculated_Tax_Amount.toFixed(2)} remains payable to return the bicycle to your location.
              </p>

              {/* Choice Action Buttons */}
              <div className="flex flex-col mt-5">
                <button
                  type="button"
                  onClick={() => setIsDeclineConfirmOpen(false)}
                  className={`w-full font-bold py-3.5 rounded-xl text-sm mb-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm text-center ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  NO, KEEP ESTIMATE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingTrackerStates(prev => ({
                      ...prev,
                      [selectedDetailsBooking.id]: 'declined'
                    }));
                    setIsDeclineConfirmOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-500 py-2 w-full text-center hover:underline cursor-pointer transition-all"
                >
                  YES, DECLINE REPAIR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- HIGH-FIDELITY ACTIVE DETAILS BOTTOM SHEET --- */}
      <AnimatePresence>
        {selectedDetailsBooking && (
          <div className="fixed inset-0 z-40 flex flex-col justify-end select-none">
            {/* Blur/backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetails}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
            />

            {/* Bottom Sheet wrapper */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className={`relative rounded-t-[32px] w-full max-h-[80%] flex flex-col shadow-2xl border-t-0 overflow-hidden z-10 transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F8FAFC]'}`}
            >
              {/* Premium Drag Handle & Top Close Trigger */}
              <div className="relative shrink-0 pt-3">
                <div className={`w-12 h-1.5 rounded-full mx-auto ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
                <button
                  type="button"
                  onClick={handleCloseDetails}
                  className={`absolute right-5 top-2 p-1.5 rounded-full text-slate-400 transition-all cursor-pointer ${isDarkMode ? 'hover:bg-slate-800 hover:text-slate-200' : 'hover:bg-slate-100 hover:text-slate-600'}`}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detailed contents view */}
              <div className="flex-1 overflow-y-auto px-5 pb-12 space-y-5">
                {(() => {
                  const isShopOrder = selectedDetailsBooking.type === 'SHOP' || 
                                     selectedDetailsBooking.type === 'Shop' || 
                                     selectedDetailsBooking.cartSegment === 'SHOP' || 
                                     selectedDetailsBooking.serviceId === 'shop' || 
                                     selectedDetailsBooking.serviceId === 'buy';
                  const isVerified = verifiedBookings[selectedDetailsBooking.id];

                  if (isShopOrder) {
                    return (
                      <>
                        {/* Drawer Header Card */}
                        <div className={`flex justify-between items-center text-left rounded-2xl p-4 my-3 ${
                          isDarkMode ? 'bg-[#161D2A] shadow-md shadow-black/20' : 'bg-white shadow-sm shadow-slate-200/50'
                        }`}>
                          <div className="min-w-0 flex-1 pr-3">
                            <span className="inline-block bg-[#CAEF00]/10 text-[#CAEF00] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-1.5">
                              VERIFIED RETAIL ORDER
                            </span>
                            <h4 className={`text-[15px] font-black leading-tight truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                              Purchase: {selectedDetailsBooking.serviceName && !selectedDetailsBooking.serviceName.toLowerCase().includes('purchase') 
                                ? selectedDetailsBooking.serviceName 
                                : selectedDetailsBooking.cycleModel.split('•')[0].trim()}
                            </h4>
                            <p className={`text-[11px] font-medium mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              Model: {selectedDetailsBooking.cycleModel}
                            </p>
                            <span className={`text-xs font-black tracking-widest uppercase mb-2 block mt-1.5 ${
                              isDarkMode ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              Ref: #{selectedDetailsBooking.maintenanceId || selectedDetailsBooking.id}
                            </span>
                          </div>
                          <span className={`shrink-0 font-black text-sm px-3 py-1.5 rounded-xl ${
                            isDarkMode ? 'bg-slate-800/80 text-slate-100' : 'bg-slate-100 text-slate-900'
                          }`}>
                            ₹{selectedDetailsBooking.price}
                          </span>
                        </div>

                        {/* Courier Details Card */}
                        <div className={`my-3 flex items-center justify-between gap-3.5 text-left rounded-2xl p-4 ${
                          isDarkMode ? 'bg-[#161D2A] shadow-md shadow-black/20' : 'bg-white shadow-sm shadow-slate-200/50'
                        }`}>
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="relative shrink-0">
                              <div className={`w-11 h-11 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                <img 
                                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" 
                                  alt={selectedDetailsBooking.partnerName || 'Courier'} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer" 
                                />
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 bg-[#CAEF00] rounded-full p-0.5 text-slate-950 border border-[#0B0F17]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h5 className={`text-[12.5px] font-black leading-none truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                {selectedDetailsBooking.partnerName || 'Marcus Vance'}
                              </h5>
                              <p className="text-[10px] font-semibold text-emerald-500 mt-1">
                                QWIK Logistics Courier • Active & On the Way
                              </p>
                            </div>
                          </div>
                          <a
                            href={`tel:${selectedDetailsBooking.partnerPhone || '+15553810294'}`}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              isDarkMode 
                                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            aria-label="Call Courier"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>

                        {/* Retail Delivery Status Timeline */}
                        <div className="space-y-2.5">
                          <h5 className={`text-xs font-black tracking-widest uppercase mb-2 block text-left ${
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            RETAIL FULFILLMENT TIMELINE
                          </h5>

                          <div className={`transition-colors duration-200 rounded-2xl p-5 space-y-4 ${
                            isDarkMode ? 'bg-[#161D2A] shadow-md shadow-black/20' : 'bg-white shadow-sm shadow-slate-200/50'
                          }`}>
                            <div className="space-y-4 text-left">
                              {/* Step 1: Order Placed & Registered */}
                              <div className="flex space-x-3 relative">
                                <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                <div className="relative z-10 flex items-center justify-center shrink-0">
                                  <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                    <Check className="w-3 h-3 stroke-[3.5]" />
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                    Order Placed & Registered
                                  </span>
                                  <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Order confirmed and registered to profile garage.
                                  </p>
                                </div>
                              </div>
 
                              {/* Step 2: Hub Assembly & Quality Check */}
                              <div className="flex space-x-3 relative">
                                <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                <div className="relative z-10 flex items-center justify-center shrink-0">
                                  <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                    <Check className="w-3 h-3 stroke-[3.5]" />
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                    Hub Assembly & Quality Check
                                  </span>
                                  <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Hydraulic pressure tested & firmware flashed.
                                  </p>
                                </div>
                              </div>
 
                              {/* Step 3: Out for Doorstep Delivery */}
                              <div className="flex space-x-3 relative">
                                <div className={`absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 ${
                                  isVerified ? 'bg-[#CAEF00]' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')
                                }`} />
                                <div className="relative z-10 flex items-center justify-center shrink-0">
                                  {isVerified ? (
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                      <Check className="w-3 h-3 stroke-[3.5]" />
                                    </div>
                                  ) : (
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-[#0B0F17] rounded-full" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span className={`text-[11.5px] font-black ${isVerified ? (isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900') : 'text-[#86b500]'}`}>
                                    Out for Doorstep Delivery
                                  </span>
                                  <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Courier en route with your assembled EV cycle.
                                  </p>
                                </div>
                              </div>
 
                              {/* Step 4: Delivered & Handed Over */}
                              <div className="flex space-x-3 relative">
                                <div className="relative z-10 flex items-center justify-center shrink-0">
                                  {isVerified ? (
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                      <Check className="w-3 h-3 stroke-[3.5]" />
                                    </div>
                                  ) : (
                                    <div className={`w-[18px] h-[18px] rounded-full ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`} />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span className={`text-[11.5px] font-black ${isVerified ? (isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900') : 'text-slate-400'}`}>
                                    Delivered & Handed Over
                                  </span>
                                  <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Verification PIN matched at doorstep.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {!isVerified && (
                              <div className={`pt-3 border-t text-left space-y-3 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60'}`}>
                                <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                  Verify delivery with your doorstep courier by entering the 6-digit confirmation PIN.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsPinModalOpen(true);
                                    setActivePinBookingId(selectedDetailsBooking.id);
                                    setEnteredPin('');
                                    setPinError(false);
                                  }}
                                  className="w-full py-4 bg-[#CAEF00] text-[#0F172A] font-black tracking-widest rounded-xl hover:bg-[#b0d000] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 uppercase text-[11px] cursor-pointer shadow-md"
                                >
                                  <Lock className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                                  <span>ENTER DELIVERY PIN</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  }

                  return (
                    <>
                      {/* Title and details header */}
                      <div className={`flex justify-between items-center text-left rounded-2xl p-4 my-3 ${
                        isDarkMode ? 'bg-[#161D2A] shadow-md shadow-black/20' : 'bg-white shadow-sm shadow-slate-200/50'
                      }`}>
                        <div className="min-w-0 flex-1 pr-3">
                          <span className="text-[8px] font-black text-[#86b500] uppercase tracking-widest block mb-0.5">Verified package</span>
                          <h4 className={`text-[15px] font-black leading-tight truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                            {selectedDetailsBooking.serviceName}
                          </h4>
                          <p className={`text-[11px] font-medium mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Model: {selectedDetailsBooking.cycleModel}
                          </p>
                          <span className={`text-xs font-black tracking-widest uppercase mb-2 block mt-1.5 ${
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            Maintenance ID: #{selectedDetailsBooking.maintenanceId}
                          </span>
                        </div>
                        <span className={`shrink-0 font-black text-sm px-3 py-1.5 rounded-xl ${
                          isDarkMode ? 'bg-slate-800/80 text-slate-100' : 'bg-slate-100 text-slate-900'
                        }`}>
                          ₹{selectedDetailsBooking.price}
                        </span>
                      </div>

                      {/* Delivery Agent Profile Card */}
                      <div className={`text-left rounded-2xl p-4 my-3 ${
                        isDarkMode ? 'bg-[#161D2A] shadow-md shadow-black/20' : 'bg-white shadow-sm shadow-slate-200/50'
                      }`}>
                        <span className={`text-xs font-black tracking-widest uppercase mb-2 block ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          Your Delivery Boy
                        </span>
                        <div className="flex items-center justify-between gap-3.5">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`w-11 h-11 rounded-full overflow-hidden shrink-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                              <img 
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" 
                                alt="Marcus" 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer" 
                              />
                            </div>
                            <div className="min-w-0">
                              <h5 className={`text-[12.5px] font-black leading-none truncate ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>{selectedDetailsBooking.partnerName}</h5>
                              <p className="text-[9.5px] font-semibold text-emerald-600 mt-1">Verified QWIKAMP Courier</p>
                            </div>
                          </div>
                          <a
                            href={`tel:${selectedDetailsBooking.partnerPhone || '+15553810294'}`}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              isDarkMode 
                                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            aria-label="Call Courier"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Main DELIVERY STATUS container */}
                      <div className="space-y-2.5">
                        <h5 className={`text-xs font-black tracking-widest uppercase mb-2 block text-left ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          DELIVERY STATUS
                        </h5>
                        <div className={`transition-colors duration-200 rounded-2xl p-5 space-y-4 ${
                          isDarkMode ? 'bg-[#161D2A] shadow-md shadow-black/20' : 'bg-white shadow-sm shadow-slate-200/50'
                        }`}>
                          {/* Partner assigned indicator */}
                          <div className="flex items-center space-x-3 text-left">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${isDarkMode ? 'bg-slate-850 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
                              <Truck className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                              <h6 className={`text-[12px] font-black leading-none ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                {!verifiedBookings[selectedDetailsBooking.id] ? "Delivery Partner Assigned" : (
                                  bookingTrackerStates[selectedDetailsBooking.id] === 'transit' ? "Bicycle Picked Up. In Transit to Service Center" : (
                                    bookingTrackerStates[selectedDetailsBooking.id] === 'pending_approval' ? "Inspection Complete. Review Quote" : (
                                      bookingTrackerStates[selectedDetailsBooking.id] === 'declined' ? "Inspection Declined" : "Bicycle at Service Center. Under Servicing"
                                    )
                                  )
                                )}
                              </h6>
                              <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
                                {!verifiedBookings[selectedDetailsBooking.id] ? `Handover Courier: ${selectedDetailsBooking.partnerName}` : (
                                  bookingTrackerStates[selectedDetailsBooking.id] === 'transit' ? "En route to Service Hub" : (
                                    bookingTrackerStates[selectedDetailsBooking.id] === 'pending_approval' ? "Quotation awaiting authorization" : (
                                      bookingTrackerStates[selectedDetailsBooking.id] === 'declined' ? "Bicycle will be routed back to you" : "Authorized repairs in progress"
                                    )
                                  )
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Conditional Stepper Journey based on verification */}
                          {!verifiedBookings[selectedDetailsBooking.id] ? (
                            /* STATE A: Trigger verification from details panel */
                            <div className="space-y-3.5 pt-2 text-left">
                              <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Secure identity handshake is required before handoff. Please ask the partner for the 6-digit PIN and verify it here.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsPinModalOpen(true);
                                  setActivePinBookingId(selectedDetailsBooking.id);
                                  setEnteredPin('');
                                  setPinError(false);
                                }}
                                className="w-full py-4 bg-[#CAEF00] text-[#0F172A] font-black tracking-widest rounded-xl hover:bg-[#b0d000] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 uppercase text-[11px] cursor-pointer shadow-md"
                              >
                                <Lock className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                                <span>Enter Pickup PIN</span>
                              </button>
                            </div>
                          ) : (
                            /* POST-PIN states: State A, B, C */
                            <div className="space-y-4 pt-2">
                              {/* If State A: In Transit to Workshop */}
                              {bookingTrackerStates[selectedDetailsBooking.id] === 'transit' && (
                                <div className="space-y-4">
                                  {/* Pulsing Neutral Gray Location status check visual state */}
                                  <div className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl space-y-3 ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                                    <div className={`relative flex items-center justify-center w-14 h-14 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100 shadow-sm'}`}>
                                      <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-slate-300 rounded-full"
                                      />
                                      <Truck className={`w-6 h-6 relative z-10 animate-bounce ${isDarkMode ? 'text-[#CAEF00]' : 'text-slate-600'}`} />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        Live Location Check
                                      </p>
                                      <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5">
                                        Pulsing GPS connection... Partner is currently en route.
                                      </p>
                                    </div>
                                  </div>
                                        {/* Stepper progress rail for Transit */}
                                  <div className={`space-y-4 border-t pt-4 text-left ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60'}`}>
                                    {/* Step 1 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                          Delivery Partner Assigned
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Pickup partner identity checked and confirmed.
                                        </p>
                                      </div>
                                    </div>
 
                                    {/* Step 2 */}
                                    <div className="flex space-x-3 relative">
                                      <div className={`absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-slate-400 flex items-center justify-center animate-pulse">
                                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-[11.5px] font-black text-[#86b500]">
                                          Bicycle Picked Up. In Transit to Service Center
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          En route safely to nearest high-speed service station.
                                        </p>
                                      </div>
                                    </div>
 
                                    {/* Step 3 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className={`w-[18px] h-[18px] rounded-full ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm shadow-slate-200/50'}`} />
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                                          Bicycle at Service Center. Under Servicing
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Routine maintenance packages will commence instantly.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* If State B: Inspection & Pending Quotation Approval */}
                              {bookingTrackerStates[selectedDetailsBooking.id] === 'pending_approval' && (
                                <div className="space-y-4">
                                  {/* Top Border Separator */}
                                  <div className={`border-t mb-6 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60'}`} />

                                  {/* Flat Layout Integration (DominantQuoteWidget) */}
                                  <div className="text-center">
                                    <p className="text-xs font-bold text-slate-400 tracking-wider mb-2 uppercase">
                                      FINAL ITEMIZED TOTAL
                                    </p>
                                    <p className={`text-4xl font-black mb-6 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                      ₹{Final_Quotation_Amount.toFixed(2)}
                                    </p>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setBookingTrackerStates(prev => ({
                                          ...prev,
                                          [selectedDetailsBooking.id]: 'under_repair'
                                        }));
                                      }}
                                      className="w-full py-4 bg-[#CAEF00] text-slate-900 rounded-xl font-extrabold text-sm shadow-sm transition-all hover:bg-[#b0d000] active:scale-[0.98] cursor-pointer uppercase"
                                    >
                                      ACCEPT & REPAIR
                                    </button>
                                    
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsDeclineConfirmOpen(true);
                                      }}
                                      className="text-xs font-semibold text-slate-400 py-3 hover:text-rose-500 transition-colors cursor-pointer block text-center w-full"
                                    >
                                      DECLINE QUOTE
                                    </button>
                                  </div>

                                  {/* Bottom Border Separator */}
                                  <div className={`border-b mt-4 mb-6 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60'}`} />

                                  {/* Stepper Progress Rail in State B */}
                                  <div className={`space-y-4 border-t pt-4 text-left ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60'}`}>
                                    {/* Step 1 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                          Delivery Partner Assigned
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Pickup partner identity checked and confirmed.
                                        </p>
                                      </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                          Bicycle Picked Up. In Transit to Service Center
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          En route safely to nearest high-speed service station.
                                        </p>
                                      </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-[11.5px] font-black text-amber-600">
                                          Inspection Complete. Review Quote
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Please authorize or decline the final quotation.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* If State B fallback: DECLINED */}
                              {bookingTrackerStates[selectedDetailsBooking.id] === 'declined' && (
                                <div className="space-y-4">
                                  {/* Warning panel block (MandatoryReturnChargeState) */}
                                  <div className={`rounded-xl p-3.5 text-left space-y-3 transition-colors duration-200 ${
                                    isDarkMode ? 'bg-rose-950/30 text-rose-300' : 'bg-rose-50 text-rose-800 shadow-sm shadow-rose-200/50'
                                  }`}>
                                    <p className="text-[11px] leading-normal font-medium">
                                      You have declined the inspection quotation. As per service center terms, the mandatory delivery charge remains payable for immediate return routing.
                                    </p>
                                    <div className={`flex justify-between items-center border-t pt-2.5 text-[10.5px] font-black ${isDarkMode ? 'border-slate-800/80 text-slate-300' : 'border-rose-200/50 text-slate-700'}`}>
                                      <span className="uppercase tracking-wider">Mandatory Return Charge (Base + GST)</span>
                                      <span className={`text-right ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                                        ₹{Base_Delivery_Fee} + ₹{Calculated_Tax_Amount.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Stepper Progress Rail in Declined state */}
                                  <div className={`space-y-4 border-t pt-4 text-left ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60'}`}>
                                    {/* Step 1 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                          Delivery Partner Assigned
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Pickup partner identity checked and confirmed.
                                        </p>
                                      </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                          Bicycle Picked Up. In Transit to Service Center
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          En route safely to nearest high-speed service station.
                                        </p>
                                      </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-rose-500 flex items-center justify-center text-white">
                                          <X className="w-3 h-3 stroke-[3]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-[11.5px] font-black text-rose-600">
                                          Inspection Declined & Return Scheduled
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Immediate return routing initiated.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* If State C: Cycle Under Repair */}
                              {bookingTrackerStates[selectedDetailsBooking.id] === 'under_repair' && (
                                <div className="space-y-4">
                                  {/* Visual/Banner feedback for Under Repair */}
                                  <div className={`p-3.5 rounded-xl text-left transition-colors duration-200 ${
                                    isDarkMode ? 'bg-emerald-950/30 text-emerald-300' : 'bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-250/20'
                                  }`}>
                                    <p className="text-xs font-bold leading-normal">
                                      ✓ Quotation approved! Repairs and service work are currently active.
                                    </p>
                                  </div>

                                  {/* Stepper progress rail for Under Repair */}
                                  <div className={`space-y-4 border-t pt-4 text-left ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60'}`}>
                                    {/* Step 1 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                          Delivery Partner Assigned
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Pickup partner identity checked and confirmed.
                                        </p>
                                      </div>
                                    </div>
 
                                    {/* Step 2 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                          Bicycle Picked Up. In Transit to Service Center
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          En route safely to nearest high-speed service station.
                                        </p>
                                      </div>
                                    </div>
 
                                    {/* Step 3 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="absolute top-4 left-[8px] -translate-x-1/2 w-0.5 h-9 bg-[#CAEF00]" />
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#CAEF00] flex items-center justify-center text-slate-950">
                                          <Check className="w-3 h-3 stroke-[3.5]" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-[11.5px] font-black text-[#86b500]">
                                          Bicycle at Service Center. Under Servicing
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Routine maintenance and authorized repairs are underway.
                                        </p>
                                      </div>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="flex space-x-3 relative">
                                      <div className="relative z-10 flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] rounded-full bg-slate-900 flex items-center justify-center animate-pulse">
                                          <span className="w-1.5 h-1.5 bg-[#CAEF00] rounded-full" />
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        <span className={`text-[11.5px] font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                                          Calibration & Return Delivery
                                        </span>
                                        <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          Post-repair diagnostic runs and scheduled doorstep dispatch.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 4-OPTION SEGMENTED ECOSYSTEM SELECTOR --- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[340px] z-30 select-none">
        <div className={`p-1 rounded-full flex border shadow-sm transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#F1F5F9] border-slate-200/40'}`}>
          {['Repair', 'Service', 'Shop', 'Doorstep'].map((eco) => {
            const isActive = selectedEcosystem === eco;
            return (
              <button
                key={eco}
                type="button"
                onClick={() => setSelectedEcosystem(eco as any)}
                className="flex-1 text-center py-2 text-[9.5px] font-black tracking-widest uppercase rounded-full cursor-pointer relative transition-colors focus:outline-none"
                id={`eco-tab-${eco.toLowerCase()}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeEcosystemTab"
                    className={`absolute inset-0 rounded-full shadow-md border ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-white border-slate-100/40'}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-200 block ${isActive ? (isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]') : (isDarkMode ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#0F172A]')}`}>
                  {eco.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
