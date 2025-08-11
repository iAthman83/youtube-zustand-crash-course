"use client";

import type React from "react";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smile, Frown, Sparkles, Activity, Trash2 } from "lucide-react";
import { useMoodStore, type Mood } from "@/store/useMoodStore";
import { cn } from "@/lib/utils";

type MoodTrackerProps = {
  title?: string;
};

const MOODS: {
  key: Mood;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    key: "Happy",
    label: "Happy",
    icon: Smile,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    key: "Sad",
    label: "Sad",
    icon: Frown,
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    key: "Excited",
    label: "Excited",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

export default function MoodTracker(
  { title = "Mood Tracker" }: MoodTrackerProps = { title: "Mood Tracker" }
) {
  const currentMood = useMoodStore((s) => s.currentMood);
  const log = useMoodStore((s) => s.log);
  const setMood = useMoodStore((s) => s.setMood);
  const clearLog = useMoodStore((s) => s.clearLog);

  const CurrentIcon = useMemo(() => {
    if (currentMood === "Happy") return Smile;
    if (currentMood === "Sad") return Frown;
    if (currentMood === "Excited") return Sparkles;
    return Activity;
  }, [currentMood]);

  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CurrentIcon className="h-5 w-5 text-zinc-600" />
          {title}
        </CardTitle>
        <CardDescription>
          Pick how you feel. Your mood persists after reloads, and you can
          inspect changes in Redux DevTools.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Buttons */}
        <div className="flex flex-wrap gap-3">
          {MOODS.map(({ key, label, icon: Icon, color }) => {
            const selected = currentMood === key;
            return (
              <Button
                key={key}
                type="button"
                variant={selected ? "secondary" : "outline"}
                onClick={() => setMood(key)}
                aria-pressed={selected}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4",
                  selected && color,
                  selected && "border"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearLog}
              className="rounded-full bg-transparent"
              aria-label="Clear mood history"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear log
            </Button>
          </div>
        </div>

        <Separator />

        {/* Current Mood */}
        <section aria-labelledby="current-mood-heading" className="grid gap-3">
          <h2
            id="current-mood-heading"
            className="text-sm font-medium text-zinc-600"
          >
            Current mood
          </h2>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-base px-3 py-1.5 rounded-full bg-zinc-100"
            >
              <CurrentIcon className="h-4 w-4 mr-2" />
              {currentMood ?? "No mood yet"}
            </Badge>
            <span className="sr-only" aria-live="polite">
              {currentMood
                ? `Current mood is ${currentMood}`
                : "No mood selected yet"}
            </span>
          </div>
        </section>

        {/* Log */}
        <section aria-labelledby="mood-log-heading" className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2
              id="mood-log-heading"
              className="text-sm font-medium text-zinc-600"
            >
              Mood history
            </h2>
            <span className="text-xs text-zinc-500">
              {log.length} {log.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <ScrollArea className="h-[260px] rounded-md border bg-white">
            <ul className="divide-y">
              {log.length === 0 && (
                <li className="p-4 text-sm text-zinc-500">
                  No entries yet. Pick a mood to get started.
                </li>
              )}
              {log.map((entry) => {
                const Icon =
                  entry.mood === "Happy"
                    ? Smile
                    : entry.mood === "Sad"
                    ? Frown
                    : Sparkles;
                return (
                  <li
                    key={entry.id}
                    className="p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-1 text-sm",
                          entry.mood === "Happy" &&
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                          entry.mood === "Sad" &&
                            "bg-rose-50 text-rose-700 border-rose-200",
                          entry.mood === "Excited" &&
                            "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        <Icon className="h-4 w-4 mr-1.5" />
                        {entry.mood}
                      </div>
                    </div>
                    <time
                      className="text-xs tabular-nums text-zinc-500"
                      dateTime={entry.at}
                      title={new Date(entry.at).toLocaleString()}
                    >
                      {formatShort(entry.at)}
                    </time>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </section>

        {/* Helper note */}
        <p className="text-xs text-zinc-500">
          Tip: Open your browser&apos;s Redux DevTools to inspect every state
          transition.
        </p>
      </CardContent>
    </Card>
  );
}

function formatShort(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
