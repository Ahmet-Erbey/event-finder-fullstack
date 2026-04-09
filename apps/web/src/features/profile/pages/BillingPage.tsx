import { PageContainer } from '#/components/layout/page-container';
import { CreditCard, Receipt, Zap } from 'lucide-react';

export default function BillingPage() {
  return (
    <PageContainer>
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-violet-50/70 via-background to-blue-50/70 p-4 shadow-sm sm:p-6 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-blue-950/20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-700/20" />
        <div className="relative space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl dark:from-violet-300 dark:to-indigo-300">
            Faturalama
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Abonelik planınızı ve ödeme geçmişinizi buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Current plan */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-xl sm:p-7">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium text-violet-100">Mevcut Plan</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">Ücretsiz</p>
          <p className="text-violet-200 text-sm mt-1">Temel özellikler dahil</p>
        </div>

        {/* Payment method placeholder */}
        <div className="bg-card/95 border border-violet-200/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-md backdrop-blur-sm dark:border-violet-900/30">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Ödeme Yöntemi
          </h2>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed text-muted-foreground text-sm">
            Henüz kayıtlı bir ödeme yöntemi yok.
          </div>
        </div>

        {/* Invoices placeholder */}
        <div className="bg-card/95 border border-indigo-200/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-md backdrop-blur-sm dark:border-indigo-900/30">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Fatura Geçmişi
          </h2>
          <p className="text-sm text-muted-foreground">Henüz bir fatura bulunmuyor.</p>
        </div>

        {/* TODO: Backend hazır olduğunda gerçek fatura verileri bağlanacak */}
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          💳 Faturalama özelliği yakında aktif olacak.
        </p>
        </div>
      </div>
    </PageContainer>
  );
}
