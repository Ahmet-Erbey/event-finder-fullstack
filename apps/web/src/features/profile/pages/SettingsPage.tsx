import { PageContainer } from '#/components/layout/page-container';
import { Bell, Lock, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Uygulama tercihlerinizi ve hesap güvenliğinizi buradan yönetin.
          </p>
        </div>

        {/* Notification settings */}
        <SettingsSection icon={<Bell className="w-4 h-4" />} title="Bildirimler">
          <SettingRow
            label="E-posta bildirimleri"
            description="Yeni etkinlikler hakkında e-posta al"
          />
          <SettingRow
            label="Tarayıcı bildirimleri"
            description="Anlık bildirimler için izin ver"
          />
        </SettingsSection>

        {/* Security */}
        <SettingsSection icon={<Lock className="w-4 h-4" />} title="Güvenlik">
          <SettingRow label="Şifre değiştir" description="Son değişiklik: bilinmiyor" />
          <SettingRow label="İki faktörlü doğrulama" description="Hesabınızı daha güvenli yapın" />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection icon={<Palette className="w-4 h-4" />} title="Görünüm">
          <SettingRow label="Tema" description="Açık / Koyu mod tercihiniz" />
        </SettingsSection>

        {/* Language */}
        <SettingsSection icon={<Globe className="w-4 h-4" />} title="Dil ve Bölge">
          <SettingRow label="Dil" description="Türkçe" />
        </SettingsSection>

        {/* TODO: Backend hazır olduğunda toggle ve form elemanları eklenecek */}
        <p className="text-xs text-muted-foreground">
          ⚙️ Ayarlar düzenleme özelliği yakında aktif olacak.
        </p>
      </div>
    </PageContainer>
  );
}

function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border rounded-2xl p-6 space-y-4">
      <h2 className="font-semibold text-base flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SettingRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="w-10 h-5 rounded-full bg-muted" aria-hidden="true" />
    </div>
  );
}
