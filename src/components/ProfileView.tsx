import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ShieldCheck, Leaf, Zap, HelpCircle, History, Plus, AlertCircle, 
  Check, Award, ChevronRight, CreditCard, MapPin, FileText, Bell, 
  Lock, LogOut, Folder, Settings, Smartphone, ExternalLink, ArrowLeft, 
  Trash2, ShieldAlert, KeyRound, ShieldCheck as BiometricIcon, Pencil
} from 'lucide-react';
import { UserStats } from '../types';

interface ProfileViewProps {
  userStats: UserStats;
  ownedCycles: string[];
  onRegisterCycle: (cycleName: string) => void;
  onUpdateUserStats?: (stats: UserStats) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onLogout?: () => void;
}

export default function ProfileView({ 
  userStats, 
  ownedCycles, 
  onRegisterCycle, 
  onUpdateUserStats,
  isDarkMode = false,
  onToggleDarkMode,
  onLogout
}: ProfileViewProps) {
  // Modal state for registering a cycle
  const [showAddCycleModal, setShowAddCycleModal] = useState(false);
  const [newCycleName, setNewCycleName] = useState('QWIK-GRAVEL ULTRALIGHT');
  const [activationCode, setActivationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sub-menu states
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Editable Profile state
  const [editName, setEditName] = useState(userStats.name);
  const [editEmail, setEditEmail] = useState(userStats.email);
  const [editPhone, setEditPhone] = useState('+1 (555) 839-2001');
  const [editAvatar, setEditAvatar] = useState(userStats.avatar);
  const [selectedAvatarFrame, setSelectedAvatarFrame] = useState<'none' | 'glow' | 'matrix' | 'neon'>('none');

  // Address List state
  interface AddressItem {
    id: string;
    tag: 'HOME' | 'WORK' | 'GARAGE' | 'OTHER';
    label: string;
    street: string;
    landmark: string;
    pincode: string;
    city: string;
    isDefault: boolean;
  }

  const [addressList, setAddressList] = useState<AddressItem[]>([
    {
      id: 'addr-1',
      tag: 'HOME',
      label: 'Home Base',
      street: '120 Mission St, SoMa',
      landmark: 'Near Yerba Buena Gardens',
      city: 'San Francisco, CA',
      pincode: '94103',
      isDefault: true,
    },
    {
      id: 'addr-2',
      tag: 'WORK',
      label: 'Workplace Station',
      street: 'Salesforce Tower, Mission St',
      landmark: '41st Floor, Suite 4100',
      city: 'San Francisco, CA',
      pincode: '94105',
      isDefault: false,
    },
    {
      id: 'addr-3',
      tag: 'GARAGE',
      label: 'Custom Partner Garage',
      street: 'Mission District Moto, 24th St',
      landmark: 'Bay 4 Maintenance Deck',
      city: 'San Francisco, CA',
      pincode: '94110',
      isDefault: false,
    }
  ]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<{
    tag: 'HOME' | 'WORK' | 'GARAGE' | 'OTHER';
    street: string;
    landmark: string;
    city: string;
    pincode: string;
  }>({
    tag: 'HOME',
    street: '',
    landmark: '',
    city: 'San Francisco, CA',
    pincode: '',
  });

  const handleSetDefaultAddress = (id: string) => {
    setAddressList(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    showFeedbackToast("Default pickup address updated!");
  };

  const handleDeleteAddress = (id: string) => {
    setAddressList(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    showFeedbackToast("Address removed.");
  };

  const handleOpenAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      tag: 'HOME',
      street: '',
      landmark: '',
      city: 'San Francisco, CA',
      pincode: '',
    });
    setShowAddressModal(true);
  };

  const handleOpenEditAddressModal = (addr: AddressItem) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      tag: addr.tag,
      street: addr.street,
      landmark: addr.landmark,
      city: addr.city,
      pincode: addr.pincode,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!addressForm.street.trim()) return;

    if (editingAddressId) {
      setAddressList(prev => prev.map(a => a.id === editingAddressId ? {
        ...a,
        tag: addressForm.tag,
        label: addressForm.tag === 'HOME' ? 'Home Base' : addressForm.tag === 'WORK' ? 'Workplace Station' : addressForm.tag === 'GARAGE' ? 'Partner Garage' : 'Other Location',
        street: addressForm.street,
        landmark: addressForm.landmark,
        city: addressForm.city,
        pincode: addressForm.pincode
      } : a));
      showFeedbackToast("Address details updated!");
    } else {
      const newAddr: AddressItem = {
        id: `addr-${Date.now()}`,
        tag: addressForm.tag,
        label: addressForm.tag === 'HOME' ? 'Home Base' : addressForm.tag === 'WORK' ? 'Workplace Station' : addressForm.tag === 'GARAGE' ? 'Partner Garage' : 'Other Location',
        street: addressForm.street,
        landmark: addressForm.landmark,
        city: addressForm.city,
        pincode: addressForm.pincode,
        isDefault: addressList.length === 0
      };
      setAddressList(prev => [...prev, newAddr]);
      showFeedbackToast("New service address saved!");
    }
    setShowAddressModal(false);
  };

  const handleSaveAccountAndAddresses = (e: FormEvent) => {
    e.preventDefault();
    if (onUpdateUserStats) {
      onUpdateUserStats({
        ...userStats,
        name: editName,
        email: editEmail,
        avatar: editAvatar
      });
    }
    showFeedbackToast("Account & address changes saved!");
    setActiveSubMenu(null);
  };

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 480 },
          height: { ideal: 480 }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => console.error("Video play error", err));
        }
      }, 50);
    } catch (err) {
      console.error("Camera access error:", err);
      showFeedbackToast("Failed to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        const size = Math.min(video.videoWidth, video.videoHeight) || 480;
        canvas.width = size;
        canvas.height = size;
        
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        
        context.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setEditAvatar(dataUrl);
        stopCamera();
        showFeedbackToast("Photo captured and set!");
      }
    }
  };

  // Saved Locations state
  const [locations, setLocations] = useState({
    home: '120 Mission St, SoMa, San Francisco, CA',
    work: 'Salesforce Tower, Mission St, San Francisco, CA',
    garage: 'Mission District Moto, 24th St, San Francisco, CA'
  });

  // Saved Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'pay-1', type: 'card', name: 'Visa ending in 4242', details: 'Exp: 12/28', isDefault: true },
    { id: 'pay-2', type: 'wallet', name: 'Apple Pay', details: 'Linked with Device', isDefault: false },
    { id: 'pay-3', type: 'upi', name: 'pranavcanva@upi', details: 'Verified UPI Node', isDefault: false }
  ]);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');

  // Document Vault files simulator
  const [vaultDocs, setVaultDocs] = useState([
    { id: 'doc-1', name: 'EV Cycle Registration Certificate.pdf', size: '1.4 MB', date: 'May 2026', type: 'PDF' },
    { id: 'doc-2', name: 'Allstate EV Comprehensive Policy.pdf', size: '2.8 MB', date: 'Jan 2026', type: 'PDF' }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Preference switches state
  const [notifications, setNotifications] = useState({
    batteryHealth: true,
    serviceIntervals: true,
    arrivalUpdates: true,
    marketingUpdates: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    biometrics: true,
    pinLock: false,
    securePayments: true
  });

  const [pinCode, setPinCode] = useState('4220');
  const [showPinEditor, setShowPinEditor] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Logged out / Destructive states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleRegisterCycle = (e: FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim() || activationCode.length < 6) {
      setErrorMsg('Please enter a valid 6-character activation code.');
      return;
    }
    setErrorMsg('');
    onRegisterCycle(newCycleName);
    setActivationCode('');
    setShowAddCycleModal(false);
    showFeedbackToast('EV Cycle registered and linked to garage!');
  };

  const showFeedbackToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 2500);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (onUpdateUserStats) {
      onUpdateUserStats({
        ...userStats,
        name: editName,
        email: editEmail,
        avatar: editAvatar
      });
    }
    showFeedbackToast('Profile changes saved successfully!');
    setActiveSubMenu(null);
  };

  const handleSaveLocations = (e: FormEvent) => {
    e.preventDefault();
    showFeedbackToast('Saved pickup locations updated!');
    setActiveSubMenu(null);
  };

  const handleAddPaymentMethod = (e: FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !newCardExpiry || !newCardCvv) return;
    const cleanNum = newCardNumber.replace(/\s?/g, '');
    const last4 = cleanNum.slice(-4) || '1111';
    const newMethod = {
      id: `pay-${Date.now()}`,
      type: 'card',
      name: `Visa ending in ${last4}`,
      details: `Exp: ${newCardExpiry}`,
      isDefault: false
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
    setShowAddCardForm(false);
    showFeedbackToast('New payment card added securely!');
  };

  const setPaymentAsDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(p => ({
        ...p,
        isDefault: p.id === id
      }))
    );
    showFeedbackToast('Default payment routing updated!');
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(p => p.id !== id));
    showFeedbackToast('Payment method removed.');
  };

  const handleSimulatedDocUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadProgress(10);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const newDoc = {
                id: `doc-${Date.now()}`,
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                date: 'Just Now',
                type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
              };
              setVaultDocs(prevDocs => [newDoc, ...prevDocs]);
              setIsUploading(false);
              showFeedbackToast('Document securely uploaded to Vehicle Vault!');
            }, 300);
            return 100;
          }
          return prev + 30;
        });
      }, 200);
    }
  };

  const handleRemoveDoc = (id: string) => {
    setVaultDocs(prev => prev.filter(d => d.id !== id));
    showFeedbackToast('Document removed from vault.');
  };

  const handleSavePin = (e: FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      setPinCode(newPin);
      setNewPin('');
      setShowPinEditor(false);
      showFeedbackToast('Secure transaction PIN updated!');
    }
  };

  const triggerLogout = () => {
    setHasLoggedOut(true);
    setShowLogoutConfirm(false);
    setTimeout(() => {
      // Restore initial state or refresh simulated user session
      setHasLoggedOut(false);
      if (onUpdateUserStats) {
        onUpdateUserStats({
          name: 'Pranav Canva',
          email: 'pranavcanva15@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          joinedDate: 'July 2025',
          cycleModel: 'QWIK-VOLT CARBON R',
          totalMiles: 1450,
          co2SavedKg: 385.2,
          batteryHealth: 92,
          serviceIntervalDays: 45
        });
      }
      if (onLogout) {
        onLogout();
      } else {
        showFeedbackToast('Session reset. You are logged back in as Pranav!');
      }
    }, 2000);
  };

  // Profile Frames Color Definition
  const getAvatarFrameStyles = () => {
    switch (selectedAvatarFrame) {
      case 'glow':
        return 'ring-4 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse';
      case 'matrix':
        return 'ring-4 ring-[#CAEF00] shadow-[0_0_15px_rgba(202,239,0,0.6)]';
      case 'neon':
        return 'ring-4 ring-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.6)]';
      default:
        return 'border-2 border-[#CAEF00]';
    }
  };

  return (
    <div className={`flex-grow flex flex-col h-full overflow-hidden relative transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}>
      
      {/* Dynamic Feedback Toast */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[calc(env(safe-area-inset-top,24px)+64px)] inset-x-8 z-50 bg-slate-900 text-[#CAEF00] px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider text-center shadow-2xl border border-slate-800 flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{feedbackMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Success Splash */}
      {hasLoggedOut && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center text-white select-none">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <LogOut className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Logging Out...</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Securely clearing local cache keys and closing session routing maps.
            </p>
            <div className="w-8 h-1 bg-[#CAEF00] mx-auto rounded-full animate-ping" />
          </motion.div>
        </div>
      )}

      {/* --- PROFILE LANDING CONTENT (Conditionally hidden to prevent leakage) --- */}
      <div className={`flex-1 flex flex-col h-full overflow-y-auto px-5 pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-6 space-y-4 ${activeSubMenu ? 'hidden' : ''}`}>
          {/* --- USER IDENTITY DISPLAY --- */}
          <div className={`flex items-center space-x-4 pb-2 border-b select-none ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200/50'}`}>
            <div className={`w-16 h-16 rounded-full overflow-hidden shadow-md bg-slate-200 transition-all ${getAvatarFrameStyles()}`}>
              <img src={userStats.avatar} alt={userStats.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h2 className={`text-lg font-black leading-none flex items-center space-x-1.5 transition-colors duration-250 ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                <span>{userStats.name}</span>
                {selectedAvatarFrame !== 'none' && (
                  <span className="text-[8px] bg-slate-900 text-[#CAEF00] px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest scale-90">Pro</span>
                )}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{userStats.email}</p>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[9px] text-slate-500">
                <span className={`px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-slate-900/60 border-slate-800/60 text-[#94A3B8]' : 'bg-slate-100 border border-slate-200/40 text-slate-500'}`}>Member since 2025</span>
              </div>
            </div>
          </div>

          {/* --- THE CONNECTED EV GARAGE --- */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between select-none">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">My Connected Garage</h3>
              <button
                onClick={() => setShowAddCycleModal(true)}
                className="text-[10px] font-black tracking-wider text-[#0F172A] bg-[#CAEF00] px-5 py-2.5 rounded-full flex items-center justify-center hover:bg-[#b0d000] active:scale-95 transition-all shadow-xs cursor-pointer uppercase shrink-0"
                id="add-cycle-btn"
              >
                <Plus className="w-3.5 h-3.5 mr-1 stroke-[3.5] text-[#0F172A]" /> Register EV
              </button>
            </div>

            <div className="space-y-3">
              {ownedCycles.map((cycleName) => (
                <div
                  key={cycleName}
                  className={`rounded-2xl p-5 border space-y-3 transition-all duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 shadow-2xl' : 'bg-white border-transparent shadow-sm'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                        <Zap className="w-4.5 h-4.5 text-[#CAEF00] fill-[#CAEF00]" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>{cycleName}</h4>
                        <p className="text-[9px] text-emerald-600 font-extrabold uppercase">ONLINE & LINKED</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      SERIAL: QA-{cycleName.substring(5, 9).toUpperCase()}
                    </span>
                  </div>

                  {/* Section Separator */}
                  <div className={`border-b my-4 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-100'}`} />

                  {/* Live Diagnostics Metrics */}
                  <div className="space-y-4 select-none">
                    {/* Metrics Layer A (Battery Health) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                        <span className={isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}>BATTERY CELL HEALTH</span>
                        <span className={`font-extrabold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-700'}`}>{userStats.batteryHealth}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${userStats.batteryHealth}%` }} />
                      </div>
                    </div>

                    {/* Metrics Layer B (Service Tracker) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                        <span className={isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}>ROUTINE SERVICE DUE</span>
                        <span className="text-amber-500 font-extrabold">{userStats.serviceIntervalDays} DAYS</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(userStats.serviceIntervalDays / 90) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- STRUCTURED CONFIGURATION BLOCKS (ACCOUNT & SETTINGS HUB) --- */}
          <div className="space-y-5 pt-1">
            
            {/* SECTION A: Account & Vehicles Section */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase pl-1">ACCOUNT & VEHICLES</h3>
              
              {/* Row: Account Details & Addresses */}
              <div 
                onClick={() => {
                  setEditAvatar(userStats.avatar);
                  setEditName(userStats.name);
                  setEditEmail(userStats.email);
                  setActiveSubMenu('account');
                }}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 space-x-0.5 ${isDarkMode ? 'bg-indigo-950/45 text-indigo-400' : 'bg-indigo-50 text-indigo-500'}`}>
                    <User className="w-3.5 h-3.5" />
                    <MapPin className="w-3.5 h-3.5 -ml-1 text-[#CAEF00]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Account Details & Addresses</span>
                    <span className="text-[9px] text-slate-400 font-medium">Personal info, phone number, and saved locations</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>

              {/* Row: My Saved Payment Methods */}
              <div 
                onClick={() => setActiveSubMenu('payment')}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-emerald-950/45 text-emerald-400' : 'bg-emerald-50 text-emerald-500'}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>My Saved Payment Methods</span>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>

              {/* Row: Insurance & Vehicle Vault */}
              <div 
                onClick={() => setActiveSubMenu('insurance')}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-sky-950/45 text-sky-400' : 'bg-sky-50 text-sky-500'}`}>
                    <Folder className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Insurance & Vehicle Vault</span>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>

              {/* Row: Service History Logs */}
              <div 
                onClick={() => setActiveSubMenu('history')}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-amber-950/45 text-amber-400' : 'bg-amber-50 text-amber-500'}`}>
                    <History className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Service History Logs</span>
                    <span className="text-[9px] text-slate-400">View past diagnostic & repairs logs</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>
            </div>

            {/* SECTION B: Preferences & Control Section */}
            <div className="space-y-2.5 pt-1">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase pl-1">PREFERENCES & CONTROL</h3>
              
              {/* Row: Notification Settings */}
              <div 
                onClick={() => setActiveSubMenu('notifications')}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-violet-950/45 text-violet-400' : 'bg-violet-50 text-violet-500'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Notification Settings</span>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>

              {/* Row: App Security */}
              <div 
                onClick={() => setActiveSubMenu('security')}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-teal-950/45 text-teal-400' : 'bg-teal-50 text-teal-500'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>App Security & PIN</span>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>
            </div>

            {/* SECTION C: Support & System Section */}
            <div className="space-y-2.5 pt-1">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase pl-1">SUPPORT & SYSTEM</h3>
              
              {/* Row: Help & Support Desk */}
              <div 
                onClick={() => setActiveSubMenu('support')}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-orange-950/45 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Help & Support Desk</span>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>

              {/* Row: Legal & Info */}
              <div 
                onClick={() => setActiveSubMenu('legal')}
                className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-xs ${isDarkMode ? 'bg-[#161D2A] border-slate-800/60 hover:bg-slate-800/55' : 'bg-white border-slate-200/80 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Legal & Privacy Info</span>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>
            </div>

            {/* --- DESTRUCTIVE ACCOUNT ACTIONS (LOG OUT) --- */}
            <div className="pt-4 pb-12 select-none">
              <button 
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className={`w-full border rounded-2xl py-4 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs group ${isDarkMode ? 'bg-rose-950/20 border-rose-900/40 text-rose-400 hover:bg-rose-950/30' : 'bg-rose-50 hover:bg-rose-100/70 border border-rose-200/80 text-rose-500'}`}
              >
                <LogOut className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                <span className={`font-black tracking-wider text-xs uppercase ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`}>Log Out Session</span>
              </button>
            </div>

          </div>
        </div>

      {/* --- SUB-MENUS OVERLAY SCREENS (SLIDE-IN) --- */}
      <AnimatePresence>
        {activeSubMenu && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`absolute inset-0 w-full h-full left-0 top-0 z-40 flex flex-col overflow-hidden transition-colors duration-250 ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9]'}`}
          >
            {/* Header Area */}
            <div className={`pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-3.5 shrink-0 z-10 select-none border-b transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/50'}`}>
              <div className="flex items-center justify-between px-4">
                <button 
                  type="button"
                  onClick={() => {
                    setActiveSubMenu(null);
                    setShowAddCardForm(false);
                    setShowPinEditor(false);
                    stopCamera();
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800 text-[#F8FAFC]' : 'hover:bg-slate-200 text-slate-800'}`}
                  aria-label="Go Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className={`text-xs font-black tracking-widest uppercase transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                  {activeSubMenu === 'account' && 'Account & Addresses'}
                  {activeSubMenu === 'profile' && 'Account & Addresses'}
                  {activeSubMenu === 'locations' && 'Account & Addresses'}
                  {activeSubMenu === 'payment' && 'Payment Methods'}
                  {activeSubMenu === 'insurance' && 'Vehicle Vault'}
                  {activeSubMenu === 'history' && 'Repair Logs'}
                  {activeSubMenu === 'notifications' && 'Notification Settings'}
                  {activeSubMenu === 'security' && 'App Security'}
                  {activeSubMenu === 'support' && 'Support & FAQs'}
                  {activeSubMenu === 'legal' && 'Legal & Info'}
                </h3>
                <div className="w-9" /> {/* Spacer */}
              </div>
            </div>

            {/* Scrollable Sub-Menu Content Area */}
            <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4">
              
              {/* SUBMENU: ACCOUNT & ADDRESSES (UNIFIED VIEW) */}
              {(activeSubMenu === 'account' || activeSubMenu === 'profile' || activeSubMenu === 'locations') && (
                <form onSubmit={handleSaveAccountAndAddresses} className="space-y-6 text-left pb-12">
                  
                  {/* SECTION A: PERSONAL INFORMATION BLOCK */}
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                          Personal Information
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">Your primary identity & contact handles</p>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/40' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>
                        Verified Identity
                      </span>
                    </div>

                    {/* Camera / Avatar Module */}
                    <div className={`flex flex-col items-center space-y-3 pb-3 border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                      <canvas ref={canvasRef} className="hidden" />
                      {isCameraActive ? (
                        <div className="flex flex-col items-center space-y-3 w-full max-w-[240px]">
                          <div className="relative w-40 h-40 bg-black rounded-full overflow-hidden shadow-inner border-4 border-indigo-500">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              muted
                              className="w-full h-full object-cover scale-x-[-1]"
                            />
                            <div className="absolute inset-2 border-2 border-dashed border-[#CAEF00]/60 rounded-full pointer-events-none" />
                          </div>
                          
                          <div className="flex space-x-2 w-full">
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="flex-1 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                            >
                              Capture Photo
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              className={`flex-1 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2.5">
                          <div className="relative">
                            <div className={`relative w-20 h-20 rounded-full overflow-hidden shadow-md bg-slate-200 transition-all ${getAvatarFrameStyles()}`}>
                              <img src={editAvatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <button
                              type="button"
                              onClick={startCamera}
                              className="absolute -bottom-1 -right-1 p-2 bg-slate-900 text-[#CAEF00] rounded-full border-2 border-white hover:scale-105 transition-all shadow-md cursor-pointer flex items-center justify-center"
                              title="Take secure photo"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.115-.744.074-1.08-.117A3.25 3.25 0 0 0 2 10.25v7A3.25 3.25 0 0 0 5.25 20.5h13.5A3.25 3.25 0 0 0 22 17.25v-7a3.25 3.25 0 0 0-2.106-3.137c-.336-.191-.7-.15-1.08-.117a2.31 2.31 0 0 1-1.641 1.055l-1.084.217a3.75 3.75 0 0 1-4.838-2.61L11.083 6.13a2.25 2.25 0 0 0-4.256.046Z" />
                                <circle cx="12" cy="13" r="3" />
                              </svg>
                            </button>
                          </div>
                          
                          <button
                            type="button"
                            onClick={startCamera}
                            className={`text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer px-3 py-1.5 rounded-full ${
                              isDarkMode 
                                ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700' 
                                : 'text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'
                            }`}
                          >
                            <svg className="w-3 h-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.115-.744.074-1.08-.117A3.25 3.25 0 0 0 2 10.25v7A3.25 3.25 0 0 0 5.25 20.5h13.5A3.25 3.25 0 0 0 22 17.25v-7a3.25 3.25 0 0 0-2.106-3.137c-.336-.191-.7-.15-1.08-.117a2.31 2.31 0 0 1-1.641 1.055l-1.084.217a3.75 3.75 0 0 1-4.838-2.61L11.083 6.13a2.25 2.25 0 0 0-4.256.046Z" />
                              <circle cx="12" cy="13" r="3" />
                            </svg>
                            <span>Access Live Camera</span>
                          </button>
                        </div>
                      )}
                      
                      <span className={`text-[10px] font-extrabold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Choose Avatar Frame</span>
                      <div className="flex space-x-2">
                        {(['none', 'glow', 'matrix', 'neon'] as const).map((frame) => (
                          <button
                            key={frame}
                            type="button"
                            onClick={() => setSelectedAvatarFrame(frame)}
                            className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                              selectedAvatarFrame === frame 
                                ? 'bg-[#CAEF00] text-slate-950 border-[#CAEF00]' 
                                : isDarkMode 
                                  ? 'bg-slate-800 text-slate-300 border-slate-750 hover:bg-slate-700 hover:text-white'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-800'
                            }`}
                          >
                            {frame}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Phone Number</label>
                          <span className="text-[9px] text-slate-400 font-mono flex items-center space-x-1">
                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                            <span>Dispatch Contact</span>
                          </span>
                        </div>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email Handle</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION B: SAVED PICKUP LOCATIONS DECK */}
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                          Saved Pickup Locations
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">Default addresses for valet collection & dispatch</p>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                        {addressList.length} Saved
                      </span>
                    </div>

                    {/* Address Deck */}
                    <div className="space-y-3">
                      {addressList.map((addr) => {
                        const tagColors = {
                          HOME: {
                            badge: isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
                            icon: 'text-indigo-400'
                          },
                          WORK: {
                            badge: isDarkMode ? 'bg-sky-950/80 text-sky-300 border-sky-800/60' : 'bg-sky-50 text-sky-700 border-sky-200',
                            icon: 'text-sky-400'
                          },
                          GARAGE: {
                            badge: isDarkMode ? 'bg-amber-950/80 text-amber-300 border-amber-800/60' : 'bg-amber-50 text-amber-700 border-amber-200',
                            icon: 'text-amber-400'
                          },
                          OTHER: {
                            badge: isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300',
                            icon: 'text-slate-400'
                          }
                        }[addr.tag];

                        return (
                          <div 
                            key={addr.id}
                            className={`rounded-2xl p-4 border transition-all relative ${
                              addr.isDefault 
                                ? isDarkMode 
                                  ? 'bg-[#1E293B] border-[#CAEF00]/50 ring-1 ring-[#CAEF00]/30' 
                                  : 'bg-slate-50 border-[#CAEF00] ring-1 ring-[#CAEF00]/30'
                                : isDarkMode 
                                  ? 'bg-[#111827] border-slate-800 hover:border-slate-700' 
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${tagColors.badge}`}>
                                  {addr.tag}
                                </span>
                                <h5 className={`text-xs font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                                  {addr.label}
                                </h5>
                              </div>

                              {addr.isDefault ? (
                                <span className="text-[9px] font-black uppercase tracking-wider bg-[#CAEF00] text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                                  Default Pickup
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors cursor-pointer border ${
                                    isDarkMode 
                                      ? 'text-slate-400 hover:text-white border-slate-700 hover:border-slate-500 bg-slate-800/60' 
                                      : 'text-slate-500 hover:text-slate-900 border-slate-200 hover:border-slate-400 bg-slate-100'
                                  }`}
                                >
                                  Set Default
                                </button>
                              )}
                            </div>

                            {/* Street & Landmark info */}
                            <div className="mt-2.5 space-y-0.5 text-left">
                              <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {addr.street}
                              </p>
                              {addr.landmark && (
                                <p className="text-[10px] text-slate-400 font-medium">
                                  Ref: {addr.landmark}
                                </p>
                              )}
                              <p className="text-[10px] font-mono text-slate-400">
                                {addr.city} • Zip: {addr.pincode}
                              </p>
                            </div>

                            {/* Action Row */}
                            <div className="mt-3 pt-2.5 border-t border-slate-700/20 flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditAddressModal(addr)}
                                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer ${
                                  isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer text-rose-500 hover:bg-rose-500/10`}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add New Address Card Button */}
                      <button
                        type="button"
                        onClick={handleOpenAddAddressModal}
                        className={`w-full py-3.5 border-2 border-dashed rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'border-slate-800 hover:border-[#CAEF00]/60 text-slate-400 hover:text-[#CAEF00] bg-slate-900/40 hover:bg-slate-900/80' 
                            : 'border-slate-300 hover:border-[#CAEF00] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <Plus className="w-4 h-4 text-[#CAEF00]" />
                        <span className="text-xs font-bold uppercase tracking-wider">Add New Service Address</span>
                      </button>
                    </div>
                  </div>

                  {/* Fixed Bottom Save CTA */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#CAEF00] text-slate-950 font-black tracking-wider text-xs rounded-2xl hover:bg-[#b0d000] transition-all flex items-center justify-center space-x-2 uppercase shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>SAVE ACCOUNT CHANGES</span>
                  </button>
                </form>
              )}

              {/* SUBMENU: PAYMENT METHODS */}
              {activeSubMenu === 'payment' && (
                <div className="space-y-4 text-left">
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Payment Accounts</p>
                    
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id} 
                          className={`p-3.5 border rounded-2xl flex items-center justify-between transition-colors ${isDarkMode ? 'border-slate-800/60 bg-slate-900/40' : 'border-slate-200/80 bg-slate-50'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200/60 border-slate-300'}`}>
                              <CreditCard className={`w-4 h-4 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`} />
                            </div>
                            <div>
                              <p className={`text-xs font-black flex items-center space-x-1.5 transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                                <span>{method.name}</span>
                                {method.isDefault && (
                                  <span className="text-[8px] bg-[#CAEF00] text-slate-900 px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest scale-95">Default</span>
                                )}
                              </p>
                              <p className={`text-[9px] font-medium transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{method.details}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            {!method.isDefault && (
                              <button
                                onClick={() => setPaymentAsDefault(method.id)}
                                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer ${isDarkMode ? 'text-slate-300 hover:text-white bg-slate-800 border border-slate-700' : 'text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200'}`}
                              >
                                Use Default
                              </button>
                            )}
                            <button
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-950/40' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-100'}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!showAddCardForm ? (
                    <button
                      onClick={() => setShowAddCardForm(true)}
                      className={`w-full py-4 font-black tracking-wider text-xs rounded-2xl transition-all flex items-center justify-center space-x-1.5 uppercase shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-900 text-[#CAEF00] hover:bg-slate-850' : 'bg-slate-800 text-white hover:bg-slate-750'}`}
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Link New Card</span>
                    </button>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleAddPaymentMethod}
                      className={`rounded-3xl p-5 border shadow-md space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}
                    >
                      <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Secure Payment details</p>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="4000 1234 5678 9010"
                            value={newCardNumber}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                              setNewCardNumber(v);
                            }}
                            className={`w-full border rounded-xl px-3.5 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#CAEF00] transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC] placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Expiry Date</label>
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="MM/YY"
                              value={newCardExpiry}
                              onChange={(e) => setNewCardExpiry(e.target.value)}
                              className={`w-full border rounded-xl px-3.5 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#CAEF00] transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC] placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Secure CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              placeholder="***"
                              value={newCardCvv}
                              onChange={(e) => setNewCardCvv(e.target.value)}
                              className={`w-full border rounded-xl px-3.5 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#CAEF00] transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC] placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-850 placeholder-slate-400'}`}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCardForm(false)}
                          className={`flex-1 py-3 font-bold text-xs rounded-xl transition-all uppercase cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-[#CAEF00] text-slate-950 font-black text-xs rounded-xl hover:bg-[#b0d000] transition-all uppercase cursor-pointer"
                        >
                          Secure Save
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              )}

              {/* SUBMENU: INSURANCE & VEHICLE VAULT */}
              {activeSubMenu === 'insurance' && (
                <div className="space-y-4 text-left select-none">
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Secure Document Vault</p>
                    
                    {/* File Upload Box */}
                    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${isDarkMode ? 'border-slate-800/80 hover:bg-slate-800/30' : 'border-slate-300 hover:bg-slate-50'}`}>
                      <input 
                        type="file" 
                        onChange={handleSimulatedDocUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      <Folder className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-850'}`}>Drag files here or tap to upload</p>
                      <p className={`text-[9px] mt-1 uppercase transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-450'}`}>Supports PDF, JPG, PNG (Max 10MB)</p>
                    </div>

                    {isUploading && (
                      <div className={`space-y-2 p-3 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-900/60 border-slate-850/60' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span>Uploading secure document...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Doc List */}
                    <div className="space-y-3 pt-2">
                      <p className={`text-[9px] font-black tracking-widest uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Uploaded Certificates</p>
                      {vaultDocs.map((doc) => (
                        <div key={doc.id} className={`p-3.5 border rounded-2xl flex items-center justify-between transition-colors ${isDarkMode ? 'border-slate-800/60 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'}`}>
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${isDarkMode ? 'bg-sky-950/45 border-sky-900/30' : 'bg-sky-50 border-sky-200/80'}`}>
                              <FileText className="w-4.5 h-4.5 text-sky-400" />
                            </div>
                            <div className="overflow-hidden">
                              <p className={`text-[11px] font-extrabold truncate transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`} title={doc.name}>{doc.name}</p>
                              <p className={`text-[9px] font-semibold transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{doc.size} • Verified {doc.date}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveDoc(doc.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ml-1 ${isDarkMode ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-950/40' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`border rounded-2xl p-4 flex items-start space-x-2.5 transition-colors ${isDarkMode ? 'bg-sky-950/20 border-sky-900/30' : 'bg-sky-50/50 border-sky-100'}`}>
                    <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-sky-900'}`}>Encrypted Cloud Vault</p>
                      <p className={`text-[10px] leading-normal mt-0.5 transition-colors ${isDarkMode ? 'text-sky-300' : 'text-sky-850'}`}>
                        All compliance certificates, retail logs, and third-party policies are securely encrypted end-to-end to maintain complete EV registration compliance.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMENU: REPAIR LOGS (SHIFTED FROM MAIN VIEW) */}
              {activeSubMenu === 'history' && (
                <div className="space-y-3 text-left select-none">
                  <div className={`rounded-3xl border p-4.5 shadow-sm space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200'}`}>
                    <div className={`flex items-center space-x-2 pb-2 border-b transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                      <History className="w-4 h-4 text-slate-400" />
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>PAST VISITS & REPAIRS</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start text-xs">
                        <div className="space-y-1">
                          <p className={`font-extrabold text-xs transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>500-Mile Complete Hub Diagnostic</p>
                          <p className={`text-[10px] transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>May 14, 2026 • SF Hub (SoMa)</p>
                          <p className={`text-[9px] font-mono px-2 py-0.5 rounded-md inline-block transition-colors ${isDarkMode ? 'text-slate-400 bg-slate-900/60 border border-slate-800' : 'text-slate-500 bg-slate-100 border border-slate-200'}`}>ID: RP-94282</p>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full shrink-0 transition-colors ${isDarkMode ? 'text-emerald-400 bg-emerald-950/45 border border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border border-emerald-200'}`}>Completed</span>
                      </div>

                      <div className={`flex justify-between items-start text-xs border-t pt-3.5 transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <div className="space-y-1">
                          <p className={`font-extrabold text-xs transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Rear Tire Tube & Belt Alignment</p>
                          <p className={`text-[10px] transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Jan 08, 2026 • Doorstep Mobile Van</p>
                          <p className={`text-[9px] font-mono px-2 py-0.5 rounded-md inline-block transition-colors ${isDarkMode ? 'text-slate-400 bg-slate-900/60 border border-slate-800' : 'text-slate-500 bg-slate-100 border border-slate-200'}`}>ID: RP-72410</p>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full shrink-0 transition-colors ${isDarkMode ? 'text-emerald-400 bg-emerald-950/45 border border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border border-emerald-200'}`}>Completed</span>
                      </div>

                      <div className={`flex justify-between items-start text-xs border-t pt-3.5 transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <div className="space-y-1">
                          <p className={`font-extrabold text-xs transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Initial Linked Safety Checkup</p>
                          <p className={`text-[10px] transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Aug 20, 2025 • SF Hub (SoMa)</p>
                          <p className={`text-[9px] font-mono px-2 py-0.5 rounded-md inline-block transition-colors ${isDarkMode ? 'text-slate-400 bg-slate-900/60 border border-slate-800' : 'text-slate-500 bg-slate-100 border border-slate-200'}`}>ID: RP-10242</p>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full shrink-0 transition-colors ${isDarkMode ? 'text-emerald-400 bg-emerald-950/45 border border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border border-emerald-200'}`}>Completed</span>
                      </div>
                    </div>
                  </div>

                  <div className={`border rounded-2xl p-4 flex items-start space-x-2.5 transition-colors ${isDarkMode ? 'bg-amber-950/20 border-amber-900/30' : 'bg-amber-50/50 border-amber-100'}`}>
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-amber-900'}`}>Next scheduled service</p>
                      <p className={`text-[10px] leading-normal mt-0.5 transition-colors ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                        Your QWIK-VOLT is scheduled for a preventive tune-up check in {userStats.serviceIntervalDays} days. Keep your diagnostics online to maintain valid warranty seals.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMENU: NOTIFICATION SETTINGS */}
              {activeSubMenu === 'notifications' && (
                <div className="space-y-4 text-left select-none">
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Device Toggles</p>
                    
                    <div className="space-y-4">
                      {/* Toggle 1 */}
                      <div className={`flex items-center justify-between pb-3.5 border-b transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Battery Cell Health Alerts</p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Push notice if cell drop triggers diagnostic alerts</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifications(prev => ({ ...prev, batteryHealth: !prev.batteryHealth }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifications.batteryHealth ? 'bg-[#CAEF00]' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${notifications.batteryHealth ? 'left-[22px]' : 'left-1'}`} />
                        </button>
                      </div>

                      {/* Toggle 2 */}
                      <div className={`flex items-center justify-between pb-3.5 border-b transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Preventive Servicing Notices</p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Warning alerts when routine checkups come near</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifications(prev => ({ ...prev, serviceIntervals: !prev.serviceIntervals }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifications.serviceIntervals ? 'bg-[#CAEF00]' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${notifications.serviceIntervals ? 'left-[22px]' : 'left-1'}`} />
                        </button>
                      </div>

                      {/* Toggle 3 */}
                      <div className={`flex items-center justify-between pb-3.5 border-b transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Live Technician Arrival updates</p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Live ETA progress alerts when technician is dispatched</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifications(prev => ({ ...prev, arrivalUpdates: !prev.arrivalUpdates }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifications.arrivalUpdates ? 'bg-[#CAEF00]' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${notifications.arrivalUpdates ? 'left-[22px]' : 'left-1'}`} />
                        </button>
                      </div>

                      {/* Toggle 4 */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>In-App Chat Channels</p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Community and brand-wide channels alerts</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifications(prev => ({ ...prev, marketingUpdates: !prev.marketingUpdates }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifications.marketingUpdates ? 'bg-[#CAEF00]' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${notifications.marketingUpdates ? 'left-[22px]' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showFeedbackToast('Notification triggers successfully updated!');
                      setActiveSubMenu(null);
                    }}
                    className="w-full py-4 bg-[#CAEF00] text-slate-950 font-black tracking-wider text-xs rounded-2xl hover:bg-[#b0d000] transition-all flex items-center justify-center space-x-1.5 uppercase shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Apply Notification Toggles</span>
                  </button>
                </div>
              )}

              {/* SUBMENU: APP SECURITY */}
              {activeSubMenu === 'security' && (
                <div className="space-y-4 text-left select-none">
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Biometric & Pin Controls</p>
                    
                    <div className="space-y-4">
                      {/* Toggle 1 */}
                      <div className={`flex items-center justify-between pb-3.5 border-b transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <div>
                          <p className={`text-xs font-black flex items-center space-x-1.5 transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                            <KeyRound className="w-4 h-4 text-slate-400" />
                            <span>Use Biometric Login (FaceID / Fingerprint)</span>
                          </p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enable instant secure app verification</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSecuritySettings(prev => ({ ...prev, biometrics: !prev.biometrics }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${securitySettings.biometrics ? 'bg-[#CAEF00]' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${securitySettings.biometrics ? 'left-[22px]' : 'left-1'}`} />
                        </button>
                      </div>

                      {/* Toggle 2 */}
                      <div className={`flex items-center justify-between pb-3.5 border-b transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Secure Payments Verification</p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Require transaction PIN validation for checkouts</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSecuritySettings(prev => ({ ...prev, securePayments: !prev.securePayments }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${securitySettings.securePayments ? 'bg-[#CAEF00]' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${securitySettings.securePayments ? 'left-[22px]' : 'left-1'}`} />
                        </button>
                      </div>

                      {/* PIN Indicator */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>App Transaction PIN</p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active PIN Code: <span className={`font-bold transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>****</span></p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPinEditor(true)}
                          className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-750' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200'}`}
                        >
                          Change PIN
                        </button>
                      </div>
                    </div>
                  </div>

                  {showPinEditor && (
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSavePin}
                      className={`rounded-3xl p-5 border shadow-md space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}
                    >
                      <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Change Secure PIN</p>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>New 4-Digit Security PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="****"
                            value={newPin}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/\D/g, '');
                              setNewPin(clean);
                            }}
                            className={`w-full border rounded-xl px-3.5 py-3 text-center text-lg tracking-[8px] font-black focus:outline-none focus:ring-2 focus:ring-[#CAEF00] transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-[#F8FAFC] placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-850 placeholder-slate-400'}`}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPinEditor(false)}
                          className={`flex-1 py-3 font-bold text-xs rounded-xl transition-all uppercase cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={newPin.length !== 4}
                          className="flex-1 py-3 bg-[#CAEF00] text-slate-950 font-black text-xs rounded-xl hover:bg-[#b0d000] transition-all uppercase cursor-pointer disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              )}

              {/* SUBMENU: HELP & SUPPORT DESK */}
              {activeSubMenu === 'support' && (
                <div className="space-y-4 text-left select-none">
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Open Support Cases</p>
                    
                    <div className="space-y-2.5">
                      <div className={`p-3 border rounded-2xl flex items-center justify-between transition-colors ${isDarkMode ? 'border-slate-800/60 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Case #QK-8422: Odometer Diagnostic Sync</p>
                          <p className={`text-[9px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Created yesterday • Linked vehicle standard check</p>
                        </div>
                        <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase transition-colors ${isDarkMode ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>In Progress</span>
                      </div>

                      <div className={`p-3 border rounded-2xl flex items-center justify-between transition-colors ${isDarkMode ? 'border-slate-800/60 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
                        <div>
                          <p className={`text-xs font-black transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Case #QK-7910: Charger Replacement</p>
                          <p className={`text-[9px] mt-0.5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Created June 12, 2026 • Order shipment track</p>
                        </div>
                        <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase transition-colors ${isDarkMode ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>Resolved</span>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Accordion Section */}
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Frequently Asked Questions</p>
                    
                    <div className={`divide-y transition-colors ${isDarkMode ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
                      {[
                        {
                          q: "How do I schedule a doorstep service?",
                          a: "You can book directly in the Repair tab. Choose the required service level, toggle Delivery Mode to Doorstep Dispatch, input your verified coordinates, and confirm scheduling slots. A certified technician with a mobile utility van will arrive right at your location."
                        },
                        {
                          q: "What is included in the comprehensive tune-up?",
                          a: "Our standard tuning covers critical gear calibrations, hydraulic brake line adjustments, motor cell health diagnostics, and wheel spoke truing to verify absolute structural integrity."
                        },
                        {
                          q: "How does the Carbon Offset Dashboard compute savings?",
                          a: "We compute offsets by comparing your electric vehicle riding logs against equivalent gas engine carbon emission indices. Every mile driven saves approximately 0.26 kg of CO2!"
                        }
                      ].map((faq, idx) => (
                        <div key={idx} className="py-3">
                          <button
                            type="button"
                            onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                            className={`w-full flex justify-between items-center text-left text-xs font-black transition-colors ${isDarkMode ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
                          >
                            <span>{faq.q}</span>
                            <span className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{expandedFaq === idx ? '−' : '+'}</span>
                          </button>
                          <AnimatePresence>
                            {expandedFaq === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className={`text-[10px] leading-relaxed mt-2 pt-1 border-t transition-colors ${isDarkMode ? 'text-slate-400 border-slate-800/80' : 'text-slate-500 border-slate-100'}`}>
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="pt-2">
                    <a
                      href="mailto:support@qwikamp.com"
                      className={`w-full py-4 font-black tracking-wider text-xs rounded-2xl transition-all flex items-center justify-center space-x-1.5 uppercase text-center shadow-sm ${isDarkMode ? 'bg-slate-900 text-[#CAEF00] hover:bg-slate-850' : 'bg-slate-800 text-white hover:bg-slate-750'}`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Email QWIKAMP Support Desk</span>
                    </a>
                  </div>
                </div>
              )}

              {/* SUBMENU: LEGAL & PRIVACY INFO */}
              {activeSubMenu === 'legal' && (
                <div className={`space-y-4 text-left select-none leading-relaxed text-[11px] transition-colors ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-colors ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
                    <p className={`text-[10px] font-black tracking-wider uppercase transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>QWIKAMP Legal Framework</p>
                    
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <p className={`font-extrabold text-xs transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-850'}`}>1. Geographic Location Tracking</p>
                        <p>
                          We access your GPS location coordinates only when dispatching a mobile technician or locating partner diagnostic hubs. Location tracking keys are stored on device memory and never logged indefinitely in database structures.
                        </p>
                      </div>

                      <div className={`space-y-1 border-t pt-3 transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <p className={`font-extrabold text-xs transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-850'}`}>2. Battery Cell Diagnostics Logs</p>
                        <p>
                          To monitor warranty compliance certificates, routine diagnostic battery scans are periodically reported back. We use this telemetry to provide preventive maintenance alerts and check cell fatigue factors.
                        </p>
                      </div>

                      <div className={`space-y-1 border-t pt-3 transition-colors ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                        <p className={`font-extrabold text-xs transition-colors ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-850'}`}>3. Terms & Service Conditions</p>
                        <p>
                          By registering or purchasing electric vehicles through the retail catalog, you confirm you have verified official state registration guidelines. Warranty stamps may be voided if unauthorized third-party motor modifications are detected.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`text-center text-[9px] font-bold uppercase tracking-wider select-none py-2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    © 2026 QWIKAMP Inc. • Version 2.8.1-PRO (Production)
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REGISTER CYCLE MODAL --- */}
      <AnimatePresence>
        {showAddCycleModal && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-5 w-full max-w-sm space-y-4 border shadow-2xl transition-all duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 text-[#F8FAFC]' : 'bg-white border-slate-200/50 text-slate-900'}`}
            >
              <div className="flex justify-between items-center">
                <h3 className={`text-sm font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>Register EV Cycle</h3>
                <button
                  type="button"
                  onClick={() => setShowAddCycleModal(false)}
                  className={`text-xs font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleRegisterCycle} className="space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="reg-model" className="text-[9px] font-bold text-slate-400 uppercase">Select EV Model</label>
                  <select
                    id="reg-model"
                    value={newCycleName}
                    onChange={(e) => setNewCycleName(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#CAEF00] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  >
                    <option value="QWIK-GRAVEL ULTRALIGHT">QWIK-GRAVEL ULTRALIGHT</option>
                    <option value="QWIK-CITY STEALTH S">QWIK-CITY STEALTH S</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-code" className="text-[9px] font-bold text-slate-400 uppercase">Verification Pin / Activation Code</label>
                  <input
                    type="text"
                    id="reg-code"
                    maxLength={6}
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit code (e.g. QW-942)"
                    className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#CAEF00] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-[#F8FAFC] placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                    required
                  />
                  {errorMsg && (
                    <span className="text-[9px] text-rose-500 font-bold flex items-center mt-1">
                      <AlertCircle className="w-3 h-3 mr-1" /> {errorMsg}
                    </span>
                  )}
                </div>

                <div className={`rounded-xl p-2.5 border text-[9px] leading-normal flex items-start space-x-1.5 select-none ${isDarkMode ? 'bg-slate-900/60 border-slate-800/60 text-slate-400' : 'bg-slate-100 border border-slate-200/40 text-slate-500'}`}>
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Activation code can be found inside your retail invoice package or underneath your motor casing.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#CAEF00] text-slate-950 font-black tracking-wider text-xs rounded-xl hover:bg-[#b0d000] transition-all flex items-center justify-center space-x-1 uppercase cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Link Cycle To Garage</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD / EDIT ADDRESS MODAL --- */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-5 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-5 w-full max-w-sm space-y-4 border shadow-2xl transition-all duration-250 ${
                isDarkMode ? 'bg-[#161D2A] border-slate-800 text-[#F8FAFC]' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-700/30">
                <h3 className={`text-sm font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                  {editingAddressId ? 'Edit Pickup Location' : 'Add New Service Address'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className={`text-xs font-bold cursor-pointer transition-colors ${
                    isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3.5 text-left">
                {/* Tag Selection */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Address Type Badge</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['HOME', 'WORK', 'GARAGE', 'OTHER'] as const).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setAddressForm(prev => ({ ...prev, tag }))}
                        className={`py-2 text-[9px] font-black uppercase rounded-xl border transition-all cursor-pointer ${
                          addressForm.tag === tag 
                            ? 'bg-[#CAEF00] text-slate-950 border-[#CAEF00]' 
                            : isDarkMode 
                              ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700' 
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Street Address / Suite</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                    placeholder="e.g. 120 Mission St, Suite 400"
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                    required
                  />
                </div>

                {/* Landmark */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Landmark / Reference (Optional)</label>
                  <input
                    type="text"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="e.g. Near Yerba Buena Gardens"
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* City & Pincode Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">City / State</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      className={`w-full border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Pincode / Zip</label>
                    <input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="e.g. 94103"
                      className={`w-full border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#CAEF00] ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className={`flex-1 py-3 font-bold text-xs rounded-xl transition-all uppercase cursor-pointer ${
                      isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#CAEF00] text-slate-950 font-black text-xs rounded-xl hover:bg-[#b0d000] transition-all uppercase cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-5 w-full max-w-sm space-y-4 border shadow-2xl select-none transition-all duration-250 ${isDarkMode ? 'bg-[#161D2A] border-slate-800/80 text-[#F8FAFC]' : 'bg-white border-slate-200/50 text-slate-900'}`}
            >
              <div className="text-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto text-rose-500 ${isDarkMode ? 'bg-rose-950/30 border-rose-900/30' : 'bg-rose-50 border border-rose-100'}`}>
                  <LogOut className="w-6 h-6" />
                </div>
                <h3 className={`text-sm font-black ${isDarkMode ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>Log Out of QWIKAMP?</h3>
                <p className="text-xs text-slate-500">
                  You can log back in instantly to resume diagnostic stats and vehicle routes.
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 py-3 font-bold text-xs rounded-xl transition-all uppercase cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={triggerLogout}
                  className="flex-1 py-3 bg-rose-500 text-white font-black text-xs rounded-xl hover:bg-rose-600 transition-all uppercase cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
