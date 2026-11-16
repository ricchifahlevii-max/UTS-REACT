import { useCallback, useEffect, useReducer, useState } from 'react'

function readStoredValue(key, initialValue, isValid = () => true) {
  try {
    const storedValue = window.localStorage.getItem(key)
    if (storedValue === null) return initialValue
    const parsedValue = JSON.parse(storedValue)
    if (isValid(parsedValue)) return parsedValue
    console.error(`Data localStorage untuk "${key}" tidak valid`)
    return initialValue
  } catch (error) {
    console.error(`Gagal membaca localStorage untuk "${key}"`, error)
    return initialValue
  }
}

export function useLocalStorage(key, initialValue, isValid) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue, isValid))

  const updateValue = useCallback((nextValue) => {
    setValue((currentValue) => {
      const resolvedValue = typeof nextValue === 'function' ? nextValue(currentValue) : nextValue
      try {
        window.localStorage.setItem(key, JSON.stringify(resolvedValue))
      } catch (error) {
        console.error(`Gagal menyimpan localStorage untuk "${key}"`, error)
      }
      return resolvedValue
    })
  }, [key])

  return [value, updateValue]
}

export function useLocalStorageReducer(key, reducer, initialValue, isValid) {
  const [state, dispatch] = useReducer(
    reducer,
    initialValue,
    (fallback) => readStoredValue(key, fallback, isValid),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error(`Gagal menyimpan localStorage untuk "${key}"`, error)
    }
  }, [key, state])

  return [state, dispatch]
}
