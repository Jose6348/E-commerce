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

interface CategoryPageProps {
  category: Category | null;
  products: Product[];
}

export default function CategoryPage({ category, products }: CategoryPageProps) {
  if (!category) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1>Categoria não encontrada</h1>
        <p style={{ color: 'var(--gray-600)', marginTop: '1rem' }}>
          A categoria que você procura não existe.
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} - ShopHub</title>
        <meta name="description" content={`Explore produtos de ${category.name}`} />
      </Head>

      <div style={{
        background: 'var(--surface-soft)',
        minHeight: 'calc(100vh - 200px)',
        padding: '3rem 0'
      }}>
        <div className="container">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{category.name}</p>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: 'var(--dark)'
            }}>
              {category.name}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--gray-600)' }}>
              {products.length} produto(s) encontrados
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}>
              {products.map((product) => (
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
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Nenhum produto nesta categoria
              </h3>
              <p style={{ color: 'var(--gray-600)' }}>
                Em breve teremos produtos disponíveis aqui!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params?.slug as string }
    });

    if (!category) {
      return { props: { category: null, products: [] } };
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        active: true
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    return {
      props: {
        category: JSON.parse(JSON.stringify(category)),
        products: JSON.parse(JSON.stringify(products))
      }
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      props: {
        category: null,
        products: []
      }
    };
  }
};
