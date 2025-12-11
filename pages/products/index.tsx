import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export default function ProductList({ products }: any) {
  return (
    <div className="container">
      <h1>Products</h1>
      {products.map((p: any) => (
        <div key={p.id} className="card">
          <h3>
            <Link href={`/products/${p.slug}`}>{p.name}</Link>
          </h3>
          <p>${p.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      name: query.search ? { contains: String(query.search), mode: 'insensitive' } : undefined,
    },
    orderBy: { createdAt: 'desc' },
  });
  return { props: { products: JSON.parse(JSON.stringify(products)) } };
};
