export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-10">
      <div className="container mx-auto px-6 py-8 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Built with ❤️ using Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
