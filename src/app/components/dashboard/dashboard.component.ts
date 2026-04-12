import { ToastrService } from 'ngx-toastr';
import { VendorsService } from './../vendors/vendor.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from './../auth/_service/admin.service';
import { VendorService } from './../auth/_service/vendor.service';
import { Component, inject, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';
import { ProductService } from '../products/product.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [NgbInputDatepickerConfig], // add config to the component providers
})
export class DashboardComponent implements OnInit {
  public doughnutData = doughnutData;
  public pieData = pieData;
  number_of_product: any = 0;
  number_of_store: any = 0;
  total_order_amount: any = 0;
  total_parchase: any = 0;
  dashboardaccess: boolean = false;

  form_date_input_val: any;
  todate_status: boolean = false; // Controls whether "To Date" is enabled
  todays: { year: number, month: number, day: number }; // Current date in {year, month, day} format
  today_max_coditional: { year: number, month: number, day: number } | null = null; // Max condition date for "To Date"

  today = inject(NgbCalendar).getToday();
  from_d: NgbDateStruct;
  to_d: NgbDateStruct;

  public DashboardFilterForm: FormGroup;

  constructor(private productservice: ProductService, private vendorservice: VendorService, private adminservice: AdminService, private vendorlistService: VendorsService, private toster: ToastrService) {
    Object.assign(this, { doughnutData, pieData })
    const currentDate = new Date();
    this.todays = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1, // JavaScript months are 0-based, so add 1
      day: currentDate.getDate()
    };

  }

  // doughnut 2
  public view = chartData.view;
  public doughnutChartColorScheme = chartData.doughnutChartcolorScheme;
  public doughnutChartShowLabels = chartData.doughnutChartShowLabels;
  public doughnutChartGradient = chartData.doughnutChartGradient;
  public doughnutChartTooltip = chartData.doughnutChartTooltip;

  public chart5 = chartData.chart5;


  // lineChart
  public lineChartData = chartData.lineChartData;
  public lineChartLabels = chartData.lineChartLabels;
  public lineChartOptions = chartData.lineChartOptions;
  public lineChartColors = chartData.lineChartColors;
  public lineChartLegend = chartData.lineChartLegend;
  public lineChartType = chartData.lineChartType;

  // lineChart
  public smallLineChartData = chartData.smallLineChartData;
  public smallLineChartLabels = chartData.smallLineChartLabels;
  public smallLineChartOptions = chartData.smallLineChartOptions;
  public smallLineChartColors = chartData.smallLineChartColors;
  public smallLineChartLegend = chartData.smallLineChartLegend;
  public smallLineChartType = chartData.smallLineChartType;

  // lineChart
  public smallLine2ChartData = chartData.smallLine2ChartData;
  public smallLine2ChartLabels = chartData.smallLine2ChartLabels;
  public smallLine2ChartOptions = chartData.smallLine2ChartOptions;
  public smallLine2ChartColors = chartData.smallLine2ChartColors;
  public smallLine2ChartLegend = chartData.smallLine2ChartLegend;
  public smallLine2ChartType = chartData.smallLine2ChartType;

  // lineChart
  public smallLine3ChartData = chartData.smallLine3ChartData;
  public smallLine3ChartLabels = chartData.smallLine3ChartLabels;
  public smallLine3ChartOptions = chartData.smallLine3ChartOptions;
  public smallLine3ChartColors = chartData.smallLine3ChartColors;
  public smallLine3ChartLegend = chartData.smallLine3ChartLegend;
  public smallLine3ChartType = chartData.smallLine3ChartType;

  // lineChart
  public smallLine4ChartData = chartData.smallLine4ChartData;
  public smallLine4ChartLabels = chartData.smallLine4ChartLabels;
  public smallLine4ChartOptions = chartData.smallLine4ChartOptions;
  public smallLine4ChartColors = chartData.smallLine4ChartColors;
  public smallLine4ChartLegend = chartData.smallLine4ChartLegend;
  public smallLine4ChartType = chartData.smallLine4ChartType;

  public chart3 = chartData.chart3;

  userrole: any;
  isAdmin: boolean = false;
  profileimage: any;

  public vendorslist = [];

  // events
  public chartClicked(e: any): void {
  }
  public chartHovered(e: any): void {
  }

  ngOnInit() {

    if (localStorage.getItem('useradmin_role') == 'sub_admin' && localStorage.getItem('dashboard_access') == 'yes') {
      this.dashboardaccess = true;
    }
    else {
      this.dashboardaccess = false;
    }

    if ((localStorage.getItem('useradmin_role') == 'admin' || localStorage.getItem('user_role') == 'vendor')) {
      this.dashboardaccess = true;
    }


    this.DashboardFilterForm = new FormGroup({
      'from_date': new FormControl(null),
      'to_date': new FormControl(null),
      'vendor_id': new FormControl(null),

    });

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
      this.profileimage = '';
      this.all_admin_dash_data();
      this.allvendorlist();
    }
    if (this.userrole == 'vendor') {
      this.profileimage = localStorage.getItem('profile_image')
      this.all_vendor_dash_data();
    }
  }

  allvendorlist() {
    this.vendorlistService.allVendorList(0, 0).subscribe(
      res => {
        console.log(res);
        this.vendorslist = res['data'];
      },
      error => {
        this.toster.error(error.error.message)
      }
    )
  }



  // fromdate(fromdate:any)
  // {
  //   this.form_date_input_val=fromdate?.target.value
  //   if(this.form_date_input_val)
  //   {
  //     this.todate_status=true;
  //     this.today_max_coditional=new Date(new Date(this.form_date_input_val).setDate(new Date(this.form_date_input_val).getDate())); 
  //   }
  //   console.log('Todate',this.today_max_coditional);
  //   console.log(fromdate?.target.value);
  // }

  // Method to handle the "From Date" change
  // Method to handle the "From Date" change
  fromdate(event: any) {
    // The event will be an object like { year: 2024, month: 9, day: 6 }
    const fromDate = new Date(event?.year, event?.month - 1, event?.day); // Convert to JavaScript Date object

    // Enable the "To Date" input
    this.todate_status = true;

    // Set "To Date" min to "From Date" in { year: number, month: number, day: number } format
    this.today_max_coditional = {
      year: event?.year,
      month: event?.month,
      day: event?.day
    };

    // If "From Date" is the same as "To Date", disable "To Date"
    if (this.DashboardFilterForm.get('to_date')?.value) {
      const toDateValue = this.DashboardFilterForm.get('to_date')?.value;
      const toDate = new Date(toDateValue.year, toDateValue.month - 1, toDateValue.day);
      if (fromDate.getTime() === toDate.getTime()) {
        this.DashboardFilterForm.get('to_date')?.disable();
      } else {
        this.DashboardFilterForm.get('to_date')?.enable();
      }
    }
  }


  // Utility function to convert date object to 'yyyy-MM-dd' string
  private formatDate(dateObj: { year: number, month: number, day: number }): string {
    if (!dateObj) return '';

    const year = dateObj.year;
    const month = ('0' + dateObj.month).slice(-2); // Ensure two digits
    const day = ('0' + dateObj.day).slice(-2); // Ensure two digits

    return `${year}-${month}-${day}`;
  }

  get from_date() { return this.DashboardFilterForm.get('from_date').value; }
  get to_date() { return this.DashboardFilterForm.get('to_date').value; }
  get vendor_id() { return this.DashboardFilterForm.get('vendor_id').value; }
  onDashboardSubmit() {
    let formData = this.DashboardFilterForm.value;
    let dashobj = {}
    if (this.userrole == 'vendor') {
      if (formData.from_date != null) {
        dashobj = {
          from_date: this.formatDate(formData.from_date),
          to_date: this.formatDate(formData.from_date)
            ? this.formatDate(formData.to_date)
            : this.formatDate(formData.from_date)
        };

        this.vendorservice.vendorDashboardDetails(dashobj).subscribe(
          res => {
            this.number_of_product = res['data'].number_of_product;
            this.number_of_store = res['data'].number_of_store;
            this.total_order_amount = res['data'].total_order_amount;
            this.total_parchase = res['data'].total_purchase;
            console.log('Vendor Dashboard Details', res['data']);
          },
          error => {
            this.toster.error(error.error.message)
          }
        )
      }
      else {
        this.toster.error('Please select date to filter')
      }

    }
    else {
      console.log('Admin Dashboard');

      let startdate: { year: number, month: number, day: number } | null = null; // Max condition date for "To Date"
      let enddate: { year: number, month: number, day: number } | null = null; // Max condition date for "To Date"
      let vendor_id = null;

      if (!formData.from_date) {
        startdate = null;
      }
      else {
        startdate = formData.from_date
      }

      if (!formData.to_date) {
        enddate = null;

      }
      else {
        enddate = formData.to_date

      }

      if (!formData.vendor_id || formData.vendor_id == "") {
        vendor_id = null;
      }
      else {
        vendor_id = formData.vendor_id
      }

      console.log(formData.to_date, formData.from_date, formData.vendor_id)

      dashobj =
      {
        from_date: this.formatDate(startdate),
        to_date: this.formatDate(enddate) ? this.formatDate(enddate) : this.formatDate(startdate),
        vendor_id: vendor_id
      }

      this.adminservice.adminDashboardDetails(dashobj).subscribe(
        res => {
          this.number_of_product = res['data'].number_of_product;
          this.number_of_store = res['data'].number_of_store;
          this.total_order_amount = res['data'].total_order_amount;
          this.total_parchase = res['data'].total_purchase;
          console.log('Admin Dashboard Details', res['data']);
        },
        error => {
          this.toster.error(error.error.message)
        }
      )
    }



    console.log('Sending Dashboard Filter data', dashobj);

  }

  reset() {
    this.today_max_coditional = null;
    this.todate_status = false;
    if (this.userrole == 'vendor') {
      this.all_vendor_dash_data();
    }

    if (this.userrole == 'admin') {
      this.all_admin_dash_data();
    }
  }

  all_vendor_dash_data() {
    let filterdt =
    {
      from_date: '',
      to_date: ''
    }
    this.vendorservice.vendorDashboardDetails(filterdt).subscribe(
      res => {
        this.number_of_product = res['data'].number_of_product;
        this.number_of_store = res['data'].number_of_store;
        this.total_order_amount = res['data'].total_order_amount;
        this.total_parchase = res['data'].total_purchase;
        console.log('Vendor Dashboard Details', res['data']);
      },
      error => {
        this.toster.error(error.error.message)
      }
    )
  }

  all_admin_dash_data() {
    let dashobj =
    {
      from_date: '',
      to_date: '',
      vendor_id: ''
    }
    this.adminservice.adminDashboardDetails(dashobj).subscribe(
      res => {
        this.number_of_product = res['data'].number_of_product;
        this.number_of_store = res['data'].number_of_store;
        this.total_order_amount = res['data'].total_order_amount;
        this.total_parchase = res['data'].total_purchase;
        console.log('Admin Dashboard Details', res['data']);
      },
      error => {
        this.toster.error(error.error.message)
      }
    )
  }

}
