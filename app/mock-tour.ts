import {Question} from './classes/question';
import {LatLng} from 'leaflet';

export var QUESTIONS: Question[] = [{
    id: 0,
    orderNo: 0,
    tourId: 0,
    latLng: new LatLng(49.4773832, 8.4804203),
    question: 'Bist du behindert?',
    answers: ['Ja', 'J'],
    hint: 'Gibt es nicht',
    trivia: 'Linus ist auch behindert'
}];