export type DrawStage = 'form' | 'drawing' | 'result';

export interface AttemptState {
  stage: DrawStage;
  won: boolean | null;
}

export const INITIAL_ATTEMPT: AttemptState = { stage: 'form', won: null };

export function resetAttempt(): AttemptState {
  return { ...INITIAL_ATTEMPT };
}
