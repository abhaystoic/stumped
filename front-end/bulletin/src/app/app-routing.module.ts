import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeadlinesComponent } from './headlines/headlines.component';


const routes: Routes = [
  {path: '', component: HeadlinesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
