export interface CubeState {
  id: string;
  x: number;
  z: number;
  rotY: number;
  color: string;
}

export interface WorldState {
  cubes: Record<string, CubeState>;
}
