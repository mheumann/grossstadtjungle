import {Component, OnDestroy} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Question} from '../../models/question';
import {QuestionService} from '../../services/question.service';
import {Subscription} from 'rxjs';

@Component({
  templateUrl: './question.page.html',
  styleUrls: ['question.page.scss']
})
export class QuestionPage implements OnDestroy {
  question: Question;
  answer = '';
  answered = false;
  attempts = 0;
  errorMessage = '';
  private questionSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private questionService: QuestionService,
    private alertCtrl: AlertController
  ) {
    this.questionSubscription = this.questionService.currentQuestion$.subscribe(question => this.question = question);
  }

  checkAnswer(): void {
    if (this.questionService.isCorrectAnswer(this.answer, this.question.answers)) {
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
    await alert.present();
  }

  async backToMap(): Promise<void> {
    this.questionService.setNextQuestion();
    await this.navCtrl.navigateBack('map');
  }

  ngOnDestroy(): void {
    this.questionSubscription.unsubscribe();
  }
}
