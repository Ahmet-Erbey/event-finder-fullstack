/**
 * Event mock verilerini DB'ye aktarır.
 * Çalıştırma (şema packages/database içinde):
 *   cd apps/api && npx prisma db seed --schema ../../packages/database/schema.prisma
 * veya: bun run db:seed
 *
 * package.json `prisma.seed`: `bun prisma/seed.ts` — monorepo ESM + TypeScript ile uyumlu.
 * (Düz `ts-node prisma/seed.ts` bu projede `"type":"module"` nedeniyle ek tsconfig olmadan çalışmaz.)
 */
/// <reference types="node" />
import prisma from '@onlyjs/db';
import { EventType } from '@onlyjs/db/enums';

type MockType = 'concert' | 'theater' | 'festival' | 'sports' | 'exhibition' | 'comedy';

const TYPE_MAP: Record<MockType, EventType> = {
  concert: EventType.CONCERT,
  theater: EventType.THEATER,
  festival: EventType.FESTIVAL,
  sports: EventType.SPORTS,
  exhibition: EventType.EXHIBITION,
  comedy: EventType.COMEDY,
};

/** Frontend mock-events.ts ile aynı 30 kayıt (tags hariç). */
const MOCK_EVENTS: Array<{
  title: string;
  type: MockType;
  city: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  imageUrl: string;
  price?: number;
  isFree?: boolean;
}> = [
  {
    title: 'Sertab Erener Konseri',
    type: 'concert',
    city: 'İstanbul',
    date: '2026-04-15',
    time: '21:00',
    venue: 'Volkswagen Arena',
    description:
      "Sertab Erener, en sevilen şarkılarını Volkswagen Arena'da, İstanbul seyircisiyle buluşturuyor. Unutulmaz bir gece sizi bekliyor.",
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    price: 2250,
  },
  {
    title: 'Hamlet — Devlet Tiyatrosu',
    type: 'theater',
    city: 'İstanbul',
    date: '2026-04-20',
    time: '19:30',
    venue: 'Atatürk Kültür Merkezi',
    description:
      "Shakespeare'in ölümsüz eseri Hamlet, Devlet Tiyatrosu'nun güçlü kadrosuyla yeniden sahnede. Modern bir yorumla klasik bir trajedi.",
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    price: 1000,
  },
  {
    title: 'İstanbul Jazz Festivali',
    type: 'festival',
    city: 'İstanbul',
    date: '2026-05-10',
    time: '18:00',
    venue: 'Harbiye Açıkhava',
    description:
      'Her yıl binlerce jazz severle buluşan İstanbul Jazz Festivali bu yıl uluslararası sanatçılarla kapılarını açıyor.',
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    price: 1750,
  },
  {
    title: 'Çağdaş Sanat Sergisi — ARTIM',
    type: 'exhibition',
    city: 'İstanbul',
    date: '2026-04-05',
    time: '10:00',
    venue: 'Istanbul Modern',
    description:
      "ARTIM kolektifinden 15 sanatçının eserlerini barındıran bu sergi, çağdaş Türk sanatının nabzını tutmaya devam ediyor.",
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    isFree: true,
  },
  {
    title: 'Fenerbahçe - Galatasaray Derbisi',
    type: 'sports',
    city: 'İstanbul',
    date: '2026-04-27',
    time: '20:00',
    venue: 'Ülker Stadyumu',
    description:
      "Türk futbolunun en büyük buluşması. Ülker Stadyumu'nda unutulmaz derbi eşliğinde heyecan doruğa çıkıyor.",
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    price: 3000,
  },
  {
    title: 'Cem Yılmaz — Solo Stand-up',
    type: 'comedy',
    city: 'İstanbul',
    date: '2026-05-03',
    time: '21:00',
    venue: 'Zorlu PSM',
    description:
      "Türkiye'nin en sevilen komedyeni Cem Yılmaz, tamamen yeni materyaliyle sahnede. Gülerek ağlayacağınız bir gece!",
    imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
    price: 3750,
  },
  {
    title: 'Ankara Senfoni Orkestrası Gala',
    type: 'concert',
    city: 'Ankara',
    date: '2026-04-18',
    time: '20:00',
    venue: 'Ankara CSO Konser Salonu',
    description:
      "Cumhurbaşkanlığı Senfoni Orkestrası, Beethoven'ın 9. Senfonisi ile müzik tutkunlarını buluşturuyor.",
    imageUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800',
    price: 1500,
  },
  {
    title: 'Anadolu Medeniyetleri Özel Gece Turu',
    type: 'exhibition',
    city: 'Ankara',
    date: '2026-04-12',
    time: '19:00',
    venue: 'Anadolu Medeniyetleri Müzesi',
    description:
      "Müzenin kapıları özel olarak açılıyor. Rehberli gece turunda Hitit, Friğ ve Roma dönemlerine ışık tutuluyor.",
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
    price: 750,
  },
  {
    title: "Tarkan Ankara'da",
    type: 'concert',
    city: 'Ankara',
    date: '2026-05-20',
    time: '21:30',
    venue: 'Congresium Ankara',
    description:
      "Pop müziğin efsane ismi Tarkan, Başkent'te muhteşem bir gece vaat ediyor. Onlarca hit şarkı, nefes kesici sahne gösterisi.",
    imageUrl: 'https://images.unsplash.com/photo-1567619741277-d35ba8d3b662?w=800',
    price: 2750,
  },
  {
    title: 'Ankara Tiyatro Festivali',
    type: 'festival',
    city: 'Ankara',
    date: '2026-04-25',
    time: '17:00',
    venue: 'Ankara Devlet Tiyatrosu',
    description:
      '10 günlük festival boyunca yerli ve yabancı toplulukların oyunlarını izleyebilir, atölyelerine katılabilirsiniz.',
    imageUrl: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?w=800',
    price: 500,
  },
  {
    title: 'İzmir International Music Festival',
    type: 'festival',
    city: 'İzmir',
    date: '2026-06-05',
    time: '18:00',
    venue: 'Atatürk Kültür Parkı',
    description:
      'Dünyaca ünlü sanatçıların yer aldığı İzmir Uluslararası Müzik Festivali, şehrin en büyük yaz etkinliğine dönüştü.',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    price: 1250,
  },
  {
    title: 'Eskiçağ İzmir Fotoğraf Sergisi',
    type: 'exhibition',
    city: 'İzmir',
    date: '2026-04-08',
    time: '09:00',
    venue: 'İzmir Arkeoloji Müzesi',
    description:
      "Smyrna'dan İzmir'e uzanan tarihin fotoğraf kareleriyle anlatıldığı bu sergi, şehrin köklü geçmişini yansıtıyor.",
    imageUrl: 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=800',
    isFree: true,
  },
  {
    title: 'İzmir Büyükşehir Konseri',
    type: 'concert',
    city: 'İzmir',
    date: '2026-05-01',
    time: '20:00',
    venue: 'Konak Meydanı',
    description:
      "İşçi Bayramı'na özel İzmir Büyükşehir Belediyesi'nin düzenlediği ücretsiz açıkhava konseri.",
    imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800',
    isFree: true,
  },
  {
    title: 'Altay - Altınordu Maçı',
    type: 'sports',
    city: 'İzmir',
    date: '2026-04-30',
    time: '19:00',
    venue: 'Alsancak Mustafa Denizli Stadyumu',
    description: "İzmir derbisi Alsancak'ta! Ege'nin gururu iki takım birbirlerine rakip oluyor.",
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800',
    price: 900,
  },
  {
    title: 'Bursa Uludağ Müzik Festivali',
    type: 'festival',
    city: 'Bursa',
    date: '2026-07-10',
    time: '16:00',
    venue: 'Uludağ Etkinlik Alanı',
    description:
      "Uludağ'ın eteklerinde müzik festivali! Doğa ve müziği birleştiren eşsiz bir deneyim yaşayın.",
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    price: 1500,
  },
  {
    title: 'Bursa Devlet Tiyatrosu: Kral Lear',
    type: 'theater',
    city: 'Bursa',
    date: '2026-04-22',
    time: '19:30',
    venue: 'Bursa Devlet Tiyatrosu',
    description:
      "Shakespeare'in güçlü trajedisi Kral Lear, Bursa Devlet Tiyatrosu'nun deneyimli kadrosuyla sahneleniyor.",
    imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800',
    price: 600,
  },
  {
    title: 'Antalya Film Forum',
    type: 'exhibition',
    city: 'Antalya',
    date: '2026-09-20',
    time: '10:00',
    venue: 'Antalya Kültür Merkezi',
    description:
      "Türkiye'nin en prestijli film festivali, endüstri profesyonellerini Antalya'da buluşturuyor.",
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    price: 1000,
  },
  {
    title: 'Duman Konseri — Antalya',
    type: 'concert',
    city: 'Antalya',
    date: '2026-05-17',
    time: '21:00',
    venue: 'Mark Antalya',
    description:
      "Türk rock'ının efsanesi Duman, Antalya'ya geliyor. En iyi şarkıları ile müzik severleri bekliyor.",
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    price: 2000,
  },
  {
    title: 'Akdeniz Spor Oyunları',
    type: 'sports',
    city: 'Antalya',
    date: '2026-06-15',
    time: '09:00',
    venue: 'Antalya Spor Kompleksi',
    description:
      'Akdeniz ülkelerinin yarıştığı atletizm, yüzme ve diğer branşlarda heyecan verici müsabakalar.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    price: 400,
  },
  {
    title: 'Trabzonspor — Beşiktaş',
    type: 'sports',
    city: 'Trabzon',
    date: '2026-05-04',
    time: '20:45',
    venue: 'Papara Park',
    description:
      "Trabzon'un gururu Trabzonspor, Beşiktaş'ı ağırlıyor. Karadeniz fırtınası sahada!",
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    price: 1500,
  },
  {
    title: 'Karadeniz Halk Müziği Gecesi',
    type: 'concert',
    city: 'Trabzon',
    date: '2026-04-14',
    time: '19:00',
    venue: 'Trabzon Kültür Merkezi',
    description:
      "Karadeniz'in kendine özgü kemençe ve horon kültürünü yaşatacak büyük bir halk müziği gecesi.",
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    price: 750,
  },
  {
    title: 'Şeb-i Arus Törenleri',
    type: 'festival',
    city: 'Konya',
    date: '2026-12-17',
    time: '20:00',
    venue: 'Mevlânâ Kültür Merkezi',
    description:
      "Hz. Mevlânâ'nın vefatının yıl dönümünde düzenlenen Şeb-i Arus törenleri, dünyanın dört bir yanından ziyaretçi çekiyor.",
    imageUrl: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800',
    isFree: true,
  },
  {
    title: 'Konya Gastronomi Festivali',
    type: 'festival',
    city: 'Konya',
    date: '2026-05-25',
    time: '11:00',
    venue: 'Konya Fuar Alanı',
    description:
      'Türk ve dünya mutfağından lezzetlerin buluştuğu yemek festivali. Atölye çalışmaları ve canlı müzik eşliğinde.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    price: 250,
  },
  {
    title: 'Mersin Uluslararası Müzik Festivali',
    type: 'festival',
    city: 'Mersin',
    date: '2026-06-20',
    time: '19:00',
    venue: 'Mersin Açıkhava Tiyatrosu',
    description:
      'Akdeniz sahilinde uluslararası müzisyenlerle dolu bir festival. Klasik ve çağdaş müziğin buluşma noktası.',
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
    price: 1100,
  },
  {
    title: 'Gaziantep Stand-Up Gecesi',
    type: 'comedy',
    city: 'Gaziantep',
    date: '2026-04-19',
    time: '21:00',
    venue: 'Rixos Hotel Gaziantep',
    description:
      "Türkiye'nin önde gelen stand-up sanatçıları Gaziantep'te bir araya geliyor. Gülmekten karnınız ağrıyacak!",
    imageUrl: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
    price: 1400,
  },
  {
    title: 'Zeugma Mozaik Müzesi Gece Turu',
    type: 'exhibition',
    city: 'Gaziantep',
    date: '2026-04-10',
    time: '20:00',
    venue: 'Zeugma Mozaik Müzesi',
    description:
      'Dünyanın en büyük mozaik müzesi özel gece turlarına açılıyor. Rehber eşliğinde tarihin derinliklerine inin.',
    imageUrl: 'https://images.unsplash.com/photo-1569872255200-1fc4bafcc65c?w=800',
    price: 500,
  },
  {
    title: 'Sıla Konseri — Adana',
    type: 'concert',
    city: 'Adana',
    date: '2026-05-30',
    time: '21:00',
    venue: 'Adana Büyükşehir Belediyesi Amfi',
    description:
      "Pop müziğin güçlü sesi Sıla, Adana'da müzik severlerle buluşuyor. Açıkhava konser şöleni.",
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
    price: 1900,
  },
  {
    title: 'Adana Tiyatro Festivali',
    type: 'festival',
    city: 'Adana',
    date: '2026-05-12',
    time: '18:00',
    venue: 'Adana Sabancı Kültür Merkezi',
    description:
      "5 günlük tiyatro festivali boyunca Türkiye'nin en iyi sahneden sanat toplulukları perdelerini açıyor.",
    imageUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800',
    price: 450,
  },
  {
    title: 'Manga Konseri',
    type: 'concert',
    city: 'İstanbul',
    date: '2026-05-09',
    time: '21:30',
    venue: 'Hayal Kahvesi',
    description:
      "Türk rock'ına yeni soluk katan Manga, Hayal Kahvesi sahnesinde akustik bir gece sunuyor.",
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
    price: 1750,
  },
  {
    title: 'İstanbul Maratonu 2026',
    type: 'sports',
    city: 'İstanbul',
    date: '2026-11-01',
    time: '08:00',
    venue: 'Asya ve Avrupa yakası arası',
    description:
      'Dünyanın iki kıtaya yayılan tek maratonu! İstanbul Boğazı üzerinden koşarak tarihi bir deneyim yaşayın.',
    imageUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800',
    price: 600,
  },
];

function toRow(m: (typeof MOCK_EVENTS)[number]) {
  const isFree = m.isFree === true;
  const price = isFree ? null : (m.price ?? null);
  return {
    title: m.title,
    type: TYPE_MAP[m.type],
    city: m.city,
    date: new Date(m.date),
    time: m.time,
    venue: m.venue,
    description: m.description,
    imageUrl: m.imageUrl,
    price,
    isFree,
  };
}

async function main() {
  const data = MOCK_EVENTS.map(toRow);

  if (data.length !== 30) {
    throw new Error(`Beklenen 30 etkinlik, tanımlı: ${data.length}`);
  }

  await prisma.event.deleteMany({});

  const { count } = await prisma.event.createMany({ data });
  console.log(`✅ ${count} etkinlik createMany ile eklendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
