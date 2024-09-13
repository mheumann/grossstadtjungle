import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Circle, LatLng, LatLngTuple, Map, Marker, TileLayer} from 'leaflet';
import { AlertController, ViewDidEnter, ViewDidLeave, IonicModule } from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
import {QuestionService} from '../../services/question.service';
import {CenterControl} from '../../components/center-control';
import {filter, take, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TourStateEnum} from '../../enums/tour-state-enum';
import {Question} from '../../models/question';
import {environment} from '../../../environments/environment';
import {Router} from "@angular/router";
import {PermissionService} from "../../services/permission.service";

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
    standalone: true,
    imports: [IonicModule],
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

  constructor(private router: Router,
              private permissionService: PermissionService,
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
      this.permissionService.checkGeolocationPermission().pipe(take(1)).subscribe((granted) => {
        if (granted) {
          this.startLocating();
        }
      });
    } else {
      this.questionProvider.tourState$.pipe(
        takeUntil(this.destroy$),
        tap(state => state === TourStateEnum.completed ? this.handleTourComplete() : this.startLocating())
      ).subscribe();
    }

    this.questionProvider.currentQuestion$.pipe(
      takeUntil(this.destroy$),
      filter(question => !!question)
    ).subscribe(question => this.drawQuestionMarker(question));
  }

  ionViewDidLeave(): void {
    this.destroy$.next(true);
  }

  private startLocating() {
    const options: L.LocateOptions = {watch: true, enableHighAccuracy: true};

    this.map.locate(options);
    this.map.on('locationfound', this.positionFound);

    this.initializePlayground();
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

      this.posCircle = L.circle(this.latLng, {radius});
      this.posCircle.addTo(this.map);

      this.map.setView(this.latLng, this.map.getZoom());
    }

    this.posMarker.setLatLng(this.latLng);
    this.posCircle.setLatLng(this.latLng);
    this.posCircle.setRadius(radius);
  }

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

  private initializePlayground(): void {
    this.startCentering();

    this.questionProvider.currentQuestion$.pipe(
      take(1),
      filter(question => !question)
    ).subscribe(() =>
      this.map.once('locationfound', (e: L.LocationEvent) => this.questionProvider.calculateClosestQuestion(
        (Capacitor.isNativePlatform()) ? e.latlng : L.latLng(MapPage.userPos))
      )
    );
  };

  private drawQuestionMarker(question: Question) {
    this.questionMarker.setIcon(questionMarkerIcon);
    this.questionMarker.setLatLng(question.latLng);
    this.questionMarker.off('click');
    this.questionMarker.setOpacity(1);
  }

  private handlePositionChange2Marker(userLatLng: LatLng): void {
    const questionLatLng = this.questionMarker.getLatLng();

    const distance2user = this.map.distance(userLatLng, questionLatLng);
    if (distance2user < 10) {
      this.questionMarker.setIcon(questionMarkerAnimated);
      this.questionMarker.on('click', () => this.router.navigate(['/question']));
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
