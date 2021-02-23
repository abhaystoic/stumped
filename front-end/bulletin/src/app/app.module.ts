import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HeadlinesComponent } from './headlines/headlines.component';
import { Covid19Component } from './covid19/covid19.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TechnologyComponent } from './technology/technology.component';
import { SportsComponent } from './sports/sports.component';
import { EntertainmentComponent } from './entertainment/entertainment.component';
import { ScienceComponent } from './science/science.component';
import { BusinessComponent } from './business/business.component';
import { HealthComponent } from './health/health.component';
import { ArticleCardComponent } from './shared/article-card/article-card.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SearchComponent } from './search/search.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeadlinesComponent,
    SideNavComponent,
    Covid19Component,
    PageNotFoundComponent,
    TechnologyComponent,
    SportsComponent,
    EntertainmentComponent,
    ScienceComponent,
    BusinessComponent,
    HealthComponent,
    ArticleCardComponent,
    ContactUsComponent,
    AboutUsComponent,
    SearchComponent,
    MyProfileComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
