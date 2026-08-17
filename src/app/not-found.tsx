import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-16">
      <EmptyState
        icon={<SearchX className="size-7" strokeWidth={1.75} />}
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        actionHref="/"
        actionLabel="Back home"
      />
    </div>
  );
}
