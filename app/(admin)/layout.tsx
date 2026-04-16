export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout-wrapper">
      {/* Admin specific sidebar or navigation can go here in the future */}
      {children}
    </div>
  );
}
