import { PageContainer } from '#/components/layout/page-container';
import { CreditCard, Receipt, Zap } from 'lucide-react';

export default function BillingPage() {
  return (
    <PageContainer>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faturalama</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Abonelik planınızı ve ödeme geçmişinizi buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Current plan */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium text-violet-100">Mevcut Plan</span>
          </div>
          <p className="text-2xl font-bold">Ücretsiz</p>
          <p className="text-violet-200 text-sm mt-1">Temel özellikler dahil</p>
        </div>

        {/* Payment method placeholder */}
        <div className="bg-card border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Ödeme Yöntemi
          </h2>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed text-muted-foreground text-sm">
            Henüz kayıtlı bir ödeme yöntemi yok.
          </div>
        </div>

        {/* Invoices placeholder */}
        <div className="bg-card border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Fatura Geçmişi
          </h2>
          <p className="text-sm text-muted-foreground">Henüz bir fatura bulunmuyor.</p>
        </div>

        {/* TODO: Backend hazır olduğunda gerçek fatura verileri bağlanacak */}
        <p className="text-xs text-muted-foreground">
          💳 Faturalama özelliği yakında aktif olacak.
        </p>
      </div>
    </PageContainer>
  );
}
