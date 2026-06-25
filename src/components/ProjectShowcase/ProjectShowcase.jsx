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

const SQUIRCLE_C = 188;

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
    const TRAVEL = 112;
    // Round 5 keeps captions smaller and allows a slight low-opacity overlap
    // while adjacent panels hand off around the viewport centre.
    const BAND_START = 0.03;
    const BAND_END = 0.97;

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

        // Outgoing (text[i]): soft overlap through the first half of the handoff
        const outE = smooth(Math.max(0, Math.min(1, tp / 0.56)));
        if (textBlocks[i]) {
          textBlocks[i].style.opacity = String(1 - outE);
          textBlocks[i].style.transform = `translateY(${-TRAVEL * outE}px)`;
        }

        // Incoming (text[i+1]): starts before the outgoing caption fully leaves
        const inE = smooth(Math.max(0, Math.min(1, (tp - 0.44) / 0.56)));
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

  // ---- Round 5 image stack framing, parallax, and smooth edge-to-edge transition ----
  const updateStack = useCallback(() => {
    const cluster = clusterRef.current;
    const imageColumn = imageColumnRef.current;
    if (!cluster || !imageColumn) return;

    const vh = window.innerHeight;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const rect = cluster.getBoundingClientRect();
    const zone = mobile ? 130 : 220;
    const topCoverage = Math.max(0, Math.min(1, -rect.top / zone));
    const bottomCoverage = Math.max(0, Math.min(1, (rect.bottom - vh) / zone));
    const coverage = smooth(Math.min(topCoverage, bottomCoverage));
    coverageRef.current = coverage;

    const baseGap = mobile ? 14 : 26;
    const baseRadius = mobile ? (window.innerWidth < 520 ? 82 : 96) : SQUIRCLE_C;
    const gap = baseGap * (1 - coverage);
    const c = baseRadius * (1 - coverage);

    if (mobile) {
      cluster.style.width = `calc(100% - ${(gap * 2).toFixed(1)}px)`;
      cluster.style.margin = `0 ${gap.toFixed(1)}px`;
    } else {
      const trackLeft = imageColumn.getBoundingClientRect().left;
      const width = Math.max(360, window.innerWidth - trackLeft - gap);
      cluster.style.width = `${width.toFixed(1)}px`;
      cluster.style.margin = `0 ${gap.toFixed(1)}px 0 0`;
    }

    const w = cluster.offsetWidth;
    const h = cluster.offsetHeight;
    if (w > 0 && h > 0) {
      cluster.style.clipPath = `path("${squirclePath(w, h, c)}")`;
    }

    imageRefs.current.forEach((block) => {
      if (!block) return;
      const inner = block.querySelector('[data-parallax]');
      if (!inner) return;
      const blockRect = block.getBoundingClientRect();
      const focus = Math.max(0, Math.min(1, 1 - Math.abs(blockRect.top + blockRect.height / 2 - vh / 2) / (vh * 0.74)));
      const parallax = (blockRect.top - vh / 2) * (mobile ? -0.19 : -0.235);
      inner.style.transform = `translate3d(0, ${parallax.toFixed(1)}px, 0) scale(${(1.06 + focus * 0.035).toFixed(3)})`;
    });

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
        updateStack();
        if (isDesktop) {
          updateDesktop();
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    requestAnimationFrame(() => {
      updateStack();
      if (isDesktop) {
        updateDesktop();
      }
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [updateDesktop, updateStack]);

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

          {project.evidence && project.evidence.length > 0 && (
            <dl className={styles.evidenceGrid}>
              {project.evidence.map((item) => (
                <div key={item.label} className={styles.evidenceItem}>
                  <dt className={styles.evidenceLabel}>{item.label}</dt>
                  <dd className={styles.evidenceText}>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.sources && project.sources.length > 0 && (
            <div className={styles.sourceLinks} aria-label="Public context links">
              {project.sources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  className={styles.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.label}
                </a>
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
          {/* Mobile sticky project name — zero-height wrapper so it doesn't shift cluster/overlays */}
          <div className={styles.stickyNameWrapper}>
            <h2 className={styles.stickyName} ref={stickyNameRef}>{project.name}</h2>
          </div>

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
              style={{ top: `calc(${i} * max(74vh, 430px))` }}
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
                  {project.evidence && project.evidence.length > 0 && (
                    <div className={styles.mobileEvidence}>
                      {project.evidence.slice(0, 1).map((item) => (
                        <p key={item.label} className={styles.mobileEvidenceItem}>
                          <span>{item.label}</span>
                          {item.value}
                        </p>
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

function smooth(t) {
  return t * t * (3 - 2 * t);
}
