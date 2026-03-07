'use client';

import { useCallback } from 'react';
import styles from './ChipBar.module.css';

const TAG_COLORS = {
  'UX Strategy':        '#2A8A7A',
  'Automotive':         '#C07A32',
  'Research Synthesis': '#5A7AA0',
  'HMI Design':         '#3A7A6A',
  'Cross-functional':   '#A06A6A',
  'Brand Strategy':     '#8A6A3A',
  'Concept Design':     '#6A5AAA',
  'Interaction Design': '#7A5A9A',
  'AI Integration':     '#4A7AB0',
  'User Testing':       '#C06A5A',
  'Production Ship':    '#4A7A4A',
  'Research':           '#5A8A5A',
  'Generative Design':  '#9A5A8A',
  'Academia':           '#6A7A8A',
};

export default function ChipBar({ projects }) {
  // Deduplicated list of all tags across all projects, in encounter order
  const allTags = [...new Set(projects.flatMap((p) => p.tags || []))];

  const handleChipClick = useCallback(
    (tag) => {
      // Scroll to the first project that contains this tag
      const project = projects.find((p) => (p.tags || []).includes(tag));
      if (!project) return;
      const el = document.getElementById(project.id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [projects]
  );

  return (
    <div className={styles.bar}>
      {allTags.map((tag) => (
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
