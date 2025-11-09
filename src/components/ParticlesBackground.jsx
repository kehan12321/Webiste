import React from 'react';
import { Particles } from "react-tsparticles";

const ParticlesBackground = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          fpsLimit: 60,
          detectRetina: true,
          particles: {
            number: { value: 75, density: { enable: true, area: 800 } },
            color: { value: ["#a855f7", "#ec4899"] },
            links: { enable: true, color: "#a855f7", distance: 140, opacity: 0.3, width: 1 },
            move: { enable: true, speed: 0.8, direction: "none", outModes: { default: "out" } },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
            shape: { type: "circle" },
          },
          interactivity: {
            detectsOn: "window",
            events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: false } },
            modes: { repulse: { distance: 120, duration: 0.4 } },
          },
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
