import { Show, createMemo, createSignal, Index } from 'solid-js';
import { createStore } from 'solid-js/store';
import { config, setConfig } from '../store';
import type { TB3Config } from '../schema';

const PRIOR_TYPES = ['Normal', 'LogNormal', 'Gamma', 'Exponential', 'Uniform', 'Beta'] as const;

type ArgKind = 'value' | 'parameter' | 'enum' | 'distribution';
type ArgRow = { key: string; kind: ArgKind; value: string };

export default function PriorsTab() {
  const [id, setId] = createSignal('prior1');
  const [type, setType] = createSignal<typeof PRIOR_TYPES[number]>('Normal');

  // ВАЖНО: store вместо signal, чтобы делать точечные апдейты
  const [rows, setRows] = createStore<ArgRow[]>([]);
  const paramNames = createMemo(() => config.parameters.map((p) => p.name));

  function addRow() {
    setRows(rows.length, { key: '', kind: 'value', value: '' });
  }
  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Точечные апдейты, без пересоздания массива
  function onKeyInput(i: number, v: string)  { setRows(i, 'key', v); }
  function onKindChange(i: number, v: ArgKind){ setRows(i, 'kind', v); }
  function onValueInput(i: number, v: string) { setRows(i, 'value', v); }

  function buildArgs(): Record<string, any> {
    const out: Record<string, any> = {};
    for (const r of rows) {
      if (!r.key) continue;
      if (r.kind === 'parameter') out[r.key] = { kind: 'parameter', ref: r.value };
      else if (r.kind === 'enum') out[r.key] = { kind: 'enum', ref: r.key, value: r.value };
      else if (r.kind === 'distribution') out[r.key] = { kind: 'distribution', ref: r.value };
      else {
        const v = r.value.trim();
        if (/^(true|false)$/i.test(v)) out[r.key] = { kind: 'value', value: /^true$/i.test(v) };
        else if (!Number.isNaN(Number(v)) && v !== '') out[r.key] = { kind: 'value', value: Number(v) };
        else out[r.key] = { kind: 'value', value: v };
      }
    }
    return out;
  }

  function addPrior() {
    const pid = id().trim();
    if (!pid) { alert('Укажите id'); return; }
    setConfig('priors', (list) => [
      ...list,
      { id: pid, type: type(), args: buildArgs() } as TB3Config['priors'][number],
    ]);
    setId('');
    setRows(() => []); // очистить строки аргументов
  }

  return (
    <section class="bg-white rounded-2xl shadow p-4">
      <h2 class="text-lg font-semibold mb-3">Priors</h2>

      <div class="grid md:grid-cols-4 gap-2">
        <input class="border rounded px-3 py-2" placeholder="id" value={id()} onInput={(e) => setId(e.currentTarget.value)} />
        <select class="border rounded px-3 py-2" value={type()} onChange={(e) => setType(e.currentTarget.value as any)}>
          {PRIOR_TYPES.map((t) => <option value={t}>{t}</option>)}
        </select>
        <div class="md:col-span-2 flex items-center gap-2">
          <button class="px-3 py-2 rounded-2xl bg-gray-900 text-white" onClick={addRow}>+ arg</button>
          <button class="px-3 py-2 rounded-2xl bg-gray-100" onClick={addPrior}>Add prior</button>
        </div>
      </div>

      <div class="mt-3 space-y-2">
        <Index each={rows}>
          {(r, i) => (
            <div class="grid md:grid-cols-5 gap-2">
              <input
                class="border rounded px-3 py-2"
                placeholder="key (напр. mean)"
                value={r().key}
                onInput={(e) => onKeyInput(i, e.currentTarget.value)}
              />
              <select
                class="border rounded px-3 py-2"
                value={r().kind}
                onChange={(e) => onKindChange(i, e.currentTarget.value as ArgKind)}
              >
                <option value="value">value</option>
                <option value="parameter">parameter</option>
                <option value="enum">enum</option>
                <option value="distribution">distribution</option>
              </select>

              <Show when={r().kind === 'parameter'} fallback={
                <input
                  class="border rounded px-3 py-2 md:col-span-2"
                  placeholder="value / ref"
                  value={r().value}
                  onInput={(e) => onValueInput(i, e.currentTarget.value)}
                />
              }>
                <select
                  class="border rounded px-3 py-2 md:col-span-2"
                  value={r().value}
                  onChange={(e) => onValueInput(i, e.currentTarget.value)}
                >
                  <option value="">— выбери параметр —</option>
                  {paramNames().map((nm) => <option value={nm}>{nm}</option>)}
                </select>
              </Show>

              <button class="text-red-600" onClick={() => removeRow(i)}>remove</button>
            </div>
          )}
        </Index>
      </div>

      <div class="mt-6">
        <h3 class="font-medium mb-2">Current:</h3>
        <ul class="divide-y">
          {config.priors.map((p, idx) => (
            <li class="py-2 flex items-center justify-between">
              <div class="text-sm">
                <div class="font-mono">{p.id} — {p.type}</div>
                <pre class="text-xs text-gray-600">{JSON.stringify(p.args, null, 2)}</pre>
              </div>
              <button
                class="text-red-600 hover:underline"
                onClick={() => setConfig('priors', (list) => list.filter((_, i) => i !== idx))}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
