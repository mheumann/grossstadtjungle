import { NavController, Platform } from 'ionic-angular';
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
    
    constructor(private navCtrl: NavController, private platform: Platform, private mapProvider: MapProvider, private questionProvider: QuestionProvider) {
        this.questionMarker = L.marker([0, 0]);
    }

    ionViewWillEnter() {
        let map = L.map('map', {
            zoom: 13,
        });
        
        this.mapProvider.map = map;
        
        this.mapProvider.startMapProvider();
        
        this.mapProvider.map.on('locationfound', this.getQuestionDistance);
    }
    
    private getQuestionDistance = (e: LocationEvent) => {
        let distance2user: number;
        let latLng = e.latlng;
        
        if (this.platform.is('core'))
            latLng = L.latLng(49.484381,8.471704);
        
        if (this.questionMarker.getLatLng().lat === 0 && this.questionMarker.getLatLng().lng === 0)
            this.questionProvider.getClosestQuestionPromise(latLng).then(question => this.setQuestionMarker(question));
        
        distance2user = this.mapProvider.map.distance(latLng, this.questionMarker.getLatLng());
        if(distance2user < 10) {
            //TODO: Show Quiz/Question
        }
    }

    private setQuestionMarker(question: Question): void {
        this.questionMarker = L.marker(question.latLng);
        this.questionMarker.addTo(this.mapProvider.map);
        this.questionMarker.on('click', this.pushQuestionPage)
    }
    
    private pushQuestionPage = () => {
        this.navCtrl.push(QuestionPage);
    }
}