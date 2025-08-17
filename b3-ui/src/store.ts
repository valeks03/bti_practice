import { createStore } from 'solid-js/store';
import type { TB3Config } from './schema';

export const defaultConfig: TB3Config = {
  parameters: [],
  priors: [],
  operators: [],
  likelihoods: [],
  mcmc: { length: 1_000_000, burnin: 100_000 },
};

export const [config, setConfig] = createStore<TB3Config>(defaultConfig);
