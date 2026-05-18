import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../store/Team/team.models';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamFormComponent {
  private fb = inject(FormBuilder);

  tournaments = input<{ id: number; name: string }[]>([]);
  saving = input(false);
  editingTeam = input<Team | null>(null);

  title = input('Agregar Equipo');
  submitLabel = input('Guardar');

  onSave = output<{ name: string; tournament: number }>();
  onCancel = output<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    tournament: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    effect(() => {
      const team = this.editingTeam();
      if (team) {
        this.form.patchValue({ name: team.name, tournament: team.tournament });
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    if (this.form.invalid) return;
    const { name, tournament } = this.form.value;
    this.onSave.emit({ name: name!, tournament: tournament! });
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
