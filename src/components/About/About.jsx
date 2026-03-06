import about from '@/data/about';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './About.module.css';

export default function About() {
  return (
    <section className={styles.section} id="about">
      <ScrollReveal>
        <div className={styles.label}>About</div>
        <p className={styles.bio}>{about.bio}</p>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <p className={styles.education}>{about.education}</p>
      </ScrollReveal>
    </section>
  );
}
