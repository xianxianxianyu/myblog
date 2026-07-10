import { AmbientHero, ContactFooter, ProjectCard, SiteNav } from "../../components/site-shell";
import { projects } from "../../lib/projects";

export default function ProjectsPage() {
  return <main id="main-content"><AmbientHero /><SiteNav page="projects" /><section className="project-page-intro"><h1>My recent work</h1><p>Experiments, collaborations, and projects<br />I’m especially proud to have shipped.</p></section><section className="projects-section projects-section--all"><div className="project-grid">{projects.map(project => <ProjectCard key={project.name} project={project} />)}</div></section><ContactFooter /></main>;
}
