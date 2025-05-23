
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import Head from "@/components/Head";

export default function NotFound() {
  return (
    <>
      <Head 
        title="Página não encontrada" 
        description="A página que você está procurando não existe ou foi movida."
      />
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="text-center space-y-6 max-w-md">
          <FileQuestion className="mx-auto h-16 w-16 text-primary opacity-80" />
          
          <h1 className="text-4xl font-extrabold tracking-tight">Página não encontrada</h1>
          
          <p className="text-lg text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar para a página inicial
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">
                Ir para o dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
