"use client"

import { create } from "zustand"
import { devtools, persist, createJSONStorage } from "zustand/middleware"

export type Mood = "Happy" | "Sad" | "Excited"

type MoodEntry = {
  id: string
  mood: Mood
  at: string // ISO string
}

type MoodState = {
  currentMood: Mood | null
  log: MoodEntry[]
  setMood: (mood: Mood) => void
  clearLog: () => void
}

export const useMoodStore = create<MoodState>()(
  devtools(
    persist(
      (set, get) => ({
        currentMood: null,
        log: [],
        setMood: (mood) => {
          const entry: MoodEntry = {
            id:
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,
            mood,
            at: new Date().toISOString(),
          }
          set(
            (state) => ({
              currentMood: mood,
              log: [entry, ...state.log],
            }),
            false,
            { type: "mood/set", mood },
          )
        },
        clearLog: () => set({ log: [] }, false, { type: "mood/clear" }),
      }),
      {
        name: "mood-store", // localStorage key
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ currentMood: state.currentMood, log: state.log }),
      },
    ),
    { name: "mood-store" }, // Redux DevTools instance name
  ),
)
