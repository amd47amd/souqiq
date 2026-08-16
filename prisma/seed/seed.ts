/**
 * SouqIQ Phase 2 — Database Seeder
 * Populates: Super Admin, 18 governorates, 4 categories, 100 products
 * (with + without variants), images, options, and SKUs.
 *
 * Run: npm run db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const ADMIN = {
  name: "Super Admin",
  phone: "07501234567",
  password: "Admin@123456",
};

const GOVERNORATES: { name: string; shippingFee: number; sortOrder: number }[] =
  [
    { name: "Baghdad", shippingFee: 5000, sortOrder: 1 },
    { name: "Basra", shippingFee: 7000, sortOrder: 2 },
    { name: "Nineveh", shippingFee: 8000, sortOrder: 3 },
    { name: "Erbil", shippingFee: 6000, sortOrder: 4 },
    { name: "Sulaymaniyah", shippingFee: 6500, sortOrder: 5 },
    { name: "Duhok", shippingFee: 7000, sortOrder: 6 },
    { name: "Kirkuk", shippingFee: 6500, sortOrder: 7 },
    { name: "Najaf", shippingFee: 5500, sortOrder: 8 },
    { name: "Karbala", shippingFee: 5500, sortOrder: 9 },
    { name: "Babil", shippingFee: 5500, sortOrder: 10 },
    { name: "Wasit", shippingFee: 6000, sortOrder: 11 },
    { name: "Diyala", shippingFee: 6000, sortOrder: 12 },
    { name: "Anbar", shippingFee: 7500, sortOrder: 13 },
    { name: "Maysan", shippingFee: 7000, sortOrder: 14 },
    { name: "Dhi Qar", shippingFee: 7000, sortOrder: 15 },
    { name: "Muthanna", shippingFee: 7500, sortOrder: 16 },
    { name: "Qadisiyyah", shippingFee: 6500, sortOrder: 17 },
    { name: "Saladin", shippingFee: 6500, sortOrder: 18 },
  ];

const CATEGORIES = [
  {
    name: "Clothing",
    slug: "clothing",
    description: "Premium apparel for men and women.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    sortOrder: 1,
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Phones, audio, wearables, and smart devices.",
    imageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    sortOrder: 2,
  },
  {
    name: "Home Appliances",
    slug: "home-appliances",
    description: "Kitchen and living essentials for modern homes.",
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
    sortOrder: 3,
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    description: "Signature fragrances for every occasion.",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    sortOrder: 4,
  },
] as const;

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number;
  categorySlug: (typeof CATEGORIES)[number]["slug"];
  isFeatured?: boolean;
  isTrending?: boolean;
  hasVariants: boolean;
  images: string[];
  /** Used when hasVariants is false */
  stock?: number;
  /** Used when hasVariants is true */
  sizes?: string[];
  colors?: string[];
};

function unsplash(id: string, w = 800) {
  return `https://images.unsplash.com/${id}?w=${w}&q=80`;
}

const CLOTHING: SeedProduct[] = [
  {
    name: "Classic Cotton Tee",
    slug: "classic-cotton-tee",
    description:
      "Soft combed cotton t-shirt with a clean crew neck and everyday fit.",
    basePrice: 18000,
    compareAtPrice: 22000,
    categorySlug: "clothing",
    isFeatured: true,
    isTrending: true,
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    images: [
      unsplash("photo-1521572163474-6864f9cf17ab"),
      unsplash("photo-1583743814966-8936f5b7be1a"),
    ],
  },
  {
    name: "Slim Fit Oxford Shirt",
    slug: "slim-fit-oxford-shirt",
    description: "Breathable oxford cloth shirt tailored for a modern slim cut.",
    basePrice: 35000,
    categorySlug: "clothing",
    isFeatured: true,
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sky Blue", "White"],
    images: [unsplash("photo-1596755094514-f87e34085b2c")],
  },
  {
    name: "Relaxed Linen Shirt",
    slug: "relaxed-linen-shirt",
    description: "Lightweight linen shirt ideal for warm Iraqi summers.",
    basePrice: 42000,
    categorySlug: "clothing",
    isTrending: true,
    hasVariants: true,
    sizes: ["M", "L", "XL"],
    colors: ["Beige", "Olive"],
    images: [unsplash("photo-1602810318383-e386cc2a3ccf")],
  },
  {
    name: "Essential Hoodie",
    slug: "essential-hoodie",
    description: "Fleece-lined hoodie with kangaroo pocket and soft cuffs.",
    basePrice: 45000,
    compareAtPrice: 52000,
    categorySlug: "clothing",
    isFeatured: true,
    hasVariants: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Grey", "Forest"],
    images: [unsplash("photo-1556821840-3a63f95609a7")],
  },
  {
    name: "Zip-Up Track Jacket",
    slug: "zip-up-track-jacket",
    description: "Athletic track jacket with contrast piping and full zip.",
    basePrice: 48000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    images: [unsplash("photo-1591047139829-d91aecb6caea")],
  },
  {
    name: "Chino Trousers",
    slug: "chino-trousers",
    description: "Versatile stretch chinos with a tapered silhouette.",
    basePrice: 38000,
    categorySlug: "clothing",
    isTrending: true,
    hasVariants: true,
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Black"],
    images: [unsplash("photo-1473966968600-fa801b869a1a")],
  },
  {
    name: "Denim Straight Jeans",
    slug: "denim-straight-jeans",
    description: "Classic straight-leg jeans in mid-wash indigo denim.",
    basePrice: 52000,
    categorySlug: "clothing",
    isFeatured: true,
    hasVariants: true,
    sizes: ["30", "32", "34", "36"],
    colors: ["Indigo", "Black"],
    images: [unsplash("photo-1542272454315-4c01d7abdf4a")],
  },
  {
    name: "Cargo Utility Pants",
    slug: "cargo-utility-pants",
    description: "Durable cargo pants with multiple pockets and drawcord hem.",
    basePrice: 44000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive", "Sand"],
    images: [unsplash("photo-1624378439575-d8705ad7ae80")],
  },
  {
    name: "Wool Blend Overcoat",
    slug: "wool-blend-overcoat",
    description: "Elegant mid-length overcoat with notch lapels.",
    basePrice: 125000,
    compareAtPrice: 145000,
    categorySlug: "clothing",
    isFeatured: true,
    hasVariants: true,
    sizes: ["M", "L", "XL"],
    colors: ["Camel", "Charcoal"],
    images: [unsplash("photo-1539533018447-63fcce2678e3")],
  },
  {
    name: "Quilted Puffer Jacket",
    slug: "quilted-puffer-jacket",
    description: "Warm quilted puffer with water-repellent finish.",
    basePrice: 89000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    images: [unsplash("photo-1544923246-77307dd628fd")],
  },
  {
    name: "Merino Crew Sweater",
    slug: "merino-crew-sweater",
    description: "Fine-knit merino sweater for layering through cooler nights.",
    basePrice: 55000,
    categorySlug: "clothing",
    isTrending: true,
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy", "Grey", "Navy"],
    images: [unsplash("photo-1576566588028-4147f3842f27")],
  },
  {
    name: "Ribbed Knit Polo",
    slug: "ribbed-knit-polo",
    description: "Textured ribbed polo with a refined collar.",
    basePrice: 32000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Sage"],
    images: [unsplash("photo-1586790170083-2f9ceadc732d")],
  },
  {
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    description: "Flowing pleated midi skirt with elastic waistband.",
    basePrice: 36000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["S", "M", "L"],
    colors: ["Black", "Cream"],
    images: [unsplash("photo-1583496661160-fb5886a0aaaa")],
  },
  {
    name: "Tailored Blazer",
    slug: "tailored-blazer",
    description: "Structured blazer with soft shoulders and single button.",
    basePrice: 95000,
    categorySlug: "clothing",
    isFeatured: true,
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    images: [unsplash("photo-1594938298603-c8148c4dae35")],
  },
  {
    name: "Athletic Joggers",
    slug: "athletic-joggers",
    description: "Tapered performance joggers with zip pockets.",
    basePrice: 34000,
    categorySlug: "clothing",
    isTrending: true,
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey"],
    images: [unsplash("photo-1552902865-b72c031ac5ea")],
  },
  {
    name: "Printed Summer Dress",
    slug: "printed-summer-dress",
    description: "Lightweight printed dress with a flattering A-line cut.",
    basePrice: 48000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["S", "M", "L"],
    colors: ["Floral Blue", "Floral Rose"],
    images: [unsplash("photo-1595777457583-95e059d581b8")],
  },
  {
    name: "Leather Belt",
    slug: "leather-belt",
    description: "Full-grain leather belt with brushed metal buckle.",
    basePrice: 22000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["85", "90", "95", "100"],
    colors: ["Brown", "Black"],
    images: [unsplash("photo-1624222247344-550fb60583fd")],
  },
  {
    name: "Cotton Baseball Cap",
    slug: "cotton-baseball-cap",
    description: "Structured cotton cap with adjustable strap.",
    basePrice: 15000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Beige"],
    images: [unsplash("photo-1588850561407-ed78c282e89b")],
  },
  {
    name: "Ribbed Beanie",
    slug: "ribbed-beanie",
    description: "Soft acrylic ribbed beanie for cooler evenings.",
    basePrice: 12000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["One Size"],
    colors: ["Black", "Camel", "Grey"],
    images: [unsplash("photo-1576871337632-b9aef4c17efa")],
  },
  {
    name: "Everyday Crew Socks (3-Pack)",
    slug: "everyday-crew-socks-3-pack",
    description: "Breathable cotton-blend crew socks, pack of three.",
    basePrice: 9000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["M", "L"],
    colors: ["White", "Black", "Grey Mix"],
    images: [unsplash("photo-1586350977771-b3b0ead17711")],
  },
  {
    name: "Canvas Low Sneakers",
    slug: "canvas-low-sneakers",
    description: "Minimal canvas sneakers with rubber cupsole.",
    basePrice: 42000,
    categorySlug: "clothing",
    isTrending: true,
    hasVariants: true,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["White", "Black"],
    images: [unsplash("photo-1525966222134-fcfa99b8ae77")],
  },
  {
    name: "Suede Desert Boots",
    slug: "suede-desert-boots",
    description: "Classic suede desert boots with crepe sole.",
    basePrice: 78000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Sand", "Brown"],
    images: [unsplash("photo-1638247027574-c6d2d7e7f3f3")],
  },
  {
    name: "Silk Scarf",
    slug: "silk-scarf",
    description: "Lightweight silk scarf with subtle geometric print.",
    basePrice: 28000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["One Size"],
    colors: ["Ivory", "Emerald"],
    images: [unsplash("photo-1601924994987-69e26d50dc26")],
  },
  {
    name: "Performance Training Shorts",
    slug: "performance-training-shorts",
    description: "Quick-dry training shorts with inner brief.",
    basePrice: 25000,
    categorySlug: "clothing",
    hasVariants: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    images: [unsplash("photo-1591195853828-11db59a44f6b")],
  },
  {
    name: "Oversized Graphic Tee",
    slug: "oversized-graphic-tee",
    description: "Relaxed oversized tee with premium screen print.",
    basePrice: 24000,
    categorySlug: "clothing",
    isFeatured: true,
    hasVariants: true,
    sizes: ["M", "L", "XL"],
    colors: ["White", "Black"],
    images: [unsplash("photo-1503342217505-b0a15ec302ed")],
  },
];

const ELECTRONICS: SeedProduct[] = [
  {
    name: "Wireless Noise-Canceling Headphones",
    slug: "wireless-noise-canceling-headphones",
    description:
      "Over-ear Bluetooth headphones with active noise canceling and 30-hour battery.",
    basePrice: 185000,
    compareAtPrice: 210000,
    categorySlug: "electronics",
    isFeatured: true,
    isTrending: true,
    hasVariants: false,
    stock: 40,
    images: [
      unsplash("photo-1505740420928-5e560c06d30e"),
      unsplash("photo-1484704849700-f032a568e944"),
    ],
  },
  {
    name: "True Wireless Earbuds Pro",
    slug: "true-wireless-earbuds-pro",
    description: "Compact earbuds with deep bass and charging case.",
    basePrice: 75000,
    categorySlug: "electronics",
    isTrending: true,
    hasVariants: false,
    stock: 80,
    images: [unsplash("photo-1590658268037-6bf12165a8df")],
  },
  {
    name: "Smartwatch Series X",
    slug: "smartwatch-series-x",
    description: "AMOLED smartwatch with heart-rate, GPS, and 7-day battery.",
    basePrice: 165000,
    categorySlug: "electronics",
    isFeatured: true,
    hasVariants: true,
    sizes: ["40mm", "44mm"],
    colors: ["Black", "Silver"],
    images: [unsplash("photo-1523275335684-37898b6baf30")],
  },
  {
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description: "IPX7 waterproof speaker with rich 360° sound.",
    basePrice: 55000,
    categorySlug: "electronics",
    isTrending: true,
    hasVariants: false,
    stock: 60,
    images: [unsplash("photo-1608043152269-423dbba4e7e1")],
  },
  {
    name: "USB-C GaN Charger 65W",
    slug: "usb-c-gan-charger-65w",
    description: "Compact GaN wall charger for laptop and phone.",
    basePrice: 32000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 120,
    images: [unsplash("photo-1583863788434-e58a36330cf0")],
  },
  {
    name: "Braided USB-C Cable 2m",
    slug: "braided-usb-c-cable-2m",
    description: "Durable braided USB-C to USB-C cable, 100W capable.",
    basePrice: 12000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 200,
    images: [unsplash("photo-1558618666-fcd25c85cd64")],
  },
  {
    name: "Magnetic Wireless Power Bank",
    slug: "magnetic-wireless-power-bank",
    description: "10,000mAh MagSafe-compatible power bank.",
    basePrice: 48000,
    categorySlug: "electronics",
    isFeatured: true,
    hasVariants: false,
    stock: 70,
    images: [unsplash("photo-1609091839311-b95bfd06f0d6")],
  },
  {
    name: "4K Action Camera",
    slug: "4k-action-camera",
    description: "Rugged 4K action camera with waterproof housing.",
    basePrice: 220000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 25,
    images: [unsplash("photo-1526170375885-4d8ecf77b99f")],
  },
  {
    name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    description: "Hot-swappable mechanical keyboard with RGB backlight.",
    basePrice: 95000,
    categorySlug: "electronics",
    isTrending: true,
    hasVariants: false,
    stock: 35,
    images: [unsplash("photo-1511467687858-23d96c32e4ae")],
  },
  {
    name: "Ergonomic Wireless Mouse",
    slug: "ergonomic-wireless-mouse",
    description: "Quiet-click ergonomic mouse with multi-device pairing.",
    basePrice: 28000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 90,
    images: [unsplash("photo-1527864550417-7fd91fc51a46")],
  },
  {
    name: "27-Inch 4K Monitor",
    slug: "27-inch-4k-monitor",
    description: "IPS 4K monitor with thin bezels and HDR10.",
    basePrice: 420000,
    compareAtPrice: 460000,
    categorySlug: "electronics",
    isFeatured: true,
    hasVariants: false,
    stock: 15,
    images: [unsplash("photo-1527443224154-c4a3942d3acf")],
  },
  {
    name: "Webcam Full HD",
    slug: "webcam-full-hd",
    description: "1080p webcam with dual mics and auto light correction.",
    basePrice: 45000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 55,
    images: [unsplash("photo-1587825140708-dfaf72ae4b04")],
  },
  {
    name: "Streaming Microphone",
    slug: "streaming-microphone",
    description: "USB condenser microphone for podcasts and calls.",
    basePrice: 68000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 40,
    images: [unsplash("photo-1590602847861-f357a9332bbc")],
  },
  {
    name: "Wi-Fi 6 Mesh Router",
    slug: "wifi-6-mesh-router",
    description: "Dual-band Wi-Fi 6 router with easy app setup.",
    basePrice: 145000,
    categorySlug: "electronics",
    isFeatured: true,
    hasVariants: false,
    stock: 30,
    images: [unsplash("photo-1606904825846-647eb07f5be2")],
  },
  {
    name: "External SSD 1TB",
    slug: "external-ssd-1tb",
    description: "Portable NVMe SSD, USB 3.2 Gen 2, up to 1050MB/s.",
    basePrice: 125000,
    categorySlug: "electronics",
    isTrending: true,
    hasVariants: false,
    stock: 45,
    images: [unsplash("photo-1597872200969-2b65d56bd16b")],
  },
  {
    name: "Laptop Stand Aluminum",
    slug: "laptop-stand-aluminum",
    description: "Adjustable aluminum stand for laptops up to 17\".",
    basePrice: 35000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 75,
    images: [unsplash("photo-1527864550417-7fd91fc51a46")],
  },
  {
    name: "Smart LED Desk Lamp",
    slug: "smart-led-desk-lamp",
    description: "Dimmable LED desk lamp with USB charging port.",
    basePrice: 38000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 65,
    images: [unsplash("photo-1507473885765-e6ed057f782c")],
  },
  {
    name: "Tablet 10.5\" LTE",
    slug: "tablet-10-5-lte",
    description: "10.5-inch tablet with vivid display and LTE connectivity.",
    basePrice: 380000,
    categorySlug: "electronics",
    isFeatured: true,
    hasVariants: true,
    sizes: ["64GB", "128GB"],
    colors: ["Space Grey", "Silver"],
    images: [unsplash("photo-1544244015-0df4b3ffc6b0")],
  },
  {
    name: "Gaming Controller Wireless",
    slug: "gaming-controller-wireless",
    description: "Low-latency wireless controller with dual vibration.",
    basePrice: 62000,
    categorySlug: "electronics",
    isTrending: true,
    hasVariants: false,
    stock: 50,
    images: [unsplash("photo-1592840496694-26d035b52b48")],
  },
  {
    name: "USB Hub 7-Port",
    slug: "usb-hub-7-port",
    description: "Powered 7-port USB 3.0 hub for desktops.",
    basePrice: 22000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 100,
    images: [unsplash("photo-1625948515291-69613efd103f")],
  },
  {
    name: "Noise Isolating Gaming Headset",
    slug: "noise-isolating-gaming-headset",
    description: "Surround headset with detachable boom mic.",
    basePrice: 72000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 40,
    images: [unsplash("photo-1618366712010-f4ae9c647dcb")],
  },
  {
    name: "Portable Monitor 15.6\"",
    slug: "portable-monitor-15-6",
    description: "USB-C portable Full HD monitor for travel work.",
    basePrice: 195000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 20,
    images: [unsplash("photo-1593642632823-8f785ba67e45")],
  },
  {
    name: "Smart Plug Mini (2-Pack)",
    slug: "smart-plug-mini-2-pack",
    description: "Wi-Fi smart plugs compatible with voice assistants.",
    basePrice: 28000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 110,
    images: [unsplash("photo-1558002038-1055907df827")],
  },
  {
    name: "Dash Cam Dual Channel",
    slug: "dash-cam-dual-channel",
    description: "Front and rear dash cam with night vision and GPS.",
    basePrice: 135000,
    categorySlug: "electronics",
    hasVariants: false,
    stock: 28,
    images: [unsplash("photo-1449965408869-eaa3f722e40d")],
  },
  {
    name: "E-Reader 6\" Paperwhite",
    slug: "e-reader-6-paperwhite",
    description: "Glare-free e-ink reader with adjustable warm light.",
    basePrice: 155000,
    categorySlug: "electronics",
    isFeatured: true,
    hasVariants: false,
    stock: 22,
    images: [unsplash("photo-1544716278-ca5e3f4abd8c")],
  },
];

const HOME: SeedProduct[] = [
  {
    name: "Stainless Steel Kettle 1.7L",
    slug: "stainless-steel-kettle-1-7l",
    description: "Electric kettle with rapid boil and auto shut-off.",
    basePrice: 42000,
    categorySlug: "home-appliances",
    isFeatured: true,
    hasVariants: false,
    stock: 55,
    images: [unsplash("photo-1565489006803-1f6f3f1f1f1f")],
  },
  {
    name: "Programmable Coffee Maker",
    slug: "programmable-coffee-maker",
    description: "12-cup drip coffee maker with timer and keep-warm plate.",
    basePrice: 78000,
    categorySlug: "home-appliances",
    isTrending: true,
    hasVariants: false,
    stock: 35,
    images: [unsplash("photo-1517668808823-f83b8b0a0b0b")],
  },
  {
    name: "High-Speed Blender",
    slug: "high-speed-blender",
    description: "1200W blender for smoothies, soups, and sauces.",
    basePrice: 95000,
    categorySlug: "home-appliances",
    isFeatured: true,
    hasVariants: false,
    stock: 40,
    images: [unsplash("photo-1570222094114-d054a817e56b")],
  },
  {
    name: "Digital Air Fryer 5L",
    slug: "digital-air-fryer-5l",
    description: "Oil-light air fryer with digital presets and crisp finish.",
    basePrice: 110000,
    compareAtPrice: 125000,
    categorySlug: "home-appliances",
    isFeatured: true,
    isTrending: true,
    hasVariants: false,
    stock: 45,
    images: [unsplash("photo-1585515320310-259814833e7f")],
  },
  {
    name: "Robot Vacuum Cleaner",
    slug: "robot-vacuum-cleaner",
    description: "Smart mapping robot vacuum with app scheduling.",
    basePrice: 285000,
    categorySlug: "home-appliances",
    isFeatured: true,
    hasVariants: false,
    stock: 18,
    images: [unsplash("photo-1558317374-067fb5f30001")],
  },
  {
    name: "Cordless Stick Vacuum",
    slug: "cordless-stick-vacuum",
    description: "Lightweight cordless vacuum with HEPA filtration.",
    basePrice: 165000,
    categorySlug: "home-appliances",
    isTrending: true,
    hasVariants: false,
    stock: 30,
    images: [unsplash("photo-1558317374-067fb5f30001")],
  },
  {
    name: "Steam Iron Pro",
    slug: "steam-iron-pro",
    description: "Ceramic soleplate steam iron with anti-calc system.",
    basePrice: 38000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 60,
    images: [unsplash("photo-1582735689369-4fe89db7110c")],
  },
  {
    name: "Garment Steamer",
    slug: "garment-steamer",
    description: "Handheld steamer for quick wrinkle removal.",
    basePrice: 45000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 50,
    images: [unsplash("photo-1610557892470-55d9e80c0bce")],
  },
  {
    name: "Ceramic Tower Heater",
    slug: "ceramic-tower-heater",
    description: "Oscillating ceramic heater with thermostat control.",
    basePrice: 72000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 40,
    images: [unsplash("photo-1545259741-2ea3ebf61fa3")],
  },
  {
    name: "Tower Fan with Remote",
    slug: "tower-fan-with-remote",
    description: "Quiet tower fan with 3 speeds and remote control.",
    basePrice: 58000,
    categorySlug: "home-appliances",
    isTrending: true,
    hasVariants: false,
    stock: 48,
    images: [unsplash("photo-1616046229478-9901c5536a45")],
  },
  {
    name: "Humidifier Ultrasonic",
    slug: "humidifier-ultrasonic",
    description: "Quiet ultrasonic humidifier with night light.",
    basePrice: 52000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 42,
    images: [unsplash("photo-1585771724684-38269d6639fd")],
  },
  {
    name: "Air Purifier HEPA",
    slug: "air-purifier-hepa",
    description: "True HEPA air purifier for rooms up to 40m².",
    basePrice: 175000,
    categorySlug: "home-appliances",
    isFeatured: true,
    hasVariants: false,
    stock: 25,
    images: [unsplash("photo-1585771724684-38269d6639fd")],
  },
  {
    name: "Microwave Oven 25L",
    slug: "microwave-oven-25l",
    description: "25L microwave with grill function and child lock.",
    basePrice: 135000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 22,
    images: [unsplash("photo-1574269909862-7e1d70bb8078")],
  },
  {
    name: "Toaster 2-Slice",
    slug: "toaster-2-slice",
    description: "Stainless 2-slice toaster with browning control.",
    basePrice: 28000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 70,
    images: [unsplash("photo-1505576399279-565b52d4ac71")],
  },
  {
    name: "Electric Rice Cooker 1.8L",
    slug: "electric-rice-cooker-1-8l",
    description: "Non-stick rice cooker with keep-warm mode.",
    basePrice: 48000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 55,
    images: [unsplash("photo-1585515320310-259814833e7f")],
  },
  {
    name: "Slow Cooker 6L",
    slug: "slow-cooker-6l",
    description: "Family-size slow cooker with ceramic pot.",
    basePrice: 65000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 33,
    images: [unsplash("photo-1556910103-1c02745aae4d")],
  },
  {
    name: "Kitchen Scale Digital",
    slug: "kitchen-scale-digital",
    description: "Precision digital scale with tare function.",
    basePrice: 18000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 90,
    images: [unsplash("photo-1594212699903-ec8a3eca50f5")],
  },
  {
    name: "Electric Hand Mixer",
    slug: "electric-hand-mixer",
    description: "5-speed hand mixer with stainless beaters.",
    basePrice: 32000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 60,
    images: [unsplash("photo-1570222094114-d054a817e56b")],
  },
  {
    name: "Sandwich Press Grill",
    slug: "sandwich-press-grill",
    description: "Non-stick sandwich press with floating hinge.",
    basePrice: 35000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 50,
    images: [unsplash("photo-1565299624946-b28f40a0ae38")],
  },
  {
    name: "Water Dispenser Hot & Cold",
    slug: "water-dispenser-hot-cold",
    description: "Freestanding dispenser with child-safe hot tap.",
    basePrice: 145000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 20,
    images: [unsplash("photo-1548839140-29a749e1cf4d")],
  },
  {
    name: "Mini Fridge 50L",
    slug: "mini-fridge-50l",
    description: "Compact fridge ideal for offices and bedrooms.",
    basePrice: 185000,
    categorySlug: "home-appliances",
    isFeatured: true,
    hasVariants: false,
    stock: 15,
    images: [unsplash("photo-1571175443880-49e1d25b2bc5")],
  },
  {
    name: "Electric Blanket Dual Control",
    slug: "electric-blanket-dual-control",
    description: "Queen-size heated blanket with dual zone controls.",
    basePrice: 68000,
    categorySlug: "home-appliances",
    hasVariants: true,
    sizes: ["Queen", "King"],
    colors: ["Grey", "Cream"],
    images: [unsplash("photo-1631049307264-da0ec9d70304")],
  },
  {
    name: "Essential Oil Diffuser",
    slug: "essential-oil-diffuser",
    description: "Ultrasonic aroma diffuser with color ambient light.",
    basePrice: 32000,
    categorySlug: "home-appliances",
    isTrending: true,
    hasVariants: false,
    stock: 70,
    images: [unsplash("photo-1608571423902-eed4a9abdd83")],
  },
  {
    name: "Dish Drying Rack Stainless",
    slug: "dish-drying-rack-stainless",
    description: "Two-tier stainless dish rack with drainboard.",
    basePrice: 26000,
    categorySlug: "home-appliances",
    hasVariants: false,
    stock: 80,
    images: [unsplash("photo-1556911220-bff31c812dba")],
  },
  {
    name: "Induction Cooktop Portable",
    slug: "induction-cooktop-portable",
    description: "Single-burner induction cooktop with digital display.",
    basePrice: 85000,
    categorySlug: "home-appliances",
    isTrending: true,
    hasVariants: false,
    stock: 35,
    images: [unsplash("photo-1556910103-1c02745aae4d")],
  },
];

const PERFUMES: SeedProduct[] = [
  {
    name: "Amber Oud Eau de Parfum 100ml",
    slug: "amber-oud-edp-100ml",
    description: "Warm amber and oud composition with lasting projection.",
    basePrice: 95000,
    compareAtPrice: 110000,
    categorySlug: "perfumes",
    isFeatured: true,
    isTrending: true,
    hasVariants: false,
    stock: 40,
    images: [unsplash("photo-1541643600914-78b084683601")],
  },
  {
    name: "Cedar Wood Intense 75ml",
    slug: "cedar-wood-intense-75ml",
    description: "Woody aromatic scent with cedar, vetiver, and spice.",
    basePrice: 78000,
    categorySlug: "perfumes",
    isFeatured: true,
    hasVariants: false,
    stock: 35,
    images: [unsplash("photo-1594035910387-fea47794261f")],
  },
  {
    name: "Rose Noir Extrait 50ml",
    slug: "rose-noir-extrait-50ml",
    description: "Dark rose extrait with patchouli and soft musk.",
    basePrice: 120000,
    categorySlug: "perfumes",
    isTrending: true,
    hasVariants: false,
    stock: 28,
    images: [unsplash("photo-1587017539504-67cfbddac569")],
  },
  {
    name: "Citrus Fresh Cologne 100ml",
    slug: "citrus-fresh-cologne-100ml",
    description: "Bright bergamot and lemon cologne for daytime wear.",
    basePrice: 45000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 60,
    images: [unsplash("photo-1595425970377-c9703ced46b9")],
  },
  {
    name: "Vanilla Musk Soft 100ml",
    slug: "vanilla-musk-soft-100ml",
    description: "Creamy vanilla softened by clean white musk.",
    basePrice: 68000,
    categorySlug: "perfumes",
    isFeatured: true,
    hasVariants: false,
    stock: 45,
    images: [unsplash("photo-1592945403244-b3fbafd7f539")],
  },
  {
    name: "Saffron Leather 75ml",
    slug: "saffron-leather-75ml",
    description: "Bold saffron and leather oriental fragrance.",
    basePrice: 105000,
    categorySlug: "perfumes",
    isTrending: true,
    hasVariants: false,
    stock: 30,
    images: [unsplash("photo-1523293182086-7651a899d37f")],
  },
  {
    name: "Ocean Breeze 100ml",
    slug: "ocean-breeze-100ml",
    description: "Aquatic fresh scent with marine notes and citrus.",
    basePrice: 52000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 55,
    images: [unsplash("photo-1563170351-be82bc888aa4")],
  },
  {
    name: "Tobacco Vanilla Absolute 50ml",
    slug: "tobacco-vanilla-absolute-50ml",
    description: "Rich tobacco leaf wrapped in sweet vanilla absolute.",
    basePrice: 135000,
    categorySlug: "perfumes",
    isFeatured: true,
    hasVariants: false,
    stock: 22,
    images: [unsplash("photo-1588405748880-12d1d2a59db9")],
  },
  {
    name: "Jasmine Night Bloom 75ml",
    slug: "jasmine-night-bloom-75ml",
    description: "Night-blooming jasmine with soft sandalwood base.",
    basePrice: 88000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 32,
    images: [unsplash("photo-1590736969955-71cc94901144")],
  },
  {
    name: "Green Tea Minimal 100ml",
    slug: "green-tea-minimal-100ml",
    description: "Clean green tea and citrus for everyday freshness.",
    basePrice: 42000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 70,
    images: [unsplash("photo-1547887538-44774d369162")],
  },
  {
    name: "Black Pepper Vetiver 75ml",
    slug: "black-pepper-vetiver-75ml",
    description: "Spicy black pepper over earthy vetiver and oakmoss.",
    basePrice: 82000,
    categorySlug: "perfumes",
    isTrending: true,
    hasVariants: false,
    stock: 36,
    images: [unsplash("photo-1615634260167-c8cdede054de")],
  },
  {
    name: "White Orchid Silk 50ml",
    slug: "white-orchid-silk-50ml",
    description: "Elegant white orchid floral with silky musk dry-down.",
    basePrice: 99000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 27,
    images: [unsplash("photo-1595425970377-c9703ced46b9")],
  },
  {
    name: "Incense Bakhoor Inspired 100ml",
    slug: "incense-bakhoor-inspired-100ml",
    description: "Resinous incense blend inspired by classic bakhoor.",
    basePrice: 72000,
    categorySlug: "perfumes",
    isFeatured: true,
    hasVariants: false,
    stock: 48,
    images: [unsplash("photo-1587017539504-67cfbddac569")],
  },
  {
    name: "Fig & Bergamot 100ml",
    slug: "fig-bergamot-100ml",
    description: "Mediterranean fig leaf brightened with bergamot.",
    basePrice: 76000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 40,
    images: [unsplash("photo-1594035910387-fea47794261f")],
  },
  {
    name: "Cashmere Woods 75ml",
    slug: "cashmere-woods-75ml",
    description: "Soft cashmere woods with amber and tonka.",
    basePrice: 91000,
    categorySlug: "perfumes",
    isTrending: true,
    hasVariants: false,
    stock: 33,
    images: [unsplash("photo-1541643600914-78b084683601")],
  },
  {
    name: "Neroli Sunshine 50ml",
    slug: "neroli-sunshine-50ml",
    description: "Radiant neroli floral-citrus for warm days.",
    basePrice: 85000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 29,
    images: [unsplash("photo-1592945403244-b3fbafd7f539")],
  },
  {
    name: "Musk Pure Travel Set",
    slug: "musk-pure-travel-set",
    description: "Three 15ml pure musk sprays in a travel pouch.",
    basePrice: 55000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 50,
    images: [unsplash("photo-1523293182086-7651a899d37f")],
  },
  {
    name: "Discovery Set (5 x 10ml)",
    slug: "discovery-set-5x10ml",
    description: "Curated discovery set of five bestselling scents.",
    basePrice: 65000,
    categorySlug: "perfumes",
    isFeatured: true,
    hasVariants: false,
    stock: 60,
    images: [
      unsplash("photo-1563170351-be82bc888aa4"),
      unsplash("photo-1541643600914-78b084683601"),
      unsplash("photo-1594035910387-fea47794261f"),
    ],
  },
  {
    name: "Oud Royal Attar 12ml",
    slug: "oud-royal-attar-12ml",
    description: "Concentrated oil-based oud attar in glass roller.",
    basePrice: 58000,
    categorySlug: "perfumes",
    isTrending: true,
    hasVariants: false,
    stock: 55,
    images: [
      unsplash("photo-1588405748880-12d1d2a59db9"),
      unsplash("photo-1595425970377-c9703ced46b9"),
    ],
  },
  {
    name: "Lavender Sleep Mist 100ml",
    slug: "lavender-sleep-mist-100ml",
    description: "Calming lavender pillow and linen mist.",
    basePrice: 28000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 80,
    images: [unsplash("photo-1608571423902-eed4a9abdd83")],
  },
  {
    name: "Santal Blanc 75ml",
    slug: "santal-blanc-75ml",
    description: "Creamy sandalwood with iris and soft woods.",
    basePrice: 112000,
    categorySlug: "perfumes",
    isFeatured: true,
    hasVariants: false,
    stock: 24,
    images: [
      unsplash("photo-1615634260167-c8cdede054de"),
      unsplash("photo-1592945403244-b3fbafd7f539"),
      unsplash("photo-1547887538-44774d369162"),
    ],
  },
  {
    name: "Pomegranate Noir 100ml",
    slug: "pomegranate-noir-100ml",
    description: "Dark pomegranate with spicy oriental accords.",
    basePrice: 98000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 31,
    images: [unsplash("photo-1590736969955-71cc94901144")],
  },
  {
    name: "Mint Vetiver Cologne 100ml",
    slug: "mint-vetiver-cologne-100ml",
    description: "Cool mint lifted by dry vetiver and citrus.",
    basePrice: 48000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 52,
    images: [unsplash("photo-1547887538-44774d369162")],
  },
  {
    name: "Honey Blossom 50ml",
    slug: "honey-blossom-50ml",
    description: "Sweet honeyed florals with a warm amber trail.",
    basePrice: 74000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 38,
    images: [unsplash("photo-1587017539504-67cfbddac569")],
  },
  {
    name: "Midnight Spice Body Mist 200ml",
    slug: "midnight-spice-body-mist-200ml",
    description: "Light body mist with spice and soft woods.",
    basePrice: 22000,
    categorySlug: "perfumes",
    hasVariants: false,
    stock: 90,
    images: [unsplash("photo-1595425970377-c9703ced46b9")],
  },
];

// Fix a few weak/placeholder Unsplash IDs with reliable ones
const IMAGE_FIXES: Record<string, string> = {
  "stainless-steel-kettle-1-7l": unsplash("photo-1565193566173-7a0ee3dbe261"),
  "programmable-coffee-maker": unsplash("photo-1495474472287-4d71bcdd2085"),
  "laptop-stand-aluminum": unsplash("photo-1611532736597-de2d4265fba3"),
};

const ALL_PRODUCTS: SeedProduct[] = [
  ...CLOTHING,
  ...ELECTRONICS,
  ...HOME,
  ...PERFUMES,
].map((p) => {
  const fixed = IMAGE_FIXES[p.slug];
  if (!fixed) return p;
  return { ...p, images: [fixed, ...p.images.slice(1)] };
});

function sku(slug: string, parts: string[] = []) {
  const base = slug.replace(/[^a-z0-9]+/gi, "-").toUpperCase();
  const suffix = parts
    .map((p) => p.replace(/[^a-z0-9]+/gi, "").toUpperCase())
    .filter(Boolean)
    .join("-");
  const raw = suffix ? `${base}-${suffix}` : `${base}-DEFAULT`;
  // Keep SKUs unique and DB-friendly without over-truncating option names.
  return raw.slice(0, 64);
}

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN.password, 12);
  return prisma.user.upsert({
    where: { phone: ADMIN.phone },
    update: {
      name: ADMIN.name,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name: ADMIN.name,
      phone: ADMIN.phone,
      passwordHash,
      role: "ADMIN",
    },
  });
}

async function seedGovernorates() {
  for (const g of GOVERNORATES) {
    await prisma.governorate.upsert({
      where: { name: g.name },
      update: {
        shippingFee: g.shippingFee,
        sortOrder: g.sortOrder,
        isActive: true,
      },
      create: g,
    });
  }
}

async function seedCategories() {
  const map = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder,
        isActive: true,
      },
      create: { ...c },
    });
    map.set(c.slug, row.id);
  }
  return map;
}

async function createSimpleProduct(
  product: SeedProduct,
  categoryId: string,
) {
  const created = await prisma.product.create({
    data: {
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      compareAtPrice: product.compareAtPrice,
      categoryId,
      isFeatured: product.isFeatured ?? false,
      isTrending: product.isTrending ?? false,
      hasVariants: false,
      images: {
        create: product.images.map((url, index) => ({
          url,
          alt: product.name,
          sortOrder: index,
        })),
      },
      variants: {
        create: {
          sku: sku(product.slug),
          price: product.basePrice,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock ?? 50,
          isDefault: true,
          isActive: true,
        },
      },
    },
  });
  return created;
}

async function createVariantProduct(
  product: SeedProduct,
  categoryId: string,
) {
  const sizes = product.sizes ?? ["One Size"];
  const colors = product.colors ?? ["Default"];

  const created = await prisma.product.create({
    data: {
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      compareAtPrice: product.compareAtPrice,
      categoryId,
      isFeatured: product.isFeatured ?? false,
      isTrending: product.isTrending ?? false,
      hasVariants: true,
      images: {
        create: product.images.map((url, index) => ({
          url,
          alt: product.name,
          sortOrder: index,
        })),
      },
      options: {
        create: [
          {
            name: "Size",
            sortOrder: 0,
            values: {
              create: sizes.map((value, sortOrder) => ({ value, sortOrder })),
            },
          },
          {
            name: "Color",
            sortOrder: 1,
            values: {
              create: colors.map((value, sortOrder) => ({ value, sortOrder })),
            },
          },
        ],
      },
    },
    include: {
      options: { include: { values: true } },
    },
  });

  const sizeOption = created.options.find((o) => o.name === "Size")!;
  const colorOption = created.options.find((o) => o.name === "Color")!;

  let isFirst = true;
  for (const size of sizeOption.values) {
    for (const color of colorOption.values) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: created.id,
          sku: sku(product.slug, [size.value, color.value]),
          price: product.basePrice,
          compareAtPrice: product.compareAtPrice,
          stock: 8 + ((size.sortOrder + color.sortOrder) % 12),
          isDefault: isFirst,
          isActive: true,
        },
      });

      await prisma.productVariantOptionValue.createMany({
        data: [
          { variantId: variant.id, optionValueId: size.id },
          { variantId: variant.id, optionValueId: color.id },
        ],
      });

      isFirst = false;
    }
  }

  return created;
}

async function seedProducts(categoryIds: Map<string, string>) {
  // Fresh seed: remove catalog data only (keep admin / governorates upserts)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariantOptionValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productOptionValue.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  let created = 0;
  for (const product of ALL_PRODUCTS) {
    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category: ${product.categorySlug}`);
    }

    if (product.hasVariants) {
      await createVariantProduct(product, categoryId);
    } else {
      await createSimpleProduct(product, categoryId);
    }
    created += 1;
  }
  return created;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  if (ALL_PRODUCTS.length !== 100) {
    throw new Error(
      `Expected 100 products in seed data, found ${ALL_PRODUCTS.length}`,
    );
  }

  console.log("🌱 Seeding SouqIQ…");

  const admin = await seedAdmin();
  console.log(`✓ Admin: ${admin.phone} / ${ADMIN.password}`);

  await seedGovernorates();
  console.log(`✓ Governorates: ${GOVERNORATES.length}`);

  const categoryIds = await seedCategories();
  console.log(`✓ Categories: ${CATEGORIES.length}`);

  const productCount = await seedProducts(categoryIds);
  console.log(`✓ Products: ${productCount}`);

  const [users, governorates, categories, products, variants] =
    await Promise.all([
      prisma.user.count(),
      prisma.governorate.count(),
      prisma.category.count(),
      prisma.product.count(),
      prisma.productVariant.count(),
    ]);

  console.log("\n📊 Database summary");
  console.log({ users, governorates, categories, products, variants });
  console.log("\n✅ Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
