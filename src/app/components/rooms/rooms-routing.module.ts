import { AddRoomTextureComponent } from './addroom-texture/addroom-texture.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRoomComponent } from './addroom/add-room.component';
import { ListRoomComponent } from './list-room/list-room.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { ListRoomTextureComponent } from './list-room-texture/list-room-texture.component';
import { EditRoomTextureComponent } from './editroom-texture/editroom-texture.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-room',
        component: ListRoomComponent,canActivate: [AuthGuard],
        data: {
          title: "List Room",
          breadcrumb: "List Room"
        }
      },    
      {
        path: 'add-room',
        component: AddRoomComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Room",
          breadcrumb: "Add Room"
        }
      }, 
      {
        path: 'edit-room/:id',
        component: EditRoomComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Room",
          breadcrumb: "Edit Room"
        }
      }, 
      {
        path: 'list-room-texture',
        component: ListRoomTextureComponent,canActivate: [AuthGuard],
        data: {
          title: "List Room Texture",
          breadcrumb: "List Room Texture"
        }
      },
      {
        path: 'add-room-texture',
        component: AddRoomTextureComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Room Texture",
          breadcrumb: "Add Room Texture"
        }
      },
      {
        path: 'edit-room-texture/:id',
        component: EditRoomTextureComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Room Texture",
          breadcrumb: "Edit Room Texture"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
