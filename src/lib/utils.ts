import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a snake_case string to camelCase
 */
function toCamelCaseKey(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Recursively convert all keys in an object/array from snake_case to camelCase
 */
export function toCamelCase<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T
  if (Array.isArray(obj)) return obj.map((item) => toCamelCase(item)) as T
  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        toCamelCaseKey(key),
        toCamelCase(value),
      ])
    ) as T
  }
  return obj as T
}

/**
 * Convert all keys in an object/array from camelCase to snake_case
 */
function toSnakeCaseKey(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function toSnakeCase<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T
  if (Array.isArray(obj)) return obj.map((item) => toSnakeCase(item)) as T
  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        toSnakeCaseKey(key),
        toSnakeCase(value),
      ])
    ) as T
  }
  return obj as T
}
