import React from "react";
import AppEnhanced from "./AppEnhanced";
import FireParticles from "./components/FireParticles";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <FireParticles />
      <AppEnhanced /> {/* Your enhanced app content */}
      <h1 style={{ position: "absolute", top: "40%", left: "40%", color: "#fff" }}>
        🔥 Welcome 🔥
      </h1>
    </div>
  );
}
