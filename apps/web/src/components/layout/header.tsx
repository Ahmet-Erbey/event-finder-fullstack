import React from 'react';
import { Link } from '@tanstack/react-router';
import { CalendarDays } from 'lucide-react';
import { ProfileDropdown } from '#/components/profile-dropdown';
import { cn } from '#/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({ className, fixed, children, ...props }: HeaderProps) => {
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
        'bg-background flex h-16 items-center gap-3 px-6 sm:gap-4 border-b border-border/40',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit]',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className,
      )}
      {...props}
    >
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-primary/10 text-primary p-1.5 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <CalendarDays className="w-5 h-5" />
        </div>
        <span className="font-bold text-lg tracking-tight">EventFinder</span>
      </Link>

      {/* Center Nav / Space */}
      <div className="flex-1 flex justify-center items-center gap-6 text-sm font-medium">
        <Link to="/events" className="text-foreground hover:text-primary transition-colors">
          Tüm Etkinlikler
        </Link>
        <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
          Kategoriler
        </Link>
        <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
          Şehirler
        </Link>
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
