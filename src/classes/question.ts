import {LatLng} from 'leaflet';

export class Question {
    id: number
    tourId: number;
    latLng: LatLng;
    question: string;
    answers: Array<string>;
    hint: string;
    trivia: string;
}