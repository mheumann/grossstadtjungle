import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import {Platform, Loading, AlertController } from 'ionic-angular';
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

    constructor(private platform: Platform, private diagnostic: Diagnostic, public alertCtrl: AlertController) {
    }

    public startMapProvider(loader: Loading) {
        console.log("Info: startMapProvider wird ausgeführt.");
        let centerControl = new CenterControl({position: 'bottomright'});

        this.tileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 19
        }).addTo(this.map);
        
        this.tileLayer.once('load', () => { loader.dismiss() });
        
        centerControl.addTo(this.map);
        L.DomEvent.on(centerControl.getContainer(), {click: this.startCentering});
    }
    
    public adjustMap(): void {
        this.map.invalidateSize(true);
        this.startCentering();
        
        if (!this.platform.is('core')) {
            this.diagnostic.getLocationAuthorizationStatus().then(this.handlePermissionStatus);
        } else {
            this.startLocating(true);
        }
    }
    
    private handlePermissionStatus = (status: any) => {
        switch(status) {
            case this.diagnostic.permissionStatus.NOT_REQUESTED:
                this.diagnostic.requestLocationAuthorization().then(this.handleGeolocationStatus);
                break;
            case this.diagnostic.permissionStatus.GRANTED:
            case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            default: this.handleGeolocationStatus(this.diagnostic.permissionStatus.GRANTED);
        }
    }
    
    private handleGeolocationStatus = (status: any) => {
        if (status == this.diagnostic.permissionStatus.GRANTED || status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
            this.diagnostic.isLocationEnabled().then(this.startLocating)
        } else {
            alert("Du musst der App Zugriff auf deinen Standort geben!");
        }
    }
    
    private startLocating = (status: boolean) => {
        console.log("Info: startLocating("+status+") wird ausgeführt.");
        let options = {watch: true, enableHighAccuracy: true};
        
        if (!status) {
            this.showGpsAlert();
        }
        this.map.locate(options)
        this.map.on('locationfound', this.positionFound);

        this.map.once('locationfound', this.startCentering);
    }

    private positionFound = (e: LocationEvent) => {
        console.log("Info: positionFound wird ausgeführt.");
        if (this.platform.is('core')) {
            this.latLng = L.latLng(49.48406,8.475554);
            this.showPosition(10);
        } else {
            this.latLng = e.latlng;
            this.showPosition(e.accuracy / 2);
        }
        
        console.log("Info: this.centering = "+this.centering);
        if(this.centering)
            this.map.setView(this.latLng, DEFAULT_ZOOM);
    }

    private showPosition(radius: number) {
        console.log("Info: showPosition wird ausgeführt.");
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
            this.map.once('dragstart zoomstart', this.stopCentering);
        }
        this.centering = true;
    }
    
    private stopCentering = () => {
        this.centering = false;
    }
    
    public showGpsAlert() {
        let gpsAlert = this.alertCtrl.create({
            title: 'Dein GPS ist nicht aktiviert!',
            subTitle: 'Bitte aktiviere im nächsten Schritt dein GPS und kehre dann zurück in die App.',
            buttons: [{
                text: 'Abbrechen',
            },
            {
                text: 'Ok',
                handler: data => {
                    console.log(data);
                    this.diagnostic.switchToLocationSettings();
                }
            }],
        });
        gpsAlert.present();
    }
}