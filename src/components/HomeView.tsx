import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, Star, MapPin, Wrench, Shield, ShoppingBag, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { CYCLE_PRODUCTS, SERVICE_CARDS, INITIAL_USER_STATS } from '../data';
import { CycleProduct, ServiceCard } from '../types';

interface HomeViewProps {
  onNavigate: (tab: 'Home' | 'Cycle Shop' | 'Repair' | 'Bookings' | 'Profile', params?: any) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function HomeView({ onNavigate, isDarkMode = false, onToggleDarkMode }: HomeViewProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: CycleProduct[]; services: ServiceCard[] }>({ products: [], services: [] });
  const [showNotifications, setShowNotifications] = useState(false);

  // Auto-scroll carousel every 8 seconds
  useEffect(() => {
    if (searchQuery) return; // Pause auto-scroll when searching
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CYCLE_PRODUCTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [searchQuery]);

  // Handle Search Filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], services: [] });
      return;
    }
    const query = searchQuery.toLowerCase();
    const filteredProducts = CYCLE_PRODUCTS.filter(
      p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
    const filteredServices = SERVICE_CARDS.filter(
      s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)
    );
    setSearchResults({ products: filteredProducts, services: filteredServices });
  }, [searchQuery]);

  const currentProduct = CYCLE_PRODUCTS[carouselIndex];

  // Map service icon types to Lucide Icons
  const getServiceIcon = (type: string, color: string) => {
    const classes = `w-6 h-6 ${
      color === 'amber' ? 'text-amber-500' :
      color === 'green' ? 'text-emerald-500' :
      color === 'blue' ? 'text-blue-500' : 'text-purple-500'
    }`;
    switch (type) {
      case 'wrench': return <Wrench className={classes} />;
      case 'shield': return <Shield className={classes} />;
      case 'shopping-bag': return <ShoppingBag className={classes} />;
      case 'truck': return <Truck className={classes} />;
      default: return <Wrench className={classes} />;
    }
  };

  // Glow tints for service card icons
  const getGlowBg = (color: string) => {
    switch (color) {
      case 'amber': return 'bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
      case 'green': return 'bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
      case 'blue': return 'bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]';
      case 'purple': return 'bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto pb-6 relative transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}>
      
      {/* --- TOP NAVIGATION BAR --- */}
      <header className={`sticky top-0 backdrop-blur-md px-5 pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-4 flex items-center justify-between z-30 select-none border-b transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17]/95 border-slate-800/60' : 'bg-[#F4F6F9]/95 border-slate-200/40'}`}>
        <div className="flex items-center space-x-2">
          {/* Stylized Brand Logo (first SVG from prompt) */}
          <div className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-xl shadow-md p-1 border border-white/5 shrink-0">
            <svg width="100%" height="100%" viewBox="0 0 1568 1943" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1198.59 932.74L1564.03 1361.05C1566.33 1345.86 1567.48 1329.98 1567.48 1313.64V264.89C1567.48 118.59 1448.88 0 1302.59 0H264.89C118.59 0 0 118.6 0 264.89V1313.64C0 1472.44 105.87 1578.53 264.89 1578.53H772.81L1077.28 1942.84H1567.25L944.07 1212.65C938.94 1206.63 931.42 1203.17 923.52 1203.17H419.55C395.15 1203.17 375.36 1183.39 375.36 1158.98V546.23L648.73 866.57C658.42 877.92 675.47 879.27 686.82 869.58L931.21 661.02C942.56 651.33 943.91 634.28 934.22 622.92L722.94 375.34H1147.93C1172.33 375.34 1192.12 395.12 1192.12 419.53V915.19C1192.12 921.62 1194.41 927.84 1198.59 932.73V932.74Z" fill="#CAEF00"/>
            </svg>
          </div>
          {/* Wordmark Text */}
          <div className="flex items-baseline font-black tracking-tight text-lg">
            <span className={`transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>QWIK</span>
            <span className="text-[#CAEF00] ml-[1px] filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">AMP</span>
          </div>
        </div>

        {/* Right side utility buttons */}
        <div className="flex items-center space-x-3">
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-2xs transition-colors relative ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 text-[#F8FAFC] hover:bg-slate-850' : 'bg-white border-slate-200/50 hover:bg-slate-50 text-slate-700'}`}
            id="notification-bell-btn"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#CAEF00] ring-2 ring-white" />
          </button>
          
          {/* Profile Avatar Chip */}
          <button 
            onClick={() => onNavigate('Profile')}
            className={`w-10 h-10 rounded-full overflow-hidden border-2 shadow-xs hover:scale-105 transition-transform ${isDarkMode ? 'border-slate-800' : 'border-white bg-slate-200'}`}
            id="user-avatar-chip"
          >
            <img 
              src={INITIAL_USER_STATS.avatar} 
              alt={INITIAL_USER_STATS.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </header>

      {/* --- NOTIFICATIONS POPUP OVERLAY --- */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-[72px] right-5 left-5 rounded-2xl shadow-xl border p-4 z-50 transition-colors duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/85' : 'bg-white border-slate-200/60'}`}
          >
            <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
              <span className={`font-bold text-sm ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>Notifications</span>
              <button 
                onClick={() => setShowNotifications(false)}
                className={`text-xs hover:underline ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Clear all
              </button>
            </div>
            <div className="space-y-3 mt-3">
              <div 
                className={`flex items-start space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'bg-slate-900/60 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100/70'}`}
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate('Bookings');
                }}
              >
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[#CAEF00] shrink-0" />
                <div>
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Technician Dispatched</p>
                  <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Mobile Van #14 is heading to 450 Mission St for your Brake service.</p>
                </div>
              </div>
              <div className={`flex items-start space-x-3 p-2 rounded-lg`}>
                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-500 shrink-0" />
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Upgrade Available</p>
                  <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Carbon Series firmware v2.4.2 released. Upgrade at your next service check.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 mt-3 space-y-5">
        {/* --- GLOBAL SEARCH BAR --- */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for services, gear, or hubs..."
            className={`w-full pl-12 pr-4 py-3.5 text-sm rounded-full border shadow-xs focus:outline-none focus:ring-2 focus:ring-[#CAEF00] focus:border-transparent transition-all ${isDarkMode ? 'bg-[#161D2A] text-[#F8FAFC] placeholder-slate-500 border-slate-800/60' : 'bg-white text-slate-800 placeholder-slate-400 border-slate-200/50'}`}
            id="global-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`absolute right-4 inset-y-0 hover:underline text-xs font-semibold ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Clear
            </button>
          )}
        </div>

        {/* --- SEARCH RESULTS OVERLAY --- */}
        <AnimatePresence>
          {searchQuery.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`rounded-2xl border p-4 shadow-lg z-20 relative max-h-[480px] overflow-y-auto space-y-4 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/60'}`}
            >
              <div>
                <h3 className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-2">Cycle Products</h3>
                {searchResults.products.length === 0 ? (
                  <p className={`text-xs py-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No matching EV cycles found</p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.products.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => {
                           setSearchQuery('');
                           onNavigate('Cycle Shop', { productId: product.id });
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-[#F4F6F9]'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                          <div>
                            <p className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>{product.name}</p>
                            <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{product.category}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-2">Ecosystem Services</h3>
                {searchResults.services.length === 0 ? (
                  <p className={`text-xs py-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No matching services found</p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.services.map(service => (
                      <div 
                        key={service.id}
                        onClick={() => {
                          setSearchQuery('');
                          if (service.id === 'buy') {
                            onNavigate('Cycle Shop');
                          } else {
                            onNavigate('Repair', { serviceId: service.id });
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-[#F4F6F9]'}`}
                      >
                        <div>
                          <p className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>{service.title}</p>
                          <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{service.description}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'text-emerald-400 bg-emerald-950/40' : 'text-emerald-600 bg-emerald-50'}`}>{service.priceEstimate}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {searchQuery.trim() === '' && (
          <>
            {/* --- HERO CAROUSEL CARD (Featured Product with Dual-Category Tabs) --- */}
            <div className="relative">
              <div className="flex items-center justify-between select-none mb-2">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">Featured Offerings</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCarouselIndex((prev) => (prev - 1 + CYCLE_PRODUCTS.length) % CYCLE_PRODUCTS.length)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shadow-2xs transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 text-[#F8FAFC] hover:bg-slate-800' : 'bg-white border-slate-200/50 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setCarouselIndex((prev) => (prev + 1) % CYCLE_PRODUCTS.length)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shadow-2xs transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 text-[#F8FAFC] hover:bg-slate-800' : 'bg-white border-slate-200/50 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slider Area */}
              <div className={`rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border transition-colors duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-white border-slate-100'}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Top left badge and right price */}
                    <div className="flex justify-between items-start pt-1">
                      {currentProduct.tag ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider text-slate-950 bg-[#CAEF00] uppercase shadow-xs">
                          {currentProduct.tag}
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase shadow-xs ${isDarkMode ? 'text-[#F8FAFC] bg-slate-800' : 'text-slate-950 bg-slate-100'}`}>
                          FEATURED
                        </span>
                      )}
                      <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${isDarkMode ? 'text-[#F8FAFC] bg-slate-800/80' : 'text-slate-900 bg-slate-50'}`}>₹{currentProduct.price.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Studio Photograph Center */}
                    <div className="h-44 w-full flex items-center justify-center overflow-hidden rounded-2xl relative bg-[#0F172A] group cursor-pointer"
                         onClick={() => onNavigate('Cycle Shop', { productId: currentProduct.id })}
                    >
                      <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Bottom Area Description & Title */}
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase">
                          {currentProduct.category}
                        </span>
                        <h2 className={`text-base font-black tracking-tight leading-tight transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                          {currentProduct.name}
                        </h2>
                        
                        {/* Rating and Hub */}
                        <div className="flex items-center space-x-3 text-[10px]">
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                            {currentProduct.rating}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('Repair', { view: 'hubs' });
                            }}
                            className={`flex items-center transition-colors cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                          >
                            <MapPin className="w-3 h-3 text-slate-400 mr-0.5" />
                            <span>SF Hub</span>
                          </button>
                        </div>
                      </div>

                      {/* Action Button BUY NOW with Charcoal Slate (#0B0F17) text for Contrast */}
                      <button
                        onClick={() => onNavigate('Cycle Shop', { productId: currentProduct.id })}
                        className="px-5 py-2.5 bg-[#CAEF00] text-[#0B0F17] text-xs font-black tracking-wider rounded-xl hover:bg-[#b0d000] active:scale-95 shadow-[0_4px_12px_rgba(202,239,0,0.3)] transition-all cursor-pointer uppercase shrink-0"
                        id={`buy-now-${currentProduct.id}`}
                      >
                        BUY NOW
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Center page Indicators */}
                <div className="flex justify-center space-x-1.5 mt-4">
                  {CYCLE_PRODUCTS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === carouselIndex ? 'w-4 bg-[#CAEF00]' : isDarkMode ? 'w-1.5 bg-slate-800' : 'w-1.5 bg-slate-200'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* --- GRID SECTION - "ECOSYSTEM SERVICES" --- */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase select-none">
                Ecosystem Services
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                {SERVICE_CARDS.map((service) => (
                  <motion.div
                    key={service.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (service.id === 'buy') {
                        onNavigate('Cycle Shop');
                      } else if (service.id === 'service') {
                        onNavigate('Repair', { serviceType: 'service' });
                      } else if (service.id === 'doorstep') {
                        onNavigate('Repair', { serviceType: 'doorstep' });
                      } else {
                        onNavigate('Repair', { serviceType: 'repair' });
                      }
                    }}
                    className={`rounded-2xl p-4 border flex flex-col justify-between h-[135px] cursor-pointer group transition-all duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 shadow-2xl hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'}`}
                    id={`service-card-${service.id}`}
                  >
                    {/* Icon container with glow background tint */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center self-start ${getGlowBg(service.colorTheme)} transition-transform group-hover:scale-105 duration-300`}>
                      {getServiceIcon(service.iconType, service.colorTheme)}
                    </div>

                    {/* Card Content */}
                    <div className="space-y-0.5 mt-2.5">
                      <h4 className={`text-[11px] font-black tracking-tight leading-tight transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900 group-hover:text-slate-950'}`}>
                        {service.title}
                      </h4>
                      <p className={`text-[9px] leading-snug line-clamp-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
