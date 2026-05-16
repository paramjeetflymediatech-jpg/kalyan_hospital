import BlogManager from '@/components/admin/BlogManager';

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  return <BlogManager blogId={id} />;
}
