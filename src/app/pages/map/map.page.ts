import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Circle, LatLng, LatLngTuple, Map, Marker, TileLayer} from 'leaflet';
import {AlertController, LoadingController, NavController, ViewDidEnter, ViewDidLeave} from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';
import {QuestionService} from '../../services/question.service';
import {CenterControl} from '../../components/center-control';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TourStateEnum} from '../../enums/tour-state-enum';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, ViewDidEnter, ViewDidLeave {
  public static userPos: LatLngTuple = [49.486409, 8.462112];
  private map: Map;
  private tileLayer: TileLayer;
  private latLng: LatLng;
  private posCircle: Circle;
  private posMarker: Marker;
  private questionMarker: Marker;
  private centering: boolean;
  private destroy$ = new Subject();

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private questionProvider: QuestionService,
              private alertCtrl: AlertController) {
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

    this.questionMarker = L.marker([0, 0],
      {icon: questionMarkerIcon, opacity: 0, zIndexOffset: 999})
      .addTo((this.map));

    this.questionProvider.loadTour();
  }

  ionViewDidEnter(): void {
    this.map.setView(MapPage.userPos, 13);

    if (Capacitor.isNativePlatform()) {
      Geolocation.checkPermissions().then(this.handlePermissionStatus);
    } else {
      this.questionProvider.tourState$.pipe(
        takeUntil(this.destroy$),
        tap(state => state === TourStateEnum.completed ? this.handleTourComplete() : this.startLocating())
      ).subscribe();
    }
  }

  ionViewDidLeave(): void {
    this.destroy$.next(true);
  }

  private startLocating() {
    const options: L.LocateOptions = {watch: true, enableHighAccuracy: true};

    this.map.locate(options);
    this.map.on('locationfound', this.positionFound);
    this.map.once('locationfound', this.initializePlayground);
  }

  private positionFound = (e: L.LocationEvent) => {
    const userLatLng = (Capacitor.isNativePlatform()) ? e.latlng : L.latLng(MapPage.userPos);

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

    this.handlePositionChange2Marker(userLatLng);
  };

  private async handleTourComplete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Glückwunsch',
      subHeader: 'Du hast alle Fragen richtig beantwortet und hoffentlich einen guten Überblick über die Stadt bekommen.',
      buttons: ['Ok']
    });
    await alert.present();

    this.questionMarker.removeFrom(this.map);
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

  private initializePlayground = (e: L.LocationEvent) => {
    const userLatLng = (Capacitor.isNativePlatform()) ? e.latlng : L.latLng(MapPage.userPos);
    this.startCentering();

    this.questionProvider.currentQuestion$.pipe(
      takeUntil(this.destroy$),
      tap(question => {
        if (!question) {
          this.questionProvider.calculateClosestQuestion(userLatLng);
        }
      }),
      filter(question => !!question)
    ).subscribe(question => {
      this.questionMarker.setLatLng(question.latLng);
      this.questionMarker.setOpacity(1);
      this.handlePositionChange2Marker(userLatLng);
    });
  };

  private handlePositionChange2Marker(userLatLng: LatLng): void {
    const questionLatLng = this.questionMarker.getLatLng();

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
