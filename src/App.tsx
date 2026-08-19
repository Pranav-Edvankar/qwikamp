import { useState, startTransition, useEffect } from 'react';
import PhoneMockup from './components/PhoneMockup';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import RepairView from './components/RepairView';
import BookingsView from './components/BookingsView';
import ProfileView from './components/ProfileView';
import OnboardingFlow from './components/OnboardingFlow';
import { INITIAL_USER_STATS, INITIAL_BOOKINGS } from './data';
import { Booking, UserStats } from './types';
import { Home as HomeIcon, ShoppingBag, Wrench, Calendar, User as UserIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Cycle Shop' | 'Repair' | 'Bookings' | 'Profile'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qwikamp_active_tab');
      if (saved && ['Home', 'Cycle Shop', 'Repair', 'Bookings', 'Profile'].includes(saved)) {
        return saved as any;
      }
    }
    return 'Home';
  });
  const [navigationParams, setNavigationParams] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Onboarding persistence states with local storage backing
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qwikamp_onboarded') === 'true';
    }
    return false;
  });
  const [userMobile, setUserMobile] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qwikamp_user_mobile') || '';
    }
    return '';
  });

  // Core global state for garage and bookings with local storage backing
  const [ownedCycles, setOwnedCycles] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qwikamp_owned_cycles');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return ['QWIK-VOLT CARBON R'];
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qwikamp_bookings');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_BOOKINGS;
  });
  const [userStats, setUserStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qwikamp_user_stats');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_USER_STATS;
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Keep state synced to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('qwikamp_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('qwikamp_onboarded', isOnboarded ? 'true' : 'false');
  }, [isOnboarded]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('qwikamp_user_mobile', userMobile);
  }, [userMobile]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('qwikamp_owned_cycles', JSON.stringify(ownedCycles));
  }, [ownedCycles]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('qwikamp_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('qwikamp_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Dynamically listen to system theme changes and update state accordingly
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    // Support both modern addEventListener and legacy addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Dynamic deep-linking navigation orchestrator
  const navigateWithParams = (
    tab: 'Home' | 'Cycle Shop' | 'Repair' | 'Bookings' | 'Profile' | 'CART',
    params: any = null
  ) => {
    startTransition(() => {
      setNavigationParams(params);
      if ((tab as string) === 'CART') {
        setActiveTab('Bookings');
      } else {
        setActiveTab(tab as any);
      }
    });
  };

  // Add a purchased or registered cycle to the garage
  const handleAddCycle = (cycleName: string) => {
    if (!ownedCycles.includes(cycleName)) {
      setOwnedCycles(prev => [cycleName, ...prev]);
      
      // Update stats: increments total registered vehicles or offsets
      setUserStats(prev => ({
        ...prev,
        totalMiles: prev.totalMiles + 120, // simulate some initial odometer for verification
        co2SavedKg: prev.co2SavedKg + 48,
        batteryHealth: 100
      }));
    }
  };

  // Add a purchase order to the global Active Schedules feed
  const addOrderToActiveSchedules = (newOrder: any) => {
    const orderBooking: Booking & { type?: string; maintenanceId?: string; partnerName?: string; partnerPhone?: string } = {
      id: newOrder.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: newOrder.serviceId || 'shop',
      serviceName: newOrder.serviceName || 'Purchase: QWIK-VOLT CARBON R • M',
      cycleModel: newOrder.cycleModel || 'QWIK-VOLT CARBON R • Electric Lime',
      date: newOrder.date || '29 Jul 2026',
      timeSlot: newOrder.timeSlot || 'Express Doorstep Delivery',
      location: newOrder.location || 'San Francisco Hub',
      status: 'pending',
      price: newOrder.price || 12000,
      notes: newOrder.notes,
      type: newOrder.type || 'SHOP',
      maintenanceId: newOrder.maintenanceId || `${Math.floor(10000 + Math.random() * 90000)}`,
      partnerName: newOrder.partnerName || 'QWIK Logistics Hub',
      partnerPhone: newOrder.partnerPhone || '+1 (555) 019-2834',
      steps: [
        {
          title: 'Order Confirmed',
          description: 'Awaiting dispatch verification.',
          time: 'Just Now',
          completed: true,
          active: false
        },
        {
          title: 'Quality Check & Packing',
          description: 'Hub mechanics performing final diagnostics.',
          time: 'In Progress',
          completed: false,
          active: true
        },
        {
          title: 'Doorstep Delivery',
          description: 'Ready for rider handoff.',
          time: 'Pending',
          completed: false,
          active: false
        }
      ]
    };
    setBookings(prev => {
      if (prev.some(b => b.id === orderBooking.id)) return prev;
      return [orderBooking, ...prev];
    });
  };

  // Create a new repair service appointment
  const handleAddBooking = (newBookingData: {
    serviceId: string;
    serviceName: string;
    cycleModel: string;
    date: string;
    timeSlot: string;
    location: string;
    notes?: string;
    price: number;
  }) => {
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: newBookingData.serviceId,
      serviceName: newBookingData.serviceName,
      cycleModel: newBookingData.cycleModel,
      date: newBookingData.date,
      timeSlot: newBookingData.timeSlot,
      location: newBookingData.location,
      status: 'pending',
      price: newBookingData.price,
      notes: newBookingData.notes,
      steps: [
        {
          title: 'Booking Confirmed',
          description: 'Awaiting scheduling slot verification.',
          time: 'Just Now',
          completed: true,
          active: false
        },
        {
          title: 'Under Review',
          description: 'Mechanic assignment under final review.',
          time: 'Pending',
          completed: false,
          active: true
        },
        {
          title: 'Service Completed',
          description: 'Digital invoice & full diagnostic checks.',
          time: 'Awaiting service',
          completed: false,
          active: false
        }
      ]
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  // Cancel an upcoming appointment
  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  // Render active screen
  const renderActiveView = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeView onNavigate={navigateWithParams} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />;
      case 'Cycle Shop':
        return (
          <ShopView
            initialProductId={navigationParams?.productId}
            onNavigate={navigateWithParams}
            onPurchaseCycle={handleAddCycle}
            addOrderToActiveSchedules={addOrderToActiveSchedules}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        );
      case 'Repair':
        return (
          <RepairView
            initialServiceType={navigationParams?.serviceType}
            initialView={navigationParams?.view}
            onNavigate={navigateWithParams}
            onAddBooking={handleAddBooking}
            onDrawerOpenChange={setIsDrawerOpen}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        );
      case 'Bookings':
        return (
          <BookingsView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onNavigate={navigateWithParams}
            onDrawerOpenChange={setIsDrawerOpen}
            initialCartSegment={navigationParams?.cartSegment || navigationParams?.segment}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        );
      case 'Profile':
        return (
          <ProfileView
            userStats={userStats}
            ownedCycles={ownedCycles}
            onRegisterCycle={handleAddCycle}
            onUpdateUserStats={setUserStats}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onLogout={() => {
              setIsOnboarded(false);
              setActiveTab('Home');
            }}
          />
        );
      default:
        return <HomeView onNavigate={navigateWithParams} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />;
    }
  };

  return (
    <PhoneMockup isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}>
      {/* Active app viewport */}
      <div className={`flex-1 overflow-hidden flex flex-col relative ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}>
        {!isOnboarded ? (
          <OnboardingFlow 
            isDarkMode={isDarkMode} 
            onComplete={(mobile) => {
              setUserMobile(mobile);
              setIsOnboarded(true);
            }} 
          />
        ) : (
          renderActiveView()
        )}
      </div>

      {/* --- STICKY BOTTOM NAVIGATION BAR --- */}
      {isOnboarded && !isDrawerOpen && (
        <nav className={`relative h-[72px] flex items-center justify-between px-4 select-none shrink-0 z-40 transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A]/90 border-t border-slate-800/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md border-t border-slate-200/50'}`}>
          
          {/* Tab 1: Home */}
          <button
            onClick={() => navigateWithParams('Home')}
            className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 group focus:outline-none cursor-pointer"
            id="nav-tab-home"
          >
            <HomeIcon
              className={`w-5 h-5 transition-colors ${
                activeTab === 'Home' ? 'text-[#CAEF00] stroke-[2.5]' : isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            <span
              className={`text-[9px] font-bold tracking-tight transition-all uppercase ${
                activeTab === 'Home' ? (isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900') + ' font-extrabold' : 'text-slate-400'
              }`}
            >
              Home
            </span>
          </button>

          {/* Tab 2: Cycle Shop */}
          <button
            onClick={() => navigateWithParams('Cycle Shop')}
            className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 group focus:outline-none cursor-pointer"
            id="nav-tab-shop"
          >
            <ShoppingBag
              className={`w-5 h-5 transition-colors ${
                activeTab === 'Cycle Shop' ? 'text-[#CAEF00] stroke-[2.5]' : isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            <span
              className={`text-[9px] font-bold tracking-tight transition-all uppercase ${
                activeTab === 'Cycle Shop' ? (isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900') + ' font-extrabold' : 'text-slate-400'
              }`}
            >
              Shop
            </span>
          </button>

          {/* Tab 3: Central ELEVATED floating action button for REPAIR */}
          <div className="flex-1 flex flex-col items-center justify-center relative -mt-6">
            <button
              onClick={() => navigateWithParams('Repair')}
              className={`w-14 h-14 rounded-full bg-slate-900 border-4 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer group`}
              style={{
                boxShadow: activeTab === 'Repair' ? '0 10px 20px -5px rgba(202, 239, 0, 0.4)' : undefined,
                borderColor: activeTab === 'Repair' ? '#CAEF00' : isDarkMode ? '#161D2A' : 'white'
              }}
              id="nav-tab-repair-fab"
              aria-label="Book Repair Service"
            >
              <Wrench
                className={`w-5.5 h-5.5 transition-colors ${
                  activeTab === 'Repair' ? 'text-[#CAEF00]' : 'text-white'
                }`}
              />
            </button>
            <span
              className={`text-[9px] font-bold tracking-tight uppercase mt-1 ${
                activeTab === 'Repair' ? (isDarkMode ? 'text-[#F8FAFC] font-extrabold' : 'text-slate-900 font-extrabold') : 'text-slate-400'
              }`}
            >
              Repair
            </span>
          </div>

          {/* Tab 4: Bookings (Cart) */}
          <button
            onClick={() => navigateWithParams('Bookings')}
            className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 group focus:outline-none cursor-pointer"
            id="nav-tab-bookings"
          >
            <Calendar
              className={`w-5 h-5 transition-colors ${
                activeTab === 'Bookings' ? 'text-[#CAEF00] stroke-[2.5]' : isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            <span
              className={`text-[9px] font-bold tracking-tight transition-all uppercase ${
                activeTab === 'Bookings' ? (isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900') + ' font-extrabold' : 'text-slate-400'
              }`}
            >
              Cart
            </span>
          </button>

          {/* Tab 5: Profile */}
          <button
            onClick={() => navigateWithParams('Profile')}
            className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 group focus:outline-none cursor-pointer"
            id="nav-tab-profile"
          >
            <UserIcon
              className={`w-5 h-5 transition-colors ${
                activeTab === 'Profile' ? 'text-[#CAEF00] stroke-[2.5]' : isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            <span
              className={`text-[9px] font-bold tracking-tight transition-all uppercase ${
                activeTab === 'Profile' ? (isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900') + ' font-extrabold' : 'text-slate-400'
              }`}
            >
              Profile
            </span>
          </button>
        </nav>
      )}
    </PhoneMockup>
  );
}
