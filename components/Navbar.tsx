'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { User, Bell, MapPin, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventTimers, formatTimeRemaining } from '@/app/features/event-timers';
import { UserButton } from '@/app/features/auth';
import { NotificationDropdown } from '@/app/features/notifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Session } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  session?: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const { activeEvents } = useEventTimers();

  // Filter and deduplicate events - recalculates when activeEvents changes (every second for timer updates)
  const { uniqueActiveEvents, uniqueUpcomingEvents, activeEventCount, upcomingEventCount, totalEventCount } = useMemo(() => {
    // Filter only currently active events (not upcoming)
    const currentlyActiveEvents = activeEvents?.filter(e => e.status === 'active') || [];

    // Filter upcoming events
    const currentlyUpcomingEvents = activeEvents?.filter(e => e.status === 'upcoming') || [];

    // Deduplicate events by name + map (some events have multiple time slots)
    const uniqueActive = currentlyActiveEvents.reduce((acc, curr) => {
      const key = `${curr.event.name}-${curr.event.map}`;
      if (!acc.find(e => `${e.event.name}-${e.event.map}` === key)) {
        acc.push(curr);
      }
      return acc;
    }, [] as typeof currentlyActiveEvents);

    const uniqueUpcoming = currentlyUpcomingEvents.reduce((acc, curr) => {
      const key = `${curr.event.name}-${curr.event.map}`;
      if (!acc.find(e => `${e.event.name}-${e.event.map}` === key)) {
        acc.push(curr);
      }
      return acc;
    }, [] as typeof currentlyUpcomingEvents);

    return {
      uniqueActiveEvents: uniqueActive,
      uniqueUpcomingEvents: uniqueUpcoming,
      activeEventCount: uniqueActive.length,
      upcomingEventCount: uniqueUpcoming.length,
      totalEventCount: uniqueActive.length + uniqueUpcoming.length,
    };
  }, [activeEvents]);

  // Get user initials for avatar fallback
  const getUserInitials = (user: Session['user']) => {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
      <nav className="fixed top-0 left-0 right-0 h-14 bg-background-elevated border-b border-border z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section - Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Saif</span>
            </div>
          </Link>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Notifications (Blog Comments) */}
            <NotificationDropdown />

            {/* Active Events */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors outline-none">
                <Bell className="w-4 h-4" />
                <span className="hidden lg:inline">{totalEventCount} حدث</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 max-h-[500px] overflow-y-auto">
                <div className="p-3 border-b border-border flex items-center justify-between sticky top-0 bg-popover z-10">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">الأحداث</span>
                  <Link href="/events" className="text-xs text-primary hover:underline">
                    عرض الكل
                  </Link>
                </div>

                {/* Active Events Section */}
                {activeEventCount > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-xs font-semibold text-green-500 uppercase flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      نشطة الآن ({activeEventCount})
                    </div>
                    <div className="space-y-1 mt-1">
                      {uniqueActiveEvents.slice(0, 3).map((activeEvent, index) => (
                        <DropdownMenuItem key={`active-${activeEvent.event.name}-${index}`} asChild>
                          <Link
                            href="/events"
                            className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-white/5 transition-colors"
                          >
                            {/* Event Icon */}
                            <div className="relative flex-shrink-0">
                              {activeEvent.event.icon ? (
                                <img
                                  src={activeEvent.event.icon}
                                  alt={activeEvent.event.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                  <Zap className="w-5 h-5 text-primary" />
                                </div>
                              )}
                              {/* Status indicator */}
                              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background bg-green-500" />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{activeEvent.event.name}</p>
                              <div className="flex items-center gap-1 text-xs text-primary mt-0.5">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{activeEvent.event.map}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>ينتهي في {formatTimeRemaining(activeEvent.timeUntilChange)}</span>
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Events Section */}
                {upcomingEventCount > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-xs font-semibold text-blue-500 uppercase flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      قادمة ({upcomingEventCount})
                    </div>
                    <div className="space-y-1 mt-1">
                      {uniqueUpcomingEvents.slice(0, 3).map((upcomingEvent, index) => (
                        <DropdownMenuItem key={`upcoming-${upcomingEvent.event.name}-${index}`} asChild>
                          <Link
                            href="/events"
                            className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-white/5 transition-colors"
                          >
                            {/* Event Icon */}
                            <div className="relative flex-shrink-0">
                              {upcomingEvent.event.icon ? (
                                <img
                                  src={upcomingEvent.event.icon}
                                  alt={upcomingEvent.event.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                  <Zap className="w-5 h-5 text-primary" />
                                </div>
                              )}
                              {/* Status indicator */}
                              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background bg-blue-500" />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{upcomingEvent.event.name}</p>
                              <div className="flex items-center gap-1 text-xs text-primary mt-0.5">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{upcomingEvent.event.map}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>يبدأ في {formatTimeRemaining(upcomingEvent.timeUntilChange)}</span>
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Events */}
                {activeEventCount === 0 && upcomingEventCount === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    لا توجد أحداث حاليًا
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors outline-none">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage
                      src={(session.user as any).image || undefined}
                      alt={session.user.name || 'User'}
                    />
                    <AvatarFallback className="text-xs font-bold bg-gradient-orange text-primary-foreground">
                      {getUserInitials(session.user)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{session.user.name || session.user.email}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full text-right cursor-pointer justify-end">
                      ملفي الشخصي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/listings" className="w-full text-right cursor-pointer justify-end">
                      قوائمي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/trades" className="w-full text-right cursor-pointer justify-end">
                      صفقاتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/chat" className="w-full text-right cursor-pointer justify-end">
                      الرسائل
                    </Link>
                  </DropdownMenuItem>
                  {(session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="w-full text-right cursor-pointer justify-end text-primary font-semibold">
                          لوحة التحكم
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <UserButton user={session.user} />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">تسجيل الدخول</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
  );
}
