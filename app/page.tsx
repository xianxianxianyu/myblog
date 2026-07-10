import { AmbientHero, ContactButton, ContactFooter, OutlineButton, ProjectCard, SiteNav } from "../components/site-shell";
import { projects } from "../lib/projects";

export default function Home() {
  const featured = [projects[0], projects[2], projects[1], projects[3]];
  return <><main id="main-content"><AmbientHero /><SiteNav page="home" /><section className="home-hero"><div className="hero-copy reveal"><p className="hello">Hey👋, I’m Josh</p><h1>Design engineer &<br />AI enthusiast</h1><p className="hero-subtitle">Independent engineer focused on interfaces that feel calm, considered, and quietly fast.</p><div className="cta-row"><ContactButton /><OutlineButton href="/projects">View My Work</OutlineButton></div></div><div className="portrait reveal reveal--late"><img src="/assets/josh.webp" alt="Josh portrait" /></div></section><section className="projects-section"><header className="section-heading"><h2>My projects</h2><p>From playful experiments to thoughtful systems, a look at the work I’m proud to have shipped.</p></header><div className="project-grid">{featured.map(project => <ProjectCard key={project.name} project={project} />)}</div><div className="center-action"><OutlineButton href="/projects">View all projects</OutlineButton></div></section><ContactFooter /></main></>;
}
