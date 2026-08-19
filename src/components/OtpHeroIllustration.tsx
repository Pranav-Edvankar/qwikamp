export default function OtpHeroIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Floor Shadow / Ground Plane */}
      <ellipse cx="250" cy="450" rx="200" ry="20" fill="#000000" fillOpacity="0.08" />
      <path d="M47.44 455L452.56 455" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6" />

      {/* Ergonomic Office Chair */}
      <g id="chair">
        {/* Wheels & Base */}
        <path d="M120 450 L160 410 L200 450" stroke="#334155" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="120" cy="450" r="6" fill="#1E293B" />
        <circle cx="200" cy="450" r="6" fill="#1E293B" />
        <rect x="156" y="380" width="8" height="35" rx="4" fill="#475569" />
        
        {/* Seat */}
        <rect x="125" y="365" width="70" height="18" rx="8" fill="#1E293B" />
        <rect x="130" y="368" width="60" height="6" rx="3" fill="#CAEF00" />
        
        {/* Backrest */}
        <path d="M125 260 C125 250, 140 240, 155 240 C170 240, 185 250, 185 260 L180 360 L130 360 Z" fill="#0F172A" />
        <path d="M135 270 C135 262, 145 255, 155 255 C165 255, 175 262, 175 270 L172 345 L138 345 Z" fill="#334155" />
        
        {/* Armrest */}
        <path d="M180 320 H205 V340 H180" stroke="#475569" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Desk & Workstation */}
      <g id="desk">
        <rect x="210" y="340" width="240" height="14" rx="4" fill="#334155" />
        <rect x="215" y="342" width="230" height="4" rx="2" fill="#94A3B8" />
        <rect x="235" y="354" width="12" height="96" rx="4" fill="#1E293B" />
        <rect x="415" y="354" width="12" height="96" rx="4" fill="#1E293B" />
      </g>

      {/* Character (Person Sitting at Desk) */}
      <g id="character">
        {/* Torso / Jacket */}
        <path d="M148 315 C148 290, 170 280, 195 285 L215 325 L165 330 Z" fill="#2563EB" />
        <path d="M165 285 L180 315 L195 285" fill="#1E40AF" />
        
        {/* Head & Hair */}
        <circle cx="165" cy="245" r="22" fill="#F87171" /> {/* Skin tone */}
        <path d="M148 240 C148 220, 182 220, 182 240 C182 232, 172 228, 165 228 C155 228, 148 232, 148 240 Z" fill="#1E1B4B" /> {/* Hair */}
        <circle cx="172" cy="245" r="3" fill="#0F172A" /> {/* Eye */}
        
        {/* Arms holding tablet / interacting with screen */}
        <path d="M190 295 L230 310 L250 295" stroke="#F87171" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Large Monitor / Tablet Device showing Verification Screen */}
      <g id="monitor-device">
        <rect x="230" y="100" width="210" height="230" rx="16" fill="#0F172A" stroke="#334155" strokeWidth="4" />
        <rect x="240" y="110" width="190" height="210" rx="10" fill="#1E293B" />
        
        {/* Header Bar */}
        <rect x="250" y="125" width="170" height="24" rx="6" fill="#0F172A" />
        <circle cx="262" cy="137" r="4" fill="#EF4444" />
        <circle cx="274" cy="137" r="4" fill="#F59E0B" />
        <circle cx="286" cy="137" r="4" fill="#10B981" />
        <rect x="310" y="132" width="100" height="10" rx="5" fill="#334155" />

        {/* OTP Input Slots Display on Monitor */}
        <text x="335" y="180" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
          ENTER 4-DIGIT OTP
        </text>

        {/* 4 Pin Boxes */}
        <rect x="260" y="200" width="32" height="40" rx="8" fill="#0F172A" stroke="#CAEF00" strokeWidth="2" />
        <text x="276" y="226" textAnchor="middle" fill="#CAEF00" fontSize="18" fontWeight="900" fontFamily="monospace">9</text>

        <rect x="300" y="200" width="32" height="40" rx="8" fill="#0F172A" stroke="#CAEF00" strokeWidth="2" />
        <text x="316" y="226" textAnchor="middle" fill="#CAEF00" fontSize="18" fontWeight="900" fontFamily="monospace">8</text>

        <rect x="340" y="200" width="32" height="40" rx="8" fill="#0F172A" stroke="#CAEF00" strokeWidth="2" />
        <text x="356" y="226" textAnchor="middle" fill="#CAEF00" fontSize="18" fontWeight="900" fontFamily="monospace">7</text>

        <rect x="380" y="200" width="32" height="40" rx="8" fill="#0F172A" stroke="#CAEF00" strokeWidth="2" />
        <text x="396" y="226" textAnchor="middle" fill="#CAEF00" fontSize="18" fontWeight="900" fontFamily="monospace">6</text>

        {/* Success Action Button on Screen */}
        <rect x="260" y="255" width="152" height="32" rx="8" fill="#CAEF00" />
        <text x="336" y="276" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
          ✓ VERIFIED
        </text>
      </g>

      {/* Security Shield & EV Keylock (Floating 3D Security Element) */}
      <g id="security-shield" transform="translate(60, 80)">
        {/* Glow backdrop */}
        <circle cx="70" cy="80" r="65" fill="#CAEF00" fillOpacity="0.15" />

        {/* Shield Body */}
        <path d="M70 25 L120 45 V90 C120 130, 70 155, 70 155 C70 155, 20 130, 20 90 V45 L70 25 Z" fill="#0F172A" stroke="#CAEF00" strokeWidth="4" />
        <path d="M70 33 L112 50 V88 C112 122, 70 144, 70 144 C70 144, 28 122, 28 88 V50 L70 33 Z" fill="#1E293B" />

        {/* Keyhole / Padlock Icon inside Shield */}
        <rect x="52" y="75" width="36" height="38" rx="8" fill="#CAEF00" />
        <path d="M58 75 V62 C58 52, 82 52, 82 62 V75" stroke="#CAEF00" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="70" cy="89" r="5" fill="#0F172A" />
        <path d="M70 92 V103" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />

        {/* EV Spark Sparkles */}
        <path d="M125 30 L130 15 L135 30 L150 35 L135 40 L130 55 L125 40 L110 35 Z" fill="#CAEF00" />
        <circle cx="15" cy="110" r="4" fill="#CAEF00" />
        <circle cx="25" cy="125" r="2" fill="#94A3B8" />
      </g>

      {/* Electric Circuit & Connectivity Signals */}
      <g id="circuit-lines">
        <path d="M180 135 C 190 135, 200 160, 230 160" stroke="#CAEF00" strokeWidth="3" strokeDasharray="4 4" />
        <circle cx="180" cy="135" r="4" fill="#CAEF00" />
        <circle cx="230" cy="160" r="4" fill="#CAEF00" />
      </g>
    </svg>
  );
}

