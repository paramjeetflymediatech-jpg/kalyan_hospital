import BookingFormPage from '@/components/BookingFormPage';
import { getPageMetadata } from '@/lib/seo';
import RenderTags from '@/components/RenderTags';

export async function generateMetadata() {
  const metadata = await getPageMetadata('/book-appointment');
  return metadata || {
    title: "Book Robotic Surgery | Kalyan Robotic Hospital Punjab",
    description: "Schedule your consultation for AI-powered robotic knee replacement or spine surgery at Kalyan Hospital.",
  };
}

export default async function Page() {
  const seoData = await getPageMetadata('/book-appointment');

  return (
    <>
      <RenderTags tags={seoData?.page_header_tags} useStandardTags={true} />
      <BookingFormPage />
      <RenderTags tags={seoData?.page_footer_tags} useStandardTags={true} />
    </>
  );
}
