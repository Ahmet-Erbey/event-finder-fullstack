import { Link } from '@tanstack/react-router';
import {
  CalendarDays,
  CircleHelp,
  Compass,
  Mail,
  MapPin,
  Music2,
  Phone,
  Popcorn,
  Sparkles,
  Ticket,
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-center px-4 sm:px-6">
          <Link to="/sign-up" className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
              <CalendarDays className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Event Finder</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-3 py-5 sm:px-6 sm:py-6">
        <section className="relative overflow-hidden rounded-2xl border border-border/40">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=80"
              alt="Event background"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          </div>

          <div className="relative grid min-h-[540px] items-center px-4 py-6 sm:min-h-[620px] sm:px-8 lg:min-h-[700px] lg:px-10">
            <div className="ml-auto w-full max-w-[420px] rounded-xl bg-background/95 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
              {children}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-8 px-4 py-8 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          <div>
            <p className="font-semibold text-foreground">Event Finder</p>
            <div className="mt-2 space-y-2">
              <p className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Türkiye'de konser, tiyatro ve spor etkinliklerini kesfet.
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                81 ilde etkinlik kesfi.
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground">Quick Links</p>
            <div className="mt-2 space-y-2">
              <p className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Home
              </p>
              <p className="flex items-center gap-2">
                <CircleHelp className="h-4 w-4 text-primary" />
                About Us
              </p>
              <p className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                Browse Events
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground">Event Categories</p>
            <div className="mt-2 space-y-2">
              <p className="flex items-center gap-2">
                <Music2 className="h-4 w-4 text-primary" />
                Music & Concerts
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Food Festivals
              </p>
              <p className="flex items-center gap-2">
                <Popcorn className="h-4 w-4 text-primary" />
                Comedy & Theater
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground">Contact & Support</p>
            <div className="mt-2 space-y-2">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +90 850 000 00 00
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                info@eventfinderapp.com
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40">
          <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:px-6">
            <p>© 2026 Event Finder. Tum haklari saklidir.</p>
            <p>Gizlilik Politikasi • Kullanim Sartlari • Destek</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
