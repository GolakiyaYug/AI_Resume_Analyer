import { useState } from 'react';
import { jsPDF } from 'jspdf';
import api from '../../shared/utils/api';

// Comprehensive global skill dictionary for client & API matching
const GLOBAL_SKILLS_LIST = [
  'python', 'java', 'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'express', 'next.js',
  'html', 'css', 'tailwind', 'bootstrap', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite',
  'numpy', 'pandas', 'scikit-learn', 'pytorch', 'tensorflow', 'keras', 'deep learning', 'machine learning',
  'nlp', 'opencv', 'data analysis', 'power bi', 'tableau', 'excel', 'statistics', 'flask', 'django', 'fastapi',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'git', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
  'figma', 'ui/ux', 'ux', 'ui', 'photoshop', 'illustrator', 'wireframing', 'user research', 'design systems',
  'communication', 'leadership', 'problem solving',
  'ci/cd', 'apache spark', 'spark', 'etl', 'airflow', 'big data', 'rest api', 'databases'
];

// Canonical Display Formatting Map
const CANONICAL_SKILL_NAMES = {
  'python': 'Python',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'keras': 'Keras',
  'deep learning': 'Deep Learning',
  'machine learning': 'Machine Learning',
  'nlp': 'NLP & LLMs',
  'opencv': 'OpenCV',
  'data analysis': 'Data Analysis',
  'power bi': 'Power BI',
  'tableau': 'Tableau',
  'excel': 'Excel',
  'statistics': 'Statistics',
  'sql': 'SQL',
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'sqlite': 'SQLite',
  'html': 'HTML5',
  'css': 'CSS3',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'react': 'React.js',
  'vue': 'Vue.js',
  'angular': 'Angular',
  'node': 'Node.js',
  'express': 'Express.js',
  'next.js': 'Next.js',
  'tailwind': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',
  'flask': 'Flask',
  'django': 'Django',
  'fastapi': 'FastAPI',
  'aws': 'AWS Cloud',
  'azure': 'Microsoft Azure',
  'gcp': 'Google Cloud (GCP)',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'terraform': 'Terraform',
  'git': 'Git',
  'c++': 'C++',
  'c#': 'C#',
  'go': 'Go (Golang)',
  'rust': 'Rust',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'figma': 'Figma',
  'ui/ux': 'UI/UX Design',
  'ux': 'User Experience (UX)',
  'ui': 'User Interface (UI)',
  'photoshop': 'Photoshop',
  'illustrator': 'Illustrator',
  'wireframing': 'Wireframing & Prototyping',
  'user research': 'User Research',
  'design systems': 'Design Systems',
  'communication': 'Communication',
  'leadership': 'Leadership',
  'problem solving': 'Problem Solving',
  'ci/cd': 'CI/CD Pipelines',
  'apache spark': 'Apache Spark',
  'spark': 'Apache Spark',
  'etl': 'ETL Pipelines',
  'airflow': 'Apache Airflow',
  'big data': 'Big Data',
  'rest api': 'REST APIs',
  'databases': 'Databases'
};

// Irrelevant noise words filter
const NOISE_WORDS = new Set([
  'education', 'experience', 'resume', 'summary', 'project', 'projects', 'details', 'contact',
  'email', 'phone', 'address', 'name', 'profile', 'work', 'history', 'school', 'university',
  'degree', 'bachelor', 'master', 'skills', 'skill', 'tools', 'languages', 'overview'
]);

// Role Progressive Roadmap Definitions
const ROLE_PROGRESSIVE_ROADMAP = {
  'Cloud / DevOps Engineer': [
    { skill: 'git', title: 'Phase 1: Linux & Version Control', desc: 'Master Linux CLI, shell scripting, and Git workflows.' },
    { skill: 'aws', title: 'Phase 2: Cloud Infrastructure (AWS/Azure)', desc: 'Provision cloud servers, virtual networks, storage buckets, and IAM security.' },
    { skill: 'docker', title: 'Phase 3: Containerization with Docker', desc: 'Package applications into lightweight, reproducible Docker containers.' },
    { skill: 'kubernetes', title: 'Phase 4: Kubernetes Cluster Orchestration', desc: 'Manage scalable container workloads, pods, services, and ingress controllers.' },
    { skill: 'terraform', title: 'Phase 5: Infrastructure as Code (Terraform)', desc: 'Automate infrastructure provisioning with declarative Terraform scripts.' },
    { skill: 'ci/cd', title: 'Phase 6: CI/CD Automated Pipelines', desc: 'Build automated continuous integration & continuous deployment pipelines.' }
  ],
  'Full Stack Developer': [
    { skill: 'javascript', title: 'Phase 1: Modern JavaScript & HTML/CSS', desc: 'Master ES6+ syntax, async programming, and DOM manipulation.' },
    { skill: 'react', title: 'Phase 2: React & Next.js Frontend', desc: 'Build reactive UI component hierarchies with state hooks and Next.js.' },
    { skill: 'node', title: 'Phase 3: Node.js & Express REST APIs', desc: 'Develop scalable backend web services, routes, and validation middleware.' },
    { skill: 'sql', title: 'Phase 4: Database Modeling & Integration', desc: 'Integrate PostgreSQL and MongoDB with ORMs like Prisma or Mongoose.' },
    { skill: 'express', title: 'Phase 5: Full Stack Auth & Security', desc: 'Implement JWT authentication, CORS, rate limiting, and RBAC authorization.' }
  ],
  'Data Engineer': [
    { skill: 'sql', title: 'Phase 1: Advanced SQL & Data Modeling', desc: 'Master CTEs, window functions, query tuning, and schema design.' },
    { skill: 'python', title: 'Phase 2: Python Data Pipeline Scripting', desc: 'Build robust Python scripts to extract, transform, and clean raw data.' },
    { skill: 'etl', title: 'Phase 3: Scalable ETL Pipeline Design', desc: 'Architect robust ETL & ELT data ingestion pipelines.' },
    { skill: 'apache spark', title: 'Phase 4: Big Data Processing with Spark', desc: 'Process distributed datasets at scale using PySpark.' },
    { skill: 'airflow', title: 'Phase 5: Workflow Orchestration with Airflow', desc: 'Schedule and monitor complex data DAG workflows using Apache Airflow.' }
  ],
  'AI/ML Engineer': [
    { skill: 'sql', title: 'Phase 1: SQL & Database Querying', desc: 'Master SQL queries, CTEs, window functions, and database schema design.' },
    { skill: 'python', title: 'Phase 1: Python Core & Data Structures', desc: 'Solidify advanced Python syntax, OOP idioms, and algorithm efficiency.' },
    { skill: 'numpy', title: 'Phase 2: NumPy & Vectorized Math', desc: 'Learn linear algebra operations, array manipulation, and broadcasting.' },
    { skill: 'pandas', title: 'Phase 2: Pandas Data Wrangling', desc: 'Clean, format, merge, and analyze complex datasets with Pandas dataframes.' },
    { skill: 'scikit-learn', title: 'Phase 3: Machine Learning Frameworks', desc: 'Train regression, decision trees, and ensemble models using Scikit-Learn.' },
    { skill: 'deep learning', title: 'Phase 4: Deep Learning & Neural Architectures', desc: 'Master backpropagation, loss functions, and neural network optimization.' },
    { skill: 'pytorch', title: 'Phase 4: PyTorch Deep Learning Models', desc: 'Build and optimize CNNs, RNNs, and Transformers using PyTorch.' },
    { skill: 'tensorflow', title: 'Phase 4: TensorFlow & Keras Ecosystem', desc: 'Train scalable neural networks with TensorFlow and Keras pipelines.' },
    { skill: 'nlp', title: 'Phase 5: Natural Language Processing & LLMs', desc: 'Explore text tokenization, embeddings, Transformers, Hugging Face, and fine-tuning.' },
    { skill: 'fastapi', title: 'Phase 6: High-Speed Model REST APIs', desc: 'Serve AI model predictions via FastAPI microservices.' },
    { skill: 'docker', title: 'Phase 6: MLOps Containerization', desc: 'Package AI microservices into Docker containers for production deployment.' }
  ],
  'Data Scientist': [
    { skill: 'excel', title: 'Phase 1: Excel & Data Auditing', desc: 'Master data cleaning, lookup functions, and pivot reporting.' },
    { skill: 'sql', title: 'Phase 2: Advanced SQL Querying', desc: 'Query relational databases with CTEs, window functions, and joins.' },
    { skill: 'python', title: 'Phase 3: Python Data Science Foundations', desc: 'Learn Python, Pandas, and NumPy for exploratory data analysis.' },
    { skill: 'statistics', title: 'Phase 3: Applied Statistics & Probability', desc: 'Master hypothesis testing, t-tests, p-values, and confidence intervals.' },
    { skill: 'scikit-learn', title: 'Phase 4: Predictive Machine Learning', desc: 'Train supervised classification and regression models.' },
    { skill: 'power bi', title: 'Phase 5: Visual Dashboard Storytelling', desc: 'Build executive analytics dashboards in Power BI or Tableau.' }
  ],
  'Data Analyst': [
    { skill: 'excel', title: 'Phase 1: Advanced Excel & Pivot Tables', desc: 'Master VLOOKUP, XLOOKUP, and data audit formulas.' },
    { skill: 'sql', title: 'Phase 2: SQL Analytics', desc: 'Write complex SQL queries, aggregations, and multi-table joins.' },
    { skill: 'python', title: 'Phase 3: Python Data Processing', desc: 'Use Pandas and Matplotlib to automate data cleaning and charting.' },
    { skill: 'power bi', title: 'Phase 4: BI Dashboard Design', desc: 'Create interactive reporting dashboards for business stakeholders.' },
    { skill: 'tableau', title: 'Phase 4: Tableau Analytics Stories', desc: 'Build visual dashboards and executive reporting metrics.' }
  ],
  'Python Developer': [
    { skill: 'python', title: 'Phase 1: Python OOP & Idioms', desc: 'Master Python decorators, generators, and async programming.' },
    { skill: 'sql', title: 'Phase 2: Database Querying & ORMs', desc: 'Integrate PostgreSQL with SQLAlchemy ORM and raw SQL.' },
    { skill: 'fastapi', title: 'Phase 3: FastAPI / Flask Web Services', desc: 'Build RESTful APIs with Pydantic validation and middleware.' },
    { skill: 'django', title: 'Phase 3: Django Full-Featured Framework', desc: 'Develop secure web apps with Django ORM and admin portal.' },
    { skill: 'docker', title: 'Phase 4: Docker Containerization', desc: 'Containerize microservices for scalable cloud deployment.' }
  ],
  'Frontend Developer': [
    { skill: 'html', title: 'Phase 1: HTML5 & Semantic Web', desc: 'Build structured, accessible, semantic web pages.' },
    { skill: 'css', title: 'Phase 1: CSS3 & Responsive Design', desc: 'Master Flexbox, Grid, animations, and media queries.' },
    { skill: 'javascript', title: 'Phase 2: Modern JavaScript (ES6+)', desc: 'Master DOM manipulation, promises, async/await, and fetch API.' },
    { skill: 'typescript', title: 'Phase 2: TypeScript Static Typing', desc: 'Add strict type definitions for scalable frontend applications.' },
    { skill: 'react', title: 'Phase 3: React.js Component Architecture', desc: 'Build modular component trees, state management, and custom hooks.' },
    { skill: 'tailwind', title: 'Phase 4: Tailwind CSS Styling', desc: 'Rapidly style modern responsive user interfaces with utility classes.' }
  ],
  'Backend Developer': [
    { skill: 'python', title: 'Phase 1: Backend Programming', desc: 'Master server-side programming concepts and OOP.' },
    { skill: 'sql', title: 'Phase 2: Relational Databases', desc: 'Design schemas, indexes, and query optimizations.' },
    { skill: 'express', title: 'Phase 3: RESTful Microservices', desc: 'Build scalable API endpoints with input validation and JWT auth.' },
    { skill: 'redis', title: 'Phase 4: High-Speed Caching (Redis)', desc: 'Implement in-memory caching and session rate limiting.' },
    { skill: 'docker', title: 'Phase 5: Cloud Deployment & Docker', desc: 'Package and deploy microservices to cloud environments.' }
  ]
};

// Target Job Role Skill Profiles & Competency Definitions
const ROLE_SKILL_PROFILES = {
  'Cloud / DevOps Engineer': {
    targetRole: 'Cloud / DevOps Engineer',
    icon: '☁️',
    requiredSkills: ['aws', 'azure', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'git', 'python'],
    competencies: [
      { name: 'Cloud Platforms & Infrastructure', skills: ['aws', 'azure', 'gcp', 'terraform'] },
      { name: 'Containerization & Orchestration', skills: ['docker', 'kubernetes'] },
      { name: 'CI/CD & Automation', skills: ['ci/cd', 'git', 'python'] }
    ]
  },
  'Full Stack Developer': {
    targetRole: 'Full Stack Developer',
    icon: '💻',
    requiredSkills: ['react', 'next.js', 'javascript', 'typescript', 'node', 'express', 'rest api', 'sql', 'mongodb', 'postgresql'],
    competencies: [
      { name: 'Frontend Engineering', skills: ['react', 'next.js', 'javascript', 'typescript', 'html', 'css'] },
      { name: 'Backend APIs & Services', skills: ['node', 'express', 'rest api'] },
      { name: 'Database Systems', skills: ['sql', 'postgresql', 'mysql', 'mongodb'] }
    ]
  },
  'Data Engineer': {
    targetRole: 'Data Engineer',
    icon: '🗄️',
    requiredSkills: ['sql', 'python', 'etl', 'apache spark', 'spark', 'airflow', 'big data', 'postgresql', 'mongodb'],
    competencies: [
      { name: 'SQL & Data Warehousing', skills: ['sql', 'postgresql', 'mysql'] },
      { name: 'Big Data & ETL Processing', skills: ['python', 'etl', 'apache spark', 'spark', 'big data'] },
      { name: 'Pipeline Orchestration', skills: ['airflow', 'docker', 'aws'] }
    ]
  },
  'AI/ML Engineer': {
    targetRole: 'AI/ML Engineer',
    icon: '🤖',
    requiredSkills: ['python', 'numpy', 'pandas', 'scikit-learn', 'pytorch', 'tensorflow', 'deep learning', 'nlp', 'sql', 'fastapi', 'docker'],
    competencies: [
      { name: 'Programming & Logic', skills: ['python', 'git', 'c++', 'problem solving'] },
      { name: 'Data Processing & Analytics', skills: ['numpy', 'pandas', 'data analysis', 'excel'] },
      { name: 'Machine Learning Pipelines', skills: ['scikit-learn', 'machine learning', 'statistics'] },
      { name: 'Deep Learning & Neural Nets', skills: ['pytorch', 'tensorflow', 'keras', 'deep learning'] },
      { name: 'NLP & Language Models', skills: ['nlp', 'transformers'] },
      { name: 'Database & SQL Querying', skills: ['sql', 'postgresql', 'mysql'] }
    ]
  },
  'Data Scientist': {
    targetRole: 'Data Scientist',
    icon: '🔬',
    requiredSkills: ['python', 'pandas', 'numpy', 'scikit-learn', 'statistics', 'sql', 'machine learning', 'power bi', 'tableau'],
    competencies: [
      { name: 'Data Manipulation', skills: ['python', 'pandas', 'numpy', 'excel'] },
      { name: 'Statistical Analysis', skills: ['statistics', 'data analysis'] },
      { name: 'Machine Learning', skills: ['scikit-learn', 'machine learning'] },
      { name: 'SQL & Data Querying', skills: ['sql', 'postgresql', 'mysql'] },
      { name: 'Business Intelligence', skills: ['power bi', 'tableau'] }
    ]
  },
  'Data Analyst': {
    targetRole: 'Data Analyst',
    icon: '📊',
    requiredSkills: ['excel', 'sql', 'python', 'pandas', 'power bi', 'tableau', 'statistics', 'data analysis'],
    competencies: [
      { name: 'Spreadsheets & Excel', skills: ['excel'] },
      { name: 'SQL & Database Querying', skills: ['sql', 'postgresql', 'mysql'] },
      { name: 'Python Data Analysis', skills: ['python', 'pandas', 'data analysis'] },
      { name: 'BI Dashboards', skills: ['power bi', 'tableau'] }
    ]
  },
  'Python Developer': {
    targetRole: 'Python Developer',
    icon: '🐍',
    requiredSkills: ['python', 'django', 'flask', 'fastapi', 'sql', 'postgresql', 'docker', 'git', 'rest api'],
    competencies: [
      { name: 'Core Python Syntax', skills: ['python', 'git', 'problem solving'] },
      { name: 'Web Frameworks', skills: ['django', 'flask', 'fastapi'] },
      { name: 'Database & SQL', skills: ['sql', 'postgresql', 'mysql', 'mongodb'] },
      { name: 'DevOps & Containers', skills: ['docker', 'aws', 'kubernetes'] }
    ]
  },
  'Frontend Developer': {
    targetRole: 'Frontend Developer',
    icon: '💻',
    requiredSkills: ['html', 'css', 'javascript', 'typescript', 'react', 'tailwind', 'bootstrap', 'git', 'figma'],
    competencies: [
      { name: 'HTML & CSS Layouts', skills: ['html', 'css', 'tailwind', 'bootstrap'] },
      { name: 'JavaScript & TypeScript', skills: ['javascript', 'typescript'] },
      { name: 'React Framework', skills: ['react', 'next.js', 'vue', 'angular'] },
      { name: 'UI/UX & Design Systems', skills: ['figma', 'ui/ux', 'ui', 'ux'] }
    ]
  },
  'Backend Developer': {
    targetRole: 'Backend Developer',
    icon: '⚙️',
    requiredSkills: ['python', 'java', 'node', 'express', 'sql', 'postgresql', 'mongodb', 'redis', 'docker', 'git'],
    competencies: [
      { name: 'Backend Programming', skills: ['python', 'java', 'node', 'express', 'c++'] },
      { name: 'Database Architecture', skills: ['sql', 'postgresql', 'mysql', 'mongodb', 'redis'] },
      { name: 'DevOps & Containers', skills: ['docker', 'kubernetes', 'aws'] }
    ]
  }
};

// Pre-configured Career Paths database matching exact user requirements
const CAREER_DATABASE = {
  'ai-ml-engineer': {
    title: 'AI/ML Engineer',
    matchScore: 92,
    tagline: 'Design, train, and deploy machine learning models and neural networks.',
    coreSkills: ['python', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'nlp', 'scikit-learn', 'numpy', 'pandas'],
    secondarySkills: ['sql', 'fastapi', 'docker', 'git', 'c++'],
    requiredSkills: ['python', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'nlp', 'scikit-learn', 'numpy', 'pandas', 'sql', 'fastapi', 'docker'],
    matchedSkills: ['Python', 'Machine Learning', 'Problem Solving', 'Data Analysis', 'Git'],
    skillsToDevelop: ['PyTorch / TensorFlow', 'Deep Learning', 'NLP & LLMs', 'Docker', 'FastAPI Model Serving'],
    roadmap: [
      { step: 1, title: 'Python Core & Algorithms', desc: 'Master core Python syntax, OOP concepts, data structures, and algorithmic efficiency.' },
      { step: 2, title: 'NumPy & Pandas Data Wrangling', desc: 'Data manipulation, vector math, data cleaning, and exploratory data analysis.' },
      { step: 3, title: 'Machine Learning Frameworks', desc: 'Supervised & unsupervised algorithms with Scikit-Learn (Regression, Trees, Clustering).' },
      { step: 4, title: 'Deep Learning & Neural Architectures', desc: 'Neural networks, CNNs, RNNs, and model training using PyTorch or TensorFlow.' },
      { step: 5, title: 'NLP & Vision Models', desc: 'Transformers, BERT, LLMs, Hugging Face ecosystem, and OpenCV vision processing.' },
      { step: 6, title: 'AI/ML Projects', desc: 'Build and showcase 2-3 production-ready portfolio projects (e.g. RAG system, image classifier).' },
      { step: 7, title: 'MLOps Deployment', desc: 'Prepare for technical interviews, MLOps deployment with Docker & FastAPI, and land roles.' }
    ]
  },
  'python-developer': {
    title: 'Python Developer',
    matchScore: 88,
    tagline: 'Build backend microservices, automation scripts, and REST APIs.',
    coreSkills: ['python', 'django', 'flask', 'fastapi', 'sql', 'postgresql', 'rest api'],
    secondarySkills: ['git', 'docker', 'redis', 'mongodb', 'c++'],
    requiredSkills: ['python', 'django', 'flask', 'fastapi', 'sql', 'postgresql', 'docker', 'git', 'rest api'],
    matchedSkills: ['Python', 'Git', 'Problem Solving'],
    skillsToDevelop: ['Django / Flask / FastAPI', 'PostgreSQL / SQL', 'REST APIs', 'Unit Testing', 'Docker'],
    roadmap: [
      { step: 1, title: 'Python Mastery', desc: 'In-depth Python idioms, decorators, generators, and async programming.' },
      { step: 2, title: 'Web Frameworks', desc: 'Build REST APIs using FastAPI or Flask with request validation.' },
      { step: 3, title: 'Database Integration', desc: 'ORM setup with SQLAlchemy / Django ORM, raw SQL queries, and migrations.' },
      { step: 4, title: 'API Security & Testing', desc: 'Implement JWT authentication, CORS, rate limiting, and PyTest suites.' },
      { step: 5, title: 'Deployment & DevOps', desc: 'Containerize with Docker, deploy to AWS/Render, and set up CI/CD.' }
    ]
  },
  'web-developer': {
    title: 'Web Developer',
    matchScore: 85,
    tagline: 'Develop responsive user interfaces and dynamic web applications.',
    coreSkills: ['html', 'css', 'javascript', 'react', 'tailwind', 'bootstrap'],
    secondarySkills: ['git', 'typescript', 'ui/ux', 'figma'],
    requiredSkills: ['html', 'css', 'javascript', 'react', 'tailwind', 'bootstrap', 'git'],
    matchedSkills: ['HTML5', 'CSS3', 'JavaScript', 'React.js'],
    skillsToDevelop: ['Tailwind CSS', 'TypeScript', 'Node.js Basics', 'State Management'],
    roadmap: [
      { step: 1, title: 'HTML5 & CSS3', desc: 'Semantic HTML, Flexbox, Grid, and responsive web design techniques.' },
      { step: 2, title: 'JavaScript Fundamentals', desc: 'DOM manipulation, ES6+ features, fetch API, promises, and async/await.' },
      { step: 3, title: 'React.js', desc: 'Component architecture, state, props, hooks (useState, useEffect), and JSX.' },
      { step: 4, title: 'Modern CSS Frameworks', desc: 'Rapid styling using Tailwind CSS and component libraries.' },
      { step: 5, title: 'Full Stack Integration', desc: 'Connect React frontend with REST backend APIs and database storage.' }
    ]
  },
  'full-stack-developer': {
    title: 'Full Stack Developer',
    matchScore: 82,
    tagline: 'Build scalable web applications, dynamic frontend interfaces, and robust backend REST APIs.',
    coreSkills: ['react', 'javascript', 'node', 'express', 'sql', 'mongodb', 'next.js', 'rest api', 'html', 'css'],
    secondarySkills: ['typescript', 'postgresql', 'tailwind', 'docker', 'git'],
    requiredSkills: ['react', 'next.js', 'javascript', 'typescript', 'node', 'express', 'rest api', 'sql', 'mongodb', 'postgresql', 'html', 'css', 'tailwind'],
    matchedSkills: ['JavaScript', 'React.js', 'HTML5', 'CSS3', 'Git'],
    skillsToDevelop: ['Next.js', 'Node.js & Express', 'REST APIs', 'PostgreSQL / SQL', 'MongoDB'],
    roadmap: [
      { step: 1, title: 'Frontend Foundations (HTML5, CSS3, ES6+)', desc: 'Master semantic HTML, responsive CSS layouts (Flexbox/Grid), and modern asynchronous JavaScript.' },
      { step: 2, title: 'Modern Frontend (React.js & Next.js)', desc: 'Build modular UI components, manage state hooks, routing, and leverage Next.js SSR/SSG capabilities.' },
      { step: 3, title: 'Backend Web Services (Node.js & Express)', desc: 'Create RESTful backend microservices, custom middleware, and request validation pipelines.' },
      { step: 4, title: 'Database Architecture & ORMs', desc: 'Design relational (PostgreSQL / MySQL) & NoSQL (MongoDB) schemas using ORMs like Prisma or Mongoose.' },
      { step: 5, title: 'API Security & Authentication', desc: 'Implement JWT authentication, OAuth2 login flows, password hashing, and CORS protection.' },
      { step: 6, title: 'Full Stack Integration & State Management', desc: 'Connect React frontend with Express backend APIs, manage global state, and write automated tests.' },
      { step: 7, title: 'Cloud Deployment & DevOps Basics', desc: 'Package app with Docker, deploy frontend to Vercel and backend to cloud services with automated CI/CD.' }
    ]
  },
  'data-analyst': {
    title: 'Data Analyst',
    matchScore: 78,
    tagline: 'Transform complex datasets into actionable business insights and dashboards.',
    coreSkills: ['sql', 'data analysis', 'excel', 'power bi', 'tableau', 'pandas', 'python', 'statistics'],
    secondarySkills: ['mysql', 'postgresql', 'sqlite', 'problem solving'],
    requiredSkills: ['excel', 'sql', 'python', 'pandas', 'power bi', 'tableau', 'statistics', 'data analysis'],
    matchedSkills: ['Python', 'Data Analysis', 'Problem Solving', 'Excel'],
    skillsToDevelop: ['Advanced SQL', 'Power BI / Tableau', 'Statistics & A/B Testing', 'Data Storytelling'],
    roadmap: [
      { step: 1, title: 'Excel & SQL Basics', desc: 'Master Pivot Tables, VLOOKUP, basic SQL queries, joins, and database structures.' },
      { step: 2, title: 'Python for Data Analysis', desc: 'Learn Pandas, NumPy, and Matplotlib for data wrangling and charting.' },
      { step: 3, title: 'Advanced SQL Analytics', desc: 'CTEs, Window functions, complex aggregations, and query optimization.' },
      { step: 4, title: 'BI Dashboards', desc: 'Build interactive executive dashboards using Power BI or Tableau.' },
      { step: 5, title: 'Applied Statistics', desc: 'Hypothesis testing, probability distributions, and A/B test evaluation.' },
      { step: 6, title: 'Analytics Projects', desc: 'Analyze real-world business datasets and publish case studies.' }
    ]
  },
  'data-engineer': {
    title: 'Data Engineer',
    matchScore: 74,
    tagline: 'Architect enterprise data pipelines, ETL workflows, big data engines, and data warehouses.',
    coreSkills: ['sql', 'python', 'etl', 'apache spark', 'spark', 'airflow', 'big data', 'postgresql'],
    secondarySkills: ['mongodb', 'docker', 'aws', 'git'],
    requiredSkills: ['sql', 'python', 'etl', 'apache spark', 'spark', 'airflow', 'big data', 'postgresql', 'mongodb', 'docker', 'aws'],
    matchedSkills: ['Python', 'SQL', 'Data Analysis', 'PostgreSQL'],
    skillsToDevelop: ['ETL Pipelines', 'Apache Spark', 'Apache Airflow', 'Big Data Architecture', 'Data Warehousing'],
    roadmap: [
      { step: 1, title: 'Advanced SQL & Database Modeling', desc: 'Master complex database queries, CTEs, window functions, indexing, and relational schema normalization.' },
      { step: 2, title: 'Python for Data Engineering', desc: 'Develop advanced Python scripts to extract, clean, transform, and validate structured and unstructured data formats.' },
      { step: 3, title: 'ETL / ELT Pipeline Architecture', desc: 'Design reliable, fault-tolerant Extract, Transform, Load pipelines connecting databases, APIs, and file lakes.' },
      { step: 4, title: 'Big Data Processing (Apache Spark)', desc: 'Process massive distributed datasets in parallel using PySpark, DataFrames, and Spark Streaming.' },
      { step: 5, title: 'Workflow Orchestration (Apache Airflow)', desc: 'Automate, schedule, and monitor complex data pipeline Directed Acyclic Graphs (DAGs) using Airflow.' },
      { step: 6, title: 'Cloud Data Warehousing', desc: 'Model and query cloud data warehouses such as Snowflake, Google BigQuery, or AWS Redshift.' },
      { step: 7, title: 'Data Pipeline Engineering Capstone', desc: 'Build an end-to-end automated streaming data pipeline delivering real-time metrics to an analytical dashboard.' }
    ]
  },
  'cloud-devops-engineer': {
    title: 'Cloud / DevOps Engineer',
    matchScore: 70,
    tagline: 'Automate cloud infrastructure, CI/CD pipelines, container orchestration, and IaC deployments.',
    coreSkills: ['aws', 'azure', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'git'],
    secondarySkills: ['python', 'gcp', 'bash', 'linux'],
    requiredSkills: ['aws', 'azure', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'git', 'python'],
    matchedSkills: ['AWS Cloud', 'Docker', 'Git', 'Linux'],
    skillsToDevelop: ['Kubernetes', 'CI/CD Pipelines', 'Terraform', 'Microsoft Azure'],
    roadmap: [
      { step: 1, title: 'Linux & Scripting', desc: 'Master Linux command-line administration, Bash scripting, and Git version control fundamentals.' },
      { step: 2, title: 'Cloud Infrastructure (AWS / Azure)', desc: 'Learn core cloud architecture, IAM roles, virtual servers (EC2/VMs), networking (VPC), and cloud storage.' },
      { step: 3, title: 'Containerization with Docker', desc: 'Containerize microservices, write efficient Dockerfiles, and manage multi-container setups with Docker Compose.' },
      { step: 4, title: 'Container Orchestration (Kubernetes)', desc: 'Deploy, scale, and manage resilient production container clusters using Kubernetes (K8s) objects & Helm.' },
      { step: 5, title: 'Infrastructure as Code (Terraform)', desc: 'Automate multi-cloud infrastructure provisioning and state management using Terraform modules.' },
      { step: 6, title: 'CI/CD Pipeline Automation', desc: 'Build automated continuous integration and continuous deployment pipelines using GitHub Actions or Jenkins.' },
      { step: 7, title: 'DevOps Security & Monitoring', desc: 'Implement Prometheus/Grafana monitoring, centralized logging, secrets management, and cloud security best practices.' }
    ]
  }
};

const CareerToolsPage = () => {
  // Navigation view state: 'dashboard' | 'form' | 'results' | 'roadmap' | 'skill-gap-form' | 'skill-gap-report' | 'interview-prep-form' | 'interview-prep-output'
  const [activeView, setActiveView] = useState('dashboard');
  const [inputOption, setInputOption] = useState('manual'); // 'upload' | 'manual'
  
  // Career Path Form State
  const [formData, setFormData] = useState({
    education: 'B.Tech Computer Science',
    skills: 'Python, HTML, CSS, Machine Learning',
    experience: 'Fresher',
    interests: 'AI/ML, Web Development'
  });

  // Skill Gap Analyzer State
  const [skillGapRole, setSkillGapRole] = useState('AI/ML Engineer');
  const [skillGapFile, setSkillGapFile] = useState(null);
  const [skillGapJd, setSkillGapJd] = useState('');
  
  // Dynamic Parsed Skill Gap Report Output State
  const [parsedReport, setParsedReport] = useState(null);

  // AI Interview Preparation Form State
  const [interviewType, setInterviewType] = useState('mixed'); // 'technical' | 'hr' | 'mixed'
  const [interviewDifficulty, setInterviewDifficulty] = useState('Intermediate'); // 'Beginner' | 'Intermediate' | 'Advanced'
  const [questionCount, setQuestionCount] = useState(10); // 5 | 10 | 15
  const [interviewFile, setInterviewFile] = useState(null);
  const [interviewJd, setInterviewJd] = useState('');
  
  // Interview Prep Output State
  const [generatedInterviewData, setGeneratedInterviewData] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  // AI Cover Letter Generator State
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [coverLetterJobTitle, setCoverLetterJobTitle] = useState('');
  const [coverLetterCompany, setCoverLetterCompany] = useState('');
  const [coverLetterJd, setCoverLetterJd] = useState('');
  const [coverLetterTone, setCoverLetterTone] = useState('Professional'); // 'Professional' | 'Enthusiastic' | 'Formal' | 'Creative'
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState(null);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [editedCoverLetterText, setEditedCoverLetterText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Upload Resume File State
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected Career Path for Detailed Roadmap View
  const [selectedCareerKey, setSelectedCareerKey] = useState('ai-ml-engineer');
  const [careerRecommendations, setCareerRecommendations] = useState(CAREER_DATABASE);
  const [modalToolInfo, setModalToolInfo] = useState(null);

  // Helper: Advanced Case-Insensitive Skill Extraction
  const extractSkillsFromText = (text) => {
    if (!text) return [];
    const lowerText = text.toLowerCase();
    const found = [];

    GLOBAL_SKILLS_LIST.forEach((skill) => {
      if (NOISE_WORDS.has(skill)) return;

      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-z0-9#+])(${escaped})(?:$|[^a-z0-9#+])`, 'i');

      if (regex.test(lowerText) || lowerText.includes(skill)) {
        found.push(skill.toLowerCase());
      }
    });

    return Array.from(new Set(found));
  };

  // Helper: Format raw lowercase skills to canonical professional titles
  const formatSkillCanonical = (skillKey) => {
    const key = (skillKey || '').toLowerCase();
    return CANONICAL_SKILL_NAMES[key] || (key.charAt(0).toUpperCase() + key.slice(1));
  };

  // Handle Career Path Form Submission with Independent Skill Overlap & Domain Matching
  const handleFindCareerPath = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setErrorMsg('');

    let extractedUserSkills = [];

    if (inputOption === 'upload' && resumeFile) {
      try {
        const textFromFileName = extractSkillsFromText(resumeFile.name);
        extractedUserSkills.push(...textFromFileName);

        if (resumeFile.name.endsWith('.txt')) {
          const textContent = await resumeFile.text();
          const textSkills = extractSkillsFromText(textContent);
          extractedUserSkills.push(...textSkills);
        }

        const bodyFormData = new FormData();
        bodyFormData.append('file', resumeFile, resumeFile.name);
        const res = await api.post('/api/analysis/analyze', bodyFormData);
        if (res.data?.analysis?.report_data?.skills_found) {
          const backendSkills = res.data.analysis.report_data.skills_found.map(s => s.toLowerCase());
          extractedUserSkills.push(...backendSkills);
        }
      } catch (err) {
        console.warn('Backend parse notice:', err?.response?.data?.message || err.message);
      }
    } else {
      extractedUserSkills = extractSkillsFromText(`${formData.skills} ${formData.interests}`);
    }

    const userSkillsClean = Array.from(new Set(extractedUserSkills.map(s => s.toLowerCase())));
    const userInterestsLower = (formData.interests || '').toLowerCase();

    // Evaluate dynamic match scores independently for each of the 7 roles
    const evaluatedDatabase = {};

    Object.entries(CAREER_DATABASE).forEach(([key, role]) => {
      const coreList = role.coreSkills || role.requiredSkills || [];
      const secList = role.secondarySkills || [];
      const allRequired = Array.from(new Set([...coreList, ...secList]));

      const coreMatched = coreList.filter(sk =>
        userSkillsClean.some(uSkill => uSkill.includes(sk) || sk.includes(uSkill))
      );
      const secMatched = secList.filter(sk =>
        userSkillsClean.some(uSkill => uSkill.includes(sk) || sk.includes(uSkill))
      );
      const allMatched = Array.from(new Set([...coreMatched, ...secMatched]));
      const allMissing = allRequired.filter(sk => !allMatched.includes(sk));

      let computedScore = role.matchScore;

      if (userSkillsClean.length > 0) {
        // Independent Core Skills overlap ratio
        const minTargetCoreCount = Math.min(2, coreList.length);
        const coreRatio = minTargetCoreCount > 0 ? Math.min(1, coreMatched.length / minTargetCoreCount) : 0;
        
        // Secondary skills overlap ratio
        const secRatio = secList.length > 0 ? Math.min(1, secMatched.length / secList.length) : 0;

        let score = 45 + Math.round(coreRatio * 38) + Math.round(secRatio * 12);

        // Target Domain Alignment Boost
        if (userInterestsLower.includes(role.title.toLowerCase()) ||
            (key === 'ai-ml-engineer' && (userInterestsLower.includes('ai') || userInterestsLower.includes('ml') || userInterestsLower.includes('machine learning'))) ||
            (key === 'python-developer' && userInterestsLower.includes('python')) ||
            (key === 'web-developer' && userInterestsLower.includes('web')) ||
            (key === 'full-stack-developer' && (userInterestsLower.includes('web') || userInterestsLower.includes('full stack'))) ||
            (key === 'data-analyst' && (userInterestsLower.includes('data') || userInterestsLower.includes('analyst'))) ||
            (key === 'cloud-devops-engineer' && (userInterestsLower.includes('cloud') || userInterestsLower.includes('devops'))) ||
            (key === 'data-engineer' && (userInterestsLower.includes('data') || userInterestsLower.includes('engineer') || userInterestsLower.includes('pipeline')))) {
          score += 5;
        }

        computedScore = Math.min(98, Math.max(35, score));
      }

      const displayMatched = allMatched.length > 0
        ? allMatched.map(s => formatSkillCanonical(s))
        : role.matchedSkills;

      const displayToDevelop = allMissing.length > 0
        ? allMissing.slice(0, 5).map(s => formatSkillCanonical(s))
        : role.skillsToDevelop;

      evaluatedDatabase[key] = {
        ...role,
        matchScore: computedScore,
        matchedSkills: displayMatched,
        skillsToDevelop: displayToDevelop
      };
    });

    setCareerRecommendations(evaluatedDatabase);

    setTimeout(() => {
      setLoading(false);
      setActiveView('results');
    }, 500);
  };

  // Handle Skill Gap Analyzer Submission
  const handleAnalyzeSkillGap = async (e) => {
    e?.preventDefault();
    setLoading(true);

    let extractedSkillsRaw = [];

    if (skillGapFile) {
      try {
        const textFromFileName = extractSkillsFromText(skillGapFile.name);
        extractedSkillsRaw.push(...textFromFileName);

        if (skillGapFile.name.endsWith('.txt')) {
          const textContent = await skillGapFile.text();
          const textSkills = extractSkillsFromText(textContent);
          extractedSkillsRaw.push(...textSkills);
        }

        const bodyFormData = new FormData();
        bodyFormData.append('file', skillGapFile, skillGapFile.name);
        if (skillGapJd.trim()) {
          bodyFormData.append('job_description', skillGapJd.trim());
        }

        const res = await api.post('/api/analysis/analyze', bodyFormData);
        if (res.data?.analysis?.report_data?.skills_found) {
          const backendSkills = res.data.analysis.report_data.skills_found.map(s => s.toLowerCase());
          extractedSkillsRaw.push(...backendSkills);
        }
      } catch (err) {
        console.warn('Backend parsing fallback:', err?.response?.data?.message || err.message);
      }
    } else {
      extractedSkillsRaw = extractSkillsFromText(formData.skills);
    }

    const extractedSkillsLower = Array.from(new Set(extractedSkillsRaw.map(s => s.toLowerCase())));
    const roleProfile = ROLE_SKILL_PROFILES[skillGapRole] || ROLE_SKILL_PROFILES['AI/ML Engineer'];
    const requiredList = roleProfile.requiredSkills;

    const displayYourSkills = extractedSkillsLower.length > 0
      ? extractedSkillsLower.map(s => formatSkillCanonical(s))
      : ['No common technical skills detected in uploaded file'];

    const missingSkillsLower = requiredList.filter(req =>
      !extractedSkillsLower.some(s => s.includes(req) || req.includes(s))
    );
    const displayMissingSkills = missingSkillsLower.map(s => formatSkillCanonical(s));

    const computedCompetencies = roleProfile.competencies.map((comp) => {
      const matched = comp.skills.filter(sk =>
        extractedSkillsLower.some(userSkill => userSkill.includes(sk) || sk.includes(userSkill))
      );
      const total = comp.skills.length;
      const percentage = total > 0 ? Math.round((matched.length / total) * 100) : 0;

      let rating = 'Beginner';
      let color = 'bg-rose-500';

      if (percentage >= 80) {
        rating = 'Strong';
        color = 'bg-emerald-500';
      } else if (percentage >= 60) {
        rating = 'Good';
        color = 'bg-blue-500';
      } else if (percentage >= 35) {
        rating = 'Needs Improvement';
        color = 'bg-amber-500';
      }

      return {
        name: comp.name,
        percentage,
        rating,
        color
      };
    });

    const roleRoadmapSeq = ROLE_PROGRESSIVE_ROADMAP[skillGapRole] || ROLE_PROGRESSIVE_ROADMAP['AI/ML Engineer'];
    let dynamicLearningPath = roleRoadmapSeq.filter(item => missingSkillsLower.includes(item.skill));

    if (dynamicLearningPath.length < 3 && missingSkillsLower.length > 0) {
      missingSkillsLower.forEach((mSkill) => {
        if (!dynamicLearningPath.some(item => item.skill === mSkill)) {
          dynamicLearningPath.push({
            skill: mSkill,
            title: `Learn ${formatSkillCanonical(mSkill)}`,
            desc: `Complete coursework and hands-on exercises in ${formatSkillCanonical(mSkill)}.`
          });
        }
      });
    }

    dynamicLearningPath = dynamicLearningPath.slice(0, 6).map((item, index) => ({
      step: index + 1,
      title: item.title,
      desc: item.desc
    }));

    if (dynamicLearningPath.length === 0) {
      dynamicLearningPath.push({
        step: 1,
        title: 'Build Advanced Portfolio Projects',
        desc: 'You have acquired all core required skills for this role! Build 2-3 production-ready projects to showcase your expertise.'
      });
    }

    setParsedReport({
      targetRole: skillGapRole,
      yourSkills: displayYourSkills,
      missingSkills: displayMissingSkills,
      competencies: computedCompetencies,
      learningPath: dynamicLearningPath
    });

    setTimeout(() => {
      setLoading(false);
      setActiveView('skill-gap-report');
    }, 400);
  };

  // Handle AI Interview Preparation Submission with STRICT RESUME SKILL PARSING & DOMAIN QUESTION ALIGNMENT
  const handleGenerateInterviewQuestions = async (e) => {
    e?.preventDefault();
    setLoading(true);

    let extractedSkillsRaw = [];

    // 1. Strictly extract skills from the uploaded interview resume file
    if (interviewFile) {
      try {
        const textFromFileName = extractSkillsFromText(interviewFile.name);
        extractedSkillsRaw.push(...textFromFileName);

        if (interviewFile.name.endsWith('.txt')) {
          const textContent = await interviewFile.text();
          const textSkills = extractSkillsFromText(textContent);
          extractedSkillsRaw.push(...textSkills);
        }

        const bodyFormData = new FormData();
        bodyFormData.append('file', interviewFile, interviewFile.name);
        if (interviewJd.trim()) {
          bodyFormData.append('job_description', interviewJd.trim());
        }

        const res = await api.post('/api/analysis/analyze', bodyFormData);
        if (res.data?.analysis?.report_data?.skills_found) {
          const backendSkills = res.data.analysis.report_data.skills_found.map(s => s.toLowerCase());
          extractedSkillsRaw.push(...backendSkills);
        }
      } catch (err) {
        console.warn('Interview parse notice:', err?.response?.data?.message || err.message);
      }
    } else {
      // Fallback: extract from manual skills form
      extractedSkillsRaw = extractSkillsFromText(formData.skills);
    }

    // Clean unique extracted lowercased skills
    const extractedSkillsLower = Array.from(new Set(extractedSkillsRaw.map(s => s.toLowerCase())));
    const detectedSkillsCanonical = extractedSkillsLower.length > 0
      ? extractedSkillsLower.map(s => formatSkillCanonical(s))
      : ['General Software Engineering'];

    // 2. Build Domain-Tailored Technical Interview Questions based on GENUINE extracted skills
    const technicalQuestionsPool = [];

    // Check for UI/UX & Design Skills
    const hasDesignSkill = extractedSkillsLower.some(s => ['figma', 'ui/ux', 'ux', 'ui', 'photoshop', 'illustrator', 'wireframing', 'user research', 'design systems'].includes(s));
    if (hasDesignSkill) {
      technicalQuestionsPool.push(
        {
          id: 'design_1',
          category: 'Technical',
          domain: 'UI/UX Design Systems & Figma',
          question: 'Can you walk through your process in Figma for creating scalable component libraries, auto-layout constraints, and design systems for web and mobile?',
          resumeBadge: 'Tailored from resume skill: Figma / Design Systems',
          sampleAnswer: 'I start by establishing global design tokens for typography, color palettes, and spacing variables in Figma. I build atomic components using auto-layout, component variants, and interactive properties to ensure seamless handoff to development teams.'
        },
        {
          id: 'design_2',
          category: 'Technical',
          domain: 'User Research & Usability Testing',
          question: 'How do you plan and conduct User Research and usability testing to validate wireframes before finalizing high-fidelity prototypes?',
          resumeBadge: 'Tailored from resume skill: User Research & Wireframing',
          sampleAnswer: 'I define target user personas and task scenarios, then conduct moderated usability testing with interactive Figma prototypes. I track task completion speed and user friction points, iterating on wireframes based on qualitative user feedback.'
        },
        {
          id: 'design_3',
          category: 'Technical',
          domain: 'User Interface & Wireframing',
          question: 'How do you translate complex product requirements into intuitive low-fidelity wireframes and high-fidelity UI prototypes?',
          resumeBadge: 'Tailored from resume skill: Wireframing & UI Design',
          sampleAnswer: 'I map out user flows and information architecture first, sketching low-fidelity wireframes to iterate on layout hierarchy with product managers. Once approved, I elevate them to high-fidelity UI screens adhering to accessibility guidelines.'
        }
      );
    }

    // Check for Web & Frontend Skills (HTML, CSS, JS, React)
    const hasFrontendSkill = extractedSkillsLower.some(s => ['html', 'css', 'javascript', 'typescript', 'react', 'tailwind', 'bootstrap'].includes(s));
    if (hasFrontendSkill) {
      technicalQuestionsPool.push(
        {
          id: 'web_1',
          category: 'Technical',
          domain: 'HTML5 / CSS3 & Accessibility',
          question: 'How do you ensure semantic HTML5 markup, WCAG accessibility compliance, and responsive CSS layouts across modern browsers?',
          resumeBadge: 'Tailored from resume skill: HTML5 / CSS3',
          sampleAnswer: 'I use semantic elements (<main>, <article>, <nav>), ARIA landmark attributes, proper contrast ratios, and focus states for keyboard navigation. For layouts, I combine CSS Grid and Flexbox with mobile-first media queries.'
        },
        {
          id: 'web_2',
          category: 'Technical',
          domain: 'Frontend Architecture & React',
          question: 'How do you manage component state and side effects in React applications using custom hooks and state management libraries?',
          resumeBadge: 'Tailored from resume skill: React.js',
          sampleAnswer: 'I keep transient UI state localized with useState, isolate async data fetching in useEffect with clean cleanup functions, and manage global application state using React Context or Redux/Zustand to prevent prop drilling.'
        }
      );
    }

    // Check for Data / AI Skills (Python, Pandas, ML, PyTorch, SQL)
    const hasDataAiSkill = extractedSkillsLower.some(s => ['python', 'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'machine learning', 'deep learning', 'nlp', 'sql'].includes(s));
    if (hasDataAiSkill) {
      technicalQuestionsPool.push(
        {
          id: 'ai_1',
          category: 'Technical',
          domain: 'Python Data Processing',
          question: 'How do you use Python, Pandas, and NumPy for data cleaning, vectorization, and handling missing values in production datasets?',
          resumeBadge: 'Tailored from resume skill: Python / Pandas',
          sampleAnswer: 'I replace scalar loop operations with vectorized Pandas dataframe transformations, impute missing values using domain-appropriate logic, and downcast numerical data types to optimize memory usage.'
        },
        {
          id: 'ai_2',
          category: 'Technical',
          domain: 'Machine Learning Modeling',
          question: 'Describe your methodology for feature engineering, model selection, and hyperparameter tuning using Scikit-Learn or PyTorch.',
          resumeBadge: 'Tailored from resume skill: Machine Learning / PyTorch',
          sampleAnswer: 'I perform exploratory data analysis, scale numerical features, and use stratified K-fold cross-validation with Optuna or GridSearch to optimize hyperparameters while preventing data leakage.'
        }
      );
    }

    // Generic Technical Fallback if non-matched
    if (technicalQuestionsPool.length === 0) {
      technicalQuestionsPool.push(
        {
          id: 'gen_1',
          category: 'Technical',
          domain: 'Problem Solving & System Logic',
          question: 'Walk through your technical workflow when tackling an unfamiliar technical task or learning a new domain tool.',
          resumeBadge: 'Problem Solving & Adaptability',
          sampleAnswer: 'I review official documentation, build a minimal proof-of-concept prototype, test edge cases, and integrate the solution incrementally into the main codebase with automated tests.'
        },
        {
          id: 'gen_2',
          category: 'Technical',
          domain: 'Code Quality & Git Version Control',
          question: 'What version control and code review practices do you follow to ensure high code quality across team projects?',
          resumeBadge: 'Git & Engineering Best Practices',
          sampleAnswer: 'I follow feature branch workflows, write atomic commit messages, create descriptive PR pull requests, and enforce automated CI pipeline checks before merging into main.'
        }
      );
    }

    // HR & Behavioral Questions Pool
    const hrQuestionsPool = [
      {
        id: 'h1',
        category: 'HR & Behavioral',
        domain: 'Conflict Resolution & Teamwork',
        question: `Tell me about a time when you had a technical or design disagreement with a team member. How did you reach a consensus?`,
        resumeBadge: 'Behavioral & Leadership',
        sampleAnswer: `Situation: During project planning, a colleague preferred a traditional layout while I advocated for a responsive auto-layout system. Action: I built a rapid side-by-side prototype demonstrating user flow efficiency. Result: Empirical metrics convinced the team to adopt the auto-layout design.`
      },
      {
        id: 'h2',
        category: 'HR & Behavioral',
        domain: 'Time Management & Deadlines',
        question: `Describe a situation where project scope changed close to a major release deadline. How did you adapt?`,
        resumeBadge: 'Agile Adaptation',
        sampleAnswer: `Situation: 48 hours before release, key requirements shifted. Action: I prioritized core MVP functionality, communicated transparently with stakeholders, and delivered essential features on schedule.`
      },
      {
        id: 'h3',
        category: 'HR & Behavioral',
        domain: 'Stakeholder Communication',
        question: `How do you explain complex technical concepts or design trade-offs to non-technical business stakeholders?`,
        resumeBadge: 'Stakeholder Communication',
        sampleAnswer: `I avoid deep jargon and use clear visual mockups and business metrics (turnaround speed, conversion rate, user retention) so stakeholders can make informed decisions.`
      },
      {
        id: 'h4',
        category: 'HR & Behavioral',
        domain: 'Growth & Continuous Learning',
        question: `How do you keep your skills up-to-date with fast-changing industry standards and new design/tech tools?`,
        resumeBadge: 'Continuous Learning',
        sampleAnswer: `I dedicate regular weekly time to exploring industry design systems, reading technical documentation, building experimental side projects, and following domain community updates.`
      }
    ];

    let selectedTech = [];
    let selectedHr = [];

    if (interviewType === 'technical') {
      selectedTech = technicalQuestionsPool.slice(0, questionCount);
    } else if (interviewType === 'hr') {
      selectedHr = hrQuestionsPool.slice(0, questionCount);
    } else {
      // Mixed
      const techCount = Math.ceil(questionCount / 2);
      const hrCount = Math.floor(questionCount / 2);
      selectedTech = technicalQuestionsPool.slice(0, techCount);
      selectedHr = hrQuestionsPool.slice(0, hrCount);
    }

    setGeneratedInterviewData({
      type: interviewType,
      difficulty: interviewDifficulty,
      questionCount,
      detectedSkills: detectedSkillsCanonical,
      technicalQuestions: selectedTech,
      hrQuestions: selectedHr
    });

    setExpandedAnswers({});

    setTimeout(() => {
      setLoading(false);
      setActiveView('interview-prep-output');
    }, 500);
  };

  const toggleSampleAnswer = (qId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Handle Cover Letter Generation & Dynamic Variation Synthesis
  const handleGenerateCoverLetter = async (e) => {
    e?.preventDefault();
    setLoading(true);

    let extractedSkillsRaw = [];

    if (coverLetterFile) {
      try {
        const textFromFileName = extractSkillsFromText(coverLetterFile.name);
        extractedSkillsRaw.push(...textFromFileName);

        if (coverLetterFile.name.endsWith('.txt')) {
          const textContent = await coverLetterFile.text();
          const textSkills = extractSkillsFromText(textContent);
          extractedSkillsRaw.push(...textSkills);
        }

        const bodyFormData = new FormData();
        bodyFormData.append('file', coverLetterFile, coverLetterFile.name);
        if (coverLetterJd.trim()) {
          bodyFormData.append('job_description', coverLetterJd.trim());
        }

        const res = await api.post('/api/analysis/analyze', bodyFormData);
        if (res.data?.analysis?.report_data?.skills_found) {
          const backendSkills = res.data.analysis.report_data.skills_found.map(s => s.toLowerCase());
          extractedSkillsRaw.push(...backendSkills);
        }
      } catch (err) {
        console.warn('Cover letter parse notice:', err?.response?.data?.message || err.message);
      }
    } else {
      extractedSkillsRaw = extractSkillsFromText(formData.skills);
    }

    const extractedSkillsLower = Array.from(new Set(extractedSkillsRaw.map(s => s.toLowerCase())));
    const detectedSkillsCanonical = extractedSkillsLower.length > 0
      ? extractedSkillsLower.map(s => formatSkillCanonical(s))
      : ['General Technical Competencies'];

    const jobTitle = coverLetterJobTitle.trim() || 'Software Engineer';
    const company = coverLetterCompany.trim() || 'Innovate Tech Solutions';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const topSkillsStr = detectedSkillsCanonical.slice(0, 5).join(', ');

    // Dynamic Tone Variations for Fresh Regeneration
    const toneVariants = {
      Professional: {
        intros: [
          `I am writing to express my strong enthusiasm and application for the ${jobTitle} position at ${company}.`,
          `Please accept this application for the ${jobTitle} role at ${company}. With a strong foundation in ${topSkillsStr}, I am eager to contribute to your team's ongoing success.`,
          `I am submitting my candidacy for the ${jobTitle} opportunity at ${company}, bringing extensive hands-on experience in ${topSkillsStr}.`
        ],
        body1: [
          `Throughout my experience, I have developed strong proficiency in key technical and domain competencies including ${topSkillsStr}. I have consistently demonstrated a track record of solving complex problems, building scalable solutions, and collaborating across cross-functional teams to deliver high-quality outcomes.`,
          `Over the course of my career, I have cultivated specialized expertise in ${topSkillsStr}. My focus has consistently been on driving technical excellence, streamlining development workflows, and delivering resilient solutions that align with business objectives.`,
          `My professional background is highlighted by expertise in ${topSkillsStr}. I excel at translating operational goals into scalable technical implementations while maintaining rigorous code and quality standards.`
        ],
        closings: [
          `Thank you for your time and consideration. I welcome the opportunity to discuss how my technical expertise and background align with the goals of ${company}.`,
          `I appreciate your review of my application and look forward to the possibility of discussing how my skills in ${topSkillsStr} can advance ${company}'s initiatives.`,
          `Thank you for considering my application. I am eager to explore how my technical qualifications fit the strategic vision of ${company}.`
        ]
      },
      Enthusiastic: {
        intros: [
          `I was thrilled to see the opening for the ${jobTitle} role at ${company}! As a passionate professional skilled in ${topSkillsStr}, I am eager to bring my creative energy and technical drive to your innovative team.`,
          `I am incredibly excited to apply for the ${jobTitle} role at ${company}! Having followed ${company}'s work with great admiration, I am eager to contribute my skills in ${topSkillsStr} to your high-performing team.`,
          `It is with immense excitement that I submit my application for the ${jobTitle} position at ${company}. My passion for ${topSkillsStr} aligns perfectly with your team's forward-thinking mission.`
        ],
        body1: [
          `Throughout my journey, I have passionately expanded my knowledge in ${topSkillsStr}. I thrive on taking on challenging problems, crafting high-impact solutions, and energizing team dynamics to push creative boundaries.`,
          `Driven by an intense enthusiasm for technical innovation, I have mastered competencies in ${topSkillsStr}. I am dedicated to delivering top-tier results and building intuitive, resilient systems.`,
          `My hands-on experience with ${topSkillsStr} has fueled my passion for building great products. I bring an upbeat, collaborative mindset that empowers cross-functional teams to excel.`
        ],
        closings: [
          `I would love the opportunity to connect and discuss how my enthusiasm and skill set can drive immediate value for ${company}. Thank you for reviewing my application!`,
          `I am super eager to take the next step and discuss how my energy and expertise in ${topSkillsStr} can help ${company} achieve its next milestones. Thank you for your consideration!`,
          `I look forward with great excitement to discussing how we can create remarkable results together at ${company}. Thank you for your time!`
        ]
      },
      Formal: {
        intros: [
          `Please accept this letter as a formal expression of interest in the ${jobTitle} role currently available at ${company}. With proven expertise in ${topSkillsStr}, I am confident in my capability to contribute effectively to your organization.`,
          `I hereby submit my application for the position of ${jobTitle} at ${company}. My background encompasses comprehensive technical knowledge in ${topSkillsStr}, enabling me to deliver rigorous results.`,
          `It is my privilege to apply for the position of ${jobTitle} with ${company}. Possessing core competencies in ${topSkillsStr}, I am prepared to fulfill the responsibilities of this role with distinction.`
        ],
        body1: [
          `Throughout my professional experience, I have developed strong proficiency in key technical and domain competencies including ${topSkillsStr}. I have consistently demonstrated a track record of solving complex problems, building scalable solutions, and collaborating across cross-functional teams.`,
          `My technical career has been defined by systematic methodology and expertise in ${topSkillsStr}. I prioritize structural integrity, data security, and operational efficiency in all technical endeavors.`,
          `In my previous positions, I have successfully applied ${topSkillsStr} to execute high-value projects. I adhere strictly to industry standards and best engineering principles.`
        ],
        closings: [
          `Thank you for considering my candidacy. I look forward to the opportunity of a formal interview to further present my qualifications.`,
          `Thank you for your attention to my application. I remain available at your convenience for a detailed discussion regarding my suitability for ${company}.`,
          `I appreciate your time and consideration of my credentials. I welcome the opportunity for an interview at your earliest convenience.`
        ]
      },
      Creative: {
        intros: [
          `Driven by a passion for building impactful digital solutions, I am excited to apply for the ${jobTitle} position at ${company}. Bringing a combination of specialized skills in ${topSkillsStr}, I thrive on translating vision into reality.`,
          `Where technical mastery meets innovative problem solving is where I perform best. I am thrilled to apply for the ${jobTitle} role at ${company}, armed with expertise in ${topSkillsStr}.`,
          `Crafting elegant, modern solutions is the cornerstone of my work. I am eager to bring my capabilities in ${topSkillsStr} to the ${jobTitle} position at ${company}.`
        ],
        body1: [
          `Combining technical rigor with a creative approach, I have built strong mastery in ${topSkillsStr}. I excel at rethinking traditional constraints to design modern, elegant, and highly responsive user experiences.`,
          `My work revolves around blending technical depth in ${topSkillsStr} with user-centric design principles. I am passionate about crafting seamless products that delight users and drive engagement.`,
          `By connecting creative problem-solving with technical skills like ${topSkillsStr}, I have consistently delivered distinctive solutions that stand out in quality and user experience.`
        ],
        closings: [
          `I am excited about the prospect of contributing to ${company}'s future growth. Thank you for your consideration, and I look forward to connecting soon.`,
          `I would welcome the chance to share how my creative mindset and technical execution in ${topSkillsStr} can empower ${company}. Thank you!`,
          `I look forward to discussing how my background can help shape the next generation of solutions at ${company}. Thank you for your time!`
        ]
      }
    };

    const currentToneConfig = toneVariants[coverLetterTone] || toneVariants.Professional;
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const toneIntro = getRandomItem(currentToneConfig.intros);
    const bodyParagraph1 = getRandomItem(currentToneConfig.body1);
    const toneClosing = getRandomItem(currentToneConfig.closings);

    const bodyParagraph2 = coverLetterJd.trim()
      ? `Having carefully reviewed the job description for the ${jobTitle} position, I am particularly drawn to ${company}'s mission. My technical skill set directly aligns with your requirements for key deliverables, including hands-on execution, rigorous quality standards, and continuous domain optimization.`
      : `My approach centers on continuous learning, operational efficiency, and clean implementation practices. I am particularly drawn to ${company}'s commitment to excellence and would be proud to contribute to your ongoing project initiatives.`;

    const fullLetterText = `${dateStr}

Hiring Manager / Talent Acquisition Team
${company}

Dear Hiring Manager,

${toneIntro}

${bodyParagraph1}

${bodyParagraph2}

${toneClosing}

Sincerely,

Applicant / Candidate`;

    setGeneratedCoverLetter({
      jobTitle,
      company,
      tone: coverLetterTone,
      detectedSkills: detectedSkillsCanonical,
      date: dateStr,
      fullText: fullLetterText
    });

    setEditedCoverLetterText(fullLetterText);
    setIsEditingCoverLetter(false);

    setTimeout(() => {
      setLoading(false);
      setActiveView('cover-letter-output');
    }, 400);
  };

  // Dedicated Handler for Cover Letter Regeneration Button
  const handleRegenerateCoverLetter = async (e) => {
    e?.preventDefault();
    setIsRegenerating(true);
    await handleGenerateCoverLetter(e);
    setIsRegenerating(false);
  };

  const handleCopyCoverLetter = () => {
    const textToCopy = editedCoverLetterText || generatedCoverLetter?.fullText || '';
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadCoverLetterPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const textToExport = editedCoverLetterText || generatedCoverLetter?.fullText || '';
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(33, 37, 41);

      const margin = 20;
      const pageHeight = 297;
      const printableWidth = 210 - margin * 2;
      
      const splitLines = doc.splitTextToSize(textToExport, printableWidth);
      
      let cursorY = 25;
      const lineHeight = 6;

      splitLines.forEach(line => {
        if (cursorY + lineHeight > pageHeight - margin) {
          doc.addPage();
          cursorY = 25;
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });

      const filename = `${(generatedCoverLetter?.company || 'Company').replace(/[^a-zA-Z0-9]/g, '_')}_Cover_Letter.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('PDF Export Error:', err);
    }
  };

  const handleOpenTool = (toolName) => {
    if (toolName === 'Career Path') {
      setActiveView('form');
    } else if (toolName === 'Skill Gap Analysis') {
      setActiveView('skill-gap-form');
    } else if (toolName === 'Interview Prep') {
      setActiveView('interview-prep-form');
    } else if (toolName === 'Cover Letter') {
      setActiveView('cover-letter-form');
    } else {
      setModalToolInfo({
        title: toolName,
        desc: `The ${toolName} module is ready for your profile. Explore customized recommendations below!`
      });
    }
  };

  const selectedCareer = (careerRecommendations && careerRecommendations[selectedCareerKey]) || CAREER_DATABASE[selectedCareerKey] || CAREER_DATABASE['cloud-devops-engineer'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* View State 1: Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                🚀 AI Career Intelligence Suite
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Career Tools Dashboard</h1>
              <p className="text-blue-100/80 text-sm sm:text-base max-w-2xl">
                Explore personalized career roadmaps, analyze skill gaps, practice interview questions, and craft winning cover letters tailored to your profile.
              </p>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Career Path */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl border border-blue-100">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-gray-900">Career Path</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Discover matching career paths based on your skills, education, and interests. Get step-by-step visual roadmaps to reach your target job.
                </p>
              </div>
              <button
                onClick={() => handleOpenTool('Career Path')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Explore Career Path</span>
                <span>→</span>
              </button>
            </div>

            {/* Card 2: Skill Gap Analysis */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl border border-emerald-100">
                  📊
                </div>
                <h3 className="text-xl font-bold text-gray-900">Skill Gap Analysis</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Compare your current technical skills against industry job specifications to pinpoint missing competencies and recommended learning actions.
                </p>
              </div>
              <button
                onClick={() => handleOpenTool('Skill Gap Analysis')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Analyze Skill Gap</span>
                <span>→</span>
              </button>
            </div>

            {/* Card 3: Interview Prep */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl border border-indigo-100">
                  💡
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Interview Preparation</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Access role-specific technical and behavioral interview questions extracted from your resume with sample STAR answers.
                </p>
              </div>
              <button
                onClick={() => handleOpenTool('Interview Prep')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Start Prep</span>
                <span>→</span>
              </button>
            </div>

            {/* Card 4: Cover Letter Generator */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl border border-purple-100">
                  📝
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cover Letter</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Generate tailored, highly persuasive cover letters matching your resume experience with target job descriptions.
                </p>
              </div>
              <button
                onClick={() => handleOpenTool('Cover Letter')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Generate Cover Letter</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Quick View for Secondary Tools */}
      {modalToolInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-[fadeIn_0.2s_ease]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{modalToolInfo.title}</h3>
              <button
                onClick={() => setModalToolInfo(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{modalToolInfo.desc}</p>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-xl">
              💡 Tip: Explore <strong>Career Path</strong>, <strong>Skill Gap Analysis</strong>, or <strong>Interview Prep</strong> for personalized tools.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setModalToolInfo(null);
                  setActiveView('interview-prep-form');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
              >
                AI Interview Prep
              </button>
              <button
                onClick={() => setModalToolInfo(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Interview Preparation Input Form */}
      {activeView === 'interview-prep-form' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <span>← Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                💡 AI Interview Preparation
              </div>
              <h2 className="text-2xl font-black text-gray-900">Configure Your Mock Interview</h2>
              <p className="text-xs text-gray-500 mt-1">
                Upload your resume and select your target parameters to generate tailored technical and behavioral questions with sample answers.
              </p>
            </div>

            <form onSubmit={handleGenerateInterviewQuestions} className="space-y-6">
              {/* Field 1: Upload Resume File */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Upload Resume File (.pdf, .docx, .txt) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-gray-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setInterviewFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                  />
                  {interviewFile && (
                    <p className="text-xs font-bold text-indigo-600 mt-2">
                      ✓ Resume File Selected: {interviewFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Field 2: Target Job Description / Role */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Target Job Description / Role (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Paste specific target job description here to tailor questions to job requirements..."
                  value={interviewJd}
                  onChange={(e) => setInterviewJd(e.target.value)}
                  className="w-full text-sm text-gray-800 border border-gray-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y"
                ></textarea>
              </div>

              {/* Field 3: Interview Type Selectors */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Interview Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'technical', label: '💻 Technical' },
                    { id: 'hr', label: '🤝 HR & Behavioral' },
                    { id: 'mixed', label: '⚡ Mixed (Both)' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInterviewType(type.id)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                        interviewType === type.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 4: Difficulty Level Selectors */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setInterviewDifficulty(diff)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                        interviewDifficulty === diff
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 5: Number of Questions Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value={5}>5 Questions (Quick Practice)</option>
                  <option value={10}>10 Questions (Standard Interview)</option>
                  <option value={15}>15 Questions (Comprehensive Mock)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <span>Extracting Context & Generating Questions...</span>
                ) : (
                  <>
                    <span>💡 Generate Questions</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Interview Preparation Output View */}
      {activeView === 'interview-prep-output' && generatedInterviewData && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('interview-prep-form')}
              className="text-xs font-semibold text-gray-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
            >
              <span>← Re-configure Parameters</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 uppercase">
                {generatedInterviewData.difficulty}
              </span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {generatedInterviewData.questionCount} Questions
              </span>
            </div>
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              💡 AI Tailored Questions & Answers
            </div>
            <h1 className="text-3xl font-black">AI Interview Question Bank</h1>
            <p className="text-indigo-100/80 text-xs sm:text-base mt-2 max-w-2xl">
              Extracted from your resume skills: <strong className="text-white">{generatedInterviewData.detectedSkills.join(', ')}</strong>
            </p>
          </div>

          {/* Categorized Questions Sections */}
          <div className="space-y-8">
            {/* 1. Technical Questions */}
            {generatedInterviewData.technicalQuestions.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <span>💻 Technical Questions ({generatedInterviewData.technicalQuestions.length})</span>
                  </h3>
                </div>

                <div className="space-y-6">
                  {generatedInterviewData.technicalQuestions.map((q, idx) => {
                    const isExpanded = !!expandedAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl border border-gray-200 bg-slate-50/50 hover:border-indigo-300 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">
                            Technical Q#{idx + 1} · {q.domain}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                            {q.resumeBadge}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-gray-900 leading-snug">
                          {q.question}
                        </h4>

                        {/* Expandable Sample Answer Toggle */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => toggleSampleAnswer(q.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2"
                          >
                            <span>{isExpanded ? '🙈 Hide Sample Answer' : '💡 Show Sample Answer'}</span>
                          </button>

                          {isExpanded && (
                            <div className="mt-3 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950 leading-relaxed animate-[fadeIn_0.2s_ease]">
                              <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                                <span>📖 Model Technical Answer:</span>
                              </div>
                              <p>{q.sampleAnswer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. HR & Behavioral Questions */}
            {generatedInterviewData.hrQuestions.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <span>🤝 HR & Behavioral Questions ({generatedInterviewData.hrQuestions.length})</span>
                  </h3>
                </div>

                <div className="space-y-6">
                  {generatedInterviewData.hrQuestions.map((q, idx) => {
                    const isExpanded = !!expandedAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl border border-gray-200 bg-slate-50/50 hover:border-purple-300 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg w-fit">
                            HR Q#{idx + 1} · {q.domain}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                            {q.resumeBadge}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-gray-900 leading-snug">
                          {q.question}
                        </h4>

                        {/* Expandable Sample Answer Toggle */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => toggleSampleAnswer(q.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2"
                          >
                            <span>{isExpanded ? '🙈 Hide STAR Answer' : '💡 Show STAR Sample Answer'}</span>
                          </button>

                          {isExpanded && (
                            <div className="mt-3 p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 leading-relaxed animate-[fadeIn_0.2s_ease]">
                              <div className="font-bold text-purple-900 mb-1 flex items-center gap-1">
                                <span>⭐ STAR Method Response Framework:</span>
                              </div>
                              <p>{q.sampleAnswer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Cover Letter Generator Input Form */}
      {activeView === 'cover-letter-form' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-gray-600 hover:text-purple-600 flex items-center gap-1.5 transition-colors"
          >
            <span>← Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                📝 AI Cover Letter Generator
              </div>
              <h2 className="text-2xl font-black text-gray-900">Customize Your Cover Letter</h2>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Generate a personalized, high-converting cover letter combining your extracted resume skills with your target job description and tone.
              </p>
            </div>

            <form onSubmit={handleGenerateCoverLetter} className="space-y-6">
              {/* Resume Upload Option */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  1. Upload Resume (Optional)
                </label>
                <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-2xl bg-slate-50 hover:bg-purple-50/50 transition-colors">
                  <input
                    type="file"
                    id="cover-letter-file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setCoverLetterFile(e.target.files[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-letter-file"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-sm transition-all"
                  >
                    Choose File
                  </label>
                  <span className="text-xs text-gray-600 truncate max-w-xs">
                    {coverLetterFile ? `📄 ${coverLetterFile.name}` : 'No file chosen (using profile skills)'}
                  </span>
                </div>
              </div>

              {/* Target Job Title & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    2. Target Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={coverLetterJobTitle}
                    onChange={(e) => setCoverLetterJobTitle(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    3. Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={coverLetterCompany}
                    onChange={(e) => setCoverLetterCompany(e.target.value)}
                    placeholder="e.g. Acme Innovations"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  4. Job Description (Paste Text)
                </label>
                <textarea
                  rows={4}
                  value={coverLetterJd}
                  onChange={(e) => setCoverLetterJd(e.target.value)}
                  placeholder="Paste key responsibilities or requirements from the job posting..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Tone Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  5. Desired Cover Letter Tone
                </label>
                <div className="relative w-full box-border">
                  <select
                    value={coverLetterTone}
                    onChange={(e) => setCoverLetterTone(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all cursor-pointer box-border overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <option value="Professional" className="py-2.5 px-3.5 text-xs bg-white text-gray-800 font-medium">
                      Professional (Corporate &amp; Balanced)
                    </option>
                    <option value="Enthusiastic" className="py-2.5 px-3.5 text-xs bg-white text-gray-800 font-medium">
                      Enthusiastic (Energetic &amp; Passionate)
                    </option>
                    <option value="Formal" className="py-2.5 px-3.5 text-xs bg-white text-gray-800 font-medium">
                      Formal (Traditional &amp; Executive)
                    </option>
                    <option value="Creative" className="py-2.5 px-3.5 text-xs bg-white text-gray-800 font-medium">
                      Creative (Modern &amp; Dynamic)
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-base">⏳</span>
                    <span>Synthesizing Cover Letter...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Generate Cover Letter</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Cover Letter Output View */}
      {activeView === 'cover-letter-output' && generatedCoverLetter && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('cover-letter-form')}
              className="text-xs font-semibold text-gray-600 hover:text-purple-600 flex items-center gap-1.5 transition-colors"
            >
              <span>← Edit Letter Parameters</span>
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Dashboard 🏠
            </button>
          </div>

          {/* Header Context Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Personalized AI Cover Letter
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-2">
                  {generatedCoverLetter.jobTitle} at {generatedCoverLetter.company}
                </h1>
              </div>
              <span className="bg-white/10 text-white border border-white/20 text-xs font-bold px-3 py-1.5 rounded-xl">
                Tone: {generatedCoverLetter.tone}
              </span>
            </div>

            {/* Extracted Skills Chips */}
            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[11px] font-medium text-purple-200/80">
                Skills incorporated from resume:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {generatedCoverLetter.detectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-purple-500/30 text-purple-100 border border-purple-400/30 text-[11px] font-medium px-2.5 py-0.5 rounded-md"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Paper Letter Card Preview */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest">
                Official Document Preview
              </span>
              <span className="text-xs text-gray-600 font-medium">
                {generatedCoverLetter.date}
              </span>
            </div>

            {isEditingCoverLetter ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500">
                  Edit Cover Letter Content:
                </label>
                <textarea
                  rows={16}
                  value={editedCoverLetterText}
                  onChange={(e) => setEditedCoverLetterText(e.target.value)}
                  className="w-full text-xs sm:text-sm font-sans leading-relaxed p-4 rounded-xl border border-purple-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4 font-normal">
                {editedCoverLetterText || generatedCoverLetter.fullText}
              </pre>
            )}

            {/* Utility Actions Bar */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {/* Edit Button */}
                <button
                  onClick={() => setIsEditingCoverLetter(!isEditingCoverLetter)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all"
                >
                  <span>{isEditingCoverLetter ? '✓ Save Edits' : '✏️ Edit Text'}</span>
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCoverLetter}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all"
                >
                  <span>{copySuccess ? '✓ Copied!' : '📋 Copy Text'}</span>
                </button>

                {/* Download PDF Button */}
                <button
                  onClick={handleDownloadCoverLetterPdf}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all"
                >
                  <span>📥 Download PDF</span>
                </button>
              </div>

              {/* Regenerate Button */}
              <button
                onClick={handleRegenerateCoverLetter}
                disabled={isRegenerating || loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isRegenerating ? (
                  <>
                    <span className="animate-spin text-sm">🔄</span>
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <>
                    <span>🔄 Regenerate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Gap Analyzer Input Form */}
      {activeView === 'skill-gap-form' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <span>← Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                📊 Skill Gap Analyzer
              </div>
              <h2 className="text-2xl font-black text-gray-900">Analyze Your Skill Gap</h2>
              <p className="text-xs text-gray-500 mt-1">
                Upload your resume and choose your target job role to generate a detailed skill gap report based on your actual resume text.
              </p>
            </div>

            <form onSubmit={handleAnalyzeSkillGap} className="space-y-5">
              {/* Field 1: Upload Resume File */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Upload Resume File (.pdf, .docx, .txt) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-emerald-400 bg-gray-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setSkillGapFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                  />
                  {skillGapFile && (
                    <p className="text-xs font-bold text-emerald-600 mt-2">
                      ✓ Resume File Selected: {skillGapFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Field 2: Target Job Role Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Target Job Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={skillGapRole}
                  onChange={(e) => setSkillGapRole(e.target.value)}
                  className="w-full text-sm font-semibold text-gray-900 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                >
                  <option value="Cloud / DevOps Engineer">☁️ Cloud / DevOps Engineer</option>
                  <option value="Full Stack Developer">💻 Full Stack Developer</option>
                  <option value="Data Engineer">🗄️ Data Engineer</option>
                  <option value="AI/ML Engineer">🤖 AI/ML Engineer</option>
                  <option value="Data Scientist">🔬 Data Scientist</option>
                  <option value="Data Analyst">📊 Data Analyst</option>
                  <option value="Python Developer">🐍 Python Developer</option>
                  <option value="Frontend Developer">💻 Frontend Developer</option>
                  <option value="Backend Developer">⚙️ Backend Developer</option>
                </select>
              </div>

              {/* Field 3: Optional Job Description Text Area */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Target Job Description (Optional)
                </label>
                <textarea
                  rows="4"
                  placeholder="Paste specific job description requirements here to customize keyword matching..."
                  value={skillGapJd}
                  onChange={(e) => setSkillGapJd(e.target.value)}
                  className="w-full text-sm text-gray-800 border border-gray-300 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <span>Parsing Resume & Matching Skills...</span>
                ) : (
                  <>
                    <span>📊 Analyze Skill Gap</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Skill Gap Output Report */}
      {activeView === 'skill-gap-report' && parsedReport && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('skill-gap-form')}
              className="text-xs font-semibold text-gray-600 hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
            >
              <span>← Back to Skill Gap Form</span>
            </button>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Target Role: {parsedReport.targetRole}
            </span>
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              📊 Case-Insensitive Skill Evaluation
            </div>
            <h1 className="text-3xl font-black">Skill Gap Report: {parsedReport.targetRole}</h1>
            <p className="text-emerald-100/80 text-xs sm:text-base mt-2 max-w-2xl">
              Normalized skill analysis extracted from your uploaded resume versus market requirements for {parsedReport.targetRole}.
            </p>
          </div>

          {/* 2-Column: Your Skills vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Skills (Extracted from Resume) */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Your Skills ({parsedReport.yourSkills.length})</span>
              </h3>
              <p className="text-xs text-gray-500">Technical skills extracted from your uploaded resume text:</p>
              <div className="flex flex-wrap gap-2">
                {parsedReport.yourSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    <span>✓</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing / Developing Skills */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <span className="text-amber-500">⚠️</span>
                <span>Missing / Developing Skills ({parsedReport.missingSkills.length})</span>
              </h3>
              <p className="text-xs text-gray-500">Required skills for {parsedReport.targetRole} not found in your resume:</p>
              <div className="flex flex-wrap gap-2">
                {parsedReport.missingSkills.length > 0 ? (
                  parsedReport.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <span>+</span>
                      <span>{skill}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-bold text-emerald-600">
                    🎉 Outstanding! You have acquired all core required skills for this role!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Visual Skill Gap Progress / Competency Levels */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                📈 Competency Level Breakdown
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Real proficiency scores calculated strictly from your extracted skills.
              </p>
            </div>

            <div className="space-y-5">
              {parsedReport.competencies.map((comp, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-900">{comp.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] ${
                        comp.rating === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.rating === 'Good'
                          ? 'bg-blue-100 text-blue-800'
                          : comp.rating === 'Needs Improvement'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {comp.rating} ({comp.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${comp.color}`}
                      style={{ width: `${comp.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sequential Recommended Learning Path Timeline */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                🗺️ Intelligent Progressive Learning Path
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Sequential learning roadmap ordered progressively from foundational tools to advanced machine learning and production deployment.
              </p>
            </div>

            <div className="space-y-4">
              {parsedReport.learningPath.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-gray-200 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View State 2: Career Path Input Form (Option A / Option B) */}
      {activeView === 'form' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <span>← Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Explore Your Career Path</h2>
              <p className="text-xs text-gray-500 mt-1">
                Choose how you want to provide your profile details to receive AI role recommendations.
              </p>
            </div>

            {/* Input Option Selector Tabs */}
            <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setInputOption('manual')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  inputOption === 'manual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✏️ Option B: Manual Input
              </button>
              <button
                type="button"
                onClick={() => setInputOption('upload')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  inputOption === 'upload'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📁 Option A: Upload Resume
              </button>
            </div>

            <form onSubmit={handleFindCareerPath} className="space-y-6">
              {/* Option A: Upload Resume */}
              {inputOption === 'upload' && (
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Upload Resume File (.pdf, .docx, .txt)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50/50 rounded-2xl p-8 text-center cursor-pointer transition-all">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Upload your current resume to extract your skills, education, and experience automatically.
                    </p>
                    {resumeFile && (
                      <p className="text-xs font-bold text-emerald-600 mt-2">
                        ✓ Selected File: {resumeFile.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Option B: Manual Input Fields */}
              {inputOption === 'manual' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Education Qualification
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full text-sm text-gray-800 border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Experience Level
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full text-sm text-gray-800 border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Fresher">Fresher (Entry Level)</option>
                      <option value="0-1 Years">0 - 1 Years</option>
                      <option value="1-3 Years">1 - 3 Years</option>
                      <option value="3+ Years">3+ Years</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. Python, HTML, CSS, Machine Learning..."
                      className="w-full text-sm text-gray-800 border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Interests / Target Domains
                    </label>
                    <input
                      type="text"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      placeholder="e.g. AI/ML, Web Development, Data Science..."
                      className="w-full text-sm text-gray-800 border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              )}

              {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <span>Analyzing Profile Match...</span>
                ) : (
                  <>
                    <span>🚀 Find My Career Path</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View State 3: AI Profile Match Results */}
      {activeView === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('form')}
              className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
            >
              <span>← Edit Profile Criteria</span>
            </button>
            <span className="text-xs font-bold text-gray-500">
              Analyzed for: <strong className="text-gray-900">{formData.education} ({formData.experience})</strong>
            </span>
          </div>

          {/* Profile Match Banner */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-0.5 rounded-full mb-2">
                ✅ AI Profile Match Completed
              </div>
              <h2 className="text-2xl font-extrabold">Your Matching Career Paths</h2>
              <p className="text-xs text-gray-300 mt-1">
                Based on your skills: <span className="text-blue-300 font-semibold">{formData.skills}</span>
              </p>
            </div>
          </div>

          {/* Career Path Options Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(careerRecommendations || CAREER_DATABASE)
              .sort(([, a], [, b]) => b.matchScore - a.matchScore)
              .map(([key, role]) => (
              <div
                key={key}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        role.matchScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : role.matchScore >= 70
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {role.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{role.tagline}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${role.matchScore}%` }}
                  ></div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCareerKey(key);
                    setActiveView('roadmap');
                  }}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Detailed Roadmap & Breakdown</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View State 4: Detailed Career Breakdown & Visual Roadmap Timeline */}
      {activeView === 'roadmap' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('results')}
              className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
            >
              <span>← Back to Career Results</span>
            </button>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Overall Match: {selectedCareer.matchScore}%
            </span>
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-black">{selectedCareer.title} Roadmap</h1>
            <p className="text-blue-100/80 text-xs sm:text-base mt-2 max-w-2xl">
              {selectedCareer.tagline}
            </p>
          </div>

          {/* Breakdown Section: Matched vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why this path? (Matched Skills) */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Why this path? (Matched Skills)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCareer.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <span>✓</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills to Develop */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Skills to Develop</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCareer.skillsToDevelop.map((skill) => (
                  <span
                    key={skill}
                    className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Suggested Roadmap Timeline */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">
                🗺️ Suggested Roadmap Timeline
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Follow this sequential milestone path to achieve full role readiness.
              </p>
            </div>

            <div className="space-y-4">
              {selectedCareer.roadmap.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-gray-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerToolsPage;
