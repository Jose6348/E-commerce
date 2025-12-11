import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export default function CategoryPage({ category, products }: any) {
  if (!category) return <div className="container">Not found</div>;
  return (
    <div className="container">
      <h1>{category.name}</h1>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const category = await prisma.category.findUnique({ where: { slug: String(params?.slug) } });
  const products = category
    ? await prisma.product.findMany({ where: { categoryId: category.id, active: true } })
    : [];
  return { props: { category, products: JSON.parse(JSON.stringify(products)) } };
};
