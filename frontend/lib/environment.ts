/**
 * OS and hardware detection utilities.
 * Used to drive the install cell in the generated .ipynb notebook.
 */

export type HardwareTier = 'cpu' | 'nvidia_gpu' | 'apple_silicon' | 'google_colab'

export interface DetectedEnvironment {
  os       : 'windows' | 'mac' | 'linux' | 'unknown'
  hardware : HardwareTier
  /** Human-readable label shown in the UI selector */
  label    : string
}

/**
 * Detect the user's OS and likely hardware tier from browser signals.
 * Falls back to 'cpu' when nothing more specific is detectable.
 */
export function detectEnvironment(): DetectedEnvironment {
  if (typeof navigator === 'undefined') {
    return { os: 'unknown', hardware: 'cpu', label: 'CPU (unknown OS)' }
  }

  const ua      = navigator.userAgent.toLowerCase()
  const platform = (navigator.platform ?? '').toLowerCase()

  // Google Colab: runs in a hosted Jupyter environment
  if (typeof window !== 'undefined' && window.location.hostname.includes('colab.research.google')) {
    return { os: 'linux', hardware: 'google_colab', label: 'Google Colab' }
  }

  // macOS / Apple Silicon
  if (ua.includes('mac') || platform.startsWith('mac')) {
    // M-series chips report arm on newer browsers
    const isArm = ua.includes('arm') || (typeof navigator !== 'undefined' && 'userAgentData' in navigator)
    return {
      os      : 'mac',
      hardware: isArm ? 'apple_silicon' : 'cpu',
      label   : isArm ? 'Apple Silicon (M-series)' : 'macOS (Intel CPU)',
    }
  }

  // Windows (including WSL2 — browser UA is still "Windows")
  if (ua.includes('win')) {
    return { os: 'windows', hardware: 'cpu', label: 'Windows / WSL2 (CPU)' }
  }

  // Linux default — assume CPU; user can override via the UI selector
  return { os: 'linux', hardware: 'cpu', label: 'Linux (CPU)' }
}

/** All selectable environment options for the UI dropdown. */
export const ENVIRONMENT_OPTIONS: Array<{ value: HardwareTier; label: string; description: string }> = [
  { value: 'cpu',           label: 'CPU',              description: 'TensorFlow CPU — works everywhere' },
  { value: 'nvidia_gpu',    label: 'NVIDIA GPU',       description: 'TensorFlow GPU + CUDA (Linux/Windows)' },
  { value: 'apple_silicon', label: 'Apple Silicon',    description: 'TensorFlow-Metal (M1/M2/M3)' },
  { value: 'google_colab',  label: 'Google Colab',     description: 'Colab-compatible install cell' },
]
