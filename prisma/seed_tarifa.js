const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tarifas = [];

  const VALOR_BASE = 5000;

  for (let cargoId = 3; cargoId <= 16; cargoId++) {
    for (let turnoId = 1; turnoId <= 38; turnoId++) {
      tarifas.push({
        cargoId,
        turnoId,
        valorHora: VALOR_BASE + cargoId * 100 + turnoId * 10, // ejemplo dinámico
        vigenteDesde: new Date("2024-01-01"),
        vigenteHasta: null
      });
    }
  }

  console.log(`Generadas ${tarifas.length} tarifas`);

  // 🔍 Insertar evitando duplicados
  for (const tarifa of tarifas) {
    const existe = await prisma.tarifa.findFirst({
      where: {
        cargoId: tarifa.cargoId,
        turnoId: tarifa.turnoId,
        vigenteDesde: tarifa.vigenteDesde
      }
    });

    if (!existe) {
      await prisma.tarifa.create({
        data: tarifa
      });
    }
  }

  console.log("Seed completado correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });