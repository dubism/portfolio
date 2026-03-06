'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './ProjectShowcase.module.css';

// ---- Fix 2: Squircle path computation ----
// c = visual corner radius; curve starts at c*1.6 from corner (iOS-style smooth start)
function squirclePath(w, h, c) {
  const e = c * 1.6; // curve start distance from corner along edge
  const d = c * 0.6; // bezier handle distance from curve endpoint
  const ex = Math.min(e, w / 2);
  const ey = Math.min(e, h / 2);
  const ratio = e > 0 ? Math.min(ex, ey) / e : 1;
  const dx = d * ratio;
  const dy = d * ratio;
  return [
    `M ${ex} 0`,
    `L ${w - ex} 0`,
    `C ${w - dx} 0 ${w} ${dy} ${w} ${ey}`,
    `L ${w} ${h - ey}`,
    `C ${w} ${h - dy} ${w - dx} ${h} ${w - ex} ${h}`,
    `L ${ex} ${h}`,
    `C ${dx} ${h} 0 ${h - dy} 0 ${h - ey}`,
    `L 0 ${ey}`,
    `C 0 ${dy} ${dx} 0 ${ex} 0`,
    'Z',
  ].join(' ');
}

const SQUIRCLE_C = 16;

export default function ProjectShowcase({ project }) {
  const showcaseRef = useRef(null);
  const imageColumnRef = useRef(null);
  const imageRefs = useRef([]);
  const textBlocksRef = useRef([]);
  const chipsRef = useRef(null);
  const clusterRef = useRef(null);

  // ---- Fix 1: Desktop scroll-scrubbed text animation ----
  // Single transitionProgress (0→1) drives both outgoing and incoming text.
  // At transitionProgress === 0.5, both texts are opacity 0.
  const updateDesktop = useCallback(() => {
    const images = imageRefs.current.filter(Boolean);
    const textBlocks = textBlocksRef.current.filter(Boolean);
    const count = images.length;
    if (count === 0) return;

    const vh = window.innerHeight;
    const ENTER_START = 0.2;
    const ENTER_END = 0.35;
    const EXIT_START = 0.65;
    const EXIT_END = 0.8;

    // Reset all to "waiting below" state
    textBlocks.forEach((text) => {
      if (!text) return;
      text.style.opacity = '0';
      text.style.transform = 'translateY(120px)';
    });

    for (let i = 0; i < count; i++) {
      const img = images[i];
      const text = textBlocks[i];
      if (!img || !text) continue;

      const rect = img.getBoundingClientRect();
      const raw = (vh - rect.top) / (vh + rect.height);
      const p = Math.max(0, Math.min(1, raw));

      // First image only: enter from below
      if (i === 0) {
        if (p <= ENTER_START) {
          text.style.opacity = '0';
          text.style.transform = 'translateY(120px)';
        } else if (p <= ENTER_END) {
          const t = (p - ENTER_START) / (ENTER_END - ENTER_START);
          const eased = easeOutCubic(t);
          text.style.opacity = String(eased);
          text.style.transform = `translateY(${120 * (1 - eased)}px)`;
        }
      }

      // Active zone: fully visible
      if (p > ENTER_END && p <= EXIT_START) {
        text.style.opacity = '1';
        text.style.transform = 'translateY(0px)';
      }

      // Exit zone
      if (p > EXIT_START) {
        if (i < count - 1) {
          // Transition to next: single transitionProgress drives both texts
          const transitionProgress = Math.min(
            1,
            (p - EXIT_START) / (EXIT_END - EXIT_START)
          );

          // Outgoing (this text): complete in first half → full easeInCubic
          const outT = Math.min(1, transitionProgress * 2);
          const outEased = easeInCubic(outT);
          text.style.opacity = String(1 - outEased);
          text.style.transform = `translateY(${-120 * outEased}px)`;

          // Incoming (next text): begin in second half → full easeOutCubic
          const nextText = textBlocks[i + 1];
          if (nextText) {
            const inT = Math.max(0, transitionProgress * 2 - 1);
            const inEased = easeOutCubic(inT);
            nextText.style.opacity = String(inEased);
            nextText.style.transform = `translateY(${120 * (1 - inEased)}px)`;
          }
        } else {
          // Last image: exit upward
          const t = Math.min(1, (p - EXIT_START) / (EXIT_END - EXIT_START));
          const eased = easeInCubic(t);
          text.style.opacity = String(1 - eased);
          text.style.transform = `translateY(${-120 * eased}px)`;
        }
      }
    }
  }, []);

  // ---- Fix 3: Mobile parallax + cluster gap (images only, max 8px) ----
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

    // Cluster gap — applied as width + translateX on cluster only.
    // Text overlay slots live outside the cluster and are unaffected.
    const cluster = clusterRef.current;
    if (!cluster) return;
    const rect = cluster.getBoundingClientRect();
    const vh = window.innerHeight;
    const centreProgress = (vh - rect.top) / (vh + rect.height);
    const clamped = Math.max(0, Math.min(1, centreProgress));
    const distFromCentre = Math.abs(clamped - 0.5) * 2;
    const maxGap = 8;
    const gap = maxGap * easeInCubic(distFromCentre);

    cluster.style.transform = `translateX(${gap}px)`;
    cluster.style.width = `calc(100% - ${gap * 2}px)`;
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

  // ---- Fix 2: Squircle clip-path via ResizeObserver ----
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const updateClipPath = () => {
      const w = cluster.offsetWidth;
      const h = cluster.offsetHeight;
      if (w === 0 || h === 0) return;
      const path = squirclePath(w, h, SQUIRCLE_C);
      cluster.style.clipPath = `path("${path}")`;
    };

    updateClipPath();
    const observer = new ResizeObserver(updateClipPath);
    observer.observe(cluster);
    return () => observer.disconnect();
  }, []);

  const tagsA = project.tagsA || [];
  const tagsB = project.tagsB || [];

  return (
    <div className={styles.showcase} ref={showcaseRef}>
      {/* Desktop: sticky text column */}
      <div className={styles.textColumn}>
        <div className={styles.textSticky}>
          <p className={styles.projectLabel}>Project</p>
          <h2 className={styles.projectName}>{project.name}</h2>
          <p className={styles.projectHeadline}>{project.headline}</p>

          {/* Year + chips row — desktop, scroll-linked fade */}
          <div className={styles.chips} ref={chipsRef}>
            {project.year && (
              <span className={styles.chipYear}>{project.year}</span>
            )}
            {tagsA.map((tag) => (
              <span key={tag} className={styles.chipA}>
                {tag}
              </span>
            ))}
            {tagsB.map((tag) => (
              <span key={tag} className={styles.chipB}>
                {tag}
              </span>
            ))}
          </div>

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

      {/* Images column */}
      <div className={styles.imageColumn} ref={imageColumnRef}>
        {/* imageWrapper: positions cluster + mobile overlay slots together.
            Cluster shifts for the gap effect; overlay slots stay full-width. */}
        <div className={styles.imageWrapper}>
          {/* Cluster: images only — squircle clip-path applied via JS */}
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
                        <span className={styles.placeholderText}>
                          {img.alt}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile overlay slots: sit outside the cluster so they don't
              shift with the gap animation. Each slot covers the same
              vertical area as its corresponding imageBlock. */}
          {project.images.map((img, i) => (
            <div
              key={`overlay-${i}`}
              className={styles.overlaySlot}
              style={{ top: `calc(${i} * max(75vh, 400px))` }}
            >
              {/* Project info on first image only */}
              {i === 0 && (
                <div className={styles.mobileHeader}>
                  <p className={styles.mobileLabel}>Project</p>
                  <h2 className={styles.mobileName}>{project.name}</h2>
                  <p className={styles.mobileHeadline}>{project.headline}</p>
                  {(tagsA.length > 0 || tagsB.length > 0 || project.year) && (
                    <div className={styles.mobileChips}>
                      {project.year && (
                        <span className={styles.mobileChipYear}>
                          {project.year}
                        </span>
                      )}
                      {tagsA.map((tag) => (
                        <span key={tag} className={styles.mobileChipA}>
                          {tag}
                        </span>
                      ))}
                      {tagsB.map((tag) => (
                        <span key={tag} className={styles.mobileChipB}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description overlay */}
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
