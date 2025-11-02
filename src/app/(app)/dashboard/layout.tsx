import Navigation from "@/components/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
