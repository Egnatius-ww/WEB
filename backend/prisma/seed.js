'use strict';

// Идемпотентный сид: промокод из ТЗ (SAVE10), админ, демо-покупатель и товары каталога.

const bcrypt = require('bcryptjs');
const prisma = require('../src/db/prisma');
const env = require('../src/config/env');

// 6 товаров существующего фронтенда (scripts/products.js) + 9 новых.
// Для слайдера карточки у каждого минимум 3 изображения.
const U = [
  'https://images.unsplash.com/photo-1673297821205-e0575bbc2ab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1704167674713-649193461719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1718117075248-3d3c3cd65264?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1764025390519-1ccc15d719a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1761358270922-5a4df4ab9782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1707236527163-bd3478178466?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const PRODUCTS = [
  {
    title: 'Exterior Paint Set',
    price: 45.99,
    rating: 3.5,
    stockQuantity: 120,
    images: [U[0], U[3], U[2]],
    description:
      'Professional-grade exterior paint set designed to withstand harsh weather conditions. This premium paint offers excellent coverage, durability, and color retention. Perfect for residential and commercial exterior surfaces.',
  },
  {
    title: 'Plywood Sheets',
    price: 52.99,
    rating: 4.5,
    stockQuantity: 85,
    images: [U[1], U[3], U[0]],
    description:
      'Versatile construction-grade plywood sheets suitable for a wide range of applications. These sheets are engineered for strength and dimensional stability, perfect for subfloors, roofing, walls, and general construction.',
  },
  {
    title: 'Premium Cement Bags',
    price: 24.99,
    rating: 5,
    stockQuantity: 300,
    images: [U[2], U[4], U[1]],
    description:
      'High-quality Portland cement bags designed for heavy-duty construction projects. Our premium cement offers exceptional strength, durability, and workability. Ideal for foundations, structural work, and general concrete applications.',
  },
  {
    title: 'Premium Lumber Planks',
    price: 89.99,
    rating: 4.5,
    stockQuantity: 64,
    images: [U[3], U[1], U[5]],
    description:
      'Premium kiln-dried lumber planks perfect for all your woodworking and construction needs. These high-grade wooden planks are carefully selected for strength and appearance. Suitable for framing, decking, furniture making.',
  },
  {
    title: 'Red Clay Bricks',
    price: 0.89,
    rating: 4,
    stockQuantity: 5000,
    images: [U[4], U[2], U[3]],
    description:
      'Traditional red clay bricks manufactured to the highest standards. These durable bricks are perfect for walls, patios, pathways, and architectural features. Fire-hardened for exceptional strength and weather resistance.',
  },
  {
    title: 'Steel I-Beams',
    price: 349.99,
    rating: 5,
    stockQuantity: 25,
    images: [U[5], U[1], U[2]],
    description:
      'Heavy-duty structural steel I-beams engineered for maximum load-bearing capacity. These professional-grade beams are essential for large construction projects, building frames, and structural support applications.',
  },
  {
    title: 'Cordless Drill Set',
    price: 129.99,
    rating: 4.8,
    stockQuantity: 40,
    images: [U[0], U[5], U[3]],
    description:
      '20V cordless drill driver set with two-speed transmission, LED work light, and 2.0Ah battery pack. Includes charger, bit set, and carrying case — everything for assembly, drilling and fastening tasks on site.',
  },
  {
    title: 'Safety Helmet',
    price: 24.5,
    rating: 4.2,
    stockQuantity: 150,
    images: [U[2], U[4], U[1]],
    description:
      'ANSI-certified hard hat with adjustable 6-point suspension and impact-resistant HDPE shell. Ventilated design keeps you cool; slots accept ear muffs and face shields for full PPE compatibility.',
  },
  {
    title: 'Work Gloves',
    price: 12.99,
    rating: 4.0,
    stockQuantity: 260,
    images: [U[4], U[0], U[2]],
    description:
      'Heavy-duty work gloves with reinforced synthetic leather palm, spandex back, and touch-screen compatible fingertips. Excellent grip and abrasion protection for material handling and tool work.',
  },
  {
    title: 'Screwdriver Kit',
    price: 34.99,
    rating: 4.6,
    stockQuantity: 95,
    images: [U[1], U[3], U[5]],
    description:
      '12-piece precision screwdriver set with magnetic chrome-vanadium steel tips: Phillips, flathead, Torx and hex. Ergonomic non-slip handles and a compact storage case for organized transport.',
  },
  {
    title: 'PVC Pipe Bundle',
    price: 18.75,
    rating: 3.9,
    stockQuantity: 210,
    images: [U[3], U[2], U[0]],
    description:
      '10-foot Schedule 40 PVC pipe bundle for plumbing, irrigation and drainage. Smooth interior walls ensure high flow; solvent-weld joints provide leak-proof connections rated up to 450 PSI.',
  },
  {
    title: 'Insulation Roll',
    price: 44.0,
    rating: 4.1,
    stockQuantity: 70,
    images: [U[5], U[4], U[1]],
    description:
      'R-13 fiberglass insulation roll for walls and attics. 50 sq ft coverage with kraft-paper vapor barrier facing; cuts easily with a utility knife and friction-fits between standard studs.',
  },
  {
    title: 'Tile Adhesive',
    price: 15.49,
    rating: 4.4,
    stockQuantity: 180,
    images: [U[2], U[0], U[4]],
    description:
      'Premium polymer-modified thinset mortar for ceramic, porcelain and natural stone tile. Strong bond for interior and exterior applications; 50 lb bag covers up to 95 sq ft with a 1/4 inch notch trowel.',
  },
  {
    title: 'Circular Saw',
    price: 159.99,
    rating: 4.7,
    stockQuantity: 30,
    images: [U[1], U[5], U[3]],
    description:
      '15-amp 7-1/4 inch circular saw with 5,800 RPM motor, magnesium shoe and bevel capacity up to 56 degrees. Electric brake stops the blade fast; includes 24T carbide-tipped blade.',
  },
  {
    title: 'Extension Ladder',
    price: 219.0,
    rating: 4.3,
    stockQuantity: 18,
    images: [U[4], U[3], U[2]],
    description:
      '24-foot aluminum extension ladder with 300 lb duty rating. D-rung rungs are slip-resistant, rope-and-pulley fly section extends smoothly, and swivel safety feet level on uneven ground.',
  },
];

async function main() {
  await prisma.promoCode.upsert({
    where: { code: 'SAVE10' },
    update: { discountPercentage: 10, isActive: true },
    create: { code: 'SAVE10', discountPercentage: 10, isActive: true },
  });

  const adminHash = await bcrypt.hash(env.adminPassword, 10);
  await prisma.user.upsert({
    where: { email: env.adminEmail },
    update: { role: 'ADMIN', passwordHash: adminHash },
    create: { email: env.adminEmail, passwordHash: adminHash, role: 'ADMIN' },
  });

  const customerHash = await bcrypt.hash('customer12345', 10);
  await prisma.user.upsert({
    where: { email: 'customer@buildmart.local' },
    update: { passwordHash: customerHash },
    create: { email: 'customer@buildmart.local', passwordHash: customerHash, role: 'CUSTOMER' },
  });

  // Товары добавляем только в пустой каталог — сид можно безопасно запускать повторно
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({ data: PRODUCTS });
    console.log(`Seed: created ${PRODUCTS.length} products`);
  } else {
    console.log(`Seed: products already exist (${productCount}), skipping`);
  }

  console.log('Seed: promo code SAVE10, admin and demo customer are ready');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
