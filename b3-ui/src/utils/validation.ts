import { config } from '../store';

export function paramExists(name: string): boolean {
  return config.parameters.some(p => p.name === name);
}

export function validateArgRef(kind: string, value: string): string | null {
  if (kind === 'parameter') {
    if (!value) return 'Выберите параметр';
    if (!paramExists(value)) return `Параметр "${value}" не найден`;
  }
  return null;
}

export type RowLike = { key: string; kind: string; value: string };

export function hasInvalidRows(rows: RowLike[]): boolean {
  for (const r of rows) {
    if (!r.key?.trim()) return true;
    const err = validateArgRef(r.kind, r.value);
    if (err) return true;
  }
  return false;
}