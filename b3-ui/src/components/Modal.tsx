import { Show } from 'solid-js';
import type { JSX } from 'solid-js';

export default function Modal(props: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: JSX.Element;
}) {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" onClick={props.onClose} />
        <div class="relative z-10 mx-4 w-full max-w-3xl rounded-2xl bg-white shadow-lg">
          <div class="flex items-center justify-between border-b px-4 py-3">
            <h3 class="text-sm font-semibold">{props.title ?? 'Preview'}</h3>
            <button class="text-gray-500 hover:text-black" onClick={props.onClose}>✕</button>
          </div>
          <div class="p-4">{props.children}</div>
        </div>
      </div>
    </Show>
  );
}