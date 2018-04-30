import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MountainComponent} from './mountain/mountain.component';

const routes: Routes = [
    { path: 'app', component: MountainComponent },
    // { path: 'templates/script', component: MessageComponent },
    // { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
