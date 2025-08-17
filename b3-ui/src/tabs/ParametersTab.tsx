import { For, createSignal } from 'solid-js';
import { config, setConfig } from '../store';

type DType = 'real' | 'integer' | 'boolean';

export default function ParametersTab() {
  const [name, setName] = createSignal('');
  const [dtype, setDtype] = createSignal<DType>('real');
  const [value, setValue] = createSignal('');
  const [shape, setShape] = createSignal(''); // "3,4" -> [3,4]

  function toPyId(s: string) {
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
  }
  function parseValue(dt: DType, raw: string): any {
    if (dt === 'boolean') return raw.trim().toLowerCase() === 'true';
    if (dt === 'integer') return parseInt(raw, 10);
    return Number(raw); // real
  }
  function parseShape(raw: string): number[] {
    const r = raw.trim();
    if (!r) return [];
    return r
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n) && n >= 0);
  }

  function addParam() {
    const nm = name().trim();
    if (!toPyId(nm)) { alert('Имя должно быть валидным Python identifier'); return; }
    if (config.parameters.some((p) => p.name === nm)) { alert('Такое имя уже есть'); return; }
    const v = parseValue(dtype(), value());
    const shp = parseShape(shape());
    setConfig('parameters', (prev) => [
      ...prev,
      { name: nm, dtype: dtype(), value: v, shape: shp, bounds: {} } as any,
    ]);
    setName(''); setValue(''); setShape('');
  }

  function removeParam(i: number) {
    setConfig('parameters', (prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <section class="bg-white rounded-2xl border shadow-sm p-4">
      <h2 class="text-base font-semibold mb-3">Parameters</h2>

      <div class="grid md:grid-cols-4 gap-2">
        <input
          class="border rounded-xl px-3 py-2"
          placeholder="name (python id)"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
        <select
          class="border rounded-xl px-3 py-2"
          value={dtype()}
          onChange={(e) => setDtype(e.currentTarget.value as DType)}
        >
          <option value="real">real</option>
          <option value="integer">integer</option>
          <option value="boolean">boolean</option>
        </select>
        <input
          class="border rounded-xl px-3 py-2"
          placeholder="value (e.g. 1e-6, 2, true)"
          value={value()}
          onInput={(e) => setValue(e.currentTarget.value)}
        />
        <input
          class="border rounded-xl px-3 py-2"
          placeholder="shape (e.g. '', '3', '3,4')"
          value={shape()}
          onInput={(e) => setShape(e.currentTarget.value)}
        />
      </div>

      <div class="mt-3">
        <button class="px-4 py-2 rounded-2xl bg-gray-900 text-white" onClick={addParam}>
          Add parameter
        </button>
      </div>

      <div class="mt-5 divide-y">
        <For each={config.parameters}>
          {(p, i) => (
            <div class="py-2 flex items-center justify-between">
              <div class="text-sm">
                <div class="font-mono">{p.name}</div>
                <div class="text-gray-600">
                  {p.dtype} {p.shape?.length ? `[${p.shape.join(',')}]` : ''} ={' '}
                  <span class="font-mono">{JSON.stringify(p.value)}</span>
                </div>
              </div>
              <button class="text-red-600 hover:underline" onClick={() => removeParam(i())}>
                remove
              </button>
            </div>
          )}
        </For>
      </div>
    </section>
  );
}
