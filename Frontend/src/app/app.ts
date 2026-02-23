import { Component } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { routeAnimation } from './shared/animations/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  animations: [routeAnimation],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      <div [@routeAnimation]="getRouteAnimationData()">
        <router-outlet />
      </div>
    </div>
  `
})
export class App {
  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.url;
  }
}
