"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChartConfig = Record<
  string,
  { label: string; color: string }
>

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue>({ config: {} })

// ---------------------------------------------------------------------------
// ChartContainer — wraps ResponsiveContainer + injects CSS vars for colours
// ---------------------------------------------------------------------------

export function ChartContainer({
  config,
  children,
  className,
  style: styleProp,
}: {
  config   : ChartConfig
  children : React.ReactNode
  className?: string
  style?   : React.CSSProperties
}) {
  const cssVars = Object.fromEntries(
    Object.entries(config).map(([key, val]) => [`--color-${key}`, val.color])
  ) as React.CSSProperties

  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn("w-full", className)} style={{ ...cssVars, ...styleProp }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// ChartTooltipContent — shadcn-style tooltip body
// ---------------------------------------------------------------------------

interface TooltipPayloadEntry {
  dataKey?: string | number
  value?  : ValueType
  color?  : string
  name?   : NameType
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
}: {
  active?       : boolean
  payload?      : TooltipPayloadEntry[]
  label?        : string | number
  labelFormatter?: (label: string | number) => string
}) {
  const { config } = React.useContext(ChartContext)

  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-lg text-xs">
      <p className="mb-1.5 font-medium text-zinc-400">
        {label != null
          ? labelFormatter ? labelFormatter(label) : `Epoch ${label}`
          : null}
      </p>
      {payload.map((entry, i) => {
        const key = String(entry.dataKey ?? i)
        const cfg = config[key]
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: cfg?.color ?? entry.color }}
            />
            <span className="text-zinc-400">{cfg?.label ?? key}</span>
            <span className="ml-auto font-mono text-zinc-200">
              {typeof entry.value === "number" ? entry.value.toFixed(4) : String(entry.value ?? "")}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Re-export Recharts primitives so consumers only import from "@/components/ui/chart"
export {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
}
