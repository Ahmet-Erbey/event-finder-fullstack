import { PageContainer } from '#/components/layout/page-container';
import { Bell, Lock, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-violet-50/70 via-background to-cyan-50/60 p-4 shadow-sm sm:p-6 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-cyan-950/15">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-700/15" />
        <div className="relative space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="bg-gradient-to-r from-violet-700 to-cyan-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl dark:from-violet-300 dark:to-cyan-300">
            Ayarlar
          </h1>
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
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          ⚙️ Ayarlar düzenleme özelliği yakında aktif olacak.
        </p>
        </div>
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
    <div className="bg-card/95 border border-violet-200/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-md backdrop-blur-sm dark:border-violet-900/30">
      <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SettingRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg py-3 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="h-5 w-10 rounded-full bg-gradient-to-r from-violet-200 to-indigo-200 dark:from-violet-900 dark:to-indigo-900" aria-hidden="true" />
    </div>
  );
}
