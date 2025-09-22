interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSectionPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin: {id.charAt(0).toUpperCase() + id.slice(1)} Section
      </h1>
      <p>Manage {id} section content here.</p>
    </div>
  );
}
