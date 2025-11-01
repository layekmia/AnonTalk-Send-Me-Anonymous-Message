import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard">Home</Link>
          <Link href="/dashboard/messages">Messages</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}
