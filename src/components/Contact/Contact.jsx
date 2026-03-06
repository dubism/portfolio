import contact from '@/data/contact';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section className={styles.section} id="contact">
      <ScrollReveal>
        <h2 className={styles.heading}>Get in touch</h2>
        <p className={styles.sub}>
          Have a complex design challenge? I&apos;d like to hear about it.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <a href={`mailto:${contact.email}`} className={styles.cta}>
          {contact.cta} &rarr;
        </a>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className={styles.links}>
          <a
            href={contact.linkedin}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
