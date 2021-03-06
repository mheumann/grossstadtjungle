import { NavController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Component } from '@angular/core';
import * as L from 'leaflet';
import { Marker, LocationEvent } from 'leaflet';
import { Question } from '../../classes/question';
import { MapProvider } from '../../providers/map-provider';
import { QuestionProvider } from '../../providers/question-provider';
import { QuestionPage } from '../question-page/question-page';

@Component({
    templateUrl: './map-page.html'
})
export class MapPage {
    private questionMarker: Marker;
    private loader: Loading;

    constructor(private navCtrl: NavController, private platform: Platform, private mapProvider: MapProvider,
        private questionProvider: QuestionProvider, private loadingCtrl: LoadingController) {

        this.questionMarker = L.marker([0, 0], { icon: questionMarkerIcon });
        
        this.loader = this.loadingCtrl.create({
            content: 'Karte lädt...'
        });
    }

    ionViewDidLoad() {
        this.loader.present();
        
        let map = L.map('map', {
            zoom: 13,
            center: [49.48716,8.46625],
        });

        this.mapProvider.map = map;
        this.mapProvider.startMapProvider(this.loader);
    }
    
    ionViewWillEnter() {                        
        if (this.questionProvider.closestQuestion !== undefined)
            this.questionMarker.setLatLng(this.questionProvider.closestQuestion.latLng);
        
        this.mapProvider.map.on('locationfound', this.getQuestionDistance);
    }
    
    ionViewDidEnter() {
        this.mapProvider.adjustMap();
    }
    
    ionViewDidLeave() {
        this.mapProvider.map.off('locationfound');
    }

    private getQuestionDistance = (e: LocationEvent) => {
        let distance2user: number;
        let latLng = e.latlng;

        if (this.platform.is('core'))
            latLng = L.latLng(49.484381, 8.471704);

        if (this.questionMarker.getLatLng().lat === 0 && this.questionMarker.getLatLng().lng === 0)
            this.questionProvider.getClosestQuestionPromise(latLng).then(question => this.initializeQuestionMarker(question));

        distance2user = this.mapProvider.map.distance(latLng, this.questionMarker.getLatLng());
        if (distance2user < 10) {
            this.questionMarker.setIcon(questionMarkerAnimated);
            this.questionMarker.on('click', this.pushQuestionPage);
        } else {
            this.questionMarker.setIcon(questionMarkerIcon);
            this.questionMarker.off('click');
        }
    }

    private initializeQuestionMarker(question: Question): void {
        this.questionMarker.setLatLng(question.latLng);
        this.questionMarker.addTo(this.mapProvider.map);
    }

    private pushQuestionPage = () => {
        this.navCtrl.push(QuestionPage);
    }
}

export var questionMarkerIcon = L.icon({
    iconUrl: 'assets/images/q-marker-icon.png',
    iconRetinaUrl: 'assets/images/q-marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: 'questionMarker'
});

export var questionMarkerAnimated = L.icon({
    iconUrl: 'assets/images/q-marker-animated.gif',
    iconRetinaUrl: 'assets/images/q-marker-animated-2x.gif',
    iconSize: [25, 46],
    iconAnchor: [12, 46],
    className: 'questionMarkerAnimated'
});