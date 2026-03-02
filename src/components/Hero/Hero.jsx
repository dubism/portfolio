import hero from '@/data/hero';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <ScrollReveal>
        <h1 className={styles.name}>{hero.name}</h1>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <div className={styles.domains}>
          {hero.domains.map((d) => (
            <span key={d} className={styles.domain}>{d}</span>
          ))}
        </div>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <p className={styles.tagline}>{hero.tagline}</p>
      </ScrollReveal>
      <div className={styles.scrollHint} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
