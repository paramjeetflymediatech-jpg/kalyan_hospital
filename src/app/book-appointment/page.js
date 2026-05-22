import BookingFormPage from '@/components/BookingFormPage';
import { getPageMetadata } from '@/lib/seo';
import HeadScript from '@/components/Seo/HeadScript';

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
      <HeadScript html={seoData?.page_header} />
      <BookingFormPage />
      {seoData?.page_footer && (
        <div dangerouslySetInnerHTML={{ __html: seoData.page_footer }} />
      )}
    </>
  );
}
