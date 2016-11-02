import {Nav} from 'ionic-angular';
import {Component} from '@angular/core';
import * as L from 'leaflet';
import {MapProvider} from '../../providers/map-provider';

@Component({
    templateUrl: './map-page.html'
})
export class MapPage {
    constructor(private nav: Nav, private mapProvider: MapProvider) { }

    ionViewWillEnter() {
        let map = L.map('map', {
            zoom: 13,
        });
        
        this.mapProvider.map = map;
        
        this.mapProvider.startMapProvider();
    }
}