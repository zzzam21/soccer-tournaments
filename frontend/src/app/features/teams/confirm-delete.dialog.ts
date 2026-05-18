import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialog {
  teamName = input<string>('');
  deleting = input(false);
  onConfirm = output<void>();
  onCancel = output<void>();
}
