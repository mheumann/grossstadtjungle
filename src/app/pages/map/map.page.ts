import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Circle, LatLng, LatLngTuple, Map, Marker, TileLayer} from 'leaflet';
import {AlertController, LoadingController, NavController, ViewDidEnter, ViewDidLeave} from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';
import {QuestionService} from '../../services/question.service';
import {CenterControl} from '../../components/center-control';
import {filter, takeUntil, takeWhile, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TourStateEnum} from '../../enums/tour-state-enum';
import {TourLoadStatusEnum} from '../../enums/tour-load-status-enum';
import {Question} from '../../models/question';
import {environment} from '../../../environments/environment';

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
  private centerControl: CenterControl;
  private centering: boolean;
  private destroy$ = new Subject();

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private questionProvider: QuestionService,
              private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.map = L.map('map');
    this.tileLayer = L.tileLayer(environment.mapTileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
        ' &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
      maxZoom: 19
    }).addTo(this.map);

    this.centerControl = new CenterControl({position: 'bottomright'});
    this.centerControl.addTo(this.map);
    L.DomEvent.on(this.centerControl.getContainer(), {click: this.startCentering});

    this.questionMarker = L.marker([0, 0],
      {icon: questionMarkerIcon, opacity: 0, zIndexOffset: 999})
      .addTo((this.map));

    this.questionProvider.loadTour();
  }

  ionViewDidEnter(): void {
    this.map.setView(MapPage.userPos, DEFAULT_ZOOM);

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

  private async startLocating() {
    const options: L.LocateOptions = {watch: true, enableHighAccuracy: true};

    const loading = await this.loadingCtrl.create({message: 'Loading questions'});
    await loading.present();

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
      this.map.setView(this.latLng, this.map.getZoom());
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
      this.map.setView(this.latLng, DEFAULT_ZOOM, {easeLinearity: 0.9, animate: true});
      this.map.once('dragstart zoomstart', this.stopCentering);
    }
    this.centering = true;
    this.toggleActiveCenterControl();
  };

  private stopCentering = () => {
    this.centering = false;
    this.toggleActiveCenterControl();
  };

  private initializePlayground = async (e: L.LocationEvent) => {
    const userLatLng = (Capacitor.isNativePlatform()) ? e.latlng : L.latLng(MapPage.userPos);
    this.startCentering();

    this.questionProvider.tourLoadStatus$.pipe(
      filter(state => state === TourLoadStatusEnum.loading),
      takeWhile(state => state === TourLoadStatusEnum.loading)
    ).subscribe();

    this.questionProvider.currentQuestion$.pipe(
      takeUntil(this.destroy$),
      tap(question => {
        if (!question) {
          this.questionProvider.calculateClosestQuestion(userLatLng);
        }
      }),
      filter(question => !!question)
    ).subscribe(question => this.handleCurrentQuestion(question, userLatLng));
  };

  private handleCurrentQuestion(question: Question, userLatLng: LatLng) {
    this.questionMarker.setLatLng(question.latLng);
    this.questionMarker.setOpacity(1);
    this.handlePositionChange2Marker(userLatLng);
    this.loadingCtrl.getTop().then(loading => loading.dismiss());
  }

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

  private toggleActiveCenterControl() {
    return this.centerControl.getContainer().querySelector('ion-icon').classList.toggle('gsj-active');
  }
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

const DEFAULT_ZOOM = 17;
