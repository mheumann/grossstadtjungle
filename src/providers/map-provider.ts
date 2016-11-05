import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Map, Marker, LatLng, Circle, LocationEvent} from 'leaflet';
import {Question} from '../classes/question';
import {QuestionProvider} from './question-provider';

@Injectable()
export class MapProvider {
    map: Map;
    private latLng: LatLng;
    private posCircle: Circle;
    private posMarker: Marker;
    private questionMarker: Marker;

    constructor(private questionProvider: QuestionProvider) {
    }

    public startMapProvider() {
        let options = {watch: true, setView:true, enableHighAccuracy: true};

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 19
        }).addTo(this.map);
        
        this.map.locate(options).on('locationfound', this.positionFound);
    }

    private positionFound = (e: LocationEvent) => {
        this.latLng = e.latlng;

        this.showPosition(e.accuracy / 2);

        this.questionProvider.getQuestions().then(questions => this.setClosestQuestion(questions));
        //TODO: Caclulate distance
        //TODO: Show quiz
    }

    private showPosition(radius: number) {
        if (this.posMarker === undefined) {
            this.posMarker = L.marker(this.latLng);
            this.posMarker.addTo(this.map);

            this.posCircle = L.circle(this.latLng, radius);
            this.posCircle.addTo(this.map);

            this.map.setView(this.latLng, 15);
        }
        
        this.posMarker.setLatLng(this.latLng);
        this.posCircle.setLatLng(this.latLng);
        this.posCircle.setRadius(radius);
    }

    private setClosestQuestion(questions: Array<Question>) {
        this.questionMarker = L.marker(questions[0].latLng);
        this.questionMarker.addTo(this.map);
    }
}