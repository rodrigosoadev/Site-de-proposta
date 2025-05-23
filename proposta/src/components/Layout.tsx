
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  PlusCircle,
  LogOut,
  Menu,
  X,
  CreditCard
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-primary-600 font-bold text-xl flex items-center">
                <FileText className="mr-2" />
                <span>PropostaPro</span>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {menuOpen ? <X /> : <Menu />}
              </Button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/propostas" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Minhas Propostas
              </Link>
              <Link to="/propostas/nova" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Nova Proposta
              </Link>
              <Link to="/planos" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                <CreditCard className="inline-block mr-1 h-4 w-4" />
                Planos
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="ml-4">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/propostas" 
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Minhas Propostas
            </Link>
            <Link 
              to="/propostas/nova" 
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Nova Proposta
            </Link>
            <Link 
              to="/planos" 
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <CreditCard className="inline-block mr-1 h-4 w-4" />
              Planos
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </nav>
        </div>
      )}
      
      <main className="flex-1">
        {title && (
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} PropostaPro - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
