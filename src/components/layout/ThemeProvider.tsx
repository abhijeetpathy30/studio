"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

const THEME_STORAGE_KEY = "color_theme"

type ColorThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}

type ColorTheme = "indigo" | "amber" | "emerald"

type ColorThemeContextState = {
  theme: ColorTheme
  setTheme: (theme: ColorTheme) => void
}

const ColorThemeContext = React.createContext<ColorThemeContextState | undefined>(undefined)


function ColorThemeProvider({
  children,
  defaultTheme = "indigo",
  storageKey = THEME_STORAGE_KEY,
}: ColorThemeProviderProps) {
  const [theme, setTheme] = React.useState<ColorTheme>(defaultTheme as ColorTheme);
  const { theme: mode } = useNextTheme()

  React.useEffect(() => {
    const storedTheme = (localStorage.getItem(storageKey) as ColorTheme) || defaultTheme;
    setTheme(storedTheme);
  }, [storageKey, defaultTheme]);

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("theme-indigo", "theme-amber", "theme-emerald")
    if (theme) {
      root.classList.add(`theme-${theme}`)
      localStorage.setItem(storageKey, theme)
    }
  }, [theme, storageKey, mode])

  const value = {
    theme: theme,
    setTheme: (newTheme: ColorTheme) => {
      setTheme(newTheme)
    },
  }

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  )
}

const useColorTheme = () => {
  const context = React.useContext(ColorThemeContext)

  if (context === undefined)
    throw new Error("useColorTheme must be used within a ColorThemeProvider")

  return context
}


function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ColorThemeProvider>{children}</ColorThemeProvider>
    </NextThemesProvider>
  )
}

export { ThemeProvider, useColorTheme }
