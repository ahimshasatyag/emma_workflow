import { useState, useEffect } from "react"

/**
 * Hook untuk menunda pembaruan nilai input (misal untuk search filter)
 * @param {any} value - Nilai yang ingin di-debounce
 * @param {number} delay - Waktu tunda dalam milidetik (default 300ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
