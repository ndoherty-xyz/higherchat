export type ArrayElement<A extends readonly unknown[]> =
  A extends readonly (infer T)[] ? T : never
