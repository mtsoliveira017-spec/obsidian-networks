'use client'

import { useState } from 'react'
import { Loader2, Check, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Generic tool part shape ───────────────────────────────────────────────────
// We don't import the full ToolUIPart generic type because it requires knowing
// the tool set at compile time. Instead we use a narrow structural type.

export interface AnyToolPart {
  type      : string   // "tool-search_tensorflow_docs" etc.
  toolCallId: string
  state     : 'input-streaming' | 'input-available' | 'output-available' | 'output-error' | string
  input?    : unknown
  output?   : unknown
  errorText?: string
}

// ── Label map ─────────────────────────────────────────────────────────────────

const LABELS: Record<string, { pending: string; done: string }> = {
  search_tensorflow_docs: { pending: 'Researching TF docs…',    done: 'TF docs searched'    },
  fetch_arxiv_papers    : { pending: 'Searching arXiv papers…', done: 'Papers found'         },
  fetch_url             : { pending: 'Reading documentation…',  done: 'Page read'            },
}

export function toolNameFromType(type: string): string {
  return type.replace(/^tool-/, '')
}

function chipLabel(type: string, done: boolean): string {
  const name = toolNameFromType(type)
  const map  = LABELS[name]
  if (!map) return done ? name : `Running ${name}…`
  return done ? map.done : map.pending
}

// ── Single status chip ────────────────────────────────────────────────────────

export function ToolStatusChip({ part }: { part: AnyToolPart }) {
  const isDone    = part.state === 'output-available'
  const isError   = part.state === 'output-error'
  const isPending = !isDone && !isError

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium',
        isPending && 'border border-zinc-700 bg-zinc-800/80 text-zinc-400',
        isDone    && 'border border-[#39FF14]/25 bg-[#39FF14]/10 text-[#39FF14]',
        isError   && 'border border-red-700/40 bg-red-900/20 text-red-400',
      )}
    >
      {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
      {isDone    && <Check   className="h-3 w-3" />}
      {isError   && <X       className="h-3 w-3" />}
      <span>{chipLabel(part.type, isDone || isError)}</span>
    </span>
  )
}

// ── Sources extracted from completed tool results ─────────────────────────────

export interface Source {
  title: string
  url  : string
}

export function extractSources(parts: AnyToolPart[]): Source[] {
  const seen    = new Set<string>()
  const sources : Source[] = []

  for (const part of parts) {
    if (part.state !== 'output-available' || !part.output) continue
    const out = part.output as Record<string, unknown>

    // search_tensorflow_docs → { results: [{title, url}] }
    if (Array.isArray(out.results)) {
      for (const r of out.results as { title?: string; url?: string }[]) {
        if (r.url && !seen.has(r.url)) {
          seen.add(r.url)
          sources.push({ title: r.title || r.url, url: r.url })
        }
      }
    }

    // fetch_arxiv_papers → { papers: [{title, url}] }
    if (Array.isArray(out.papers)) {
      for (const p of out.papers as { title?: string; url?: string }[]) {
        if (p.url && !seen.has(p.url)) {
          seen.add(p.url)
          sources.push({ title: p.title || p.url, url: p.url })
        }
      }
    }

    // fetch_url → { url, content }
    if (typeof out.url === 'string' && !seen.has(out.url)) {
      seen.add(out.url)
      sources.push({ title: out.url, url: out.url })
    }
  }

  return sources
}

// ── Collapsible sources list ──────────────────────────────────────────────────

export function ToolSourcesList({ parts }: { parts: AnyToolPart[] }) {
  const [open, setOpen] = useState(false)
  const sources = extractSources(parts)
  if (sources.length === 0) return null

  return (
    <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs">
      <button
        onClick={() => setOpen(v => !v)}
        className="cursor-pointer flex w-full items-center gap-1.5 px-3 py-1.5 text-zinc-500 hover:text-[#39FF14] transition-colors"
      >
        {open
          ? <ChevronUp   className="h-3 w-3" />
          : <ChevronDown className="h-3 w-3" />}
        <span>{sources.length} source{sources.length !== 1 ? 's' : ''}</span>
      </button>

      {open && (
        <ul className="border-t border-zinc-800 px-3 py-2 space-y-1.5">
          {sources.map(s => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex items-start gap-1.5 text-zinc-400 hover:text-[#39FF14] transition-colors"
              >
                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                <span className="line-clamp-1">{s.title}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
