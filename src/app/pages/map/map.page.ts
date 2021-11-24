import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {LoadingController, ViewDidEnter} from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, ViewDidEnter {
  private map: L.Map;
  private tileLayer: L.TileLayer;
  private latLng: L.LatLng;
  private posCircle: L.Circle;
  private posMarker: L.Marker;
  private centering: boolean;

  constructor(private loadingCtrl: LoadingController) {
  }

  ngOnInit(): void {
  }

  ionViewDidEnter(): void {
    this.map = L.map('map').setView([49.48716, 8.46625], 13);
    this.tileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
        ' &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      maxZoom: 19
    }).addTo(this.map);

    this.map.locate({watch: true, enableHighAccuracy: true});
    this.map.on('locationfound', this.positionFound);

    this.map.once('locationfound', this.startCentering);

    if (Capacitor.isNativePlatform()) {
      Geolocation.checkPermissions().then(this.handlePermissionStatus);
    } else {
      this.startLocating(true);
    }
  }

  private positionFound = (e: L.LocationEvent) => {
    if (!Capacitor.isNativePlatform()) {
      this.latLng = L.latLng(49.48406, 8.475554);
      this.showPosition(10);
    } else {
      this.latLng = e.latlng;
      this.showPosition(e.accuracy / 2);
    }

    if (this.centering) {
      this.map.setView(this.latLng, DEFAULT_ZOOM);
    }
  };

  private handlePermissionStatus = (status: PermissionStatus) => {
    switch (status.location) {
      case 'prompt' || 'prompt-with-rationale':
        Geolocation.requestPermissions({permissions: ['location']}).then(this.handleGeolocationStatus);
        break;
      case 'granted':
      default:
        this.handleGeolocationStatus(status);
    }
  };

  private handleGeolocationStatus = (status: PermissionStatus) => {
    if (status.location === 'granted') {
      this.startLocating(true);
    } else {
      alert('Du musst der App Zugriff auf deinen Standort geben!');
    }
  };

  private startLocating(status: boolean) {
    console.log('Info: startLocating(' + status + ') wird ausgeführt.');
    const options: L.LocateOptions = {watch: true, enableHighAccuracy: true};

    this.map.locate(options);
    this.map.on('locationfound', this.positionFound);

    this.map.once('locationfound', this.startCentering);
  }

  private showPosition(radius: number) {
    if (this.posMarker === undefined) {
      this.posMarker = L.marker(this.latLng, {icon: new L.Icon.Default({imagePath: '/assets/leaflet/'})});
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
  };

  private stopCentering = () => {
    this.centering = false;
  };

}

const questionMarkerIcon = L.icon({
  iconUrl: '/assets/leaflet/q-marker-icon.png',
  iconRetinaUrl: '/assets/leaflet/q-marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'questionMarker'
});

const questionMarkerAnimated = L.icon({
  iconUrl: '/assets/leaflet/q-marker-animated.gif',
  iconRetinaUrl: '/assets/leaflet/q-marker-animated-2x.gif',
  iconSize: [25, 46],
  iconAnchor: [12, 46],
  className: 'questionMarkerAnimated'
});

const DEFAULT_ZOOM = 16;
