// src/types/mathjax.d.ts
export {};

declare global {
  interface MathJaxObject {
    typesetPromise?: (elements?: (HTMLElement | string)[]) => Promise<void>;
    tex?: any;
    svg?: any;
  }

  interface Window {
    MathJax?: MathJaxObject;
  }
}
