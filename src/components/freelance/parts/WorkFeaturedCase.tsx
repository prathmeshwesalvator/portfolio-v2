"use client";

import { ArrowUpRight } from "lucide-react";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { ButtonLink } from "@/components/shared/Button";
import { Chip, ChipList } from "@/components/shared/Chip";
import { Reveal } from "@/components/shared/Reveal";
import type { Project } from "@/types";
import { WorkBrowserFrame } from "./WorkBrowserFrame";
import { WorkChecklist, WorkDetail, WorkText } from "./WorkDetails";

/** Featured case study: live site in a self-scrolling browser frame + objective / solution / contribution. */
export function WorkFeaturedCase({ project }: { project: Project }) {
  const titleId = `work-${project.id}-title`;
  const live = project.links.find((link) => link.type === "live");
  const source = project.links.find((link) => link.type === "github");

  return (
    <Reveal
      as="article"
      aria-labelledby={titleId}
      className="grid overflow-hidden rounded-[28px] border border-line bg-surface shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05)] transition-colors duration-500 hover:border-line-strong lg:grid-cols-12"
    >
      <div className="flex min-w-0 flex-col border-b border-line bg-surface-2/40 p-3 sm:p-4 lg:col-span-7 lg:border-r lg:border-b-0">
        <WorkBrowserFrame project={project} className="flex-1" />
      </div>

      <div className="flex min-w-0 flex-col gap-6 p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <div className="flex flex-col gap-5">
          <div>
            <Chip tone="success">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
              {project.kindLabel}
            </Chip>
          </div>
          <hgroup className="flex flex-col gap-2">
            <h3
              id={titleId}
              className="font-display text-3xl leading-[1.02] font-semibold tracking-[-0.03em] text-fg sm:text-4xl"
            >
              {project.name}
            </h3>
            <p className="text-base text-muted sm:text-lg">{project.tagline}</p>
          </hgroup>
        </div>

        {project.objective ? (
          <WorkDetail label="The problem">
            <WorkText>{project.objective}</WorkText>
          </WorkDetail>
        ) : null}

        {project.solution ? (
          <WorkDetail label="The solution">
            <WorkText>{project.solution}</WorkText>
          </WorkDetail>
        ) : null}

        {project.contributions?.length ? (
          <WorkDetail label="My contribution">
            <WorkChecklist items={project.contributions} className="mt-1" />
          </WorkDetail>
        ) : null}

        <ChipList items={project.stack} size="xs" mono label={`${project.name} tech stack`} />

        {live || source ? (
          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-6">
            {live ? (
              <ButtonLink
                href={live.href}
                external
                trailingIcon={
                  <ArrowUpRight
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5"
                  />
                }
                className="group/live"
              >
                {live.label}
              </ButtonLink>
            ) : null}
            {source ? (
              <ArrowLink
                href={source.href}
                external
                leadingIcon={<GitHubIcon aria-hidden="true" className="text-muted" />}
                className="text-[0.9375rem]"
              >
                {source.label}
              </ArrowLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
