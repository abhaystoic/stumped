import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { Covid19Component } from './covid19/covid19.component';
import { BusinessComponent } from './business/business.component';
import { EntertainmentComponent } from './entertainment/entertainment.component';
import { HeadlinesComponent } from './headlines/headlines.component';
import { HealthComponent } from './health/health.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ScienceComponent } from './science/science.component';
import { SearchComponent } from './search/search.component';
import { SportsComponent } from './sports/sports.component';
import { TechnologyComponent } from './technology/technology.component';

const routes: Routes = [
  { path: 'about-us', component: AboutUsComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'covid19', component: Covid19Component },
  { path: 'entertainment', component: EntertainmentComponent },
  { path: 'headlines', component: HeadlinesComponent },
  { path: 'health', component: HealthComponent },
  { path: 'science', component: ScienceComponent },
  { path: 'search/:query', component: SearchComponent },
  { path: 'sports', component: SportsComponent },
  { path: 'technology', component: TechnologyComponent },
  { path: '',   redirectTo: '/headlines', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
