"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Linkedin, Mail, Moon, RotateCcw, Sun, Twitter } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../lib/projects";

export type PageName = "home" | "projects" | "about";

export function AmbientHero({ about = false }: { about?: boolean }) {
  return (
    <section className={`ambient ${about ? "ambient--about" : ""}`} aria-hidden="true">
      {!about ? <WaveField /> : null}
      {about ? <PolaroidStrip /> : null}
    </section>
  );
}

function PolaroidStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    stripRef.current?.style.setProperty("--px", px.toFixed(3));
    stripRef.current?.style.setProperty("--py", py.toFixed(3));
  };
  const reset = () => {
    stripRef.current?.style.setProperty("--px", "0");
    stripRef.current?.style.setProperty("--py", "0");
  };
  return <div ref={stripRef} className="card-fan polaroid-strip" onPointerMove={move} onPointerLeave={reset}>
    {Array.from({ length: 6 }, (_, i) => <i key={i} style={{ "--i": i, "--depth": (i % 3) + 1 } as React.CSSProperties}><span /></i>)}
  </div>;
}

function WaveField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Array<{ x: number; y: number; drift: number; phase: number; depth: number; size: number }> = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * scale));
      canvas.height = Math.max(1, Math.floor(height * scale));
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const count = Math.max(70, Math.min(150, Math.round(width / 15)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.72,
        drift: 0.008 + Math.random() * 0.013,
        phase: Math.random() * Math.PI * 2,
        depth: 0.35 + Math.random() * 0.65,
        size: 0.45 + Math.random() * 1.15,
      }));
    };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        const wave = Math.sin(particle.x * 0.008 + time * particle.drift + particle.phase) * (8 + particle.depth * 16);
        const sway = Math.cos(particle.y * 0.012 + time * particle.drift * 0.7 + particle.phase) * 10;
        const x = (particle.x + time * particle.drift * 4 + sway + width) % width;
        const y = particle.y + wave;
        const alpha = 0.025 + particle.depth * 0.075;
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    resize();
    draw(0);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="wave-field" />;
}

export function SiteNav({ page }: { page: PageName }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("portfolio-theme", next ? "dark" : "light");
  };
  const links: [PageName, string, string][] = [["home", "Home", "/"], ["projects", "Projects", "/projects"], ["about", "About", "/about"]];
  return (
    <nav className="site-nav" aria-label="Primary">
      {links.map(([key, label, href]) => <Link key={key} href={href} className={page === key ? "active" : ""}>{label}</Link>)}
      <button onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className="theme-button">
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </nav>
  );
}

export function ContactButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const result = await response.json();
    setMessage(result.message);
  };
  return <>
    <button className="button button--dark" onClick={() => setOpen(true)}><Mail size={17} /> Contact</button>
    {open && <div className="dialog-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <form className="contact-dialog" onSubmit={submit} onMouseDown={e => e.stopPropagation()}>
        <button type="button" className="dialog-close" onClick={() => setOpen(false)} aria-label="Close contact form">×</button>
        <p className="eyebrow">LET’S TALK</p><h2>Leave your email</h2><p>I’ll get back to you shortly.</p>
        <input aria-label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        <button className="button button--dark" type="submit">Send inquiry <ArrowRight size={16} /></button>
        {message ? <small className="form-note">{message}</small> : null}
      </form>
    </div>}
  </>;
}

export function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="button button--light">{children} <ArrowRight size={16} /></Link>;
}

export function ContactFooter() {
  return <section className="connect-section">
    <div className="connect-card">
      <div className="connect-copy"><h2>Let’s connect</h2><p>I’m always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Just reach out!</p><div className="cta-row"><ContactButton /><OutlineButton href="/projects">See projects</OutlineButton></div></div>
      <aside className="connect-meta"><div className="socials"><a href="mailto:hello@example.com" aria-label="Email"><Mail size={16} /></a><a href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn"><Linkedin size={16} /></a><a href="https://x.com" target="_blank" aria-label="X"><Twitter size={15} /></a></div><div className="copyright"><p>2026 © Built with Next.js</p><p>By React Bits Pro</p></div></aside>
    </div>
  </section>;
}

export function ProjectCard({ project }: { project: Project }) {
  return <article className="project-card"><div className="project-label"><span>{project.icon}</span>{project.name}</div><div className="project-image"><img src={project.image} alt={project.alt} /></div><div className="project-copy"><h3>{project.title}</h3><p>{project.description}</p><small>{project.role}</small></div></article>;
}

export function StackDeck() {
  const tech = ["Figma", "React", "Next.js", "TypeScript", "shadcn/ui", "Cursor", "GSAP", "GitHub", "Vercel", "Tailwind CSS"];
  const [order, setOrder] = useState(() => tech.map((_, index) => index));
  const [paused, setPaused] = useState(false);
  const cycle = () => setOrder(current => [...current.slice(1), current[0]]);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(cycle, 3200);
    return () => window.clearInterval(timer);
  }, [paused]);
  const reset = () => setOrder(tech.map((_, index) => index));
  return <div className="stack-wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <button className="reset-stack" onClick={reset} aria-label="Reset stack"><RotateCcw size={15} /></button>
    <div className="stack-deck">{order.slice(0, 6).map((techIndex, depth) => {
      const name = tech[techIndex];
      const rotation = [-3.8, 3.1, -1.8, 4.4, -4.8, 2.2][depth];
      return <motion.button key={name} type="button" className="stack-card" style={{ zIndex: 20 - depth }}
        initial={false}
        animate={{ x: depth * 13, y: depth * -9, scale: 1 - depth * 0.045, rotate: rotation, opacity: 1 - depth * 0.09 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        drag={depth === 0}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.65}
        onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 55 || Math.abs(info.offset.y) > 55) cycle(); }}
        onClick={() => depth === 0 && cycle()}>
        <span className={`stack-mark stack-mark--${techIndex % 5}`}>{name.slice(0, 2)}</span><strong>{name}</strong><small>Design stack</small>
      </motion.button>;
    })}</div>
    <p className="stack-hint">Drag or click to explore</p>
  </div>;
}

export function ExpandExperience() {
  const [expanded, setExpanded] = useState(false);
  const items = [["Linear", "Senior Design Engineer", "Mar 2024 – Present"], ["Vercel", "Product Designer", "Aug 2022 – Feb 2024"], ["Stripe", "Design Engineer", "Jun 2021 – Jul 2022"], ["Figma", "UI Engineer", "Sep 2019 – May 2021"], ["Notion", "Product Designer", "Jan 2018 – Aug 2019"], ["Airbnb", "Design Intern", "May 2017 – Dec 2017"], ["Freelance", "Designer & Developer", "2015 – 2017"]];
  const row = ([brand, role, date]: string[], i: number) => <div className="timeline-row" key={brand}><span className={`brand-mark mark-${i}`}>{brand[0]}</span><div><b>{brand}</b><p>{role}<i />{date}</p></div></div>;
  return <div className={`timeline experience-timeline ${expanded ? "is-expanded" : ""}`}>{items.slice(0, 2).map(row)}<AnimatePresence initial={false}>{expanded ? items.slice(2).map((item, i) => <motion.div key={item[0]} initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ duration: .32, ease: [.22, 1, .36, 1] }} className="experience-motion-row">{row(item, i + 2)}</motion.div>) : null}</AnimatePresence><button className="more-button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Show 5 more"}<ChevronDown size={15} className={expanded ? "flip" : ""} /></button></div>;
}

export function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={`scroll-fade ${className}`} initial={{ opacity: 0, y: 24, filter: "blur(5px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .16 }} transition={{ duration: .65, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
