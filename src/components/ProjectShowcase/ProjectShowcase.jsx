'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ProjectShowcase.module.css';

export default function ProjectShowcase({ project }) {
  const imageRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Desktop: IntersectionObserver tracks which image is in view
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    if (mq.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.35, rootMargin: '-8% 0px -8% 0px' }
    );

    imageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [project.images.length]);

  // Mobile: horizontal parallax on images
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    if (!mq.matches) return;

    let ticking = false;

    const update = () => {
      imageRefs.current.forEach((block) => {
        if (!block) return;
        const inner = block.querySelector('[data-parallax]');
        if (!inner) return;
        const rect = block.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = 1 - (rect.top + rect.height) / (vh + rect.height);
        const t = Math.max(0, Math.min(1, progress));
        const tx = (t - 0.5) * 14;
        inner.style.transform = `scale(1.15) translateX(${tx}%)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.showcase}>
      {/* Desktop: sticky text column */}
      <div className={styles.textColumn}>
        <div className={styles.textSticky}>
          <p className={styles.projectLabel}>Project</p>
          <h2 className={styles.projectName}>{project.name}</h2>
          <p className={styles.projectHeadline}>{project.headline}</p>

          <div className={styles.descriptions}>
            {project.images.map((img, i) => (
              <div
                key={i}
                className={`${styles.desc} ${
                  activeIndex === i ? styles.descActive : ''
                }`}
              >
                <p className={styles.descText}>{img.description}</p>
                <span className={styles.counter}>
                  {i + 1} / {project.images.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className={styles.imageColumn}>
        {project.images.map((img, i) => (
          <div
            key={i}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            data-index={i}
            className={styles.imageBlock}
          >
            <div className={styles.imageFrame}>
              <div className={styles.imageInner} data-parallax>
                {img.src ? (
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={styles.img}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <span className={styles.placeholderText}>{img.alt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: project info on first image */}
            {i === 0 && (
              <div className={styles.mobileHeader}>
                <p className={styles.mobileLabel}>Project</p>
                <h2 className={styles.mobileName}>{project.name}</h2>
                <p className={styles.mobileHeadline}>{project.headline}</p>
              </div>
            )}

            {/* Mobile: description overlay */}
            <div className={styles.mobileOverlay}>
              <p className={styles.mobileDesc}>{img.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
