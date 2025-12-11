import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--surface-soft)',
      color: 'var(--dark)',
      marginTop: 'auto',
      borderTop: '1px solid rgba(0,0,0,0.04)',
      boxShadow: '0 -12px 30px rgba(15, 23, 42, 0.06)'
    }}>
      <div className="container" style={{ padding: '3rem 1.5rem 2rem' }}>
        <div className="grid grid-cols-4" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* About */}
          <div>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--primary-dark)'
            }}>
              ShopHub
            </h4>
            <p style={{
              color: 'var(--gray-600)',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              Sua loja online completa com os melhores produtos e ofertas. Compre com segurança e receba em casa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h5 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--dark)'
            }}>
              Links Rápidos
            </h5>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>
                <Link href="/products" style={{
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-base)'
                }}>
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/cart" style={{
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-base)'
                }}>
                  Carrinho
                </Link>
              </li>
              <li>
                <Link href="/account/orders" style={{
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-base)'
                }}>
                  Meus Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--dark)'
            }}>
              Categorias
            </h5>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>
                <Link href="/category/eletronicos" style={{
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-base)'
                }}>
                  Eletrônicos
                </Link>
              </li>
              <li>
                <Link href="/category/moda" style={{
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-base)'
                }}>
                  Moda
                </Link>
              </li>
              <li>
                <Link href="/category/livros" style={{
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-base)'
                }}>
                  Livros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--dark)'
            }}>
              Contato
            </h5>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li style={{
                color: 'var(--gray-600)',
                fontSize: '0.875rem'
              }}>
                📧 contato@shophub.com
              </li>
              <li style={{
                color: 'var(--gray-600)',
                fontSize: '0.875rem'
              }}>
                📱 (11) 99999-9999
              </li>
              <li style={{
                color: 'var(--gray-600)',
                fontSize: '0.875rem'
              }}>
                📍 São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{
            color: 'var(--gray-500)',
            fontSize: '0.875rem',
            margin: 0
          }}>
            © {currentYear} ShopHub. Todos os direitos reservados.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <Link href="#" style={{
              color: 'var(--gray-500)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color var(--transition-base)'
            }}>
              Termos de Uso
            </Link>
            <Link href="#" style={{
              color: 'var(--gray-500)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color var(--transition-base)'
            }}>
              Privacidade
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        footer a:hover {
          color: var(--primary-dark) !important;
        }
      `}</style>
    </footer>
  );
}
