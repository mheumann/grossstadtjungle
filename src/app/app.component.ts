import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import {MapPage} from '../pages/map-page/map-page';

@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    private rootPage: any;

    constructor(platform: Platform, private statusBar: StatusBar) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();

            this.rootPage = MapPage;
        });
    }
}
