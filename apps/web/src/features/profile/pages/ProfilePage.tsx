import { PageContainer } from '#/components/layout/page-container';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { useNavUser } from '#/hooks/use-nav-user';

export default function ProfilePage() {
  const { userName, userEmail } = useNavUser();

  return (
    <PageContainer>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profilim</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kişisel bilgilerinizi buradan görüntüleyip güncelleyebilirsiniz.
          </p>
        </div>

        {/* Avatar card */}
        <div className="bg-card border rounded-2xl p-6 flex items-center gap-5">
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
          <div>
            <p className="font-semibold text-lg">{userName}</p>
            <p className="text-muted-foreground text-sm">{userEmail}</p>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-card border rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-base">Kişisel Bilgiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField icon={<User className="w-4 h-4" />} label="Ad Soyad" value={userName} />
            <InfoField icon={<Mail className="w-4 h-4" />} label="E-posta" value={userEmail} />
            <InfoField icon={<Phone className="w-4 h-4" />} label="Telefon" value="—" />
            <InfoField icon={<MapPin className="w-4 h-4" />} label="Şehir" value="—" />
          </div>
        </div>

        {/* TODO: Backend hazır olduğunda form ve kaydet butonu eklenecek */}
        <p className="text-xs text-muted-foreground">
          ✏️ Profil düzenleme özelliği yakında aktif olacak.
        </p>
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
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
