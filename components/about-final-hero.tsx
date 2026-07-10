"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, Asterisk, ChevronDown, Mail, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "./site-shell";
import styles from "./about-final-hero.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const experience = [
  ["L", "Linear", "Senior Design Engineer", "Mar 2024 – Present"],
  ["V", "Vercel", "Product Designer", "Aug 2022 – Feb 2024"],
  ["S", "Stripe", "Design Engineer", "Jun 2021 – Jul 2022"],
  ["F", "Figma", "UI Engineer", "Sep 2019 – May 2021"],
  ["N", "Notion", "Product Designer", "Jan 2018 – Aug 2019"],
  ["A", "Airbnb", "Design Intern", "May 2017 – Dec 2017"],
  ["＋", "Independent", "Designer & Developer", "2015 – 2017"],
];
const education = [
  ["R", "Rhode Island School of Design", "BFA, Graphic Design", "2013 – 2017"],
  ["S", "Stanford University", "HCI Certificate, d.school", "2018"],
  ["B", "Bruno Simon’s Three.js Journey", "WebGL & Shaders", "2022"],
];
const capabilities = ["UI/UX Design", "Design Systems", "Prototyping & Motion", "Frontend Development", "TypeScript & React", "Interaction Design", "Performance Tuning", "Accessibility", "Visual Identity"];
const tools = ["Figma", "React", "TypeScript", "Next.js", "Vercel", "Cursor", "GitHub", "GSAP", "Tailwind", "shadcn/ui"];
const initialToolLayout = tools.map((_, index) => ({ x: 7 + (index * 9.1) % 77, y: 46 + (index % 3) * 15, rotate: [-13, 7, -5, 11, -9, 5, 13, -7, 4, -11][index] }));

function OceanField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const lensCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const lensCanvas = lensCanvasRef.current;
    if (!canvas || !host || !lensCanvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    const lensContext = lensCanvas.getContext("2d");
    if (!gl || !lensContext) return;

    const vertexSource = `
      attribute vec2 position;
      void main(){ gl_Position = vec4(position, 0.0, 1.0); }
    `;
    const fragmentSource = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;
      uniform float disturbance;
      uniform float darkMode;
      uniform float seed;
      uniform float waveMode;

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.)), f.x), f.y);
      }
      float fbm(vec2 p){
        float value = 0.0;
        float amp = .52;
        mat2 turn = mat2(.82, -.57, .57, .82);
        for(int i=0;i<5;i++){
          value += amp * noise(p);
          p = turn * p * 1.92 + 7.13;
          amp *= .48;
        }
        return value;
      }
      void main(){
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
        float t = time * .053;
        vec2 delta = (uv - mouse) * aspect;
        float distanceToPointer = length(delta);
        float glassLens = exp(-distanceToPointer * distanceToPointer * 175.0) * disturbance;
        vec2 direction = distanceToPointer > .001 ? normalize(delta) : vec2(0.0);

        vec2 p = uv;
        p -= direction * glassLens * .005;
        float slowNoise = fbm(vec2(p.x * 1.16 + t * .7, p.y * .38 - t * .1));
        float emittedWaves = 0.0;
        float crestField = 0.0;
        for(int i = 0; i < 6; i++){
          float fi = float(i);
          float seeded = seed * .731 + fi * 4.173;
          vec2 origin = vec2(
            hash(vec2(seeded + 1.3, 7.1 + seed)),
            hash(vec2(seeded * 1.41 + 4.8, 2.6 + seed * .37))
          );
          float randomSpeed = .82 + hash(vec2(seeded + 9.2, 3.7)) * .42;
          float randomPhase = hash(vec2(seeded + 3.9, 9.8)) * 6.28318;
          float sourceWave = 0.0;
          float sourceEnvelope = 1.0;
          float randomAmplitude = .13;

          if(waveMode < .5){
            origin += vec2(sin(t * .13 + seeded) * .028, cos(t * .11 + seeded) * .02);
            float angle = -.11 + hash(vec2(seeded + 4.1, 6.7)) * .22 + sin(t * .08 + seeded) * .026;
            vec2 direction = vec2(cos(angle), sin(angle));
            vec2 normal = vec2(-direction.y, direction.x);
            vec2 sourceDelta = (p - origin) * aspect;
            float along = dot(sourceDelta, direction);
            float across = dot(sourceDelta, normal);
            float curveDirection = hash(vec2(seeded + 8.4, 1.9)) > .5 ? 1.0 : -1.0;
            float curvedFront = across + curveDirection * along * along * (.026 + hash(vec2(seeded, 5.4)) * .035);
            float sourcePhase = curvedFront * (8.4 + hash(vec2(seeded, 4.2)) * 1.6) - t * (1.08 + randomSpeed) + randomPhase + (slowNoise - .5) * .18;
            sourceWave = sin(sourcePhase);
            sourceEnvelope = .73 + .27 * (1.0 - smoothstep(.22, 1.38, abs(along)));
            randomAmplitude = .084 + hash(vec2(seeded, 2.2)) * .018;
          } else if(waveMode < 1.5){
            float family = mod(fi, 2.0) < 1.0 ? -1.0 : 1.0;
            float angle = family * (.23 + hash(vec2(seeded + 4.1, 6.7)) * .15) + sin(t * .09 + seeded) * .035;
            vec2 direction = vec2(cos(angle), sin(angle));
            vec2 normal = vec2(-direction.y, direction.x);
            vec2 sourceDelta = (p - origin) * aspect;
            float along = dot(sourceDelta, direction);
            float across = dot(sourceDelta, normal);
            float curvedFront = across + family * along * along * (.032 + hash(vec2(seeded, 5.4)) * .035);
            float sourcePhase = curvedFront * (9.15 + hash(vec2(seeded, 4.2)) * 1.45) - t * (1.18 + randomSpeed) + randomPhase + (slowNoise - .5) * .2;
            sourceWave = sin(sourcePhase);
            sourceEnvelope = .68 + .32 * (1.0 - smoothstep(.2, 1.34, abs(along)));
            randomAmplitude = .078 + hash(vec2(seeded, 2.2)) * .02;
          } else {
            float family = mod(fi, 2.0) < 1.0 ? -1.0 : 1.0;
            float lateralCurve = sin(p.y * (2.15 + hash(vec2(seeded, 5.4)) * .7) + seeded) * (.15 + hash(vec2(seeded, 7.2)) * .1);
            float sourcePhase = (p.x * aspect.x + lateralCurve + p.y * family * .22) * (6.15 + hash(vec2(seeded, 4.2)) * 1.1) - t * (.92 + randomSpeed) + randomPhase + (slowNoise - .5) * .12;
            sourceWave = sin(sourcePhase);
            sourceEnvelope = .88 + .12 * sin(p.y * 3.1 + seeded);
            randomAmplitude = .054 + hash(vec2(seeded, 2.2)) * .014;
          }

          emittedWaves += sourceWave * sourceEnvelope * randomAmplitude;
          crestField += smoothstep(.76, .97, sourceWave) * sourceEnvelope;
        }
        float underCurrent = sin(p.y * 4.35 - p.x * 1.1 + slowNoise * .75 + t * .48);
        float surface = emittedWaves + underCurrent * .075;
        float waveBody = surface + (slowNoise - .5) * .105;
        waveBody += glassLens * .008;

        float shade = pow(smoothstep(-.43, .46, waveBody), 1.18);
        float crest = smoothstep(1.48, 2.48, crestField) * .58 + smoothstep(.34, .7, waveBody) * .22;
        float trough = (1.0 - smoothstep(-.56, -.18, surface)) * .095;
        vec3 paper = mix(vec3(.941, .937, .914), vec3(.032, .035, .041), darkMode);
        vec3 waveColor = mix(vec3(.25, .27, .28), vec3(.955, .965, .985), darkMode);
        vec3 crestColor = mix(vec3(.11, .12, .13), vec3(1.0), darkMode);
        float waveMix = .012 + shade * mix(.22, .3, darkMode) + trough * mix(.72, .52, darkMode);
        vec3 color = mix(paper, waveColor, waveMix);
        color = mix(color, crestColor, crest * mix(.34, .38, darkMode));
        float edge = smoothstep(.82, .25, length((uv - .5) * vec2(.78, 1.0)));
        color = mix(paper, color, .78 + edge * .22);
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");
    const mouse = gl.getUniformLocation(program, "mouse");
    const disturbance = gl.getUniformLocation(program, "disturbance");
    const darkMode = gl.getUniformLocation(program, "darkMode");
    const seed = gl.getUniformLocation(program, "seed");
    const waveMode = gl.getUniformLocation(program, "waveMode");

    let width = 1;
    let height = 1;
    let frame = 0;
    let targetX = .5;
    let targetY = .5;
    let currentX = .5;
    let currentY = .5;
    let energy = 0;
    let targetEnergy = 0;
    let previousX = .5;
    let previousY = .5;
    let delayedX = .5;
    let delayedY = .5;
    let isDark = document.documentElement.dataset.theme === "dark";
    const seedValue = Math.random() * 97.0 + 3.0;
    const modeValue = Math.floor(Math.random() * 3);
    canvas.dataset.waveMode = ["tide", "cross-swell", "side-drift"][modeValue];
    const pointerHistory: Array<{ x: number; y: number; energy: number; at: number }> = [];
    const themeObserver = new MutationObserver(() => { isDark = document.documentElement.dataset.theme === "dark"; });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width * scale));
      height = Math.max(1, Math.round(rect.height * scale));
      canvas.width = width;
      canvas.height = height;
      lensCanvas.width = 220;
      lensCanvas.height = 220;
      lensContext.imageSmoothingEnabled = true;
      lensContext.imageSmoothingQuality = "high";
      gl.viewport(0, 0, width, height);
    };
    const pointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const velocity = Math.hypot(x - previousX, y - previousY);
      pointerHistory.push({ x, y, energy: Math.min(1, .12 + velocity * 14), at: performance.now() });
      if (pointerHistory.length > 24) pointerHistory.shift();
      previousX = x;
      previousY = y;
    };
    const pointerLeave = () => { targetEnergy = 0; };
    const draw = (now: number) => {
      const delayedTime = now - 120;
      while (pointerHistory.length && pointerHistory[0].at <= delayedTime) {
        const point = pointerHistory.shift();
        if (point) {
          delayedX = point.x;
          delayedY = point.y;
          targetEnergy = point.energy;
        }
      }
      targetX = delayedX;
      targetY = delayedY;
      currentX += (targetX - currentX) * .14;
      currentY += (targetY - currentY) * .14;
      energy += (targetEnergy - energy) * .12;
      targetEnergy *= .96;
      if (lensRef.current) {
        lensRef.current.style.setProperty("--lens-x", `${currentX * 100}%`);
        lensRef.current.style.setProperty("--lens-y", `${(1 - currentY) * 100}%`);
        lensRef.current.style.setProperty("--lens-opacity", `${Math.min(1, energy * 1.6)}`);
      }
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(time, reducedMotion ? 0 : now * .001);
      gl.uniform2f(mouse, currentX, currentY);
      gl.uniform1f(disturbance, reducedMotion ? 0 : energy);
      gl.uniform1f(darkMode, isDark ? 1 : 0);
      gl.uniform1f(seed, seedValue);
      gl.uniform1f(waveMode, modeValue);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      const sourceSize = Math.min(width, height) * .115;
      const sourceX = currentX * width - sourceSize / 2;
      const sourceY = (1 - currentY) * height - sourceSize / 2;
      lensContext.clearRect(0, 0, 220, 220);
      lensContext.drawImage(canvas, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 220, 220);
      frame = requestAnimationFrame(draw);
    };
    resize();
    host.addEventListener("pointermove", pointerMove);
    host.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", pointerMove);
      host.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <><canvas ref={canvasRef} className={styles.oceanField} aria-hidden="true" /><span ref={lensRef} className={styles.glassLens} aria-hidden="true"><canvas ref={lensCanvasRef} /></span></>;
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay, ease }}>{children}</motion.div>;
}

function ProfileRow({ item, index }: { item: string[]; index: number }) {
  return <div className={styles.profileRow}>
    <span className={styles.profileMark} data-index={index}>{item[0]}</span>
    <div><b>{item[1]}</b><p>{item[2]}<i />{item[3]}</p></div>
  </div>;
}

function ExperiencePanel() {
  const [expanded, setExpanded] = useState(false);
  return <div className={styles.profilePanel}>
    {experience.slice(0, 2).map((item, index) => <ProfileRow key={item[1]} item={item} index={index} />)}
    <AnimatePresence initial={false}>
      {expanded ? experience.slice(2).map((item, index) => <motion.div className={styles.revealRow} key={item[1]} initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ duration: .32, delay: index * .025, ease }}><ProfileRow item={item} index={index + 2} /></motion.div>) : null}
    </AnimatePresence>
    <button className={styles.expand} onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{expanded ? "Show less" : "Show 5 more"}<ChevronDown size={14} className={expanded ? styles.flipped : ""} /></button>
  </div>;
}

function ToolPile() {
  const [layout, setLayout] = useState(initialToolLayout);
  const reset = () => setLayout(tools.map(() => ({ x: 5 + Math.random() * 78, y: 42 + Math.random() * 37, rotate: -14 + Math.random() * 28 })));
  return <div className={styles.toolPile}>
    <button className={styles.resetTools} onClick={reset} aria-label="Reshuffle tools"><RotateCcw size={14} /></button>
    <p>Things I reach for often.</p>
    {tools.map((tool, index) => <motion.button key={tool} className={styles.toolChip} drag dragConstraints={{ left: -50, right: 50, top: -45, bottom: 25 }} dragElastic={.25} whileDrag={{ scale: 1.05, zIndex: 20 }} animate={{ left: `${layout[index].x}%`, top: `${layout[index].y}%`, rotate: layout[index].rotate }} transition={{ type: "spring", stiffness: 210, damping: 21 }}><span>{tool.slice(0, 1)}</span>{tool}</motion.button>)}
    <small>Drag a tool, or reshuffle the pile.</small>
  </div>;
}

export function AboutFinalHero() {
  return <main className={styles.page}>
    <div className={styles.sharedNav}><SiteNav page="about" /></div>

    <section className={styles.hero}>
      <OceanField />
      <div className={styles.statement}>
        <Reveal delay={.08}><p>I care about the moment</p></Reveal>
        <Reveal delay={.16}><h1>complex things</h1></Reveal>
        <Reveal delay={.24} className={styles.lastLine}><h1>begin to feel <em>obvious.</em></h1><span className={styles.note}>Not simplified.<br />Understood.</span></Reveal>
      </div>
      <Reveal delay={.34} className={styles.heroBottom}>
        <div className={styles.introCopy}><Asterisk size={17} /><p>I design and build digital products where the interface, the interaction, and the implementation feel like one considered decision.</p></div>
        <motion.figure className={styles.portrait} initial={{ opacity: 0, rotate: 3, scale: .96 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 1, delay: .42, ease }}><Image src="/assets/josh.webp" alt="Josh Mercer at his desk" width={420} height={420} priority /><figcaption><span>Josh, in his element</span><span>2026</span></figcaption></motion.figure>
        <a className={styles.scroll} href="#details"><ArrowDown size={15} /> The practical details</a>
      </Reveal>
    </section>

    <section id="details" className={styles.details}>
      <motion.header className={styles.detailsIntro} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .75, ease }}>
        <p>The practical details</p><h2>A short record of where I’ve learned, contributed, and kept sharpening the craft.</h2><span>Quiet evidence for the statement above.</span>
      </motion.header>
      <div className={styles.profileColumns}>
        <motion.section className={styles.profileSection} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, ease }}><h3><span>01</span>Experience</h3><ExperiencePanel /></motion.section>
        <motion.section className={styles.profileSection} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, ease }}><h3><span>02</span>Education</h3><div className={styles.profilePanel}>{education.map((item, index) => <ProfileRow key={item[1]} item={item} index={index + 7} />)}</div></motion.section>
        <motion.section className={styles.profileSection} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7, ease }}><h3><span>03</span>What I do</h3><div className={`${styles.profilePanel} ${styles.capabilityPanel}`}>{capabilities.map(item => <span key={item}>{item}</span>)}</div></motion.section>
        <motion.section className={styles.profileSection} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, ease }}><h3><span>04</span>Stack</h3><ToolPile /></motion.section>
      </div>
    </section>

    <section className={styles.contactStrip}><p>If the way I think feels useful to what you’re making—</p><a href="mailto:hello@example.com"><Mail size={16} /> Let’s talk <ArrowUpRight size={15} /></a></section>
    <footer className={styles.footer}><span>© 2026 Josh Mercer</span><span>Design engineer · Denver, CO</span><span>Designed with restraint</span></footer>
  </main>;
}
