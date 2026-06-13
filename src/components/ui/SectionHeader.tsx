import Link from "next/link";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
        {description && (
          <p className="mt-1 text-gray-500">{description}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="hidden text-sm font-semibold text-primary hover:underline md:inline-block"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
