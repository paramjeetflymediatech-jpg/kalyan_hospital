import BookingFormPage from '@/components/BookingFormPage';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  const metadata = await getPageMetadata('/book-appointment');
  return metadata || {
    title: "Book Robotic Surgery | Kalyan Robotic Hospital Punjab",
    description: "Schedule your consultation for AI-powered robotic knee replacement or spine surgery at Kalyan Hospital.",
  };
}

export default function Page() {
  return <BookingFormPage />;
}
