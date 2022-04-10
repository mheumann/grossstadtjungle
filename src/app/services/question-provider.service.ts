import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Question } from '../models/question';
import { LatLng } from 'leaflet';
import { QUESTIONS } from '../../mock-tour';

@Injectable({providedIn: 'root'})
export class QuestionProviderService {
    closestQuestion: Question;
    allQuestions: Array<Question>;
    private firstQuestionId: number;

    constructor() {
        this.allQuestions = QUESTIONS;
        Storage.keys().then(({keys}) => this.initializeVars(keys.length));
    }

    public getQuestions(): Promise<Question[]> {
        return Promise.resolve(this.allQuestions);
    }

    public getClosestQuestionPromise(curPos: LatLng): Promise<Question> {
        if (this.closestQuestion === undefined) {
          this.calculateClosestQuestion(curPos);
        }
        return Promise.resolve(this.closestQuestion);
    }

    public setNextQuestion(): number {
        let tourStatus = 1;

        if ((this.closestQuestion.id + 1) === this.allQuestions.length) {
            this.closestQuestion = this.allQuestions[0];
        } else {
            this.closestQuestion = this.allQuestions[this.closestQuestion.id + 1];
        }

        Storage.set({key: 'curId', value: String(this.closestQuestion.id)});

        if (this.closestQuestion.id === this.firstQuestionId) {
            tourStatus = 0;
        }
        return tourStatus;
    }

    private initializeVars(length: number) {
        if (length !== 0) {
            Storage.get({key: 'firstId'}).then(({value}) => this.firstQuestionId = Number(value));
            Storage.get({key: 'curId'}).then(({value}) => this.closestQuestion = this.allQuestions[value]);
        }
    }

    private calculateClosestQuestion(curPos: LatLng): void {
        let closestQuestion: Question;
        let distance: number;
        let smallestDistance = 999999999;

        for (const question of this.allQuestions) {
            distance = curPos.distanceTo(question.latLng);
            console.log(distance);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestQuestion = question;
            }
        }

        this.closestQuestion = closestQuestion;
        this.firstQuestionId = this.closestQuestion.id;
        Storage.set({key: 'curId', value: String(this.closestQuestion.id)});
        Storage.set({key: 'firstId', value: String(this.closestQuestion.id)});
    }
}
