import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  active: boolean;
  category: Category;
}

interface HomeProps {
  featuredProducts: Product[];
  categories: Category[];
}

export default function Home({ featuredProducts, categories }: HomeProps) {
  return (
    <>
      <Head>
        <title>ShopHub - Sua Loja Online Completa</title>
        <meta name="description" content="Encontre os melhores produtos com as melhores ofertas. Eletrônicos, moda, livros e muito mais!" />
      </Head>

      {/* Hero Section - Preto & Bege */}
      <section style={{ background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden', padding: '5rem 0' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.06) 1px, transparent 0)', backgroundSize: '32px 32px', opacity: 0.35 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center', gap: '2.5rem' }}>
            {/* Texto */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.9rem', borderRadius: '999px', background: 'var(--secondary-light)', color: 'var(--primary-dark)', fontWeight: 700, fontSize: '0.875rem', boxShadow: 'var(--shadow-sm)' }}>
                Entrega no mesmo dia • Embalagem premium
              </div>
              <h1 style={{ marginTop: '1.25rem', fontSize: '3.25rem', lineHeight: 1.1, fontWeight: 800, color: 'var(--dark)' }}>
                Flores e presentes que impressionam à primeira vista.
              </h1>
              <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>
                Buquês autorais, cartões personalizados e entrega expressa. Escolha o presente perfeito com a curadoria ShopHub.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
                <Link href="/products">
                  <button className="btn btn-primary btn-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>Comprar agora</button>
                </Link>
                <Link href="#categories">
                  <button className="btn btn-outline btn-lg">Ver categorias</button>
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Entrega agendada', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 5h13v9H3z"></path><path d="M16 8h5v6h-5z"></path><circle cx="7" cy="16" r="2"></circle><circle cx="17" cy="16" r="2"></circle>
                    </svg>
                  )},
                  { label: 'Cartão grátis', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="5" width="18" height="14" rx="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  )},
                  { label: 'Embalagem ecológica', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3l8 4-8 4-8-4 8-4z"></path><path d="M4 7v6l8 4 8-4V7"></path>
                    </svg>
                  )}
                ].map((item) => (
                  <div key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-700)', fontWeight: 600 }}>
                    <span style={{ color: 'var(--primary-dark)', display: 'inline-flex' }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            {/* Imagem hero profissional */}
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', padding: '1rem', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
                  alt="Arranjo floral"
                  style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(255,255,255,0.92)', padding: '0.9rem 1rem', borderRadius: '14px', boxShadow: 'var(--shadow)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Bouquet Primavera</div>
                  <div style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>R$ 189,90</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Entrega hoje • Cartão incluso</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias em chips */}
      <section id="categories" style={{ background: 'var(--surface-soft)', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Categorias</p>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark)' }}>Escolha por ocasião</h2>
            </div>
            <Link href="/products" style={{ textDecoration: 'none' }}>
              <button className="btn btn-outline">Ver catálogo</button>
            </Link>
          </div>

          {categories.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: '999px',
                    background: 'var(--surface)',
                    color: 'var(--dark)',
                    border: '1px solid var(--gray-200)',
                    boxShadow: 'var(--shadow-sm)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <span>{getCategoryIcon(category.slug)}</span>
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--gray-600)' }}>Nenhuma categoria disponível no momento.</p>
          )}
        </div>
      </section>

      {/* Coleções em destaque */}
      <section style={{ background: 'var(--surface)', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div>
              <p style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Coleções</p>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark)' }}>Seleções que encantam</h2>
            </div>
          </div>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { title: 'Aniversário', desc: 'Surpreenda com flores e mimos', color: 'var(--primary-light)' },
              { title: 'Romântico', desc: 'Diga “eu te amo” com elegância', color: 'var(--secondary-light)' },
              { title: 'Corporate', desc: 'Presentes para parceiros e equipes', color: '#e0e0e0' },
              { title: 'Premium', desc: 'Bouquês autorais e exclusivos', color: '#f0e6d8' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                borderRadius: '18px',
                padding: '1.5rem',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.color, display: 'grid', placeItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--dark)' }}>●</div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--dark)', fontWeight: 700 }}>{item.title}</h3>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--gray-600)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mais vendidos */}
      <section style={{ background: 'var(--surface-soft)', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div>
              <p style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mais vendidos</p>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark)' }}>Favoritos da semana</h2>
            </div>
            <Link href="/products">
              <button className="btn btn-outline">Ver todos</button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow)' }}>
              <p style={{ color: 'var(--gray-600)', fontWeight: 600 }}>Nenhum produto disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Por que escolher a ShopHub */}
      <section style={{ background: 'var(--surface)', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Confiança</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark)' }}>Por que escolher a ShopHub</h2>
          </div>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Entrega no dia', desc: 'Logística otimizada para chegar ainda hoje.', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h13v9H3z"></path><path d="M16 8h5v6h-5z"></path><circle cx="7" cy="16" r="2"></circle><circle cx="17" cy="16" r="2"></circle></svg>
              ) },
              { title: 'Curadoria floral', desc: 'Arranjos assinados e paletas harmônicas.', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21c4.5-4 7-7.5 7-10.5A7 7 0 005 10.5C5 13.5 7.5 17 12 21z"></path><path d="M12 14a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"></path></svg>
              ) },
              { title: 'Embalagem premium', desc: 'Caixas rígidas, laços de cetim e cartão.', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l9 4 9-4"></path><path d="M5 8v9a2 2 0 002 2h10a2 2 0 002-2V8"></path><path d="M3 7l9 4 9-4-9-4-9 4z"></path></svg>
              ) },
              { title: 'Compra segura', desc: 'Pagamentos criptografados e antifraude.', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
              ) }
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--surface-soft)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ margin: '0 0 0.35rem', color: 'var(--dark)', fontWeight: 700 }}>{item.title}</h3>
                <p style={{ margin: 0, color: 'var(--gray-600)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section style={{ background: 'var(--surface-soft)', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Depoimentos</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark)' }}>Clientes que já encantamos</h2>
          </div>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { name: 'Marina S.', text: 'Chegou no mesmo dia, embalagem impecável e o buquê estava lindo.' },
              { name: 'Bruno A.', text: 'Processo simples e suporte rápido. Minha esposa amou o presente.' },
              { name: 'Camila R.', text: 'Cartão personalizado e flores frescas. Ganhou minha confiança.' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: '1rem' }}>“{item.text}”</p>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: 'var(--surface)', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ background: 'var(--gradient-hero)', borderRadius: '20px', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '0.35rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Newsletter</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>Ofertas sazonais e coleções exclusivas</h3>
              <p style={{ color: 'var(--gray-700)', margin: 0 }}>Receba cupons, lançamentos e lembretes de datas especiais.</p>
            </div>
            <form style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input type="email" placeholder="Seu melhor e-mail" className="form-input" style={{ flex: 1, minWidth: '220px' }} />
              <button type="button" className="btn btn-primary">Cadastrar</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ background: 'var(--surface-soft)', padding: '3.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pronto para encantar?</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '1rem' }}>Envie hoje e surpreenda quem você ama</h2>
          <p style={{ color: 'var(--gray-600)', maxWidth: '720px', margin: '0 auto 1.5rem' }}>Agende a entrega, escolha um cartão e acompanhe tudo pelo painel. Simples, rápido e com toque premium.</p>
          <Link href="/products">
            <button className="btn btn-primary btn-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>Escolher flores</button>
          </Link>
        </div>
      </section>
    </>
  );
}

function getCategoryIcon(slug: string): string {
  if (!slug) return '';
  return slug.slice(0, 2).toUpperCase();
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [featuredProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    return {
      props: {
        featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
        categories: JSON.parse(JSON.stringify(categories))
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        featuredProducts: [],
        categories: []
      }
    };
  }
};
