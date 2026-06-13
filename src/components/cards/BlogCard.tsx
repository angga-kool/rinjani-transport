import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  readTime?: string;
  href: string;
}

export function BlogCard({ title, excerpt, category, readTime, href }: BlogCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-160 ease-out hover:shadow-md"
    >
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50 transition-transform duration-300 group-hover:scale-[1.03]" />

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary">{category}</span>
          {readTime && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-400">{readTime}</span>
            </>
          )}
        </div>
        <h3 className="mt-2 text-sm font-bold text-gray-900 group-hover:text-primary line-clamp-2">
          {title}
        </h3>
        <p className="mt-1 flex-1 text-xs text-gray-500 line-clamp-2">{excerpt}</p>
      </div>
    </Link>
  );
}
