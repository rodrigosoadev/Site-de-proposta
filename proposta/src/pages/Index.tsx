
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function Index() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-primary-600 font-bold text-xl flex items-center">
                <FileText className="mr-2" />
                <span>PropostaPro</span>
              </Link>
            </div>
            <div>
              <Link to="/login">
                <Button variant="ghost" className="mr-2">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button>Criar Conta</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Propostas comerciais profissionais em minutos
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Crie propostas comerciais de aspecto profissional para impressionar seus clientes e fechar mais negócios.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Comece agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Já tenho uma conta
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/placeholder.svg" 
                  alt="Proposta Comercial" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Todas as ferramentas que você precisa
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simplifique seu processo de criação de propostas com nossa plataforma completa
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Formulários Intuitivos",
                  description: "Interface simples e rápida para criar propostas em poucos minutos",
                  icon: <FileText className="h-10 w-10 text-primary-500" />
                },
                {
                  title: "PDF Profissional",
                  description: "Gere documentos com visual profissional para impressionar seus clientes",
                  icon: <CheckCircle className="h-10 w-10 text-primary-500" />
                },
                {
                  title: "Gestão de Propostas",
                  description: "Acompanhe e gerencie todas as suas propostas em um só lugar",
                  icon: <CheckCircle className="h-10 w-10 text-primary-500" />
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Comece a criar propostas profissionais hoje
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de freelancers e empresas que já estão economizando tempo e fechando mais negócios.
            </p>
            <Link to="/register">
              <Button size="lg">
                Criar uma conta gratuita
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-white font-bold text-xl flex items-center">
                <FileText className="mr-2" />
                <span>PropostaPro</span>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/register" className="text-gray-300 hover:text-white">
                Criar conta
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Entrar
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center md:text-left">
            <p className="text-gray-400">
              © {new Date().getFullYear()} PropostaPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
