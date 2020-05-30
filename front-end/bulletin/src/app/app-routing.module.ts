import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Covid19Component } from './covid19/covid19.component';
import { HeadlinesComponent } from './headlines/headlines.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: 'headlines', component: HeadlinesComponent},
  {path: 'covid19', component: Covid19Component},
  {path: '',   redirectTo: '/headlines', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
