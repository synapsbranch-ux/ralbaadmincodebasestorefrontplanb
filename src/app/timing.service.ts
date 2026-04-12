import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TimingService {
  private timers: { [key: string]: any } = {}; // Use any type for compatibility

  constructor(private ngZone: NgZone, private router: Router) {}

  public runWithDelay(callback: () => void, delay: number, identifier?: string): void {
    // Clear any existing timer with the same identifier to avoid duplicates
    if (identifier) {
      this.clearTimeout(identifier);
    }

    // Run the timeout outside Angular's zone to prevent unnecessary change detection cycles
    this.ngZone.runOutsideAngular(() => {
      const timerId = setTimeout(() => {
        // Bring back to Angular's zone to execute the callback
        this.ngZone.run(() => {
          callback();
        });
      }, delay);

      // Store the timer ID if an identifier is provided
      if (identifier) {
        this.timers[identifier] = timerId;
      }
    });
  }

  public clearTimeout(identifier: string): void {
    if (this.timers[identifier]) {
      clearTimeout(this.timers[identifier]);
      delete this.timers[identifier];
    }
  }
}
