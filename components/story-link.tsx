import Link from "next/link";
import type { ReactNode } from "react";

import { getArticleHref } from "@/content/articles";
import type { EditorialSection } from "@/content/story";

type StoryLinkProps = {
  section: EditorialSection;
  slug: string;
  children: ReactNode;
};

export function StoryLink({ section, slug, children }: StoryLinkProps) {
  const href = getArticleHref(section, slug);

  if (!href) {
    return children;
  }

  return (
    <Link className="editorial-story-link" href={href}>
      {children}
    </Link>
  );
}
