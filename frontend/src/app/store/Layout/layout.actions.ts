import { createActionGroup, emptyProps } from '@ngrx/store';

export const LayoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Toggle Sidebar': emptyProps(),
    'Open Sidebar': emptyProps(),
    'Close Sidebar': emptyProps(),
  },
});
