import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Create Admin User
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password,
      role: Role.ADMIN,
      cart: { create: {} },
    },
  });
  console.log('✅ Administrador criado');

  // Create Categories
  const categoriesData = [
    { name: 'Eletrônicos', slug: 'eletronicos' },
    { name: 'Moda', slug: 'moda' },
    { name: 'Livros', slug: 'livros' },
    { name: 'Casa e Decoração', slug: 'casa' },
    { name: 'Esportes', slug: 'esportes' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categorias criadas');

  // Get categories
  const eletronicos = await prisma.category.findUnique({ where: { slug: 'eletronicos' } });
  const moda = await prisma.category.findUnique({ where: { slug: 'moda' } });
  const livros = await prisma.category.findUnique({ where: { slug: 'livros' } });
  const casa = await prisma.category.findUnique({ where: { slug: 'casa' } });
  const esportes = await prisma.category.findUnique({ where: { slug: 'esportes' } });

  // Create Products
  const productsData = [
    // Eletrônicos
    {
      name: 'Fone de Ouvido Bluetooth Premium',
      slug: 'fone-bluetooth-premium',
      description: 'Fone over-ear com cancelamento de ruído ativo, bateria de 30h e som Hi-Fi de alta qualidade.',
      price: 399.99,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      categoryId: eletronicos!.id,
    },
    {
      name: 'Smartphone Galaxy Pro 5G',
      slug: 'smartphone-galaxy-pro',
      description: 'Smartphone top de linha com câmera de 108MP, tela AMOLED 6.7" e processador octa-core.',
      price: 2999.00,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
      categoryId: eletronicos!.id,
    },
    {
      name: 'Smartwatch Fitness Tracker',
      slug: 'smartwatch-fitness',
      description: 'Relógio inteligente com monitor cardíaco, GPS e resistência à água.',
      price: 599.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      categoryId: eletronicos!.id,
    },
    {
      name: 'Notebook Ultra Slim i7',
      slug: 'notebook-ultra-slim',
      description: 'Notebook fino e leve com processador Intel i7, 16GB RAM e SSD de 512GB.',
      price: 4599.00,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
      categoryId: eletronicos!.id,
    },

    // Moda
    {
      name: 'Camiseta Premium Cotton',
      slug: 'camiseta-premium',
      description: 'Camiseta 100% algodão com estampa moderna e corte confortável.',
      price: 89.90,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      categoryId: moda!.id,
    },
    {
      name: 'Jaqueta Jeans Clássica',
      slug: 'jaqueta-jeans',
      description: 'Jaqueta jeans atemporal com acabamento de alta qualidade.',
      price: 249.00,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
      categoryId: moda!.id,
    },
    {
      name: 'Tênis Esportivo Pro',
      slug: 'tenis-esportivo-pro',
      description: 'Tênis de corrida com tecnologia de amortecimento e design aerodinâmico.',
      price: 399.00,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      categoryId: moda!.id,
    },

    // Livros
    {
      name: 'Clean Code - Código Limpo',
      slug: 'clean-code',
      description: 'Guia essencial de boas práticas de programação por Robert C. Martin.',
      price: 79.90,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop',
      categoryId: livros!.id,
    },
    {
      name: 'O Poder do Hábito',
      slug: 'poder-habito',
      description: 'Bestseller sobre como criar bons hábitos e quebrar os ruins.',
      price: 49.90,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
      categoryId: livros!.id,
    },

    // Casa
    {
      name: 'Luminária LED Moderna',
      slug: 'luminaria-led',
      description: 'Luminária de mesa com ajuste de intensidade e temperatura de cor.',
      price: 159.00,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
      categoryId: casa!.id,
    },
    {
      name: 'Conjunto de Panelas Antiaderentes',
      slug: 'panelas-antiaderentes',
      description: 'Set completo de 5 panelas com revestimento antiaderente premium.',
      price: 349.00,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop',
      categoryId: casa!.id,
    },

    // Esportes
    {
      name: 'Bola de Futebol Profissional',
      slug: 'bola-futebol-pro',
      description: 'Bola oficial de futebol com tecnologia termo-selada.',
      price: 149.00,
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&h=500&fit=crop',
      categoryId: esportes!.id,
    },
    {
      name: 'Colchonete de Yoga Premium',
      slug: 'colchonete-yoga',
      description: 'Tapete de yoga antiderrapante com 6mm de espessura.',
      price: 129.00,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
      categoryId: esportes!.id,
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log('✅ Produtos criados');

  console.log('\n🎉 Seed completo!');
  console.log('\n📝 Credenciais de Admin:');
  console.log('   Email: admin@example.com');
  console.log('   Senha: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
