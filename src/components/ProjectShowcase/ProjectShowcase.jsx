import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './ProjectShowcase.module.css';

export default function ProjectShowcase({ project }) {
  return (
    <div className={styles.showcase}>
      {/* Project name + headline — revealed once, sticky while scrolling images */}
      <ScrollReveal className={styles.stickyHeader}>
        <div className={styles.projectHeader}>
          <p className={styles.projectLabel}>Project</p>
          <h2 className={styles.projectName}>{project.name}</h2>
          <p className={styles.projectHeadline}>{project.headline}</p>
        </div>
      </ScrollReveal>

      {/* Image-description pairs — each reveals as a unit on scroll */}
      <div className={styles.imagePairs}>
        {project.images.map((image, i) => (
          <ScrollReveal key={i} delay={i * 120}>
            <div className={styles.imagePair}>
              <div className={styles.imagePlaceholder} aria-label={image.alt}>
                <span className={styles.placeholderLabel}>
                  Image {i + 1} — {image.alt}
                </span>
              </div>
              <p className={styles.imageDescription}>{image.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
