import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { MapPage } from '../pages/map-page/map-page';
import { MapProvider} from '../providers/map-provider';
import { QuestionProvider} from '../providers/question-provider';
import { QuestionPage } from '../pages/question-page/question-page';

@NgModule({
    declarations: [
        MyApp,
        MapPage,
        QuestionPage
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MapPage,
        QuestionPage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        MapProvider,
        QuestionProvider
    ]
})
export class AppModule { }
