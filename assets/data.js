window.PORTFOLIO_DATA = {
  archive: [
    {
      title: "Featured Project",
      subtitle: "PROJECT",
      image: "assets/images/error_diagnostic_tutor_flow.png",
      targetType: "project",
      targetIndex: 0
    },
    {
      title: "Competition Highlight",
      subtitle: "AWARD",
      image: "assets/images/YTIC_4.jpg",
      targetType: "competition",
      targetIndex: 0
    },
    {
      title: "Latest Publication",
      subtitle: "PUBLICATION",
      image: "assets/images/archive-03.jpg",
      targetType: "publication",
      targetIndex: 0
    }
  ],

  projects: [
    {
      title: "Cross-Platform Error Diagnostic Tutor",
      description: "Turn Claude, ChatGPT, and Gemini into a diagnostic tutor that understands Taiwan's curriculum standards, real exam questions, and cognitive load theory.",
      detail:"A set of prompts and knowledge-base files that turn closed-source LLMs into a structured error-diagnosis tutor for English, Math, and Science, spanning elementary through senior high school.",
      image: "assets/images/error_diagnostic_tutor_flow.png",
      tags: ["Education", "Prompt Engineering", "Cognitive Load Theory", "2026"],
      highlights: [
          "Curriculum mapping built on Taiwan's 108 Curriculum Guidelines (十二年國教課綱), covering elementary through senior high",
          "Sample questions drawn from Taiwan's 會考 (Comprehensive Assessment Program) and 學測 (GSAT)",
          "Two-role design (Teacher / Student) grounded in cognitive load theory",
          "No-code deployment — plain Markdown/JSON prompts, works on Claude Projects, ChatGPT Custom GPTs, or Gemini Gems"
        ],
      links: [
        { label: "GitHub", url: "https://github.com/chih-an/Cross-Platform-Error-Diagnostic-Tutor" }
      ]
    },
    
    
  ],

  competitions: [
    {
      year: "2026",
      title: "YTIC",
      result: "First Runner-Up",
      description: "FEIAP Youth Talent Innovation Competition 2026",
      detail: "CareSense AI is a contactless, smartphone-based chronic disease monitoring platform designed for underserved populations. Requiring no internet or extra hardware, it integrates three core technologies:",     
      image: "assets/images/YTIC_1.png",
      highlights: [
        "rPPG Sensing: Extracts vital signs (heart rate, SpO₂, respiratory rate, etc.) directly via the smartphone camera.",
        "Machine Learning: Establishes personalized physiological baselines for accurate, individualized anomaly detection.",
        "Edge AI & LLMs: Delivers offline, multilingual, and easy-to-understand health guidance for adaptive triage.",
        "Team role: Team Captain", "Result / award: First Runner-Up"],

    },
    {
      year: "2025",
      title: "IGEM",
      result: "Gold Medal",
      description: "We created GenOMe, new way for gene editing.",
      detail: "NYCU-Formos is National Yang Ming Chiao Tung University's team at iGEM 2025 — the International Genetically Engineered Machine competition, where student teams worldwide design and build engineered biological systems using standardized DNA parts called BioBricks. Their project, GenOMe, is a plug-and-play platform that integrates BioBricks directly into the bacterial genome in about two days with ~80% success, avoiding the instability and size limits of plasmid-based circuits. Through a modular, cassette-based design, GenOMe enables stepwise, cyclic DNA integration — letting teams build stable, inheritable, extensible genomes beyond the plasmid era.",
      image: "assets/images/igem_3.png",
      highlights: ["Team role: Vice Captain", "Result / award: Gold Medal; Best Foundational Advance Nomination; Best Part Collection Nomination"],
      links: [        
        { label: "Team Wiki", url: "https://2025.igem.wiki/nycu-formosa/" }
      ]
    },

  ],

  publications: [
    {
      type: "Letter",
      year: "2025",
      title: "Humor, Mankind’s Greatest Blessing: The Relationship between Sense of Humor and Psychological Wellbeing among High School Students in Taiwan",
      venue: "IIAI Letters on Institutional Research",
      authors: "Chih-An, Lin",
      detail: "The aim of the present study was to investigate the relationships between sense of humor and self-esteem, depression, emotional blockage, and poor coping. In addition, the statistical differences between the variables in different groups of participants were examined. Chinese questionnaires with multiple scales were used to collect the data. For all participants, there was a positive correlation between sense of humor and self-esteem and a negative correlation with poor coping. As the result suggests, sense of humor is related to self-esteem and not to depression. People with higher sense of humor scores do not always have lower depression scores. In addition, no correlation was found between sense of humor, self-esteem, depression, emotional blockage, and poor coping in the male students. Finally, the students with higher scores for sense of humor and depression had lower scores for self-esteem.",
      highlights: ["high-school students", "humor", "depression"],
      links: [
        { label: "DOI", url: "https://doi.org/10.52731/lir.v005.470" }
      ]
    }
  ],


  gallery: [
    {
      type: "image",
      src: "assets/images/YTIC_2.jpg",
      title: "YTIC 2026",
      description: "FEIAP Youth Talent Innovation Competition 2026",
      date: "2026"
    },
    
    {
      type: "youtube",
      id: "YwGulHqMzp8",  
      title: "iGEM Interview",
      description: "iGEM interview video at NYCU.",
      date: "2026"
    },
    {
      type: "image",
      src: "assets/images/igem_1.jpg",
      title: "iGEM 2025 Grand Jamboree",
      description: "Team photo at the Grand Jamboree.",
      date: "2025"
    },
    {
      type: "image",
      src: "assets/images/iiai_1.jpg",
      title: "IIAI 2024",
      description: "16th International Congress on Advanced Applied Informatics",
      date: "2024"
    },

  ]
};