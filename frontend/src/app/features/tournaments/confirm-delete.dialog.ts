import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.dialog.html',
  styleUrl: './confirm-delete.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialog {
  tournamentName = input<string>('');
  deleting = input(false);
  onConfirm = output<void>();
  onCancel = output<void>();
}
