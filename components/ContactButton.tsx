import Link from "next/link";

export default function ContactButton() {
  return (
    <Link href="/contact" className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-blue-700 transition z-50">
      Contact
    </Link>
  );
}
