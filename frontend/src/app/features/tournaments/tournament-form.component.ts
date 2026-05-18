import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tournament } from '../../store/Tournament/tournament.models';

@Component({
  selector: 'app-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrl: './tournament-form.component.scss',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentFormComponent {
  private fb = inject(FormBuilder);

  saving = input(false);
  editingTournament = input<Tournament | null>(null);

  title = input('Agregar Torneo');
  submitLabel = input('Guardar');

  onSave = output<{
    name: string;
    city: string;
    tournament_type: string;
    status: string;
    start_date: string;
    end_date: string;
  }>();
  onCancel = output<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    tournament_type: ['International', Validators.required],
    status: ['Ongoing', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const t = this.editingTournament();
      if (t) {
        this.form.patchValue({
          name: t.name,
          city: t.city,
          tournament_type: t.type,
          status: t.status,
          start_date: t.start_date,
          end_date: t.end_date,
        });
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.onSave.emit(this.form.value as any);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
