import { createSignal } from 'solid-js';
import ParametersTab from './tabs/ParametersTab';
import PriorsTab from './tabs/PriorsTab';
import OperatorsTab from './tabs/OperatorsTab';
import LikelihoodsTab from './tabs/LikelihoodsTab';
import MCMCTab from './tabs/MCMCTab';
import ExportBar from './components/ExportBar';

const TABS = ['Parameters', 'Priors', 'Operators', 'Likelihoods', 'MCMC'] as const;
type Tab = typeof TABS[number];

export default function App() {
  const [tab, setTab] = createSignal<Tab>('Parameters');

  return (
    <div class="min-h-screen flex flex-col">
      <header class="sticky top-0 bg-white border-b">
        <div class="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <h1 class="text-lg font-semibold">b3 Configurator</h1>
          <nav class="flex gap-1">
            {TABS.map((t) => (
              <button
                class="px-3 py-1.5 rounded-2xl text-sm bg-gray-100 hover:bg-gray-200"
                classList={{ 'bg-gray-900 text-white': tab() === t }}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-6xl w-full px-6 py-6 grid gap-6">
        {tab() === 'Parameters' && <ParametersTab />}
        {tab() === 'Priors' && <PriorsTab />}
        {tab() === 'Operators' && <OperatorsTab />}
        {tab() === 'Likelihoods' && <LikelihoodsTab />}
        {tab() === 'MCMC' && <MCMCTab />}
      </main>

      <ExportBar />
    </div>
  );
}
