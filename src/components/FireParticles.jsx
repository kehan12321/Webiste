import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { createPortal } from "react-dom";
import { loadEmittersPlugin } from "tsparticles-plugin-emitters";

export default function FireParticles() {
  const [container, setContainer] = useState(null);
  const init = useCallback(async (engine) => {
    await loadEmittersPlugin(engine);
  }, []);

  useEffect(() => {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.inset = '0';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  if (!container) return null;

  return createPortal(
    <Particles
      init={init}
      options={{
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: { value: 110, density: { enable: true, area: 800 } },
          color: { value: ["#ff4500", "#ff8c00", "#ffff00"] },
          shape: { type: "circle" },
          opacity: { value: 0.9, random: true },
          size: { value: { min: 3, max: 7 } },
          move: { direction: "top", enable: true, speed: 2.6, outModes: { default: "out" } },
          life: { duration: { value: 2 }, count: 0 },
        },
        emitters: {
          direction: "top",
          rate: { quantity: 8, delay: 0.05 },
          size: { width: 0, height: 0 },
          position: { x: 50, y: 95 },
        },
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
      }}
    />,
    container
  );
}
