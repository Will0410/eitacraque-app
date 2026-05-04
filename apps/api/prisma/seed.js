"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await argon2.hash('senha123!');
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
    console.log('✓ Seed concluído. Usuários:');
    console.log('  atleta:  joao@eitacraque.app    / senha123!');
    console.log('  olheiro: olheiro@eitacraque.app / senha123!');
    console.log('  clube:   clube@eitacraque.app   / senha123!');
    console.log(`  atleta id: ${athlete.id}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map