"use client";

import { Globe } from "lucide-react";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { GitHubIcon, GooglePlayIcon } from "@/components/shared/BrandIcons";
import { cn } from "@/lib/cn";
import type { Project, ProjectLink } from "@/types";

const ICONS: Record<ProjectLink["type"], typeof Globe | typeof GitHubIcon> = {
  "play-store": GooglePlayIcon,
  github: GitHubIcon,
  live: Globe,
};

/**
 * Renders a project's verified external links. Returns null when a project
 * has none (e.g. repositories that are currently unavailable).
 */
export function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  if (project.links.length === 0) return null;
  return (
    <ul aria-label={`${project.name} links`} className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {project.links.map((link) => {
        const Icon = ICONS[link.type];
        return (
          <li key={link.href}>
            <ArrowLink
              href={link.href}
              external
              leadingIcon={<Icon aria-hidden="true" className="size-4 text-muted" />}
              className="text-sm"
            >
              {link.label}
              <span className="sr-only"> — {project.name}</span>
            </ArrowLink>
          </li>
        );
      })}
    </ul>
  );
}
