'use client'

import { useState, useEffect } from 'react'
import { detectEnvironment, type DetectedEnvironment, type HardwareTier } from '@/lib/environment'

interface UseEnvironmentReturn {
  environment : DetectedEnvironment
  setHardware : (tier: HardwareTier) => void
}

/**
 * Detects the user's OS/hardware on mount and exposes a setter so the user
 * can override the hardware tier from the UI selector.
 */
export function useEnvironment(): UseEnvironmentReturn {
  const [environment, setEnvironment] = useState<DetectedEnvironment>(() =>
    detectEnvironment()
  )

  // Re-detect on mount (navigator is only available client-side)
  useEffect(() => {
    setEnvironment(detectEnvironment())
  }, [])

  const setHardware = (tier: HardwareTier) => {
    setEnvironment(prev => ({ ...prev, hardware: tier }))
  }

  return { environment, setHardware }
}
