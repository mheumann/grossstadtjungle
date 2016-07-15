import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Map, Marker, LatLng, Circle} from 'leaflet';
import {Question} from '../classes/question';
import {QuestionService} from './question-service';

@Injectable()
export class MapService {
    map: Map;
    private latLng: LatLng;
    private watchId: number;
    private posCircle: Circle;
    private posMarker: Marker;
    private questionMarker: Marker;

    constructor(private questionService: QuestionService) {
    }

    startMapService() {
        let options = { timeout: 10000, enableHighAccuracy: true };

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 19
        }).addTo(this.map);

        this.watchId = navigator.geolocation.watchPosition((position) => this.positionFound(position), (error: PositionError) => {
            console.log(error);
        }, options);
    }

    private positionFound(curPos: Position) {
        this.latLng = new L.LatLng(curPos.coords.latitude, curPos.coords.longitude);

        this.showPosition(curPos.coords.accuracy / 2);

        this.questionService.getQuestions().then(questions => this.setClosestQuestion(questions));
        //TODO: Caclulate distance
        //TODO: Show quiz
    }

    private showPosition(radius: number) {
        if (this.posMarker === undefined) {
            this.posMarker = L.marker(this.latLng);
            this.posMarker.addTo(this.map);

            this.posCircle = L.circle(this.latLng, radius);
            this.posCircle.addTo(this.map);

            this.map.setView(this.latLng);
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