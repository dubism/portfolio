/**
 * ============================================================
 * PROJECT DATA — Adding / Editing Projects
 * ============================================================
 *
 * HOW TO ADD A NEW PROJECT
 * ------------------------
 * 1. Prepare images:
 *    - Format: JPG or WebP (prefer WebP for smaller files).
 *    - Dimensions: at least 1600 px wide; 1:1 or 4:3 aspect ratio works best.
 *    - Optimise before committing — aim for < 300 KB per image.
 *
 * 2. Place images:
 *    - Create a folder under  public/images/<project-id>/
 *      (e.g.  public/images/my-new-project/)
 *    - Drop the image files there (01.webp, 02.webp, ...).
 *
 * 3. Add a project entry below:
 *    Copy an existing object and fill in:
 *      id        — unique kebab-case slug (used as a key)
 *      name      — display title
 *      year      — YYYY or YYYY–YYYY (en-dash)
 *      headline  — one-liner shown below the title
 *      tagsA     — Type A chips: work type (controlled vocab below)
 *      tagsB     — Type B chips: tools / skills / methods
 *      images    — array of { src, alt, description }
 *        src: path relative to /public, e.g. "/images/my-project/01.webp"
 *             set to null to show a placeholder
 *        alt: accessible alternative text
 *        description: text shown alongside the image on desktop
 *
 * Type A controlled vocabulary:
 *   Research · Concept Design · Strategy · UX Design · UI Design ·
 *   Interaction Design · Generative Design · Systems Design
 *
 * 4. Build / preview:
 *      npm run dev        — local preview at localhost:3000
 *      npm run build      — production build (images are copied from /public)
 *
 *    Next.js serves everything inside /public as-is; no extra
 *    build step is needed for images.
 *
 * ============================================================
 */

const projects = [
  {
    id: 'skoda-experience-strategy',
    name: '\u0160koda Experience Strategy',
    year: '2023\u2013ongoing',
    headline:
      'Conceptualizing and shaping UX strategy for the entire future portfolio',
    tags: ['UX Strategy', 'Automotive', 'Research Synthesis'],
    tagsA: ['Strategy', 'Research'],
    tagsB: ['User Research', 'Prototyping'],
    images: [
      {
        src: '/images/skoda-experience-strategy/01.jpg',
        alt: 'Strategic framework overview',
        description:
          'Strategic framework mapping user journeys across the full \u0160koda vehicle portfolio, grounded in trend and research synthesis.',
      },
      {
        src: '/images/skoda-experience-strategy/02.jpg',
        alt: 'High-fidelity prototype for management review',
        description:
          'High-fidelity prototypes developed for executive presentations \u2014 communicating strategic UX direction across design, engineering, and leadership stakeholders.',
      },
      {
        src: '/images/skoda-experience-strategy/03.jpg',
        alt: 'Future portfolio UX direction',
        description:
          'Outcome: a cohesive strategic direction for the next generation of \u0160koda experiences, ready for hand-off to product teams.',
      },
    ],
  },
  {
    id: 'skoda-vision-o',
    name: '\u0160koda Vision O',
    year: '2025',
    headline: 'Near-future focused conceptual UX design',
    tags: ['Concept Design', 'Interaction Design', 'Automotive', 'AI Integration'],
    tagsA: ['Concept Design', 'Interaction Design'],
    tagsB: ['Figma', 'Prototyping'],
    images: [
      {
        src: '/images/skoda-vision-o/01.jpg',
        alt: 'Physical-digital interaction concept',
        description:
          'Holistic interaction design for a concept vehicle \u2014 covering physical controls, digital surfaces, and AI assistant integration.',
      },
      {
        src: '/images/skoda-vision-o/02.jpg',
        alt: 'Vision O concept showcase',
        description:
          'Concept showcased as \u0160koda Vision O, exploring near-future human-car relationships through seamless physical and digital touchpoints.',
      },
    ],
  },
  {
    id: 'skoda-peaq-cockpit',
    name: '\u0160koda Peaq Cockpit',
    year: '2021\u20132023',
    headline:
      'Cockpit design in a cross-functional team from the earliest stage of HMI design',
    tags: ['HMI Design', 'Cross-functional', 'Automotive', 'Brand Strategy'],
    tagsA: ['UX Design', 'Interaction Design', 'Systems Design'],
    tagsB: ['Figma', 'Design System'],
    images: [
      {
        src: '/images/skoda-peaq-cockpit/01.jpg',
        alt: 'Early-stage cockpit concept',
        description:
          'Early-stage HMI concept tying user needs, design vision, and brand strategy \u2014 developed collaboratively across UX, engineering, and brand teams.',
      },
      {
        src: '/images/skoda-peaq-cockpit/02.jpg',
        alt: 'Stakeholder presentation materials',
        description:
          'Design presentation crafted for successful buy-in at all company and Group levels, aligning cross-functional stakeholders on a unified cockpit direction.',
      },
    ],
  },
  {
    id: 'skoda-smart-dials',
    name: '\u0160koda Smart Dials',
    year: '2019\u20132021',
    headline: 'Interaction design for a new set of physical controls',
    tags: ['Interaction Design', 'HMI Design', 'User Testing', 'Production Ship'],
    tagsA: ['Interaction Design', 'UX Design'],
    tagsB: ['Prototyping', 'User Research'],
    images: [
      {
        src: '/images/skoda-smart-dials/01.jpg',
        alt: 'Smart Dials interaction design',
        description:
          'Interaction design for a given set of physical controls \u2014 coordinating UX, UI, and motion design across two modules through multiple user testing iterations.',
      },
      {
        src: '/images/skoda-smart-dials/02.jpg',
        alt: 'User testing and iteration',
        description:
          'Iterative design process responding to user feedback and feasibility constraints, leading to a refined and validated control experience.',
      },
      {
        src: '/images/skoda-smart-dials/03.jpg',
        alt: 'Production-ready outcome',
        description:
          'Successful product shipped to production \u2014 delivered as project leader and UX designer, from concept through implementation.',
      },
    ],
  },
  {
    id: 'generative-methods',
    name: 'Generative Methods in Automotive Design',
    year: '2014\u20132018',
    headline: 'Doctoral research at FA STU BA, in collaboration with VW FCE',
    tags: ['Research', 'Generative Design', 'Academia'],
    tagsA: ['Research', 'Generative Design'],
    tagsB: ['Parametric Modeling'],
    images: [
      {
        src: '/images/generative-methods/01.jpg',
        alt: 'Generative design methods research',
        description:
          'Exploration of new generative design methods and their application to real problems in the automotive industry \u2014 research conducted at FA STU BA in collaboration with VW FCE.',
      },
      {
        src: '/images/generative-methods/02.jpg',
        alt: 'Industry application and validation',
        description:
          'New generative design methods validated and applied in industry contexts, bridging academic research and automotive product development.',
      },
    ],
  },
];

export default projects;
