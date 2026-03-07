import hero from '@/data/hero';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './Hero.module.css';
import { TAG_COLORS, FEATURED_TAGS } from '@/data/tagColors';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <ScrollReveal>
        <h1 className={styles.name}>{hero.name}</h1>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <p className={styles.tagline}>{hero.tagline}</p>
      </ScrollReveal>
      <ScrollReveal delay={300}>
        <div className={styles.heroDomains}>
          {FEATURED_TAGS.map((tag) => (
            <span
              key={tag}
              className={styles.heroDomain}
              style={{ backgroundColor: TAG_COLORS[tag] || '#888' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollReveal>
      <div className={styles.scrollHint} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
