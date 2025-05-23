
import { Badge } from '@/components/ui/badge';

interface SignatureStatusBadgeProps {
  status: 'pending' | 'signed' | 'rejected' | 'expired' | 'cancelled' | 'completed';
  className?: string;
}

export default function SignatureStatusBadge({ status, className }: SignatureStatusBadgeProps) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className={`bg-yellow-100 text-yellow-800 border-yellow-200 ${className}`}>Pendente</Badge>;
    case 'signed':
      return <Badge variant="outline" className={`bg-green-100 text-green-800 border-green-200 ${className}`}>Assinado</Badge>;
    case 'rejected':
      return <Badge variant="outline" className={`bg-red-100 text-red-800 border-red-200 ${className}`}>Rejeitado</Badge>;
    case 'expired':
      return <Badge variant="outline" className={`bg-gray-100 text-gray-800 border-gray-200 ${className}`}>Expirado</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className={`bg-gray-100 text-gray-800 border-gray-200 ${className}`}>Cancelado</Badge>;
    case 'completed':
      return <Badge variant="outline" className={`bg-green-100 text-green-800 border-green-200 ${className}`}>Concluído</Badge>;
    default:
      return null;
  }
}
