'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './ProjectShowcase.module.css';

export default function ProjectShowcase({ project }) {
  const showcaseRef = useRef(null);
  const imageColumnRef = useRef(null);
  const imageRefs = useRef([]);
  const textBlocksRef = useRef([]);
  const chipsRef = useRef(null);
  const clusterRef = useRef(null);

  // ---- Desktop: scroll-scrubbed text animation ----
  const updateDesktop = useCallback(() => {
    const images = imageRefs.current.filter(Boolean);
    const textBlocks = textBlocksRef.current.filter(Boolean);
    const count = images.length;
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      const img = images[i];
      const text = textBlocks[i];
      if (!img || !text) continue;

      const rect = img.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 = image top at viewport bottom, 1 = image bottom at viewport top
      const raw = (vh - rect.top) / (vh + rect.height);
      const progress = Math.max(0, Math.min(1, raw));

      // Active zone: image is centred roughly between 0.25–0.75
      const enterStart = 0.2;
      const enterEnd = 0.35;
      const exitStart = 0.65;
      const exitEnd = 0.8;

      let opacity, translateY;

      if (progress <= enterStart) {
        // Below viewport — waiting, positioned below
        opacity = 0;
        translateY = 60;
      } else if (progress <= enterEnd) {
        // Entering — scrub from below to centre
        const t = (progress - enterStart) / (enterEnd - enterStart);
        const eased = easeOutCubic(t);
        opacity = eased;
        translateY = 60 * (1 - eased);
      } else if (progress <= exitStart) {
        // Fully visible
        opacity = 1;
        translateY = 0;
      } else if (progress <= exitEnd) {
        // Exiting — scrub from centre upward
        const t = (progress - exitStart) / (exitEnd - exitStart);
        const eased = easeInCubic(t);
        opacity = 1 - eased;
        translateY = -60 * eased;
      } else {
        // Above viewport — gone
        opacity = 0;
        translateY = -60;
      }

      text.style.opacity = opacity;
      text.style.transform = `translateY(${translateY}px)`;
    }
  }, []);

  // ---- Mobile: parallax + cluster gap animation ----
  const updateMobile = useCallback(() => {
    // Image parallax
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

    // Cluster horizontal gap animation
    const cluster = clusterRef.current;
    if (!cluster) return;
    const rect = cluster.getBoundingClientRect();
    const vh = window.innerHeight;
    const centreProgress = (vh - rect.top) / (vh + rect.height);
    const clamped = Math.max(0, Math.min(1, centreProgress));
    // Gap is max at edges (0 and 1), zero when centred (0.5)
    const distFromCentre = Math.abs(clamped - 0.5) * 2;
    const maxGap = 16;
    const gap = maxGap * easeInCubic(distFromCentre);
    cluster.style.marginLeft = `${gap}px`;
    cluster.style.marginRight = `${gap}px`;
  }, []);

  // ---- Chips fade (desktop, scroll-linked) ----
  const updateChips = useCallback(() => {
    const chips = chipsRef.current;
    const showcase = showcaseRef.current;
    if (!chips || !showcase) return;

    const rect = showcase.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = (vh - rect.top) / (vh + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));

    const fadeIn = 0.08;
    const fadeInEnd = 0.18;
    const fadeOut = 0.82;
    const fadeOutEnd = 0.92;

    let opacity;
    if (clamped <= fadeIn) {
      opacity = 0;
    } else if (clamped <= fadeInEnd) {
      opacity = easeOutCubic((clamped - fadeIn) / (fadeInEnd - fadeIn));
    } else if (clamped <= fadeOut) {
      opacity = 1;
    } else if (clamped <= fadeOutEnd) {
      opacity = 1 - easeInCubic((clamped - fadeOut) / (fadeOutEnd - fadeOut));
    } else {
      opacity = 0;
    }
    chips.style.opacity = opacity;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const isDesktop = !mq.matches;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (isDesktop) {
          updateDesktop();
          updateChips();
        } else {
          updateMobile();
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Run once on mount so initial state is correct
    requestAnimationFrame(() => {
      if (isDesktop) {
        updateDesktop();
        updateChips();
      } else {
        updateMobile();
      }
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, [updateDesktop, updateMobile, updateChips]);

  return (
    <div className={styles.showcase} ref={showcaseRef}>
      {/* Desktop: sticky text column */}
      <div className={styles.textColumn}>
        <div className={styles.textSticky}>
          <p className={styles.projectLabel}>Project</p>
          <h2 className={styles.projectName}>{project.name}</h2>
          <p className={styles.projectHeadline}>{project.headline}</p>

          {/* Inline chips — desktop */}
          {project.tags && (
            <div className={styles.chips} ref={chipsRef}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.chip}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className={styles.descriptions}>
            {project.images.map((img, i) => (
              <div
                key={i}
                ref={(el) => {
                  textBlocksRef.current[i] = el;
                }}
                className={styles.desc}
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
      <div className={styles.imageColumn} ref={imageColumnRef}>
        {/* Seamless cluster wrapper */}
        <div className={styles.cluster} ref={clusterRef}>
          {project.images.map((img, i) => (
            <div
              key={i}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              data-index={i}
              className={`${styles.imageBlock} ${
                i === 0
                  ? styles.imageBlockFirst
                  : i === project.images.length - 1
                  ? styles.imageBlockLast
                  : styles.imageBlockMiddle
              }`}
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
                  {project.tags && (
                    <div className={styles.mobileChips}>
                      {project.tags.map((tag) => (
                        <span key={tag} className={styles.mobileChip}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
    </div>
  );
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t) {
  return t * t * t;
}
