import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('senha123!');

  // Clean up existing data for fresh seed
  await prisma.clip.deleteMany({});
  await prisma.user.deleteMany({});

  const athlete = await prisma.user.upsert({
    where: { email: 'joao@eitacraque.app' },
    update: {},
    create: {
      email: 'joao@eitacraque.app',
      passwordHash,
      displayName: 'João Carlos',
      accountType: 'ATHLETE',
      emailVerified: true,
      athleteProfile: {
        create: {
          position: 'STRIKER',
          dominantFoot: 'RIGHT',
          birthDate: new Date('2010-03-15'),
          heightCm: 165,
          category: 'SUB_15',
          city: 'São Paulo',
          state: 'SP',
          bio: 'Sonho jogar profissional e ajudar minha família.',
          overallRating: 7.4,
          nationalPercentile: 88,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'olheiro@eitacraque.app' },
    update: {},
    create: {
      email: 'olheiro@eitacraque.app',
      passwordHash,
      displayName: 'Marcos Olheiro',
      accountType: 'SCOUT',
      emailVerified: true,
      scoutProfile: {
        create: {
          organizationName: 'Base Scouting',
          regions: ['SP', 'MG'],
          bio: 'Olheiro independente, foco em base.',
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'clube@eitacraque.app' },
    update: {},
    create: {
      email: 'clube@eitacraque.app',
      passwordHash,
      displayName: 'EC Exemplo',
      accountType: 'CLUB',
      emailVerified: true,
      clubProfile: {
        create: {
          legalName: 'Esporte Clube Exemplo Ltda',
          federation: 'FPF',
          categories: ['SUB_15', 'SUB_17', 'SUB_20'],
          verificationStatus: 'VERIFIED',
        },
      },
    },
  });

  // Add sample clips with realistic football context
  const clips = await Promise.all([
    prisma.clip.create({
      data: {
        athleteId: athlete.id,
        title: 'Gol no Campeonato Paulista — São Paulo FC x Corinthians',
        description: 'Finalização rasteira colocada no canto após boa combinação de passes. Movimento de ataque organizado.',
        clipType: 'GOAL',
        status: 'READY',
        durationSeconds: 12,
        views: 1543,
        opponent: 'Corinthians',
        matchDate: new Date('2026-04-28'),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        aiAnalysis: {
          create: {
            summary:
              'Finalização de qualidade com boa leitura de espaço. Aproveita bem o desequilíbrio defensivo e coloca a bola no ângulo.',
            strengths: ['Finalização precisa', 'Posicionamento estratégico', 'Frieza na hora do gol'],
            weaknesses: ['Poderia ter tentado antes'],
            overallScore: 8.7,
            modelVersion: '1.0',
            rawResponse: {},
            attributeScores: {
              create: [
                { attribute: 'FINISHING', score: 9.0 },
                { attribute: 'POSITIONING', score: 8.6 },
                { attribute: 'DECISION_MAKING', score: 8.5 },
                { attribute: 'PACE', score: 8.2 },
              ],
            },
          },
        },
      },
    }),
    prisma.clip.create({
      data: {
        athleteId: athlete.id,
        title: 'Drible em velocidade — Copa do Brasil Sub-15',
        description: 'Arrancada pelo lado direito com 2 dribles em velocidade. Cria superioridade numérica no ataque.',
        clipType: 'DRIBBLE',
        status: 'READY',
        durationSeconds: 8,
        views: 2187,
        opponent: 'Santa Cruz PE',
        matchDate: new Date('2026-04-25'),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        aiAnalysis: {
          create: {
            summary:
              'Excelente domínio de bola em velocidade. Mantém a bola controlada mesmo sob pressão, dribla com eficiência.',
            strengths: ['Domínio de bola impecável', 'Velocidade mantida', 'Saída criativa'],
            weaknesses: [],
            overallScore: 8.8,
            modelVersion: '1.0',
            rawResponse: {},
            attributeScores: {
              create: [
                { attribute: 'DRIBBLING', score: 9.1 },
                { attribute: 'POSITIONING', score: 8.4 },
                { attribute: 'DECISION_MAKING', score: 8.6 },
                { attribute: 'PACE', score: 9.0 },
              ],
            },
          },
        },
      },
    }),
    prisma.clip.create({
      data: {
        athleteId: athlete.id,
        title: 'Passe preciso na saída de bola — Taça da Juventude',
        description: 'Toque de primeira conectando defesa com ataque em transição rápida. Bom jogo de posição.',
        clipType: 'PASS',
        status: 'READY',
        durationSeconds: 5,
        views: 876,
        opponent: 'Santos FC',
        matchDate: new Date('2026-04-22'),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        aiAnalysis: {
          create: {
            summary:
              'Leitura de jogo aguçada com transição rápida. Encontra o colega em posição ideal para continuação do ataque.',
            strengths: ['Visão aguçada', 'Passe de primeira', 'Timing perfeito'],
            weaknesses: [],
            overallScore: 8.5,
            modelVersion: '1.0',
            rawResponse: {},
            attributeScores: {
              create: [
                { attribute: 'PASSING', score: 8.7 },
                { attribute: 'POSITIONING', score: 8.3 },
                { attribute: 'DECISION_MAKING', score: 8.8 },
                { attribute: 'VISION', score: 8.9 },
              ],
            },
          },
        },
      },
    }),
    prisma.clip.create({
      data: {
        athleteId: athlete.id,
        title: 'Assistência e jogo de criação — Amistoso Preparatório',
        description: 'Passe de categoria que desempenha o colega na frente do gol. Trabalho criativo no meio ofensivo.',
        clipType: 'ASSIST',
        status: 'READY',
        durationSeconds: 10,
        views: 2643,
        opponent: 'Seleção XI',
        matchDate: new Date('2026-04-20'),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        aiAnalysis: {
          create: {
            summary:
              'Assistência magistral. Coloca a bola com precisão cirúrgica para o colega finalizar. Demonstra criatividade ofensiva.',
            strengths: ['Passe de assistência impecável', 'Visão criativa', 'Execução perfeita'],
            weaknesses: [],
            overallScore: 9.0,
            modelVersion: '1.0',
            rawResponse: {},
            attributeScores: {
              create: [
                { attribute: 'PASSING', score: 9.2 },
                { attribute: 'POSITIONING', score: 8.8 },
                { attribute: 'DECISION_MAKING', score: 9.1 },
                { attribute: 'VISION', score: 9.3 },
              ],
            },
          },
        },
      },
    }),
    prisma.clip.create({
      data: {
        athleteId: athlete.id,
        title: 'Movimentação tática — Treino de Posicionamento',
        description: 'Sequência de movimentos e deslocamentos. Demonstra inteligência tática e posicionamento defensivo inteligente.',
        clipType: 'GENERAL',
        status: 'READY',
        durationSeconds: 15,
        views: 1432,
        opponent: null,
        matchDate: new Date('2026-04-26'),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        aiAnalysis: {
          create: {
            summary:
              'Bom entendimento tático. Movimentações inteligentes criando espaço e oportunidades. Leitura correta do jogo.',
            strengths: ['Inteligência tática', 'Movimentação constante', 'Criação de espaço'],
            weaknesses: ['Poderia ter mais agressividade em alguns momentos'],
            overallScore: 8.3,
            modelVersion: '1.0',
            rawResponse: {},
            attributeScores: {
              create: [
                { attribute: 'DECISION_MAKING', score: 8.6 },
                { attribute: 'POSITIONING', score: 8.4 },
                { attribute: 'VISION', score: 8.1 },
                { attribute: 'PACE', score: 8.0 },
              ],
            },
          },
        },
      },
    }),
  ]);

  console.log('✓ Seed concluído. Usuários:');
  console.log('  atleta:  joao@eitacraque.app    / senha123!');
  console.log('  olheiro: olheiro@eitacraque.app / senha123!');
  console.log('  clube:   clube@eitacraque.app   / senha123!');
  console.log(`  atleta id: ${athlete.id}`);
  console.log(`\n✓ ${clips.length} lances de amostra criados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
