import contact from '@/data/contact';
import styles from './FloatingCTA.module.css';

export default function FloatingCTA() {
  return (
    <a href="#contact" className={styles.pill}>
      {contact.cta}
    </a>
  );
}
