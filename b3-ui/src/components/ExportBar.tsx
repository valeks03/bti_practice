import { B3Config } from '../schema';
import { config, setConfig } from '../store';

export default function ExportBar() {
  function download() {
    const data = JSON.stringify(config, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'b3-config.json'; a.click();
    URL.revokeObjectURL(url);
  }
  async function copyJSON() {
    try { await navigator.clipboard.writeText(JSON.stringify(config, null, 2)); alert('Copied'); } catch (e: any) { alert('Clipboard error: ' + e.message); }
  }
  function importJSON() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json';
    inp.onchange = () => {
      const file = inp.files?.[0]; if (!file) return;
      file.text().then((txt) => {
        try {
          const obj = JSON.parse(txt);
          const parsed = B3Config.parse(obj); // кинет ошибку, если невалидно
          setConfig(() => parsed as any);
        } catch (e: any) {
          alert('Invalid JSON: ' + (e.message ?? e));
        }
      });
    };
    inp.click();
  }

  return (
    <footer class="sticky bottom-0 bg-white border-t">
      <div class="mx-auto max-w-6xl px-6 py-3 flex gap-2 justify-end">
        <button class="px-3 py-1.5 rounded-2xl bg-gray-100" onClick={importJSON}>Import JSON</button>
        <button class="px-3 py-1.5 rounded-2xl bg-gray-100" onClick={copyJSON}>Copy JSON</button>
        <button class="px-3 py-1.5 rounded-2xl bg-gray-900 text-white" onClick={download}>Export JSON</button>
      </div>
    </footer>
  );
}