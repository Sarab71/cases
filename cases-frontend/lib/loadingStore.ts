// lib/loadingStore.ts

type Callback = (loading: boolean) => void;
let listener: Callback | null = null;

export const loadingRef = {
  set: (val: boolean) => {
    if (listener) listener(val); // context ko signal bhejna
  },
  subscribe: (cb: Callback) => {
    listener = cb; // context se callback register karna
  },
};
