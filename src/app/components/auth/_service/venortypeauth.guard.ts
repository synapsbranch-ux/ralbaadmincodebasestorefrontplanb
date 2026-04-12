import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

export const venortypeauthGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _toastrService = inject(ToastrService);
  let vendorType = localStorage.getItem("vendor_type");
  let lastUrl = localStorage.getItem("lastUrl");


  if(vendorType === 'access'){
    _toastrService.error('You Are Not Have Permission To Access That Page...!!!');
    _router.navigate([`${lastUrl}`]);
    return false;
  }
  return true;
};
