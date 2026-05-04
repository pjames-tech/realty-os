import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, strokeWidth = 1.75, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Check: (p: IconProps) => (
    <Base {...p}><polyline points="20 6 9 17 4 12" /></Base>
  ),
  Plus: (p: IconProps) => (
    <Base {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Base>
  ),
  ArrowRight: (p: IconProps) => (
    <Base {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Base>
  ),
  ArrowUpRight: (p: IconProps) => (
    <Base {...p}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></Base>
  ),
  ChevronRight: (p: IconProps) => (
    <Base {...p}><polyline points="9 18 15 12 9 6" /></Base>
  ),
  Building: (p: IconProps) => (
    <Base {...p}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <line x1="9" y1="8" x2="9" y2="8" /><line x1="15" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="9" y2="16" /><line x1="15" y1="16" x2="15" y2="16" />
    </Base>
  ),
  Home: (p: IconProps) => (
    <Base {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></Base>
  ),
  Neighborhood: (p: IconProps) => (
    <Base {...p}><path d="M3 21V11l5-4 5 4v10" /><path d="M13 21v-6l4-3 4 3v6" /></Base>
  ),
  Skyline: (p: IconProps) => (
    <Base {...p}><rect x="3" y="9" width="6" height="12" /><rect x="10" y="4" width="5" height="17" /><rect x="16" y="12" width="5" height="9" /></Base>
  ),
  Users: (p: IconProps) => (
    <Base {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Base>
  ),
  User: (p: IconProps) => (
    <Base {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Base>
  ),
  Target: (p: IconProps) => (
    <Base {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Base>
  ),
  Bolt: (p: IconProps) => (
    <Base {...p}><polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2" /></Base>
  ),
  Sparkle: (p: IconProps) => (
    <Base {...p}><path d="M12 3l1.8 4.8L18 9.6l-4.2 1.8L12 16.2l-1.8-4.8L6 9.6l4.2-1.8L12 3z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" /></Base>
  ),
  Calendar: (p: IconProps) => (
    <Base {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="3" y1="10" x2="21" y2="10" /></Base>
  ),
  Clock: (p: IconProps) => (
    <Base {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Base>
  ),
  Bell: (p: IconProps) => (
    <Base {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></Base>
  ),
  Mail: (p: IconProps) => (
    <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></Base>
  ),
  Phone: (p: IconProps) => (
    <Base {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L7.9 9.6a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z" /></Base>
  ),
  Message: (p: IconProps) => (
    <Base {...p}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" /></Base>
  ),
  Heart: (p: IconProps) => (
    <Base {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></Base>
  ),
  HeartFilled: (p: IconProps) => (
    <Base {...p} fill="currentColor" strokeWidth={0}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></Base>
  ),
  Bed: (p: IconProps) => (
    <Base {...p}><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" /><path d="M3 14h18" /><path d="M7 9V6h4v3" /><line x1="3" y1="21" x2="3" y2="18" /><line x1="21" y1="21" x2="21" y2="18" /></Base>
  ),
  Bath: (p: IconProps) => (
    <Base {...p}><path d="M3 12h18v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4z" /><path d="M6 12V6a2 2 0 0 1 4 0v1" /><line x1="6" y1="19" x2="6" y2="21" /><line x1="18" y1="19" x2="18" y2="21" /></Base>
  ),
  Ruler: (p: IconProps) => (
    <Base {...p}><path d="M21 3H3v6h18V3z" /><line x1="7" y1="3" x2="7" y2="7" /><line x1="11" y1="3" x2="11" y2="6" /><line x1="15" y1="3" x2="15" y2="7" /><line x1="19" y1="3" x2="19" y2="6" /></Base>
  ),
  Book: (p: IconProps) => (
    <Base {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Base>
  ),
  Play: (p: IconProps) => (
    <Base {...p}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" strokeWidth={0} /></Base>
  ),
  Video: (p: IconProps) => (
    <Base {...p}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></Base>
  ),
  Hat: (p: IconProps) => (
    <Base {...p}><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></Base>
  ),
  Megaphone: (p: IconProps) => (
    <Base {...p}><path d="M3 11v3l12 5V6L3 11z" /><path d="M15 8a4 4 0 0 1 0 8" /><line x1="7" y1="13" x2="7" y2="19" /></Base>
  ),
  Chart: (p: IconProps) => (
    <Base {...p}><line x1="4" y1="20" x2="4" y2="10" /><line x1="10" y1="20" x2="10" y2="4" /><line x1="16" y1="20" x2="16" y2="14" /><line x1="22" y1="20" x2="2" y2="20" /></Base>
  ),
  Settings: (p: IconProps) => (
    <Base {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></Base>
  ),
  Wrench: (p: IconProps) => (
    <Base {...p}><path d="M14.7 6.3a4 4 0 0 1 5 5L8 23l-5-5L14.7 6.3z" /><path d="M17 9l-2-2" /></Base>
  ),
  Spark: (p: IconProps) => (
    <Base {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></Base>
  ),
  Brain: (p: IconProps) => (
    <Base {...p}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 0 4 3 3 0 0 0 3 4 3 3 0 0 0 5 1 3 3 0 0 0 5-1 3 3 0 0 0 3-4 3 3 0 0 0 0-4 3 3 0 0 0-2-5 3 3 0 0 0-3-3 3 3 0 0 0-3-1 3 3 0 0 0-3 1z" /></Base>
  ),
  Handshake: (p: IconProps) => (
    <Base {...p}><path d="M11 17l2 2 4-4" /><path d="M3 12l4-4 4 2 4-3 6 4-4 5-3-2-4 2-3-2-4 1v-3z" /></Base>
  ),
  Link: (p: IconProps) => (
    <Base {...p}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19" /></Base>
  ),
  Mobile: (p: IconProps) => (
    <Base {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></Base>
  ),
  Inbox: (p: IconProps) => (
    <Base {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5 4h14l3 8v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l3-8z" /></Base>
  ),
  Clipboard: (p: IconProps) => (
    <Base {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></Base>
  ),
  Shield: (p: IconProps) => (
    <Base {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Base>
  ),
  Sun: (p: IconProps) => (
    <Base {...p}><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.93" y1="4.93" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.07" y2="19.07" /><line x1="4.93" y1="19.07" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.07" y2="4.93" /></Base>
  ),
  Moon: (p: IconProps) => (
    <Base {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Base>
  ),
  Wave: (p: IconProps) => (
    <Base {...p}><path d="M6 13.5c0-3 2.5-5.5 5.5-5.5S17 10.5 17 13.5V17" /><path d="M9 10V5a2 2 0 1 1 4 0v3" /></Base>
  ),
};

export type IconName = keyof typeof Icon;
