import {Page} from 'ionic-angular';
import * as L from "leaflet";
import {Map} from 'leaflet';

@Page({
    templateUrl: 'build/pages/map-page/map-page.html'
})
export class MapPage {
    private map: Map;
    
    constructor() { }

    onPageWillEnter() {
        this.map = L.map('map');

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 18
        }).addTo(this.map);
    }
    
    onPageDidEnter() {
        L.marker([51.505, -0.09]).addTo(this.map);
        this.map.setView([51.505, -0.09], 13);
    }
}