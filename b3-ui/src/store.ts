import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { TB3Config } from './schema';

export const defaultConfig: TB3Config = {
  parameters: [],
  priors: [],
  operators: [],
  likelihoods: [],
  mcmc: { length: 1_000_000, burnin: 100_000 },
};

const saved = (() => {
  try { return JSON.parse(localStorage.getItem('b3-config') || 'null'); }
  catch { return null; }
})();

export const [config, setConfig] = createStore<TB3Config>(saved ?? defaultConfig);

// авто-сейв
createEffect(() => {
  localStorage.setItem('b3-config', JSON.stringify(config));
});
