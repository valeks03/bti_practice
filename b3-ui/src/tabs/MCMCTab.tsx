import { config, setConfig } from '../store';

export default function MCMCTab() {
  const length = () => config.mcmc.length;
  const burnin = () => config.mcmc.burnin;
  function setLength(v: string) { setConfig('mcmc', 'length', parseInt(v || '0', 10)); }
  function setBurnin(v: string) { setConfig('mcmc', 'burnin', parseInt(v || '0', 10)); }
  return (
    <section class="bg-white rounded-2xl shadow p-4">
      <h2 class="text-lg font-semibold mb-2">MCMC</h2>
      <div class="grid md:grid-cols-2 gap-2">
        <label class="block">
          <div class="text-sm text-gray-600">length</div>
          <input class="border rounded px-3 py-2 w-full" type="number" value={length()} onInput={(e) => setLength(e.currentTarget.value)} />
        </label>
        <label class="block">
          <div class="text-sm text-gray-600">burnin</div>
          <input class="border rounded px-3 py-2 w-full" type="number" value={burnin()} onInput={(e) => setBurnin(e.currentTarget.value)} />
        </label>
      </div>
    </section>
  );
}

