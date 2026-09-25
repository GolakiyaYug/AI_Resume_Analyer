import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import api from '../../shared/utils/api';
import {
  LuCompass,
  LuChartColumn,
  LuMic,
  LuFileText,
  LuDollarSign,
  LuTrendingUp
} from 'react-icons/lu';

// Comprehensive global skill dictionary for client & API matching
const GLOBAL_SKILLS_LIST = [
  'python', 'java', 'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'express', 'next.js',
  'html', 'css', 'tailwind', 'bootstrap', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite',
  'numpy', 'pandas', 'scikit-learn', 'pytorch', 'tensorflow', 'keras', 'deep learning', 'machine learning',
  'nlp', 'xgboost', 'lightgbm', 'catboost', 'huggingface', 'transformers', 'llm', 'langchain', 'rag', 'spacy', 'nltk', 'opencv', 'data analysis', 'power bi', 'tableau', 'excel', 'statistics', 'flask', 'django', 'fastapi',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'git', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
  'figma', 'ui/ux', 'ux', 'ui', 'photoshop', 'illustrator', 'wireframing', 'user research', 'design systems',
  'solidworks', 'ansys', 'autocad', 'catia', 'revit', 'matlab', 'simulink', 'creo', 'inventor', 'fusion 360', 'labview', 'plc', 'scada', 'abaqus', 'cad', 'cam', 'fea', 'cfd',
  'sap fico', 'sap', 'quickbooks', 'tally', 'financial modeling', 'auditing', 'taxation', 'accounting', 'financial analysis', 'risk management', 'compliance',
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
  'xgboost': 'XGBoost',
  'lightgbm': 'LightGBM',
  'catboost': 'CatBoost',
  'huggingface': 'HuggingFace',
  'transformers': 'Transformers',
  'llm': 'LLMs & Fine-Tuning',
  'langchain': 'LangChain',
  'rag': 'RAG System',
  'spacy': 'spaCy',
  'nltk': 'NLTK',
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
  'solidworks': 'SolidWorks 3D CAD',
  'ansys': 'ANSYS FEA/CFD',
  'autocad': 'AutoCAD 2D/3D',
  'catia': 'CATIA Surface Design',
  'revit': 'Autodesk Revit',
  'matlab': 'MATLAB & Simulink',
  'simulink': 'Simulink Simulation',
  'creo': 'PTC Creo',
  'inventor': 'Autodesk Inventor',
  'fusion 360': 'Fusion 360',
  'labview': 'NI LabVIEW',
  'plc': 'PLC Programming',
  'scada': 'SCADA Systems',
  'abaqus': 'Abaqus FEA',
  'cad': 'CAD Modeling',
  'cam': 'CAM Manufacturing',
  'fea': 'Finite Element Analysis (FEA)',
  'cfd': 'Computational Fluid Dynamics (CFD)',
  'sap fico': 'SAP FICO',
  'sap': 'SAP ERP',
  'quickbooks': 'QuickBooks',
  'tally': 'Tally ERP',
  'financial modeling': 'Financial Modeling',
  'auditing': 'Internal Auditing',
  'taxation': 'Taxation & Filing',
  'accounting': 'Financial Accounting',
  'financial analysis': 'Financial Analysis',
  'risk management': 'Risk Management',
  'compliance': 'Regulatory Compliance',
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

// Irrelevant noise words & human names filter
const NOISE_WORDS = new Set([
  'education', 'experience', 'resume', 'summary', 'project', 'projects', 'details', 'contact',
  'email', 'phone', 'address', 'name', 'profile', 'work', 'history', 'school', 'university',
  'degree', 'bachelor', 'master', 'skills', 'skill', 'tools', 'languages', 'overview',
  'rohit', 'verma', 'sharma', 'kumar', 'singh', 'gupta', 'patel', 'shah', 'rao', 'reddy', 'nair',
  'joshi', 'kulkarni', 'deshmukh', 'mehta', 'jain', 'agarwal', 'bhat', 'khan', 'ali', 'ahmed',
  'john', 'smith', 'david', 'michael', 'alex', 'james', 'robert', 'william', 'mary', 'patricia',
  'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen', 'nancy',
  'yash', 'rahul', 'amit', 'priya', 'anita', 'pooja', 'sunil', 'anil', 'vikram', 'sanjay',
  'vijay', 'rajesh', 'ramesh', 'suresh', 'deepak', 'manish', 'alok', 'neha', 'swati', 'rashi'
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

const CareerToolsPage = ({ initialView = 'dashboard' }) => {
  // Navigation view state: 'dashboard' | 'form' | 'results' | 'roadmap' | 'skill-gap-form' | 'skill-gap-report' | 'interview-prep-form' | 'interview-prep-output' | 'cover-letter-form' | 'cover-letter-output' | 'salary-negotiator-form' | 'salary-negotiator-output'
  const [activeView, setActiveView] = useState(initialView);
  
  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

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

  // AI Salary Negotiator & Market Worth Predictor State
  const [salaryFile, setSalaryFile] = useState(null);
  const [salaryJobRole, setSalaryJobRole] = useState('Senior Full Stack Developer');
  const [salaryLocation, setSalaryLocation] = useState('San Francisco, CA');
  const [salaryExperience, setSalaryExperience] = useState('3-5 Years');
  const [salaryResult, setSalaryResult] = useState(null);
  const [scriptTab, setScriptTab] = useState('email'); // 'email' | 'phone'
  const [salaryCopySuccess, setSalaryCopySuccess] = useState(false);
  const [isSalaryRegenerating, setIsSalaryRegenerating] = useState(false);

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

      if (regex.test(lowerText)) {
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

  // Handle AI Interview Preparation Submission with STRICT RESUME SKILL PARSING & BACKEND API ALIGNMENT
  const handleGenerateInterviewQuestions = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setGeneratedInterviewData(null); // Clear previous session state completely

    if (!interviewFile && !interviewJd.trim()) {
      alert("Please upload a resume file (.pdf, .docx, .txt) to generate interview questions.");
      setLoading(false);
      return;
    }

    try {
      const bodyFormData = new FormData();
      if (interviewFile) {
        bodyFormData.append('file', interviewFile, interviewFile.name);
      }
      if (interviewJd.trim()) {
        bodyFormData.append('job_description', interviewJd.trim());
      }
      bodyFormData.append('interview_type', interviewType);
      bodyFormData.append('difficulty', interviewDifficulty);
      bodyFormData.append('question_count', questionCount);

      const res = await api.post('/api/analysis/interview-prep/generate', bodyFormData, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (res.data && res.data.technicalQuestions) {
        setGeneratedInterviewData({
          type: res.data.type || interviewType,
          difficulty: res.data.difficulty || interviewDifficulty,
          questionCount: res.data.questionCount || questionCount,
          detectedSkills: res.data.detectedSkills || [],
          technicalQuestions: res.data.technicalQuestions || [],
          hrQuestions: res.data.hrQuestions || []
        });

        setExpandedAnswers({});
        setLoading(false);
        setActiveView('interview-prep-output');
        return;
      }
    } catch (err) {
      console.warn('Backend interview prep API notice:', err?.response?.data?.message || err.message);
    }

    // Client-side Fallback
    let extractedSkillsRaw = [];
    if (interviewFile) {
      const textFromFileName = extractSkillsFromText(interviewFile.name);
      extractedSkillsRaw.push(...textFromFileName);
      if (interviewFile.name.endsWith('.txt')) {
        try {
          const textContent = await interviewFile.text();
          extractedSkillsRaw.push(...extractSkillsFromText(textContent));
        } catch (_) {}
      }
    } else if (interviewJd.trim()) {
      extractedSkillsRaw = extractSkillsFromText(interviewJd);
    }

    const extractedSkillsLower = Array.from(new Set(extractedSkillsRaw.map(s => s.toLowerCase())));
    const detectedSkillsCanonical = extractedSkillsLower.map(s => formatSkillCanonical(s));

    const candidateTechPool = [];

    // Core Engineering Pools
    if (extractedSkillsLower.some(s => ['solidworks'].includes(s))) {
      candidateTechPool.push({
        id: 'sw_1',
        category: 'Technical',
        domain: 'SolidWorks 3D CAD & Mechanical Design',
        question: 'How do you design complex 3D parametric parts, weldments, and large assemblies in SolidWorks using proper geometric constraints, equations, and MBD annotations?',
        resumeBadge: 'Tailored from resume skill: SolidWorks',
        sampleAnswer: 'I build parametric sketches with fully defined relations, utilize top-down assembly modeling to prevent interferences, and apply MBD annotations for manufacturing handoff.'
      });
    }

    if (extractedSkillsLower.some(s => ['ansys', 'fea', 'cfd'].includes(s))) {
      candidateTechPool.push({
        id: 'ansys_1',
        category: 'Technical',
        domain: 'ANSYS FEA & Structural Simulation',
        question: 'How do you set up Finite Element Analysis (FEA) models in ANSYS Mechanical, defining boundary conditions, meshing refinement, and contact formulations?',
        resumeBadge: 'Tailored from resume skill: ANSYS',
        sampleAnswer: 'I import CAD geometry, apply mesh convergence studies using hex/tetrahedral elements, define non-linear contact behavior (bonded/frictional), and solve for Von Mises stress and safety factors.'
      });
    }

    if (extractedSkillsLower.some(s => ['autocad', 'cad'].includes(s))) {
      candidateTechPool.push({
        id: 'acad_1',
        category: 'Technical',
        domain: 'AutoCAD 2D/3D Drafting & Standards',
        question: 'How do you structure layer standards, dynamic blocks, external references (Xrefs), and sheet sets in AutoCAD for architectural or mechanical drafting?',
        resumeBadge: 'Tailored from resume skill: AutoCAD',
        sampleAnswer: 'I enforce standardized AIA/ISO layer conventions, create dynamic blocks with visibility states, link Xrefs for collaborative drafting, and publish multi-sheet plotting layouts.'
      });
    }

    if (extractedSkillsLower.some(s => ['matlab', 'simulink'].includes(s))) {
      candidateTechPool.push({
        id: 'mat_1',
        category: 'Technical',
        domain: 'MATLAB & Control System Modeling',
        question: 'How do you model control systems, signal processing algorithms, and dynamic system simulations using MATLAB and Simulink?',
        resumeBadge: 'Tailored from resume skill: MATLAB',
        sampleAnswer: 'I derive system transfer functions, analyze stability using Bode plots and Root Locus in MATLAB, and build block diagram feedback loops in Simulink.'
      });
    }

    // Financial & Accounting Pools
    if (extractedSkillsLower.some(s => ['sap fico', 'sap'].includes(s))) {
      candidateTechPool.push({
        id: 'sap_1',
        category: 'Technical',
        domain: 'SAP FICO & Enterprise Resource Planning',
        question: 'How do you configure and manage General Ledger (G/L), Accounts Payable (A/P), and Accounts Receivable (A/R) modules in SAP FICO to ensure seamless financial closing?',
        resumeBadge: 'Tailored from resume skill: SAP FICO',
        sampleAnswer: 'I configure G/L master records, document types, and posting keys while executing automated month-end clearing and bank reconciliation workflows in SAP FICO.'
      });
    }

    if (extractedSkillsLower.some(s => ['quickbooks'].includes(s))) {
      candidateTechPool.push({
        id: 'qb_1',
        category: 'Technical',
        domain: 'QuickBooks & Bookkeeping Automation',
        question: 'How do you structure the Chart of Accounts, reconcile bank feeds, and automate recurring invoices in QuickBooks to maintain accurate real-time cash flow visibility?',
        resumeBadge: 'Tailored from resume skill: QuickBooks',
        sampleAnswer: 'I organize account hierarchies, map bank feeds using automated rules, and execute monthly bank and credit card reconciliations in QuickBooks.'
      });
    }

    if (extractedSkillsLower.some(s => ['tally', 'tally erp 9', 'tally prime'].includes(s))) {
      candidateTechPool.push({
        id: 'tally_1',
        category: 'Technical',
        domain: 'Tally ERP 9 / TallyPrime Accounting',
        question: 'How do you manage GST/VAT compliance, voucher entry, and inventory batch tracking in Tally ERP 9 / TallyPrime?',
        resumeBadge: 'Tailored from resume skill: Tally',
        sampleAnswer: 'I maintain ledger masters, configure GST tax rates, record sales/purchase vouchers, and generate GSTR returns directly from Tally.'
      });
    }

    if (extractedSkillsLower.some(s => ['excel', 'ms excel'].includes(s))) {
      candidateTechPool.push({
        id: 'xl_1',
        category: 'Technical',
        domain: 'Advanced Excel & Financial Automation',
        question: 'How do you leverage advanced Excel functions (INDEX/MATCH, XLOOKUP, Dynamic Arrays, Power Query) to consolidate multi-entity financial data pipelines?',
        resumeBadge: 'Tailored from resume skill: Advanced Excel',
        sampleAnswer: 'I build dynamic data models using XLOOKUP and Power Query ETL queries, eliminating manual copy-pasting and establishing automated refreshable reporting workbooks.'
      });
    }

    if (extractedSkillsLower.some(s => ['financial modeling', 'valuation'].includes(s))) {
      candidateTechPool.push({
        id: 'fm_1',
        category: 'Technical',
        domain: 'Financial Modeling & Valuation',
        question: 'Walk through how you construct an integrated 3-Statement Financial Model (Income Statement, Balance Sheet, Cash Flow) from raw historical trial balances.',
        resumeBadge: 'Tailored from resume skill: Financial Modeling',
        sampleAnswer: 'I project revenue and expense drivers on the Income Statement, build supporting working capital and debt schedules, link net income to Cash Flow, and balance the Balance Sheet.'
      });
    }

    if (extractedSkillsLower.some(s => ['auditing', 'internal audit', 'external audit'].includes(s))) {
      candidateTechPool.push({
        id: 'audit_1',
        category: 'Technical',
        domain: 'Internal & External Auditing',
        question: 'Describe your methodology for developing an internal audit plan, testing key internal controls (SOX compliance), and documenting audit working papers.',
        resumeBadge: 'Tailored from resume skill: Auditing',
        sampleAnswer: 'I conduct risk assessments to identify high-risk financial processes, perform walkthroughs and sample testing of key controls, and log audit findings in working papers.'
      });
    }

    if (extractedSkillsLower.some(s => ['accounting', 'gaap', 'ifrs'].includes(s))) {
      candidateTechPool.push({
        id: 'acct_1',
        category: 'Technical',
        domain: 'Financial Accounting & GAAP/IFRS Standards',
        question: 'Explain how you apply GAAP/IFRS revenue recognition standards (ASC 606 / IFRS 15) to complex customer contracts and multi-element deliverables.',
        resumeBadge: 'Tailored from resume skill: Accounting',
        sampleAnswer: 'I identify performance obligations in customer contracts, allocate transaction prices based on standalone selling prices, and recognize revenue as obligations are satisfied.'
      });
    }

    // 1. Python Data Processing
    if (extractedSkillsLower.some(s => ['python', 'pandas', 'numpy'].includes(s))) {
      candidateTechPool.push({
        id: 'py_pandas',
        category: 'Technical',
        domain: 'Python Data Processing & Vectorization',
        question: 'How do you optimize data processing pipelines in Python using Pandas and NumPy to replace slow scalar loops with vectorized operations?',
        resumeBadge: 'Tailored from resume skill: Python',
        sampleAnswer: 'I replace scalar loop operations with vectorized Pandas dataframe transformations, downcast numerical data types, and use NumPy array broadcasting to optimize CPU execution.'
      });
      candidateTechPool.push({
        id: 'py_gil',
        category: 'Technical',
        domain: 'Python Concurrency & Memory Management',
        question: 'How does the Python Global Interpreter Lock (GIL) impact CPU-bound multi-threaded tasks, and when should you use multiprocessing or asyncio instead?',
        resumeBadge: 'Tailored from resume skill: Python',
        sampleAnswer: 'The GIL prevents parallel CPython execution on multi-core CPUs. For CPU-bound workloads, I use Python multiprocessing or process pools. For I/O-bound tasks, I use asyncio or threading.'
      });
    }

    // 2. XGBoost & Machine Learning
    if (extractedSkillsLower.some(s => ['xgboost', 'scikit-learn', 'machine learning', 'lightgbm', 'catboost'].includes(s))) {
      candidateTechPool.push({
        id: 'ai_xgb',
        category: 'Technical',
        domain: 'XGBoost & Gradient Boosting',
        question: 'How do you handle class imbalance and prevent overfitting when training XGBoost models? Which parameters (e.g., scale_pos_weight, max_depth, subsample, learning_rate, reg_alpha, reg_lambda) do you tune?',
        resumeBadge: 'Tailored from resume skill: XGBoost',
        sampleAnswer: 'I use scale_pos_weight or SMOTE to balance positive/negative sample loss weights. To prevent overfitting, I tune max_depth (3-7), subsample (0.8), colsample_bytree (0.8), and apply L1/L2 regularization.'
      });
      candidateTechPool.push({
        id: 'skl_pipe',
        category: 'Technical',
        domain: 'Scikit-Learn Pipelines & Data Leakage',
        question: 'How do you prevent data leakage during cross-validation by wrapping feature scaling, imputation, and model fitting inside Scikit-Learn Pipelines?',
        resumeBadge: 'Tailored from resume skill: Scikit-Learn',
        sampleAnswer: 'I fit feature scaling and encoding ONLY on training folds inside pipeline steps, ensuring test fold parameters remain completely unseen during evaluation.'
      });
    }

    // 3. PyTorch & Deep Learning
    if (extractedSkillsLower.some(s => ['pytorch', 'tensorflow', 'keras', 'deep learning'].includes(s))) {
      candidateTechPool.push({
        id: 'ai_torch',
        category: 'Technical',
        domain: 'PyTorch Deep Learning Models',
        question: 'Can you explain how you design custom PyTorch Dataset and DataLoader classes for efficient batching, data augmentation, and GPU memory management (.to(device))?',
        resumeBadge: 'Tailored from resume skill: PyTorch',
        sampleAnswer: 'I subclass torch.utils.data.Dataset, implementing __len__ and __getitem__ methods to load and preprocess samples lazily. I configure DataLoader with pinned memory and num_workers.'
      });
      candidateTechPool.push({
        id: 'ai_autograd',
        category: 'Technical',
        domain: 'PyTorch Autograd & Computational Graphs',
        question: 'How does PyTorch construct dynamic computational graphs during forward passes, and when should you use torch.no_grad() or tensor.detach()?',
        resumeBadge: 'Tailored from resume skill: PyTorch',
        sampleAnswer: 'PyTorch builds DAGs dynamically on each forward pass. During evaluation, wrapping calls in torch.no_grad() disables gradient tracking, saving memory and accelerating inference.'
      });
    }

    // 4. SQL & Databases
    if (extractedSkillsLower.some(s => ['sql', 'postgresql', 'mysql', 'sqlite'].includes(s))) {
      candidateTechPool.push({
        id: 'be_sql',
        category: 'Technical',
        domain: 'SQL Query Execution & Schema Design',
        question: 'Describe how you write complex SQL queries using CTEs, window functions, and indexing to process analytics data efficiently.',
        resumeBadge: 'Tailored from resume skill: SQL',
        sampleAnswer: 'I structure complex aggregations using Common Table Expressions (CTEs) for readability and use window functions (ROW_NUMBER(), PARTITION BY) for ranking while analyzing execution plans with EXPLAIN ANALYZE.'
      });
    }

    // 5. HTML5 & Responsive CSS Layouts
    if (extractedSkillsLower.some(s => ['html', 'css', 'tailwind', 'bootstrap'].includes(s))) {
      candidateTechPool.push({
        id: 'web_html_css',
        category: 'Technical',
        domain: 'HTML5 & Responsive CSS Layouts',
        question: 'How do you structure semantic HTML5 elements and build responsive CSS layouts using Flexbox, CSS Grid, and media queries across modern browsers?',
        resumeBadge: 'Tailored from resume skill: HTML5 / CSS3',
        sampleAnswer: 'I use semantic HTML markup (<main>, <section>, <article>, <nav>) and landmark ARIA roles for accessibility. For layouts, I use CSS Grid for 2D page architecture and Flexbox for 1D alignment.'
      });
    }

    // 6. React.js & Modern Frontend
    if (extractedSkillsLower.some(s => ['react', 'vue', 'angular', 'next.js'].includes(s))) {
      candidateTechPool.push({
        id: 'fe_react',
        category: 'Technical',
        domain: 'Frontend Architecture & React.js',
        question: 'How do you manage component state and side effects in React applications using custom hooks and state management libraries?',
        resumeBadge: 'Tailored from resume skill: React.js',
        sampleAnswer: 'I keep transient UI state localized with useState, isolate async data fetching in useEffect with clean cleanup functions, and manage global application state using React Context.'
      });
    }

    // 7. JavaScript & TypeScript
    if (extractedSkillsLower.some(s => ['javascript', 'typescript'].includes(s))) {
      candidateTechPool.push({
        id: 'js_ts',
        category: 'Technical',
        domain: 'Modern JavaScript (ES6+) & Async Programming',
        question: 'How do you handle asynchronous execution, Promises, async/await, closures, and DOM event delegation in modern JavaScript?',
        resumeBadge: 'Tailored from resume skill: JavaScript / TypeScript',
        sampleAnswer: 'I structure asynchronous operations with async/await and try/catch for clean error handling. I leverage closures for data encapsulation and use event delegation on parent containers.'
      });
    }

    // Dynamic Custom Questions strictly for candidate's detected skills
    extractedSkillsLower.forEach(sk => {
      const skTitle = formatSkillCanonical(sk);
      const skSlug = sk.replace(/[^a-z0-9]/g, '_');
      const customQ1 = {
        id: `custom_${skSlug}_1`,
        category: 'Technical',
        domain: `Domain Competency & ${skTitle}`,
        question: `How do you leverage ${skTitle} in professional environments to streamline workflows, enforce accuracy, and optimize operational performance?`,
        resumeBadge: `Tailored from resume skill: ${skTitle}`,
        sampleAnswer: `I follow industry best practices when executing tasks with ${skTitle}, establishing standardized procedures, conducting thorough quality checks, and monitoring key metrics.`
      };
      const customQ2 = {
        id: `custom_${skSlug}_2`,
        category: 'Technical',
        domain: `Strategy & ${skTitle}`,
        question: `Describe your approach to troubleshooting errors, auditing data integrity, and solving complex challenges when working with ${skTitle}.`,
        resumeBadge: `Tailored from resume skill: ${skTitle}`,
        sampleAnswer: `I isolate root causes systematically, analyze input parameters against compliance standards, and implement permanent corrective controls.`
      };
      const customQ3 = {
        id: `custom_${skSlug}_3`,
        category: 'Technical',
        domain: `Reporting & ${skTitle}`,
        question: `How do you present analytical findings, reconciliations, and reporting insights derived from ${skTitle} to executive decision-makers?`,
        resumeBadge: `Tailored from resume skill: ${skTitle}`,
        sampleAnswer: `I translate raw outputs into executive summary dashboards, highlighting key trends, risk exposures, and actionable strategic recommendations.`
      };
      const customQ4 = {
        id: `custom_${skSlug}_4`,
        category: 'Technical',
        domain: `Process Scaling & ${skTitle}`,
        question: `Walk through a scenario where you scaled or automated a manual process involving ${skTitle} to increase efficiency and eliminate manual error.`,
        resumeBadge: `Tailored from resume skill: ${skTitle}`,
        sampleAnswer: `I documented baseline manual steps, identified repetitive bottlenecks, built automated templates and validation rules, reducing cycle time substantially.`
      };

      [customQ1, customQ2, customQ3, customQ4].forEach(cq => {
        if (!candidateTechPool.some(q => q.id === cq.id)) {
          candidateTechPool.push(cq);
        }
      });
    });

    const hrQuestionsPool = [
      {
        id: 'h1',
        category: 'HR & Behavioral',
        domain: 'Conflict Resolution & Technical Leadership',
        question: `Tell me about a time when you had a technical disagreement with a team member. How did you reach a consensus?`,
        resumeBadge: 'Behavioral & Leadership',
        sampleAnswer: `Situation: During project planning, a colleague preferred a traditional layout while I advocated for a modern modular architecture. Action: I built a rapid side-by-side prototype. Result: Empirical metrics convinced the team to adopt the proposed design.`
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
        domain: 'Incident Management & Ownership',
        question: `Describe a scenario where a production deployment encountered a critical bug. What steps did you take to mitigate and prevent future occurrences?`,
        resumeBadge: 'Incident Management',
        sampleAnswer: `Situation: An unexpected edge case broke API responses post-deploy. Action: I rolled back to previous stable release, pinpointed root cause in logs, added regression tests, and redeployed safely.`
      }
    ];

    let selectedTech = [];
    let selectedHr = [];

    if (interviewType === 'technical') {
      selectedTech = candidateTechPool.slice(0, questionCount);
    } else if (interviewType === 'hr') {
      selectedHr = hrQuestionsPool.slice(0, questionCount);
    } else {
      const techCount = Math.ceil(questionCount / 2);
      const hrCount = Math.floor(questionCount / 2);
      selectedTech = candidateTechPool.slice(0, techCount);
      selectedHr = hrQuestionsPool.slice(0, hrCount);
    }

    setGeneratedInterviewData({
      type: interviewType,
      difficulty: interviewDifficulty,
      questionCount: selectedTech.length + selectedHr.length,
      detectedSkills: detectedSkillsCanonical,
      technicalQuestions: selectedTech,
      hrQuestions: selectedHr
    });

    setExpandedAnswers({});
    setLoading(false);
    setActiveView('interview-prep-output');
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

  // AI Salary Negotiator & Market Worth Calculation Handler
  const handleCalculateSalary = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setErrorMsg('');

    let extractedText = '';
    let extractedSkillsRaw = [];

    if (salaryFile) {
      try {
        const textFromFileName = extractSkillsFromText(salaryFile.name);
        extractedSkillsRaw.push(...textFromFileName);

        if (salaryFile.name.endsWith('.txt')) {
          extractedText = await salaryFile.text();
          const textSkills = extractSkillsFromText(extractedText);
          extractedSkillsRaw.push(...textSkills);
        }

        const bodyFormData = new FormData();
        bodyFormData.append('file', salaryFile, salaryFile.name);
        bodyFormData.append('job_role', salaryJobRole);
        bodyFormData.append('location', salaryLocation);
        bodyFormData.append('experience_years', salaryExperience);

        const res = await api.post('/api/analysis/salary-negotiator', bodyFormData);
        if (res.data && res.data.market_avg) {
          setSalaryResult(res.data);
          setLoading(false);
          setActiveView('salary-negotiator-output');
          return;
        }
      } catch (err) {
        console.warn('Backend salary negotiator API notice:', err?.response?.data?.message || err.message);
      }
    } else {
      extractedText = `${formData.skills} ${formData.interests}`;
      extractedSkillsRaw = extractSkillsFromText(extractedText);
    }

    const lowerRole = (salaryJobRole || 'Software Engineer').toLowerCase();
    const lowerLoc = (salaryLocation || 'Remote').toLowerCase();
    const lowerExp = (salaryExperience || '3-5 Years').toLowerCase();
    const userSkillsClean = Array.from(new Set(extractedSkillsRaw.map(s => s.toLowerCase())));
    const detectedSkillsCanonical = userSkillsClean.length > 0 ? userSkillsClean.map(s => formatSkillCanonical(s)) : ['Software Engineering', 'Problem Solving'];

    let baseMin = 85000, baseAvg = 120000, baseMax = 160000;
    if (lowerRole.includes('ai') || lowerRole.includes('ml') || lowerRole.includes('machine learning') || lowerRole.includes('deep learning')) {
      baseMin = 110000; baseAvg = 155000; baseMax = 210000;
    } else if (lowerRole.includes('data scientist')) {
      baseMin = 100000; baseAvg = 145000; baseMax = 190000;
    } else if (lowerRole.includes('devops') || lowerRole.includes('cloud') || lowerRole.includes('sre')) {
      baseMin = 105000; baseAvg = 148000; baseMax = 195000;
    } else if (lowerRole.includes('data engineer')) {
      baseMin = 100000; baseAvg = 142000; baseMax = 185000;
    } else if (lowerRole.includes('full stack') || lowerRole.includes('fullstack')) {
      baseMin = 95000; baseAvg = 135000; baseMax = 178000;
    } else if (lowerRole.includes('backend') || lowerRole.includes('python developer') || lowerRole.includes('java')) {
      baseMin = 92000; baseAvg = 130000; baseMax = 172000;
    } else if (lowerRole.includes('frontend') || lowerRole.includes('react') || lowerRole.includes('web')) {
      baseMin = 88000; baseAvg = 125000; baseMax = 165000;
    } else if (lowerRole.includes('data analyst')) {
      baseMin = 75000; baseAvg = 105000; baseMax = 140000;
    } else if (lowerRole.includes('lead') || lowerRole.includes('principal') || lowerRole.includes('architect') || lowerRole.includes('manager')) {
      baseMin = 135000; baseAvg = 185000; baseMax = 245000;
    }

    let expMult = 1.0;
    if (lowerExp.includes('fresher') || lowerExp.includes('entry') || lowerExp.includes('0-1') || lowerExp.includes('0-2')) {
      expMult = 0.75;
    } else if (lowerExp.includes('1-3') || lowerExp.includes('2-4')) {
      expMult = 0.90;
    } else if (lowerExp.includes('3-5') || lowerExp.includes('4-6')) {
      expMult = 1.10;
    } else if (lowerExp.includes('5-8') || lowerExp.includes('6-8')) {
      expMult = 1.35;
    } else if (lowerExp.includes('8+') || lowerExp.includes('10+') || lowerExp.includes('senior')) {
      expMult = 1.65;
    }

    let currencySymbol = '$';
    let currencyCode = 'USD';
    let locMult = 1.0;

    if (lowerLoc.includes('india') || lowerLoc.includes('inr') || lowerLoc.includes('bangalore') || lowerLoc.includes('mumbai') || lowerLoc.includes('delhi') || lowerLoc.includes('pune') || lowerLoc.includes('hyderabad')) {
      currencySymbol = '₹';
      currencyCode = 'INR';
      locMult = 10.0;
    } else if (lowerLoc.includes('uk') || lowerLoc.includes('london') || lowerLoc.includes('england') || lowerLoc.includes('gbp')) {
      currencySymbol = '£';
      currencyCode = 'GBP';
      locMult = 0.78;
    } else if (lowerLoc.includes('europe') || lowerLoc.includes('germany') || lowerLoc.includes('france') || lowerLoc.includes('berlin') || lowerLoc.includes('eur')) {
      currencySymbol = '€';
      currencyCode = 'EUR';
      locMult = 0.85;
    } else if (lowerLoc.includes('san francisco') || lowerLoc.includes('sf') || lowerLoc.includes('bay area') || lowerLoc.includes('new york') || lowerLoc.includes('ny') || lowerLoc.includes('seattle')) {
      locMult = 1.30;
    } else if (lowerLoc.includes('austin') || lowerLoc.includes('chicago') || lowerLoc.includes('boston') || lowerLoc.includes('toronto')) {
      locMult = 1.10;
    }

    const highValueSkills = ['pytorch', 'tensorflow', 'aws', 'kubernetes', 'docker', 'react', 'next.js', 'python', 'system architecture', 'terraform', 'microservices'];
    const skillMatches = userSkillsClean.filter(s => highValueSkills.includes(s));
    const skillBonusPct = Math.min(0.25, skillMatches.length * 0.04);
    const skillMult = 1.0 + skillBonusPct;

    const minSal = Math.round((baseMin * expMult * locMult * skillMult) / 500) * 500;
    const avgSal = Math.round((baseAvg * expMult * locMult * skillMult) / 500) * 500;
    const maxSal = Math.round((baseMax * expMult * locMult * skillMult) / 500) * 500;

    const basePay = Math.round(avgSal * 0.85);
    const perfBonus = Math.round(avgSal * 0.10);
    const equityVal = Math.round(avgSal * 0.05);

    const fmtAvg = `${currencySymbol}${avgSal.toLocaleString()}`;
    const fmtMin = `${currencySymbol}${minSal.toLocaleString()}`;
    const fmtMax = `${currencySymbol}${maxSal.toLocaleString()}`;

    const valuePoints = [
      `Demonstrated technical mastery in high-demand industry competencies: ${detectedSkillsCanonical.slice(0, 5).join(', ')}.`,
      `Proven track record of driving quantified business impact, system efficiency, and production-level scale.`,
      `Direct alignment with target market requirements for ${salaryJobRole} (${salaryExperience}).`,
      `Strong cross-functional leadership, technical problem-solving, and continuous execution reliability.`
    ];

    const phoneScript = `Recruiter / Hiring Manager: "We are excited to extend an initial offer for the ${salaryJobRole} role at ${fmtMin} base salary."\n\nCandidate Verbal Response:\n"Thank you so much! I am thrilled about the opportunity to join the team and contribute to your vision. Based on my hands-on background in ${detectedSkillsCanonical.slice(0, 4).join(', ')} and current market research for ${salaryJobRole} roles in ${salaryLocation} with ${salaryExperience} of experience, the benchmark total compensation ranges between ${fmtAvg} and ${fmtMax}.\n\nGiven my immediate ability to deliver value and hit the ground running, I would be ready to sign immediately if we can align on a ${fmtAvg} base salary package with performance bonuses."`;

    const emailTemplate = `Subject: Compensation Discussion – ${salaryJobRole} Application\n\nDear Hiring Team,\n\nThank you very much for extending the offer for the ${salaryJobRole} position at your company. I am genuinely excited about the role and confident in the value I can bring to your team.\n\nBefore finalizing the agreement, I would like to discuss the proposed compensation package. After conducting thorough market research for ${salaryJobRole} positions in ${salaryLocation} for candidates with ${salaryExperience} of experience, industry benchmarks indicate a market average between ${fmtAvg} and ${fmtMax}.\n\nKey value-justifications from my background supporting this tier include:\n` + valuePoints.map(vp => `• ${vp}`).join('\n') + `\n\nConsidering these qualifications, I would be grateful if we could adjust the base salary to ${fmtAvg}. I am confident this reflects the market rate for my skill set and look forward to concluding our agreement.\n\nSincerely,\n[Your Name]`;

    setSalaryResult({
      job_role: salaryJobRole,
      location: salaryLocation,
      experience_years: salaryExperience,
      currency_symbol: currencySymbol,
      currency_code: currencyCode,
      min_salary: minSal,
      market_avg: avgSal,
      max_salary: maxSal,
      base_pay: basePay,
      performance_bonus: perfBonus,
      equity_grant: equityVal,
      skill_premium_pct: Math.round(skillBonusPct * 100),
      detected_skills: detectedSkillsCanonical,
      value_justifications: valuePoints,
      phone_script: phoneScript,
      email_template: emailTemplate
    });

    setTimeout(() => {
      setLoading(false);
      setActiveView('salary-negotiator-output');
    }, 400);
  };

  const handleCopySalaryScript = () => {
    const textToCopy = scriptTab === 'email' ? salaryResult?.email_template : salaryResult?.phone_script;
    navigator.clipboard.writeText(textToCopy || '');
    setSalaryCopySuccess(true);
    setTimeout(() => setSalaryCopySuccess(false), 2000);
  };

  const handleRegenerateSalary = async (e) => {
    setIsSalaryRegenerating(true);
    await handleCalculateSalary(e);
    setIsSalaryRegenerating(false);
  };

  const handleDownloadSalaryPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const sym = salaryResult?.currency_symbol || '$';
      const minS = salaryResult?.min_salary?.toLocaleString() || '0';
      const avgS = salaryResult?.market_avg?.toLocaleString() || '0';
      const maxS = salaryResult?.max_salary?.toLocaleString() || '0';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text('AI Salary Negotiator & Market Worth Report', 20, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Role: ${salaryResult?.job_role || 'Software Engineer'} | Location: ${salaryResult?.location || 'Remote'} | Exp: ${salaryResult?.experience_years}`, 20, 30);

      doc.setDrawColor(226, 232, 240);
      doc.line(20, 34, 190, 34);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, 40, 170, 36, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text('ESTIMATED MARKET SALARY BREAKDOWN', 25, 48);

      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(`Minimum Market Salary: ${sym}${minS}`, 25, 57);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text(`Market Average (Target): ${sym}${avgS}`, 25, 64);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Maximum Market Salary: ${sym}${maxS}`, 25, 71);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Key Resume Value Justifications', 20, 86);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      let curY = 94;
      (salaryResult?.value_justifications || []).forEach((vPoint) => {
        const splitV = doc.splitTextToSize(`• ${vPoint}`, 165);
        doc.text(splitV, 20, curY);
        curY += splitV.length * 5.5;
      });

      curY += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('AI Recruiter Negotiation Script & Template', 20, curY);
      curY += 8;

      const scriptText = scriptTab === 'email' ? salaryResult?.email_template : salaryResult?.phone_script;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const splitScript = doc.splitTextToSize(scriptText || '', 165);

      splitScript.forEach((line) => {
        if (curY > 275) {
          doc.addPage();
          curY = 20;
        }
        doc.text(line, 20, curY);
        curY += 4.8;
      });

      doc.save(`${(salaryResult?.job_role || 'Salary_Worth').replace(/[^a-zA-Z0-9]/g, '_')}_Negotiation_Report.pdf`);
    } catch (err) {
      console.error('Salary PDF Error:', err);
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
    } else if (toolName === 'Salary Negotiator' || toolName === 'AI Salary Negotiator & Market Worth Predictor') {
      setActiveView('salary-negotiator-form');
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
                Explore personalized career roadmaps, analyze skill gaps, practice interactive AI mock interviews, and craft winning cover letters tailored to your profile.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Career Path */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                  <LuCompass className="w-7 h-7 text-blue-600" />
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
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
                  <LuChartColumn className="w-7 h-7 text-emerald-600" />
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

            {/* Card 4: Interview Prep */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                  <LuMic className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Question Bank</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Access role-specific technical and behavioral interview questions extracted from your resume with sample STAR answers.
                </p>
              </div>
              <button
                onClick={() => handleOpenTool('Interview Prep')}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Question Bank</span>
                <span>→</span>
              </button>
            </div>

            {/* Card 5: Cover Letter Generator */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100 shadow-sm">
                  <LuFileText className="w-7 h-7 text-purple-600" />
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

      {/* AI Salary Negotiator & Market Worth Predictor Input Form */}
      {activeView === 'salary-negotiator-form' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-gray-600 hover:text-teal-600 flex items-center gap-1.5 transition-colors"
          >
            <span>← Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                💵 AI Salary Negotiator &amp; Market Worth Predictor
              </div>
              <h2 className="text-2xl font-black text-gray-900">Predict Your Market Worth &amp; Negotiation Power</h2>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Upload your resume, enter your target role, location, and experience to calculate estimated market salary ranges and generate recruiter negotiation scripts.
              </p>
            </div>

            <form onSubmit={handleCalculateSalary} className="space-y-6">
              {/* Field 1: Upload Resume File */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Upload Resume File (.pdf, .docx, .txt) <span className="text-gray-400 font-normal">(Optional, or uses profile skills)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-teal-400 bg-gray-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setSalaryFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-teal-50 file:text-teal-700"
                  />
                  {salaryFile && (
                    <p className="text-xs font-bold text-teal-600 mt-2">
                      ✓ Resume File Selected: {salaryFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Field 2 & 3: Target Job Role & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    2. Target Job Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={salaryJobRole}
                    onChange={(e) => setSalaryJobRole(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    3. Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={salaryLocation}
                    onChange={(e) => setSalaryLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA / London / Remote / India"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 4: Years of Experience */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  4. Years of Experience <span className="text-red-500">*</span>
                </label>
                <select
                  value={salaryExperience}
                  onChange={(e) => setSalaryExperience(e.target.value)}
                  className="w-full text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                >
                  <option value="Fresher">Fresher (Entry Level 0-1 Yr)</option>
                  <option value="1-3 Years">1 - 3 Years (Junior/Mid)</option>
                  <option value="3-5 Years">3 - 5 Years (Mid Level)</option>
                  <option value="5-8 Years">5 - 8 Years (Senior Level)</option>
                  <option value="8+ Years">8+ Years (Lead / Principal / Executive)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-base">⏳</span>
                    <span>Evaluating Market Data &amp; Salary Ranges...</span>
                  </>
                ) : (
                  <>
                    <span>💵 Predict Market Worth &amp; Generate Negotiation Script</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Salary Negotiator Output View */}
      {activeView === 'salary-negotiator-output' && salaryResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('salary-negotiator-form')}
              className="text-xs font-semibold text-gray-600 hover:text-teal-600 flex items-center gap-1.5 transition-colors"
            >
              <span>← Re-configure Salary Parameters</span>
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Dashboard 🏠
            </button>
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="bg-teal-500/20 text-teal-200 border border-teal-400/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  💵 Market Worth &amp; Negotiation Intelligence
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-2">
                  {salaryResult.job_role}
                </h1>
                <p className="text-xs sm:text-sm text-teal-100/80 mt-1">
                  Location: <strong>{salaryResult.location}</strong> &bull; Experience: <strong>{salaryResult.experience_years}</strong>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl text-center">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-teal-200">Estimated Market Average</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                  {salaryResult.currency_symbol}{salaryResult.market_avg.toLocaleString()} <span className="text-xs font-medium text-white/70">/ yr</span>
                </div>
              </div>
            </div>

            {salaryResult.detected_skills?.length > 0 && (
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="text-[11px] font-medium text-teal-200/80">Skills contributing to market value:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {salaryResult.detected_skills.map((s) => (
                    <span key={s} className="bg-teal-500/30 text-teal-100 border border-teal-400/30 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                      ✓ {s}
                    </span>
                  ))}
                  {salaryResult.skill_premium_pct > 0 && (
                    <span className="bg-emerald-500/40 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                      🔥 +{salaryResult.skill_premium_pct}% Skill Premium Boost
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 1. Clear Salary Breakdown Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>📊 Estimated Compensation Range</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Benchmarked against real-time industry compensation datasets</p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                Currency: {salaryResult.currency_code} ({salaryResult.currency_symbol})
              </span>
            </div>

            {/* Visual Range Bar */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                <span>Min Salary (25th %)</span>
                <span className="text-emerald-700 text-sm font-black">Market Avg (50th %)</span>
                <span>Max Salary (90th %)</span>
              </div>

              {/* Progress Slider */}
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden flex items-center shadow-inner">
                <div
                  className="bg-gradient-to-r from-teal-400 via-emerald-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs sm:text-sm font-black">
                <span className="text-slate-700">{salaryResult.currency_symbol}{salaryResult.min_salary.toLocaleString()}</span>
                <span className="text-emerald-600 text-base sm:text-lg">{salaryResult.currency_symbol}{salaryResult.market_avg.toLocaleString()}</span>
                <span className="text-indigo-700">{salaryResult.currency_symbol}{salaryResult.max_salary.toLocaleString()}</span>
              </div>
            </div>

            {/* Total Compensation Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1">
                <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Estimated Base Pay (85%)</div>
                <div className="text-lg font-black text-teal-950">{salaryResult.currency_symbol}{salaryResult.base_pay.toLocaleString()}</div>
                <p className="text-[10px] text-teal-700/80">Guaranteed fixed cash compensation</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Est. Annual Bonus (10%)</div>
                <div className="text-lg font-black text-emerald-950">{salaryResult.currency_symbol}{salaryResult.performance_bonus.toLocaleString()}</div>
                <p className="text-[10px] text-emerald-700/80">Performance-tied incentive bonus</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1">
                <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Equity / Perks (5%)</div>
                <div className="text-lg font-black text-indigo-950">{salaryResult.currency_symbol}{salaryResult.equity_grant.toLocaleString()}</div>
                <p className="text-[10px] text-indigo-700/80">Stock options, RSUs, or extra perks</p>
              </div>
            </div>
          </div>

          {/* 2. Key Value-Justification Bullet Points */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span>🎯 Resume Achievement Value-Justifications</span>
            </h3>
            <p className="text-xs text-gray-500">
              Use these achievement bullet points derived directly from your resume to back up higher salary expectations during interviews and negotiation calls:
            </p>

            <div className="space-y-3 pt-2">
              {salaryResult.value_justifications.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl border border-teal-100 bg-teal-50/30 text-xs font-semibold text-slate-800 leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. AI-Generated Recruiter Negotiation Script / Email Template */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">💬 AI Recruiter Negotiation Script</h3>
                <p className="text-xs text-gray-500">Professional counter-offer phrasing tailored for your target salary</p>
              </div>

              {/* Script Mode Tabs */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setScriptTab('email')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    scriptTab === 'email' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✉️ Email Template
                </button>
                <button
                  type="button"
                  onClick={() => setScriptTab('phone')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    scriptTab === 'phone' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📞 Phone Call Script
                </button>
              </div>
            </div>

            {/* Script Text Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {scriptTab === 'email' ? salaryResult.email_template : salaryResult.phone_script}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {/* Copy Button */}
                <button
                  onClick={handleCopySalaryScript}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all"
                >
                  <span>{salaryCopySuccess ? '✓ Copied Script!' : '📋 Copy Script'}</span>
                </button>

                {/* Download PDF Button */}
                <button
                  onClick={handleDownloadSalaryPdf}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all"
                >
                  <span>📥 Download PDF Report</span>
                </button>
              </div>

              {/* Regenerate Button */}
              <button
                onClick={handleRegenerateSalary}
                disabled={isSalaryRegenerating || loading}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isSalaryRegenerating ? (
                  <>
                    <span className="animate-spin text-sm">🔄</span>
                    <span>Recalculating...</span>
                  </>
                ) : (
                  <>
                    <span>🔄 Regenerate Script</span>
                  </>
                )}
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
                    onChange={(e) => {
                      setInterviewFile(e.target.files?.[0] || null);
                      setGeneratedInterviewData(null);
                    }}
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
