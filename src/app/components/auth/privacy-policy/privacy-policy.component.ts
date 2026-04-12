import { OnInit, Component,} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../_service/admin.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: 'privacy-policy.component.html',
  styleUrls: ['privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  public forgotSubmitForm: FormGroup;

  constructor(
    private router: Router,
    public adminService: AdminService,
    public route: ActivatedRoute,
    private tosaster: ToastrService
    ) {

      }

    ngOnInit() {

      
    }

}
