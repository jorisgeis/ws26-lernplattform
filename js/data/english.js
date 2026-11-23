// English for Computer Scientists — WS 26/27 (Uma Tadema)
// Grounded in moodle-data/english-cs: Email template for exam.pdf (exam checklist), course.html (exam = BEC/Cambridge style,
// 5+ online conferences required, former exam has a listening part), and the topic PDFs (AI, Hacking, Robots, Sustainability,
// Tech giants, IT in Business, Careers, Cloud, SDLC). Exam analysis: docs/klausur-analyse/english.md

const F = 'moodle-data/english-cs/files/';
const SRC = {
  email: ['Email template for exam (Checklist)', F + 'Email template for exam.pdf'],
  course: ['Kursseite English for Computer Scientists', 'moodle-data/english-cs/course.html'],
  ai: ['AI general information and tasks', F + 'AI general information and tasks.pdf'],
  robots: ['Robots Lesson Plan 2026', F + 'Robots_Lesson_Plan_2026.pdf'],
  hacking: ['Hacking Pre session', F + 'Hacking Pre session.pdf'],
  cyberForum: ['Forum Week 2 Cybersecurity', 'moodle-data/english-cs/forums/1505776_Week 2 Cybersecurity.txt'],
  business: ['IT in Business', F + '2025 IT in Business.pdf'],
  giants: ['Tech giants Pre session', F + '2025 Tech giants Pre session .pdf'],
  cloud: ['Cloud computing', F + 'Cloud computing .pdf'],
  sdlc: ['Software development Lifecycle', F + '2025 Software development Lifecycle Master.pdf'],
  sustain: ['IT and sustainability', F + '2025 HS IT and sustainability .pdf'],
  careers: ['Careers in IT', F + 'Careers in IT .pdf']
};
const src = (key, page) => (page ? { title: SRC[key][0], path: SRC[key][1], page } : { title: SRC[key][0], path: SRC[key][1] });

export const ENGLISH_DATA = {
  courseId: 'english',
  chapters: [
    {
      id: 'eng-email',
      title: '1. Semi-Formal Exam Email (GPAS Framework)',
      badge: 'EXAM CORE!',
      examWeight: 3,
      diagram: 'gpas-email',
      sources: [src('email', 1), src('email', 2), src('course')],
      summary: [
        '<strong>Exam facts (course page):</strong> The exam "will follow the style of international exams like <strong>BEC or Cambridge</strong>". Admission: attend <strong>5+ online conferences</strong>. The former exam (Week 4) had a <strong>listening part</strong> plus other questions; the email checklist was posted as "Email task ideas".',
        '<strong>GPAS Structure:</strong> <strong>G</strong>reeting (<code>Dear Ms Smith,</code> / <code>Hello Rob,</code> / <code>Hi Mr. Kim,</code> — NEVER just a bare name like "Steve") &rarr; <strong>P</strong>urpose (why you are writing; if it is a reply, say so: <em>"In your email you …"</em>) &rarr; <strong>A</strong>ction (giving information or asking for something; 1 paragraph per point) &rarr; <strong>S</strong>alutation (<code>Kind regards,</code> / <code>Best regards,</code> + name).',
        '<strong>Template (p. 2):</strong> Greeting &rarr; Opening sentences &rarr; Point 1 &rarr; Point 2 &rarr; Point 3 &rarr; Summary / Closing sentence &rarr; Signing off &rarr; Your name.',
        '<strong>Checklist rules:</strong> <em>informal, but not too friendly</em> &bull; NO emoticons &bull; NO subject line needed (body only) &bull; be concise: 1 paragraph per point, 2–3 lines each, white space between paragraphs &bull; attachment? add one sentence &bull; mostly <em>active</em> sentences (some passive shows range) &bull; <em>indirect questions</em> for enquiries &bull; topic lexis, adjectives, adverbs, connectors &bull; <strong>register</strong>: who are you writing to and why?',
        '<strong>Top marks (point 6):</strong> vary short and long sentences and tenses, keep the mail structured and write about <strong>all points equally</strong>.',
        '<strong>Time Allocation:</strong> <strong>5%</strong> read &amp; understand the task &bull; <strong>10%</strong> rough draft with key lexis (phrases, not full sentences, in logical order) &bull; <strong>80%</strong> write &bull; <strong>5%</strong> proofread grammar, word choice, punctuation, spelling.'
      ],
      feynman: {
        prompt: 'Explain the GPAS framework and the 5-10-80-5 time allocation rule for the English exam email, plus 3 common mistakes that cost marks.',
        rubric: [
          'GPAS = Greeting, Purpose, Action, Salutation; purpose comes right after the greeting, a reply references the previous email.',
          'Time: 5% read task, 10% rough draft with lexis, 80% writing, 5% proofreading.',
          'Common mistakes: bare-name greeting ("Steve,"), emoticons, wrong register, wall of text without paragraphs, covering the task points unequally or forgetting one, forgetting the attachment sentence.'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-gpas',
        courseId: 'english',
        title: 'ENG: GPAS Semi-Formal Email Checklist',
        content: 'GPAS: Greeting -> Purpose (reason + reference to previous email) -> Action (1 paragraph per task point, 2-3 lines, white space, active voice, indirect questions, connectors, topic lexis) -> Salutation (closing sentence + Kind regards, + name).\nRules: no subject line, no emoticons, never start with a bare name ("Steve,"), informal but not too friendly, all points equally, vary short/long sentences and tenses, mention attachments in one sentence, register = who + why.\nTime: 5% read | 10% rough draft (phrases, logical order) | 80% write | 5% proofread (grammar, word choice, punctuation, spelling).\nExam: BEC/Cambridge style; admission = 5+ online conferences; includes a listening part.',
        code: 'Dear Ms Smith,\n\nThank you for your email about the cloud migration. In your email you asked me for a short update.\n\nFirst of all, ... [Point 1]\n\nRegarding the budget, ... [Point 2]\n\nCould you please let me know whether ...? [Point 3]\nPlease find attached the updated roadmap.\n\nI look forward to hearing from you.\n\nKind regards,\nJoris Geis'
      }
    },
    {
      id: 'eng-phrasebank',
      title: '2. Phrase Bank: Openings, Requests, Indirect Questions, Linking Words, Closings',
      badge: 'EXAM CORE!',
      examWeight: 3,
      diagram: 'eng-indirect-q',
      sources: [src('email', 1), src('robots', 2), src('cloud', 3), src('careers', 1)],
      summary: [
        '<strong>Opening / Purpose:</strong> <em>Thank you for your email about …</em> &bull; <em>In your email you asked …</em> &bull; <em>I am writing to inform you / to ask about / to follow up on …</em> &bull; <em>I am writing with regard to …</em> &bull; <em>As requested, …</em>',
        '<strong>Polite requests:</strong> <em>Could you please …?</em> &bull; <em>Would it be possible to …?</em> &bull; <em>I would be grateful if you could …</em> &bull; <em>I would appreciate it if you could …</em>',
        '<strong>Indirect questions</strong> (checklist point 10): stem + question word / <code>if</code> / <code>whether</code> + <strong>statement word order</strong>. <code>do/does/did</code> disappears: <em>When does it start?</em> &rarr; <em>Could you tell me when it starts?</em> After a statement stem (<em>I was wondering whether …</em>) end with a full stop.',
        '<strong>Linking words</strong> (point 12): adding <em>Furthermore, In addition, Moreover</em> &bull; contrast <em>However, Although, On the other hand, Nevertheless</em> &bull; result <em>Therefore, As a result, Consequently</em> &bull; cause <em>because, since, due to + noun</em> &bull; structure <em>First of all, Regarding …, As for …, Finally</em>.',
        '<strong>Course phrases:</strong> Robots p. 2 <em>One potential benefit is that … / A possible drawback is … / A key concern is whether … / It depends on how the technology is implemented.</em> &bull; Cloud p. 3 <em>in terms of, refers to, compared to, enables users to, to avoid having to, maintained by, commonly used by</em> &bull; Careers p. 1 <em>I’d like to … / I’m interested in … / I think this job requires … / That’s because … / Statistics show …</em>',
        '<strong>Attachments &amp; closing:</strong> <em>Please find attached …</em> / <em>I have attached …</em> &bull; <em>I look forward to hearing from you.</em> (gerund!) &bull; <em>Please do not hesitate to contact me if you have any questions.</em> &bull; <em>Thank you in advance for your help.</em> &bull; Sign-off: <em>Kind regards, / Best regards, / Best wishes,</em> (semi-formal); <em>Yours sincerely</em> is formal.'
      ],
      feynman: {
        prompt: 'Turn three direct questions (one wh-question with "does", one yes/no question, one with "will") into polite indirect questions and explain the word-order rule.',
        rubric: [
          'A polite stem is added (Could you tell me / Could you let me know / I was wondering / I would like to know).',
          'Yes/no questions need if/whether; wh-questions keep the question word.',
          'The embedded clause uses statement order (subject + verb); auxiliary do/does/did disappears and the verb takes its normal form (starts, ended).'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-phrasebank',
        courseId: 'english',
        title: 'ENG: Email Phrase Bank',
        content: 'OPEN: Thank you for your email about ... | In your email you asked ... | I am writing to inform you / to ask about / to follow up on ...\nREQUEST: Could you please ...? | Would it be possible to ...? | I would be grateful if you could ...\nINDIRECT Q: Could you let me know + when/where/if/whether + SUBJECT + VERB (no do/does/did).\nSUGGEST: I would suggest that we ... | Would Tuesday at 10 a.m. suit you?\nBAD NEWS: Unfortunately, ... | I apologise for the delay.\nLINK: Furthermore / In addition | However / Although / On the other hand | Therefore / As a result | due to + noun | Regarding ... / As for ...\nBENEFIT/RISK: One potential benefit is that ... | A possible drawback is ... | A key concern is whether ...\nATTACH: Please find attached ... | I have attached ...\nCLOSE: I look forward to hearing from you. | Please do not hesitate to contact me. | Kind regards, / Best regards,',
        code: 'When does the training start?  -> Could you tell me when the training starts?\nIs the API stable?             -> Could you let me know whether the API is stable?\nWhere will the meeting be?     -> I was wondering where the meeting will be.\nWhat did the client say?       -> I would like to know what the client said.'
      }
    },
    {
      id: 'eng-mistakes',
      title: '3. Common Mistakes of German Speakers (Grammar, False Friends, Register)',
      badge: 'Punkte sichern',
      examWeight: 3,
      sources: [src('email', 1), src('ai', 6)],
      summary: [
        '<strong>Why it matters:</strong> Checklist point 5: "grammar, word choice, punctuation and spelling need to be appropriate"; point 15: proofread. The following list is general knowledge about typical German-speaker errors (not a course handout).',
        '<strong>Grammar traps:</strong> <em>look forward to hearing</em> (not <em>to hear</em>) &bull; <em>I have worked here <strong>for</strong> three years / <strong>since</strong> 2023</em> (present perfect, not <em>I work here since</em>) &bull; <em>information, advice, feedback, equipment, software, hardware</em> are uncountable (no -s, no <em>an</em>) &bull; <em>discuss sth</em> (no <em>about</em>) &bull; <em>explain <strong>to</strong> me</em> &bull; deadline = <em><strong>by</strong> Friday</em> (spätestens), <em>until</em> = durchgehend bis.',
        '<strong>False friends:</strong> <em>aktuell</em> = <strong>current</strong> (<em>actual</em> = tatsächlich) &bull; <em>bekommen</em> = <strong>get/receive</strong> (<em>become</em> = werden) &bull; <em>eventuell</em> = <strong>possibly</strong> (<em>eventually</em> = schließlich) &bull; <em>Chef</em> = <strong>boss/manager</strong> &bull; <em>Handy</em> = <strong>mobile phone</strong> &bull; <em>Beamer</em> = <strong>projector</strong> &bull; <em>sensibel</em> = <strong>sensitive</strong> (<em>sensible</em> = vernünftig) &bull; <em>Home-Office</em> = <strong>working from home / remote work</strong>.',
        '<strong>Punctuation &amp; spelling:</strong> no comma before <em>that</em> (<em>I think that …</em>) &bull; common nouns are lower case (<em>the server</em>), but <em>I</em>, days, months, nationalities and languages are capitalised &bull; choose UK (<em>-ise, -our, -re</em>) or US (<em>-ize, -or, -er</em>) spelling and stay consistent (AI handout p. 6, Task 4).',
        '<strong>Register:</strong> <em>informal, but not too friendly</em>: avoid <em>Hey, thx, ASAP!!, gonna</em>; avoid over-formal <em>Dear Sir or Madam … Yours faithfully</em> when you know the name. <em>Could you …</em> is more polite than <em>Can you …</em>; plain imperatives (<em>Send me …</em>) sound rude.'
      ],
      feynman: {
        prompt: 'A colleague writes: "I look forward to hear from you. Can you send me the actual informations until Friday?" Explain every mistake and correct the sentence.',
        rubric: [
          'look forward to + -ing: "I look forward to hearing from you."',
          '"actual" is a false friend (aktuell = current/latest); "information" is uncountable (no -s).',
          '"until" means continuously up to; a deadline needs "by". Polite: "Could you please send me the latest information by Friday?"'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-mistakes',
        courseId: 'english',
        title: 'ENG: Top German-Speaker Mistakes',
        content: 'look forward to hearing | for (Dauer) vs since (Zeitpunkt) + present perfect | uncountable: information, advice, feedback, equipment, software, research | discuss sth (no about) | explain sth to sb | by Friday (deadline) vs until Friday (durchgehend) | make a decision / a mistake, do research / a task.\nFalse friends: aktuell=current, actual=tatsächlich | bekommen=get, become=werden | eventuell=possibly, eventually=schließlich | Chef=boss | Handy=mobile phone | Beamer=projector | sensibel=sensitive.\nPunctuation: no comma before that; nouns lower case; I/days/months/nationalities capitalised.\nRegister: Could you ...? > Can you ...? ; no Hey/thx/emoticons; UK or US spelling consistently.',
        code: 'WRONG: I work here since 2023.        RIGHT: I have worked here since 2023.\nWRONG: Can you explain me the bug?      RIGHT: Could you explain the bug to me?\nWRONG: We should discuss about it.     RIGHT: We should discuss it.\nWRONG: Send it until Friday.           RIGHT: Please send it by Friday.'
      }
    },
    {
      id: 'eng-ai-robots',
      title: '4. Artificial Intelligence & Robots (Weeks 3, 6, 8)',
      badge: 'Weeks 3, 6, 8',
      examWeight: 2,
      sources: [src('ai', 1), src('ai', 2), src('ai', 6), src('robots', 1), src('robots', 2), src('robots', 3)],
      summary: [
        '<strong>Narrow AI (ANI) vs. General AI (AGI):</strong> <em>ANI</em> (weak AI) is designed for specific tasks and cannot go beyond its programmed domain (Siri, Alexa, recommendation algorithms). <em>AGI</em> (strong AI) = human-like intelligence that can perform a wide range of tasks and learn new ones; still a goal of ongoing research.',
        '<strong>Evolution:</strong> roots in the mid-20th century (Alan Turing laid the theoretical foundation); AI truly began to thrive in the 21st century thanks to <em>computing power, data availability and algorithm development</em>.',
        '<strong>Applications:</strong> healthcare (<em>medical diagnosis, drug discovery, early disease detection</em>), finance (<em>algorithmic trading, fraud detection, risk assessment</em>), manufacturing (<em>quality control, assembly</em>), transportation (<em>self-driving cars, drones, traffic management</em>), customer service (<em>chatbots, virtual assistants</em>), education (<em>adaptive learning platforms</em>), entertainment (<em>recommendation algorithms</em>).',
        '<strong>Skills:</strong> programming (Python, TensorFlow, PyTorch), mathematics (linear algebra, calculus, probability), data analysis &amp; visualisation, problem-solving, domain knowledge, communication skills (explain AI to <em>non-technical stakeholders</em>). <strong>Trends:</strong> ethical AI, explainable AI, AI in healthcare, NLP, edge computing, autonomous systems.',
        '<strong>Robots vocabulary (Robots p. 1):</strong> <em>actuator</em> (converts energy into movement), <em>sensor</em> (detects/measures a physical property or change), <em>cobot</em> (works alongside people with safety measures), <em>computer vision</em>, <em>humanoid / industrial / service / autonomous robot</em>, <em>human–robot interaction</em>, <em>robot ethics</em>. An AI system does not need a body: it can use AI without being a robot.',
        '<strong>US vs. UK spelling (AI p. 6, Task 4):</strong> UK <code>-ise / -yse / -our / -re</code> (<em>personalised, analyse, behaviour, centre</em>) vs. US <code>-ize / -yze / -or / -er</code> (<em>personalized, analyze, behavior, center</em>). The AI handout itself uses UK spelling (<em>revolutionised, categorised, optimise</em>).'
      ],
      feynman: {
        prompt: 'Contrast Narrow AI (ANI) and General AI (AGI) in English, name two current AI trends, and explain the difference between an AI system and a robot.',
        rubric: [
          'ANI is limited to a single programmed domain (e.g. Siri, recommendation algorithms); AGI would match broad human abilities and learn new tasks; it remains a research goal.',
          'Ethical AI addresses bias, data privacy and responsible development; explainable AI makes decisions transparent and interpretable (or: NLP, edge computing, autonomous systems, AI in healthcare).',
          'A robot is a physical machine with sensors and actuators; an AI system is software that recognises patterns, predicts or generates content — a chatbot uses AI without being a robot.'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-ai',
        courseId: 'english',
        title: 'ENG: AI & Robots Lexis',
        content: 'ANI (narrow/weak, one domain: Siri, recommendation algorithms) vs AGI (general/strong, human-like, research goal).\nDrivers: computing power, data availability, algorithm development.\nApplications: medical diagnosis, drug discovery, algorithmic trading, fraud detection, risk assessment, quality control, adaptive learning, recommendation algorithms.\nSkills: Python, TensorFlow/PyTorch, linear algebra/calculus/probability, data analysis & visualisation, problem-solving, domain knowledge, communication with non-technical stakeholders.\nTrends: ethical AI (bias, privacy), explainable AI (transparency), AI in healthcare, NLP, edge computing (real-time on device), autonomous systems.\nRobots: actuator, sensor, cobot, computer vision, humanoid/industrial/service/autonomous robot, human-robot interaction, robot ethics.\nBenefit/risk: One potential benefit is that ... | A possible drawback is ... | Responsibility should lie with ... because ...',
        code: 'Word family: develop (v) -> developing (adj) -> development (n) -> developer (person)\nautomate (v) -> automated (adj) -> automation (n)\ninnovate (v) -> innovative (adj) -> innovation (n) -> innovator (person)\nUK: personalised, analyse, optimise, behaviour, centre\nUS: personalized, analyze, optimize, behavior, center'
      }
    },
    {
      id: 'eng-techgiants',
      title: '5. Tech Giants: Idioms, Collocations & Reading (Week 9)',
      badge: 'Week 9 · Business Idioms',
      examWeight: 2,
      sources: [src('giants', 2), src('giants', 3), src('giants', 4), src('giants', 6)],
      summary: [
        '<strong>1999–2000 (Text 1, p. 2):</strong> <em>Microsoft</em> most powerful (Windows on most PCs; accused of monopolising) &bull; <em>IBM</em> shifted from hardware to <em>services</em> &bull; <em>AOL</em> (dial-up ISP) bought Time Warner in 2000 &bull; <em>Apple</em> near bankruptcy until Steve Jobs returned, iMac 1998 &bull; <em>Google</em> founded 1998 by Larry Page and Sergey Brin &bull; the <em>dot-com bubble</em> burst in 2000.',
        '<strong>Today (Text 2, pp. 3–4):</strong> <em>Amazon</em>: online bookstore &rarr; largest e-commerce platform + AWS &bull; <em>Google/Alphabet</em>: AI, smart home, cloud, Android, Waymo &bull; <em>Apple</em>: iPhone, privacy, services &bull; <em>Meta</em>: metaverse, privacy/ethical concerns, now "recalibrating" &bull; <em>NVIDIA</em>: 3D graphics for gaming &rarr; AI driving force &bull; <em>Microsoft</em>: resurgence under Satya Nadella, Azure, OpenAI investment &bull; <em>Tesla</em>: EVs, AI, robotics. Challenges: regulators, public scrutiny, data privacy, monopolistic practices.',
        '<strong>10 idioms (p. 4):</strong> <em>at the cutting edge</em> (forefront) &bull; <em>game-changer</em> &bull; <em>a level playing field</em> (fair competition) &bull; <em>cash cow</em> (constant profits) &bull; <em>push the envelope</em> (go beyond limits) &bull; <em>hit the ground running</em> (start quickly and effectively) &bull; <em>dot-com bubble</em> &bull; <em>in the pipeline</em> (being developed) &bull; <em>ahead of the curve</em> &bull; <em>bite the bullet</em> (face a difficult situation with courage).',
        '<strong>Collocations (p. 6):</strong> <em>generative AI, training data, opt-out regime, copyright ownership, copyright regime, AI powerhouse, penning licensing deals, sign up to, top-of-the-range</em>. <strong>Idioms:</strong> <em>wake up to the danger, move fast and break things, left, right and centre, the wheels come off, nick our data (BrE slang = steal), the spoils of AI innovation, money washing around, hands off</em>. <strong>Challenging lexis:</strong> <em>scrape content, mooted, coffers, impunity, placate, voracious, forswear, facsimiles, patrons, framing of the issue</em>.'
      ],
      feynman: {
        prompt: 'Describe how big tech changed between 2000 and today using at least four idioms from the handout (e.g. cutting edge, cash cow, game-changer, level playing field).',
        rubric: [
          'Correct facts: Microsoft/IBM/AOL dominated around 2000; dot-com bubble burst in 2000; today Amazon (AWS), Google/Alphabet, Apple, Meta, NVIDIA, Microsoft (Azure) lead.',
          'Idioms used with the right meaning: cash cow = reliable profit source, game-changer = transforms an industry, level playing field = fair competition, cutting edge = forefront.',
          'Mentions current challenges: regulation, public scrutiny, data privacy, monopolistic practices.'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-techgiants',
        courseId: 'english',
        title: 'ENG: Tech Giants Idioms & Collocations',
        content: 'IDIOMS: at the cutting edge = forefront | game-changer = transforms an industry | level playing field = fair competition | cash cow = steady big profits | push the envelope = go beyond limits | hit the ground running = start fast & effectively | in the pipeline = being developed | ahead of the curve = more advanced than others | bite the bullet = face something difficult bravely | dot-com bubble = rise & fall of internet firms (burst 2000).\nARTICLE IDIOMS: wake up to the danger | move fast and break things | left, right and centre = everywhere | the wheels come off = things go wrong | nick = steal (BrE) | money washing around | hands off.\nCOLLOCATIONS: generative AI, training data, opt-out regime (included by default, must actively leave), copyright ownership/regime, AI powerhouse, scrape content, sign up to.\nLEXIS: mooted = proposed, not decided | coffers = funds | impunity = no punishment | placate = calm sb down | voracious = insatiable | forswear = give up.',
        code: 'Microsoft has been at the cutting edge of AI since investing in OpenAI.\nAWS has become a cash cow for Amazon.\nSmall start-ups argue there is no level playing field.\nSeveral new features are in the pipeline.'
      }
    },
    {
      id: 'eng-business',
      title: '6. IT in Business: 10 Key Applications (Week 9)',
      badge: 'Week 9 · Reading',
      examWeight: 2,
      sources: [src('business', 1), src('business', 2), src('business', 3), src('business', 4)],
      summary: [
        '<strong>Key message (p. 1):</strong> IT enables businesses to <em>operate more efficiently, stay competitive</em> and <em>create innovative solutions</em>; digital tools <em>streamline operations, reduce costs and enhance productivity</em>; IT supports decision-making by collecting, analysing and acting on data <em>in real time</em>.',
        '<strong>1–3:</strong> <em>E-commerce</em> (buying/selling online; Amazon, Shopify, eBay; payment processing, inventory management, AI recommendations) &bull; <em>Automation</em> (repetitive tasks without human intervention; chatbots, <strong>RPA</strong> = robotic process automation for data entry / invoice processing) &bull; <em>CRM</em> (manage interactions with current and potential customers; Salesforce, HubSpot, Zoho; sales pipelines).',
        '<strong>4–7:</strong> <em>Data management &amp; analytics</em> (Google Analytics, Tableau, Power BI; <em>data-driven decision-making</em> makes companies agile) &bull; <em>Cloud computing</em> (computing services over the internet; scale up or down; AWS, Azure, Google Cloud) &bull; <em>Cybersecurity</em> (firewalls, encryption, multi-factor authentication; antivirus, IDS) &bull; <em>ERP</em> (core processes: accounting, supply chain, HR in ONE system; SAP, Oracle, Microsoft Dynamics).',
        '<strong>8–10:</strong> <em>AI</em> (chatbots, recommendation systems, fraud detection, <em>predictive analytics</em>) &bull; <em>Mobile applications</em> (iOS/Android; customer engagement, seamless user experience) &bull; <em>Business Intelligence (BI)</em> (actionable information in reports, dashboards, visualisations for executives; Power BI, Tableau, Qlik; <em>competitive edge</em>).'
      ],
      feynman: {
        prompt: 'Explain to a non-technical manager the difference between CRM, ERP and BI systems, with one example product each.',
        rubric: [
          'CRM manages interactions with current and potential customers (Salesforce, HubSpot, Zoho CRM).',
          'ERP integrates core internal processes such as accounting, supply chain and HR in a single system (SAP, Oracle, Microsoft Dynamics).',
          'BI analyses internal and external data and presents actionable information in reports/dashboards for decision-makers (Power BI, Tableau, Qlik).'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-business',
        courseId: 'english',
        title: 'ENG: IT in Business Lexis',
        content: '10 applications: e-commerce | automation (RPA, chatbots) | CRM (customers: Salesforce) | data management & analytics (Tableau, Google Analytics) | cloud computing (AWS, Azure, Google Cloud) | cybersecurity (firewalls, encryption, MFA, IDS) | ERP (accounting, supply chain, HR: SAP) | AI (fraud detection, predictive analytics) | mobile apps (customer engagement) | BI (dashboards, actionable information: Power BI, Qlik).\nVerbs & collocations: streamline operations, reduce costs, enhance productivity, stay competitive, data-driven decision-making, real-time insights, seamless user experience, gain a competitive edge, reduce redundancy, tailor marketing campaigns, manage sales pipelines, free up human workers.',
        code: 'By introducing an ERP system, we could streamline operations and reduce redundancy.\nOur CRM enables us to tailor marketing campaigns to individual customers.'
      }
    },
    {
      id: 'eng-cloud-sdlc',
      title: '7. Cloud Computing & SDLC Idioms (Week 11)',
      badge: 'Week 11',
      examWeight: 2,
      diagram: 'eng-cloud-stack',
      sources: [src('cloud', 1), src('cloud', 3), src('sdlc', 1), src('sdlc', 2), src('business', 2)],
      summary: [
        '<strong>Definition (IT in Business p. 2):</strong> cloud computing = delivery of computing services (servers, storage, applications) <em>over the internet</em> instead of physical hardware; resources can be <em>scaled up or down</em> as needed.',
        '<strong>Service models:</strong> <strong>IaaS</strong> (virtual servers/storage/network, e.g. AWS EC2), <strong>PaaS</strong> (platform + runtime for developers, e.g. Heroku/App Engine), <strong>SaaS</strong> (ready-to-use apps in the browser, maintained by the provider, e.g. Microsoft 365). <strong>Deployment models:</strong> public, private, hybrid cloud.',
        '<strong>Cloud vs. on-premise (Cloud p. 3 questions):</strong> pros: <em>scalability, server storage, data recovery, less maintenance, remote collaboration</em>; cons: <em>security/privacy concerns, downtime, internet dependency</em>. Opinions p. 1: Olivia (loves it, access anywhere), Max (not a fan: security, leaks), Ella (<em>on the fence</em>: convenient but privacy/downtime), Jack (<em>game changer</em>, collaborate seamlessly).',
        '<strong>Cloud phrases (p. 3):</strong> <em>to scale up, limited resources, in terms of, let’s talk about, to avoid having to, maintained by, take a closer look, options to choose from, refers to, compared to, X is the model for you, commonly used by, enables users to</em>.',
        '<strong>SDLC idioms (p. 2):</strong> <em>laying the groundwork</em> (foundation), <em>demystifying</em> (easier to understand), <em>unraveling</em> (explain step by step), <em>crafting dependable solutions</em>, <em>a roadmap / a blueprint</em> (detailed plan), <em>breaking down the process</em>, <em>staying on track</em>, <em>digging into the requirements</em>, <em>free of errors and bugs</em>, <em>thorough testing</em>, <em>merged to production</em>, <em>evolving technologies</em>, <em>catering to requirements</em>, <em>bells and whistles</em>, <em>on the right path</em>, <em>shaking up the process</em>, <em>stand out in the digital world</em>.',
        '<strong>SDLC discussion (p. 1):</strong> quality, most critical phase, <em>Agile vs. Waterfall</em>. [General knowledge, not in the local PDF: typical phases = planning, requirements analysis, design, development, testing, deployment, maintenance.]'
      ],
      feynman: {
        prompt: 'Explain the difference between IaaS, PaaS and SaaS, then describe a software project using four SDLC idioms from the course table.',
        rubric: [
          'IaaS provides virtualised infrastructure; PaaS adds OS/runtime/development platform; SaaS delivers complete applications maintained by the provider.',
          'Idioms used correctly, e.g. laying the groundwork (foundation), staying on track (on schedule/goals), bells and whistles (non-essential extras), merged to production (code integrated into the live system).',
          'Compares cloud with on-premise using "in terms of" (scalability, maintenance, data recovery, security).'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-cloud',
        courseId: 'english',
        title: 'ENG: Cloud & SDLC Idioms',
        content: 'Cloud: IaaS (infrastructure) / PaaS (platform for developers) / SaaS (finished software). Deployment: public / private / hybrid. Pros: scalability, data recovery, less maintenance, access from anywhere. Cons: security & privacy, downtime, internet dependency, vendor lock-in.\nPhrases: to scale up, limited resources, in terms of, to avoid having to, maintained by, refers to, compared to, commonly used by, enables users to, X is the model for you.\nOpinions: on the fence = undecided | game changer | not a fan of.\nSDLC idioms: laying the groundwork | demystifying | unraveling | crafting dependable solutions | a roadmap / a blueprint | breaking down the process | staying on track | digging into requirements | free of errors and bugs | thorough testing | merged to production | evolving technologies | catering to requirements | bells and whistles | on the right path | shaking up the process | stand out in the digital world.',
        code: 'In terms of scalability, cloud computing enables companies to scale up without buying on-premise hardware.\nSaaS is the model for you if you want to avoid having to maintain servers.\nWe skipped the bells and whistles to stay on track.'
      }
    },
    {
      id: 'eng-cyber',
      title: '8. Cybersecurity & Hacking (Weeks 2, 5)',
      badge: 'Weeks 2, 5',
      examWeight: 2,
      sources: [src('business', 2), src('hacking', 1), src('cyberForum')],
      summary: [
        '<strong>Definition (IT in Business p. 2):</strong> cybersecurity = protecting computer systems, networks and data from <em>unauthorized access, theft or damage</em>. Measures: <em>firewalls, encryption, multi-factor authentication</em>; tools: <em>antivirus software, intrusion detection systems (IDS), firewalls</em>. Protect: <em>customer data, intellectual property, financial records</em>.',
        '<strong>Hacking session (p. 1):</strong> find an article about a <em>hacking incident or data breach</em> from the last 6 months: why did you choose it, what makes it unique, how is it relevant, <em>how highly do you rate this source and why?</em> (The 50 hacking terms are only on Wordwall online.)',
        '<strong>Threat lexis [general knowledge]:</strong> <em>phishing</em> (fake emails/sites steal credentials), <em>ransomware</em> (encrypts data, demands payment), <em>malware</em>, <em>social engineering</em> (manipulating people), <em>data breach</em>, <em>DDoS attack</em> (overloading a service), <em>zero-day vulnerability</em> (unknown flaw, no patch), <em>brute-force attack</em>, <em>patch</em>.',
        '<strong>People &amp; defence [general knowledge]:</strong> <em>ethical hacker / white hat</em> (authorised), <em>black hat</em> (criminal), <em>penetration testing</em>, <em>bug bounty</em>, <em>two-factor / multi-factor authentication</em>, <em>strong passwords</em>, <em>security awareness training</em> (human error, forum Week 2 question).'
      ],
      feynman: {
        prompt: 'Explain to a non-IT colleague what phishing and ransomware are and which three protective measures from the course text a company should use.',
        rubric: [
          'Phishing tricks people into revealing credentials via fake messages; ransomware encrypts data and demands a ransom.',
          'Measures named from the text: firewalls, encryption, multi-factor authentication (plus antivirus, IDS).',
          'Mentions the human factor: awareness training because human error causes many incidents.'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-cyber',
        courseId: 'english',
        title: 'ENG: Cybersecurity & Hacking Lexis',
        content: 'Cybersecurity = protecting systems, networks, data from unauthorized access, theft or damage. Measures: firewalls, encryption, multi-factor authentication (MFA). Tools: antivirus software, intrusion detection system (IDS). Protect: customer data, intellectual property, financial records.\nThreats: phishing, ransomware, malware, spyware, social engineering, data breach, DDoS attack, zero-day vulnerability, brute-force attack.\nPeople: ethical hacker/white hat, black hat, penetration tester, bug bounty hunter.\nVerbs: to breach a system, to leak data, to patch a vulnerability, to encrypt files, to launch an attack, to report an incident.',
        code: 'We have patched the vulnerability and enabled multi-factor authentication for all accounts.\nCould you let me know whether any customer data was affected by the breach?'
      }
    },
    {
      id: 'eng-sustain-careers',
      title: '9. IT & Sustainability, Careers & Soft Skills (Weeks 7, 8, 10)',
      badge: 'Weeks 7, 8, 10',
      examWeight: 1,
      sources: [src('sustain', 1), src('sustain', 2), src('sustain', 3), src('careers', 1)],
      summary: [
        '<strong>UN SDGs relevant to IT (p. 1):</strong> SDG 9 Industry, Innovation and Infrastructure &bull; SDG 11 Sustainable Cities &bull; SDG 12 Responsible Consumption and Production &bull; SDG 13 Climate Action.',
        '<strong>Lexis set (p. 2):</strong> <em>carbon footprint, energy-efficient, green computing, data centres, e-waste, lifecycle (of hardware/software), sustainable design, digital divide, responsible innovation</em>. Four levels: individuals, companies, society, governments.',
        '<strong>Your IT future (p. 3):</strong> "Technology is not neutral. As IT professionals, we shape the future." Action plan: learn one sustainability-related IT skill, make one responsible technology choice, contribute through your career.',
        '<strong>Careers (p. 1):</strong> phrases <em>I’d like to … / I’m interested in … / I think this job requires … / That’s because … / Statistics show …</em>; topics: interview methods, growing IT sectors, impact of AI and automation, (soft) skills, emerging roles, <em>future-proof</em> yourself.'
      ],
      feynman: {
        prompt: 'Explain one positive and one negative impact of IT on sustainability using at least four terms from the lexis set, and link it to one SDG.',
        rubric: [
          'Positive: energy-efficient/green computing, smart cities (SDG 11), remote work, sustainable design.',
          'Negative: carbon footprint of data centres, e-waste from short hardware lifecycles, digital divide.',
          'Correct SDG link (9, 11, 12 or 13) with its name.'
        ]
      },
      cheatSheet: {
        id: 'cs-eng-sustain',
        courseId: 'english',
        title: 'ENG: Sustainability & Careers',
        content: 'SDG 9 Industry, Innovation & Infrastructure | SDG 11 Sustainable Cities | SDG 12 Responsible Consumption & Production | SDG 13 Climate Action.\nLexis: carbon footprint (total greenhouse gas emissions), energy-efficient, green computing, data centres, e-waste (discarded electronics), lifecycle of hardware/software, sustainable design, digital divide (gap in access to IT), responsible innovation.\nLevels: individuals, companies, society, governments.\nCareers: I would like to ... | I am interested in ... | This job requires ... | That is because ... | Statistics show ... | to future-proof one’s career | soft skills (communication, teamwork, adaptability).',
        code: 'One potential benefit of cloud data centres is that they can be more energy-efficient than small server rooms.\nHowever, a key concern is the growing amount of e-waste.'
      }
    }
  ],
  flashcards: [
    // ---------- 1. Email (GPAS) ----------
    { id: 'fc-eng-1', chapterId: 'eng-email', examRelevant: true, front: 'What does GPAS stand for in semi-formal exam emails, and what is the recommended time allocation?', back: 'G = Greeting, P = Purpose, A = Action, S = Salutation.\nTime allocation: 5% read task • 10% rough draft with key lexis • 80% write email • 5% proofread.', source: src('email', 1) },
    { id: 'fc-eng-7', chapterId: 'eng-email', examRelevant: true, front: 'Turn this direct question into a polite indirect question for a semi-formal exam email: "When will the server maintenance finish?"', back: '"Could you please let me know when the server maintenance will finish?"\n(Statement word order: subject + verb — NOT "when will the server maintenance finish".)', source: src('email', 1) },
    { id: 'fc-eng-em-1', chapterId: 'eng-email', examRelevant: true, front: 'Which greetings does the checklist accept — and which two things are forbidden?', back: 'OK: "Hello Rob," / "Hi Mr. Kim," / "Dear Ms Smith," (depending on the email).\nForbidden: starting with just a name ("Steve,") and emoticons ("Never use emoticons").', source: src('email', 1) },
    { id: 'fc-eng-em-2', chapterId: 'eng-email', examRelevant: true, front: 'Do you need a subject line in the exam email?', back: 'No. You are expected to write only the body of the email (checklist point 4).', source: src('email', 1) },
    { id: 'fc-eng-em-3', chapterId: 'eng-email', examRelevant: true, front: 'Paragraphs: how many per task point and how long?', back: 'Usually 1 paragraph per point (point 3), 2–3 lines per paragraph, with white space between paragraphs (point 9) so the email is easy to scan, read and correct.', source: src('email', 1) },
    { id: 'fc-eng-em-4', chapterId: 'eng-email', examRelevant: true, front: 'Your email is a reply. What must you do (checklist point 7)? Give two example sentences.', back: 'Reference the previous email:\n• "In your email you asked me about …"\n• "Thank you for your email about the server migration."', source: src('email', 1) },
    { id: 'fc-eng-em-5', chapterId: 'eng-email', examRelevant: true, front: 'The task says the email should have an attachment. What do you write?', back: 'One sentence that mentions it (point 8):\n• "Please find attached the project roadmap."\n• "I have attached the test report for your reference."', source: src('email', 1) },
    { id: 'fc-eng-em-6', chapterId: 'eng-email', examRelevant: true, front: 'Active or passive voice in the exam email? (point 10)', back: 'Mostly active sentences — shorter and faster to read. Some passive sentences show your language range (e.g. "The update will be deployed on Monday"). Keep it short but polite and friendly.', source: src('email', 1) },
    { id: 'fc-eng-em-7', chapterId: 'eng-email', examRelevant: true, front: 'How do you get top marks according to checklist point 6?', back: 'Vary short and long sentences and tenses, keep the email structured and write about ALL task points equally (examiners read a lot of emails).', source: src('email', 1) },
    { id: 'fc-eng-em-8', chapterId: 'eng-email', examRelevant: true, front: 'What exactly should your rough draft (10% of the time) contain?', back: 'The points in a logical order, written as phrases — not full sentences — plus the important topic lexis you want to use (points 11 and 13).', source: src('email', 1) },
    { id: 'fc-eng-em-9', chapterId: 'eng-email', examRelevant: true, front: 'List the 8 parts of the email template (p. 2).', back: 'Greeting → Opening sentences → Point 1 → Point 2 → Point 3 → Summary / Closing sentence → Signing off → Your name.', source: src('email', 2) },
    { id: 'fc-eng-em-10', chapterId: 'eng-email', examRelevant: true, front: 'What does "register" mean, and which two questions decide it (point 14)?', back: 'Register = level of formality/tone. Ask: WHO am I writing to and WHY?\nSemi-formal = "informal, but not too friendly": polite, no slang, no emoticons.', source: src('email', 1) },
    { id: 'fc-eng-em-11', chapterId: 'eng-email', examRelevant: true, front: 'What does the course page say about the exam style and admission?', back: '• Exam style: like international exams such as BEC or Cambridge.\n• Requirement: attend 5+ online conferences to be allowed to take the exam.\n• The former exam (Week 4) had a listening part plus other questions.', source: src('course') },
    { id: 'fc-eng-em-12', chapterId: 'eng-email', examRelevant: true, front: 'Correct the greeting: "Dear Mr. Robert," / "Dear Ms Sarah Miller,"', back: 'Use title + SURNAME only: "Dear Mr Klein," / "Dear Ms Miller,". With a first name, drop the title: "Hello Robert,".\n(Comma after the greeting; the next line starts with a capital letter.)' },

    // ---------- 2. Phrase bank ----------
    { id: 'fc-eng-pb-1', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Phrase bank — stating your PURPOSE (3 phrases)', back: '• "I am writing to inform you that …"\n• "I am writing to ask about / to follow up on …"\n• "I am writing with regard to the upcoming release."', source: src('email', 1) },
    { id: 'fc-eng-pb-2', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Phrase bank — polite REQUESTS (4 phrases)', back: '• "Could you please send me …?"\n• "Would it be possible to move the meeting to Thursday?"\n• "I would be grateful if you could …"\n• "I would appreciate it if you could …"' },
    { id: 'fc-eng-pb-3', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Indirect question: "When does the training start?"', back: '"Could you tell me when the training starts?"\ndoes disappears, verb gets its normal form (starts), subject before verb.', source: src('email', 1) },
    { id: 'fc-eng-pb-4', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Indirect question (yes/no): "Is the new API stable?"', back: '"Could you let me know whether (if) the new API is stable?"\nYes/no questions need if/whether + statement order.', source: src('email', 1) },
    { id: 'fc-eng-pb-5', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Indirect question: "What did the client say about the prototype?"', back: '"I would like to know what the client said about the prototype."\ndid disappears → past form "said". Statement stem → full stop, no question mark.' },
    { id: 'fc-eng-pb-6', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Name 5 stems for indirect questions.', back: '• Could you (please) tell me …?\n• Could you let me know …?\n• Do you know …?\n• I was wondering if / whether …\n• I would like to know …\n• I would appreciate it if you could clarify …' },
    { id: 'fc-eng-pb-7', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Linking words — ADDING information (4)', back: 'Furthermore, … / In addition, … / Moreover, … / Also, …\n(Checklist point 12: use connectors.)', source: src('email', 1) },
    { id: 'fc-eng-pb-8', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Linking words — CONTRAST (4) and how to punctuate "However"', back: 'However / Although / On the other hand / Nevertheless.\n"The cloud is flexible. However, security is a concern." ("However" starts a new sentence or follows a semicolon, followed by a comma.)' },
    { id: 'fc-eng-pb-9', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Linking words — CAUSE and RESULT', back: 'Cause: because + clause, since + clause, due to / because of + NOUN ("due to the outage").\nResult: Therefore, / As a result, / Consequently, …' },
    { id: 'fc-eng-pb-10', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Phrases to STRUCTURE the action part (one per point)', back: '• First of all, …\n• Regarding the budget, … / As for the deadline, …\n• Secondly, … / Finally, …\n• With regard to your second question, …' },
    { id: 'fc-eng-pb-11', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Closing sentences before the sign-off (3)', back: '• "I look forward to hearing from you."\n• "Please do not hesitate to contact me if you have any questions."\n• "Thank you in advance for your help."' },
    { id: 'fc-eng-pb-12', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Sign-offs: which are semi-formal and which is formal?', back: 'Semi-formal: Kind regards, / Best regards, / Best wishes, + your name.\nFormal: Yours sincerely (name known) / Yours faithfully (Dear Sir or Madam).\nToo informal for the exam: Cheers, / Bye, / xoxo.' },
    { id: 'fc-eng-pb-13', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Phrases for talking about BENEFITS and RISKS (Robots handout)', back: '• One potential benefit is that …\n• A possible drawback is …\n• This could be useful in situations where …\n• A key concern is whether …\n• It depends on how the technology is implemented.\n• Responsibility should lie with … because …', source: src('robots', 2) },
    { id: 'fc-eng-pb-14', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Cloud handout phrases — use 4 in sentences', back: 'to scale up, limited resources, in terms of, to avoid having to, maintained by, take a closer look, options to choose from, refers to, compared to, X is the model for you, commonly used by, enables users to.\nE.g. "Compared to on-premise servers, SaaS enables users to work from anywhere."', source: src('cloud', 3) },
    { id: 'fc-eng-pb-15', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Phrases for SUGGESTING and ARRANGING a meeting', back: '• "I would suggest that we meet next week."\n• "Would Tuesday at 10 a.m. suit you?"\n• "Could we arrange a short call to discuss the next steps?"\n• "Please let me know which time works best for you."' },
    { id: 'fc-eng-pb-16', chapterId: 'eng-phrasebank', examRelevant: true, front: 'Phrases for BAD NEWS / apologising politely', back: '• "Unfortunately, the release will be delayed by one week."\n• "I apologise for any inconvenience this may cause."\n• "I am afraid that we cannot meet the deadline."\n• "Sorry for the late reply." (semi-formal)' },
    { id: 'fc-eng-pb-17', chapterId: 'eng-phrasebank', examRelevant: false, front: 'Careers handout: useful expressions for talking about your future', back: '"I’d like to …" / "I’m interested in …" / "I think this job requires …" / "That’s because …" / "Statistics show …"', source: src('careers', 1) },

    // ---------- 3. Common mistakes ----------
    { id: 'fc-eng-gm-1', chapterId: 'eng-mistakes', examRelevant: true, front: 'Correct: "I look forward to hear from you."', back: '"I look forward to hearing from you." — "to" is a preposition here, so it is followed by -ing.' },
    { id: 'fc-eng-gm-2', chapterId: 'eng-mistakes', examRelevant: true, front: 'Correct: "Thank you for the informations and advices."', back: '"Thank you for the information and advice." — information, advice, feedback, equipment, software, research are uncountable (no -s, no "an"). Countable: "a piece of information".' },
    { id: 'fc-eng-gm-3', chapterId: 'eng-mistakes', examRelevant: true, front: 'Correct: "I work in this company since 2023 / since three years."', back: '"I have worked for this company since 2023 / for three years."\nPresent perfect for situations up to now; since + point in time, for + period.' },
    { id: 'fc-eng-gm-4', chapterId: 'eng-mistakes', examRelevant: true, front: 'False friend: "aktuell" vs "actual"', back: 'aktuell = current / latest ("the current version").\nactual = tatsächlich; actually = eigentlich/tatsächlich.' },
    { id: 'fc-eng-gm-5', chapterId: 'eng-mistakes', examRelevant: true, front: 'False friend: "bekommen" vs "become"', back: 'bekommen = get / receive ("I received your email").\nbecome = werden ("AI has become essential").' },
    { id: 'fc-eng-gm-6', chapterId: 'eng-mistakes', examRelevant: true, front: 'False friend: "eventuell" vs "eventually"', back: 'eventuell = possibly / maybe.\neventually = schließlich / am Ende ("the dot-com bubble eventually burst").' },
    { id: 'fc-eng-gm-7', chapterId: 'eng-mistakes', examRelevant: true, front: 'Deadline: "Please send the report until Friday." — what is wrong?', back: 'For a deadline use "by": "Please send the report by Friday." (spätestens bis).\n"until" = continuously up to ("The server will be offline until Friday").' },
    { id: 'fc-eng-gm-8', chapterId: 'eng-mistakes', examRelevant: true, front: 'Correct: "Can you explain me the problem? We need to discuss about it."', back: '"Could you explain the problem to me? We need to discuss it."\nexplain sth TO sb; discuss is transitive (no "about").' },
    { id: 'fc-eng-gm-9', chapterId: 'eng-mistakes', examRelevant: true, front: 'German words that are NOT English: Handy, Beamer, Chef, Home-Office', back: 'Handy → mobile phone\nBeamer → projector\nChef → boss / manager / team lead\nHome-Office → working from home / remote work' },
    { id: 'fc-eng-gm-10', chapterId: 'eng-mistakes', examRelevant: true, front: 'Comma before "that"? "I think, that the plan is good."', back: 'No comma: "I think that the plan is good." (German "dass" needs a comma — English "that" does not.)' },
    { id: 'fc-eng-gm-11', chapterId: 'eng-mistakes', examRelevant: true, front: 'Capitalisation rules German speakers get wrong', back: 'Common nouns are lower case ("the server", "the project").\nCapitalised: I, days (Monday), months (May), nationalities/languages (German, English), names.' },
    { id: 'fc-eng-gm-12', chapterId: 'eng-mistakes', examRelevant: true, front: 'make or do? decision / mistake / research / a task / progress / a course', back: 'make a decision, make a mistake, make progress\ndo research, do a task, do a course (also: take a course)' },
    { id: 'fc-eng-gm-13', chapterId: 'eng-mistakes', examRelevant: true, front: 'False friend: "sensibel" vs "sensible"', back: 'sensibel = sensitive ("sensitive customer data").\nsensible = vernünftig ("a sensible decision").' },
    { id: 'fc-eng-gm-14', chapterId: 'eng-mistakes', examRelevant: true, front: 'Register: why is "Send me the file ASAP!! Thx :)" a problem in the exam?', back: 'Imperative + abbreviations + emoticon = too informal / rude. Better: "Could you please send me the file by Wednesday? Thank you in advance." (Checklist: be informal, but not too friendly; never use emoticons.)', source: src('email', 1) },
    { id: 'fc-eng-gm-15', chapterId: 'eng-mistakes', examRelevant: true, front: 'Present simple or continuous? "At the moment I work on the new login feature."', back: '"At the moment I am working on the new login feature." — temporary action happening now = present continuous.\nPresent simple for routines/facts: "I usually work from home on Fridays."' },

    // ---------- 4. AI & Robots ----------
    { id: 'fc-eng-5', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Difference between Narrow AI (ANI) and General AI (AGI)?', back: '• ANI (Narrow/Weak AI): designed for specific tasks, limited to its programmed domain (e.g. Siri, Alexa, recommendation algorithms).\n• AGI (General/Strong AI): human-like intelligence able to perform a wide range of tasks and learn new ones; still a goal of ongoing research.', source: src('ai', 1) },
    { id: 'fc-eng-ai-1', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Why did AI only start to thrive in the 21st century? (3 drivers)', back: 'Advancements in computing power, data availability and algorithm development.\n(Roots: mid-20th century; Alan Turing developed theoretical frameworks that laid the foundation.)', source: src('ai', 1) },
    { id: 'fc-eng-ai-2', chapterId: 'eng-ai-robots', examRelevant: true, front: 'AI applications in healthcare and finance (collocations)', back: 'Healthcare: medical diagnosis, drug discovery, patient care, early disease detection.\nFinance: algorithmic trading, fraud detection, risk assessment, chatbots for customer support.', source: src('ai', 1) },
    { id: 'fc-eng-ai-3', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Name the 6 skills required to work in AI (handout).', back: 'Programming (Python, TensorFlow, PyTorch) • Mathematics (linear algebra, calculus, probability) • Data analysis (incl. visualisation) • Problem-solving • Domain knowledge • Communication skills (explain AI to non-technical stakeholders).', source: src('ai', 2) },
    { id: 'fc-eng-ai-4', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Name the 6 current AI trends from the handout.', back: 'Ethical AI • Explainable AI • AI in healthcare • AI in NLP • AI in edge computing • AI in autonomous systems.', source: src('ai', 2) },
    { id: 'fc-eng-ai-5', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Define "edge computing" and "NLP" in your own words.', back: 'Edge computing: AI moves closer to the source of data → real-time processing on devices like smartphones and IoT devices.\nNLP (natural language processing): AI that understands/produces human language → chatbots, translation, content generation.', source: src('ai', 2) },
    { id: 'fc-eng-ai-6', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Ethical AI vs Explainable AI', back: 'Ethical AI: addresses bias in algorithms, data privacy and responsible AI development.\nExplainable AI: transparency — models whose decisions are understandable and interpretable.', source: src('ai', 2) },
    { id: 'fc-eng-ai-7', chapterId: 'eng-ai-robots', examRelevant: true, front: 'US vs UK spelling: give 5 pairs (Task 4).', back: 'personalised / personalized\nanalyse / analyze\noptimise / optimize\nbehaviour / behavior\ncentre / center (data centre)\n→ choose one variety and stay consistent.', source: src('ai', 6) },
    { id: 'fc-eng-ai-8', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Word families (Task 7): develop, automate, innovate, analyse', back: 'develop → developing → development → developer\nautomate → automated → automation\ninnovate → innovative → innovation → innovator\nanalyse → analytical → analysis → analyst', source: src('ai', 6) },
    { id: 'fc-eng-ai-9', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Collocation hunt (Task 5): complete — machine learning ___ / data ___ / diagnostic ___ / autonomous ___ / fraud ___', back: 'machine learning algorithms / data privacy / diagnostic tools / autonomous systems / fraud detection', source: src('ai', 6) },
    { id: 'fc-eng-ai-10', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Robots: actuator vs sensor', back: 'Actuator: a component that converts energy into movement or mechanical action.\nSensor: a device that detects or measures a physical property or a change in the environment.', source: src('robots', 1) },
    { id: 'fc-eng-ai-11', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Robots: cobot, industrial robot, service robot', back: 'Cobot (collaborative robot): designed to work alongside people, with suitable safety measures.\nIndustrial robot: programmable robot for manufacturing/industrial tasks.\nService robot: performs useful tasks for people or equipment outside industrial automation.', source: src('robots', 1) },
    { id: 'fc-eng-ai-12', chapterId: 'eng-ai-robots', examRelevant: true, front: 'Robots: autonomous robot, humanoid robot, computer vision', back: 'Autonomous robot: carries out tasks and makes operational decisions without continuous human control.\nHumanoid robot: human-like body shape or movement.\nComputer vision: enables a system to interpret images or video.', source: src('robots', 1) },
    { id: 'fc-eng-ai-13', chapterId: 'eng-ai-robots', examRelevant: false, front: 'Human–robot interaction & robot ethics', back: 'Human–robot interaction: the ways people communicate or work with robots.\nRobot ethics: questions about responsibility, safety, fairness, privacy and the effects of robots on people.', source: src('robots', 1) },
    { id: 'fc-eng-ai-14', chapterId: 'eng-ai-robots', examRelevant: false, front: 'Task B: Can a system use AI without being a robot?', back: 'Yes. AI = computer systems that recognise patterns, make predictions or generate content (e.g. a chatbot, a recommendation algorithm). A robot is a physical machine (sensors + actuators); it may or may not use AI.', source: src('robots', 1) },
    { id: 'fc-eng-ai-15', chapterId: 'eng-ai-robots', examRelevant: false, front: 'Real robots from the AI handout: Da Vinci, Roomba, Spot, Pepper, UR cobots — what do they do?', back: 'Da Vinci Surgical System: assists minimally invasive surgery (precision).\nRoomba (iRobot): autonomous vacuum cleaner.\nSpot (Boston Dynamics): inspection, surveillance in construction/mining/logistics.\nPepper (SoftBank): social humanoid for customer service.\nUniversal Robots UR series: cobots in manufacturing/assembly.', source: src('ai', 4) },
    { id: 'fc-eng-ai-16', chapterId: 'eng-ai-robots', examRelevant: false, front: 'Robots & society: who could be responsible if an autonomous robot causes an accident?', back: 'The manufacturer, the programmer, the owner or the operator (discussion question, Robots p. 3).\nPhrase: "Responsibility should lie with … because …"', source: src('robots', 3) },

    // ---------- 5. Tech giants ----------
    { id: 'fc-eng-tg-1', chapterId: 'eng-techgiants', examRelevant: true, front: 'Idioms: "at the cutting edge" vs "ahead of the curve"', back: 'at the cutting edge = at the forefront of technological advancements.\nahead of the curve = more advanced or innovative than others.', source: src('giants', 4) },
    { id: 'fc-eng-tg-2', chapterId: 'eng-techgiants', examRelevant: true, front: 'Idioms: "game-changer" and "cash cow"', back: 'game-changer = a revolutionary development that transforms an industry.\ncash cow = a business or product that consistently generates significant profits.', source: src('giants', 4) },
    { id: 'fc-eng-tg-3', chapterId: 'eng-techgiants', examRelevant: true, front: 'Idioms: "a level playing field" and "push the envelope"', back: 'a level playing field = fair competition where no one has an advantage.\npush the envelope = go beyond the limits of what is possible.', source: src('giants', 4) },
    { id: 'fc-eng-tg-4', chapterId: 'eng-techgiants', examRelevant: true, front: 'Idioms: "hit the ground running", "in the pipeline", "bite the bullet"', back: 'hit the ground running = start something quickly and effectively.\nin the pipeline = projects/plans being developed.\nbite the bullet = face a difficult situation with courage.', source: src('giants', 4) },
    { id: 'fc-eng-tg-5', chapterId: 'eng-techgiants', examRelevant: true, front: 'What was the dot-com bubble?', back: 'The rapid rise and fall of internet companies in the late 1990s: start-ups attracted huge investments but lacked sustainable business models; the bubble burst in 2000, wiping out billions of dollars in market value.', source: src('giants', 2) },
    { id: 'fc-eng-tg-6', chapterId: 'eng-techgiants', examRelevant: true, front: 'Big tech around 2000: Microsoft, IBM, AOL, Apple, Google — one fact each', back: 'Microsoft: most powerful, Windows on most PCs, accused of monopolising.\nIBM: shifted from hardware to services.\nAOL: dial-up ISP, bought Time Warner in 2000.\nApple: near bankruptcy until Steve Jobs returned; iMac 1998.\nGoogle: founded 1998 by Larry Page and Sergey Brin.', source: src('giants', 2) },
    { id: 'fc-eng-tg-7', chapterId: 'eng-techgiants', examRelevant: true, front: 'Big tech today: Amazon, NVIDIA, Microsoft, Meta — key change', back: 'Amazon: online bookstore → largest e-commerce platform + AWS cloud leader.\nNVIDIA: 3D graphics for gaming → driving force in AI.\nMicrosoft: resurgence under Satya Nadella; Azure (competitor to AWS), investment in OpenAI.\nMeta: social media → metaverse (VR/AR), privacy & ethical concerns; now recalibrating priorities.', source: src('giants', 4) },
    { id: 'fc-eng-tg-8', chapterId: 'eng-techgiants', examRelevant: true, front: 'Collocations: "opt-out regime", "training data", "generative AI"', back: 'opt-out regime = default is inclusion; users must actively choose to exclude themselves.\ntraining data = dataset used to teach AI systems to recognise patterns.\ngenerative AI = AI that creates content (text, images, music) from patterns in data.', source: src('giants', 6) },
    { id: 'fc-eng-tg-9', chapterId: 'eng-techgiants', examRelevant: true, front: 'Collocations: "copyright regime", "penning licensing deals", "AI powerhouse"', back: 'copyright regime = system/framework under which copyright laws operate.\npenning licensing deals = writing and agreeing legal agreements that allow use of material.\nAI powerhouse = a country or company very strong in AI.', source: src('giants', 6) },
    { id: 'fc-eng-tg-10', chapterId: 'eng-techgiants', examRelevant: true, front: 'Idioms: "move fast and break things", "the wheels come off", "left, right and centre"', back: 'move fast and break things = act quickly without worrying about the consequences.\nthe wheels come off = a situation starts to fail.\nleft, right and centre = everywhere, constantly.', source: src('giants', 6) },
    { id: 'fc-eng-tg-11', chapterId: 'eng-techgiants', examRelevant: false, front: 'Idioms: "nick our data", "wake up to the danger", "hands off", "money washing around"', back: 'nick = British slang for steal.\nwake up to the danger = become aware of a risk previously ignored.\nhands off = strong "don’t touch".\nmoney washing around = large amounts of money circulating in a sector.', source: src('giants', 6) },
    { id: 'fc-eng-tg-12', chapterId: 'eng-techgiants', examRelevant: true, front: 'Challenging lexis: scrape content, mooted, coffers, impunity', back: 'scrape content = extract large amounts of data from websites.\nmooted = suggested/proposed but not yet decided.\ncoffers = supply of money (company/government).\nimpunity = freedom from punishment.', source: src('giants', 6) },
    { id: 'fc-eng-tg-13', chapterId: 'eng-techgiants', examRelevant: false, front: 'Challenging lexis: placate, voracious, forswear, facsimiles, patrons', back: 'placate = calm someone down.\nvoracious = having an insatiable appetite.\nforswear = give up / renounce.\nfacsimiles = exact copies.\npatrons = customers (bar, restaurant, public place).', source: src('giants', 6) },

    // ---------- 6. IT in Business ----------
    { id: 'fc-eng-bu-1', chapterId: 'eng-business', examRelevant: true, front: 'CRM vs ERP', back: 'CRM (Customer Relationship Management): manages interactions with current and potential customers (Salesforce, HubSpot, Zoho CRM).\nERP (Enterprise Resource Planning): integrates core processes — accounting, supply chain, HR — into a single system (SAP, Oracle, Microsoft Dynamics).', source: src('business', 3) },
    { id: 'fc-eng-bu-2', chapterId: 'eng-business', examRelevant: true, front: 'What is RPA and what is it used for?', back: 'Robotic process automation: software that completes repetitive tasks without human intervention, e.g. data entry or invoice processing. Frees human workers for creative, problem-solving tasks.', source: src('business', 1) },
    { id: 'fc-eng-bu-3', chapterId: 'eng-business', examRelevant: true, front: 'Business Intelligence (BI) vs Data analytics', back: 'Data analytics: statistical techniques to derive insights from data (Google Analytics, Tableau, Power BI).\nBI: analyses internal + external data and presents actionable information in reports, dashboards, visualisations for decision-makers (Power BI, Tableau, Qlik).', source: src('business', 2) },
    { id: 'fc-eng-bu-4', chapterId: 'eng-business', examRelevant: true, front: 'Business collocations from the IT in Business text (complete): ___ operations / ___ costs / ___ productivity / gain a competitive ___', back: 'streamline operations / reduce costs / enhance productivity / gain a competitive edge\n(also: data-driven decision-making, seamless communication, real-time insights)', source: src('business', 1) },
    { id: 'fc-eng-bu-5', chapterId: 'eng-business', examRelevant: true, front: 'E-commerce: definition and what IT handles', back: 'Buying and selling goods and services over the internet. IT handles online payment processing, inventory management and AI product recommendations based on browsing history (Amazon, Shopify, eBay).', source: src('business', 1) },
    { id: 'fc-eng-bu-6', chapterId: 'eng-business', examRelevant: false, front: 'Mobile apps & AI in business: key phrases', back: 'Mobile apps: improve customer engagement, provide a seamless user experience, personalised product recommendations.\nAI: chatbots, recommendation systems, fraud detection, predictive analytics (forecast market trends and customer behaviour).', source: src('business', 3) },
    { id: 'fc-eng-bu-7', chapterId: 'eng-business', examRelevant: false, front: 'What does "data-driven decision-making" mean?', back: 'Making business decisions based on collected and analysed data instead of intuition; it helps companies become more agile and responsive to market changes.', source: src('business', 2) },

    // ---------- 7. Cloud & SDLC ----------
    { id: 'fc-eng-4', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'Difference between IaaS, PaaS, and SaaS?', back: '• IaaS (Infrastructure as a Service): virtualised hardware/servers/storage.\n• PaaS (Platform as a Service): platform & runtime for developers to build/deploy apps.\n• SaaS (Software as a Service): finished software accessed via browser, maintained by the provider.', source: src('cloud', 3) },
    { id: 'fc-eng-2', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'SDLC Idiom: What does "bells and whistles" mean? (German equivalent?)', back: 'Extra, non-essential features.\nGerman: „Schnickschnack“ / „Extras“.', source: src('sdlc', 2) },
    { id: 'fc-eng-3', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'SDLC Idiom: "laying the groundwork" & "merged to production"', back: '• laying the groundwork = establishing the foundation for success (den Grundstein legen)\n• merged to production = integrating code into a live system (in den Produktivbetrieb überführt)', source: src('sdlc', 2) },
    { id: 'fc-eng-cs-1', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'Cloud deployment models (3) with an example use', back: 'Public cloud: shared provider infrastructure (AWS, Azure, Google Cloud).\nPrivate cloud: infrastructure used by one organisation only (e.g. a bank).\nHybrid cloud: combination, e.g. sensitive data private, web front-end public.', source: src('cloud', 3) },
    { id: 'fc-eng-cs-2', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'Cloud vs on-premise: compare "in terms of" scalability, maintenance, data recovery, security', back: 'Scalability: cloud scales up/down quickly; on-premise needs new hardware.\nMaintenance: cloud maintained by the provider; on-premise by your own IT team.\nData recovery: cloud offers backups/redundancy.\nSecurity: on-premise = full control; cloud = privacy/leak concerns, provider dependency.', source: src('cloud', 3) },
    { id: 'fc-eng-cs-3', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'Cloud opinions: Olivia, Max, Ella, Jack — who thinks what?', back: 'Olivia: loves it — access documents anywhere (saved her presentation).\nMax: not a fan — security concerns, friend’s photos leaked.\nElla: on the fence — convenient, but privacy and server downtime.\nJack: a game changer — collaborates seamlessly with his team as an entrepreneur.', source: src('cloud', 1) },
    { id: 'fc-eng-cs-4', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'SDLC idioms: "staying on track", "on the right path", "a roadmap / a blueprint"', back: 'staying on track = remaining aligned with goals or schedules.\non the right path = progressing in the correct direction.\na roadmap for developers / a blueprint to follow = a detailed plan or guide.', source: src('sdlc', 2) },
    { id: 'fc-eng-cs-5', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'SDLC idioms: "breaking down the process", "digging into the requirements", "unraveling the stages"', back: 'breaking down the process = dividing a complex topic into smaller, manageable parts.\ndigging into = examining something thoroughly.\nunraveling = exploring or explaining step by step.', source: src('sdlc', 2) },
    { id: 'fc-eng-cs-6', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'SDLC idioms: "catering to requirements", "crafting dependable solutions", "thorough testing"', back: 'catering to requirements = adjusting to meet specific needs.\ncrafting dependable solutions = creating reliable solutions with care, like an artisan.\nthorough testing = comprehensive, detailed testing to ensure quality.', source: src('sdlc', 2) },
    { id: 'fc-eng-cs-7', chapterId: 'eng-cloud-sdlc', examRelevant: true, front: 'SDLC idioms: "shaking up the process", "stand out in the digital world", "demystifying"', back: 'shaking up the process = disrupting or bringing significant changes.\nstand out in the digital world = be distinctive or exceptional in a competitive field.\ndemystifying = making something easier to understand.', source: src('sdlc', 2) },
    { id: 'fc-eng-cs-8', chapterId: 'eng-cloud-sdlc', examRelevant: false, front: 'SDLC: name typical phases (general knowledge, not in the local PDF)', back: 'Planning → requirements analysis → design → development (coding) → testing → deployment → maintenance.\nAgile = iterative, short sprints; Waterfall = sequential phases.' },

    // ---------- 8. Cybersecurity & Hacking ----------
    { id: 'fc-eng-cy-1', chapterId: 'eng-cyber', examRelevant: true, front: 'Definition of cybersecurity (IT in Business text) + 3 security measures', back: 'Protecting computer systems, networks and data from unauthorized access, theft or damage.\nMeasures: firewalls, encryption, multi-factor authentication. Tools: antivirus software, intrusion detection systems (IDS).', source: src('business', 2) },
    { id: 'fc-eng-cy-2', chapterId: 'eng-cyber', examRelevant: true, front: 'phishing vs ransomware', back: 'Phishing: fake emails/websites trick people into revealing passwords or data.\nRansomware: malware that encrypts files and demands a ransom for the key.' },
    { id: 'fc-eng-cy-3', chapterId: 'eng-cyber', examRelevant: true, front: 'data breach vs data leak; social engineering', back: 'Data breach: an incident in which unauthorised people access confidential data.\nData leak: data is exposed (often accidentally).\nSocial engineering: manipulating people (not systems) to give access or information.' },
    { id: 'fc-eng-cy-4', chapterId: 'eng-cyber', examRelevant: true, front: 'zero-day vulnerability; to patch', back: 'Zero-day: a security flaw unknown to the vendor, so no fix exists yet.\nto patch a vulnerability = to fix it with a software update.' },
    { id: 'fc-eng-cy-5', chapterId: 'eng-cyber', examRelevant: false, front: 'white hat / black hat / penetration testing / bug bounty', back: 'White hat (ethical hacker): authorised to find weaknesses.\nBlack hat: criminal hacker.\nPenetration testing: authorised simulated attack.\nBug bounty: reward for reporting vulnerabilities.' },
    { id: 'fc-eng-cy-6', chapterId: 'eng-cyber', examRelevant: false, front: 'DDoS attack & brute-force attack', back: 'DDoS (distributed denial of service): many machines flood a service with traffic so it goes offline.\nBrute-force attack: trying many passwords until one works.' },
    { id: 'fc-eng-cy-7', chapterId: 'eng-cyber', examRelevant: false, front: 'Hacking task: 4 questions to evaluate a news source', back: 'Why did you choose this? What makes it unique? How is it relevant to the class? How highly do you rate this source of information and why?', source: src('hacking', 1) },

    // ---------- 9. Sustainability & Careers ----------
    { id: 'fc-eng-6', chapterId: 'eng-sustain-careers', examRelevant: true, front: 'Explain the IT sustainability terms: "e-waste", "digital divide", "carbon footprint".', back: '• e-waste: discarded electronic devices/hardware.\n• digital divide: gap between people who have access to modern IT/internet and those who do not.\n• carbon footprint: total greenhouse gas emissions caused by a device, company or data centre.', source: src('sustain', 2) },
    { id: 'fc-eng-su-1', chapterId: 'eng-sustain-careers', examRelevant: true, front: 'Which 4 UN SDGs does the handout call directly IT-relevant?', back: 'SDG 9 – Industry, Innovation and Infrastructure\nSDG 11 – Sustainable Cities\nSDG 12 – Responsible Consumption and Production\nSDG 13 – Climate Action', source: src('sustain', 1) },
    { id: 'fc-eng-su-2', chapterId: 'eng-sustain-careers', examRelevant: false, front: 'green computing, energy-efficient, sustainable design, responsible innovation', back: 'green computing = using IT in an environmentally friendly way (efficient hardware, less energy).\nenergy-efficient = uses little energy for the same output.\nsustainable design = products designed for long life, repair, recycling.\nresponsible innovation = developing technology while considering its social and environmental impact.', source: src('sustain', 2) },
    { id: 'fc-eng-su-3', chapterId: 'eng-sustain-careers', examRelevant: false, front: 'Sustainability at four levels — which?', back: 'Individuals (IT students, developers, users) • Companies (Big Tech, start-ups, software firms) • Society (education, access, jobs, inequality) • Governments (policy, regulation, digital infrastructure).', source: src('sustain', 2) },
    { id: 'fc-eng-su-4', chapterId: 'eng-sustain-careers', examRelevant: false, front: 'Careers: what does "future-proof yourself" mean, and which questions did the session discuss?', back: 'Prepare your skills/career so it stays relevant despite change (e.g. AI, automation).\nQuestions: fastest-growing IT sectors, effect of AI/automation on jobs, important (soft) skills, emerging roles, how regions prepare their workforce, roles to avoid.', source: src('careers', 1) }
  ],
  quizzes: [
    // ---------- 1. Email ----------
    { id: 'q-eng-gpas', chapterId: 'eng-email', examStyle: 'Exam Email Checklist', question: 'Which statement violates the official "Checklist for writing semi-formal E-Mails for exams"?', options: ['Use 1 short paragraph (2–3 lines) per point with white space.', 'Start the email with just the recipient’s first name (e.g. "Steve,") and add a friendly smiley.', 'Use indirect questions when making an enquiry.', 'Spend about 10% of your time on a rough draft with key lexis.'], answer: 1, explanation: 'Point 2 says not to begin with a name like "Steve" and "Never use emoticons." Use "Hello Rob," or "Dear Ms Smith,". All other options are taken directly from the checklist.', source: src('email', 1) },
    { id: 'q-eng-em-1', chapterId: 'eng-email', examStyle: 'Exam Email Checklist', question: 'You have 40 minutes for the email. Following the time allocation, how long should you spend actually writing?', options: ['20 minutes', '28 minutes', '32 minutes', '36 minutes'], answer: 2, explanation: '80% of 40 min = 32 min. The rest: 5% (2 min) reading the task, 10% (4 min) rough draft, 5% (2 min) proofreading. 36 min would leave no time for the draft.', source: src('email', 1) },
    { id: 'q-eng-em-2', chapterId: 'eng-email', examStyle: 'Exam Email Checklist', question: 'Which element is NOT required in the exam email?', options: ['A subject line', 'A sentence referring to the email you are replying to', 'A sentence mentioning the attachment (if the task asks for one)', 'A polite closing before your name'], answer: 0, explanation: 'Point 4: "You don’t need a subject line … you are expected to write the body of the email." References (point 7), attachment sentences (point 8) and a polite goodbye (point 1) are required.', source: src('email', 1) },
    { id: 'q-eng-em-3', chapterId: 'eng-email', examStyle: 'Register', question: 'You reply to Ms Sarah Miller, a team lead you have not met. Which opening is best?', options: ['Hey Sarah!', 'Sarah,', 'Dear Ms Miller,', 'Dear Ms Sarah,'], answer: 2, explanation: 'Semi-formal + unknown senior person → "Dear Ms + surname". "Hey" is too friendly, a bare name is explicitly forbidden, and title + first name ("Ms Sarah") is incorrect.', source: src('email', 1) },
    { id: 'q-eng-em-4', chapterId: 'eng-email', examStyle: 'Exam Email Checklist', question: 'The task lists three points. Your draft has 6 lines on point 1, 1 line on point 2 and 3 lines on point 3. What does the checklist say?', options: ['Fine — the most important point deserves the most space.', 'Write about all points equally, 1 paragraph per point.', 'Merge points 2 and 3 into one paragraph to save time.', 'Put point 2 into the subject line.'], answer: 1, explanation: 'Point 6: "keep your mail structured so that you write about all the points equally"; point 3: "1 paragraph per point is enough". Unequal coverage loses marks.', source: src('email', 1) },
    { id: 'q-eng-em-5', chapterId: 'eng-email', examStyle: 'Email template', question: 'In the email template, what comes directly after Point 3?', options: ['Signing off', 'Summary / Closing sentence', 'Opening sentences', 'Your name'], answer: 1, explanation: 'Template p. 2: Greeting → Opening sentences → Point 1–3 → Summary / Closing sentence → Signing off → Your name.', source: src('email', 2) },
    { id: 'q-eng-em-6', chapterId: 'eng-email', examStyle: 'Exam rules', question: 'According to the course page, what is required to be admitted to the exam?', options: ['Submitting three practice emails', 'Posting in every forum', 'Passing the Week 4 mock listening test', 'Attending 5+ online conferences'], answer: 3, explanation: 'Course page: "REQUIREMENT: attending 5 + online conferences to be allowed to take the exam".', source: src('course') },

    // ---------- 2. Phrase bank ----------
    { id: 'q-eng-indirect', chapterId: 'eng-phrasebank', examStyle: 'Grammar & Register', question: 'Which indirect question is grammatically CORRECT for a semi-formal email?', options: ['Could you tell me where is the API documentation?', 'I would like to know if can we reschedule the sprint review.', 'Could you please let me know when the new release will be deployed?', 'Please tell me what does the error message mean?'], answer: 2, explanation: 'In indirect questions the embedded clause uses statement word order (subject + verb: "when the new release will be deployed"), NOT inverted question order.', source: src('email', 1) },
    { id: 'q-eng-pb-1', chapterId: 'eng-phrasebank', examStyle: 'Indirect questions', question: 'Make the question indirect: "When did the outage start?"', options: ['Could you tell me when did the outage start?', 'Could you tell me when the outage started?', 'Could you tell me when the outage start?', 'Could you tell me when started the outage?'], answer: 1, explanation: '"did" disappears and the main verb takes the past form: "when the outage started". Keeping "did" or forgetting the past tense are typical mistakes.' },
    { id: 'q-eng-pb-2', chapterId: 'eng-phrasebank', examStyle: 'Indirect questions', question: 'Which is the correct indirect version of "Is the database backed up every night?"', options: ['I was wondering whether the database is backed up every night.', 'I was wondering is the database backed up every night.', 'I was wondering whether is the database backed up every night?', 'I was wondering that the database is backed up every night.'], answer: 0, explanation: 'Yes/no questions need if/whether + statement order. A statement stem ("I was wondering …") ends with a full stop. "that" cannot introduce a question.' },
    { id: 'q-eng-pb-3', chapterId: 'eng-phrasebank', examStyle: 'Linking words (gap fill)', question: 'Cloud storage is very convenient. ______, some users worry about data privacy.', options: ['Furthermore', 'Therefore', 'However', 'For example'], answer: 2, explanation: 'The second sentence contrasts with the first → "However". "Furthermore" adds, "Therefore" shows a result, "For example" introduces an example.', source: src('cloud', 1) },
    { id: 'q-eng-pb-4', chapterId: 'eng-phrasebank', examStyle: 'Linking words (gap fill)', question: 'The release was postponed ______ a critical security bug.', options: ['because', 'due to', 'although', 'therefore'], answer: 1, explanation: '"due to" (or "because of") is followed by a NOUN phrase. "because" needs a clause (because we found a bug), "although" shows contrast, "therefore" shows result.' },
    { id: 'q-eng-pb-5', chapterId: 'eng-phrasebank', examStyle: 'Closing phrases', question: 'Which closing sentence is correct?', options: ['I look forward to hear from you.', 'I am looking forward to hear from you.', 'I look forward to hearing from you.', 'I look forward hearing from you.'], answer: 2, explanation: '"look forward to" + -ing ("to" is a preposition). Both "to hear" versions are the classic German-speaker mistake; leaving out "to" is wrong too.' },
    { id: 'q-eng-pb-6', chapterId: 'eng-phrasebank', examStyle: 'Phrase bank', question: 'Which phrase is best to introduce a risk in a proposal (Robots handout language focus)?', options: ['A possible drawback is that the robot needs constant maintenance.', 'The robot is bad because it is bad.', 'Robots are dangerous, lol.', 'It is the risk that robots maybe making problems.'], answer: 0, explanation: 'Robots p. 2 lists "A possible drawback is …" as a phrase for precise discussion of benefits and risks. The other options are vague, too informal or ungrammatical.', source: src('robots', 2) },
    { id: 'q-eng-pb-7', chapterId: 'eng-phrasebank', examStyle: 'Cloud phrases (gap fill)', question: '"SaaS is the model for you if you want ______ maintain your own servers."', options: ['to avoid having to', 'to avoid to have to', 'avoiding to have', 'to avoid have to'], answer: 0, explanation: 'The handout phrase is "to avoid having to": avoid + -ing. "avoid to have" is a typical German-speaker error (vermeiden zu).', source: src('cloud', 3) },
    { id: 'q-eng-pb-8', chapterId: 'eng-phrasebank', examStyle: 'Register', question: 'Which request fits a semi-formal email to a manager best?', options: ['Send me the budget figures.', 'I want the budget figures now.', 'I would be grateful if you could send me the budget figures by Friday.', 'Gimme the budget figures pls.'], answer: 2, explanation: '"I would be grateful if you could …" is polite and gives a clear deadline. Imperatives and "I want" sound rude; "gimme/pls" are slang.' },

    // ---------- 3. Mistakes ----------
    { id: 'q-eng-gm-1', chapterId: 'eng-mistakes', examStyle: 'Error correction', question: 'Which sentence is correct?', options: ['I work as a developer since 2022.', 'I have been working as a developer since 2022.', 'I am working as a developer since 2022.', 'I have been working as a developer for 2022.'], answer: 1, explanation: 'Actions continuing up to now need present perfect (continuous); "since" + point in time. "for" needs a period ("for three years").' },
    { id: 'q-eng-gm-2', chapterId: 'eng-mistakes', examStyle: 'False friends', question: 'You want to say "die aktuelle Version". Which is correct?', options: ['the actual version', 'the actually version', 'the eventual version', 'the current version'], answer: 3, explanation: 'aktuell = current/latest. "actual" means tatsächlich and "eventual" means final/schließlich — both false friends.' },
    { id: 'q-eng-gm-3', chapterId: 'eng-mistakes', examStyle: 'Error correction', question: 'Which sentence contains NO mistake?', options: ['Thank you for the useful informations.', 'Could you give me an advice?', 'Thank you for the useful information.', 'We bought new equipments.'], answer: 2, explanation: 'information, advice, equipment are uncountable — no plural -s and no "an". Say "a piece of advice".' },
    { id: 'q-eng-gm-4', chapterId: 'eng-mistakes', examStyle: 'Error correction', question: 'Your manager needs the report on Friday at the latest. Which sentence is correct?', options: ['Please send me the report until Friday.', 'Please send me the report by Friday.', 'Please send me the report till Friday.', 'Please send me the report since Friday.'], answer: 1, explanation: 'Deadline (spätestens bis) = "by". "until/till" mean continuously up to a point ("The office is closed until Friday").' },
    { id: 'q-eng-gm-5', chapterId: 'eng-mistakes', examStyle: 'Error correction', question: 'Which sentence is correct?', options: ['We should discuss about the new security policy.', 'Can you explain me the new security policy?', 'Could you explain the new security policy to me?', 'We should discuss over the new security policy.'], answer: 2, explanation: '"explain something to somebody"; "discuss" takes a direct object (no about/over).' },
    { id: 'q-eng-gm-6', chapterId: 'eng-mistakes', examStyle: 'Punctuation', question: 'Which sentence is punctuated correctly?', options: ['I think, that the cloud migration is a good idea.', 'I think that the cloud migration is a good idea.', 'I think that, the cloud migration is a good idea.', 'I think that the Cloud Migration is a good idea.'], answer: 1, explanation: 'No comma before or after "that" in English, and common nouns are not capitalised (unlike German).' },
    { id: 'q-eng-gm-7', chapterId: 'eng-mistakes', examStyle: 'False friends', question: '"Ich habe deine E-Mail bekommen." — correct translation?', options: ['I received your email.', 'I have become your email.', 'I became your email.', 'I have becomed your email.'], answer: 0, explanation: 'bekommen = get/receive; become = werden. "I became your email" means "Ich wurde deine E-Mail".' },

    // ---------- 4. AI & Robots ----------
    { id: 'q-eng-ai', chapterId: 'eng-ai-robots', examStyle: 'AI Trends & Collocations', question: 'Which term describes AI systems designed so humans can understand and trace HOW a decision was made?', options: ['Edge Computing', 'Explainable AI (XAI)', 'Narrow AI (ANI)', 'Algorithmic Trading'], answer: 1, explanation: 'Explainable AI: "the need for transparency in AI decision-making" → models that are understandable and interpretable. Edge computing is about where data is processed.', source: src('ai', 2) },
    { id: 'q-eng-ai-1', chapterId: 'eng-ai-robots', examStyle: 'Reading comprehension', question: 'According to the AI handout, which statement about General AI (AGI) is TRUE?', options: ['AGI powers today’s virtual assistants like Siri and Alexa.', 'AGI is limited to its programmed domain.', 'AGI remains a goal for future AI development and is a subject of ongoing research.', 'AGI was developed by Alan Turing in the mid-20th century.'], answer: 2, explanation: 'The text: "AGI remains a goal for future AI development and is currently a subject of ongoing research." Siri/Alexa and domain limits describe ANI; Turing only laid the theoretical foundation.', source: src('ai', 1) },
    { id: 'q-eng-ai-2', chapterId: 'eng-ai-robots', examStyle: 'Reading comprehension', question: 'Which three factors does the text give for AI thriving in the 21st century?', options: ['Cheaper robots, better sensors and 5G', 'Government funding, open source and social media', 'Alan Turing, science fiction films and smartphones', 'Computing power, data availability and algorithm development'], answer: 3, explanation: '"Advancements in computing power, data availability, and algorithm development have propelled AI into the forefront of technology."', source: src('ai', 1) },
    { id: 'q-eng-ai-3', chapterId: 'eng-ai-robots', examStyle: 'Vocabulary', question: '"AI is moving closer to the source of data, allowing real-time processing on devices like smartphones and IoT devices." Which trend is this?', options: ['Explainable AI', 'Ethical AI', 'AI in edge computing', 'AI in natural language processing'], answer: 2, explanation: 'This is the handout’s exact description of AI in edge computing (processing at the "edge", on the device).', source: src('ai', 2) },
    { id: 'q-eng-ai-4', chapterId: 'eng-ai-robots', examStyle: 'Spelling (UK vs US)', question: 'Which set is consistently BRITISH spelling?', options: ['personalized, analyse, data center', 'personalised, analyse, data centre', 'personalised, analyze, data centre', 'personalized, analyze, data center'], answer: 1, explanation: 'UK: -ise, -yse, -re (personalised, analyse, centre). Option D is consistently American; A and C mix both — exactly what you should avoid.', source: src('ai', 6) },
    { id: 'q-eng-ai-5', chapterId: 'eng-ai-robots', examStyle: 'Vocabulary (Robots)', question: 'Which component "converts energy into movement or mechanical action"?', options: ['Sensor', 'Cobot', 'Computer vision', 'Actuator'], answer: 3, explanation: 'Robots glossary: actuator = converts energy into movement. A sensor detects/measures; computer vision interprets images; a cobot is a whole robot.', source: src('robots', 1) },
    { id: 'q-eng-ai-6', chapterId: 'eng-ai-robots', examStyle: 'Vocabulary (Robots)', question: 'A robot arm assembles parts next to factory workers, with safety features so it can share their workspace. What is it called?', options: ['A humanoid robot', 'A service robot', 'A collaborative robot (cobot)', 'An autonomous vehicle'], answer: 2, explanation: 'Cobot = "a robot designed to work alongside people, with suitable safety measures" (e.g. Universal Robots UR series). It is not human-shaped (humanoid) and is used in industry (not a service robot).', source: src('robots', 1) },
    { id: 'q-eng-ai-7', chapterId: 'eng-ai-robots', examStyle: 'Word families', question: 'Complete: "The ______ of the new app took six months, and every ______ on the team learned a lot."', options: ['develop / development', 'development / developer', 'developing / develop', 'developer / development'], answer: 1, explanation: 'Noun for the process = development; noun for the person = developer (AI handout Task 7 word family).', source: src('ai', 6) },
    { id: 'q-eng-ai-8', chapterId: 'eng-ai-robots', examStyle: 'Reading comprehension', question: 'In finance, which AI applications does the handout list?', options: ['Algorithmic trading, fraud detection and risk assessment', 'Drug discovery and early disease detection', 'Quality control and assembly', 'Adaptive learning platforms'], answer: 0, explanation: 'Finance: "AI powers algorithmic trading, fraud detection, and risk assessment." The others are healthcare, manufacturing and education.', source: src('ai', 1) },

    // ---------- 5. Tech giants ----------
    { id: 'q-eng-tg-1', chapterId: 'eng-techgiants', examStyle: 'Idioms (gap fill)', question: 'AWS generates steady, significant profits for Amazon every year. AWS is Amazon’s ______.', options: ['game-changer', 'cash cow', 'level playing field', 'dot-com bubble'], answer: 1, explanation: 'cash cow = "a business or product that consistently generates significant profits". A game-changer transforms an industry — not the same as reliable profit.', source: src('giants', 4) },
    { id: 'q-eng-tg-2', chapterId: 'eng-techgiants', examStyle: 'Idioms (gap fill)', question: 'Start-ups complain that big tech has too many advantages. They want ______.', options: ['a level playing field', 'to bite the bullet', 'something in the pipeline', 'to push the envelope'], answer: 0, explanation: 'a level playing field = fair competition where no one has an advantage.', source: src('giants', 4) },
    { id: 'q-eng-tg-3', chapterId: 'eng-techgiants', examStyle: 'Idioms', question: 'The new team lead started fixing problems on her first day. She ______.', options: ['bit the bullet', 'hit the ground running', 'was ahead of the curve', 'moved the goalposts'], answer: 1, explanation: 'hit the ground running = start something quickly and effectively. "bite the bullet" = face a difficult situation with courage.', source: src('giants', 4) },
    { id: 'q-eng-tg-4', chapterId: 'eng-techgiants', examStyle: 'Reading comprehension', question: 'According to Text 1, what did IBM do in the 1990s?', options: ['It bought Time Warner.', 'It nearly went bankrupt until Steve Jobs returned.', 'It launched the dial-up internet service.', 'It shifted from hardware to services.'], answer: 3, explanation: '"IBM shifted from hardware to services in the 1990s." AOL bought Time Warner and offered dial-up; Apple was close to bankruptcy.', source: src('giants', 2) },
    { id: 'q-eng-tg-5', chapterId: 'eng-techgiants', examStyle: 'Reading comprehension', question: 'According to Text 2, how did NVIDIA start?', options: ['As an online bookstore', 'As a social media company', 'With a vision to bring 3D graphics to the gaming market', 'As a dial-up internet provider'], answer: 2, explanation: '"NVIDIA which started off as a vision to bring 3D graphics to the gaming market has become a driving force in the AI world." The bookstore was Amazon.', source: src('giants', 4) },
    { id: 'q-eng-tg-6', chapterId: 'eng-techgiants', examStyle: 'Collocations', question: 'Under an "opt-out regime" for AI training data, ...', options: ['users are excluded unless they actively agree.', 'users are included by default and must actively choose to exclude themselves.', 'companies may not use any data at all.', 'only paid users are included.'], answer: 1, explanation: 'Handout definition: "a system where the default setting is inclusion, and users must actively choose to exclude themselves." Option A describes opt-in.', source: src('giants', 6) },
    { id: 'q-eng-tg-7', chapterId: 'eng-techgiants', examStyle: 'Vocabulary', question: 'A new AI law has been "mooted". This means it has been ...', options: ['rejected', 'passed and enforced', 'suggested but not yet decided', 'copied exactly'], answer: 2, explanation: 'mooted = suggested or proposed, but not yet decided. "Copied exactly" would be a facsimile.', source: src('giants', 6) },
    { id: 'q-eng-tg-8', chapterId: 'eng-techgiants', examStyle: 'Reading comprehension', question: 'Why did the dot-com bubble burst in 2000, according to Text 1?', options: ['Many start-ups lacked sustainable business models.', 'Governments banned internet start-ups.', 'Google took over all competitors.', 'Dial-up internet stopped working.'], answer: 0, explanation: '"many of these companies lacked sustainable business models, leading to the eventual bursting of the bubble in 2000."', source: src('giants', 2) },

    // ---------- 6. IT in Business ----------
    { id: 'q-eng-bu-1', chapterId: 'eng-business', examStyle: 'Reading comprehension', question: 'A company wants ONE system that integrates accounting, supply chain management and human resources. What does it need?', options: ['A CRM system', 'An ERP system', 'A BI dashboard', 'An e-commerce platform'], answer: 1, explanation: 'ERP "help[s] businesses manage core processes like accounting, supply chain management, and human resources" in a single system. CRM is about customers.', source: src('business', 3) },
    { id: 'q-eng-bu-2', chapterId: 'eng-business', examStyle: 'Reading comprehension', question: 'Which example of automation does the text give for banks?', options: ['Designing marketing campaigns', 'Assembling products on production lines', 'Writing mobile apps', 'Approving loans and processing payments'], answer: 3, explanation: '"banks often use automation to handle routine tasks such as approving loans or processing payments." Production lines are the manufacturing example.', source: src('business', 1) },
    { id: 'q-eng-bu-3', chapterId: 'eng-business', examStyle: 'Collocations', question: 'Digital tools help businesses to ______ operations, reduce costs and enhance productivity.', options: ['streamline', 'stream', 'straighten', 'strengthen up'], answer: 0, explanation: 'The fixed collocation from the text is "streamline operations" (make processes simpler and more efficient).', source: src('business', 1) },
    { id: 'q-eng-bu-4', chapterId: 'eng-business', examStyle: 'Vocabulary', question: 'Which tools present "actionable information" in reports and dashboards for executives?', options: ['BI platforms like Power BI, Tableau and Qlik', 'CRM tools like HubSpot', 'ERP systems like SAP', 'Firewalls and IDS'], answer: 0, explanation: 'Business Intelligence = analyse data and present actionable information in reports, dashboards or visualisations (Power BI, Tableau, Qlik).', source: src('business', 3) },

    // ---------- 7. Cloud & SDLC ----------
    { id: 'q-eng-cloud', chapterId: 'eng-cloud-sdlc', examStyle: 'Cloud Computing', question: 'A start-up wants ready-to-use email and document collaboration tools in the browser without managing servers or software updates. Which cloud model fits best?', options: ['IaaS (Infrastructure as a Service)', 'PaaS (Platform as a Service)', 'SaaS (Software as a Service)', 'On-premise bare metal'], answer: 2, explanation: 'SaaS delivers complete, provider-maintained applications to end users over the internet. IaaS/PaaS still require you to run your own software.', source: src('cloud', 3) },
    { id: 'q-eng-idiom', chapterId: 'eng-cloud-sdlc', examStyle: 'SDLC Vocabulary', question: 'In software engineering, what does "shaking up the process" mean?', options: ['Deleting the database accidentally', 'Disrupting or bringing significant changes', 'Compiling code without warnings', 'Adding unnecessary visual animations'], answer: 1, explanation: 'SDLC idiom table: "Shaking up the process" = disrupting or bringing significant changes. Unnecessary extras would be "bells and whistles".', source: src('sdlc', 2) },
    { id: 'q-eng-cs-1', chapterId: 'eng-cloud-sdlc', examStyle: 'Reading comprehension', question: 'Which speaker is "on the fence" about cloud computing?', options: ['Olivia', 'Max', 'Ella', 'Jack'], answer: 2, explanation: 'Ella: "I’m on the fence … On one hand … on the other hand …" (undecided). Olivia loves it, Max is not a fan, Jack calls it a game changer.', source: src('cloud', 1) },
    { id: 'q-eng-cs-2', chapterId: 'eng-cloud-sdlc', examStyle: 'SDLC idioms (gap fill)', question: 'We postponed the animations and dark mode — they are just ______ — so we could deliver the core features on time.', options: ['bells and whistles', 'a blueprint', 'thorough testing', 'merged to production'], answer: 0, explanation: 'bells and whistles = extra, non-essential features.', source: src('sdlc', 2) },
    { id: 'q-eng-cs-3', chapterId: 'eng-cloud-sdlc', examStyle: 'SDLC idioms (gap fill)', question: 'Weekly stand-ups help the team ______ and meet the deadline.', options: ['lay the groundwork', 'shake up the process', 'demystify', 'stay on track'], answer: 3, explanation: 'staying on track = remaining aligned with goals or schedules.', source: src('sdlc', 2) },
    { id: 'q-eng-cs-4', chapterId: 'eng-cloud-sdlc', examStyle: 'Cloud phrases', question: 'Which sentence uses the handout phrase "in terms of" correctly?', options: ['In terms of scalability, the cloud is more flexible than on-premise servers.', 'In terms that scalability, the cloud is more flexible.', 'In term of scalability the cloud are more flexible.', 'In terms scalability, the cloud is flexible.'], answer: 0, explanation: '"in terms of" + noun = regarding/with respect to (Cloud p. 3 Task 2). Note plural "terms" and "of".', source: src('cloud', 3) },
    { id: 'q-eng-cs-5', chapterId: 'eng-cloud-sdlc', examStyle: 'SDLC idioms', question: '"Catering to requirements" means ...', options: ['ignoring customer wishes', 'adjusting to meet specific needs or demands', 'ordering food for the team', 'writing the requirements document'], answer: 1, explanation: 'Idiom table: catering to requirements = adjusting to meet specific needs or demands (not the literal food meaning).', source: src('sdlc', 2) },

    // ---------- 8. Cybersecurity ----------
    { id: 'q-eng-cy-1', chapterId: 'eng-cyber', examStyle: 'Reading comprehension', question: 'Which security measures are named in the IT in Business text?', options: ['Firewalls, encryption and multi-factor authentication', 'Bug bounties, CAPTCHAs and VPNs', 'Backups, RAID and UPS', 'Penetration testing only'], answer: 0, explanation: '"This includes implementing security measures like firewalls, encryption, and multi-factor authentication." Tools: antivirus, IDS, firewalls.', source: src('business', 2) },
    { id: 'q-eng-cy-2', chapterId: 'eng-cyber', examStyle: 'Vocabulary', question: 'Employees receive a fake "IT support" email asking them to enter their password on a website. What is this?', options: ['Ransomware', 'A DDoS attack', 'Penetration testing', 'Phishing'], answer: 3, explanation: 'Phishing tricks people into revealing credentials. Ransomware encrypts data; DDoS floods a service; penetration testing is an authorised test.' },
    { id: 'q-eng-cy-3', chapterId: 'eng-cyber', examStyle: 'Vocabulary', question: 'A security flaw is exploited before the vendor knows about it, so no patch exists. This is a ...', options: ['zero-day vulnerability', 'data backup', 'firewall rule', 'white hat'], answer: 0, explanation: 'Zero-day = the vendor has had "zero days" to fix it. A white hat is an ethical hacker.' },

    // ---------- 9. Sustainability & Careers ----------
    { id: 'q-eng-su-1', chapterId: 'eng-sustain-careers', examStyle: 'Vocabulary', question: 'Old laptops and smartphones thrown away by a company are called ...', options: ['carbon footprint', 'digital divide', 'green computing', 'e-waste'], answer: 3, explanation: 'e-waste = discarded electronic devices. Carbon footprint = emissions; digital divide = gap in access to IT.', source: src('sustain', 2) },
    { id: 'q-eng-su-2', chapterId: 'eng-sustain-careers', examStyle: 'Reading comprehension', question: 'Which SDG is "Climate Action"?', options: ['SDG 9', 'SDG 11', 'SDG 12', 'SDG 13'], answer: 3, explanation: 'Handout p. 1: SDG 9 Industry, Innovation and Infrastructure; SDG 11 Sustainable Cities; SDG 12 Responsible Consumption and Production; SDG 13 Climate Action.', source: src('sustain', 1) },
    { id: 'q-eng-su-3', chapterId: 'eng-sustain-careers', examStyle: 'Vocabulary', question: 'Rural pupils without fast internet cannot use online learning platforms. This illustrates ...', options: ['the digital divide', 'responsible innovation', 'energy efficiency', 'the hardware lifecycle'], answer: 0, explanation: 'Digital divide = the gap between people who have access to modern IT/internet and those who do not.', source: src('sustain', 2) }
  ],
  emailPrompts: [
    {
      id: 'ep-1',
      title: 'IT Project Delay & Cloud Migration',
      scenario: 'Your team lead, Ms Sarah Miller, emailed you asking for an update on migrating the company’s customer portal to a SaaS/PaaS cloud architecture. Write a semi-formal reply (practice length 120–180 words) covering:\n1. Acknowledge her email and state your purpose.\n2. Explain one technical advantage (scalability / data recovery) and one security concern you are addressing.\n3. Ask politely (indirect question) whether the deadline can be extended by one week and mention an attached roadmap.',
      keywords: ['scalability', 'cloud', 'security', 'attached', 'deadline', 'could you']
    },
    {
      id: 'ep-2',
      title: 'AI Tool Proposal & Sustainability',
      scenario: 'Your department manager, Mr Robert Klein, asked for ideas on using AI responsibly in your software team. Write a semi-formal email (practice length 120–180 words) covering:\n1. Reference his request and propose one Narrow AI tool for your SDLC (e.g. automated testing or code review).\n2. Address ethical AI / data privacy and carbon footprint concerns.\n3. Suggest a short meeting next week to discuss next steps.',
      keywords: ['ethical', 'privacy', 'carbon footprint', 'narrow ai', 'meeting', 'regards']
    },
    {
      id: 'ep-3',
      title: 'Phishing Incident Report',
      scenario: 'Your IT security officer, Ms Anna Weber, wrote to all staff: "Several colleagues received suspicious emails yesterday. Please tell me if you received one and what you did." You received a phishing email asking for your password. Write a semi-formal reply (practice length 120–180 words):\n1. Refer to her email and explain what you received and how you recognised it as phishing.\n2. Describe what you did (did not click, reported it) and attach a screenshot.\n3. Ask (indirect question) whether the company plans security awareness training or multi-factor authentication.',
      keywords: ['phishing', 'password', 'attached', 'multi-factor authentication', 'training', 'in your email']
    },
    {
      id: 'ep-4',
      title: 'Works Council Robot Proposal',
      scenario: 'Mr Jonas Becker from the works council asked employees for ideas on introducing ONE robotic service with a limited budget. Write a semi-formal email (practice length 120–180 words):\n1. State your purpose and the problem you want to solve.\n2. Describe the robot (e.g. a cobot or warehouse robot), two benefits and one risk with how to reduce it.\n3. Explain how success could be measured and offer to present your idea at the next meeting.',
      keywords: ['cobot', 'one potential benefit', 'drawback', 'safety', 'measure', 'meeting']
    },
    {
      id: 'ep-5',
      title: 'Request for Cloud Certification Training',
      scenario: 'Your manager, Ms Laura Chen, emailed the team: "We have some training budget left this year. Let me know which course you would like to take." Write a semi-formal reply (practice length 120–180 words):\n1. Thank her and name a course (e.g. AWS or Azure cloud certification).\n2. Explain how the skills will help the team (e.g. scalability, cost reduction, staying ahead of the curve).\n3. Ask politely whether the course could be done during working hours and attach the course description.',
      keywords: ['training', 'certification', 'cloud', 'skills', 'attached', 'whether']
    },
    {
      id: 'ep-6',
      title: 'Client Wants Extra Features Before Launch',
      scenario: 'A client, Mr David Turner, wrote: "Could your team add a chat function and animated dashboards before the launch next month?" Your team is already close to the deadline. Write a semi-formal reply (practice length 120–180 words):\n1. Refer to his email and thank him for the ideas.\n2. Explain that adding these "bells and whistles" now would put the deadline at risk; the core features are being thoroughly tested.\n3. Suggest adding the features in a second release and ask when he would be available for a short call.',
      keywords: ['bells and whistles', 'deadline', 'testing', 'release', 'unfortunately', 'look forward to hearing']
    },
    {
      id: 'ep-7',
      title: 'Green IT Initiative',
      scenario: 'The head of IT, Ms Petra Hoffmann, asked staff for suggestions on how the department can become more sustainable. Write a semi-formal email (practice length 120–180 words):\n1. Reference her request and state your purpose.\n2. Suggest two measures (e.g. energy-efficient hardware, extending the hardware lifecycle, recycling e-waste, green computing in the data centre).\n3. Mention one challenge (e.g. cost) and ask whether a small budget could be made available.',
      keywords: ['energy-efficient', 'e-waste', 'carbon footprint', 'lifecycle', 'however', 'budget']
    },
    {
      id: 'ep-8',
      title: 'Choosing a CRM System',
      scenario: 'Your colleague from sales, Mr Tom Fischer, emailed you: "We keep losing track of customer contacts. Do you think IT could help?" Write a semi-formal reply (practice length 120–180 words):\n1. Refer to his email and recommend introducing a CRM system (e.g. Salesforce or HubSpot).\n2. Explain two advantages (e.g. track customer interactions, tailor marketing campaigns, manage the sales pipeline).\n3. Ask (indirect question) how many users would need access and suggest a demo meeting.',
      keywords: ['crm', 'customer', 'sales pipeline', 'furthermore', 'demo', 'could you let me know']
    },
    {
      id: 'ep-9',
      title: 'Cloud Outage Complaint Reply',
      scenario: 'A customer, Ms Emily Brown, complained: "Your cloud storage service was down for six hours yesterday and I could not access my documents." You work in customer support. Write a semi-formal reply (practice length 120–180 words):\n1. Thank her for her email and apologise for the inconvenience.\n2. Explain briefly what happened (server outage) and what has been done (e.g. backup servers, data recovery).\n3. Offer compensation (e.g. one month free) and ask whether all her files are now accessible.',
      keywords: ['apologise', 'outage', 'data recovery', 'unfortunately', 'whether', 'kind regards']
    },
    {
      id: 'ep-10',
      title: 'Job Interview Invitation',
      scenario: 'Ms Hannah Wright, an HR manager at a software company, invited you to a job interview for a junior developer position next Tuesday at 10 a.m. Write a semi-formal reply (practice length 120–180 words):\n1. Thank her for the invitation and confirm your interest.\n2. Explain that you cannot attend at that time (give a reason) and suggest two alternative times.\n3. Ask (indirect question) whether the interview will include a technical test and what you should prepare; mention your attached updated CV.',
      keywords: ['interview', 'unfortunately', 'alternative', 'whether', 'attached', 'look forward to hearing']
    },
    {
      id: 'ep-11',
      title: 'Generative AI & Company Data',
      scenario: 'Your manager, Mr Ali Khan, read a Guardian article about AI companies using training data and wrote: "Should we allow our staff to use generative AI tools with customer data?" Write a semi-formal reply (practice length 120–180 words):\n1. Refer to his email and state your opinion.\n2. Give one benefit (e.g. productivity) and one risk (e.g. data privacy, copyright, opt-out regimes).\n3. Recommend a clear company policy and offer to draft guidelines by the end of the month.',
      keywords: ['generative ai', 'training data', 'privacy', 'copyright', 'policy', 'by the end of']
    }
  ]
};
