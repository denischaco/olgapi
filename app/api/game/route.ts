import { NextRequest, NextResponse } from 'next/server';

interface Spot {
  id: number;
  driver: number | null;
}

interface HistoryEntry {
  configuration: Spot[];
  guessType: string;
  result: string;
  pointsEarned: number;
  newScore: number;
}

interface Conductor {
  id: number;
  codigo: string;
  nombre: string;
  avatar: string;
}

interface Programa {
  id: number;
  videoId: string;
  conductores: number[];
  titulo: string;
  thumbnail: string;
}

// Datos del juego (normalmente estarían en una base de datos)
let spots: Spot[] = Array.from({ length: 6 }, (_, index) => ({ id: index + 1, driver: null }));
let score = 0;
let history: HistoryEntry[] = [];
let matchingPrograms: Programa[] = [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const conductores: Conductor[] = [
  { id: 1, codigo: 'migue', nombre: 'Migue Granados', avatar: 'https://i.ibb.co/PQqd1Sd/5.png' },
  // ... (añade el resto de los conductores aquí)
];

const programasConductores: Programa[] = [
  { id: 1, videoId: 'DB_cWa-4sPU', conductores: [6, 1, 15, 10], titulo: 'el BACKSTAGE del MOVISTAR, ALE SANZ y HELADOLGA | Soñé que Volaba | COMPLETO 13/11', thumbnail: 'https://i.ytimg.com/vi/DB_cWa-4sPU/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCuUMWxNbQA1BtGN1qAxdYoo0N2BA' },
  // ... (añade el resto de los programas aquí)
];

export async function GET() {
  return NextResponse.json({ spots, score, history, matchingPrograms });
}

export async function POST(request: NextRequest) {
  const { action, driverId, spotId, guessType } = await request.json();

  switch (action) {
    case 'assign-driver':
      spots = spots.map(spot => 
        spot.id === spotId ? { ...spot, driver: driverId } : 
        spot.driver === driverId ? { ...spot, driver: null } : spot
      );
      return NextResponse.json({ spots });

    case 'make-guess':
      const currentConfig = spots.map(spot => spot.driver).filter(Boolean);
      
      let isCorrect = false;
      matchingPrograms = [];

      if (guessType === 'occurred-in-order') {
        isCorrect = programasConductores.some(program => 
          program.conductores.length === currentConfig.length &&
          program.conductores.every((conductor, index) => conductor === currentConfig[index])
        );
        matchingPrograms = programasConductores.filter(program => 
          program.conductores.length === currentConfig.length &&
          program.conductores.every((conductor, index) => conductor === currentConfig[index])
        );
      } else {
        isCorrect = programasConductores.some(program => 
          program.conductores.length === currentConfig.length &&
          program.conductores.every(conductor => currentConfig.includes(conductor))
        );
        matchingPrograms = programasConductores.filter(program => 
          program.conductores.length === currentConfig.length &&
          program.conductores.every(conductor => currentConfig.includes(conductor))
        );
      }

      const points = guessType === 'occurred-in-order' ? 30 : (guessType === 'occurred' ? 10 : 20);
      const pointsEarned = isCorrect === (guessType !== 'not-occurred') ? points : -points;
      score += pointsEarned;

      history.push({
        configuration: spots,
        guessType,
        result: isCorrect === (guessType !== 'not-occurred') ? 'Acierto' : 'NoAcierto',
        pointsEarned,
        newScore: score
      });

      return NextResponse.json({ isCorrect, score, history, matchingPrograms });

    case 'reset-game':
      spots = Array.from({ length: 6 }, (_, index) => ({ id: index + 1, driver: null }));
      score = 0;
      history = [];
      matchingPrograms = [];
      return NextResponse.json({ message: 'Juego reiniciado', spots, score, history, matchingPrograms });

    default:
      return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  }
}