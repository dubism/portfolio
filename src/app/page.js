import Hero from '@/components/Hero/Hero';
import ProjectShowcase from '@/components/ProjectShowcase/ProjectShowcase';
import About from '@/components/About/About';
import Contact from '@/components/Contact/Contact';
import SectionDivider from '@/components/SectionDivider/SectionDivider';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import FloatingCTA from '@/components/FloatingCTA/FloatingCTA';
import projects from '@/data/projects';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <FloatingCTA />
      <Hero />
      <SectionDivider />
      <section className={styles.projects} id="work">
        <ScrollReveal>
          <div className={styles.projectsLabel}>Selected Work</div>
        </ScrollReveal>
        <div className={styles.showcaseList}>
          {projects.map((project) => (
            <ProjectShowcase key={project.id} project={project} />
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
