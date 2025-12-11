import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { prisma } from '../lib/prisma';

export default function Home({ products, categories }: any) {
  return (
    <div>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account/orders">My Orders</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <div className="container">
        <h1>Welcome to the Store</h1>
        <div className="card">
          <h3>Categories</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((c: any) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="button">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3>Latest Products</h3>
          {products.map((p: any) => (
            <div key={p.id} className="card">
              <h4>
                <Link href={`/products/${p.slug}`}>{p.name}</Link>
              </h4>
              <p>{p.description}</p>
              <p>${p.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await prisma.product.findMany({ take: 6, orderBy: { createdAt: 'desc' } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return { props: { products: JSON.parse(JSON.stringify(products)), categories } };
};
