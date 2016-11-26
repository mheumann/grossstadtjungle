import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
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
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        MapProvider,
        QuestionProvider
    ]
})
export class AppModule { }
