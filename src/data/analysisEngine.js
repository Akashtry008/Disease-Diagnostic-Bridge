function extractBigrams(text) {
  const words = text.split(/[^a-z0-9-]+/).filter(w => w.length > 1);
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

function generateSummary(topDocs, query) {
  if (topDocs.length === 0) {
    return `The phenotype "${query}" does not closely match any condition in the current knowledge base. A broad, systematic diagnostic approach is recommended.`;
  }

  const primary = topDocs[0];
  const primaryGene = primary.tags.find(t => /^[A-Z0-9-]+$/.test(t) && !['INDIA', 'MUMBAI', 'DELHI', 'BENGAL', 'KERALA', 'CDDG', 'DNA'].includes(t));
  const topGenes = topDocs.slice(0, 3).map(d => d.tags.filter(t => /^[A-Z0-9-]+$/.test(t) && !['INDIA', 'MUMBAI', 'DELHI', 'BENGAL', 'KERALA', 'CDDG', 'DNA'].includes(t))).flat().filter(Boolean);

  const clusters = topDocs[0].matchedTagCount >= 2;

  const templates = [
    `The presenting phenotype - ${query} - demonstrates ${clusters ? 'a distinctive cluster of clinical features' : 'clinical features'} most consistent with ${primary.title}. ${primaryGene ? `Genetic analysis should prioritize ${primaryGene} and related pathway members. ` : ''}The pattern aligns with literature from ${primary.author} (${primary.year})${topDocs.length > 1 ? `, with secondary consideration of ${topDocs[1].title}` : ''}.`,

    `Clinical triangulation of "${query}" points to ${primary.title} as the primary diagnostic correlate. ${primaryGene ? `Pathogenic variants in ${primaryGene} should be investigated as a priority. ` : ''}This determination is supported by phenotype overlap with ${topDocs.length > 1 ? `${topDocs.length} curated research sources` : `published findings from ${primary.author}`}.`,

    `Symptom analysis identifies a ${primary.score >= 15 ? 'strong' : 'moderate'} correlation with ${primary.title}. The constellation of features - ${topDocs.slice(0, 3).map(d => d.tags.filter(t => !['India', 'Delhi', 'Mumbai', 'Bengal', 'Kerala', 'mDNA', 'CDDG'].includes(t)).slice(0, 2).join(', ')).filter(Boolean).join('; ')} - forms a recognizable phenotype pattern. ${topGenes.length > 0 ? `Prioritize sequencing of ${[...new Set(topGenes)].join(', ')}.` : ''}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateGaps(topDocs) {
  const gaps = new Set();
  gaps.add('Trio whole exome sequencing');

  topDocs.forEach(doc => {
    const hasNeuro = doc.tags.some(t => ['microcephaly', 'cerebellar atrophy', 'cerebellar hypoplasia', 'ataxia'].includes(t));
    const hasMetabolic = doc.tags.some(t => ['mitochondrial', 'metabolic', 'mDNA', 'MT-ATP6', 'Leigh Syndrome'].includes(t));
    const hasSeizure = doc.tags.some(t => ['seizures', 'epilepsy', 'neonatal', 'regression', 'SCN1A', 'KCNQ2', 'SLC6A1'].includes(t));
    const hasMuscle = doc.tags.some(t => ['SMA', 'SMN1', 'GAA', 'Pompe Disease'].includes(t));

    if (hasNeuro) gaps.add('Cranial MRI with volumetric analysis');
    if (hasMetabolic) gaps.add('Plasma lactate/pyruvate ratio + mitochondrial genome sequencing');
    if (hasSeizure) gaps.add('Extended video EEG monitoring + epilepsy gene panel');
    if (hasMuscle) gaps.add('Creatine kinase + EMG/NCS + muscle biopsy if indicated');

    const popTags = ['India', 'Delhi', 'Mumbai', 'Bengal', 'Kerala'];
    if (doc.tags.some(t => popTags.includes(t))) {
      gaps.add('Founder mutation screening for South Asian population');
    }
  });

  gaps.add('Genetic counseling and family segregation analysis');
  return [...gaps];
}

function generateTests(topDocs) {
  const tests = new Set();
  tests.add('Comprehensive clinical genetics evaluation');

  topDocs.forEach(doc => {
    const genes = doc.tags.filter(t => /^[A-Z0-9-]+$/.test(t) && !['INDIA', 'MUMBAI', 'DELHI', 'BENGAL', 'KERALA', 'CDDG', 'DNA', 'MPS'].includes(t));
    if (genes.length > 0) {
      tests.add(`Targeted panel sequencing: ${genes.join(', ')}`);
    }
    const popTags = ['India', 'Delhi', 'Mumbai', 'Bengal', 'Kerala'];
    if (doc.tags.some(t => popTags.includes(t))) {
      tests.add('Founder variant analysis (Indian population-specific panel)');
    }
  });

  if (topDocs.some(d => d.tags.includes('mitochondrial') || d.tags.includes('mDNA') || d.tags.includes('MT-ATP6'))) {
    tests.add('Mitochondrial genome (mtDNA) sequencing');
  }

  tests.add('Cranial MRI with spectroscopy');
  return [...tests];
}

function generateReasoning(topDocs) {
  if (topDocs.length === 0) return 'No significant matches were identified in the knowledge base. A systematic approach to undifferentiated presentations is warranted.';

  const primary = topDocs[0];
  let parts = [];

  parts.push(`Primary diagnostic pathway: ${primary.title}. Evidence basis: ${primary.author} (${primary.year}) - "${primary.snippet.substring(0, 120)}..."`);

  if (topDocs.length > 1) {
    const secondary = topDocs[1];
    parts.push(`Differential consideration #2: ${secondary.title} (${secondary.author}, ${secondary.year}). Phenotype overlap score: ${secondary.score}.`);
  }
  if (topDocs.length > 2) {
    const tertiary = topDocs[2];
    parts.push(`Differential consideration #3: ${tertiary.title} (${tertiary.author}, ${tertiary.year}). Score: ${tertiary.score}.`);
  }

  parts.push(`Clinical recommendation: Confirm via molecular testing before initiating management. All findings must be reviewed by a board-certified clinical geneticist.`);

  return parts.join(' ');
}

const PLAIN_LANGUAGE_MAP = {
  "Doc 1": { name: "Episodic Ataxia", simple: "a condition that affects balance and coordination, causing sudden episodes of unsteadiness and shaky eye movements. It is linked to a gene called CACNA1A that helps nerve cells communicate properly." },
  "Doc 2": { name: "PLXNB2-Related Syndrome", simple: "a disorder that affects brain development, leading to a smaller head, learning difficulties, and stiff muscles. It is caused by changes in the PLXNB2 gene." },
  "Doc 3": { name: "Metabolic Dystonia", simple: "a condition where the body has trouble processing energy, leading to uncontrolled movements and muscle stiffness in children. It involves the SLC19A3 gene." },
  "Doc 4": { name: "PLXNB2 Deficiencies", simple: "a related disorder involving the same PLXNB2 gene, causing a small head and underdeveloped cerebellum (the balance center of the brain)." },
  "Doc 5": { name: "KCNQ2-Related Epilepsy", simple: "a condition that causes hard-to-control seizures in newborn babies, along with slower development. It is linked to the KCNQ2 gene which controls brain cell activity." },
  "Doc 6": { name: "Mitochondrial Encephalopathy (MT-ATP6)", simple: "a disorder affecting the energy factories inside cells (mitochondria), causing movement problems, nerve pain, diarrhea, and unsteadiness. It is linked to the MT-ATP6 gene." },
  "Doc 7": { name: "SLC6A1 Epilepsy", simple: "a type of epilepsy that starts in childhood with sudden falls and muscle jerks, often with loss of previously learned skills after age 3." },
  "Doc 8": { name: "ASPM-Related Microcephaly", simple: "a condition where the brain does not grow to its normal size before birth, leading to a small head. This is more common in Indian families due to specific genetic changes." },
  "Doc 9": { name: "Leigh Syndrome", simple: "a serious disorder that affects energy production in the brain, causing weakness, movement problems, and difficulty breathing. A specific genetic change (m.8993T>G) is seen in North Indian patients." },
  "Doc 10": { name: "Spinal Muscular Atrophy (SMA) Type 1", simple: "a condition that affects the nerve cells controlling muscles, causing severe muscle weakness and breathing difficulties in babies. It is caused by changes in the SMN1 gene." },
  "Doc 11": { name: "NGLY1 Deficiency", simple: "a rare disorder where the body cannot properly recycle proteins, causing dry eyes (no tears), developmental delays, and movement problems. Cases have been found in the Delhi area." },
  "Doc 12": { name: "Hunter Syndrome (MPS II)", simple: "a condition where the body cannot break down certain sugars, leading to buildup that affects the heart, lungs, and appearance. Studied in Southern Indian populations." },
  "Doc 13": { name: "Batten Disease (CLN2)", simple: "a progressive brain disorder in children that causes loss of vision, movement, and thinking skills. A specific form was found through newborn screening in Mumbai." },
  "Doc 14": { name: "Dravet Syndrome", simple: "a severe form of epilepsy starting in infancy with long seizures often triggered by fever. It is caused by changes in the SCN1A gene, with specific patterns found in West Bengal." },
  "Doc 15": { name: "Pompe Disease", simple: "a condition that affects muscles throughout the body, including those used for breathing. In Kerala, a specific genetic change causes a milder form that appears in adulthood." }
};

function generatePlainLanguage(topDocs, query) {
  if (topDocs.length === 0) {
    return {
      title: "No clear match found",
      description: `The symptoms you described ("${query}") do not closely match any of the rare diseases in our knowledge base. This does not mean nothing is wrong - it means your symptoms might be caused by a more common condition or a very rare disease not yet in our records. A doctor can help figure out the right next steps.`,
      whatToDo: "A good next step is to visit a doctor who can run basic tests and refer you to a specialist if needed."
    };
  }
  const primary = topDocs[0];
  const entry = PLAIN_LANGUAGE_MAP[primary.id];
  if (!entry) {
    return {
      title: primary.title,
      description: primary.snippet.substring(0, 200),
      whatToDo: "You should discuss these findings with a doctor who can explain them in more detail."
    };
  }
  let desc = `This means your symptoms may be related to **${entry.name}**. ${entry.simple}`;
  if (topDocs.length > 1) {
    const second = topDocs[1];
    const entry2 = PLAIN_LANGUAGE_MAP[second.id];
    if (entry2) {
      desc += ` There is also a possibility of **${entry2.name}**, which has some similar features.`;
    }
  }
  const whatToDo = "You should share these findings with a doctor. They may recommend genetic testing or a referral to a specialist who understands rare diseases.";
  return { title: `Could this be ${entry.name}?`, description: desc, whatToDo };
}

const POPULATION_TAGS = ['India', 'Delhi', 'Mumbai', 'Bengal', 'Kerala'];

function buildMatches(topDocs) {
  return topDocs
    .filter(d => d.score > 0)
    .map(doc => {
      const confidence = doc.score >= 15 ? 'HIGH' : doc.score >= 8 ? 'MEDIUM' : 'LOW';
      const genes = doc.tags.filter(t => /^[A-Z0-9-]+$/.test(t) && !['INDIA', 'MUMBAI', 'DELHI', 'BENGAL', 'KERALA', 'CDDG', 'DNA', 'MPS'].includes(t));
      const population = doc.tags.find(t => POPULATION_TAGS.includes(t)) || null;

      const evidence = [
        `Matched clinical markers: ${doc.matchedTerms.join(', ')}.`,
        `${doc.snippet}`,
        `Evidence source: ${doc.author}, ${doc.year} - ${doc.title}.`
      ];

      if (population) {
        evidence.push(`Population-specific relevance: This genotype-phenotype association has been characterized in ${population}-based cohorts, providing regionally relevant diagnostic context.`);
      }

      let contraindications = `Genetic confirmation via ${genes.length > 0 ? genes.join(' or ') : 'next-generation sequencing'} is required. Exclusion of phenocopies and broader differential is advised.`;

      return {
        name: doc.title,
        confidence,
        evidence,
        contraindications,
        genes,
        population
      };
    });
}

export function analyzeSymptoms(input, database) {
  const query = input.toLowerCase().trim();
  if (!query) return null;

  const singleWordTokens = query.split(/[^a-z0-9-]+/).filter(w => w.length > 2);
  const bigramTokens = extractBigrams(query);
  const genePattern = /[A-Z]{2,}[0-9]?[A-Z]?[0-9]?/g;
  const inputGenes = input.match(genePattern) || [];

  const scored = database.map(doc => {
    const textForMatch = [doc.title, doc.snippet, ...doc.tags].join(' ').toLowerCase();
    let score = 0;
    const matchedTerms = [];

    doc.tags.forEach(tag => {
      const t = tag.toLowerCase();
      if (query.includes(t)) {
        score += 8;
        matchedTerms.push(tag);
      }
    });

    singleWordTokens.forEach(word => {
      if (textForMatch.includes(word)) {
        score += 1;
        if (!matchedTerms.some(m => m.toLowerCase() === word)) {
          matchedTerms.push(word);
        }
      }
    });

    bigramTokens.forEach(bigram => {
      if (textForMatch.includes(bigram)) {
        score += 2;
      }
    });

    const matchedTagCount = doc.tags.filter(t => query.includes(t.toLowerCase())).length;
    if (matchedTagCount >= 2) score += 5;
    if (matchedTagCount >= 3) score += 10;

    inputGenes.forEach(g => {
      if (doc.tags.some(t => t.toUpperCase() === g.toUpperCase())) {
        score += 15;
        if (!matchedTerms.some(m => m.toUpperCase() === g.toUpperCase())) {
          matchedTerms.push(g);
        }
      }
    });

    return { ...doc, score, matchedTerms: [...new Set(matchedTerms)], matchedTagCount };
  });

  scored.sort((a, b) => b.score - a.score);
  const topDocs = scored.filter(d => d.score > 0).slice(0, 4);

  const matches = topDocs.length > 0 ? buildMatches(topDocs) : [];

  let summary;
  let gaps;
  let recommendedTests;
  let clinicalReasoning;

  if (topDocs.length === 0) {
    summary = `The phenotype "${query}" does not closely match any condition in the current rare disease knowledge base. Consider a broader differential including metabolic, mitochondrial, and syndromic etiologies. A systematic diagnostic approach is recommended.`;
    gaps = [
      'Comprehensive metabolic panel (plasma amino acids, acylcarnitine profile, lactate/pyruvate)',
      'Brain MRI with spectroscopy',
      'Trio-based whole exome sequencing (WES)',
      'Mitochondrial genome sequencing',
      'Array CGH for copy number variants'
    ];
    recommendedTests = ['Cranial MRI', 'WES/WGS trio analysis', 'Metabolic screening panel', 'Mitochondrial genomics'];
    clinicalReasoning = 'No significant matches were identified in the current knowledge base (15 curated rare disease documents). The input phenotype may represent a novel presentation, an ultra-rare condition not yet catalogued, or a common condition with atypical features. A broad, systematic approach is warranted.';
  } else {
    summary = generateSummary(topDocs, query);
    gaps = generateGaps(topDocs);
    recommendedTests = generateTests(topDocs);
    clinicalReasoning = generateReasoning(topDocs);
  }

  const plainLanguage = generatePlainLanguage(topDocs, query);

  return {
    summary,
    matches,
    gaps,
    recommendedTests,
    clinicalReasoning,
    plainLanguage,
    scoredDocIds: scored.map(d => ({ id: d.id, score: d.score }))
  };
}
