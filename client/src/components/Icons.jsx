// client/src/components/Icons.jsx
// A place for simple, reusable SVG icons

export const Icons = {
  dashboard: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  notice: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <path d="M14 2v4h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  ),
  chat: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  ),
  dm: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  complaint: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
  ),
  profile: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  calendar: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  authIllustration: (props) => (
    <svg width="100%" height="100%" viewBox="0 0 425 425" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="425" height="425" rx="24" fill="url(#paint0_linear_143:40)"/>
      <path d="M309 116H116V309H309V116Z" fill="#E2E8F0"/>
      <path d="M129 116H116V309H129V116Z" fill="#94A3B8"/>
      <path d="M116 129V116H309V129H116Z" fill="#94A3B8"/>
      <rect x="132" y="146" width="162" height="15" rx="3" fill="#CBD5E1"/>
      <rect x="132" y="171" width="162" height="15" rx="3" fill="#CBD5E1"/>
      <rect x="132" y="200" width="162" height="8" rx="2" fill="#E2E8F0"/>
      <rect x="132" y="213" width="162" height="8" rx="2" fill="#E2E8F0"/>
      <rect x="132" y="226" width="128" height="8" rx="2" fill="#E2E8F0"/>
      <rect x="132" y="259" width="60" height="24" rx="4" fill="#475569"/>
      <circle cx="282" cy="271" r="12" fill="#475569"/>
      <defs>
        <linearGradient id="paint0_linear_143:40" x1="0" y1="0" x2="425" y2="425" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA"/>
          <stop offset="1" stopColor="#FBBF24"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  chevronLeft: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  chevronRight: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  // --- NEW ---
  search: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
  ),
};