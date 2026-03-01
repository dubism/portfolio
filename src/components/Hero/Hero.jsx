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
      <ScrollReveal delay={400}>
        <div className={styles.scrollHint}>
          <span className={styles.scrollLine} />
          <span>Scroll</span>
        </div>
      </ScrollReveal>
    </section>
  );
}
