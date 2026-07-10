import { cn } from "@/lib/utils";

export type IconName = string;

const iconAliases: Record<string, string> = {};

function iconPath(name: string) {
  switch (name) {
    case "home":
      return <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h13v-9.5" /><path d="M9.5 20v-6h5v6" /></>;
    case "bolt":
      return <path d="M13 2 4.5 13h6L9 22l10-13h-6z" />;
    case "inbox":
      return <><path d="M4 4h16l2 10v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5z" /><path d="M2 14h6l2 3h4l2-3h6" /></>;
    case "calendar":
      return <><path d="M7 3v4M17 3v4" /><path d="M4 6h16v15H4z" /><path d="M4 11h16" /></>;
    case "clock":
      return <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>;
    case "phone":
      return <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M10 18h4" /></>;
    case "wallet":
      return <><path d="M4 7h16a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3h13" /><path d="M17 13h5v4h-5a2 2 0 0 1 0-4Z" /></>;
    case "receipt":
      return <><path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1z" /><path d="M9 8h6M9 12h6M9 16h4" /></>;
    case "bank":
      return <><path d="M3 10h18L12 4z" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8" /><path d="M3 20h18" /></>;
    case "trend":
      return <><path d="M4 17 9 12l4 4 7-9" /><path d="M14 7h6v6" /></>;
    case "tag":
      return <><path d="M4 12V4h8l8 8-8 8z" /><circle cx="8" cy="8" r="1.4" /></>;
    case "box":
      return <><path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z" /><path d="m3 8.5 9 5.5 9-5.5" /><path d="M12 14v7" /></>;
    case "salad":
      return <><path d="M5 11h14a7 7 0 0 1-14 0Z" /><path d="M8 9c0-3 2-5 5-5 0 3-2 5-5 5Z" /><path d="M14 9c1-2 3-3 5-2-1 2-3 3-5 2Z" /></>;
    case "utensils":
      return <><path d="M7 3v8M5 3v8M9 3v8M5 11h4v10" /><path d="M17 3v18" /><path d="M14 3h6v8a3 3 0 0 1-3 3h-3z" /></>;
    case "pot":
      return <><path d="M5 10h14v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" /><path d="M3 10h18" /><path d="M8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4" /></>;
    case "cart":
      return <><path d="M3 4h2l2.4 11h10.4L20 7H6" /><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /></>;
    case "smile":
      return <><circle cx="12" cy="12" r="9" /><path d="M8 10h.01M16 10h.01" /><path d="M8 15c2 2 6 2 8 0" /></>;
    case "rocket":
      return <><path d="M5 19c2-1 3-2 4-4" /><path d="M9 15 6 12l3-5 8-4 4 4-4 8-5 3z" /><path d="m14 6 4 4" /><circle cx="15" cy="9" r="1.5" /></>;
    case "graduation":
      return <><path d="m3 8 9-4 9 4-9 4z" /><path d="M7 10v5c3 2 7 2 10 0v-5" /><path d="M21 8v6" /></>;
    case "brain":
      return <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3" /><path d="M9 4v16M15 4v16M9 9h6M9 15h6" /></>;
    case "award":
      return <><circle cx="12" cy="8" r="5" /><path d="m9 13-2 8 5-3 5 3-2-8" /></>;
    case "book":
      return <><path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4z" /><path d="M5 4v16" /><path d="M9 8h6M9 12h6" /></>;
    case "briefcase":
      return <><path d="M9 6V4h6v2" /><path d="M4 7h16v12H4z" /><path d="M4 12h16" /></>;
    case "checkCircle":
      return <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>;
    case "target":
      return <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>;
    case "pen":
      return <><path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>;
    case "bulb":
      return <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z" /></>;
    case "scale":
      return <><path d="M12 3v18M5 7h14" /><path d="m6 7-3 6h6zM18 7l-3 6h6z" /></>;
    case "sunrise":
      return <><path d="M4 18h16" /><path d="M7 15a5 5 0 0 1 10 0" /><path d="M12 3v7M4 10l2 2M20 10l-2 2" /></>;
    case "search":
      return <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>;
    case "users":
      return <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8" /><path d="M16 3.2a4 4 0 0 1 0 7.6" /></>;
    case "handshake":
      return <><path d="M8 12 5 9l4-4 3 3" /><path d="m16 12 3-3-4-4-3 3" /><path d="M8 12l4 4 4-4" /><path d="m10 14 2-2 2 2" /></>;
    case "plane":
      return <><path d="M3 11 21 3l-8 18-2-7z" /><path d="M3 11h8l2 10" /></>;
    case "document":
      return <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></>;
    case "refresh":
      return <><path d="M20 12a8 8 0 0 1-14 5" /><path d="M4 17h5v-5" /><path d="M4 12a8 8 0 0 1 14-5" /><path d="M20 7h-5v5" /></>;
    case "bot":
      return <><rect x="5" y="8" width="14" height="10" rx="3" /><path d="M12 4v4" /><path d="M9 13h.01M15 13h.01" /><path d="M9 17h6" /></>;
    case "bell":
      return <><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 3h16z" /><path d="M10 21h4" /></>;
    case "chart":
      return <><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="11" width="3" height="6" rx="1" /><rect x="12" y="7" width="3" height="10" rx="1" /><rect x="17" y="13" width="3" height="4" rx="1" /></>;
    case "settings":
      return <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a8 8 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 5h-4l-.4 3a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1c.5.4 1.1.7 1.7 1l.4 3h4l.4-3c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.5z" /></>;
    case "shield":
      return <><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m8 12 2.5 2.5L16 9" /></>;
    case "user":
      return <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>;
    case "puzzle":
      return <><path d="M9 3h6v5h3a3 3 0 1 1 0 6h-3v7H9v-4a3 3 0 1 1 0-6V3z" /></>;
    case "flask":
      return <><path d="M9 3h6" /><path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M8 16h8" /></>;
    case "clipboard":
      return <><path d="M9 4h6l1 2h3v15H5V6h3z" /><path d="M9 11h6M9 15h6" /></>;
    case "database":
      return <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>;
    case "lock":
      return <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>;
    case "expense":
      return <><path d="M6 7h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z" /><path d="M8 7V5h8v2" /><path d="M8 14h8" /></>;
    case "coins":
      return <><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v6c0 1.7 2.7 3 6 3s6-1.3 6-3V7" /><path d="M9 16c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" /><path d="M15 10c3.3 0 6-1.3 6-3s-2.7-3-6-3" /></>;
    case "droplet":
      return <path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z" />;
    case "flame":
      return <path d="M12 22a7 7 0 0 0 7-7c0-4-3-7-5-9 0 3-2 4-4 6-2 2-3 4-2 6 1 3 4 4 4 4Z" />;
    case "protein":
      return <><path d="M7 14a5 5 0 0 1 8-6l2 2a5 5 0 0 1-6 8z" /><path d="M5 19 19 5" /></>;
    case "run":
      return <><circle cx="13" cy="4" r="2" /><path d="M12 7 9 12l4 2 3 7" /><path d="M9 12 5 10" /><path d="M13 14l-4 7" /><path d="M14 8l4 3" /></>;
    case "flag":
      return <><path d="M5 21V4" /><path d="M5 4h12l-2 4 2 4H5" /></>;
    case "compass":
      return <><circle cx="12" cy="12" r="9" /><path d="m15 9-2 5-5 2 2-5z" /></>;
    case "pin":
      return <><path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></>;
    case "offline":
      return <><path d="M2 8a15 15 0 0 1 20 0" /><path d="M5 11a10 10 0 0 1 14 0" /><path d="M8 14a5 5 0 0 1 8 0" /><path d="m3 3 18 18" /></>;
    case "menu":
      return <><path d="M4 7h16M4 12h16M4 17h16" /></>;
    case "close":
      return <><path d="M6 6l12 12M18 6 6 18" /></>;
    case "logout":
      return <><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" /><path d="M15 8l4 4-4 4" /><path d="M19 12H9" /></>;
    case "check":
      return <path d="m5 12 4 4L19 6" />;
    case "empty":
      return <><circle cx="12" cy="12" r="9" /><path d="M8 8l8 8" /></>;
    default:
      return <><path d="M12 3 14.5 9 21 12l-6.5 3L12 21l-2.5-6L3 12l6.5-3z" /></>;
  }
}

export function AppIcon({ name, className, title }: { name?: IconName | null; className?: string; title?: string }) {
  const normalized = name ? (iconAliases[name] ?? name) : "sparkle";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {iconPath(normalized)}
    </svg>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-teal-600 via-sky-600 to-cyan-600 text-white shadow-brand", className)}>
      <svg viewBox="0 0 48 48" className="h-[72%] w-[72%]" fill="none" aria-hidden>
        <path d="M24 6 38.5 14.2v19.6L24 42 9.5 33.8V14.2L24 6Z" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.78)" strokeWidth="2.4" />
        <path d="M16 25.4 21.3 30.7 33 18.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 14h18" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
