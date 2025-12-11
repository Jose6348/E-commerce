import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postal: '',
    country: 'Brasil'
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        if (!data.cart?.items || data.cart.items.length === 0) {
          router.push('/cart');
          return;
        }
        setCart(data.cart);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: formData })
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/account/orders/${data.order.id}`);
      } else {
        alert(data.error || 'Erro ao processar pedido');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao processar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - ShopHub</title>
      </Head>

      <div style={{
        background: 'var(--surface-soft)',
        minHeight: 'calc(100vh - 200px)',
        padding: '3rem 0'
      }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Checkout</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)' }}>
              Finalizar compra
            </h1>
            <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>
              Confirme endereço e revise seu pedido antes de enviar.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem'
          }}>
            {/* Shipping Form */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Endereço de Entrega
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Rua e Número</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                    placeholder="Rua Exemplo, 123"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="São Paulo"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CEP</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.postal}
                      onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
                      required
                      placeholder="12345-678"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">País</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.country}
                    readOnly
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    width: '100%',
                    boxShadow: 'var(--shadow-lg)',
                    marginTop: '1rem'
                  }}
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1.5rem',
                border: '1px solid var(--gray-200)'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                  Resumo do Pedido
                </h2>

                {cart?.items.map((item: any) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--gray-200)'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'var(--gray-100)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }} />
                      ) : (
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-600)' }}>IMG</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                        Qtd: {item.quantity} × {formatPrice(item.product.price)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  marginTop: '1.5rem'
                }}>
                  <span>Total</span>
                  <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <div style={{
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--primary)'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
                  Pagamento Simulado
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--dark)', margin: 0 }}>
                  Este é um e-commerce de demonstração. O pagamento será processado automaticamente ao confirmar o pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
