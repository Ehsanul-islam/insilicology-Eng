import {
  Atom,
  Cpu,
  Database,
  Dna,
  Layers,
  Microscope,
  Network,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { getResearchIcon } from './researchIcons';

export type ResearchServiceSectionItem = {
  title: string;
  description: string;
  /** Short abbreviation for compact display (e.g. "PLD", "PPD") */
  abbreviation?: string;
  /** Key deliverables specific to this service type */
  keyDeliverables?: string[];
};

export type ResearchServiceProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type ResearchServiceAnalysis = {
  title: string;
  description: string;
  /** Single image (legacy); use `images` when possible */
  image?: string;
  /** Multiple figures for this analysis (shown in carousel) */
  images?: string[];
  caption?: string;
};

/** Normalized URLs for display: prefers `images`, falls back to legacy `image` */
export const getSampleAnalysisImageUrls = (analysis: ResearchServiceAnalysis): string[] => {
  const fromImages = Array.isArray(analysis.images)
    ? analysis.images.filter((u) => typeof u === 'string' && u.trim().length > 0)
    : [];
  if (fromImages.length > 0) return [...fromImages];
  if (analysis.image?.trim()) return [analysis.image.trim()];
  return [];
};

export type ResearchServiceFaq = {
  question: string;
  answer: string;
};

export type ResearchService = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  image: string;
  price: string;
  timeline: string;
  // The Lucide icon component used at render time. When loading from DB we
  // resolve this from the iconName string.
  icon: LucideIcon;
  // The icon's stable string name (matches a key in researchIconRegistry).
  // Used by the admin editor and stored in DB.
  iconName?: string;
  color: string;
  bg: string;
  cardClass: string;
  accent: string;
  seoTitle: string;
  seoDescription: string;
  overviewBullets: string[];
  serviceTypes: ResearchServiceSectionItem[];
  processSteps: ResearchServiceProcessStep[];
  sampleAnalyses: ResearchServiceAnalysis[];
  clientRequirements: string[];
  deliverables: ResearchServiceSectionItem[];
  tools: string[];
  faqs: ResearchServiceFaq[];
};

/**
 * Database row shape (matches the research_services table).
 * Keep this in sync with the migration file.
 */
export type ResearchServiceRow = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  description: string;
  summary: string;
  image: string;
  price: string;
  timeline: string;
  icon: string;
  color: string;
  bg: string;
  card_class: string;
  accent: string;
  seo_title: string;
  seo_description: string;
  overview_bullets: string[];
  service_types: ResearchServiceSectionItem[];
  process_steps: ResearchServiceProcessStep[];
  sample_analyses: ResearchServiceAnalysis[];
  client_requirements: string[];
  deliverables: ResearchServiceSectionItem[];
  tools: string[];
  faqs: ResearchServiceFaq[];
  status: 'draft' | 'published' | 'archived';
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

/**
 * Convert a DB row into the runtime ResearchService shape used by the UI.
 * Falls back to safe defaults so a partially-filled row never crashes the page.
 */
export const mapRowToResearchService = (row: ResearchServiceRow): ResearchService => ({
  id: row.id,
  slug: row.slug,
  title: row.title || '',
  shortTitle: row.short_title || row.title || '',
  description: row.description || '',
  summary: row.summary || '',
  image: row.image || '',
  price: row.price || 'Custom quote',
  timeline: row.timeline || '',
  icon: getResearchIcon(row.icon),
  iconName: row.icon || 'Atom',
  color: row.color || 'text-blue-500',
  bg: row.bg || 'bg-blue-500/10',
  cardClass: row.card_class || 'bg-blue-500/[0.04] border-blue-500/20',
  accent: row.accent || 'from-blue-500 to-cyan-500',
  seoTitle: row.seo_title || row.title || '',
  seoDescription: row.seo_description || row.description || '',
  overviewBullets: Array.isArray(row.overview_bullets) ? row.overview_bullets : [],
  serviceTypes: Array.isArray(row.service_types) ? row.service_types : [],
  processSteps: Array.isArray(row.process_steps) ? row.process_steps : [],
  sampleAnalyses: Array.isArray(row.sample_analyses) ? row.sample_analyses : [],
  clientRequirements: Array.isArray(row.client_requirements) ? row.client_requirements : [],
  deliverables: Array.isArray(row.deliverables) ? row.deliverables.map(d => typeof d === 'string' ? { title: d, description: '' } : d) : [],
  tools: Array.isArray(row.tools) ? row.tools : [],
  faqs: Array.isArray(row.faqs) ? row.faqs : [],
});

export const whatsappNumber = '8801617082936';

export const getResearchWhatsappLink = (serviceTitle: string) => {
  const message = encodeURIComponent(`Hi, I want more information about ${serviceTitle}.`);
  return `https://wa.me/${whatsappNumber}?text=${message}`;
};

export const researchServices: ResearchService[] = [
  {
    id: 'molecular-docking',
    slug: 'molecular-docking',
    title: 'Molecular Docking',
    shortTitle: 'Docking',
    description: 'Predict ligand binding poses, interaction patterns, and score-based prioritization for target-ligand systems.',
    summary: 'Ligand preparation, receptor setup, binding pose analysis, and ranked interaction reports for early-stage drug discovery decisions.',
    image: '/images/molecular-docking.png',
    price: 'Custom quote',
    timeline: '3-7 working days',
    icon: Atom,
    iconName: 'Atom',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    cardClass: 'bg-blue-500/[0.04] border-blue-500/20',
    accent: 'from-blue-500 to-cyan-500',
    seoTitle: 'Molecular Docking Services - Ligand Screening & Binding Analysis | insilicology',
    seoDescription: 'Molecular docking services for ligand preparation, receptor setup, binding pose analysis, interaction visualization, and ranked docking reports.',
    overviewBullets: [
      'Protein-ligand, protein-protein, and blind docking workflows.',
      'Binding pose review with 2D and 3D interaction figures.',
      'Ranked score tables with interpretation for research decisions.',
    ],
    serviceTypes: [
      {
        title: 'Protein-Ligand Docking',
        abbreviation: 'PLD',
        description: 'Dock small molecules or natural compounds into an active site or predicted binding pocket.',
        keyDeliverables: ['Binding pose files', 'Interaction diagrams', 'Score ranking table'],
      },
      {
        title: 'Blind Docking',
        abbreviation: 'BD',
        description: 'Screen the full receptor surface when the binding pocket is unknown or exploratory.',
        keyDeliverables: ['Surface scan results', 'Top pocket predictions', 'Ranked pose report'],
      },
      {
        title: 'Protein-Protein Docking',
        abbreviation: 'PPD',
        description: 'Model likely binding orientations between two protein partners for complex formation studies.',
        keyDeliverables: ['Complex models', 'Interface residue map', 'Orientation ranking'],
      },
      {
        title: 'Virtual Screening',
        abbreviation: 'VS',
        description: 'Prepare ligand libraries, run docking batches, and prioritize hits for downstream validation.',
        keyDeliverables: ['Screened hit list', 'Score distribution', 'Top-N interaction visuals'],
      },
    ],
    processSteps: [
      { step: 1, title: 'Send Your Files', description: 'Share your protein structure and ligand files — we review everything and confirm scope.' },
      { step: 2, title: 'We Prepare & Dock', description: 'We clean structures, set up the docking grid, and run all calculations.' },
      { step: 3, title: 'Results & Figures', description: 'You receive ranked scores, binding poses, and publication-ready interaction visuals.' },
      { step: 4, title: 'Review & Revise', description: 'We walk you through the results and make adjustments if needed.' },
    ],
    sampleAnalyses: [
      {
        title: 'Binding pose visualization',
        description: 'Best-ranked poses are reviewed in the binding pocket with residue contacts and orientation checks.',
        image: '/images/docking-binding-pose.svg',
        caption: 'Example binding pose summary for final reports.',
      },
      {
        title: '2D interaction diagrams',
        description: 'Hydrogen bonds, hydrophobic contacts, pi interactions, and unfavorable contacts are summarized visually.',
        image: '/images/docking-2d-interactions.svg',
        caption: 'Interaction map style used to explain docking results.',
      },
      {
        title: 'Score and interaction ranking',
        description: 'Ligands are ranked by docking score, pose quality, key residue contacts, and research relevance.',
      },
    ],
    clientRequirements: [
      'Target protein structure or UniProt/PDB identifier.',
      'Ligand structures in SDF, MOL2, PDB, SMILES, or a compound list.',
      'Known active-site residues or reference ligand, if available.',
      'Preferred software, grid box constraints, or publication method requirements.',
    ],
    deliverables: [
      { title: 'Prepared ligand and receptor files', description: '' },
      { title: 'Docking score table with ranked poses', description: '' },
      { title: '2D and 3D interaction visuals', description: '' },
      { title: 'Binding site and residue interaction summary', description: '' },
      { title: 'Concise interpretation report', description: '' },
    ],
    tools: ['AutoDock Vina', 'PyMOL', 'Discovery Studio', 'Open Babel', 'BIOVIA tools'],
    faqs: [
      {
        question: 'Can you dock many ligands at once?',
        answer: 'Yes. We can support focused compound sets or larger virtual screening libraries after checking file quality and scope.',
      },
      {
        question: 'Do you provide publication-ready figures?',
        answer: 'Yes. Final reports can include clean 2D interaction diagrams, binding pose images, and ranked result tables.',
      },
    ],
  },
  {
    id: 'molecular-dynamics',
    slug: 'molecular-dynamics',
    title: 'Molecular Dynamics (MD)',
    shortTitle: 'MD Simulation',
    description: 'Simulate atom-level motion to understand stability, flexibility, compactness, solvent exposure, and interaction behavior.',
    summary: 'Production-ready MD workflows for stability, flexibility, RMSD/RMSF, radius of gyration, hydrogen bonding, SASA, and trajectory interpretation.',
    image: '/images/molecular-dynamics-simulation.png',
    price: 'Custom quote',
    timeline: '7-14 working days',
    icon: Microscope,
    iconName: 'Microscope',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    cardClass: 'bg-purple-500/[0.04] border-purple-500/20',
    accent: 'from-purple-500 to-fuchsia-500',
    seoTitle: 'Molecular Dynamics Simulation Services - RMSD, RMSF, SASA & Trajectory Analysis | insilicology',
    seoDescription: 'MD simulation services for protein, protein-ligand, and complex systems with RMSD, RMSF, SASA, radius of gyration, hydrogen bond, and trajectory analysis.',
    overviewBullets: [
      'Protein, protein-ligand, protein-protein, and membrane-aware MD workflows.',
      'Core trajectory analyses including RMSD, RMSF, SASA, Rg, H-bonds, and PCA.',
      'Publication-friendly plots, method notes, and interpretation report.',
    ],
    serviceTypes: [
      {
        title: 'Protein-Ligand Complex MD',
        abbreviation: 'PL-MD',
        description: 'Assess ligand stability, binding-pocket contacts, and protein response across the trajectory.',
        keyDeliverables: ['RMSD/RMSF plots', 'H-bond occupancy', 'Ligand stability report'],
      },
      {
        title: 'Apo Protein MD',
        abbreviation: 'APO-MD',
        description: 'Study baseline protein flexibility, domain motion, compactness, and structural stability.',
        keyDeliverables: ['RMSD time series', 'Per-residue RMSF', 'Rg and SASA plots'],
      },
      {
        title: 'Protein-Protein Complex MD',
        abbreviation: 'PP-MD',
        description: 'Evaluate interface stability, residue contacts, and complex behavior over simulation time.',
        keyDeliverables: ['Interface contact map', 'Complex RMSD', 'Interaction persistence'],
      },
      {
        title: 'Free Energy Analysis',
        abbreviation: 'FEA',
        description: 'Run MM/PBSA or MM/GBSA style analysis when the system and research question are suitable.',
        keyDeliverables: ['Binding free energy', 'Per-residue decomposition', 'Comparison table'],
      },
      {
        title: 'Ligand Parameterization',
        abbreviation: 'LP',
        description: 'Prepare ligand topology and parameter files for common MD workflows after structure validation.',
        keyDeliverables: ['Topology files', 'Parameter validation', 'Ready-to-run inputs'],
      },
    ],
    processSteps: [
      { step: 1, title: 'Share Your System', description: 'Send your protein/ligand structures and tell us about your research goal.' },
      { step: 2, title: 'Setup & Simulation', description: 'We build the system, run energy minimization, equilibration, and production MD.' },
      { step: 3, title: 'Analysis & Figures', description: 'We generate RMSD, RMSF, SASA, H-bond, and other plots with interpretation.' },
      { step: 4, title: 'Delivery & Support', description: 'You receive all files, figures, methods text, and one round of revision support.' },
    ],
    sampleAnalyses: [
      {
        title: 'RMSD',
        description: 'Tracks structural deviation over time to judge equilibration and overall system stability.',
        image: '/images/md-rmsd.svg',
        caption: 'RMSD plot example for trajectory stability review.',
      },
      {
        title: 'RMSF',
        description: 'Highlights flexible residues and regions that fluctuate more during the simulation.',
        image: '/images/md-rmsf.svg',
        caption: 'RMSF plot example for residue-level flexibility.',
      },
      {
        title: 'SASA',
        description: 'Measures solvent-accessible surface changes, useful for compactness and exposure analysis.',
        image: '/images/md-sasa.svg',
        caption: 'SASA plot example for solvent exposure trends.',
      },
      {
        title: 'Hydrogen bonds and contacts',
        description: 'Summarizes interaction persistence between ligand, receptor, solvent, or protein partners.',
      },
      {
        title: 'Radius of gyration',
        description: 'Checks compactness and folding-like behavior across the simulation trajectory.',
      },
      {
        title: 'PCA and free energy landscape',
        description: 'Explores dominant motions and conformational state distribution when appropriate.',
      },
    ],
    clientRequirements: [
      'Protein, ligand, or complex structure files in PDB, MOL2, SDF, or compatible formats.',
      'Target simulation length, for example 50 ns, 100 ns, or project-specific duration.',
      'Organism, mutation, ligand identity, and biological context.',
      'Preferred force field, water model, ion concentration, or published reference protocol if required.',
      'Specific analyses needed for thesis, manuscript, or grant reporting.',
    ],
    deliverables: [
      { title: 'Trajectory Files', description: 'Full .xtc / .dcd files with topology, ready for your own further analysis.' },
      { title: 'High-Res Figures', description: 'Publication-quality plots at 300 DPI — PNG, SVG, and editable .eps formats.' },
      { title: 'Methods Section', description: 'Ready-to-submit methods text detailing software versions, parameters, and protocols.' },
      { title: 'Interpreted Report', description: 'Scientifically written narrative contextualising results within your research question.' },
      { title: 'Raw Data Files', description: 'All numerical output in .csv and .xvg format for independent verification.' },
      { title: 'Revision Support', description: 'One round of peer-review revision support included with every project.' },
    ],
    tools: ['GROMACS', 'CHARMM-GUI', 'VMD', 'Grace/Xmgrace', 'Python/R plotting'],
    faqs: [
      {
        question: 'Which MD analyses can you include?',
        answer: 'Common outputs include RMSD, RMSF, SASA, radius of gyration, hydrogen bonds, distance analysis, contact maps, PCA, and free energy landscape when suitable.',
      },
      {
        question: 'Can you follow a journal-specific method?',
        answer: 'Yes. Share the target paper or journal requirement, and we can align the setup, analysis, and report wording where scientifically appropriate.',
      },
    ],
  },
  {
    id: 'dft-calculations',
    slug: 'dft-calculations',
    title: 'DFT Calculations',
    shortTitle: 'DFT',
    description: 'Investigate electronic structure, molecular orbitals, reactivity descriptors, and optimized geometries.',
    summary: 'Electronic structure analysis for molecular properties, orbital visualization, optimization, thermodynamic descriptors, and reactivity insights.',
    image: '/images/dft-calculations.png',
    price: 'Custom quote',
    timeline: '5-12 working days',
    icon: Database,
    iconName: 'Database',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    cardClass: 'bg-green-500/[0.04] border-green-500/20',
    accent: 'from-green-500 to-emerald-500',
    seoTitle: 'DFT Calculation Services - HOMO-LUMO, MEP & Reactivity Analysis | insilicology',
    seoDescription: 'DFT calculation support for geometry optimization, HOMO-LUMO analysis, molecular electrostatic potential, and reactivity descriptors.',
    overviewBullets: [
      'Geometry optimization and electronic structure analysis.',
      'HOMO-LUMO, MEP, dipole moment, and descriptor reporting.',
      'Clear method and basis-set documentation.',
    ],
    serviceTypes: [
      { title: 'Geometry Optimization', abbreviation: 'GO', description: 'Optimize molecular structures and prepare clean geometry outputs.', keyDeliverables: ['Optimized .xyz/.mol', 'Energy convergence', 'Frequency check'] },
      { title: 'Orbital Analysis', abbreviation: 'OA', description: 'Visualize HOMO, LUMO, and energy-gap features for reactivity interpretation.', keyDeliverables: ['HOMO/LUMO visuals', 'Energy gap table', 'Orbital surfaces'] },
      { title: 'MEP & Charge Analysis', abbreviation: 'MEP', description: 'Map electrostatic potential and identify electron-rich or electron-poor regions.', keyDeliverables: ['MEP surface map', 'Charge distribution', 'Interpretation notes'] },
      { title: 'Descriptor Reporting', abbreviation: 'DR', description: 'Summarize descriptor values needed for computational chemistry reporting.', keyDeliverables: ['Descriptor table', 'Thermodynamic values', 'Method summary'] },
    ],
    processSteps: [
      { step: 1, title: 'Send Your Molecule', description: 'Share the structure, SMILES, or drawing — we confirm the method and basis set.' },
      { step: 2, title: 'We Run Calculations', description: 'Geometry optimization, frequency checks, and property calculations are performed.' },
      { step: 3, title: 'Visuals & Data', description: 'You receive orbital images, MEP maps, descriptor tables, and interpretation.' },
      { step: 4, title: 'Review & Adjust', description: 'We review outputs together and adjust methods or add analyses if needed.' },
    ],
    sampleAnalyses: [
      { title: 'HOMO-LUMO energy gap', description: 'Summarizes frontier orbital energies and likely reactivity trends.' },
      { title: 'Molecular electrostatic potential', description: 'Highlights charge distribution and likely interaction regions.' },
      { title: 'Optimized geometry', description: 'Provides final geometry outputs and visualization-ready structures.' },
    ],
    clientRequirements: [
      'Molecular structure, SMILES, or drawing of the compound.',
      'Preferred functional, basis set, solvent model, or reference method if required.',
      'Target outputs needed for manuscript, thesis, or comparison table.',
    ],
    deliverables: [
      { title: 'Optimized molecular geometries', description: '' },
      { title: 'HOMO-LUMO and energy gap analysis', description: '' },
      { title: 'Molecular electrostatic potential visuals', description: '' },
      { title: 'Descriptor table and interpretation', description: '' },
      { title: 'Method and basis set summary', description: '' },
    ],
    tools: ['Gaussian', 'GaussView', 'ORCA', 'Multiwfn'],
    faqs: [
      { question: 'Can you work from SMILES only?', answer: 'Yes, if the structure is unambiguous. We can convert and prepare the molecule before calculation.' },
      { question: 'Can you match a published protocol?', answer: 'Yes. Share the reference method so the setup can be aligned where possible.' },
    ],
  },
  {
    id: 'bioinformatics',
    slug: 'bioinformatics',
    title: 'Bioinformatics',
    shortTitle: 'Bioinformatics',
    description: 'Analyze biological sequence, protein, pathway, and dataset outputs with clear figures and interpretation.',
    summary: 'Sequence, protein, pathway, and dataset analysis that turns biological data into clean, interpretable research outputs.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80',
    price: 'Custom quote',
    timeline: '4-10 working days',
    icon: Dna,
    iconName: 'Dna',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    cardClass: 'bg-red-500/[0.04] border-red-500/20',
    accent: 'from-red-500 to-orange-500',
    seoTitle: 'Bioinformatics Analysis Services - Sequence, Protein & Pathway Analysis | insilicology',
    seoDescription: 'Bioinformatics services for sequence alignment, annotation, protein analysis, pathway enrichment, and biological dataset interpretation.',
    overviewBullets: [
      'Sequence alignment, annotation, and phylogenetic support.',
      'Protein feature, domain, and structure-oriented analysis.',
      'Pathway and enrichment summaries with clean figures.',
    ],
    serviceTypes: [
      { title: 'Sequence Analysis', abbreviation: 'SA', description: 'Alignment, identity review, conserved region checks, and annotation support.', keyDeliverables: ['Alignment output', 'Conservation map', 'Annotation table'] },
      { title: 'Protein Analysis', abbreviation: 'PA', description: 'Domain, motif, physicochemical, and structure-linked interpretation.', keyDeliverables: ['Domain map', 'Property profile', 'Feature summary'] },
      { title: 'Pathway Analysis', abbreviation: 'PWA', description: 'Functional enrichment and pathway-level interpretation for biological datasets.', keyDeliverables: ['Enrichment plots', 'Pathway table', 'Functional summary'] },
      { title: 'Phylogenetic Analysis', abbreviation: 'PHA', description: 'Tree preparation and interpretation for sequence comparison studies.', keyDeliverables: ['Phylogenetic tree', 'Bootstrap values', 'Clade annotation'] },
    ],
    processSteps: [
      { step: 1, title: 'Share Your Data', description: 'Send sequences, gene lists, or accession IDs with your research question.' },
      { step: 2, title: 'We Analyze', description: 'Alignment, annotation, enrichment, or phylogenetic workflows are run and validated.' },
      { step: 3, title: 'Figures & Tables', description: 'You receive publication-quality figures, tables, and result summaries.' },
      { step: 4, title: 'Interpret & Deliver', description: 'We provide biological interpretation and adjust outputs to your needs.' },
    ],
    sampleAnalyses: [
      { title: 'Alignment and conservation', description: 'Identifies conserved residues, similarity patterns, and sequence-level differences.' },
      { title: 'Phylogenetic tree', description: 'Summarizes evolutionary relationship patterns for selected sequences.' },
      { title: 'Pathway enrichment', description: 'Connects gene or protein lists to biological processes and pathways.' },
    ],
    clientRequirements: [
      'Sequence files, accession IDs, protein IDs, or gene list.',
      'Organism and database preference if relevant.',
      'Research question and required figures or tables.',
    ],
    deliverables: [
      { title: 'Sequence or dataset quality overview', description: '' },
      { title: 'Alignment, annotation, or pathway outputs', description: '' },
      { title: 'Figures and result tables', description: '' },
      { title: 'Actionable interpretation report', description: '' },
    ],
    tools: ['BLAST', 'Clustal Omega', 'MEGA', 'R/Bioconductor'],
    faqs: [
      { question: 'Can you help choose the right database?', answer: 'Yes. We can recommend databases based on organism, data type, and research goal.' },
      { question: 'Do you explain the biological meaning?', answer: 'Yes. Reports include interpretation, not only raw tool outputs.' },
    ],
  },
  {
    id: 'network-pharmacology',
    slug: 'network-pharmacology',
    title: 'Network Pharmacology',
    shortTitle: 'Network Pharmacology',
    description: 'Map compound-target-pathway relationships to understand multi-target mechanisms and therapeutic potential.',
    summary: 'Integrated compound, target, disease, and pathway analysis to identify likely mechanisms, hub genes, and actionable biological networks.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    price: 'Custom quote',
    timeline: '5-10 working days',
    icon: Network,
    iconName: 'Network',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    cardClass: 'bg-cyan-500/[0.04] border-cyan-500/20',
    accent: 'from-cyan-500 to-sky-500',
    seoTitle: 'Network Pharmacology Services - Compound Target Pathway Analysis | insilicology',
    seoDescription: 'Network pharmacology analysis for compound-target networks, PPI analysis, hub genes, GO/KEGG enrichment, and mechanism interpretation.',
    overviewBullets: [
      'Compound, target, disease, and pathway mapping.',
      'PPI networks, hub gene analysis, and enrichment outputs.',
      'Mechanism-focused interpretation for manuscripts.',
    ],
    serviceTypes: [
      { title: 'Compound-Target Network', abbreviation: 'CTN', description: 'Predict and map likely targets for selected compounds or natural products.', keyDeliverables: ['Network diagram', 'Target list', 'Compound mapping'] },
      { title: 'Disease Target Intersection', abbreviation: 'DTI', description: 'Identify shared targets between compounds and disease biology.', keyDeliverables: ['Venn diagram', 'Shared target list', 'Disease gene overlap'] },
      { title: 'PPI & Hub Analysis', abbreviation: 'PPI', description: 'Build protein interaction networks and prioritize central genes or proteins.', keyDeliverables: ['PPI network', 'Hub gene ranking', 'Centrality scores'] },
      { title: 'GO/KEGG Enrichment', abbreviation: 'GKE', description: 'Summarize biological processes and pathways connected to the selected targets.', keyDeliverables: ['GO bar/dot plots', 'KEGG pathway maps', 'Enrichment table'] },
    ],
    processSteps: [
      { step: 1, title: 'Define Your Scope', description: 'Share your compounds, disease area, and research question — we plan the workflow.' },
      { step: 2, title: 'Network Construction', description: 'We mine databases, build networks, and identify key targets and hubs.' },
      { step: 3, title: 'Enrichment & Visuals', description: 'GO/KEGG enrichment, network diagrams, and hub rankings are generated.' },
      { step: 4, title: 'Report & Revise', description: 'You receive a mechanism-focused report with figures, ready for your manuscript.' },
    ],
    sampleAnalyses: [
      { title: 'Network map', description: 'Visualizes compound-target-pathway relationships for mechanism exploration.' },
      { title: 'Hub gene table', description: 'Ranks central nodes using network measures and relevance checks.' },
      { title: 'Enrichment plots', description: 'Shows enriched biological processes and pathway-level results.' },
    ],
    clientRequirements: [
      'Compound names, structures, or plant/extract composition list.',
      'Disease, condition, or target area of interest.',
      'Preferred databases or reference papers, if any.',
    ],
    deliverables: [
      { title: 'Compound-target network maps', description: '' },
      { title: 'PPI and hub gene analysis', description: '' },
      { title: 'GO/KEGG enrichment outputs', description: '' },
      { title: 'Mechanism-focused interpretation report', description: '' },
    ],
    tools: ['Cytoscape', 'STRING', 'SwissTargetPrediction', 'DAVID/Enrichr'],
    faqs: [
      { question: 'Can this be combined with docking?', answer: 'Yes. Network pharmacology often pairs well with docking for selected hub targets.' },
      { question: 'Can you prepare figures for publication?', answer: 'Yes. Network diagrams, enrichment plots, and tables can be formatted for reports or manuscripts.' },
    ],
  },
  {
    id: 'vaccine-design',
    slug: 'vaccine-design',
    title: 'Vaccine Design',
    shortTitle: 'Vaccine Design',
    description: 'In-silico vaccine discovery workflows covering antigen selection, epitope prediction, and construct evaluation.',
    summary: 'Reverse vaccinology and immunoinformatics workflows for antigen screening, epitope prioritization, construct design, and immune response prediction.',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=900&q=80',
    price: 'Custom quote',
    timeline: '7-14 working days',
    icon: ShieldCheck,
    iconName: 'ShieldCheck',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    cardClass: 'bg-amber-500/[0.04] border-amber-500/20',
    accent: 'from-amber-500 to-yellow-500',
    seoTitle: 'In-Silico Vaccine Design Services - Epitope Prediction & Immunoinformatics | insilicology',
    seoDescription: 'Vaccine design services for antigen screening, epitope prediction, construct design, allergenicity, antigenicity, and immune simulation support.',
    overviewBullets: [
      'Antigen selection and epitope prioritization workflows.',
      'Allergenicity, antigenicity, toxicity, and population coverage review.',
      'Construct design and structure-linked evaluation support.',
    ],
    serviceTypes: [
      { title: 'Antigen Screening', abbreviation: 'AS', description: 'Evaluate candidate proteins for vaccine design suitability.', keyDeliverables: ['Antigenicity scores', 'Candidate ranking', 'Surface accessibility'] },
      { title: 'Epitope Prediction', abbreviation: 'EP', description: 'Predict B-cell, T-cell, and helper T-cell epitopes using accepted tools.', keyDeliverables: ['Epitope list', 'MHC binding data', 'Population coverage'] },
      { title: 'Construct Design', abbreviation: 'CD', description: 'Assemble selected epitopes with linkers and adjuvant strategy when appropriate.', keyDeliverables: ['Construct sequence', 'Linker map', '3D model'] },
      { title: 'Structure & Docking', abbreviation: 'SD', description: 'Model construct structure and assess interaction with immune receptors where relevant.', keyDeliverables: ['Docked complex', 'Interaction map', 'Stability check'] },
    ],
    processSteps: [
      { step: 1, title: 'Share Pathogen Info', description: 'Send protein sequences, accession IDs, and your target host/population details.' },
      { step: 2, title: 'Screening & Prediction', description: 'We screen antigens, predict epitopes, and evaluate safety and coverage.' },
      { step: 3, title: 'Design & Model', description: 'The vaccine construct is assembled, modeled in 3D, and docked if needed.' },
      { step: 4, title: 'Report & Support', description: 'You receive the full design report with figures and revision support.' },
    ],
    sampleAnalyses: [
      { title: 'Epitope ranking', description: 'Prioritizes epitopes by antigenicity, allergenicity, toxicity, and coverage.' },
      { title: 'Construct map', description: 'Shows final vaccine construct organization with linkers and functional regions.' },
      { title: 'Immune receptor docking', description: 'Summarizes binding orientation and interaction clues for selected constructs.' },
    ],
    clientRequirements: [
      'Pathogen or protein sequence, accession IDs, or FASTA files.',
      'Target host population or organism context.',
      'Reference papers or preferred prediction tools if required.',
    ],
    deliverables: [
      { title: 'Antigen and epitope screening report', description: '' },
      { title: 'Vaccine construct design', description: '' },
      { title: 'Allergenicity and antigenicity assessment', description: '' },
      { title: 'Structure and docking summary', description: '' },
    ],
    tools: ['IEDB', 'VaxiJen', 'AllerTOP', 'ClusPro'],
    faqs: [
      { question: 'Is this experimental validation?', answer: 'No. This is in-silico prioritization and design support that should be followed by laboratory validation.' },
      { question: 'Can you include population coverage?', answer: 'Yes, when HLA context and target population assumptions are provided or agreed.' },
    ],
  },
  {
    id: 'cadd',
    slug: 'cadd',
    title: 'CADD',
    shortTitle: 'CADD',
    description: 'Computer-aided drug design support from virtual screening and hit prioritization to lead optimization insights.',
    summary: 'End-to-end CADD workflows for target preparation, ligand library handling, screening, ADMET profiling, and hit-to-lead decision support.',
    image: 'https://images.unsplash.com/photo-1631556097152-c39479bbff93?auto=format&fit=crop&w=900&q=80',
    price: 'Custom quote',
    timeline: '5-12 working days',
    icon: Cpu,
    iconName: 'Cpu',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    cardClass: 'bg-indigo-500/[0.04] border-indigo-500/20',
    accent: 'from-indigo-500 to-blue-500',
    seoTitle: 'CADD Services - Virtual Screening, ADMET & Lead Prioritization | insilicology',
    seoDescription: 'Computer-aided drug design services covering target preparation, virtual screening, molecular docking, ADMET profiling, and hit prioritization.',
    overviewBullets: [
      'Target preparation, ligand library setup, and virtual screening.',
      'Docking, ADMET, drug-likeness, and hit prioritization.',
      'Integrated decision report for lead selection.',
    ],
    serviceTypes: [
      { title: 'Virtual Screening', abbreviation: 'VS', description: 'Screen compound libraries and rank hits for a target of interest.', keyDeliverables: ['Hit list', 'Score distribution', 'Filtered compound set'] },
      { title: 'ADMET & Drug-Likeness', abbreviation: 'ADMET', description: 'Evaluate absorption, distribution, metabolism, toxicity, and rule-based filters.', keyDeliverables: ['ADMET table', 'Lipinski summary', 'Toxicity flags'] },
      { title: 'Hit Prioritization', abbreviation: 'HP', description: 'Combine score, interaction, ADMET, and feasibility signals into a ranked shortlist.', keyDeliverables: ['Ranked shortlist', 'Multi-criteria matrix', 'Top-N profiles'] },
      { title: 'Lead Optimization', abbreviation: 'LO', description: 'Suggest research directions based on structure, interaction, and property patterns.', keyDeliverables: ['SAR insights', 'Modification suggestions', 'Property comparison'] },
    ],
    processSteps: [
      { step: 1, title: 'Define Your Target', description: 'Share target info, compound library, and any screening criteria you need.' },
      { step: 2, title: 'Screen & Filter', description: 'We run virtual screening, apply ADMET filters, and rank the results.' },
      { step: 3, title: 'Prioritize Hits', description: 'Top compounds are profiled across multiple criteria for decision support.' },
      { step: 4, title: 'Decision Report', description: 'You receive a lead prioritization report with visuals and recommendations.' },
    ],
    sampleAnalyses: [
      { title: 'Ranked hit list', description: 'Combines docking score, interaction quality, and property filters.' },
      { title: 'ADMET profile', description: 'Summarizes predicted pharmacokinetic and toxicity properties.' },
      { title: 'Lead decision matrix', description: 'Compares candidate compounds across multiple decision criteria.' },
    ],
    clientRequirements: [
      'Target structure or target identifier.',
      'Compound library, natural product list, or database scope.',
      'Filters such as Lipinski, toxicity limits, or preferred ADMET criteria.',
    ],
    deliverables: [
      { title: 'Virtual screening workflow summary', description: '' },
      { title: 'Ranked hit list and interaction visuals', description: '' },
      { title: 'ADMET/drug-likeness report', description: '' },
      { title: 'Lead prioritization recommendations', description: '' },
    ],
    tools: ['AutoDock Vina', 'SwissADME', 'pkCSM', 'PyMOL'],
    faqs: [
      { question: 'Can you combine docking and ADMET?', answer: 'Yes. CADD projects commonly combine docking scores, interaction review, and ADMET/drug-likeness filtering.' },
      { question: 'Can you screen a custom compound library?', answer: 'Yes. Share the compound list or files, and we will review format and preparation requirements.' },
    ],
  },
  {
    id: 'metagenomics',
    slug: 'metagenomics',
    title: 'Metagenomics',
    shortTitle: 'Metagenomics',
    description: 'Microbiome and environmental sequencing analysis for taxonomy, diversity, and functional interpretation.',
    summary: 'Amplicon or shotgun metagenomics analysis for community profiling, diversity metrics, differential abundance, and functional insight.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80',
    price: 'Custom quote',
    timeline: '7-15 working days',
    icon: Layers,
    iconName: 'Layers',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    cardClass: 'bg-teal-500/[0.04] border-teal-500/20',
    accent: 'from-teal-500 to-emerald-500',
    seoTitle: 'Metagenomics Analysis Services - Microbiome Taxonomy & Diversity | insilicology',
    seoDescription: 'Metagenomics services for amplicon or shotgun data, taxonomic profiling, alpha and beta diversity, abundance tables, and functional interpretation.',
    overviewBullets: [
      'Amplicon or shotgun microbiome workflow support.',
      'Taxonomic profiling, diversity metrics, and abundance tables.',
      'Functional or pathway interpretation where suitable.',
    ],
    serviceTypes: [
      { title: 'Amplicon Analysis', abbreviation: '16S', description: '16S/18S/ITS style workflows for taxonomy and diversity outputs.', keyDeliverables: ['OTU/ASV table', 'Taxonomy barplots', 'Rarefaction curves'] },
      { title: 'Shotgun Metagenomics', abbreviation: 'SMG', description: 'Taxonomic and functional profiling for broader microbiome studies.', keyDeliverables: ['Species profile', 'Functional annotation', 'Abundance heatmap'] },
      { title: 'Diversity Analysis', abbreviation: 'DA', description: 'Alpha and beta diversity plots with statistical interpretation support.', keyDeliverables: ['Shannon/Simpson indices', 'PCoA/NMDS plots', 'Statistical tests'] },
      { title: 'Differential Abundance', abbreviation: 'DiffAb', description: 'Compare groups and identify taxa or features that differ between conditions.', keyDeliverables: ['DESeq2/ANCOM results', 'Volcano plots', 'Significant taxa list'] },
    ],
    processSteps: [
      { step: 1, title: 'Send Your Sequences', description: 'Share FASTQ files, metadata, and sample grouping — we check quality first.' },
      { step: 2, title: 'Processing & QC', description: 'We clean reads, assign taxonomy, and build abundance tables.' },
      { step: 3, title: 'Diversity & Comparison', description: 'Alpha/beta diversity, differential abundance, and functional analysis are run.' },
      { step: 4, title: 'Report & Figures', description: 'You receive all plots, tables, and an interpretation-focused report.' },
    ],
    sampleAnalyses: [
      { title: 'Taxonomic profile', description: 'Summarizes microbial composition across samples and groups.' },
      { title: 'Alpha and beta diversity', description: 'Shows within-sample richness and between-sample community differences.' },
      { title: 'Differential abundance', description: 'Highlights taxa or pathways associated with groups or treatments.' },
    ],
    clientRequirements: [
      'FASTQ files, metadata table, and sample grouping information.',
      'Amplicon region or sequencing type.',
      'Research question and preferred database if any.',
    ],
    deliverables: [
      { title: 'Quality control and preprocessing summary', description: '' },
      { title: 'Taxonomic profile and abundance tables', description: '' },
      { title: 'Alpha/beta diversity plots', description: '' },
      { title: 'Functional or pathway interpretation', description: '' },
    ],
    tools: ['QIIME 2', 'Kraken2', 'MetaPhlAn', 'R/Phyloseq'],
    faqs: [
      { question: 'Do you need metadata?', answer: 'Yes. Metadata is important for group comparisons, diversity plots, and interpretation.' },
      { question: 'Can you analyze both 16S and shotgun data?', answer: 'Yes. The exact workflow depends on sequencing type, file quality, and project goals.' },
    ],
  },
];

export const getResearchServiceBySlug = (slug?: string) =>
  researchServices.find((service) => service.slug === slug);
