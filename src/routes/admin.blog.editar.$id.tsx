import { createFileRoute, useParams } from "@tanstack/react-router";
import { AdminLayout } from "@/components/dmg/admin/AdminLayout";
import { PostForm } from "@/components/dmg/admin/PostForm";

export const Route = createFileRoute("/admin/blog/editar/$id")({
  head: () => ({ meta: [
    { title: "Editar artigo | Painel DMG" },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: EditPage,
});

function EditPage() {
  const { id } = useParams({ from: "/admin/blog/editar/$id" });
  return (
    <AdminLayout title="Editar artigo">
      <PostForm postId={id} />
    </AdminLayout>
  );
}
