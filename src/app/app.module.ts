import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {StoreModule} from '@ngrx/store';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MapPage} from './pages/map/map.page';
import {QuestionPage} from './pages/question/question.page';
import {reducers, metaReducers} from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { TourEffects } from './store/effects/tour.effects';
import {HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent, MapPage, QuestionPage],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([TourEffects])
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
