/**
 * Physics Lab — central content registry.
 * Keeps routing, nav, and page content in one place so the
 * multi-page build stays coherent.
 */

export const SIMS = [
  {
    id: "projectile",
    index: "01",
    tag: "SIM·01 / Trajectory",
    title: "Projectile Motion",
    short: "Parabolic trajectories under uniform gravity.",
    desc: "Launch at 45° and watch the parabola draw itself. Gravity, velocity and time stop being symbols and become a shape you can see.",
    long: "Projectile motion is the simplest two-dimensional movement: horizontal velocity stays constant, vertical velocity changes at a constant rate. This lab lets you vary launch angle, initial speed, and gravitational field to see how range, flight time and apex respond. The predicted path is drawn dashed; the live path overwrites it in real time.",
    equation: "x(t) = v₀·t·cos θ",
    equations: ["x(t)=v₀·cosθ·t", "y(t)=v₀·sinθ·t - ½gt²", "R=v₀²·sin2θ / g", "T=2v₀·sinθ / g"],
    color: "#FFB224",
    params: {
      angle: { min: 10, max: 88, default: 45, unit: "°" },
      velocity: { min: 5, max: 32, default: 20, unit: "m/s" },
      gravity: { options: [
        { id: "earth", label: "Earth", g: 9.81 },
        { id: "moon", label: "Moon", g: 1.62 },
        { id: "mars", label: "Mars", g: 3.71 },
        { id: "jupiter", label: "Jupiter", g: 24.79 },
      ], default: "earth" }
    }
  },
  {
    id: "harmonic",
    index: "02",
    tag: "SIM·02 / Oscillation",
    title: "Simple Harmonic Motion",
    short: "Pendulums, springs and the sine that underlies them.",
    desc: "A pendulum swings while an oscilloscope records it. See how period, amplitude and phase shape one underlying wave.",
    long: "Simple harmonic motion appears everywhere a restoring force is proportional to displacement. In this lab a physical pendulum drives a scrolling oscilloscope trace — exactly how a lab data-logger would display it. Change amplitude, length and damping to see period and decay change.",
    equation: "x(t) = A·cos(ωt)",
    equations: ["θ(t)=A·sin(ωt)", "ω=√(g/L)", "T=2π√(L/g)", "x(t)=A·e^{-bt}·cos(ωt)"],
    color: "#5eead4",
    params: {
      amplitude: { min: 8, max: 45, default: 30, unit: "°" },
      length: { min: 0.6, max: 2.2, default: 1.2, unit: "m", step: 0.1 },
      damping: { min: 0, max: 0.18, default: 0.02, unit: "", step: 0.01 }
    }
  },
  {
    id: "optics",
    index: "03",
    tag: "SIM·03 / Refraction",
    title: "Optics",
    short: "Snell's law and dispersion through a prism.",
    desc: "White light slows down in glass and splits on the way out. Snell's law, told by a pulse of light bending through a prism.",
    long: "When light crosses a boundary between media its speed changes and its direction bends according to Snell's law. In glass the speed depends slightly on wavelength, so white light disperses. This lab sends a pulse through a prism — slower inside, faster outside — and lets you tune refractive index, incidence angle and wavelength.",
    equation: "n₁ sin θ₁ = n₂ sin θ₂",
    equations: ["n=c/v", "n₁sinθ₁=n₂sinθ₂", "v=c/n", "δ=(n-1)A (small)"],
    color: "#a78bfa",
    params: {
      n: { min: 1.2, max: 2.2, default: 1.52, unit: "", step: 0.02 },
      incidence: { min: -18, max: 18, default: 0, unit: "°" },
      wavelength: { min: 380, max: 750, default: 580, unit: "nm" }
    }
  }
];

export const CONCEPTS = [
  {
    id: "mechanics",
    tag: "MCN",
    title: "Mechanics",
    glyph: "parabola",
    desc: "Forces decide how things move. Velocity, acceleration, and the shapes in between.",
    long: "Mechanics starts with one idea: F = ma. From there we get trajectories, orbits, collisions and everything that moves. The key move is to treat time as a parameter and see how position evolves. In projectile motion this gives parabolas; in orbits, ellipses. Once you can draw x(t) and v(t), mechanics becomes visual.",
    principles: ["Inertia: motion continues unless forced", "F=ma: force is rate of change of momentum", "Energy is conserved when forces are conservative", "Symmetry gives conservation laws"],
    equations: ["F = m·a", "p = m·v", "K = ½m·v²", "U = m·g·h"]
  },
  {
    id: "waves",
    tag: "WAV",
    title: "Waves",
    glyph: "wave",
    desc: "Energy travels in oscillation — period, amplitude, and interference.",
    long: "A wave is a disturbance that carries energy without carrying mass. The same mathematics — sine, cosine, exponential decay — describes a pendulum, a guitar string, and light. What changes is what oscillates. Once you understand phase, superposition and resonance, most of physics starts to rhyme.",
    principles: ["Oscillation needs restoring force + inertia", "Superposition: waves add", "Resonance when drive matches natural frequency", "Interference is addition of phases"],
    equations: ["x(t)=A·cos(ωt+φ)", "ω=2πf", "v=f·λ", "E ∝ A²"]
  },
  {
    id: "light",
    tag: "OPT",
    title: "Light",
    glyph: "light",
    desc: "Waves that behave like particles: reflection, refraction, dispersion.",
    long: "Light is an electromagnetic wave that our eyes happen to detect. Its speed in vacuum is constant, but in matter it slows by factor n, the refractive index. Snell's law follows from requiring the wavefronts to match at the boundary. Because n depends on wavelength, different colors bend by different amounts — dispersion.",
    principles: ["Fermat: light takes stationary time path", "Snell: n₁sinθ₁=n₂sinθ₂", "Dispersion: n=n(λ)", "Photon energy E=h·f"],
    equations: ["c=2.998×10⁸ m/s", "n=c/v", "1/f=(n-1)(1/R₁-1/R₂)", "E=h·c/λ"]
  }
];

export const EXPERIMENTS = [
  {
    id: "galileo-ramp",
    num: "E·01",
    name: "Galileo’s Ramp",
    blurb: "Roll balls down an incline and measure acceleration with your own hands.",
    tag: "Kinematics",
    dur: "12 min",
    difficulty: "Intro",
    objective: "Measure g by timing a ball rolling down a shallow incline. You’ll see why Galileo diluted gravity to make it measurable.",
    steps: ["Set incline to 4°–8°", "Time ball over 1.2m, repeat 6×", "Plot distance vs t² — slope is ½a", "Convert a to g via a=g·sinθ"],
    result: "You should recover g ≈ 9.5–10.2 m/s² with <5% scatter if you time carefully."
  },
  {
    id: "second-pendulum",
    num: "E·02",
    name: "The Second Pendulum",
    blurb: "Find the string length that makes one full swing take exactly one second.",
    tag: "Oscillations",
    dur: "9 min",
    difficulty: "Intro",
    objective: "Find the length L where T=2s (1s each way). This was once proposed as a definition of the meter.",
    steps: ["Set L≈0.99m, time 20 swings", "Adjust L by ±2cm, re-time", "Plot T² vs L — should be linear", "Interpolate to T=2.00s"],
    result: "Expect L≈0.994m at sea level. Damping adds ~0.3% if amplitude >15°."
  },
  {
    id: "bending-light",
    num: "E·03",
    name: "Bending Light",
    blurb: "Apply Snell’s law across three media and watch the rays turn.",
    tag: "Optics",
    dur: "14 min",
    difficulty: "Intermediate",
    objective: "Measure n for acrylic by tracking a laser through a semi-circular block.",
    steps: ["Fix incident ray, rotate block", "Record refracted angle every 10°", "Plot sinθ₁ vs sinθ₂", "Slope gives n₂/n₁"],
    result: "Acrylic n≈1.49, water n≈1.33. Total internal reflection appears above critical angle."
  },
  {
    id: "charged-plates",
    num: "E·04",
    name: "Charged Plates",
    blurb: "Map the electric field between capacitor plates, line by line.",
    tag: "Electrostatics",
    dur: "16 min",
    difficulty: "Intermediate",
    objective: "Visualize E-field between parallel plates and at the edge where it fringes.",
    steps: ["Set V=40V, plate separation 6cm", "Probe potential every 1cm", "Draw equipotentials", "E = -∇V from spacing"],
    result: "Field is uniform centrally, ~V/d, and bows outward at edges."
  },
  {
    id: "standing-strings",
    num: "E·05",
    name: "Standing Strings",
    blurb: "Pin the nodes, release the harmonics, and hear the spectrum build.",
    tag: "Waves",
    dur: "11 min",
    difficulty: "Intro",
    objective: "Find the first 4 resonant modes of a string fixed at both ends.",
    steps: ["Set tension via hanging mass", "Drive with variable frequency", "Find amplitudes where string is stationary at nodes", "Check fₙ = n·v/2L"],
    result: "Frequencies should be integer multiples; inharmonicity <1% if tension dominates."
  },
  {
    id: "interference",
    num: "E·06",
    name: "Double-Slit Interference",
    blurb: "Two slits, one wavelength, bright and dark fringes from path difference.",
    tag: "Optics",
    dur: "18 min",
    difficulty: "Advanced",
    objective: "Measure wavelength from fringe spacing: λ = d·Δy / L.",
    steps: ["Set slit separation 0.1mm, screen distance 1.5m", "Measure fringe spacing", "Repeat for different d", "Recover λ"],
    result: "For 650nm laser expect Δy≈9.8mm at L=1.5m, d=0.1mm."
  }
];

export function getSim(id) { return SIMS.find(s => s.id === id); }
export function getConcept(id) { return CONCEPTS.find(c => c.id === id); }
export function getExperiment(id) { return EXPERIMENTS.find(e => e.id === id); }
