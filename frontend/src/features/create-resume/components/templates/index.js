import { themes } from './themes';
import Layout1 from './Layout1';
import Layout2 from './Layout2';
import Layout3 from './Layout3';
import Layout4 from './Layout4';
import Layout5 from './Layout5';
import Layout6 from './Layout6';
import Layout7 from './Layout7';
import Layout8 from './Layout8';
import Layout9 from './Layout9';
import Layout10 from './Layout10';
import Layout11 from './Layout11';
import Layout12 from './Layout12';
import Layout13 from './Layout13';
import Layout14 from './Layout14';
import Layout15 from './Layout15';
import Layout16 from './Layout16';
import Layout17 from './Layout17';
import Layout18 from './Layout18';
import Layout19 from './Layout19';
import Layout20 from './Layout20';
import Layout21 from './Layout21';
import Layout22 from './Layout22';
import Layout23 from './Layout23';
import Layout24 from './Layout24';
import Layout25 from './Layout25';
import Layout26 from './Layout26';
import Layout27 from './Layout27';
import Layout28 from './Layout28';
import Layout29 from './Layout29';
import Layout30 from './Layout30';
import Layout31 from './Layout31';
import Layout32 from './Layout32';
import Layout33 from './Layout33';
import Layout34 from './Layout34';
import Layout35 from './Layout35';

import Layout36 from './Layout36';
import Layout37 from './Layout37';
import Layout38 from './Layout38';
import Layout39 from './Layout39';
import Layout40 from './Layout40';

import Layout41 from './Layout41';
import Layout42 from './Layout42';
import Layout43 from './Layout43';
import Layout44 from './Layout44';
import Layout45 from './Layout45';

import Layout46 from './Layout46';
import Layout47 from './Layout47';
import Layout48 from './Layout48';
import Layout49 from './Layout49';
import Layout50 from './Layout50';

const themeList = Object.values(themes);

// Templates 1–5: Five completely unique professional resume layouts
const firstFiveTemplates = [
  {
    id: 'layout1-blue',
    name: 'Professional Left Sidebar',
    component: Layout1,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout1'
  },
  {
    id: 'layout2-emerald',
    name: 'Modern Top Header',
    component: Layout2,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout2'
  },
  {
    id: 'layout3-navy',
    name: 'Executive Two Column',
    component: Layout3,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout3'
  },
  {
    id: 'layout4-orange',
    name: 'ATS Friendly Resume',
    component: Layout4,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout4'
  },
  {
    id: 'layout5-purple',
    name: 'Creative Designer Resume',
    component: Layout5,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout5'
  }
];

// Templates 6–10: Distinctive layouts
const templates6To10 = [
  {
    id: 'layout6-classic',
    name: 'Classic Professional',
    component: Layout6,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout6'
  },
  {
    id: 'layout7-minimal',
    name: 'Minimal Clean',
    component: Layout7,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout7'
  },
  {
    id: 'layout8-elegant',
    name: 'Centered Elegant',
    component: Layout8,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout8'
  },
  {
    id: 'layout9-timeline',
    name: 'Career Timeline',
    component: Layout9,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout9'
  },
  {
    id: 'layout10-grid',
    name: 'Modern Grid',
    component: Layout10,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout10'
  }
];

// Templates 11–15: Distinctive layouts
const templates11To15 = [
  {
    id: 'layout11-academic',
    name: 'Academic CV',
    component: Layout11,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout11'
  },
  {
    id: 'layout12-portfolio',
    name: 'Portfolio Showcase',
    component: Layout12,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout12'
  },
  {
    id: 'layout13-compact',
    name: 'Compact Executive',
    component: Layout13,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout13'
  },
  {
    id: 'layout14-skills',
    name: 'Skills Matrix',
    component: Layout14,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout14'
  },
  {
    id: 'layout15-visual',
    name: 'Visual Profile',
    component: Layout15,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout15'
  }
];

// Templates 16–20: The newly requested distinctive layouts replacing origCLayouts
const templates16To20 = [
  {
    id: 'layout16-infographic',
    name: 'Infographic Resume',
    component: Layout16,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout16'
  },
  {
    id: 'layout17-magazine',
    name: 'Magazine Style',
    component: Layout17,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout17'
  },
  {
    id: 'layout18-project',
    name: 'Project Focus',
    component: Layout18,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout18'
  },
  {
    id: 'layout19-elegant',
    name: 'Elegant Divider',
    component: Layout19,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout19'
  },
  {
    id: 'layout20-asymmetric',
    name: 'Modern Asymmetric',
    component: Layout20,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout20'
  }
];

// Templates 21–25: Five new distinctive layouts
const templates21To25 = [
  {
    id: 'layout21-timeline',
    name: 'Timeline Resume',
    component: Layout21,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout21'
  },
  {
    id: 'layout22-portfolio',
    name: 'Portfolio Focus',
    component: Layout22,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout22'
  },
  {
    id: 'layout23-asymmetric',
    name: 'Asymmetric Split',
    component: Layout23,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout23'
  },
  {
    id: 'layout24-editorial',
    name: 'Editorial Magazine',
    component: Layout24,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout24'
  },
  {
    id: 'layout25-cards',
    name: 'Creative Card Layout',
    component: Layout25,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout25'
  }
];

// Templates 26–30: Five new distinctive layouts
const templates26To30 = [
  {
    id: 'layout26-bold-profile',
    name: 'Bold Profile Resume',
    component: Layout26,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout26'
  },
  {
    id: 'layout27-skills-matrix',
    name: 'Skills Matrix Resume',
    component: Layout27,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout27'
  },
  {
    id: 'layout28-three-zone',
    name: 'Three Zone Resume',
    component: Layout28,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout28'
  },
  {
    id: 'layout29-experience-focus',
    name: 'Experience Focus Resume',
    component: Layout29,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout29'
  },
  {
    id: 'layout30-futuristic',
    name: 'Futuristic Professional',
    component: Layout30,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout30'
  }
];

// Templates 31–35: Five completely new distinct layouts
const templates31To35 = [
  {
    id: 'layout31-executive-corporate',
    name: 'Executive Corporate',
    component: Layout31,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout31'
  },
  {
    id: 'layout32-modern-portfolio',
    name: 'Modern Portfolio',
    component: Layout32,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout32'
  },
  {
    id: 'layout33-minimal-elegant',
    name: 'Minimal Elegant',
    component: Layout33,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout33'
  },
  {
    id: 'layout34-creative-magazine',
    name: 'Creative Magazine',
    component: Layout34,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout34'
  },
  {
    id: 'layout35-premium-infographic',
    name: 'Premium Infographic',
    component: Layout35,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout35'
  }
];

// Templates 36–40: Five completely new distinct layouts
const templates36To40 = [
  {
    id: 'layout36-creative-split',
    name: 'Creative Split Timeline',
    component: Layout36,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout36'
  },
  {
    id: 'layout37-executive-corporate-2',
    name: 'Executive Director',
    component: Layout37,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout37'
  },
  {
    id: 'layout38-magazine-editorial',
    name: 'Magazine Editorial',
    component: Layout38,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout38'
  },
  {
    id: 'layout39-portfolio-grid',
    name: 'Portfolio Grid',
    component: Layout39,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout39'
  },
  {
    id: 'layout40-minimal-scandinavian',
    name: 'Minimal Scandinavian',
    component: Layout40,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout40'
  }
];

// Templates 41-45: New unique layouts
const templates41To45 = [
  {
    id: 'layout41-dashboard',
    name: 'Dashboard Interface',
    component: Layout41,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout41'
  },
  {
    id: 'layout42-swiss-grid',
    name: 'Swiss Grid System',
    component: Layout42,
    theme: themes.navy,
    thumbnailColor: themes.navy.bgPrimary,
    layoutId: 'layout42'
  },
  {
    id: 'layout43-academic-cv',
    name: 'Academic Research CV',
    component: Layout43,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout43'
  },
  {
    id: 'layout44-founder-pitch',
    name: 'Startup Founder Pitch',
    component: Layout44,
    theme: themes.orange,
    thumbnailColor: themes.orange.bgPrimary,
    layoutId: 'layout44'
  },
  {
    id: 'layout45-luxury-executive',
    name: 'Luxury Executive',
    component: Layout45,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout45'
  }
];

// Templates 46-50: New unique layouts
const templates46To50 = [
  {
    id: 'layout46-newspaper',
    name: 'Newspaper Editorial',
    component: Layout46,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout46'
  },
  {
    id: 'layout47-kanban',
    name: 'Kanban Board',
    component: Layout47,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout47'
  },
  {
    id: 'layout48-roadmap',
    name: 'Product Roadmap',
    component: Layout48,
    theme: themes.emerald,
    thumbnailColor: themes.emerald.bgPrimary,
    layoutId: 'layout48'
  },
  {
    id: 'layout49-command-center',
    name: 'Command Center',
    component: Layout49,
    theme: themes.blue,
    thumbnailColor: themes.blue.bgPrimary,
    layoutId: 'layout49'
  },
  {
    id: 'layout50-portfolio-showcase',
    name: 'Portfolio Showcase',
    component: Layout50,
    theme: themes.purple,
    thumbnailColor: themes.purple.bgPrimary,
    layoutId: 'layout50'
  }
];

export const templates = [
  ...firstFiveTemplates,
  ...templates6To10,
  ...templates11To15,
  ...templates16To20,
  ...templates21To25,
  ...templates26To30,
  ...templates31To35,
  ...templates36To40,
  ...templates41To45,
  ...templates46To50
];

export const getTemplateById = (id) => {
  if (!id) return templates[0];
  const search = id.toString().toLowerCase();
  const found = templates.find(t => 
    t.id?.toLowerCase() === search || 
    t.layoutId?.toLowerCase() === search || 
    t.name?.toLowerCase() === search ||
    search.includes(t.layoutId?.toLowerCase() || '___')
  );
  return found || templates[0];
};
