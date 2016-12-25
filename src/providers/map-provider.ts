import { Injectable } from '@angular/core';
import { Platform, Loading } from 'ionic-angular';
import * as L from 'leaflet';
import { Map, Marker, LatLng, Circle, LocationEvent, TileLayer } from 'leaflet';
import { CenterControl } from '../classes/center-control'

export const DEFAULT_ZOOM = 16;

@Injectable()
export class MapProvider {
    map: Map;
    private tileLayer: TileLayer;
    private latLng: LatLng;
    private posCircle: Circle;
    private posMarker: Marker;
    private centering: Boolean;

    constructor(private platform: Platform) {
    }

    public startMapProvider(loader: Loading) {
        let options = {watch: true, enableHighAccuracy: true};
        let centerControl = new CenterControl({position: 'bottomright'});

        this.tileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 19
        }).addTo(this.map);
        
        this.tileLayer.once('load', () => { loader.dismiss() });
        
        centerControl.addTo(this.map);
        L.DomEvent.on(centerControl.getContainer(), {click: this.startCentering});
        
        this.map.locate(options)
        this.map.on('locationfound', this.positionFound);
        
        this.map.once('locationfound', this.startCentering);
    }
    
    public adjustMap(): void {
        this.map.invalidateSize(true);
        this.startCentering();
    }

    private positionFound = (e: LocationEvent) => {
        if (this.platform.is('core')) {
            this.latLng = L.latLng(49.484381,8.471704);
            this.showPosition(10);
        } else {
            this.latLng = e.latlng;
            this.showPosition(e.accuracy / 2);
        }
        
        if(this.centering)
            this.map.setView(this.latLng, DEFAULT_ZOOM);
    }

    private showPosition(radius: number) {
        if (this.posMarker === undefined) {
            this.posMarker = L.marker(this.latLng);
            this.posMarker.addTo(this.map);

            this.posCircle = L.circle(this.latLng, radius);
            this.posCircle.addTo(this.map);

            this.map.setView(this.latLng, this.map.getZoom());
        }
        
        this.posMarker.setLatLng(this.latLng);
        this.posCircle.setLatLng(this.latLng);
        this.posCircle.setRadius(radius);
    }
    
    private startCentering = () => {
        if (this.latLng !== undefined) {
            this.map.setView(this.latLng, DEFAULT_ZOOM);
            this.map.once('movestart zoomstart', this.stopCentering);
        }
        this.centering = true;
    }
    
    private stopCentering = () => {
        this.centering = false;
    }
}