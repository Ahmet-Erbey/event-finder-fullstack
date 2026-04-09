import { PageContainer } from '#/components/layout/page-container';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { useNavUser } from '#/hooks/use-nav-user';

export default function ProfilePage() {
  const { userName, userEmail } = useNavUser();

  return (
    <PageContainer>
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-violet-50/70 via-background to-indigo-50/70 p-4 shadow-sm sm:p-6 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/20" />
        <div className="relative space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl dark:from-violet-300 dark:to-indigo-300">
            Profilim
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kişisel bilgilerinizi buradan görüntüleyip güncelleyebilirsiniz.
          </p>
        </div>

        {/* Avatar card */}
        <div className="bg-card/95 border border-violet-200/40 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 shadow-md backdrop-blur-sm dark:border-violet-900/30">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold select-none">
              {userName.charAt(0).toUpperCase()}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 transition-colors"
              aria-label="Fotoğraf değiştir"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <p className="font-semibold text-lg">{userName}</p>
            <p className="text-muted-foreground text-sm">{userEmail}</p>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-card/95 border border-indigo-200/40 rounded-2xl p-6 sm:p-7 space-y-5 shadow-md backdrop-blur-sm dark:border-indigo-900/30">
          <h2 className="font-semibold text-base sm:text-lg">Kişisel Bilgiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <InfoField icon={<User className="w-4 h-4" />} label="Ad Soyad" value={userName} />
            <InfoField icon={<Mail className="w-4 h-4" />} label="E-posta" value={userEmail} />
            <InfoField icon={<Phone className="w-4 h-4" />} label="Telefon" value="—" />
            <InfoField icon={<MapPin className="w-4 h-4" />} label="Şehir" value="—" />
          </div>
        </div>

        {/* TODO: Backend hazır olduğunda form ve kaydet butonu eklenecek */}
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          ✏️ Profil düzenleme özelliği yakında aktif olacak.
        </p>
        </div>
      </div>
    </PageContainer>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/40">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
