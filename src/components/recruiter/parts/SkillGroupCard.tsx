"use client";

import { AppWindow, Server, Smartphone, Wrench } from "lucide-react";
import { Chip, ChipList } from "@/components/shared/Chip";
import { cn } from "@/lib/cn";
import type { IconComponent, SkillGroup } from "@/types";

const GROUP_ICONS: Record<SkillGroup["id"], IconComponent> = {
  mobile: Smartphone,
  backend: Server,
  frontend: AppWindow,
  tools: Wrench,
};

const CLUSTER_TITLE = "font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase";

/** One skill group in the bento grid. The primary group gets the large, emphasised layout. */
export function SkillGroupCard({ group }: { group: SkillGroup }) {
  return group.emphasis === "primary" ? <PrimarySkillCard group={group} /> : <SupportingSkillCard group={group} />;
}

function PrimarySkillCard({ group }: { group: SkillGroup }) {
  const Icon = GROUP_ICONS[group.id];

  return (
    <div className="w-full rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-5">
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-text"
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-fg">{group.title}</h3>
            <Chip tone="success">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
              {group.label}
            </Chip>
          </div>
        </div>
        <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted">{group.description}</p>
      </div>

      <div className="mt-8 grid gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {group.clusters.map((cluster, index) => (
          <div key={cluster.title}>
            <h4 className={CLUSTER_TITLE}>{cluster.title}</h4>
            {/* The first cluster ("Core") is the everyday stack — tinted for emphasis. */}
            <ChipList items={cluster.items} size="sm" tone={index === 0 ? "accent" : "neutral"} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportingSkillCard({ group }: { group: SkillGroup }) {
  const Icon = GROUP_ICONS[group.id];
  // A single cluster would only repeat the card title, so its heading is omitted.
  const titledClusters = group.clusters.length > 1;

  return (
    // @container: the cluster grid responds to the card's own width (wide at md, narrow at lg).
    <div className="@container flex w-full flex-col gap-6 rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-7">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-surface-2 text-fg">
            <Icon className="size-[1.125rem]" strokeWidth={1.75} />
          </span>
          <Chip tone="outline" size="xs">
            {group.label}
          </Chip>
        </div>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-fg">{group.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{group.description}</p>
      </div>

      <div className={cn("mt-auto grid gap-5 border-t border-line pt-6", titledClusters && "@xl:grid-cols-3")}>
        {group.clusters.map((cluster) => (
          <div key={cluster.title}>
            {titledClusters ? <h4 className={cn(CLUSTER_TITLE, "mb-2.5")}>{cluster.title}</h4> : null}
            <ChipList items={cluster.items} size="xs" label={titledClusters ? undefined : `${group.title} skills`} />
          </div>
        ))}
      </div>
    </div>
  );
}
