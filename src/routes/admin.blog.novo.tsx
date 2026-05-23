import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/dmg/admin/AdminLayout";
import { PostForm } from "@/components/dmg/admin/PostForm";

export const Route = createFileRoute("/admin/blog/novo")({
  head: () => ({ meta: [
    { title: "Novo artigo | Painel DMG" },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: () => (
    <AdminLayout title="Novo artigo">
      <PostForm />
    </AdminLayout>
  ),
});
