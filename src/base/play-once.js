// Video que se reproduce una vez al entrar en pantalla y queda quieto en el
// último frame (docs/decisiones.md, 2026-10-06 · Videos del Home). Lo usan
// los componentes con media por slot (hero, feature-block); en la Home, los
// videos de Kanu y Nami.
//
//   <video slot="image" src="…" muted playsinline preload="auto" aria-hidden="true"></video>
//
//   import { playOnce } from '../../base/play-once.js';
//   update() { playOnce(slot.assignedElements()); }
//
// - Solo toma los <video> sin autoplay ni loop: los que los tienen siguen
//   como siempre.
// - Arranca con la mitad del video en pantalla, una sola vez.
// - Con prefers-reduced-motion, o si el navegador no deja reproducir, no se
//   reproduce y muestra directamente el último frame.

const seen = new WeakSet();
let observer = null;

export function playOnce(elements) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const video of elements) {
    if (video.localName !== 'video' || video.autoplay || video.loop || seen.has(video)) continue;
    seen.add(video);
    video.muted = true;
    if (reduced) {
      showLastFrame(video);
      continue;
    }
    observer ??= new IntersectionObserver(onIntersect, { threshold: 0.5 });
    observer.observe(video);
  }
}

function onIntersect(entries) {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    observer.unobserve(entry.target);
    entry.target.play().catch(() => showLastFrame(entry.target));
  }
}

function showLastFrame(video) {
  const seek = () => {
    video.currentTime = video.duration;
  };
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) seek();
  else video.addEventListener('loadedmetadata', seek, { once: true });
}
