import {Page, Nav} from 'ionic-angular';
import * as L from "leaflet";
import {Map, LatLng, Marker, Circle} from 'leaflet';

@Page({
    templateUrl: 'build/pages/map-page/map-page.html'
})
export class MapPage {
    private map: Map;
    private latLng: LatLng;
    private watchId: number;
    private posMarker: Marker;
    private posCircle: Circle;

    constructor(private nav: Nav) { }

    onPageWillEnter() {
        let options = { timeout: 10000, enableHighAccuracy: true };

        this.map = L.map('map', {
            zoom: 13
        });

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 19
        }).addTo(this.map);

        navigator.geolocation.getCurrentPosition((curPos) => this.showInitialLocation(curPos), (error) => {
            console.log("Initial position locating failed");
            console.log(error);
        }, options);

        this.watchId = navigator.geolocation.watchPosition((curPos) => {
            this.latLng = new L.LatLng(curPos.coords.latitude, curPos.coords.longitude);
            this.posMarker.setLatLng(this.latLng);
            this.posCircle.setLatLng(this.latLng);
            this.posCircle.setRadius(curPos.coords.accuracy / 2);
        }, (error) => {
            console.log(error);
        }, options);
    }

    showInitialLocation(curPos: Position) {
        this.latLng = new L.LatLng(curPos.coords.latitude, curPos.coords.longitude);

        this.posMarker = L.marker(this.latLng);
        this.posMarker.addTo(this.map);
        
        this.posCircle = L.circle(this.latLng, curPos.coords.accuracy / 2);
        this.posCircle.addTo(this.map);

        this.map.setView(this.latLng);
    }
}