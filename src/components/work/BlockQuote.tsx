export default function BlockQuote({ text, author, role }: { text: string; author: string; role?: string }) {
  return (
    <blockquote className="max-w-3xl mx-auto px-4 sm:px-6 my-16 text-center">
      <p className="text-2xl sm:text-3xl font-medium text-navy leading-snug">&ldquo;{text}&rdquo;</p>
      <footer className="mt-4 text-gray-500">— {author}{role ? `, ${role}` : ""}</footer>
    </blockquote>
  );
}
