"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface ButtonProps {
  isSubmitting: boolean;
  label: string;
  children: string;
  className?: string;
  isDisable?: boolean;
}

export default function SubmitButton({
  isSubmitting,
  label,
  children,
  className,
  isDisable,
}: ButtonProps) {
  return (
    <Button
      className={`cursor-pointer ${className}`}
      type="submit"
      disabled={isSubmitting || isDisable}
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
