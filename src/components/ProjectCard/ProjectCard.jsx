import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project, index }) {
  return (
    <ScrollReveal delay={index * 100}>
      <article className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.subtitle}>{project.subtitle}</p>
        </div>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.details}>
          <div className={styles.detailBlock}>
            <div className={styles.detailLabel}>Challenge</div>
            <p className={styles.detailText}>{project.challenge}</p>
          </div>
          <div className={styles.detailBlock}>
            <div className={styles.detailLabel}>Role</div>
            <p className={styles.detailText}>{project.role}</p>
          </div>
          <div className={styles.detailBlock}>
            <div className={styles.detailLabel}>Outcome</div>
            <p className={styles.detailText}>{project.outcome}</p>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
