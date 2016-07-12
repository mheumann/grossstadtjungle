import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Map, Marker, LatLng, Circle} from 'leaflet';

@Injectable()
export class MapService {
    map: Map;
    private latLng: LatLng;
    private watchId: number;
    private posCircle: Circle;
    private posMarker: Marker;

    construct() { }

    startMapService() {
        let options = { timeout: 10000, enableHighAccuracy: true };

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 19
        }).addTo(this.map);

        navigator.geolocation.getCurrentPosition((curPos) => this.showInitialLocation(curPos), (error) => {
            console.log("Initial position locating failed");
            console.log(error);
        }, options);

        this.watchId = navigator.geolocation.watchPosition((position) => this.showInitialLocation(position), (error) => {
            console.log("Watch position failed");
            console.log(error);
        }, options);
    }

    private showInitialLocation(curPos: Position) {
        this.latLng = new L.LatLng(curPos.coords.latitude, curPos.coords.longitude);

        this.posMarker = L.marker(this.latLng);
        this.posMarker.addTo(this.map);

        this.posCircle = L.circle(this.latLng, curPos.coords.accuracy / 2);
        this.posCircle.addTo(this.map);

        this.map.setView(this.latLng);
    }

    private setPosition() {

    }
}