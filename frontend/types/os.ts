// ── Session ───────────────────────────────────────────────────────────────────

export interface SessionInfo {
  session_id : string
  created_at : number
  expires_at : number
}

// ── Environment ───────────────────────────────────────────────────────────────

export type OS            = 'linux' | 'macos' | 'windows' | 'wsl' | 'colab' | 'unknown'
export type HardwareTier  = 'cpu' | 'nvidia_gpu' | 'apple_silicon' | 'google_colab'

export interface Environment {
  os           : OS
  hardware_tier: HardwareTier
}

// ── Dataset ───────────────────────────────────────────────────────────────────

export interface DatasetPreview {
  columns    : string[]
  dtypes     : Record<string, string>
  sample_rows: Record<string, unknown>[]
  row_count  : number
}

export interface DatasetMeta {
  dataset_type        : 'tabular' | 'time_series' | 'nlp' | 'image'
  n_rows              : number
  n_features          : number
  n_classes           : number | null
  class_imbalance     : number | null
  fraction_missing    : number
  fraction_categorical: number
  has_datetime_cols   : boolean
  target_column       : string | null
}

// ── Compilation job ───────────────────────────────────────────────────────────

export type JobState = 'queued' | 'compiling' | 'success' | 'failure'

export interface JobStatus {
  task_id  : string
  state    : JobState
  progress : number       // 0–100
  error    : string | null
}
