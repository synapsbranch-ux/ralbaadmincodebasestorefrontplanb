import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  animations: [
    trigger('animateRoute', [transition('* => *', useAnimation(fadeIn))])
  ]
})
export class ContentLayoutComponent implements OnInit {

  public right_side_bar: boolean;
  public layoutType: string = 'RTL';
  public layoutClass: boolean = false;

  constructor(public navServices: NavService, private cdRef: ChangeDetectorRef) { }

  public getRouterOutletState(outlet) {
    let state = '';
    setTimeout(() => {
        state = outlet.isActivated ? outlet.activatedRoute.routeConfig?.path : '';
    }, 0);
    return state;
  }

  public rightSidebar($event) {
    this.right_side_bar = $event;
  }

  public clickRtl(val: string) {
    if (val === 'RTL') {
      document.body.className = 'rtl';
      this.layoutClass = true;
      this.layoutType = 'LTR';
    } else {
      document.body.className = '';
      this.layoutClass = false;
      this.layoutType = 'RTL';
    }
  }

  ngOnInit() { }

}
