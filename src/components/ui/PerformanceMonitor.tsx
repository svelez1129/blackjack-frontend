'use client'

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and when PerformanceObserver is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      try {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            console.log('LCP:', lastEntry.startTime)
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Monitor Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as unknown as { hadRecentInput?: boolean; value?: number; startTime: number }
            if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
              clsValue += layoutShiftEntry.value
            }
          }
          if (clsValue > 0) {
            console.log('CLS:', clsValue)
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const firstInputEntry = entry as unknown as { processingStart?: number; startTime: number }
            if (firstInputEntry.processingStart) {
              console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime)
            }
          }
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cleanup observers after 30 seconds
        setTimeout(() => {
          lcpObserver.disconnect()
          clsObserver.disconnect()
          fidObserver.disconnect()
        }, 30000)
      } catch (error) {
        // Silently fail if observers are not supported
        console.debug('Performance monitoring failed:', error)
      }
    }

    // Start observing after the page is loaded
    if (document.readyState === 'complete') {
      observeWebVitals()
    } else {
      window.addEventListener('load', observeWebVitals, { once: true })
    }
  }, [])

  return null // This component doesn't render anything
}