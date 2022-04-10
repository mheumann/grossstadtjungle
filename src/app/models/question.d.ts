import {LatLng} from 'leaflet';

export interface Question {
    id: number;
    tourId: number;
    latLng: LatLng;
    place: string;
    intro: string;
    question: string;
    answers: Array<string>;
    hint: string;
    trivia: string;
}
