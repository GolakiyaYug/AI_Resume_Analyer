export const realisticDummyData = {
  name: 'Emma Johnson',
  title: 'Senior UI/UX Designer',
  email: 'emma.johnson@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/emmajohnson',
  github: 'github.com/emmajdesign',
  portfolio: 'emmajohnson.design',
  summary: 'Creative and detail-oriented Senior UI/UX Designer with over 6 years of experience in designing intuitive, user-centric interfaces. Proven ability to lead design teams, translate business requirements into engaging prototypes, and increase user retention through thoughtful design systems.',
  photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  experience: [
    {
      id: 'exp1',
      title: 'Senior UI/UX Designer',
      company: 'TechFlow Solutions',
      date: 'Jan 2021 - Present',
      desc: 'Led a team of 4 designers in overhauling the core SaaS platform, improving task completion rate by 35%.\nEstablished a unified design system that reduced front-end development time by 20%.\nConducted comprehensive user testing and A/B testing for critical workflows.'
    },
    {
      id: 'exp2',
      title: 'UX/UI Designer',
      company: 'CreativePulse Agency',
      date: 'Mar 2018 - Dec 2020',
      desc: 'Designed responsive web applications for e-commerce and fintech clients.\nCollaborated closely with product managers and developers in an Agile environment.\nCreated wireframes, high-fidelity mockups, and interactive prototypes using Figma and Framer.'
    }
  ],
  education: [
    {
      id: 'edu1',
      degree: 'Bachelor of Fine Arts in Interaction Design',
      school: 'California College of the Arts',
      date: '2014 - 2018'
    }
  ],
  skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'HTML/CSS', 'Design Systems', 'Agile Methodology'],
  projects: [
    {
      id: 'proj1',
      title: 'FinDash - Mobile Banking App',
      link: 'dribbble.com/emmajdesign/findash',
      desc: 'Redesigned the mobile banking experience focusing on financial literacy and easy transfers, resulting in a 4.8-star app store rating.'
    }
  ],
  certifications: [
    {
      id: 'cert1',
      title: 'Google UX Design Professional Certificate',
      date: '2021'
    }
  ],
  languages: [
    { id: 'lang1', name: 'English', fluency: 'Native' },
    { id: 'lang2', name: 'Spanish', fluency: 'Conversational' }
  ],
  achievements: [
    {
      id: 'ach1',
      title: 'Design Excellence Award 2022',
      desc: 'Recognized for creating the most innovative user interface for B2B analytics dashboard.'
    }
  ],
  interests: ['Photography', 'Typography', 'Digital Illustration']
};

export const defaultSectionsOrder = [
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'achievements',
  'interests'
];
