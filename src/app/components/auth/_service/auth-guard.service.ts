import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TimingService } from 'src/app/timing.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    today: any;

    constructor(
        private router: Router, private toastrService: ToastrService, private timingService: TimingService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = localStorage.getItem("user_id");
        const userrole = localStorage.getItem("user_role");
        const useradminrole = localStorage.getItem("useradmin_role");
        if (currentUser) {
            // authorised so return true
            return true;
        }
        else {

            this.toastrService.error('Session Timeout Please Login');
            // not logged in so redirect to login page with the return url
            this.timingService.runWithDelay(() => {
                if (userrole == 'vendor') {
                    this.router.navigate(['vendor-login'], { queryParams: { returnUrl: state.url } });
                }
                if (userrole == 'admin' || useradminrole == 'sub_admin') {
                    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
                }
            }, 2000);  // 2000 milliseconds = 2 seconds

            return false;
        }

    }
}