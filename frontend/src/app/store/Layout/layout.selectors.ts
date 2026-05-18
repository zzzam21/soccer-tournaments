import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LayoutState } from './layout.models';

export const selectLayoutState = createFeatureSelector<LayoutState>('layout');
export const selectSidebarOpen = createSelector(selectLayoutState, (s) => s.sidebarOpen);
