import {LatLng} from 'leaflet';

export class Question {
    id: number
    tourId: number;
    latLng: LatLng;
    place: string;
    intro: string;
    question: string;
    answers: Array<string>;
    hint: string;
    trivia: string;
}