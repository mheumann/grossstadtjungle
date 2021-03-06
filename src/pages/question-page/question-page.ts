import { NavController, AlertController } from 'ionic-angular';
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
    answered: boolean
    attempts: number = 0;
    errorMessage: string = '';

    constructor(private navCtrl: NavController, private questionProvider: QuestionProvider, private alertCtrl: AlertController) {
        this.question = this.questionProvider.closestQuestion;
    }

    checkAnswer(): void {
        if (_.includes(this.question.answers, this.answer.toLowerCase())) {
            this.answered = true;
        } else {
            this.errorMessage = '"' + this.answer + '" ist leider falsch.'
            this.attempts++;
        }
    }

    showHint(): void {
        let alert = this.alertCtrl.create({
            title: 'Tipp',
            subTitle: this.question.hint,
            buttons: ['Verstanden']
        });
        alert.present();
    }

    backToMap(): void {
        let tourStatus: number;

        tourStatus = this.questionProvider.setNextQuestion();

        if (tourStatus == 0) {
            let alert = this.alertCtrl.create({
                title: 'Glückwunsch',
                subTitle: 'Du hast alle Fragen richtig beantwortet und hoffentlich einen guten Überblick über die Stadt bekommen.',
                buttons: ['Ok']
            });
            alert.present().then(() => this.navCtrl.popTo(MapPage));
        } else {
            this.navCtrl.popTo(MapPage);
        }
    }
}