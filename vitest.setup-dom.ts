// @ts-expect-error jsdom dev dependency
import { JSDOM } from "jsdom";

if (typeof window === "undefined") {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost:3000",
    pretendToBeVisual: true,
  });
  const win = dom.window;

  (globalThis as any).window = win;
  (globalThis as any).document = win.document;
  try {
    Object.defineProperty(globalThis, "navigator", {
      value: win.navigator,
      writable: true,
      configurable: true,
    });
  } catch {
    // navigator already exists
  }
  (globalThis as any).HTMLElement = win.HTMLElement;
  (globalThis as any).HTMLInputElement = win.HTMLInputElement;
  (globalThis as any).HTMLButtonElement = win.HTMLButtonElement;
  (globalThis as any).HTMLSelectElement = win.HTMLSelectElement;
  (globalThis as any).HTMLTextAreaElement = win.HTMLTextAreaElement;
  (globalThis as any).Element = win.Element;
  (globalThis as any).Node = win.Node;
  (globalThis as any).Event = win.Event;
  (globalThis as any).CustomEvent = win.CustomEvent;
  (globalThis as any).MouseEvent = win.MouseEvent;
  (globalThis as any).KeyboardEvent = win.KeyboardEvent;
  (globalThis as any).MutationObserver = win.MutationObserver;
  (globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 0);
  (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
  (globalThis as any).getComputedStyle = win.getComputedStyle.bind(win);
}
