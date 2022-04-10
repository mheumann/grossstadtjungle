import {Component} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Question} from '../../models/question';
import {QuestionProviderService} from '../../services/question-provider.service';

@Component({
  templateUrl: './question.page.html',
  styleUrls: ['question.page.scss']
})
export class QuestionPage {
  question: Question;
  answer = '';
  answered = false;
  attempts = 0;
  errorMessage = '';

  constructor(
    private navCtrl: NavController,
    private questionProviderService: QuestionProviderService,
    private alertCtrl: AlertController
  ) {
    this.question = this.questionProviderService.closestQuestion;
  }

  checkAnswer(): void {
    if (this.question.answers.includes(this.answer.toLowerCase())) {
      this.answered = true;
    } else {
      this.errorMessage = '"' + this.answer + '" ist leider falsch.';
      this.attempts++;
    }
  }

  async showHint(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Tipp',
      subHeader: this.question.hint,
      buttons: ['Verstanden']
    });
    alert.present();
  }

  async backToMap(): Promise<void> {
    const tourStatus = this.questionProviderService.setNextQuestion();

    if (tourStatus === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Glückwunsch',
        subHeader: 'Du hast alle Fragen richtig beantwortet und hoffentlich einen guten Überblick über die Stadt bekommen.',
        buttons: ['Ok']
      });
      alert.present().then(() => this.navCtrl.navigateBack('map'));
    } else {
      await this.navCtrl.navigateBack('map');
    }
  }
}
