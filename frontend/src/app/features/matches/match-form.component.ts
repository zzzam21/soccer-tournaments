import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Match } from '../../store/Match/match.models';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrl: './match-form.component.scss',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchFormComponent {
  private fb = inject(FormBuilder);

  saving = input(false);
  editingMatch = input<Match | null>(null);
  minDate = input<string>('');
  title = input('Agregar Jornada');
  submitLabel = input('Guardar');

  onSave = output<{ number: number; start_date: string }>();
  onCancel = output<void>();

  form = this.fb.group({
    number: [1, [Validators.required, Validators.min(1)]],
    start_date: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const m = this.editingMatch();
      if (m) {
        this.form.patchValue({
          number: m.number,
          start_date: m.start_date,
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const startDate = this.form.get('start_date')?.value;
    if (!this.editingMatch() && this.minDate() && startDate && startDate < this.minDate()) {
      this.form.get('start_date')?.setErrors({ minDate: true });
      return;
    }

    this.onSave.emit(this.form.value as { number: number; start_date: string });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
