import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface ButtonProps {
  isSubmitting: boolean;
  label: string;
  children: string;
}

export default function SubmitButton({
  isSubmitting,
  label,
  children,
}: ButtonProps) {
  return (
    <Button
      className="cursor-pointer mt-4"
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {label}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
