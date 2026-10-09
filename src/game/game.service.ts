import { Injectable } from '@nestjs/common';
import { CubeState, WorldState } from './game.types';

const COLORS = [
  '#4ea1ff',
  '#ff6b6b',
  '#51cf66',
  '#ffd43b',
  '#cc5de8',
  '#ff922b',
];
const STEP = 0.5;
const ROT = 0.1;

@Injectable()
export class GameService {
  private cubes = new Map<string, CubeState>();
  private colorIndex = 0;

  /** Cria um cubo para um cliente recém-conectado. */
  spawn(id: string): CubeState {
    const cube: CubeState = {
      id,
      x: 0,
      z: 0,
      rotY: 0,
      color: COLORS[this.colorIndex++ % COLORS.length],
    };
    this.cubes.set(id, cube);
    return cube;
  }

  /** Remove o cubo quando o cliente desconecta. */
  despawn(id: string) {
    this.cubes.delete(id);
  }

  /** Aplica uma tecla de input ao cubo e devolve o novo estado. */
  applyInput(id: string, key: string): CubeState | null {
    const cube = this.cubes.get(id);
    if (!cube) return null;

    switch (key) {
      case 'w':
        cube.z -= STEP;
        break;
      case 's':
        cube.z += STEP;
        break;
      case 'a':
        cube.x -= STEP;
        break;
      case 'd':
        cube.x += STEP;
        break;
      case 'q':
        cube.rotY += ROT;
        break;
      case 'e':
        cube.rotY -= ROT;
        break;
      default:
        return cube;
    }

    // Limites do "mundo"
    cube.x = Math.max(-10, Math.min(10, cube.x));
    cube.z = Math.max(-10, Math.min(10, cube.z));

    return cube;
  }

  getWorld(): WorldState {
    return { cubes: Object.fromEntries(this.cubes) };
  }
}
