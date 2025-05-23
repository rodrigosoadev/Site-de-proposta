
import { toast as sonnerToast } from "sonner";

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Generate a unique ID for each toast
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

export function toast({
  variant = "default",
  title,
  description,
  ...props
}: Omit<ToasterToast, "id">) {
  const id = genId();

  // Convert our variant to sonner's expected type
  const toastType = variant === "destructive" ? "error" : "default";
  
  // Call sonner toast with the proper parameters
  if (title) {
    sonnerToast(title as string, {
      id,
      description,
      ...props
    });
  } else {
    sonnerToast({
      id,
      description,
      ...props
    });
  }

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (props: Omit<ToasterToast, "id">) => {
      if (props.title) {
        sonnerToast(props.title as string, {
          id,
          description: props.description,
          ...props
        });
      }
      return id;
    },
  };
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
    toasts: [] as ToasterToast[] // Empty array with explicit type
  };
}
