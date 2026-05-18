import { createReducer, on } from '@ngrx/store';
import { LayoutActions } from './layout.actions';
import { LayoutState, initialLayoutState } from './layout.models';

export const layoutReducer = createReducer<LayoutState>(
  initialLayoutState,
  on(LayoutActions.toggleSidebar, (state) => ({ ...state, sidebarOpen: !state.sidebarOpen })),
  on(LayoutActions.openSidebar, (state) => ({ ...state, sidebarOpen: true })),
  on(LayoutActions.closeSidebar, (state) => ({ ...state, sidebarOpen: false })),
);
