import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { FooterComponent } from '../../layouts/footer/footer.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  imports: [NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {}
