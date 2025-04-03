import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrl: './top-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopPanelComponent {

}
