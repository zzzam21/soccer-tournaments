import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.dialog.html',
  styleUrl: './confirm-delete.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialog {
  name = input<string>('');
  title = input('Eliminar');
  message = input('¿Estás seguro de eliminar <strong>{name}</strong>?<br />Esta acción no se puede deshacer.');
  deleting = input(false);
  onConfirm = output<void>();
  onCancel = output<void>();
}
