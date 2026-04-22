'use client';

import { useCallback } from 'react';
import styles from './ChipBar.module.css';
import { TAG_COLORS, FEATURED_TAGS } from '@/data/tagColors';
import { teleportToProject } from '@/lib/teleportToProject';

const HIGHLIGHT_CLASS = 'projectHighlight';

export default function ChipBar({ projects }) {
  const handleChipClick = useCallback(
    (tag) => {
      const project = projects.find((p) => (p.tags || []).includes(tag));
      if (!project) return;
      const el = document.getElementById(project.id);
      if (!el) return;
      teleportToProject(el).then(() => {
        el.classList.add(HIGHLIGHT_CLASS);
        setTimeout(() => {
          el.classList.remove(HIGHLIGHT_CLASS);
        }, 1200);
      });
    },
    [projects]
  );

  return (
    <div className={styles.bar}>
      {FEATURED_TAGS.map((tag) => (
        <button
          key={tag}
          className={styles.chip}
          style={{ backgroundColor: TAG_COLORS[tag] || '#888' }}
          onClick={() => handleChipClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
