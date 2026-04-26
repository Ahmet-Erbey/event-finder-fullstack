import React from 'react';
import { Link } from '@tanstack/react-router';
import { CalendarDays } from 'lucide-react';
import { ProfileDropdown } from '#/components/profile-dropdown';
import { canAccessAdminPanel } from '#/features/admin/permission';
import { useSession } from '#/hooks/use-session';
import { cn } from '#/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({ className, fixed, children, ...props }: HeaderProps) => {
  const { session } = useSession();
  const showAdmin = canAccessAdminPanel(session);
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-violet-200/50 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:gap-4 sm:px-6 dark:from-violet-950/25 dark:via-background dark:to-indigo-950/25 dark:border-violet-900/40',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit]',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className,
      )}
      {...props}
    >
      {/* Brand / Logo */}
      <Link
        to="/"
        className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary/10"
        activeProps={{ className: 'bg-primary/15 text-primary' }}
      >
        <div className="rounded-lg bg-primary/10 p-1.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <CalendarDays className="w-5 h-5" />
        </div>
        <span className="font-bold text-lg tracking-tight transition-colors group-hover:text-primary">
          EventFinder
        </span>
      </Link>

      {/* Center Nav / Space */}
      <div className="flex-1 flex justify-center items-center gap-6 text-sm font-medium">
        <Link
          to="/events"
          className="rounded-md px-3 py-1.5 text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          activeProps={{ className: 'bg-primary/15 text-primary' }}
        >
          Tüm Etkinlikler
        </Link>
        {showAdmin && (
          <Link
            to="/admin"
            className="rounded-md px-3 py-1.5 text-foreground transition-colors hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400"
            activeProps={{ className: 'bg-violet-500/15 text-violet-600 dark:text-violet-300' }}
          >
            Yönetim
          </Link>
        )}
      </div>

      {/* Right side - User profile */}
      <div className="flex items-center gap-4">
        {children}
        <ProfileDropdown />
      </div>
    </header>
  );
};

Header.displayName = 'Header';
