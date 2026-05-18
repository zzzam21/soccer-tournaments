import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Stats } from './stats.models';

export const StatsActions = createActionGroup({
  source: 'Stats',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ data: Stats }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
