import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Map, Marker, LatLng, Circle, LocationEvent} from 'leaflet';
import {Question} from '../classes/question';
import {QuestionProvider} from './question-provider';
import { CenterControl } from '../classes/center-control'

@Injectable()
export class MapProvider {
    map: Map;
    private latLng: LatLng;
    private posCircle: Circle;
    private posMarker: Marker;
    private questionMarker: Marker;
    private centering: Boolean;

    constructor(private questionProvider: QuestionProvider) {
    }

    public startMapProvider() {
        let options = {watch: true, enableHighAccuracy: true};
        let centerControl = new CenterControl({position: 'bottomright'});

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 19
        }).addTo(this.map);
        
        centerControl.addTo(this.map);
        L.DomEvent.on(centerControl.getContainer(), {click: this.startCentering});
        
        this.map.locate(options)
        this.map.on('locationfound', this.positionFound);
        
        this.map.once('load', this.startCentering);
    }

    private positionFound = (e: LocationEvent) => {
        this.latLng = e.latlng;
        if(this.centering)
            this.map.setView(this.latLng, 15);

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

            this.map.setView(this.latLng, this.map.getZoom());
        }
        
        this.posMarker.setLatLng(this.latLng);
        this.posCircle.setLatLng(this.latLng);
        this.posCircle.setRadius(radius);
    }

    private setClosestQuestion(questions: Array<Question>) {
        let closest_question: Question;
        let distance: number;
        let smallest_distance: number = 999999999;
        for(let question of questions) {
            distance = (question.latLng.lat - this.latLng.lat) ** 2 + (question.latLng.lng - this.latLng.lng) ** 2
            if (distance < smallest_distance) {
                closest_question = question;
            }
        }
        this.questionMarker = L.marker(closest_question.latLng);
        this.questionMarker.addTo(this.map);
    }
    
    private startCentering = () => {
        this.map.setView(this.latLng, this.map.getZoom());
        this.map.once('movestart zoomstart', this.stopCentering);
        this.centering = true;
    }
    
    private stopCentering = () => {
        this.centering = false;
    }
}