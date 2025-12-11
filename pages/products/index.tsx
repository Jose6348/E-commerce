import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';

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

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsPage({ products, categories }: ProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState<'recentes' | 'preco-asc' | 'preco-desc' | 'az'>('recentes');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock'>('all');

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category.slug === selectedCategory;
      const matchesStock = stockFilter === 'all' || product.stock > 0;
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sort === 'recentes') return 0;
      if (sort === 'preco-asc') return a.price - b.price;
      if (sort === 'preco-desc') return b.price - a.price;
      if (sort === 'az') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <>
      <Head>
        <title>Produtos - ShopHub</title>
        <meta name="description" content="Explore todos os nossos produtos com os melhores preços" />
      </Head>

      <div style={{
        background: 'var(--surface-soft)',
        minHeight: 'calc(100vh - 200px)',
        padding: '3rem 0'
      }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: 'var(--dark)'
            }}>
              Todos os <span className="gradient-text">Produtos</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--gray-600)' }}>
              Filtre por ocasião, categoria ou preço e encontre o presente perfeito.
            </p>
          </div>

          {/* Filters */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">🔍 Buscar</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Digite o nome do produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-base)'
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">📂 Categoria</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-base)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Todas as Categorias</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">↕ Ordenar</label>
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-base)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="recentes">Mais recentes</option>
                  <option value="preco-asc">Menor preço</option>
                  <option value="preco-desc">Maior preço</option>
                  <option value="az">Nome A-Z</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">✅ Disponibilidade</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { key: 'all', label: 'Todos' },
                    { key: 'in-stock', label: 'Em estoque' }
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setStockFilter(f.key as typeof stockFilter)}
                      className="btn btn-ghost"
                      style={{
                        border: stockFilter === f.key ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                        background: stockFilter === f.key ? 'var(--primary-light)' : 'transparent',
                        color: 'var(--dark)',
                        padding: '0.65rem 1rem',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="btn btn-ghost"
                  style={{
                    background: 'transparent',
                    color: 'var(--gray-700)',
                    border: 'none',
                    padding: '0.875rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ✕ Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Mostrando <strong>{filteredProducts.length}</strong> produto(s)
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Nenhum produto encontrado
              </h3>
              <p style={{ color: 'var(--gray-600)' }}>
                Tente ajustar seus filtros ou fazer uma nova busca
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        categories: JSON.parse(JSON.stringify(categories))
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        categories: []
      }
    };
  }
};
