import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Question } from '../../classes/question';
import { QuestionProvider } from '../../providers/question-provider';

@Component({
    templateUrl: './question-page.html'
})
export class QuestionPage {
    question: Question;
    
    constructor(private navCtrl: NavController, private questionProvider: QuestionProvider) {
        this.question = this.questionProvider.closestQuestion;
    }
}