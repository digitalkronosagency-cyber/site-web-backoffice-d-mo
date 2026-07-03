import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgoDate(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('Nettoyage de la base...');
  await prisma.activityLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.counter.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.service.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.company.deleteMany();
  await prisma.adminLoginToken.deleteMany();

  console.log('Création de l\'entreprise...');
  const company = await prisma.company.create({
    data: {
      name: 'Électricité Dumont',
      phone: '04 78 12 34 56',
      email: 'contact@electricite-dumont.fr',
      address: '12 rue de la République',
      postalCode: '69002',
      city: 'Lyon',
      siret: '812 345 678 00019',
      tvaNumber: 'FR32812345678',
      description:
        "Électricien qualifié à Lyon depuis plus de 15 ans, Électricité Dumont intervient auprès des particuliers et professionnels pour toutes vos installations, mises aux normes et dépannages électriques. Réactivité, sérieux et garantie décennale sur tous nos travaux.",
      cities: ['Lyon', 'Villeurbanne', 'Vénissieux', 'Caluire-et-Cuire', 'Bron', 'Vaulx-en-Velin', 'Écully', 'Oullins'],
      logoUrl: null,
      heroImageUrl: null,
    },
  });

  console.log('Création des services...');
  const servicesData = [
    {
      title: 'Installation électrique',
      description: 'Installation complète ou partielle de votre système électrique, dans le respect des normes en vigueur.',
      icon: 'Zap',
      order: 0,
    },
    {
      title: 'Mise aux normes',
      description: 'Mise en conformité de votre installation électrique selon la norme NF C 15-100.',
      icon: 'ShieldCheck',
      order: 1,
    },
    {
      title: 'Dépannage urgence',
      description: 'Intervention rapide 7j/7 en cas de panne électrique, coupure ou court-circuit.',
      icon: 'Siren',
      order: 2,
    },
    {
      title: 'Tableau électrique',
      description: 'Remplacement et modernisation de votre tableau électrique pour plus de sécurité.',
      icon: 'Gauge',
      order: 3,
    },
    {
      title: 'Borne de recharge',
      description: "Installation de borne de recharge pour véhicule électrique à domicile ou en entreprise.",
      icon: 'BatteryCharging',
      order: 4,
    },
    {
      title: 'Rénovation électrique',
      description: "Rénovation complète de l'installation électrique de votre logement ancien.",
      icon: 'Hammer',
      order: 5,
    },
  ];
  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }

  console.log('Création des avis clients...');
  const testimonialsData = [
    { name: 'Marc Lefèvre', rating: 5, comment: "Intervention rapide et travail soigné pour la mise aux normes de mon tableau électrique. Je recommande !", date: daysAgoDate(12), order: 0 },
    { name: 'Sophie Renard', rating: 5, comment: "Très professionnel, ponctuel et prix honnête. L'installation de ma borne de recharge s'est parfaitement passée.", date: daysAgoDate(28), order: 1 },
    { name: 'Julien Moreau', rating: 4, comment: "Bon dépannage en urgence un dimanche soir, panne réglée rapidement. Un peu cher mais justifié vu l'horaire.", date: daysAgoDate(45), order: 2 },
    { name: 'Camille Dubois', rating: 5, comment: "Équipe sérieuse et à l'écoute. Rénovation complète de l'installation électrique de notre appartement ancien, résultat impeccable.", date: daysAgoDate(60), order: 3 },
    { name: 'Thomas Girard', rating: 5, comment: "Devis clair, travail propre et dans les temps. Électricité Dumont est désormais mon électricien de référence à Lyon.", date: daysAgoDate(75), order: 4 },
  ];
  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Création des photos...');
  const photosData = [
    { url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800', alt: 'Installation tableau électrique', order: 0 },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Câblage électrique professionnel', order: 1 },
    { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800', alt: 'Rénovation électrique chantier', order: 2 },
    { url: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800', alt: 'Borne de recharge véhicule électrique', order: 3 },
  ];
  for (const p of photosData) {
    await prisma.photo.create({ data: p });
  }

  console.log('Création des devis de démonstration...');

  type QuoteSeed = {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    serviceType: string;
    description: string;
    status: 'NOUVEAU' | 'ENVOYE' | 'RELANCE' | 'SIGNE' | 'REFUSE';
    createdAt: Date;
    sentAt?: Date;
    lastRelanceAt?: Date;
    signedAt?: Date;
    refusedAt?: Date;
    lineItems?: { label: string; quantity: number; unitPrice: number }[];
  };

  const quotesSeed: QuoteSeed[] = [
    {
      clientName: 'Anne Petit',
      clientEmail: 'anne.petit@example.com',
      clientPhone: '06 12 34 56 78',
      clientAddress: '5 rue Garibaldi, 69003 Lyon',
      serviceType: 'Installation électrique',
      description: "Besoin d'une installation électrique complète pour un studio de 25m².",
      status: 'NOUVEAU',
      createdAt: daysAgoDate(1),
    },
    {
      clientName: 'Karim Belaïd',
      clientEmail: 'karim.belaid@example.com',
      clientPhone: '06 23 45 67 89',
      clientAddress: '18 avenue Jean Jaurès, 69007 Lyon',
      serviceType: 'Dépannage urgence',
      description: "Coupure électrique générale dans l'appartement, besoin d'une intervention rapide.",
      status: 'NOUVEAU',
      createdAt: daysAgoDate(2),
    },
    {
      clientName: 'Isabelle Faure',
      clientEmail: 'isabelle.faure@example.com',
      clientPhone: '06 34 56 78 90',
      clientAddress: '9 rue de Marseille, 69007 Lyon',
      serviceType: 'Tableau électrique',
      description: 'Remplacement du tableau électrique vétuste de la maison.',
      status: 'ENVOYE',
      createdAt: daysAgoDate(3),
      sentAt: daysAgoDate(2),
      lineItems: [
        { label: 'Dépose ancien tableau électrique', quantity: 1, unitPrice: 120 },
        { label: 'Fourniture et pose tableau neuf 3 rangées', quantity: 1, unitPrice: 480 },
        { label: 'Mise en conformité disjoncteurs', quantity: 1, unitPrice: 220 },
      ],
    },
    {
      clientName: 'Vincent Roux',
      clientEmail: 'vincent.roux@example.com',
      clientPhone: '06 45 67 89 01',
      clientAddress: '33 cours Gambetta, 69003 Lyon',
      serviceType: 'Borne de recharge',
      description: 'Installation borne de recharge 7kW dans garage individuel.',
      status: 'ENVOYE',
      createdAt: daysAgoDate(10),
      sentAt: daysAgoDate(9),
      lineItems: [
        { label: 'Borne de recharge 7kW', quantity: 1, unitPrice: 890 },
        { label: "Installation et raccordement", quantity: 1, unitPrice: 350 },
      ],
    },
    {
      clientName: 'Nathalie Blanc',
      clientEmail: 'nathalie.blanc@example.com',
      clientPhone: '06 56 78 90 12',
      clientAddress: '2 place Bellecour, 69002 Lyon',
      serviceType: 'Mise aux normes',
      description: 'Mise aux normes NF C 15-100 avant vente du bien immobilier.',
      status: 'RELANCE',
      createdAt: daysAgoDate(15),
      sentAt: daysAgoDate(13),
      lastRelanceAt: daysAgoDate(6),
      lineItems: [
        { label: 'Diagnostic installation existante', quantity: 1, unitPrice: 90 },
        { label: 'Mise aux normes complète', quantity: 1, unitPrice: 1450 },
      ],
    },
    {
      clientName: 'Julien Moreau',
      clientEmail: 'julien.moreau@example.com',
      clientPhone: '06 67 89 01 23',
      clientAddress: '14 rue Duguesclin, 69006 Lyon',
      serviceType: 'Dépannage urgence',
      description: 'Court-circuit répété sur le circuit cuisine.',
      status: 'SIGNE',
      createdAt: daysAgoDate(40),
      sentAt: daysAgoDate(38),
      signedAt: daysAgoDate(35),
      lineItems: [
        { label: "Diagnostic et recherche de panne", quantity: 1, unitPrice: 90 },
        { label: 'Remplacement câblage circuit cuisine', quantity: 1, unitPrice: 310 },
      ],
    },
    {
      clientName: 'Camille Dubois',
      clientEmail: 'camille.dubois@example.com',
      clientPhone: '06 78 90 12 34',
      clientAddress: '27 rue Sala, 69002 Lyon',
      serviceType: 'Rénovation électrique',
      description: "Rénovation complète de l'installation électrique d'un appartement ancien de 65m².",
      status: 'SIGNE',
      createdAt: daysAgoDate(70),
      sentAt: daysAgoDate(68),
      signedAt: daysAgoDate(62),
      lineItems: [
        { label: 'Dépose ancienne installation', quantity: 1, unitPrice: 400 },
        { label: 'Câblage complet aux normes (65m²)', quantity: 1, unitPrice: 3200 },
        { label: 'Fourniture et pose tableau neuf', quantity: 1, unitPrice: 550 },
        { label: 'Pose prises et interrupteurs (28 points)', quantity: 28, unitPrice: 35 },
      ],
    },
    {
      clientName: 'Marc Lefèvre',
      clientEmail: 'marc.lefevre@example.com',
      clientPhone: '06 89 01 23 45',
      clientAddress: '41 rue de Bonnel, 69003 Lyon',
      serviceType: 'Tableau électrique',
      description: 'Modernisation du tableau électrique et ajout de protections différentielles.',
      status: 'SIGNE',
      createdAt: daysAgoDate(25),
      sentAt: daysAgoDate(23),
      signedAt: daysAgoDate(18),
      lineItems: [
        { label: 'Fourniture et pose tableau neuf', quantity: 1, unitPrice: 480 },
        { label: 'Protections différentielles additionnelles', quantity: 2, unitPrice: 85 },
      ],
    },
    {
      clientName: 'Sophie Renard',
      clientEmail: 'sophie.renard@example.com',
      clientPhone: '06 90 12 34 56',
      clientAddress: '6 quai Saint-Vincent, 69001 Lyon',
      serviceType: 'Borne de recharge',
      description: 'Installation borne de recharge en copropriété.',
      status: 'REFUSE',
      createdAt: daysAgoDate(20),
      sentAt: daysAgoDate(18),
      refusedAt: daysAgoDate(14),
      lineItems: [
        { label: 'Borne de recharge 11kW', quantity: 1, unitPrice: 1190 },
        { label: 'Étude de faisabilité copropriété', quantity: 1, unitPrice: 250 },
      ],
    },
    {
      clientName: 'Thomas Girard',
      clientEmail: 'thomas.girard@example.com',
      clientPhone: '07 01 23 45 67',
      clientAddress: '3 rue Victor Hugo, 69002 Lyon',
      serviceType: 'Installation électrique',
      description: "Installation électrique pour l'aménagement de combles.",
      status: 'ENVOYE',
      createdAt: daysAgoDate(4),
      sentAt: daysAgoDate(3),
      lineItems: [
        { label: 'Câblage combles aménagés', quantity: 1, unitPrice: 980 },
        { label: 'Pose spots et éclairage', quantity: 8, unitPrice: 45 },
      ],
    },
  ];

  let invoiceYearCounter = 0;

  for (const q of quotesSeed) {
    const totalAmount = q.lineItems
      ? q.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0)
      : null;

    const quote = await prisma.quote.create({
      data: {
        clientName: q.clientName,
        clientEmail: q.clientEmail,
        clientPhone: q.clientPhone,
        clientAddress: q.clientAddress,
        serviceType: q.serviceType,
        description: q.description,
        status: q.status,
        totalAmount,
        createdAt: q.createdAt,
        sentAt: q.sentAt,
        lastRelanceAt: q.lastRelanceAt,
        signedAt: q.signedAt,
        refusedAt: q.refusedAt,
        lineItems: q.lineItems
          ? {
              create: q.lineItems.map((li, idx) => ({
                label: li.label,
                quantity: li.quantity,
                unitPrice: li.unitPrice,
                order: idx,
              })),
            }
          : undefined,
      },
    });

    await prisma.activityLog.create({
      data: {
        type: 'QUOTE_CREATED',
        message: `Nouvelle demande de devis de ${q.clientName}`,
        quoteId: quote.id,
        createdAt: q.createdAt,
      },
    });

    if (q.sentAt) {
      await prisma.activityLog.create({
        data: {
          type: 'QUOTE_SENT',
          message: `Devis envoyé à ${q.clientName}`,
          quoteId: quote.id,
          createdAt: q.sentAt,
        },
      });
    }

    if (q.lastRelanceAt) {
      await prisma.activityLog.create({
        data: {
          type: 'QUOTE_RELAUNCHED',
          message: `Relance envoyée à ${q.clientName}`,
          quoteId: quote.id,
          createdAt: q.lastRelanceAt,
        },
      });
    }

    if (q.status === 'SIGNE' && q.signedAt && totalAmount !== null) {
      await prisma.activityLog.create({
        data: {
          type: 'QUOTE_SIGNED',
          message: `Devis signé par ${q.clientName}`,
          quoteId: quote.id,
          createdAt: q.signedAt,
        },
      });

      invoiceYearCounter += 1;
      const year = q.signedAt.getFullYear();
      const number = `FA-${year}-${String(invoiceYearCounter).padStart(4, '0')}`;
      const amountHT = totalAmount;
      const tvaRate = 20;
      const amountTTC = Math.round(amountHT * (1 + tvaRate / 100) * 100) / 100;
      const isPaid = invoiceYearCounter % 2 === 0;

      const invoice = await prisma.invoice.create({
        data: {
          number,
          quoteId: quote.id,
          clientName: q.clientName,
          clientEmail: q.clientEmail,
          clientAddress: q.clientAddress,
          amountHT,
          tvaRate,
          amountTTC,
          status: isPaid ? 'PAYEE' : 'EN_ATTENTE',
          paidAt: isPaid ? daysAgoDate(5) : null,
          createdAt: q.signedAt,
        },
      });

      await prisma.activityLog.create({
        data: {
          type: 'INVOICE_CREATED',
          message: `Facture ${invoice.number} créée pour ${q.clientName}`,
          quoteId: quote.id,
          createdAt: q.signedAt,
        },
      });

      if (isPaid) {
        await prisma.activityLog.create({
          data: {
            type: 'INVOICE_PAID',
            message: `Facture ${invoice.number} marquée payée`,
            quoteId: quote.id,
            createdAt: daysAgoDate(5),
          },
        });
      }
    }

    if (q.status === 'REFUSE' && q.refusedAt) {
      await prisma.activityLog.create({
        data: {
          type: 'QUOTE_REFUSED',
          message: `Devis refusé par ${q.clientName}`,
          quoteId: quote.id,
          createdAt: q.refusedAt,
        },
      });
    }
  }

  await prisma.counter.upsert({
    where: { key: `invoice-${new Date().getFullYear()}` },
    create: { key: `invoice-${new Date().getFullYear()}`, value: invoiceYearCounter },
    update: { value: invoiceYearCounter },
  });

  console.log(`Terminé. Entreprise: ${company.name}, ${quotesSeed.length} devis créés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
