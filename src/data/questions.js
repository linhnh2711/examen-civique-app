export const questionsDB = {
  CSP: [
    // PRINCIPES ET VALEURS DE LA RÉPUBLIQUE (12 câu)
    {
      id: 1,
      category: "Principes et valeurs",
      question: "À quoi correspond la date du 14 juillet ?",
      options: [
        "La fin de la Seconde Guerre mondiale",
        "La prise de la Bastille en 1789",
        "L'abolition de l'esclavage",
        "La signature de la Constitution"
      ],
      correct: 1,
      explanation: "Le 14 juillet commémore la prise de la Bastille le 14 juillet 1789, événement majeur de la Révolution française."
    },
    {
      id: 2,
      category: "Principes et valeurs",
      question: "Quelle est la devise de la République française ?",
      options: [
        "Travail, Famille, Patrie",
        "Liberté, Égalité, Fraternité",
        "Unité, Justice, Progrès",
        "Paix, Liberté, Solidarité"
      ],
      correct: 1,
      explanation: "La devise de la République française est 'Liberté, Égalité, Fraternité' depuis 1848."
    },
    {
      id: 3,
      category: "Principes et valeurs",
      question: "Quel est l'hymne national français ?",
      options: [
        "La Carmagnole",
        "Le Chant des Partisans",
        "La Marseillaise",
        "Aux Armes Citoyens"
      ],
      correct: 2,
      explanation: "La Marseillaise est l'hymne national de la France depuis 1795, composée par Rouget de Lisle."
    },
    {
      id: 4,
      category: "Principes et valeurs",
      question: "Quelles sont les couleurs du drapeau français ?",
      options: [
        "Rouge, blanc, vert",
        "Bleu, blanc, rouge",
        "Bleu, blanc, noir",
        "Rouge, jaune, bleu"
      ],
      correct: 1,
      explanation: "Le drapeau français est tricolore : bleu, blanc et rouge, dans cet ordre."
    },
    {
      id: 5,
      category: "Principes et valeurs",
      question: "Qu'est-ce que la laïcité ?",
      options: [
        "L'interdiction des religions",
        "La neutralité de l'État vis-à-vis des religions",
        "L'obligation d'avoir une religion",
        "Le financement des églises par l'État"
      ],
      correct: 1,
      explanation: "La laïcité est le principe de séparation entre l'État et les religions, garantissant la liberté de conscience et de culte."
    },
    {
      id: 6,
      category: "Principes et valeurs",
      question: "En quelle année la loi de séparation des Églises et de l'État a-t-elle été votée ?",
      options: [
        "1789",
        "1905",
        "1958",
        "1981"
      ],
      correct: 1,
      explanation: "La loi de séparation des Églises et de l'État a été votée le 9 décembre 1905."
    },
    {
      id: 7,
      category: "Principes et valeurs",
      question: "Que signifie 'Liberté' dans la devise républicaine ?",
      options: [
        "Faire tout ce qu'on veut",
        "La liberté d'expression et de conscience",
        "Ne pas payer d'impôts",
        "Refuser les lois"
      ],
      correct: 1,
      explanation: "La liberté comprend notamment la liberté d'expression, de conscience, de religion, dans le respect des lois."
    },
    {
      id: 8,
      category: "Principes et valeurs",
      question: "Que représente Marianne ?",
      options: [
        "La première femme présidente",
        "Un symbole de la République française",
        "Une sainte catholique",
        "La reine de France"
      ],
      correct: 1,
      explanation: "Marianne est l'allégorie de la République française, symbole de liberté et de raison."
    },
    {
      id: 9,
      category: "Principes et valeurs",
      question: "Quelle est la fête nationale française ?",
      options: [
        "Le 1er mai",
        "Le 11 novembre",
        "Le 14 juillet",
        "Le 8 mai"
      ],
      correct: 2,
      explanation: "La fête nationale française est célébrée le 14 juillet, jour de la prise de la Bastille."
    },
    {
      id: 10,
      category: "Principes et valeurs",
      question: "Qu'est-ce que la Déclaration des droits de l'homme et du citoyen ?",
      options: [
        "Un texte de 1789 sur les droits fondamentaux",
        "Une loi européenne",
        "Un traité international",
        "Une décision de justice"
      ],
      correct: 0,
      explanation: "La Déclaration des droits de l'homme et du citoyen de 1789 définit les droits fondamentaux des citoyens français."
    },
    {
      id: 11,
      category: "Principes et valeurs",
      question: "Que signifie 'Égalité' dans la devise ?",
      options: [
        "Tout le monde gagne pareil",
        "L'égalité devant la loi",
        "Interdiction de la propriété privée",
        "Uniformité des opinions"
      ],
      correct: 1,
      explanation: "L'égalité signifie que tous les citoyens sont égaux devant la loi, sans discrimination."
    },
    {
      id: 12,
      category: "Principes et valeurs",
      question: "Que signifie 'Fraternité' ?",
      options: [
        "L'obligation d'avoir des frères",
        "La solidarité entre citoyens",
        "Le service militaire",
        "Le vote obligatoire"
      ],
      correct: 1,
      explanation: "La fraternité exprime la solidarité et le lien qui unit tous les citoyens français."
    },

    // INSTITUTIONS (12 câu)
    {
      id: 13,
      category: "Système institutionnel",
      question: "Qui nomme le Premier ministre ?",
      options: [
        "Les députés",
        "Le président de la République",
        "Le Sénat",
        "Les citoyens par vote"
      ],
      correct: 1,
      explanation: "Le Premier ministre est nommé par le président de la République."
    },
    {
      id: 14,
      category: "Système institutionnel",
      question: "Pour combien de temps est élu le président de la République française ?",
      options: [
        "4 ans",
        "5 ans",
        "7 ans",
        "10 ans"
      ],
      correct: 1,
      explanation: "Le président de la République est élu pour un mandat de 5 ans (quinquennat) depuis la réforme de 2002."
    },
    {
      id: 15,
      category: "Système institutionnel",
      question: "À partir de quel âge a-t-on le droit de voter en France ?",
      options: [
        "16 ans",
        "18 ans",
        "21 ans",
        "25 ans"
      ],
      correct: 1,
      explanation: "Le droit de vote est accordé à tous les citoyens français à partir de 18 ans depuis 1974."
    },
    {
      id: 16,
      category: "Système institutionnel",
      question: "Combien y a-t-il de départements en France ?",
      options: [
        "95",
        "100",
        "101",
        "110"
      ],
      correct: 2,
      explanation: "La France compte 101 départements : 96 en métropole et 5 en outre-mer."
    },
    {
      id: 17,
      category: "Système institutionnel",
      question: "Qu'est-ce que l'Assemblée nationale ?",
      options: [
        "Le gouvernement",
        "La chambre des députés",
        "Le conseil des ministres",
        "La cour de justice"
      ],
      correct: 1,
      explanation: "L'Assemblée nationale est la chambre basse du Parlement français, composée de 577 députés élus au suffrage universel direct."
    },
    {
      id: 18,
      category: "Système institutionnel",
      question: "Quelle est la plus haute juridiction administrative en France ?",
      options: [
        "La Cour de cassation",
        "Le Conseil d'État",
        "Le Conseil constitutionnel",
        "La Cour des comptes"
      ],
      correct: 1,
      explanation: "Le Conseil d'État est la plus haute juridiction de l'ordre administratif."
    },
    {
      id: 19,
      category: "Système institutionnel",
      question: "Qui vote les lois en France ?",
      options: [
        "Le président",
        "Le gouvernement",
        "Le Parlement",
        "Les citoyens"
      ],
      correct: 2,
      explanation: "Les lois sont votées par le Parlement, composé de l'Assemblée nationale et du Sénat."
    },
    {
      id: 20,
      category: "Système institutionnel",
      question: "Quel est le rôle du Sénat ?",
      options: [
        "Nommer le président",
        "Représenter les collectivités territoriales",
        "Juger les criminels",
        "Commander l'armée"
      ],
      correct: 1,
      explanation: "Le Sénat représente les collectivités territoriales et participe au vote des lois avec l'Assemblée nationale."
    },
    {
      id: 21,
      category: "Système institutionnel",
      question: "Quelle est la durée du mandat des députés ?",
      options: [
        "3 ans",
        "5 ans",
        "6 ans",
        "9 ans"
      ],
      correct: 1,
      explanation: "Les députés sont élus pour un mandat de 5 ans."
    },
    {
      id: 22,
      category: "Système institutionnel",
      question: "Qui préside le Conseil des ministres ?",
      options: [
        "Le Premier ministre",
        "Le président de la République",
        "Le ministre de l'Intérieur",
        "Le président de l'Assemblée"
      ],
      correct: 1,
      explanation: "Le président de la République préside le Conseil des ministres."
    },
    {
      id: 23,
      category: "Système institutionnel",
      question: "Quelle institution contrôle la constitutionnalité des lois ?",
      options: [
        "Le Conseil d'État",
        "Le Conseil constitutionnel",
        "La Cour de cassation",
        "Le Parlement"
      ],
      correct: 1,
      explanation: "Le Conseil constitutionnel vérifie que les lois sont conformes à la Constitution."
    },
    {
      id: 24,
      category: "Système institutionnel",
      question: "Combien de fois maximum peut-on être élu président de la République consécutivement ?",
      options: [
        "1 fois",
        "2 fois",
        "3 fois",
        "Pas de limite"
      ],
      correct: 1,
      explanation: "Depuis 2008, on ne peut effectuer plus de deux mandats consécutifs de président."
    },

    // DROITS ET DEVOIRS (10 câu)
    {
      id: 25,
      category: "Droits et devoirs",
      question: "La peine de mort en France est :",
      options: [
        "Autorisée pour les crimes graves",
        "Abolie depuis 1981",
        "Utilisée rarement",
        "Réservée aux terroristes"
      ],
      correct: 1,
      explanation: "La peine de mort a été abolie en France en 1981 sous la présidence de François Mitterrand, à l'initiative de Robert Badinter."
    },
    {
      id: 26,
      category: "Droits et devoirs",
      question: "Que risque une personne qui ne respecte pas la loi ?",
      options: [
        "Rien du tout",
        "Une sanction pénale ou civile",
        "Un simple avertissement toujours",
        "Seulement une amende"
      ],
      correct: 1,
      explanation: "Une personne qui ne respecte pas la loi s'expose à des sanctions pénales (amendes, prison) ou civiles selon la gravité."
    },
    {
      id: 27,
      category: "Droits et devoirs",
      question: "Quel est un devoir du citoyen français ?",
      options: [
        "Aller à l'église",
        "Payer ses impôts",
        "Avoir des enfants",
        "Acheter français"
      ],
      correct: 1,
      explanation: "Payer ses impôts est un devoir citoyen qui permet de financer les services publics."
    },
    {
      id: 28,
      category: "Droits et devoirs",
      question: "Le vote en France est-il obligatoire ?",
      options: [
        "Oui, sous peine d'amende",
        "Non, c'est un droit et non une obligation",
        "Oui pour les élections présidentielles",
        "Seulement pour les hommes"
      ],
      correct: 1,
      explanation: "Le vote est un droit mais pas une obligation en France, contrairement à certains pays."
    },
    {
      id: 29,
      category: "Droits et devoirs",
      question: "À partir de quel âge est-on majeur en France ?",
      options: [
        "16 ans",
        "18 ans",
        "21 ans",
        "25 ans"
      ],
      correct: 1,
      explanation: "La majorité légale est fixée à 18 ans en France depuis 1974."
    },
    {
      id: 30,
      category: "Droits et devoirs",
      question: "La liberté d'expression permet-elle de tout dire ?",
      options: [
        "Oui, absolument tout",
        "Non, elle a des limites (diffamation, injure, incitation à la haine)",
        "Seulement en privé",
        "Uniquement sur internet"
      ],
      correct: 1,
      explanation: "La liberté d'expression a des limites : elle ne permet pas la diffamation, l'injure, l'incitation à la haine ou la violence."
    },
    {
      id: 31,
      category: "Droits et devoirs",
      question: "Qu'est-ce que la présomption d'innocence ?",
      options: [
        "Tout le monde est coupable",
        "Toute personne est présumée innocente jusqu'à preuve du contraire",
        "Seuls les riches sont innocents",
        "Les avocats décident de la culpabilité"
      ],
      correct: 1,
      explanation: "La présomption d'innocence garantit que toute personne accusée est considérée innocente tant que sa culpabilité n'est pas établie."
    },
    {
      id: 32,
      category: "Droits et devoirs",
      question: "Peut-on être discriminé à l'embauche en France ?",
      options: [
        "Oui, l'employeur est libre",
        "Non, c'est interdit par la loi",
        "Seulement pour l'âge",
        "Oui si c'est justifié"
      ],
      correct: 1,
      explanation: "La discrimination à l'embauche (origine, sexe, religion, âge, etc.) est strictement interdite et punie par la loi."
    },
    {
      id: 33,
      category: "Droits et devoirs",
      question: "Quel organisme assure la Sécurité sociale en France ?",
      options: [
        "L'État uniquement",
        "Les organismes de Sécurité sociale",
        "Les banques",
        "Les entreprises privées"
      ],
      correct: 1,
      explanation: "La Sécurité sociale est gérée par des organismes spécialisés (CPAM, CAF, etc.) financés par les cotisations."
    },
    {
      id: 34,
      category: "Droits et devoirs",
      question: "L'école est-elle obligatoire en France ?",
      options: [
        "Non, c'est un choix",
        "Oui, de 3 à 16 ans",
        "Seulement jusqu'à 12 ans",
        "Uniquement l'école publique"
      ],
      correct: 1,
      explanation: "L'instruction est obligatoire de 3 à 16 ans en France, que ce soit à l'école ou à domicile."
    },

    // HISTOIRE ET CULTURE (8 câu)
    {
      id: 35,
      category: "Histoire et culture",
      question: "En quelle année a débuté la Révolution française ?",
      options: [
        "1789",
        "1799",
        "1815",
        "1848"
      ],
      correct: 0,
      explanation: "La Révolution française a débuté en 1789 avec la prise de la Bastille le 14 juillet."
    },
    {
      id: 36,
      category: "Histoire et culture",
      question: "Qui a fondé la Ve République ?",
      options: [
        "Napoléon Bonaparte",
        "Charles de Gaulle",
        "François Mitterrand",
        "Jacques Chirac"
      ],
      correct: 1,
      explanation: "La Ve République a été fondée par Charles de Gaulle en 1958 après la crise algérienne."
    },
    {
      id: 37,
      category: "Histoire et culture",
      question: "Quelle est la capitale de la France ?",
      options: [
        "Lyon",
        "Marseille",
        "Paris",
        "Bordeaux"
      ],
      correct: 2,
      explanation: "Paris est la capitale de la France et sa plus grande ville."
    },
    {
      id: 38,
      category: "Histoire et culture",
      question: "Quand la Seconde Guerre mondiale s'est-elle terminée en Europe ?",
      options: [
        "1943",
        "1944",
        "1945",
        "1946"
      ],
      correct: 2,
      explanation: "La Seconde Guerre mondiale s'est terminée en Europe le 8 mai 1945."
    },
    {
      id: 39,
      category: "Histoire et culture",
      question: "Qui était le général de Gaulle ?",
      options: [
        "Un roi de France",
        "Le chef de la Résistance et fondateur de la Ve République",
        "Un empereur",
        "Un ministre de Napoléon"
      ],
      correct: 1,
      explanation: "Charles de Gaulle a dirigé la France libre pendant la Seconde Guerre mondiale et a fondé la Ve République."
    },
    {
      id: 40,
      category: "Histoire et culture",
      question: "Qu'est-ce que la Résistance française ?",
      options: [
        "Un mouvement sportif",
        "La lutte contre l'occupation nazie (1940-1944)",
        "Un parti politique",
        "Une guerre civile"
      ],
      correct: 1,
      explanation: "La Résistance française désigne les mouvements qui luttaient contre l'occupation allemande pendant la Seconde Guerre mondiale."
    },
    {
      id: 41,
      category: "Histoire et culture",
      question: "En quelle année les femmes ont-elles obtenu le droit de vote en France ?",
      options: [
        "1789",
        "1905",
        "1944",
        "1968"
      ],
      correct: 2,
      explanation: "Les femmes françaises ont obtenu le droit de vote en 1944, accordé par le général de Gaulle."
    },
    {
      id: 42,
      category: "Histoire et culture",
      question: "Quel événement est commémoré le 11 novembre ?",
      options: [
        "La prise de la Bastille",
        "L'armistice de 1918 (fin de la Première Guerre mondiale)",
        "La libération de Paris",
        "La Révolution française"
      ],
      correct: 1,
      explanation: "Le 11 novembre commémore l'armistice de 1918 qui a mis fin à la Première Guerre mondiale."
    },

    // SOCIÉTÉ FRANÇAISE (8 câu)
    {
      id: 43,
      category: "Société française",
      question: "Quelle est la langue officielle de la République française ?",
      options: [
        "L'anglais",
        "Le français",
        "Le latin",
        "Toutes les langues régionales"
      ],
      correct: 1,
      explanation: "Le français est la langue officielle de la République depuis la Constitution de 1992."
    },
    {
      id: 44,
      category: "Société française",
      question: "Qu'est-ce que la Sécurité sociale ?",
      options: [
        "La police nationale",
        "Un système de protection sociale (santé, retraite, famille)",
        "Une compagnie d'assurance",
        "Un service de sécurité privé"
      ],
      correct: 1,
      explanation: "La Sécurité sociale est un système de protection sociale qui couvre la santé, la retraite, la famille et les accidents du travail."
    },
    {
      id: 45,
      category: "Société française",
      question: "Quel est le salaire minimum légal en France ?",
      options: [
        "Il n'existe pas",
        "Le SMIC (Salaire Minimum Interprofessionnel de Croissance)",
        "500 euros par mois",
        "Il varie selon les régions"
      ],
      correct: 1,
      explanation: "Le SMIC est le salaire minimum légal en France, réévalué régulièrement."
    },
    {
      id: 46,
      category: "Société française",
      question: "Combien de jours de congés payés minimum par an ?",
      options: [
        "15 jours",
        "30 jours ouvrables (5 semaines)",
        "45 jours",
        "60 jours"
      ],
      correct: 1,
      explanation: "En France, tout salarié a droit à un minimum de 5 semaines de congés payés par an (30 jours ouvrables)."
    },
    {
      id: 47,
      category: "Société française",
      question: "Qu'est-ce qu'un service public ?",
      options: [
        "Une entreprise privée",
        "Un service assuré par l'État ou les collectivités pour l'intérêt général",
        "Un magasin ouvert au public",
        "Une administration payante"
      ],
      correct: 1,
      explanation: "Un service public est une activité assurée par l'État ou les collectivités pour répondre à un besoin d'intérêt général (école, hôpital, etc.)."
    },
    {
      id: 48,
      category: "Société française",
      question: "La France fait-elle partie de l'Union européenne ?",
      options: [
        "Non",
        "Oui, membre fondateur",
        "Seulement économiquement",
        "Elle l'a quittée"
      ],
      correct: 1,
      explanation: "La France est membre fondateur de l'Union européenne (ancienne CEE créée en 1957)."
    },
    {
      id: 49,
      category: "Société française",
      question: "Quelle est la monnaie utilisée en France ?",
      options: [
        "Le franc",
        "L'euro",
        "La livre",
        "Le dollar"
      ],
      correct: 1,
      explanation: "L'euro est la monnaie officielle de la France depuis 2002."
    },
    {
      id: 50,
      category: "Société française",
      question: "Que signifie 'assimilation' dans le contexte français ?",
      options: [
        "Rejeter les étrangers",
        "Adopter les valeurs et la langue de la République tout en gardant sa culture d'origine",
        "Interdire les religions",
        "Créer des communautés séparées"
      ],
      correct: 1,
      explanation: "L'assimilation (ou intégration républicaine) implique l'adoption des valeurs républicaines et de la langue française, dans le respect de la diversité culturelle."
    }
  ]
};

// Fonction pour obtenir 15 questions aléatoires
export const getRandomQuestions = (count = 15) => {
  const allQuestions = [...questionsDB.CSP];
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Fonction pour obtenir toutes les questions (pour mode examen)
export const getAllQuestions = () => {
  return [...questionsDB.CSP];
};