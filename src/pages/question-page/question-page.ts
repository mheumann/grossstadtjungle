import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Question } from '../../classes/question';
import { QuestionProvider } from '../../providers/question-provider';
import { MapPage } from '../map-page/map-page';
import * as _ from 'lodash';

@Component({
    templateUrl: './question-page.html'
})
export class QuestionPage {
    question: Question;
    answer: string = '';
    answered: boolean;
    
    constructor(private navCtrl: NavController, private questionProvider: QuestionProvider) {
        this.question = this.questionProvider.closestQuestion;
    }
    
    checkAnswer(): void {
        if (_.includes(this.question.answers, this.answer)) {
            this.answered = true;
        }
    }
    
    backToMap(): void {
        this.questionProvider.setNextQuestion();
        this.navCtrl.popTo(MapPage);
    }
}