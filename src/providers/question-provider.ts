import {Injectable} from '@angular/core';
import {Question} from '../classes/question';
import {QUESTIONS} from '../mock-tour';
import {LatLng} from 'leaflet';

@Injectable()
export class QuestionProvider {
    closestQuestion: Question;
    allQuestions: Array<Question>;
    constructor() { }
    
    getQuestions(): Promise<Question[]> {
        return Promise.resolve(this.allQuestions);
    }
    
    private calculateClosestQuestion(curPos: LatLng): void {
        let closest_question: Question;
        let distance: number;
        let smallest_distance: number = 999999999;
        
        this.allQuestions = QUESTIONS;
        
        for (let question of this.allQuestions) {
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
    
    public setNextQuestion(): void {
        if ((this.closestQuestion.id + 1) == this.allQuestions.length) {
            this.closestQuestion = this.allQuestions[0];
        } else {
            this.closestQuestion = this.allQuestions[this.closestQuestion.id + 1];
        }
    }
}