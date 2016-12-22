import {Injectable} from '@angular/core';
import {Question} from '../classes/question';
import {QUESTIONS} from '../mock-tour';
import {LatLng} from 'leaflet';

@Injectable()
export class QuestionProvider {
    closestQuestion: Question;
    constructor() { }
    
    getQuestions(): Promise<Question[]> {
        return Promise.resolve(QUESTIONS);
    }
    
    private calculateClosestQuestion(curPos: LatLng): void {
        let closest_question: Question;
        let distance: number;
        let smallest_distance: number = 999999999;
        
        for(let question of QUESTIONS) {
            distance = Math.pow((question.latLng.lat - curPos.lat), 2) + Math.pow((question.latLng.lng - curPos.lng), 2);
            if (distance < smallest_distance) {
                smallest_distance = distance;
                closest_question = question;
            }
        }
        
        this.closestQuestion = closest_question;
    }
    
    public getClosestQuestionPromise(curPos: LatLng): Promise<Question> {
        if (this.closestQuestion === undefined)
            this.calculateClosestQuestion(curPos);
        return Promise.resolve(this.closestQuestion);
    }
}