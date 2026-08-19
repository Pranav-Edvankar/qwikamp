import { useState, useEffect, MouseEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowLeft, ShieldCheck, Wrench, Truck, Heart, ShoppingBag, Eye, Zap, Info, Check, Sparkles, Search, X, CreditCard } from 'lucide-react';
import { CYCLE_PRODUCTS } from '../data';
import { CycleProduct } from '../types';

interface ShopViewProps {
  initialProductId?: string;
  onNavigate: (tab: 'Home' | 'Cycle Shop' | 'Repair' | 'Bookings' | 'Profile' | 'CART', params?: any) => void;
  onPurchaseCycle: (cycleName: string) => void;
  addOrderToActiveSchedules?: (order: any) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const CATEGORIES = [
  'All Bikes',
  'Flagship',
  'All-Terrain',
  'Urban Commuter',
  'Batteries & Motors',
  'Components'
];

export default function ShopView({ initialProductId, onNavigate, onPurchaseCycle, addOrderToActiveSchedules, isDarkMode = false, onToggleDarkMode }: ShopViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<CycleProduct | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M');
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'success'>('review');
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Bikes');

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll coordinates programmatically on mount or view state change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    document.body.style.overflow = '';
  }, [selectedProduct]);

  // Load initial product if directed via deep-link
  useEffect(() => {
    if (initialProductId) {
      const prod = CYCLE_PRODUCTS.find(p => p.id === initialProductId);
      if (prod) {
        setSelectedProduct(prod);
        setSelectedColor(prod.colors[0]);
      }
    }
  }, [initialProductId]);

  const toggleFavorite = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleProductSelect = (product: CycleProduct) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]);
    setSelectedSize('M');
  };

  const handleCheckoutSubmit = () => {
    setCheckoutStep('success');
    if (selectedProduct) {
      const colorName = selectedColor === '#CAEF00' ? 'Electric Lime' : selectedColor === '#1E293B' ? 'Slate Black' : 'Classic Silver';
      const order = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceId: 'shop',
        type: 'SHOP',
        serviceName: `Purchase: ${selectedProduct.name} • ${selectedSize}`,
        cycleModel: `${selectedProduct.name} • ${colorName}`,
        date: '29 Jul 2026',
        timeSlot: 'Express Doorstep Delivery',
        location: 'San Francisco Hub',
        price: Math.round(selectedProduct.price * 1.0875),
        maintenanceId: '74928',
        partnerName: 'QWIK Logistics Hub',
        partnerPhone: '+1 (555) 019-2834',
      };
      setCreatedOrder(order);
    }
  };

  const closeCheckout = () => {
    if (checkoutStep === 'success' && createdOrder && addOrderToActiveSchedules) {
      addOrderToActiveSchedules(createdOrder);
    }
    setShowCheckoutDrawer(false);
    setSelectedProduct(null);
    setCheckoutStep('review');
    setCreatedOrder(null);
  };

  // Auto-redirect timer for order confirmation success sheet
  useEffect(() => {
    if (showCheckoutDrawer && checkoutStep === 'success' && createdOrder) {
      const timer = setTimeout(() => {
        if (addOrderToActiveSchedules) {
          addOrderToActiveSchedules(createdOrder);
        }
        setShowCheckoutDrawer(false);
        setSelectedProduct(null);
        setCheckoutStep('review');
        setCreatedOrder(null);
        onNavigate('Bookings', { cartSegment: 'SHOP', segment: 'SHOP' });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showCheckoutDrawer, checkoutStep, createdOrder, addOrderToActiveSchedules, onNavigate]);

  return (
    <div 
      ref={containerRef}
      className={`flex-1 flex flex-col h-full overflow-y-auto pb-10 subpixel-antialiased relative transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}
    >
      <AnimatePresence mode="wait">
        {!selectedProduct ? (
          /* --- PRODUCT CATALOG LIST VIEW --- */
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex-1 flex flex-col px-5 pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-4 space-y-4 transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-1 select-none">
              <div>
                <h2 className={`text-xl font-black tracking-tight transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>QWIK-RETAIL</h2>
                <p className={`text-xs transition-colors duration-250 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>Discover premium high-torque EV cycles and components</p>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-2xs transition-all ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 text-[#F8FAFC]' : 'bg-white border-slate-200/50 text-slate-600'}`}>
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Interactive Search Bar Component */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search EV cycles, parts, accessories..."
                className={`w-full pl-12 pr-4 py-3.5 text-sm rounded-full border shadow-xs focus:outline-none focus:ring-2 focus:ring-[#CAEF00] focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-[#161D2A] text-[#F8FAFC] placeholder-slate-500 border-slate-800/60' 
                    : 'bg-white text-slate-800 placeholder-slate-400 border-slate-200/50'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-4 inset-y-0 hover:underline text-xs font-semibold ${
                    isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-[#CAEF00] hover:text-[#b0d000]'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Horizontally Scrollable Category Filter Rail */}
            <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar mb-6 select-none">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#0B0F17] text-white font-extrabold text-xs uppercase tracking-wider border border-slate-900 shadow-sm'
                        : isDarkMode
                          ? 'bg-[#161D2A] hover:bg-slate-800 text-slate-400 font-bold text-xs border border-slate-800/80'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Product List with Fallback logic */}
            {(() => {
              const filteredProducts = CYCLE_PRODUCTS.filter((product) => {
                // Category filtering
                if (selectedCategory !== 'All Bikes') {
                  const categoryLower = selectedCategory.toLowerCase();
                  if (categoryLower === 'flagship') {
                    if (product.category !== 'FLAGSHIP BIKE') return false;
                  } else if (categoryLower === 'all-terrain') {
                    if (product.category !== 'ALL-TERRAIN EV') return false;
                  } else if (categoryLower === 'urban commuter') {
                    if (product.category !== 'URBAN COMMUTER') return false;
                  } else if (categoryLower === 'batteries & motors') {
                    if (product.category !== 'ECOSYSTEM UPGRADE') return false;
                  } else if (categoryLower === 'components') {
                    if (product.category !== 'ESSENTIAL SPARES') return false;
                  }
                }

                // Real-time search string filter
                if (searchQuery.trim() !== '') {
                  const query = searchQuery.toLowerCase().trim();
                  const nameMatch = product.name.toLowerCase().includes(query);
                  const categoryMatch = product.category.toLowerCase().includes(query);
                  const descMatch = product.description.toLowerCase().includes(query);
                  return nameMatch || categoryMatch || descMatch;
                }

                return true;
              });

              if (filteredProducts.length === 0) {
                return (
                  <div className={`rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 border ${
                    isDarkMode ? 'bg-[#161D2A] border-slate-800/60 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
                      <Search className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-1">
                      <h3 className={`text-sm font-black transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        No products found matching '{searchQuery}'
                      </h3>
                      <p className={`text-xs px-4 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Try using other words or select a different category filter chip above.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Bikes');
                      }}
                      className="px-4 py-2 bg-[#CAEF00] text-[#0B0F17] text-xs font-black rounded-xl hover:bg-[#b0d000] transition-colors uppercase tracking-wider shadow-xs cursor-pointer"
                    >
                      CLEAR FILTERS
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`rounded-2xl p-5 border flex flex-col space-y-3 cursor-pointer group hover:shadow-md transition-all duration-350 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 shadow-2xl hover:border-slate-700' : 'bg-slate-50/80 border-slate-100/50 shadow-sm hover:bg-slate-50'}`}
                    >
                      {/* Photo area */}
                      <div className={`w-full h-48 rounded-xl overflow-hidden relative transition-colors duration-250 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                        {product.tag && (
                          <span className="absolute top-4 left-4 z-10 bg-[#CAEF00] rounded-full px-3 py-1 text-[#0B0F17] font-black text-[10px] tracking-wider uppercase shadow-2xs">
                            {product.tag}
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border shadow-xs hover:scale-110 active:scale-95 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-rose-400' : 'bg-white border-slate-200/40 text-slate-400 hover:text-rose-500'}`}
                        >
                          <Heart className={`w-4 h-4 ${favoriteIds.includes(product.id) ? 'fill-rose-500 text-rose-500 border-transparent' : ''}`} />
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full h-full ${product.isPart ? 'object-contain p-4' : 'object-cover'} transform group-hover:scale-105 transition-transform duration-500`}
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{product.category}</span>
                          <h3 className={`text-sm font-black tracking-tight leading-tight transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900 group-hover:text-black'}`}>{product.name}</h3>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                            <span className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                              {product.rating}
                            </span>
                            <span className={isDarkMode ? 'text-slate-700' : 'text-slate-200'}>•</span>
                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>{product.reviewsCount} Reviews</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs line-through block ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>₹{(product.price * 1.1).toFixed(0)}</span>
                          <span className={`text-sm font-black transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>₹{product.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Summary tech features */}
                      {(() => {
                        const specCardClass = isDarkMode 
                          ? "bg-[#1E293B]/40 border border-slate-700/80" 
                          : "bg-slate-50 border border-slate-200/80";

                        const specLabelClass = isDarkMode 
                          ? "text-slate-400" 
                          : "text-slate-500";

                        const specValueClass = isDarkMode 
                          ? "text-slate-200" 
                          : "text-slate-850";

                        return (
                          <div className={`grid grid-cols-3 gap-2 pt-2 border-t select-none ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/50'}`}>
                            <div className={`${specCardClass} rounded-xl py-2 flex flex-col items-center justify-center`}>
                              <p className={`${specLabelClass} font-bold text-[10px] tracking-wider uppercase`}>Range</p>
                              <p className={`${specValueClass} font-semibold text-xs mt-0.5`}>{product.specs.range}</p>
                            </div>
                            <div className={`${specCardClass} rounded-xl py-2 flex flex-col items-center justify-center`}>
                              <p className={`${specLabelClass} font-bold text-[10px] tracking-wider uppercase`}>Speed</p>
                              <p className={`${specValueClass} font-semibold text-xs mt-0.5`}>{product.specs.speed}</p>
                            </div>
                            <div className={`${specCardClass} rounded-xl py-2 flex flex-col items-center justify-center`}>
                              <p className={`${specLabelClass} font-bold text-[10px] tracking-wider uppercase`}>Weight</p>
                              <p className={`${specValueClass} font-semibold text-xs mt-0.5`}>{product.specs.weight}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              );
            })()}
          </motion.div>
        ) : (
          /* --- DETAILED PRODUCT SPECIFICATIONS VIEW --- */
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`flex-1 flex flex-col transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-white'}`}
          >
            {/* Header / Back Action */}
            <div className={`relative z-10 px-5 pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-4 flex items-center justify-between border-b select-none transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17] border-slate-800/80' : 'bg-white border-slate-100'}`}>
              <button
                onClick={() => setSelectedProduct(null)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-750' : 'bg-slate-50 border-slate-200/40 text-slate-600 hover:bg-slate-100'}`}
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Product Specifications</span>
              <button
                onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 hover:text-rose-400' : 'bg-slate-50 border-slate-200/40 text-slate-400 hover:text-rose-500'}`}
              >
                <Heart className={`w-4 h-4 ${favoriteIds.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500 border-transparent' : ''}`} />
              </button>
            </div>

            <div className="p-5 pb-28 sm:pb-32 space-y-5">
              {/* Image Preview */}
              <div className={`h-56 rounded-3xl flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-250 ${isDarkMode ? 'bg-[#161D2A] border border-slate-800/60' : 'bg-slate-50/70'}`}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="max-h-48 object-contain mix-blend-normal"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute bottom-3 right-3 backdrop-blur-xs text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-slate-900/90 text-slate-200' : 'bg-white/80 text-slate-600'}`}>
                  <Sparkles className="w-3 h-3 text-[#CAEF00] fill-[#CAEF00] mr-1" />
                  Studio View
                </div>
              </div>

              {/* Title, rating, description */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{selectedProduct.category}</span>
                    <h1 className={`text-xl font-black tracking-tight transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>{selectedProduct.name}</h1>
                  </div>
                  <span className={`text-lg font-black transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-0.5" />
                    {selectedProduct.rating}
                  </span>
                  <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>({selectedProduct.reviewsCount} verified reviews)</span>
                </div>

                <p className={`text-xs leading-relaxed pt-1 transition-colors duration-250 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  Flagship urban EV built with an aerospace-grade carbon fiber frame, integrated battery, and silent belt drive for effortless city commuting.
                </p>
              </div>

              {/* Dynamic specs details sheet */}
              <div className={`rounded-2xl p-4 border space-y-3.5 transition-colors duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60' : 'bg-slate-50 border-slate-100'}`}>
                <h3 className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1" /> Full EV Specs
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Intelligent Battery</p>
                    <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedProduct.specs.battery}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Power Range</p>
                    <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedProduct.specs.range} Assisted</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Aerospace Frame</p>
                    <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedProduct.specs.frame}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Top Speed</p>
                    <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedProduct.specs.speed} Throttle</p>
                  </div>
                </div>
              </div>

              {/* Customizers: Color & Frame Size */}
              <div className="grid grid-cols-2 gap-4">
                {/* Colors */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Select Color</span>
                  <div className="flex items-center space-x-2.5 pt-0.5">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color ? (isDarkMode ? 'border-[#CAEF00] scale-110 shadow-xs' : 'border-slate-800 scale-110 shadow-xs') : (isDarkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Frame color option ${color}`}
                      >
                        {selectedColor === color && (
                          <Check className={`w-3.5 h-3.5 ${color === '#CAEF00' || color === '#E2E8F0' ? 'text-black font-extrabold' : 'text-white font-extrabold'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Frame Size</span>
                  <div className="flex items-center space-x-1.5 pt-0.5">
                    {(['S', 'M', 'L'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border flex items-center justify-center ${
                          selectedSize === size
                            ? 'bg-[#CAEF00] border-[#CAEF00] text-[#0B0F17] font-black'
                            : (isDarkMode ? 'bg-[#161D2A] border-slate-800/60 text-[#94A3B8] hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300')
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warranty protection note */}
              <div className={`rounded-2xl p-3 border flex items-start space-x-2.5 transition-colors duration-250 ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50 border-emerald-100'}`}>
                <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                <div className={`text-[10px] space-y-0.5 leading-snug ${isDarkMode ? 'text-emerald-300' : 'text-emerald-750'}`}>
                  <p className="font-extrabold">QWIKAMP Certified Warranty</p>
                  <p>Includes a complimentary 2-year electronics warranty and lifetime free basic adjustments at our San Francisco Hub.</p>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setCheckoutStep('review');
                  setShowCheckoutDrawer(true);
                }}
                className="w-full py-4 bg-[#CAEF00] text-[#0B0F17] font-black tracking-wider rounded-2xl hover:bg-[#b0d000] shadow-[0_8px_25px_rgba(202,239,0,0.35)] transition-all flex items-center justify-center space-x-2 select-none uppercase text-xs cursor-pointer"
                id="initiate-checkout-btn"
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Secure Checkout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CHECKOUT DRAWER OVERLAY --- */}
      <AnimatePresence>
        {showCheckoutDrawer && selectedProduct && (
          <div className="fixed inset-0 bg-slate-950/60 z-[100] flex flex-col justify-end">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={closeCheckout} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative z-10 max-h-[85vh] flex flex-col rounded-t-[32px] overflow-hidden border-t shadow-2xl transition-colors duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 text-[#F8FAFC]' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              {checkoutStep === 'review' ? (
                /* --- STEP 1: REVIEW AND PAY --- */
                <>
                  {/* Fixed Header (Non-scrolling) */}
                  <div className={`flex-none p-5 pb-3 border-b bg-inherit ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    {/* Top drag indicator */}
                    <div className={`w-12 h-1 rounded-full mx-auto mb-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    
                    <div className="flex items-center justify-between pb-1">
                      <h3 className={`text-lg font-black tracking-tight uppercase ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        PURCHASE SUMMARY
                      </h3>
                      <button 
                        onClick={closeCheckout} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          isDarkMode ? 'bg-slate-800/80 text-slate-400 hover:text-slate-100' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Body Container */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain">
                    {/* Primary Breakdown Card Architecture */}
                    <div className={`rounded-2xl p-4 space-y-4 border transition-colors duration-200 ${
                      isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-slate-50 border-[#CAD5E2]'
                    }`}>
                      {/* Section 1: Item Details Header */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                          SELECTED VEHICLE
                        </span>
                        <p className={`text-sm font-extrabold uppercase ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {selectedProduct.name} ({selectedColor === '#CAEF00' ? 'ELECTRIC LIME' : selectedColor === '#1E293B' ? 'SLATE BLACK' : 'CLASSIC SILVER'} - SIZE {selectedSize})
                        </p>
                      </div>

                      {/* Section 2: Cost Breakdown List */}
                      <div className={`border-t pt-3.5 space-y-2.5 ${isDarkMode ? 'border-slate-800' : 'border-[#CAD5E2]'}`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Base Price</span>
                          <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Professional Assembly</span>
                          <span className="text-emerald-500 font-extrabold text-xs uppercase">FREE (₹12,000 VALUE)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Local Sales Tax (8.75%)</span>
                          <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>₹{(selectedProduct.price * 0.0875).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Shipping / Doorstep</span>
                          <span className="text-emerald-500 font-extrabold text-xs uppercase">FREE DOORSTEP</span>
                        </div>
                      </div>

                      {/* Section 3: Total Cost Highlight Row */}
                      <div className={`border-t pt-3 mt-3 flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-[#CAD5E2]'}`}>
                        <span className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-[#CAEF00]' : 'text-slate-900'}`}>
                          TOTAL AMOUNT
                        </span>
                        <span className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          ₹{(selectedProduct.price * 1.0875).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Card: Payment Method Selection */}
                    <div className={`rounded-2xl p-4 border transition-colors duration-200 ${
                      isDarkMode ? 'bg-[#161D2A] border-slate-800' : 'bg-slate-50 border-[#CAD5E2]'
                    }`}>
                      <div className={`text-xs font-extrabold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        <CreditCard className="w-4 h-4 text-[#CAEF00]" />
                        <span>PAYMENT METHOD</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-mono text-sm font-bold tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            •••• •••• •••• 9804
                          </p>
                          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                            PRANAV CANVA • Exp: 08/29
                          </p>
                        </div>
                        <span className={`font-black text-xs italic ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                          VISA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Sticky Footer CTA */}
                  <div className={`flex-none p-5 pt-3 border-t bg-inherit pb-8 sm:pb-5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <button
                      onClick={handleCheckoutSubmit}
                      className="w-full py-4 rounded-xl bg-[#CAEF00] text-[#0B0F17] font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity cursor-pointer"
                      id="submit-payment-btn"
                    >
                      <span>AUTHORIZE & PAY ₹{(selectedProduct.price * 1.0875).toFixed(0)}</span>
                    </button>
                  </div>
                </>
              ) : (
                /* --- STEP 2: PURCHASE SUCCESS --- */
                <div className="relative p-6 pt-8 text-center flex flex-col items-center">
                  {/* Top Electric Lime progress line bar */}
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: 'linear' }}
                    className="h-1 bg-[#CAEF00] absolute top-0 left-0 rounded-t-3xl z-20"
                  />

                  {/* Top drag indicator */}
                  <div className={`w-12 h-1 rounded-full mx-auto mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

                  {/* Hero Checkmark Badge */}
                  <div className="h-14 w-14 bg-[#CAEF00] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#CAEF00]/20">
                    <Check className="w-7 h-7 text-[#0B0F17] stroke-[3]" />
                  </div>

                  {/* Headline */}
                  <h3 className={`text-xl font-black text-center tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Order Placed Successfully!
                  </h3>

                  {/* ID Pill */}
                  <span className={`inline-block font-bold text-[11px] px-3 py-1 rounded-full text-center mx-auto my-2 tracking-wider uppercase ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    ORDER #QA-74928
                  </span>

                  {/* Status Breakdown Container Card */}
                  <div className={`w-full rounded-2xl p-4 my-3 space-y-2.5 border text-left ${
                    isDarkMode ? 'bg-[#0B0F17] border-slate-800/80' : 'bg-slate-50 border-[#CAD5E2]'
                  }`}>
                    <div className={`text-xs font-semibold flex items-center gap-2.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <ShieldCheck className="w-4 h-4 text-[#CAEF00] shrink-0" />
                      <span>Registered to your profile garage</span>
                    </div>
                    <div className={`text-xs font-semibold flex items-center gap-2.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Wrench className="w-4 h-4 text-[#CAEF00] shrink-0" />
                      <span>Firmware flashing & hydraulic testing started</span>
                    </div>
                    <div className={`text-xs font-semibold flex items-center gap-2.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Truck className="w-4 h-4 text-[#CAEF00] shrink-0" />
                      <span>Track live doorstep delivery status</span>
                    </div>
                  </div>

                  {/* Micro-copy redirect visual */}
                  <p className="text-xs font-semibold text-slate-400 text-center mt-4">
                    Redirecting to your Cart Schedules in 2s...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
