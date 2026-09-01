export type CheckpointId = 'museo' | 'fontana-xotta' | 'faedo-casaron' | 'parco-agane' | 'san-vittore';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  curiosity: string;
}

export type MiniGameType = 'fossil-hunt' | 'water-basins' | 'frog-counter' | 'tree-herb' | 'skyline-panorama';

export interface MiniGameConfig {
  type: MiniGameType;
  title: string;
  subtitle: string;
  instructions: string;
  rewardBadgeId: string;
  rewardBadgeName: string;
  rewardXp: number;
}

export interface Checkpoint {
  id: CheckpointId;
  order: number;
  code: string; // e.g. "CHK-01"
  name: string;
  subtitle: string;
  altitude: number; // in meters (e.g. 280, 300, 450)
  locationDescription: string;
  coordinates: {
    x: number; // Map percentage coordinate 0-100
    y: number;
    lat: number; // Real GPS
    lng: number;
  };
  floraAmbiente: string[];
  faunaChiViveQui: string[];
  curiositaGeologia: string;
  audioGuideText: string;
  tag: string;
  color: string;
  quiz: QuizQuestion;
  miniGame: MiniGameConfig;
  badge: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
}

export interface RouteLevel {
  id: 'family' | 'explorer' | 'grand-tour';
  name: string;
  badge: string;
  distanceKm: number;
  durationHours: string;
  elevationGainM: number;
  difficulty: 'Facile' | 'Medio' | 'Impegnativo';
  description: string;
  targetAudience: string;
  checkpointIds: CheckpointId[];
}

export interface UserLocation {
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  accuracyM?: number;
  isRealGps: boolean;
}

export interface UserProgress {
  activeRouteId: 'family' | 'explorer' | 'grand-tour' | null;
  isRouteActive: boolean;
  currentStepIndex: number;
  visitedCheckpoints: CheckpointId[];
  completedQuizzes: Record<CheckpointId, { score: number; completedAt: string }>;
  completedMiniGames: Record<CheckpointId, { score: number; highscore: number }>;
  unlockedBadges: string[];
  totalXp: number;
  userLocation: UserLocation;
}

export interface TotemScanTarget {
  checkpointId: CheckpointId;
  checkpointName: string;
  qrPayload: string;
}
