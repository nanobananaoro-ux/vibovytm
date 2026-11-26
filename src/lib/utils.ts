import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `€${(value / 1_000).toFixed(1)}K`
  }
  return `€${value.toFixed(0)}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getPositionColor(position: string): string {
  const colors: Record<string, string> = {
    GK: 'text-blue-400 bg-blue-900/30 border-blue-500/20',
    CB: 'text-emerald-400 bg-emerald-900/30 border-emerald-500/20',
    LB: 'text-emerald-400 bg-emerald-900/30 border-emerald-500/20',
    RB: 'text-emerald-400 bg-emerald-900/30 border-emerald-500/20',
    CDM: 'text-amber-400 bg-amber-900/30 border-amber-500/20',
    CM: 'text-amber-400 bg-amber-900/30 border-amber-500/20',
    CAM: 'text-purple-400 bg-purple-900/30 border-purple-500/20',
    LW: 'text-pink-400 bg-pink-900/30 border-pink-500/20',
    RW: 'text-pink-400 bg-pink-900/30 border-pink-500/20',
    ST: 'text-red-400 bg-red-900/30 border-red-500/20',
  }
  return colors[position] || 'text-slate-400 bg-slate-800/30 border-slate-600/20'
}

export const POSITIONS = [
  { value: 'GK', label: 'Вратарь' },
  { value: 'CB', label: 'Центральный защитник' },
  { value: 'LB', label: 'Левый защитник' },
  { value: 'RB', label: 'Правый защитник' },
  { value: 'CDM', label: 'Опорный полузащитник' },
  { value: 'CM', label: 'Центральный полузащитник' },
  { value: 'CAM', label: 'Атакующий полузащитник' },
  { value: 'LW', label: 'Левый крайний полузащитник' },
  { value: 'RW', label: 'Правый крайний полузащитник' },
  { value: 'ST', label: 'Нападающий' },
] as const