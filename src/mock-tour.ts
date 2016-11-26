import { Question } from './classes/question';
import * as L from 'leaflet';
export var QUESTIONS: Question[] = [
    {
        id: 0,
        orderNo: 0,
        tourId: 0,
        latLng: L.latLng(49.4773832, 8.4804203),
        question: 'Bist du behindert?',
        answers: ['Ja', 'J'],
        hint: 'Gibt es nicht',
        trivia: 'Linus ist auch behindert'
    }, {
        id: 1,
        orderNo: 1,
        tourId: 0,
        latLng: L.latLng(50.126696, 9.0698183),
        question: 'Du bist nicht behindert?',
        answers: ['Ja', 'J'],
        hint: 'Gibt es nicht',
        trivia: 'Linus ist auch behindert'
    }
];