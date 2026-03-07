'use client';

import { useCallback } from 'react';
import hero from '@/data/hero';
import projects from '@/data/projects';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './Hero.module.css';
import { TAG_COLORS, FEATURED_TAGS } from '@/data/tagColors';

const SCROLL_OFFSET = 80;
const HIGHLIGHT_CLASS = 'projectHighlight';

export default function Hero() {
  const handleTagClick = useCallback((tag) => {
    const project = projects.find((p) => (p.tags || []).includes(tag));
    if (!project) return;
    const el = document.getElementById(project.id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });

    setTimeout(() => {
      el.classList.add(HIGHLIGHT_CLASS);
      setTimeout(() => {
        el.classList.remove(HIGHLIGHT_CLASS);
      }, 1200);
    }, 500);
  }, []);

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
            <button
              key={tag}
              className={styles.heroDomain}
              style={{ backgroundColor: TAG_COLORS[tag] || '#888' }}
              onClick={() => handleTagClick(tag)}
              type="button"
            >
              {tag}
            </button>
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
