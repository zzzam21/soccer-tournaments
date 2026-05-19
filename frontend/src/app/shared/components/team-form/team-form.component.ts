import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../../store/Team/team.models';

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

  onSave = output<{ name: string; tournaments: number[] }>();
  onCancel = output<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    tournaments: [[] as number[]],
  });

  constructor() {
    effect(() => {
      const team = this.editingTeam();
      if (team) {
        this.form.patchValue({ name: team.name, tournaments: team.tournaments ?? [] });
      }
    });
  }

  toggleTournament(tournamentId: number): void {
    const current = this.form.get('tournaments')?.value ?? [];
    if (Array.isArray(current)) {
      if (current.includes(tournamentId)) {
        this.form.patchValue({ tournaments: current.filter((id) => id !== tournamentId) });
      } else {
        this.form.patchValue({ tournaments: [...current, tournamentId] });
      }
    }
  }

  isSelected(tournamentId: number): boolean {
    const current = this.form.get('tournaments')?.value;
    return Array.isArray(current) && current.includes(tournamentId);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    if (this.form.invalid) return;
    const { name, tournaments } = this.form.value;
    this.onSave.emit({ name: name!, tournaments: tournaments ?? [] });
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
