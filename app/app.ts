import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {MapPage} from './pages/map-page/map-page';
import {QuestionService} from './services/question-service'

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

    private rootPage: any;

    constructor(private platform: Platform) {
        platform.ready().then(() => {
            StatusBar.styleDefault();
            
            this.rootPage = MapPage;
        });
    }
}

ionicBootstrap(MyApp, [QuestionService])
