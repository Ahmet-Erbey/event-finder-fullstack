import { PageContainer } from '#/components/layout/page-container';
import { Users, Plus, Mail } from 'lucide-react';

export default function NewTeamPage() {
  return (
    <PageContainer>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yeni Ekip</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Bir ekip oluşturun ve üyelerinizi davet edin.
          </p>
        </div>

        {/* Team name */}
        <div className="bg-card border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            Ekip Bilgileri
          </h2>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="team-name">
                Ekip Adı
              </label>
              <div
                id="team-name"
                className="h-10 w-full rounded-lg border bg-muted/30 px-3 flex items-center text-sm text-muted-foreground"
              >
                Ekip adı girin…
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="team-desc">
                Açıklama
              </label>
              <div
                id="team-desc"
                className="h-20 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
              >
                Ekibin amacını kısaca açıklayın…
              </div>
            </div>
          </div>
        </div>

        {/* Invite members */}
        <div className="bg-card border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Üye Davet Et
          </h2>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed text-muted-foreground text-sm">
            <Plus className="w-4 h-4" />
            E-posta adresi ile üye ekleyin
          </div>
        </div>

        {/* TODO: Backend hazır olduğunda form submit ve API bağlantısı eklenecek */}
        <p className="text-xs text-muted-foreground">
          👥 Ekip oluşturma özelliği yakında aktif olacak.
        </p>
      </div>
    </PageContainer>
  );
}
