import { Injectable } from '@angular/core';
import { Question } from '../classes/question';
import { QUESTIONS } from '../mock-tour';
import { LatLng } from 'leaflet';
import { Storage } from '@ionic/storage';

@Injectable()
export class QuestionProvider {
    closestQuestion: Question;
    allQuestions: Array<Question>;
    private firstQuestionId: number;
    
    constructor(private storage: Storage) {
        this.allQuestions = QUESTIONS;
        
        if (this.storage.length() != 0) {
            this.storage.get('firstId').then(firstId => { this.firstQuestionId = firstId; });
            this.storage.get('curId').then(curId => { this.closestQuestion = this.allQuestions[curId]; });
        }
    }
    
    getQuestions(): Promise<Question[]> {
        return Promise.resolve(this.allQuestions);
    }
    
    private calculateClosestQuestion(curPos: LatLng): void {
        let closest_question: Question;
        let distance: number;
        let smallest_distance: number = 999999999;
        
        for (let question of this.allQuestions) {
            distance = Math.pow((question.latLng.lat - curPos.lat), 2) + Math.pow((question.latLng.lng - curPos.lng), 2);
            if (distance < smallest_distance) {
                smallest_distance = distance;
                closest_question = question;
            }
        }
        
        this.closestQuestion = closest_question;
        this.firstQuestionId = this.closestQuestion.id;
        this.storage.set('curId', this.closestQuestion.id);
        this.storage.set('firstId', this.closestQuestion.id);
    }
    
    public getClosestQuestionPromise(curPos: LatLng): Promise<Question> {
        if (this.closestQuestion === undefined)
            this.calculateClosestQuestion(curPos);
        return Promise.resolve(this.closestQuestion);
    }
    
    public setNextQuestion(): number {
        let tourStatus: number = 1;
        
        if ((this.closestQuestion.id + 1) == this.allQuestions.length) {
            this.closestQuestion = this.allQuestions[0];
        } else {
            this.closestQuestion = this.allQuestions[this.closestQuestion.id + 1];
        }
        
        this.storage.set('curId', this.closestQuestion.id);
        
        if (this.closestQuestion.id == this.firstQuestionId) {
            tourStatus = 0;
        }
        return tourStatus;
    }
}