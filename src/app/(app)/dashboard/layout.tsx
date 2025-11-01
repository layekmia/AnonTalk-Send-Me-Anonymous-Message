import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Main content */}
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
