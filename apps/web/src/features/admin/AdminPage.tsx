import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card';
import { Checkbox } from '#/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '#/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table';
import { Textarea } from '#/components/ui/textarea';
import { SESSION_QUERY_KEY, useAuth } from '#/context/auth-context';
import { EVENT_TYPE_LABELS, type EventType } from '#/features/events/types';
import { useSession } from '#/hooks/use-session';
import { cn } from '#/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LayoutDashboard, ListMusic, Loader2, LogOut, Menu, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  type EventCreateBody,
  type EventDetailBody,
  createEvent,
  deleteEvent,
  getEventById,
  listEventsIndex,
  postLogout,
  updateEvent,
} from './api';
import { canCreateEvent, canDeleteEvent, canUpdateEvent } from './permission';

const EVENT_FORM_TYPES: EventType[] = [
  'concert',
  'festival',
  'theater',
  'sports',
  'exhibition',
  'comedy',
];

const emptyForm = (): EventCreateBody => ({
  title: '',
  description: '',
  type: 'concert',
  city: '',
  venue: '',
  date: '',
  time: '20:00',
  imageUrl: '',
  price: 0,
  isFree: false,
});

const detailToForm = (d: EventDetailBody): EventCreateBody => ({
  title: d.title,
  description: d.description,
  type: d.type as EventType,
  city: d.city,
  venue: d.venue,
  date: d.date,
  time: d.time,
  imageUrl: d.imageUrl,
  price: d.price ?? 0,
  isFree: d.isFree,
});

type NavKey = 'dashboard' | 'events' | 'create';

const QUERY_ADMIN_EVENTS = ['admin', 'events'] as const;

function formatListDate(ymd: string) {
  try {
    return format(parseISO(ymd), 'd MMM yyyy', { locale: tr });
  } catch {
    return ymd;
  }
}

function priceLabel(isFree: boolean, price: number | null) {
  if (isFree) return 'Ücretsiz';
  if (price == null) return '—';
  return `₺${price}`;
}

export default function AdminPage() {
  const { user } = useAuth();
  const { session } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nav, setNav] = useState<NavKey>('dashboard');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [createForm, setCreateForm] = useState<EventCreateBody>(() => emptyForm());

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EventCreateBody>(() => emptyForm());

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const canCreate = canCreateEvent(session);
  const canUpdate = canUpdateEvent(session);
  const canDelete = canDeleteEvent(session);

  const summaryQuery = useQuery({
    queryKey: [...QUERY_ADMIN_EVENTS, 'summary', perPage],
    queryFn: () => listEventsIndex({ page: 1, perPage }),
  });

  const listQuery = useQuery({
    queryKey: [...QUERY_ADMIN_EVENTS, 'list', page, perPage],
    queryFn: () => listEventsIndex({ page, perPage }),
    enabled: nav === 'events',
  });

  const detailQuery = useQuery({
    queryKey: ['admin', 'event', editingId],
    queryFn: () => getEventById(editingId!),
    enabled: editOpen && editingId != null,
  });

  useEffect(() => {
    if (!detailQuery.data) return;
    setEditForm(detailToForm(detailQuery.data));
  }, [detailQuery.data]);

  const invalidateEvents = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [...QUERY_ADMIN_EVENTS] });
  }, [queryClient]);

  const createMut = useMutation({
    mutationFn: (b: EventCreateBody) => createEvent(b),
    onSuccess: () => {
      toast.success('Etkinlik oluşturuldu');
      invalidateEvents();
      setCreateForm(emptyForm());
      setNav('events');
      setPage(1);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<EventCreateBody> }) => updateEvent(id, body),
    onSuccess: () => {
      toast.success('Etkinlik güncellendi');
      invalidateEvents();
      setEditOpen(false);
      setEditingId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      toast.success('Etkinlik silindi');
      invalidateEvents();
      setDeleteId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const logoutMut = useMutation({
    mutationFn: postLogout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...SESSION_QUERY_KEY] });
      void navigate({ to: '/sign-in', replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openEdit = (id: string) => {
    setEditingId(id);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.date) {
      toast.error('Başlık ve tarih zorunludur');
      return;
    }
    const price =
      createForm.isFree || createForm.price == null
        ? null
        : Math.max(0, Math.round(Number(createForm.price)));
    createMut.mutate({
      ...createForm,
      price: createForm.isFree ? null : price,
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!editForm.title.trim() || !editForm.date) {
      toast.error('Başlık ve tarih zorunludur');
      return;
    }
    const price =
      editForm.isFree || editForm.price == null ? null : Math.max(0, Math.round(Number(editForm.price)));
    updateMut.mutate({
      id: editingId,
      body: {
        title: editForm.title,
        description: editForm.description,
        type: editForm.type,
        city: editForm.city,
        venue: editForm.venue,
        date: editForm.date,
        time: editForm.time,
        imageUrl: editForm.imageUrl,
        price: editForm.isFree ? null : price,
        isFree: editForm.isFree,
      },
    });
  };

  const NavButton = ({
    k,
    label,
    icon: Icon,
  }: {
    k: NavKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Button
      type="button"
      variant={nav === k ? 'secondary' : 'ghost'}
      className={cn('w-full justify-start gap-2', nav === k && 'bg-violet-100/80 dark:bg-violet-950/50')}
      onClick={() => {
        setNav(k);
        setMobileMenuOpen(false);
      }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Button>
  );

  const sidebar = (
    <div className="flex flex-col gap-1 p-2">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Yönetim</p>
      <NavButton k="dashboard" label="Dashboard" icon={LayoutDashboard} />
      <NavButton k="events" label="Etkinlikler" icon={ListMusic} />
      <NavButton k="create" label="Etkinlik oluştur" icon={Plus} />
    </div>
  );

  const displayName = user?.name?.trim() || user?.email || 'Kullanıcı';

  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full max-w-[1600px] flex-col gap-0 md:flex-row">
      <aside className="hidden w-64 shrink-0 border-r border-violet-200/50 bg-violet-50/40 dark:border-violet-900/30 dark:bg-violet-950/20 md:block">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-violet-200/50 bg-white/80 px-4 py-3 backdrop-blur dark:border-violet-900/40 dark:bg-background/80">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Menüyü aç">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="border-b p-4 text-left">
                  <SheetTitle>Admin</SheetTitle>
                </SheetHeader>
                {sidebar}
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium text-muted-foreground">Panel</span>
          </div>

          <h1 className="hidden text-lg font-semibold tracking-tight md:block">
            {nav === 'dashboard' && 'Özet'}
            {nav === 'events' && 'Etkinlik listesi'}
            {nav === 'create' && 'Yeni etkinlik'}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="max-w-[180px] truncate text-sm text-muted-foreground" title={displayName}>
              {displayName}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={logoutMut.isPending}
              onClick={() => logoutMut.mutate()}
            >
              {logoutMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span className="ml-1 hidden sm:inline">Çıkış</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-4 md:p-6">
          {nav === 'dashboard' && (
            <div className="space-y-4">
              {summaryQuery.isError && (
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Veri yüklenemedi</CardTitle>
                    <CardDescription>
                      {(summaryQuery.error as Error)?.message ?? 'Bir hata oluştu.'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-violet-200/60 dark:border-violet-900/40">
                  <CardHeader className="pb-2">
                    <CardDescription>Toplam etkinlik</CardDescription>
                    <CardTitle className="text-3xl tabular-nums">
                      {summaryQuery.isLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                      ) : (
                        (summaryQuery.data?.meta.total ?? '—')
                      )}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Sayfa başı (liste)</CardDescription>
                    <CardTitle className="text-2xl tabular-nums">{perPage}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Toplam sayfa (sayfalama)</CardDescription>
                    <CardTitle className="text-2xl tabular-nums">
                      {summaryQuery.isLoading ? '…' : (summaryQuery.data?.meta.pageCount ?? '—')}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground">
                Etkinlikleri yönetmek için sol menüden <strong>Etkinlikler</strong> veya{' '}
                <strong>Etkinlik oluştur</strong> bölümüne geçin.
              </p>
            </div>
          )}

          {nav === 'events' && (
            <div className="space-y-4">
              {listQuery.isError && (
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Liste alınamadı</CardTitle>
                    <CardDescription>
                      {(listQuery.error as Error)?.message ?? 'Bir hata oluştu.'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Etkinlikler</CardTitle>
                  <CardDescription>Cookie oturumu ile sunucudan yüklenir (GET /events)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-0 md:p-6">
                  {listQuery.isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Şehir</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead>Tür</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(listQuery.data?.data.length ?? 0) === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground">
                                Kayıt yok
                              </TableCell>
                            </TableRow>
                          )}
                          {listQuery.data?.data.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="max-w-[200px] font-medium">
                                <span className="line-clamp-2">{row.title}</span>
                              </TableCell>
                              <TableCell>{row.city}</TableCell>
                              <TableCell className="whitespace-nowrap">{formatListDate(row.date)}</TableCell>
                              <TableCell>{priceLabel(row.isFree, row.price)}</TableCell>
                              <TableCell>
                                <span
                                  className={cn(
                                    'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
                                    'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
                                  )}
                                >
                                  {EVENT_TYPE_LABELS[(row.type as EventType) ?? 'other']}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="inline-flex flex-wrap justify-end gap-1">
                                  {canUpdate && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openEdit(row.id)}
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                      Düzenle
                                    </Button>
                                  )}
                                  {canDelete && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        setDeleteId(row.id);
                                        setDeleteTitle(row.title);
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      Sil
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {listQuery.data && listQuery.data.meta.pageCount > 1 && (
                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
                      <span className="text-muted-foreground">
                        Sayfa {listQuery.data.meta.page} / {listQuery.data.meta.pageCount} — Toplam{' '}
                        {listQuery.data.meta.total}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={page <= 1 || listQuery.isFetching}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          Önceki
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={page >= listQuery.data.meta.pageCount || listQuery.isFetching}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Sonraki
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {nav === 'create' && !canCreate && (
            <Card>
              <CardHeader>
                <CardTitle>Yetki yok</CardTitle>
                <CardDescription>Etkinlik oluşturmak için `events:create` izni gerekir.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {nav === 'create' && canCreate && (
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Yeni etkinlik</CardTitle>
                <CardDescription>POST /events — tüm alanlar sunucu doğrulamasına tabidir</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCreateSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="c-title">Başlık</Label>
                    <Input
                      id="c-title"
                      value={createForm.title}
                      onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-desc">Açıklama</Label>
                    <Textarea
                      id="c-desc"
                      rows={4}
                      value={createForm.description}
                      onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tür</Label>
                      <Select
                        value={createForm.type}
                        onValueChange={(v) => setCreateForm((f) => ({ ...f, type: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_FORM_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {EVENT_TYPE_LABELS[t]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-city">Şehir</Label>
                      <Input
                        id="c-city"
                        value={createForm.city}
                        onChange={(e) => setCreateForm((f) => ({ ...f, city: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-venue">Mekan</Label>
                    <Input
                      id="c-venue"
                      value={createForm.venue}
                      onChange={(e) => setCreateForm((f) => ({ ...f, venue: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="c-date">Tarih</Label>
                      <Input
                        id="c-date"
                        type="date"
                        value={createForm.date}
                        onChange={(e) => setCreateForm((f) => ({ ...f, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-time">Saat</Label>
                      <Input
                        id="c-time"
                        type="time"
                        value={createForm.time}
                        onChange={(e) => setCreateForm((f) => ({ ...f, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-image">Görsel URL</Label>
                    <Input
                      id="c-image"
                      value={createForm.imageUrl}
                      onChange={(e) => setCreateForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="space-y-2 sm:flex-1">
                      <Label htmlFor="c-price">Fiyat (₺)</Label>
                      <Input
                        id="c-price"
                        type="number"
                        min={0}
                        disabled={createForm.isFree}
                        value={createForm.isFree ? '' : (createForm.price ?? '')}
                        onChange={(e) =>
                          setCreateForm((f) => ({ ...f, price: e.target.value === '' ? 0 : Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2 pb-1">
                      <Checkbox
                        id="c-free"
                        checked={createForm.isFree}
                        onCheckedChange={(c) => setCreateForm((f) => ({ ...f, isFree: Boolean(c) }))}
                      />
                      <Label htmlFor="c-free" className="text-sm font-normal">
                        Ücretsiz
                      </Label>
                    </div>
                  </div>
                  <Button type="submit" disabled={createMut.isPending}>
                    {createMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kaydet
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          if (!o) closeEdit();
        }}
      >
        <DialogContent className="max-h-[min(90vh,800px)] max-w-lg overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Etkinliği düzenle</DialogTitle>
            <DialogDescription>PATCH /events/:id — yanıt yüklenirken formlar doldurulur</DialogDescription>
          </DialogHeader>
          {detailQuery.isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
            </div>
          )}
          {detailQuery.isError && (
            <p className="text-destructive text-sm">{(detailQuery.error as Error).message}</p>
          )}
          {detailQuery.data && (
            <form className="space-y-4" onSubmit={handleUpdateSubmit}>
              <div className="space-y-2">
                <Label htmlFor="e-title">Başlık</Label>
                <Input
                  id="e-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-desc">Açıklama</Label>
                <Textarea
                  id="e-desc"
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tür</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(v) => setEditForm((f) => ({ ...f, type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_FORM_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {EVENT_TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-city">Şehir</Label>
                  <Input
                    id="e-city"
                    value={editForm.city}
                    onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-venue">Mekan</Label>
                <Input
                  id="e-venue"
                  value={editForm.venue}
                  onChange={(e) => setEditForm((f) => ({ ...f, venue: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="e-date">Tarih</Label>
                  <Input
                    id="e-date"
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-time">Saat</Label>
                  <Input
                    id="e-time"
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-image">Görsel URL</Label>
                <Input
                  id="e-image"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm((f) => ({ ...f, imageUrl: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2 sm:flex-1">
                  <Label htmlFor="e-price">Fiyat (₺)</Label>
                  <Input
                    id="e-price"
                    type="number"
                    min={0}
                    disabled={editForm.isFree}
                    value={editForm.isFree ? '' : (editForm.price ?? '')}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, price: e.target.value === '' ? 0 : Number(e.target.value) }))
                    }
                  />
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <Checkbox
                    id="e-free"
                    checked={editForm.isFree}
                    onCheckedChange={(c) => setEditForm((f) => ({ ...f, isFree: Boolean(c) }))}
                  />
                  <Label htmlFor="e-free" className="text-sm font-normal">
                    Ücretsiz
                  </Label>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="ghost" onClick={closeEdit}>
                  İptal
                </Button>
                <Button type="submit" disabled={updateMut.isPending}>
                  {updateMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kaydet
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etkinliği sil</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">“{deleteTitle}”</span> kalıcı olarak silinecek. Emin
              misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) deleteMut.mutate(deleteId);
              }}
              disabled={deleteMut.isPending}
            >
              {deleteMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
