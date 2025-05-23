
import React, { Suspense, lazy, LazyExoticComponent, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyComponentOptions {
  fallback?: React.ReactNode;
}

export function useLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) {
  const LazyComponent = lazy(importFunc);
  
  const fallback = options.fallback || (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export default useLazyComponent;
