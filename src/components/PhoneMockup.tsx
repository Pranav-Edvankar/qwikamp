import { ReactNode, useState, useEffect } from 'react';
import { ExternalLink, Maximize2, X, Smartphone, Figma, Loader2, Check, AlertCircle } from 'lucide-react';
import { captureAndCopyToFigma } from '../utils/figmaCopy';

interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  badge: string;
}

const PRESETS: Preset[] = [
  { id: 'SE', name: 'iPhone SE (Compact)', width: 320, height: 568, badge: 'Compact' },
  { id: '15Pro', name: 'iPhone 15 Pro (Standard)', width: 390, height: 844, badge: 'Standard' },
  { id: 'Pixel', name: 'Pixel 8 Pro (Tall)', width: 412, height: 892, badge: 'Tall' },
  { id: '15Max', name: 'iPhone 15 Pro Max', width: 430, height: 932, badge: 'Large' },
];

interface PhoneMockupProps {
  children: ReactNode;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function PhoneMockup({ children, isDarkMode = false, onToggleDarkMode }: PhoneMockupProps) {
  const [presetId, setPresetId] = useState('15Pro');
  const currentPreset = PRESETS.find(p => p.id === presetId) || PRESETS[1];
  const { width, height } = currentPreset;

  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWrapper, setShowWrapper] = useState(true);

  // Figma layout copy integration states and handler
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyToFigma = async () => {
    setCopyStatus('copying');
    try {
      await captureAndCopyToFigma('#phone-internal-screen');
      setCopyStatus('success');
      setTimeout(() => {
        setCopyStatus('idle');
      }, 3000);
    } catch (err: any) {
      console.error("Figma copy handler error:", err);
      setErrorMessage(err.message || 'Unknown error');
      setCopyStatus('error');
      setTimeout(() => {
        setCopyStatus('idle');
      }, 4000);
    }
  };

  const renderToast = () => {
    if (copyStatus === 'idle') return null;
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-fade-in">
        <div className={`px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
          copyStatus === 'copying'
            ? 'bg-slate-900/90 border-slate-800 text-slate-200'
            : copyStatus === 'success'
            ? 'bg-[#0ACF83]/10 border-[#0ACF83]/30 text-emerald-200'
            : 'bg-rose-950/20 border-rose-900/40 text-rose-200'
        }`}>
          {copyStatus === 'copying' && (
            <Loader2 className="w-4 h-4 animate-spin text-[#A259FF]" />
          )}
          {copyStatus === 'success' && (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          )}
          {copyStatus === 'error' && (
            <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold tracking-tight">
              {copyStatus === 'copying' && 'Extracting layout styles...'}
              {copyStatus === 'success' && 'Copied to Clipboard!'}
              {copyStatus === 'error' && 'Copy Failed'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {copyStatus === 'copying' && 'Normalizing viewport typography'}
              {copyStatus === 'success' && 'Paste (Ctrl+V) directly into Figma'}
              {copyStatus === 'error' && errorMessage}
            </span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      // Treat screens narrower than 1024px (tablets and mobile phones) or mobile User Agents as native full screen
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const mobileMode = window.innerWidth < 1024 || isMobileUA;
      setIsMobile(mobileMode);

      // Calculate scaled dimensions to fit the actual viewport height & width with safety margins
      const availableHeight = window.innerHeight - 240; // title, preset selectors and padding
      const availableWidth = window.innerWidth - 40;
      const scaleY = availableHeight / height;
      const scaleX = availableWidth / width;
      const newScale = Math.max(0.35, Math.min(1, scaleY, scaleX));
      setScale(newScale);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [presetId, width, height]);

  const handleLaunchFullScreen = () => {
    window.open(window.location.href, '_blank');
  };

  const handleToggleBrowserFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Native mobile full-screen view (no outer background, notch mockup, or system bars)
  if (isMobile) {
    const isIframe = window.self !== window.top;
    return (
      <div style={{ height: '100dvh' }} className={`fixed inset-0 w-screen h-[100dvh] overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}>
        {isIframe && showWrapper && !isFullscreen && (
          <div className="bg-[#0F172A] text-white text-[10px] font-bold tracking-tight px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md shrink-0 z-50 select-none">
            <span className="flex items-center space-x-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CAEF00] animate-pulse shrink-0" />
              <span className="truncate text-slate-300 font-extrabold uppercase tracking-wide">AI Studio Wrapper Active</span>
            </span>
            <div className="flex items-center space-x-2 shrink-0">
              {onToggleDarkMode && (
                <button
                  onClick={onToggleDarkMode}
                  className="bg-slate-800 hover:bg-slate-700 text-[#CAEF00] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer text-[9.5px] uppercase tracking-wider font-extrabold mr-1"
                >
                  Theme: {isDarkMode ? '🌙' : '☀️'}
                </button>
              )}
              <button
                onClick={handleCopyToFigma}
                disabled={copyStatus === 'copying'}
                className={`bg-slate-800 hover:bg-slate-700 text-slate-100 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer text-[9.5px] flex items-center space-x-1.5 uppercase tracking-wider font-extrabold relative overflow-hidden group ${
                  copyStatus === 'copying' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Copy mobile design to Figma clipboard"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#F24E1E]/10 via-[#A259FF]/10 to-[#0ACF83]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                {copyStatus === 'copying' ? (
                  <Loader2 className="w-3 h-3 animate-spin text-[#A259FF]" />
                ) : (
                  <Figma className="w-3 h-3 text-[#F24E1E]" />
                )}
                <span>{copyStatus === 'copying' ? 'Copying...' : 'Figma'}</span>
              </button>
              <button
                onClick={handleToggleBrowserFullScreen}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-md active:scale-95 transition-all cursor-pointer"
                title="Browser Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleLaunchFullScreen}
                className="bg-[#CAEF00] text-[#0F172A] font-black px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer text-[9.5px] flex items-center space-x-1 uppercase tracking-wider shadow-sm"
              >
                <span>Full Screen</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setShowWrapper(false)}
                className="bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-200 p-1.5 rounded-md active:scale-95 transition-all cursor-pointer font-bold ml-1"
                title="Hide Header"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {renderToast()}
          {children}

          {/* Unobtrusive floating restore button if they manually closed the wrapper */}
          {isIframe && !showWrapper && !isFullscreen && (
            <button
              onClick={() => setShowWrapper(true)}
              className="absolute top-3 right-3 bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-white p-2 rounded-full z-50 cursor-pointer shadow-lg backdrop-blur-xs transition-all border border-slate-800/20 active:scale-95 flex items-center justify-center"
              title="Show Controls"
            >
              <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const isIframe = window.self !== window.top;

  return (
    <div style={{ height: '100dvh' }} className="w-screen h-[100dvh] flex flex-col items-center justify-center py-6 px-4 bg-slate-950 select-none overflow-hidden relative">
      {/* Floating breakout panel for desktop when embedded in AI Studio */}
      {isIframe && (
        <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800/80 p-3 rounded-2xl max-w-xs shadow-2xl z-50 hidden md:flex flex-col space-y-2 select-none">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#CAEF00] animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standalone Test Mode</span>
          </div>
          <p className="text-[10.5px] text-slate-300 leading-relaxed font-medium">
            Open the app in a standalone window to completely remove Google AI Studio's surrounding UI.
          </p>
          <button
            onClick={handleLaunchFullScreen}
            className="w-full py-2 bg-[#CAEF00] text-[#0F172A] font-black tracking-wider rounded-xl hover:bg-[#b0d000] active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 uppercase text-[10px] cursor-pointer shadow-md"
          >
            <span>Launch Standalone App</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* App title outside of the phone mockup */}
      <div className="text-center mb-3 shrink-0">
        <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
          QWIK<span className="text-[#CAEF00]">AMP</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xs sm:max-w-md mx-auto">
          High-fidelity mobile application preview. Live EV cycle repair scheduling, retail & status tracking.
        </p>
      </div>

      {/* Interactive Simulated Device Size Presets Selector */}
      <div className="flex items-center space-x-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 shadow-lg mb-4 select-none max-w-full shrink-0 overflow-x-auto">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setPresetId(preset.id)}
            className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wide uppercase transition-all flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
              presetId === preset.id
                ? 'bg-[#CAEF00] text-slate-950 font-black shadow-md scale-102 animate-fade-in'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Smartphone className="w-3 h-3 stroke-[2.5]" />
            <span>{preset.name}</span>
          </button>
        ))}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wide uppercase transition-all bg-slate-800 text-[#CAEF00] border border-slate-700/60 hover:bg-slate-700/60 flex items-center space-x-1 cursor-pointer whitespace-nowrap"
          >
            <span>Theme: {isDarkMode ? '🌙 DARK' : '☀️ LIGHT'}</span>
          </button>
        )}
        <button
          onClick={handleCopyToFigma}
          disabled={copyStatus === 'copying'}
          className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wide uppercase transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-md relative overflow-hidden group ${
            copyStatus === 'copying'
              ? 'bg-slate-800/45 text-slate-500 border border-slate-800 cursor-not-allowed'
              : 'bg-slate-900 text-slate-100 border border-slate-800 hover:border-slate-700 hover:text-white active:scale-95'
          }`}
          title="Copy design mock layout directly to Figma"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#F24E1E]/10 via-[#A259FF]/10 to-[#0ACF83]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {copyStatus === 'copying' ? (
            <Loader2 className="w-3 h-3 animate-spin text-[#A259FF]" />
          ) : (
            <Figma className="w-3 h-3 text-[#F24E1E] group-hover:scale-110 transition-transform duration-200" />
          )}
          <span>{copyStatus === 'copying' ? 'Copying...' : 'Copy to Figma'}</span>
        </button>
      </div>

      {/* Scaled Smartphone Wrapper */}
      <div 
        style={{ width: width * scale, height: height * scale }} 
        className="relative transition-all duration-300 ease-out flex items-center justify-center shrink-0"
      >
        {/* Realistic Smartphone Container */}
        <div 
          style={{ 
            width: width, 
            height: height, 
            transform: `scale(${scale})`, 
            transformOrigin: 'center center' 
          }}
          className="absolute bg-black rounded-[56px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] p-3 border-4 border-slate-800 ring-1 ring-white/10 overflow-hidden flex flex-col justify-between"
        >
          {/* Outer glossy highlights */}
          <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[42px] z-50" />
          
          {/* Dynamic Island Camera Cutout */}
          <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-3.5 border border-white/5 shadow-inner">
            {/* Lens dot reflection */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-900/60 shadow-lg blur-[0.2px]" />
            </div>
            {/* Proximity / Sensor bar */}
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 blur-[0.5px]" />
          </div>
 
          {/* The Internal App Container */}
          {/* We apply translate3d and isolation-isolate to prevent WebKit overflow clipping bugs with rounded corners */}
          <div 
            id="phone-internal-screen"
            data-figma-id="active-screen"
            style={{ transform: 'translate3d(0, 0, 0)' }}
            className={`relative w-full h-full rounded-[44px] overflow-hidden flex flex-col shadow-inner select-text isolation-isolate transition-colors duration-200 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}
          >
            
            {/* iOS System Status Bar */}
            <div className={`w-full h-11 pt-3.5 px-6 flex items-center justify-between text-xs font-semibold z-40 select-none pointer-events-none shrink-0 transition-colors duration-200 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {/* Clock */}
              <span className="tracking-tight">10:53 AM</span>
              
              {/* Status Icons (Right side) */}
              <div className="flex items-center space-x-1.5">
                {/* Cellular Signal Bars */}
                <div className="flex items-end space-x-0.5 h-3">
                  <div className={`w-0.5 h-1 rounded-2xs ${isDarkMode ? 'bg-slate-100' : 'bg-slate-900'}`} />
                  <div className={`w-0.5 h-1.5 rounded-2xs ${isDarkMode ? 'bg-slate-100' : 'bg-slate-900'}`} />
                  <div className={`w-0.5 h-2 rounded-2xs ${isDarkMode ? 'bg-slate-100' : 'bg-slate-900'}`} />
                  <div className={`w-0.5 h-2.5 rounded-2xs ${isDarkMode ? 'bg-slate-100' : 'bg-slate-900'}`} />
                </div>
                
                {/* WiFi Icon */}
                <svg className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`} fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164a.52.52 0 0 0 .668-.049z"/>
                  <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.577 1.336.525.525 0 0 0 .652-.065zm-2.183 2.183c.226-.207.22-.569-.026-.782A6.473 6.473 0 0 0 8 8c-1.293 0-2.482.381-3.48 1.03a.534.534 0 0 0-.026.781c.222.203.57.19.782-.028A5.474 5.474 0 0 1 8 9c1.078 0 2.072.311 2.905.847a.534.534 0 0 0 .783-.028zm-1.801 1.8c.245-.226.242-.647-.016-.874A3.982 3.982 0 0 0 8 10c-.783 0-1.498.225-2.102.613a.56.56 0 0 0-.016.874.56.56 0 0 0 .79-.015A2.986 2.986 0 0 1 8 11c.491 0 .942.119 1.338.33a.558.558 0 0 0 .79-.016z"/>
                </svg>

                {/* Battery */}
                <div className={`flex items-center space-x-0.5 border rounded-sm p-[1.5px] w-6 h-3 ${isDarkMode ? 'border-slate-100/40' : 'border-slate-900/40'}`}>
                  <div className={`h-full rounded-2xs ${isDarkMode ? 'bg-slate-100' : 'bg-slate-900'}`} style={{ width: '94%' }} />
                  <div className={`w-0.5 h-1 rounded-r-3xs -mr-[3px] ${isDarkMode ? 'bg-slate-100/70' : 'bg-slate-900/70'}`} />
                </div>
                <span className="text-[10px] -ml-0.5 scale-90 tracking-tight">94%</span>
              </div>
            </div>

            {/* Actual View Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {children}
            </div>

            {/* iOS Bottom Home Indicator Space (Blended with bottom navigation background style) */}
            <div className={`w-full h-6 flex justify-center items-center pb-2.5 z-40 select-none pointer-events-none shrink-0 border-t transition-colors duration-200 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/40' : 'bg-white border-slate-100/40'}`}>
              <div className={`w-32 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`} />
            </div>

          </div>
        </div>
      </div>
      {renderToast()}
    </div>
  );
}
