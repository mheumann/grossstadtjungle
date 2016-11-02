import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { MapPage } from '../pages/map-page/map-page';
import { MapProvider} from '../providers/map-provider';
import { QuestionProvider} from '../providers/question-provider';

@NgModule({
    declarations: [
        MyApp,
        MapPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MapPage
    ],
    providers: [
        MapProvider,
        QuestionProvider
    ]
})
export class AppModule { }
