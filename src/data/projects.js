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
 *      headline  — one-liner shown below the title
 *      tags      — array of short labels (tech, discipline, etc.)
 *      images    — array of { src, alt, description }
 *        src: path relative to /public, e.g. "/images/my-project/01.webp"
 *             set to null to show a placeholder
 *        alt: accessible alternative text
 *        description: text shown alongside the image on desktop
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
    id: 'skoda-in-car-experience',
    name: '\u0160koda In-Car Experience Strategy',
    headline:
      'Conceptualizing and shaping in-car UX strategy for the entire future portfolio',
    tags: ['UX Strategy', 'Automotive', 'Research Synthesis'],
    images: [
      {
        src: null,
        alt: 'Strategic framework overview',
        description:
          'Strategic framework mapping user journeys across the full \u0160koda vehicle portfolio, grounded in trend and research synthesis.',
      },
      {
        src: null,
        alt: 'High-fidelity prototype for management review',
        description:
          'High-fidelity prototypes developed for executive presentations — communicating strategic UX direction across design, engineering, and leadership stakeholders.',
      },
      {
        src: null,
        alt: 'Future portfolio UX direction',
        description:
          'Outcome: a cohesive strategic direction for the next generation of \u0160koda in-car experiences, ready for hand-off to product teams.',
      },
    ],
  },
  {
    id: 'skoda-peaq-cockpit',
    name: '\u0160koda Peaq Cockpit',
    headline:
      'Cockpit design in a cross-functional team from the earliest stage of HMI design',
    tags: ['HMI Design', 'Cross-functional', 'Brand Strategy'],
    images: [
      {
        src: null,
        alt: 'Early-stage cockpit concept',
        description:
          'Early-stage HMI concept tying user needs, design vision, and brand strategy — developed collaboratively across UX, engineering, and brand teams.',
      },
      {
        src: null,
        alt: 'Stakeholder presentation materials',
        description:
          'Design presentation crafted for successful buy-in at all company and Group levels, aligning cross-functional stakeholders on a unified cockpit direction.',
      },
    ],
  },
  {
    id: 'skoda-vision-o',
    name: '\u0160koda Vision O',
    headline: 'Near-future focused conceptual UX design',
    tags: ['Concept Design', 'Interaction Design', 'AI Integration'],
    images: [
      {
        src: null,
        alt: 'Physical-digital interaction concept',
        description:
          'Holistic interaction design for a concept vehicle — covering physical controls, digital surfaces, and AI assistant integration.',
      },
      {
        src: null,
        alt: 'Vision O concept showcase',
        description:
          'Concept showcased as \u0160koda Vision O, exploring near-future human-car relationships through seamless physical and digital touchpoints.',
      },
    ],
  },
  {
    id: 'skoda-smart-dials',
    name: '\u0160koda Smart Dials',
    headline: 'Interaction design for a new set of physical controls',
    tags: ['Interaction Design', 'User Testing', 'Production Ship'],
    images: [
      {
        src: null,
        alt: 'Smart Dials interaction design',
        description:
          'Interaction design for a given set of physical controls — coordinating UX, UI, and motion design across two modules through multiple user testing iterations.',
      },
      {
        src: null,
        alt: 'User testing and iteration',
        description:
          'Iterative design process responding to user feedback and feasibility constraints, leading to a refined and validated control experience.',
      },
      {
        src: null,
        alt: 'Production-ready outcome',
        description:
          'Successful product shipped to production — delivered as project leader and UX designer, from concept through implementation.',
      },
    ],
  },
  {
    id: 'generative-methods',
    name: 'Generative Methods in Automotive Design',
    headline: 'Doctoral research at FA STU BA, in collaboration with VW FCE',
    tags: ['Research', 'Generative Design', 'Academia'],
    images: [
      {
        src: null,
        alt: 'Generative design methods research',
        description:
          'Exploration of new generative design methods and their application to real problems in the automotive industry — research conducted at FA STU BA in collaboration with VW FCE.',
      },
      {
        src: null,
        alt: 'Industry application and validation',
        description:
          'New generative design methods validated and applied in industry contexts, bridging academic research and automotive product development.',
      },
    ],
  },
];

export default projects;
