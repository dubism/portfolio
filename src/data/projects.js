/**
 * Portfolio chapters are written as evidence, not as an archive.
 * Each chapter should prove one senior UX/HMI capability through public-safe
 * local assets and public references.
 */

const imagePath = (path) => `/portfolio${path}`;

const projects = [
  {
    id: 'designing-intelligence',
    name: 'Designing Intelligent Interfaces',
    year: '2014\u2013now',
    headline:
      'From generating form to designing intelligent relationships across assistants, cockpits, and AI-supported prototyping.',
    tags: ['AI Integration', 'HMI Design', 'Research', 'Concept Design'],
    evidence: [
      {
        label: 'Role',
        value:
          'Connected research, avatar concepting, production motion, and future cockpit AI concepts into one long design trajectory.',
      },
      {
        label: 'Problem',
        value:
          'Make intelligence legible: first as generated form, later as an assistant presence, interface behavior, and contextual cockpit service.',
      },
      {
        label: 'Outcome',
        value:
          'A reusable AI/HMI point of view spanning Laura, Vision O, and personal experiments with AI as a creative collaborator.',
      },
      {
        label: 'Reflection',
        value:
          'The designer shifts from drawing outcomes to shaping systems that generate, respond, and behave.',
      },
    ],
    sources: [
      {
        label: 'Laura digital assistant',
        href: 'https://www.skoda-storyboard.com/en/press-releases/skoda-presents-new-digital-assistant-okay-laura/',
      },
      {
        label: 'Vision O AI assistant',
        href: 'https://www.skoda-storyboard.com/en/press-kits/skoda-vision-o-press-kit/skoda-vision-o-experiencing-autonomous-driving-with-an-ai-powered-assistant/',
      },
    ],
    images: [
      {
        src: imagePath('/review-assets/gen-pure-forms-grid.jpg'),
        alt: 'Generative design form studies arranged as a grid',
        description:
          '2014\u20132018: doctoral research treated computation as a design material, testing how concepts, algorithms, parameters, and results could change automotive form-finding.',
      },
      {
        src: imagePath('/review-assets/gen-slices.jpg'),
        alt: 'Generative steering wheel development slices',
        description:
          'The research produced physical and visual demonstrations that made generative methods discussable inside an automotive design context, not only as abstract software output.',
      },
      {
        src: imagePath('/review-assets/vision-o-dash-ui.jpg'),
        alt: 'Vision O dashboard interface with AI assistant context',
        description:
          '2019\u20132025: the assistant story moves from Laura avatar concepting and production animation behavior toward Vision O, where AI becomes part of the cockpit ecosystem.',
      },
      {
        src: imagePath('/review-assets/vision-o-console.jpg'),
        alt: 'Vision O cockpit console and connected device interface',
        description:
          'Now: vibe-coding experiments close the loop by using AI as a collaborator for fast interface thinking, prototyping, and exploring new cockpit-service relationships.',
      },
    ],
  },
  {
    id: 'physical-digital-control-systems',
    name: 'Shipping Physical-Digital Controls',
    year: '2019\u20132023',
    headline:
      'Interaction design for haptic controls that combine rotary input, press behavior, embedded displays, and production constraints.',
    tags: ['Interaction Design', 'HMI Design', 'User Testing', 'Production Ship'],
    evidence: [
      {
        label: 'Role',
        value:
          'Led UX and interaction design for Smart Dials across control logic, user testing iterations, and production handoff.',
      },
      {
        label: 'Problem',
        value:
          'Preserve direct haptic operation while adding customization and digital feedback without increasing driver distraction.',
      },
      {
        label: 'Outcome',
        value:
          'A production-shipped control concept for Superb and Kodiaq interiors, balancing physical confidence with software flexibility.',
      },
      {
        label: 'Reflection',
        value:
          'Good HMI is often not less hardware or more screen, but a clearer contract between hand, eye, state, and feedback.',
      },
    ],
    sources: [
      {
        label: 'Smart Dials public story',
        href: 'https://www.skoda-storyboard.com/en/skoda-world/innovation-and-technology/smart-dials-a-smart-solution-for-air-conditioning-and-more/',
      },
      {
        label: 'HMI team profile',
        href: 'https://www.skoda-storyboard.com/en/skoda-world/design/the-hidden-faces-of-design-help-you-get-along-with-your-car/',
      },
    ],
    images: [
      {
        src: imagePath('/review-assets/smart-dials-overview.jpg'),
        alt: 'Smart Dials in the new Skoda cockpit',
        description:
          'The core UX question was how a physical rotary control should expose multiple digital functions while staying understandable at a glance and by touch.',
      },
      {
        src: imagePath('/review-assets/skoda-in-use-dials.jpg'),
        alt: 'Driver using Smart Dials in context',
        description:
          'Process evidence centered on interaction states, customization rules, ergonomics, and repeated validation of how people switch, read, and trust the control.',
      },
      {
        src: imagePath('/images/skoda-smart-dials/03.jpg'),
        alt: 'Smart Dials production-ready interior detail',
        description:
          'The shipped result connects haptic confidence with digital adaptability: rotary control, press behavior, display feedback, and production-ready implementation.',
      },
    ],
  },
  {
    id: 'future-cockpit-concepts',
    name: 'Shaping Future Cockpits',
    year: '2021\u20132025',
    headline:
      'Advanced cockpit concepts that align HMI architecture, physical controls, screen hierarchy, AI integration, and stakeholder decision-making.',
    tags: ['UX Strategy', 'Concept Design', 'Automotive', 'AI Integration'],
    evidence: [
      {
        label: 'Role',
        value:
          'Developed future HMI concepts and strategic prototypes across advanced design, experience strategy, and cross-functional reviews.',
      },
      {
        label: 'Problem',
        value:
          'Turn broad future mobility ambition into cockpit logic that can be understood by design, engineering, brand, and leadership.',
      },
      {
        label: 'Outcome',
        value:
          'A coherent future-facing portfolio of cockpit directions, including Vision O and earlier Peaq/strategy work.',
      },
      {
        label: 'Reflection',
        value:
          'Future cockpit work succeeds when the interface explains the vehicle concept, not when it decorates it.',
      },
    ],
    sources: [
      {
        label: 'Vision O interior and HMI',
        href: 'https://www.skoda-storyboard.com/en/press-kits/skoda-vision-o-press-kit/skoda-vision-o-new-customer-centric-interior-concept-developed-from-inside-out/',
      },
      {
        label: 'Vision O press kit',
        href: 'https://www.skoda-storyboard.com/en/press-kits/skoda-vision-o-press-kit/skoda-vision-o-electrified-future-estate-with-the-next-generation-of-the-modern-solid-design-language/',
      },
    ],
    images: [
      {
        src: imagePath('/review-assets/vision-o-cockpit.jpg'),
        alt: 'Vision O cockpit view with Horizon Display',
        description:
          'Vision O shows the cockpit as an ecosystem: wide contextual display, central interaction points, passenger experience, AI assistant, and calm information hierarchy.',
      },
      {
        src: imagePath('/review-assets/vision-o-atmosphere.jpg'),
        alt: 'Vision O atmospheric cockpit interior',
        description:
          'The concept connects HMI with spatial experience, including light, attention, content reduction, and the emotional tone of an intelligent car interior.',
      },
      {
        src: imagePath('/images/skoda-peaq-cockpit/01.jpg'),
        alt: 'Early-stage cockpit HMI concept',
        description:
          'Earlier cockpit work translated brand strategy and user needs into HMI architecture, helping teams compare alternatives before production constraints hardened.',
      },
      {
        src: imagePath('/images/skoda-experience-strategy/02.jpg'),
        alt: 'High-fidelity prototype for stakeholder review',
        description:
          'Strategic prototypes turned future portfolio questions into reviewable experiences for design, engineering, management, and Group-level alignment.',
      },
    ],
  },
  {
    id: 'generative-design-research',
    name: 'Researching Generative Systems',
    year: '2014\u20132018',
    headline:
      'Doctoral research on generative methods in automotive design: concept, algorithm, parameters, results, and physical prototype.',
    tags: ['Research', 'Generative Design', 'Academia', 'Systems Design'],
    evidence: [
      {
        label: 'Role',
        value:
          'Independent doctoral design researcher exploring generative methods with automotive applications and physical demonstrations.',
      },
      {
        label: 'Problem',
        value:
          'Move generative design from technical optimization into a form-finding process that industrial designers can direct and critique.',
      },
      {
        label: 'Outcome',
        value:
          'A method framework and steering-wheel demonstrators showing how sketches, algorithms, parameters, and additive manufacturing can work together.',
      },
      {
        label: 'Reflection',
        value:
          'The lasting value was not a single form, but a way to think about authorship inside computational design systems.',
      },
    ],
    sources: [
      {
        label: 'Tr1mtab research page',
        href: 'https://tr1mtab.com/project/generative-design/',
      },
      {
        label: 'Autodesk University context',
        href: 'https://www.autodesk.com/autodesk-university/class/Generative-Design-and-Artificial-Intelligence-Automotive-Industry-2018',
      },
    ],
    images: [
      {
        src: imagePath('/review-assets/gen-sketch-clean-pair.jpg'),
        alt: 'Cleaned sketch pair for generative steering wheel concept',
        description:
          'Concept: sketching stayed in the loop as the first definition of intent, proportion, and desired character before algorithmic development.',
      },
      {
        src: imagePath('/review-assets/gen-topology-study.jpg'),
        alt: 'Topology and structural generative study',
        description:
          'Algorithm and parameters: the process translated design intent into rule-based exploration, making variation and constraint visible.',
      },
      {
        src: imagePath('/review-assets/gen-3d-structure.jpg'),
        alt: '3D printed generative steering wheel structure',
        description:
          'Results: physical demonstrators tested the gap between computational complexity, automotive legibility, and material production logic.',
      },
      {
        src: imagePath('/review-assets/gen-physical-prototype.jpg'),
        alt: 'Physical steering wheel prototype',
        description:
          'Prototype: additive manufacturing turned the research into something tangible enough to evaluate as an object, not just a visualization.',
      },
    ],
  },
];

export default projects;
