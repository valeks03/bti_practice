import { z } from 'zod';

export const DType = z.enum(['real', 'integer', 'boolean']);

export const Parameter = z.object({
  name: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),
  dtype: DType,
  shape: z.array(z.number().int().nonnegative()).default([]), // [] — скаляр, [n] — вектор, [n,m] — матрица
  value: z.any(),
  bounds: z
    .object({ min: z.number().nullable().optional(), max: z.number().nullable().optional() })
    .optional(),
});

// Унифицированное представление аргументов priors/operators
export const RefParam = z.object({ kind: z.literal('parameter'), ref: z.string() });
export const RefEnum = z.object({ kind: z.literal('enum'), ref: z.string(), value: z.string() });
export const RefDistr = z.object({ kind: z.literal('distribution'), ref: z.string() });
export const Literal = z.object({ kind: z.literal('value'), value: z.union([z.number(), z.boolean(), z.string(), z.array(z.any())]) });
export const ArgValue = z.union([RefParam, RefEnum, RefDistr, Literal]);

export const Prior = z.object({
  id: z.string(),
  type: z.string(), // пример: 'Normal', 'LogNormal', 'Gamma'
  args: z.record(z.string(), ArgValue),
});

export const Operator = z.object({
  id: z.string(),
  type: z.string(), // пример: 'ScaleOperator', 'RandomWalkOperator'
  args: z.record(z.string(), ArgValue),
});

export const Likelihood = z.object({
  id: z.string(),
  type: z.string(), // например: 'alignment'
  device: z.enum(['cpu', 'thread', 'gpu']),
  file: z.string(),
  options: z.record(z.string(), z.any()).optional(),
});

export const MCMC = z.object({ length: z.number().int().positive(), burnin: z.number().int().nonnegative() });

export const B3Config = z.object({
  parameters: z.array(Parameter),
  priors: z.array(Prior),
  operators: z.array(Operator),
  likelihoods: z.array(Likelihood),
  mcmc: MCMC,
});

export type TB3Config = z.infer<typeof B3Config>;