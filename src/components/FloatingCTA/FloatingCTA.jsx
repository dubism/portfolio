'use client';

import { useState, useEffect, useRef } from 'react';
import contact from '@/data/contact';
import styles from './FloatingCTA.module.css';

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.pill}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {contact.cta}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ marginLeft: 6, flexShrink: 0 }}
          aria-hidden="true"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`${styles.dropdown} ${open ? styles.dropdownOpen : ''}`}
      >
        <a
          href={`mailto:${contact.email}`}
          className={styles.dropdownLink}
        >
          Email
        </a>
        <a
          href={contact.linkedin}
          className={styles.dropdownLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
