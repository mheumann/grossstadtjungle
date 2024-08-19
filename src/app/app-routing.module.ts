import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {MapPage} from './pages/map/map.page';
import {QuestionPage} from './pages/question/question.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'map'
  }, {
    path: 'map',
    component: MapPage
  }, {
    path: 'question',
    component: QuestionPage
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
