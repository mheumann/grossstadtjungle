import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {LoadingController, NavController, ViewDidEnter} from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';
import {Map, LocationEvent, Marker, TileLayer, LatLng, Circle, LatLngTuple} from 'leaflet';
import {QuestionProviderService} from '../../services/question-provider.service';
import {Question} from '../../models/question';
import {CenterControl} from '../../components/center-control';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, ViewDidEnter {
  private static userPos: LatLngTuple = [49.486409, 8.462112];
  private map: Map;
  private tileLayer: TileLayer;
  private latLng: LatLng;
  private posCircle: Circle;
  private posMarker: Marker;
  private questionMarker: Marker;
  private centering: boolean;

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private questionProvider: QuestionProviderService) {
  }

  ngOnInit(): void {
    this.map = L.map('map');
    this.tileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
        ' &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      maxZoom: 19
    }).addTo(this.map);

    const centerControl = new CenterControl({position: 'bottomright'});
    centerControl.addTo(this.map);
    L.DomEvent.on(centerControl.getContainer(), {click: this.startCentering});

    this.questionMarker = L.marker([0, 0], {icon: questionMarkerIcon});

    if (this.questionProvider.closestQuestion !== undefined) {
      this.questionMarker.setLatLng(this.questionProvider.closestQuestion.latLng);
    }
  }

  ionViewDidEnter(): void {
    this.map.setView(MapPage.userPos, 13);
    this.map.locate({watch: true, enableHighAccuracy: true});
    this.map.on('locationfound', this.positionFound);

    this.map.once('locationfound', this.startCentering);

    if (Capacitor.isNativePlatform()) {
      Geolocation.checkPermissions().then(this.handlePermissionStatus);
    } else {
      this.startLocating();
    }
  }

  private initializeQuestionMarker(question: Question): void {
    this.questionMarker.setLatLng(question.latLng);
    this.questionMarker.addTo(this.map);
  }

  private startLocating() {
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


  private positionFound = (e: L.LocationEvent) => {
    if (!Capacitor.isNativePlatform()) {
      this.latLng = L.latLng(MapPage.userPos);
      this.showPosition(10);
    } else {
      this.latLng = e.latlng;
      this.showPosition(e.accuracy / 2);
    }

    if (this.centering) {
      this.map.setView(this.latLng, DEFAULT_ZOOM);
    }
    this.getQuestionDistance(e);
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
      this.startLocating();
    } else {
      alert('Du musst der App Zugriff auf deinen Standort geben!');
    }
  };

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

  private getQuestionDistance = (e: LocationEvent) => {
    const userLatLng = (Capacitor.isNativePlatform()) ? e.latlng : L.latLng(MapPage.userPos);
    const questionLatLng = this.questionMarker.getLatLng();

    if (questionLatLng.lat === 0 && questionLatLng.lng === 0) {
      this.questionProvider.getClosestQuestionPromise(userLatLng).then(question => this.initializeQuestionMarker(question));
    }

    const distance2user = this.map.distance(userLatLng, questionLatLng);
    if (distance2user < 10) {
      this.questionMarker.setIcon(questionMarkerAnimated);
      this.questionMarker.on('click', () => this.navCtrl.navigateForward('question'));
    } else {
      this.questionMarker.setIcon(questionMarkerIcon);
      this.questionMarker.off('click');
    }
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
