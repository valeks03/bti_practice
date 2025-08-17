import { Index, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { config, setConfig } from '../store';

const DEVICES = ['cpu', 'thread', 'gpu'] as const;
type Device = typeof DEVICES[number];

type OptRow = { key: string; value: string };

export default function LikelihoodsTab() {
  const [id, setId]       = createSignal('lk1');
  const [type, setType]   = createSignal('alignment');
  const [device, setDev]  = createSignal<Device>('cpu');
  const [file, setFile]   = createSignal('');
  const [rows, setRows]   = createStore<OptRow[]>([]);   // <-- options как store-массив

  // helpers
  function addRow() {
    setRows(rows.length, { key: '', value: '' });
  }
  function removeRow(i: number) {
    setRows(prev => prev.filter((_, idx) => idx !== i));
  }
  function setKey(i: number, v: string)   { setRows(i, 'key', v); }
  function setValue(i: number, v: string) { setRows(i, 'value', v); }

  function parseLiteral(raw: string): any {
    const v = raw.trim();
    if (/^(true|false)$/i.test(v)) return /^true$/i.test(v);
    if (v !== '' && !Number.isNaN(Number(v))) return Number(v);
    return v;
  }

  function buildOptions(): Record<string, any> {
    const out: Record<string, any> = {};
    for (const r of rows) {
      if (!r.key) continue;
      out[r.key] = parseLiteral(r.value);
    }
    return out;
  }

  function add() {
    const lid = id().trim();
    if (!lid) { alert('Укажи id'); return; }
    setConfig('likelihoods', (list) => [
      ...list,
      {
        id: lid,
        type: type(),
        device: device(),
        file: file(),
        options: buildOptions(),
      },
    ]);
    // очистка формы
    setId('');
    setFile('');
    setRows(() => []);
  }

  return (
    <section class="bg-white rounded-2xl shadow p-4">
      <h2 class="text-lg font-semibold mb-3">Likelihoods</h2>

      <div class="grid md:grid-cols-5 gap-2">
        <input class="border rounded px-3 py-2" placeholder="id" value={id()} onInput={(e) => setId(e.currentTarget.value)} />
        <input class="border rounded px-3 py-2" placeholder="type (e.g. alignment)" value={type()} onInput={(e) => setType(e.currentTarget.value)} />
        <select class="border rounded px-3 py-2" value={device()} onChange={(e) => setDev(e.currentTarget.value as Device)}>
          {DEVICES.map((d) => <option value={d}>{d}</option>)}
        </select>
        <input class="border rounded px-3 py-2" placeholder="file path (e.g. data/aln.fasta)" value={file()} onInput={(e) => setFile(e.currentTarget.value)} />
        <div class="flex items-center gap-2">
          <button class="px-3 py-2 rounded-2xl bg-gray-900 text-white" onClick={addRow}>+ arg</button>
          <button class="px-3 py-2 rounded-2xl bg-gray-100" onClick={add}>Add likelihood</button>
        </div>
      </div>

      {/* список опций (key/value) */}
      <div class="mt-3 space-y-2">
        <Index each={rows}>
          {(r, i) => (
            <div class="grid md:grid-cols-5 gap-2">
              <input
                class="border rounded px-3 py-2"
                placeholder="option key (e.g. threads)"
                value={r().key}
                onInput={(e) => setKey(i, e.currentTarget.value)}
              />
              <input
                class="border rounded px-3 py-2 md:col-span-3"
                placeholder="option value (e.g. 4)"
                value={r().value}
                onInput={(e) => setValue(i, e.currentTarget.value)}
              />
              <button class="text-red-600" onClick={() => removeRow(i)}>remove</button>
            </div>
          )}
        </Index>
      </div>

      <div class="mt-6">
        <h3 class="font-medium mb-2">Current:</h3>
        <ul class="divide-y">
          {config.likelihoods.map((l, idx) => (
            <li class="py-2 flex items-center justify-between">
              <div class="text-sm">
                <div class="font-mono">{l.id} — {l.type} [{l.device}]</div>
                <div class="text-gray-600">
                  file: <span class="font-mono">{l.file}</span> • options: <span class="font-mono">{JSON.stringify(l.options || {})}</span>
                </div>
              </div>
              <button
                class="text-red-600 hover:underline"
                onClick={() => setConfig('likelihoods', (list) => list.filter((_, i) => i !== idx))}
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
