"use client"

import * as React from "react"
import { Palette, Check } from "lucide-react"
import { useColorTheme } from "@/components/layout/ThemeProvider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const themes = [
    { value: "indigo", label: "Indigo", color: "bg-indigo-500" },
    { value: "amber", label: "Amber", color: "bg-amber-500" },
    { value: "emerald", label: "Emerald", color: "bg-emerald-500" },
]

export function ColorThemeToggle() {
  const { theme, setTheme } = useColorTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
            <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value as any)}>
                <div className="flex items-center gap-2">
                    <div className={cn("h-4 w-4 rounded-full", t.color)} />
                    <span>{t.label}</span>
                    {theme === t.value && <Check className="h-4 w-4 ml-auto" />}
                </div>
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
