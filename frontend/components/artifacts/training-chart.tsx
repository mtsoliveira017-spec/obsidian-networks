'use client'

import { useState } from 'react'
import { BarChart2, Maximize2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  type ChartConfig,
} from '@/components/ui/chart'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EpochMetrics {
  epoch       : number
  total_epochs: number
  loss        : number | null
  accuracy    : number | null
  val_loss    : number | null
  val_accuracy: number | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildConfig(metrics: EpochMetrics[]): ChartConfig {
  const hasAcc = metrics.some(m => m.accuracy != null)
  const cfg: ChartConfig = {
    loss    : { label: 'Loss',     color: '#f87171' },
    val_loss: { label: 'Val Loss', color: '#fb923c' },
  }
  if (hasAcc) {
    cfg.accuracy     = { label: 'Accuracy',     color: '#39FF14' }
    cfg.val_accuracy = { label: 'Val Accuracy', color: '#34d399' }
  }
  return cfg
}

// ---------------------------------------------------------------------------
// Inner chart (shared between mini and expanded)
// ---------------------------------------------------------------------------

function MetricsChart({
  metrics,
  height,
  mini = false,
}: {
  metrics: EpochMetrics[]
  height : number
  mini?  : boolean
}) {
  const hasAcc = metrics.some(m => m.accuracy != null)
  const config = buildConfig(metrics)

  const data = metrics.map(m => ({
    epoch       : m.epoch,
    loss        : m.loss,
    val_loss    : m.val_loss,
    accuracy    : m.accuracy,
    val_accuracy: m.val_accuracy,
  }))

  return (
    <ChartContainer config={config} className="w-full" style={{ height: `${height}px` }}>
      <LineChart data={data} margin={{ top: 4, right: mini ? 4 : 16, bottom: 0, left: mini ? -20 : 0 }}>
        {!mini && <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />}
        <XAxis
          dataKey="epoch"
          tick={{ fill: '#71717a', fontSize: mini ? 9 : 11 }}
          tickLine={false}
          axisLine={false}
          hide={mini}
        />
        <YAxis
          yAxisId="loss"
          tick={{ fill: '#71717a', fontSize: mini ? 9 : 11 }}
          tickLine={false}
          axisLine={false}
          width={mini ? 28 : 40}
          tickFormatter={v => v.toFixed(2)}
        />
        {hasAcc && (
          <YAxis
            yAxisId="acc"
            orientation="right"
            tick={{ fill: '#71717a', fontSize: mini ? 9 : 11 }}
            tickLine={false}
            axisLine={false}
            width={mini ? 0 : 40}
            hide={mini}
            tickFormatter={v => `${(v * 100).toFixed(0)}%`}
          />
        )}
        {!mini && (
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={l => `Epoch ${l}`} />}
          />
        )}
        {!mini && <ChartLegend wrapperStyle={{ fontSize: 11, color: '#71717a' }} />}

        <Line yAxisId="loss" type="monotone" dataKey="loss"     stroke="var(--color-loss)"     strokeWidth={mini ? 1.5 : 2} dot={false} isAnimationActive={false} />
        <Line yAxisId="loss" type="monotone" dataKey="val_loss" stroke="var(--color-val_loss)"  strokeWidth={mini ? 1.5 : 2} dot={false} isAnimationActive={false} strokeDasharray={mini ? undefined : '4 2'} />
        {hasAcc && (
          <>
            <Line yAxisId="acc" type="monotone" dataKey="accuracy"     stroke="var(--color-accuracy)"     strokeWidth={mini ? 1.5 : 2} dot={false} isAnimationActive={false} />
            <Line yAxisId="acc" type="monotone" dataKey="val_accuracy" stroke="var(--color-val_accuracy)" strokeWidth={mini ? 1.5 : 2} dot={false} isAnimationActive={false} strokeDasharray={mini ? undefined : '4 2'} />
          </>
        )}
      </LineChart>
    </ChartContainer>
  )
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function TrainingChart({ metrics }: { metrics: EpochMetrics[] }) {
  if (metrics.length === 0) return null

  const latest      = metrics[metrics.length - 1]
  const totalEpochs = latest.total_epochs
  const done        = latest.epoch

  return (
    <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          <BarChart2 className="h-3 w-3 text-[#39FF14]" />
          Training Metrics
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-500">
            {done}{totalEpochs > 0 ? `/${totalEpochs}` : ''} ep
          </span>

          {/* Expand button */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="cursor-pointer rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                title="Expand chart"
              >
                <Maximize2 className="h-3 w-3" />
              </button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-950 border-zinc-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-[#39FF14]" />
                  Training Metrics
                  <span className="ml-auto text-[11px] font-mono text-zinc-500">
                    {done}{totalEpochs > 0 ? ` / ${totalEpochs}` : ''} epochs
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                {latest.loss != null && (
                  <span className="rounded-full border border-red-900/40 bg-red-950/30 px-2 py-0.5 font-mono text-red-300">
                    loss {latest.loss.toFixed(4)}
                  </span>
                )}
                {latest.val_loss != null && (
                  <span className="rounded-full border border-orange-900/40 bg-orange-950/30 px-2 py-0.5 font-mono text-orange-300">
                    val_loss {latest.val_loss.toFixed(4)}
                  </span>
                )}
                {latest.accuracy != null && (
                  <span className="rounded-full border border-[#39FF14]/20 bg-[#39FF14]/5 px-2 py-0.5 font-mono text-[#39FF14]">
                    acc {(latest.accuracy * 100).toFixed(1)}%
                  </span>
                )}
                {latest.val_accuracy != null && (
                  <span className="rounded-full border border-emerald-900/40 bg-emerald-950/30 px-2 py-0.5 font-mono text-emerald-300">
                    val_acc {(latest.val_accuracy * 100).toFixed(1)}%
                  </span>
                )}
              </div>

              <div style={{ height: 300 }}>
                <MetricsChart metrics={metrics} height={300} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mini chart */}
      <div style={{ height: 72 }}>
        <MetricsChart metrics={metrics} height={72} mini />
      </div>

      {/* Latest values row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono">
        {latest.loss != null && (
          <span className="text-red-400">loss {latest.loss.toFixed(4)}</span>
        )}
        {latest.val_loss != null && (
          <span className="text-orange-400">val_loss {latest.val_loss.toFixed(4)}</span>
        )}
        {latest.accuracy != null && (
          <span className="text-[#39FF14]">acc {(latest.accuracy * 100).toFixed(1)}%</span>
        )}
        {latest.val_accuracy != null && (
          <span className="text-emerald-400">val_acc {(latest.val_accuracy * 100).toFixed(1)}%</span>
        )}
      </div>
    </div>
  )
}
