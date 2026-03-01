import Hero from '@/components/Hero/Hero';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import About from '@/components/About/About';
import Contact from '@/components/Contact/Contact';
import SectionDivider from '@/components/SectionDivider/SectionDivider';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import projects from '@/data/projects';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Hero />
      <SectionDivider />
      <section className={styles.projects} id="work">
        <ScrollReveal>
          <div className={styles.projectsLabel}>Selected Work</div>
        </ScrollReveal>
        <div className={styles.projectsGrid}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
      <SectionDivider />
      <About />
      <SectionDivider />
      <Contact />
    </>
  );
}
