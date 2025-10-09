import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class DirtyGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Call the component's own canDeactivate() if it exists
    if (component.canDeactivate) {
      return component.canDeactivate();
    }
    return true;
  }
}
