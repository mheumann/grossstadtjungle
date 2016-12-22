import { Question } from './classes/question';
import * as L from 'leaflet';
export var QUESTIONS: Question[] = [
    {
        id: 0,
        orderNo: 0,
        tourId: 0,
        latLng: L.latLng(49.48406,8.475544), //Wasserturm
        question: 'Bist du behindert?',
        answers: ['Ja', 'J'],
        hint: 'Gibt es nicht',
        trivia: 'Linus ist auch behindert'
    }, {
        id: 1,
        orderNo: 1,
        tourId: 0,
        latLng: L.latLng(49.4871628,8.466249299999959), //Paradeplatz
        question: 'Du bist nicht behindert?',
        answers: ['Ja', 'J'],
        hint: 'Gibt es nicht',
        trivia: 'Linus ist auch behindert'
    }
];