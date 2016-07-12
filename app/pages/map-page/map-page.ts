import {Page, Nav} from 'ionic-angular';
import * as L from 'leaflet';
import {Map, LatLng, Marker, Circle} from 'leaflet';
import {MapService} from '../../services/map-service';

@Page({
    templateUrl: 'build/pages/map-page/map-page.html',
    providers: [MapService]
})
export class MapPage {
    constructor(private nav: Nav, private mapService: MapService) { }

    onPageWillEnter() {
        let map = L.map('map', {
            zoom: 13,
        });
        
        this.mapService.map = map;
        
        this.mapService.startMapService();
    }
}