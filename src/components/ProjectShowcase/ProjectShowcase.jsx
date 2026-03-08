'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './ProjectShowcase.module.css';
import { TAG_COLORS } from '@/data/tagColors';

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
  const clusterRef = useRef(null);
  const coverageRef = useRef(0); // smooth 0→1 (0=padded, 1=edge-to-edge)
  const stickyNameRef = useRef(null);
  const mobileHeaderRefs = useRef([]);
  const mobileOverlayRefs = useRef([]);

  // ---- Task 1: Desktop scroll-scrubbed text animation ----
  // Single transitionProgress (0→1) derived from the scroll gap between two
  // adjacent image centres. Hard midpoint: outgoing completes in first half
  // (0→0.5), incoming starts in second half (0.5→1) — zero simultaneous visibility.
  const updateDesktop = useCallback(() => {
    const images = imageRefs.current.filter(Boolean);
    const textBlocks = textBlocksRef.current.filter(Boolean);
    const count = images.length;
    if (count === 0) return;

    const vh = window.innerHeight;
    const viewCenter = vh / 2;
    const TRAVEL = 110;
    // The transition band occupies the middle 50% of the gap between two image
    // centres. This gives a stable fully-visible zone on either side.
    const BAND_START = 0.25;
    const BAND_END = 0.75;

    // Centre Y (from top of viewport) for each image block
    const midY = images.map((img) => {
      const rect = img.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });

    // Reset all text blocks to hidden-below state
    textBlocks.forEach((text) => {
      if (!text) return;
      text.style.opacity = '0';
      text.style.transform = `translateY(${TRAVEL}px)`;
    });

    if (count === 1) {
      if (textBlocks[0]) {
        textBlocks[0].style.opacity = '1';
        textBlocks[0].style.transform = 'translateY(0px)';
      }
      return;
    }

    // Scan consecutive pairs for an active transition band
    for (let i = 0; i < count - 1; i++) {
      const gap = midY[i + 1] - midY[i]; // positive: next image is below
      if (gap <= 0) continue;

      // raw = 0 when image i is centred, raw = 1 when image i+1 is centred
      const raw = (viewCenter - midY[i]) / gap;

      if (raw >= BAND_START && raw <= BAND_END) {
        // Normalise to [0, 1] within the transition band
        const tp = (raw - BAND_START) / (BAND_END - BAND_START);

        // Outgoing (text[i]): full fade-out in first half
        const outT = Math.min(1, tp * 2);
        const outE = easeInCubic(outT);
        if (textBlocks[i]) {
          textBlocks[i].style.opacity = String(1 - outE);
          textBlocks[i].style.transform = `translateY(${-TRAVEL * outE}px)`;
        }

        // Incoming (text[i+1]): full fade-in in second half
        const inT = Math.max(0, tp * 2 - 1);
        const inE = easeOutCubic(inT);
        if (textBlocks[i + 1]) {
          textBlocks[i + 1].style.opacity = String(inE);
          textBlocks[i + 1].style.transform = `translateY(${TRAVEL * (1 - inE)}px)`;
        }

        return; // only one pair can be active at a time
      }
    }

    // No pair is actively transitioning — find which text block to show fully.
    // For every completed transition (raw > BAND_END), advance activeIdx.
    let activeIdx = 0;
    for (let i = 0; i < count - 1; i++) {
      const gap = midY[i + 1] - midY[i];
      if (gap <= 0) continue;
      const raw = (viewCenter - midY[i]) / gap;
      if (raw > BAND_END) activeIdx = i + 1;
    }

    if (textBlocks[activeIdx]) {
      textBlocks[activeIdx].style.opacity = '1';
      textBlocks[activeIdx].style.transform = 'translateY(0px)';
    }
  }, []);

  // ---- Mobile parallax + smooth edge-to-edge transition ----
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

    // Smooth gap transition: edge-to-edge when photos cover viewport top-to-bottom.
    // Animate smoothly as photos approach full coverage.
    const cluster = clusterRef.current;
    if (!cluster) return;
    const rect = cluster.getBoundingClientRect();
    const vh = window.innerHeight;
    const maxGap = 8;

    // How far past each viewport edge the cluster extends (positive = covered)
    const topOverflow = -rect.top;
    const bottomOverflow = rect.bottom - vh;

    // Transition zone: smooth animation over 100px as edges approach coverage
    const zone = 100;
    const topCoverage = Math.max(0, Math.min(1, topOverflow / zone));
    const bottomCoverage = Math.max(0, Math.min(1, bottomOverflow / zone));

    // Both edges must be covered for full edge-to-edge
    const coverage = Math.min(topCoverage, bottomCoverage);
    coverageRef.current = coverage;

    const gap = maxGap * (1 - coverage);
    const c = SQUIRCLE_C * (1 - coverage);

    cluster.style.transform = `translateX(${gap}px)`;
    cluster.style.width = `calc(100% - ${gap * 2}px)`;

    const w = cluster.offsetWidth;
    const h = cluster.offsetHeight;
    if (w > 0 && h > 0) {
      cluster.style.clipPath = `path("${squirclePath(w, h, c)}")`;
    }

    // Fade overlay content as it approaches the sticky headline
    const stickyEl = stickyNameRef.current;
    if (stickyEl) {
      const stickyBottom = stickyEl.getBoundingClientRect().bottom;
      const fadeStart = vh / 3; // begin fading in top third of screen

      // Fade mobileHeader elements (headline, tags on first image)
      mobileHeaderRefs.current.forEach((el) => {
        if (!el) return;
        const elBottom = el.getBoundingClientRect().bottom;
        if (elBottom < fadeStart) {
          const range = fadeStart - stickyBottom;
          const opacity = range > 0 ? Math.max(0, (elBottom - stickyBottom) / range) : 0;
          el.style.opacity = String(opacity);
        } else {
          el.style.opacity = '1';
        }
      });

      // Fade mobileOverlay elements (descriptions)
      mobileOverlayRefs.current.forEach((el) => {
        if (!el) return;
        const elTop = el.getBoundingClientRect().top;
        if (elTop < fadeStart) {
          const range = fadeStart - stickyBottom;
          const opacity = range > 0 ? Math.max(0, (elTop - stickyBottom) / range) : 0;
          el.style.opacity = String(opacity);
        } else {
          el.style.opacity = '1';
        }
      });

      // Show sticky name only after mobileHeader has scrolled past
      const header = mobileHeaderRefs.current[0];
      if (header && stickyEl) {
        const headerBottom = header.getBoundingClientRect().bottom;
        if (headerBottom < stickyEl.getBoundingClientRect().bottom) {
          stickyEl.style.opacity = '1';
        } else {
          stickyEl.style.opacity = '0';
        }
      }
    }
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
      } else {
        updateMobile();
      }
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, [updateDesktop, updateMobile]);

  // ---- Squircle clip-path via ResizeObserver ----
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const updateClipPath = () => {
      const w = cluster.offsetWidth;
      const h = cluster.offsetHeight;
      if (w === 0 || h === 0) return;
      const c = SQUIRCLE_C * (1 - coverageRef.current);
      const path = squirclePath(w, h, c);
      cluster.style.clipPath = `path("${path}")`;
    };

    updateClipPath();
    const observer = new ResizeObserver(updateClipPath);
    observer.observe(cluster);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.showcase} ref={showcaseRef} id={project.id}>
      {/* Desktop: sticky text column */}
      <div className={styles.textColumn}>
        <div className={styles.textSticky}>
          <h2 className={styles.projectName}>{project.name}</h2>
          <p className={styles.projectHeadline}>{project.headline}</p>

          {project.tags && project.tags.length > 0 && (
            <div className={styles.desktopTags}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={styles.desktopTag}
                  style={{ backgroundColor: TAG_COLORS[tag] || '#888' }}
                >
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

      {/* Images column */}
      <div className={styles.imageColumn} ref={imageColumnRef}>
        {/* imageWrapper: positions cluster + mobile overlay slots together.
            Cluster shifts for the gap effect; overlay slots stay full-width. */}
        <div className={styles.imageWrapper}>
          {/* Mobile sticky project name — inside imageWrapper for proper sticky + overlay behavior */}
          <h2 className={styles.stickyName} ref={stickyNameRef}>{project.name}</h2>

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
                <div
                  className={styles.mobileHeader}
                  ref={(el) => { mobileHeaderRefs.current[i] = el; }}
                >
                  <h2 className={styles.mobileName}>{project.name}</h2>
                  <p className={styles.mobileHeadline}>{project.headline}</p>
                  {project.tags && project.tags.length > 0 && (
                    <div className={styles.mobileTags}>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={styles.mobileTag}
                          style={{ backgroundColor: TAG_COLORS[tag] || '#888' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description overlay */}
              <div
                className={styles.mobileOverlay}
                ref={(el) => { mobileOverlayRefs.current[i] = el; }}
              >
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
