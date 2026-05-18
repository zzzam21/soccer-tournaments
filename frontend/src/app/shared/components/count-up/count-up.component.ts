import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-count-up',
  template: `{{ displayValue }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountUpComponent implements OnChanges {
  value = input.required<number>();
  duration = input(800);

  displayValue = 0;
  private cdr = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.animateTo(this.value());
    }
  }

  private animateTo(target: number): void {
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / this.duration(), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayValue = Math.floor(eased * target);
      this.cdr.markForCheck();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
