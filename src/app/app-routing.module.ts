import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {MapPage} from './pages/map/map.page';

const routes: Routes = [
  {
    path: 'map',
    component: MapPage
  }, {
    path: '',
    pathMatch: 'full',
    redirectTo: 'map'
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
