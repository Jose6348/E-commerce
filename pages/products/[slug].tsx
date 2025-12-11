import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import Link from 'next/link';

export default function ProductDetail({ product }: any) {
  if (!product) return <div className="container">Not found</div>;
  return (
    <div className="container">
      <Link href="/products">Back</Link>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '400px' }} />
      <p>{product.description}</p>
      <p>${product.price.toFixed(2)}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const product = await prisma.product.findUnique({ where: { slug: String(params?.slug) } });
  return { props: { product: product ? JSON.parse(JSON.stringify(product)) : null } };
};
