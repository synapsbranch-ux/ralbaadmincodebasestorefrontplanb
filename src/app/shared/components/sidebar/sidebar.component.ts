import { AdminService } from './../../../components/auth/_service/admin.service';
import { VendorService } from './../../../components/auth/_service/vendor.service';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StoreService } from 'src/app/components/stores/store.service';
import { NavService, Menu } from '../../service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  user_name: string
  user_role: string
  vendor_type: string
  useradmin_role: string
  public menuItems: Menu[];
  public url: any;
  public fileurl: any;
  profileimage: any;
  vendoraccess: boolean = false;
  useraccess: boolean = false;
  categoryaccess: boolean = false;
  dashboardaccess: boolean = false;
  constructor(private router: Router, public navServices: NavService, private storeservice: StoreService, private vendorservice: VendorService, private adminservice: AdminService) {
    this.user_role = localStorage.getItem('user_role');
    this.vendor_type = localStorage.getItem('vendor_type')
    this.useradmin_role = localStorage.getItem('useradmin_role');
    let SAData =
    {
      subadmin_id: localStorage.getItem('user_id')

    }
    
    if (this.useradmin_role == 'sub_admin') {
      this.adminservice.subadminModuleList(SAData).subscribe(
        res => {
          res['data'].map((elem) => {
            localStorage.setItem('dashboard_access', 'no')
            if (elem.module_id == '634d4e4bdfa29cd5910fe119') {
              this.vendoraccess = true;
            }
            if (elem.module_id == '634d4e5ddfa29cd5910fe11b') {
              this.useraccess = true;
            }
            if (elem.module_id == '634e752700559bc6cdb9f4d3') {
              this.categoryaccess = true;
            }
            if (elem.module_id == '634faec2f1cc886d4683cbae') {
              this.dashboardaccess = true;
              localStorage.setItem('dashboard_access', 'yes')
            }
          })

          if (this.useradmin_role == 'sub_admin') {
            this.navServices.items4.subscribe(menuItems => {
              let menulists = menuItems.map((elm) => {
                if (elm.title == "Categories" && this.categoryaccess) {
                  return elm;
                }

                if (elm.title == "Users" && this.useraccess) {
                  return elm;
                }

                if (elm.title == "Vendors" && this.vendoraccess) {
                  return elm;
                }
                if (elm.title == "Settings") {
                  return elm;
                }
              })

              menulists = menulists.filter(function (element) {
                return element !== undefined;
              });

              console.log('menulists ============>', menulists)
              this.menuItems = menulists
              this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                  menulists.filter(items => {
                    if (items.path === event.url)
                      this.setNavActive(items)
                    if (!items.children) return false
                    items.children.filter(subItems => {
                      if (subItems.path === event.url)
                        this.setNavActive(subItems)
                      if (!subItems.children) return false
                      subItems.children.filter(subSubItems => {
                        if (subSubItems.path === event.url)
                          this.setNavActive(subSubItems)
                      })
                    })
                  })
                }
              })
            })

          }

        }
      )

    }


    if (this.user_role == 'admin' || this.useradmin_role == 'sub_admin') {
      this.profileimage = localStorage.getItem('profile_image');
    }
    if (this.user_role == 'vendor') {
      this.profileimage = localStorage.getItem('profile_image');
    }


    if (this.user_role == 'admin') {
      
      this.navServices.items.subscribe(menuItems => {
        this.menuItems = menuItems
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            menuItems.filter(items => {
              if (items.path === event.url)
                this.setNavActive(items)
              if (!items.children) return false
              items.children.filter(subItems => {
                if (subItems.path === event.url)
                  this.setNavActive(subItems)
                if (!subItems.children) return false
                subItems.children.filter(subSubItems => {
                  if (subSubItems.path === event.url)
                    this.setNavActive(subSubItems)
                })
              })
            })
          }
        })
      })

    }
    else {
     
      if (this.user_role == 'vendor' && this.vendor_type == 'main') {
        let storelist =
        {
          'page': '1',
          'limit': '10'
        }
        this.storeservice.allStorelist(storelist).subscribe(
          res => {
            if (res['data'].length > 0) {
              this.navServices.items3.subscribe(menuItems => {
                this.menuItems = menuItems
                this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    menuItems.filter(items => {
                      if (items.path === event.url)
                        this.setNavActive(items)
                      if (!items.children) return false
                      items.children.filter(subItems => {
                        if (subItems.path === event.url)
                          this.setNavActive(subItems)
                        if (!subItems.children) return false
                        subItems.children.filter(subSubItems => {
                          if (subSubItems.path === event.url)
                            this.setNavActive(subSubItems)
                        })
                      })
                    })
                  }
                })
              })
            }
            else {
              this.navServices.items2.subscribe(menuItems => {
                this.menuItems = menuItems
                this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    menuItems.filter(items => {
                      if (items.path === event.url)
                        this.setNavActive(items)
                      if (!items.children) return false
                      items.children.filter(subItems => {
                        if (subItems.path === event.url)
                          this.setNavActive(subItems)
                        if (!subItems.children) return false
                        subItems.children.filter(subSubItems => {
                          if (subSubItems.path === event.url)
                            this.setNavActive(subSubItems)
                        })
                      })
                    })
                  }
                })
              })
            }
          }
        )




      }
      else if (this.vendor_type == 'access') {
        this.navServices.items5.subscribe(menuItems => {
          this.menuItems = menuItems
          this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
              menuItems.filter(items => {
                if (items.path === event.url)
                  this.setNavActive(items)
                if (!items.children) return false
                items.children.filter(subItems => {
                  if (subItems.path === event.url)
                    this.setNavActive(subItems)
                  if (!subItems.children) return false
                  subItems.children.filter(subSubItems => {
                    if (subSubItems.path === event.url)
                      this.setNavActive(subSubItems)
                  })
                })
              })
            }
          })
        })
      }
    }


  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item)
        menuItem.active = false
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true
            submenuItems.active = true
          }
        })
      }
    })
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item))
          a.active = false
        if (!a.children) return false
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false
          }
        })
      });
    }
    item.active = !item.active
  }

  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }


  ngOnInit() {

    let userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      this.user_name = userData.name;
    }

  }

}
