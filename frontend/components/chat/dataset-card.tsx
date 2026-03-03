'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Table2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface DatasetPreview {
  columns    : string[]
  dtypes     : Record<string, string>
  sample_rows: Record<string, unknown>[]
  row_count  : number
}

interface DatasetCardProps {
  filename : string
  preview  : DatasetPreview
  className?: string
}

/** dtype abbreviation shown in the column table */
function dtypeLabel(dtype: string): string {
  if (dtype.startsWith('int'))   return 'int'
  if (dtype.startsWith('float')) return 'float'
  if (dtype === 'object')        return 'str'
  if (dtype.startsWith('bool'))  return 'bool'
  if (dtype.startsWith('date'))  return 'date'
  return dtype.slice(0, 6)
}

function dtypeColor(dtype: string): string {
  if (dtype.startsWith('int') || dtype.startsWith('float')) return 'text-sky-400'
  if (dtype === 'object')  return 'text-amber-400'
  if (dtype.startsWith('bool')) return 'text-green-400'
  return 'text-zinc-400'
}

export function DatasetCard({ filename, preview, className }: DatasetCardProps) {
  const [showRows, setShowRows] = useState(false)

  const { columns, dtypes, sample_rows, row_count } = preview

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-700 bg-zinc-900/80 overflow-hidden text-xs',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-800/60 px-3 py-2">
        <Table2 className="h-3.5 w-3.5 shrink-0 text-[#39FF14]" />
        <span className="flex-1 truncate font-medium text-zinc-200">{filename}</span>
        <Badge variant="secondary" className="h-4 shrink-0 px-1.5 text-[10px]">
          {row_count.toLocaleString()} rows
        </Badge>
        <Badge variant="secondary" className="h-4 shrink-0 px-1.5 text-[10px]">
          {columns.length} cols
        </Badge>
      </div>

      {/* Column list */}
      <div className="px-3 py-2">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          Columns
        </p>
        <div className="flex flex-wrap gap-1">
          {columns.map(col => (
            <div
              key={col}
              className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5"
            >
              <span className="text-zinc-300">{col}</span>
              <span className={cn('text-[10px]', dtypeColor(dtypes[col] ?? ''))}>
                {dtypeLabel(dtypes[col] ?? '')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample rows toggle */}
      {sample_rows.length > 0 && (
        <>
          <button
            onClick={() => setShowRows(v => !v)}
            className="cursor-pointer flex w-full items-center gap-1.5 border-t border-zinc-800 px-3 py-1.5 text-zinc-500 hover:text-[#39FF14] transition-colors"
          >
            {showRows
              ? <ChevronUp className="h-3 w-3" />
              : <ChevronDown className="h-3 w-3" />}
            <span className="text-[10px]">
              {showRows ? 'Hide' : 'Preview'} {sample_rows.length} rows
            </span>
          </button>

          {showRows && (
            <div className="overflow-x-auto border-t border-zinc-800">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-800/60">
                    {columns.map(col => (
                      <th
                        key={col}
                        className="whitespace-nowrap px-2.5 py-1.5 text-left text-[10px] font-medium text-zinc-400"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sample_rows.map((row, i) => (
                    <tr key={i} className="border-t border-zinc-800/60">
                      {columns.map(col => (
                        <td
                          key={col}
                          className="max-w-[120px] truncate px-2.5 py-1 text-zinc-400"
                          title={String(row[col] ?? '')}
                        >
                          {row[col] === null || row[col] === undefined
                            ? <span className="text-zinc-600 italic">null</span>
                            : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
