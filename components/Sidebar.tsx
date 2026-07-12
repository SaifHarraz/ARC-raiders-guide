'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Package, Database, Map, Target,
  List, Calendar, MessageCircle, ChevronDown,
  Crosshair, MessageSquare, FileText, Backpack, Newspaper
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
  external?: boolean;
}

const mainItems: SidebarItem[] = [
  { icon: Home, label: 'الرئيسية', href: '/' },
  { icon: Newspaper, label: 'المدونة', href: '/blogs' },
  { icon: FileText, label: 'الأدلة', href: '/guides' },
  { icon: Backpack, label: 'الحمولات', href: '/loadouts' },
  { icon: Package, label: 'السوق', href: '/marketplace' },
  { icon: MessageSquare, label: 'المحادثات', href: '/chat' },
  { icon: List, label: 'قوائمي', href: '/listings' },
];

const databaseItems: SidebarItem[] = [
  {
    icon: Database,
    label: 'قاعدة البيانات',
    children: [
      { label: 'آركس', href: '/arcs' },
      { label: 'العناصر', href: '/items' },
      { label: 'المهام', href: '/quests' },
      { label: 'التجار', href: '/traders' },
    ]
  },
];

const mapItems: SidebarItem[] = [
  {
    icon: Map,
    label: 'الخرائط',
    children: [
      { label: 'السد', href: '/maps/dam-battlegrounds' },
      { label: 'الميناء الفضائي', href: '/maps/the-spaceport' },
      { label: 'المدينة المدفونة', href: '/maps/buried-city' },
      { label: 'البوابة الزرقاء', href: '/maps/blue-gate' },
      { label: 'ستيلا مونتيس', href: '/maps/stella-montis' },
    ]
  },
];

const trackerItems: SidebarItem[] = [
  {
    icon: Crosshair,
    label: 'المتتبعات',
    children: [
      { label: 'متتبع المخططات', href: '/trackers/blueprint' },
      { label: 'مخطط الورشة', href: '/trackers/workshop-planner' },
      { label: 'شجرة المهارات', href: '/skill-tree' },
    ]
  },
];

const otherItems: SidebarItem[] = [
  { icon: Target, label: 'تصنيف الأسلحة', href: '/weapons-tier-list' },
  { icon: Calendar, label: 'مؤقت الأحداث', href: '/events' },
];

const externalItems: SidebarItem[] = [];

const bottomItems: SidebarItem[] = [
  { icon: MessageCircle, label: 'ديسكورد', href: 'https://discord.com/invite/tags', external: true },
];

function SidebarSection({ items, expanded }: { items: SidebarItem[]; expanded: boolean }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isChildActive = (children: { href: string }[]) =>
    children.some(child => pathname === child.href);

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenus.includes(item.label) || (hasChildren && isChildActive(item.children!));
        const active = item.href ? isActive(item.href) : false;
        const labelClasses = expanded
          ? "flex-1 min-w-0 text-right text-base truncate"
          : "hidden";

        if (hasChildren) {
          return (
            <div key={item.label}>
              <button
                onClick={() => toggleMenu(item.label)}
                className={cn(
                  "w-full flex items-center rounded-lg transition-colors h-11 px-3 gap-3 justify-start",
                  "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent",
                  isChildActive(item.children!) && "text-primary"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={labelClasses}>
                  {item.label}
                </span>
                {expanded && (
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isOpen && "rotate-180"
                  )} />
                )}
              </button>

              {expanded && isOpen && (
                <div
                  className="mr-8 mt-1 space-y-1 overflow-hidden transition-[max-height] duration-300 ease-out"
                  style={{ maxHeight: isOpen ? item.children!.length * 44 : 0 }}
                >
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-3 py-1.5 text-sm rounded-lg transition-colors text-right",
                        isActive(child.href)
                          ? "text-primary bg-sidebar-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (item.external) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center rounded-lg transition-colors h-11 px-3 gap-3 justify-start",
                active ? "text-primary bg-sidebar-accent" : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={labelClasses}>{item.label}</span>
            </a>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href!}
            className={cn(
              "flex items-center rounded-lg transition-colors h-11 px-3 gap-3 justify-start",
              active ? "text-primary bg-sidebar-accent" : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className={labelClasses}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={cn(
        "fixed right-0 top-14 bottom-0 bg-sidebar border-l border-sidebar-border z-40",
        "transition-all duration-300 ease-out overflow-hidden",
        expanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="relative flex flex-col h-full min-h-0 py-4">
        {/* Game icon at top */}
        <div className="px-2 mb-4 relative z-20 bg-sidebar">
          <Link
            href="/"
            className={cn(
              "flex w-full items-center rounded-lg h-11 px-2 gap-2 transition-colors justify-start",
              "text-primary hover:bg-sidebar-accent transition-colors"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/20 text-primary shrink-0">
              <span className="text-sm font-bold">Saif</span>
            </div>
            <span
              className={cn(
                "text-base font-medium truncate whitespace-nowrap transition-opacity duration-200 flex-1 min-w-0",
                expanded ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              Saif
            </span>
          </Link>
        </div>
        <div className="mx-3 mb-4 border-b border-sidebar-border relative z-10" />

        {/* Main + secondary sections */}
        <div
          className={cn(
            "px-2 space-y-3 flex-1 min-h-0 pb-6 relative z-10",
            expanded ? "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : "overflow-hidden"
          )}
        >
          <SidebarSection items={mainItems} expanded={expanded} />

          <SidebarSection items={databaseItems} expanded={expanded} />

          <SidebarSection items={mapItems} expanded={expanded} />

          <SidebarSection items={trackerItems} expanded={expanded} />

          <SidebarSection items={otherItems} expanded={expanded} />

          <SidebarSection items={externalItems} expanded={expanded} />
        </div>

        {/* Bottom section - Fixed at bottom */}
        <div className="px-2 pb-4 pt-4 border-t border-sidebar-border bg-sidebar relative z-20">
          <SidebarSection items={bottomItems} expanded={expanded} />
        </div>
      </div>
    </aside>
  );
}
