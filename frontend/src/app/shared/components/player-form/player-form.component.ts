import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../../../store/Player/player.models';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerFormComponent {
  private fb = inject(FormBuilder);

  teams = input<{ id: number; name: string }[]>([]);
  saving = input(false);
  editingPlayer = input<Player | null>(null);

  title = input('Agregar Jugador');
  submitLabel = input('Guardar');

  onSave = output<{ name: string; team?: number | null; photo?: string }>();
  onCancel = output<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    team: [0],
    photo: [''],
  });

  photoPreview = '';

  constructor() {
    effect(() => {
      const player = this.editingPlayer();
      if (player) {
        this.form.patchValue({
          name: player.name,
          team: player.team ?? 0,
          photo: player.photo ?? '',
        });
        this.photoPreview = player.photo ?? '';
      }
    });
  }

  onPhotoInput(value: string): void {
    this.photoPreview = value;
  }

  clearPhoto(): void {
    this.form.patchValue({ photo: '' });
    this.photoPreview = '';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    if (this.form.invalid) return;

    const { name, team, photo } = this.form.value;

    this.onSave.emit({
      name: name!,
      team: team && team > 0 ? team : null,
      photo: photo || undefined,
    });
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
