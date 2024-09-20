import {ComponentFixture, fakeAsync, TestBed, waitForAsync} from '@angular/core/testing';

import {QuestionPage} from './question.page';
import {provideIonicAngular} from "@ionic/angular/standalone";
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {QuestionService} from "../../services/question.service";
import {provideMockStore} from "@ngrx/store/testing";
import {QuestionServiceMock} from "../../services/mock/question-service-mock";

describe('QuestionPage', () => {
  let component: QuestionPage;
  let fixture: ComponentFixture<QuestionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuestionPage],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(),
        {provide: QuestionService, useClass: QuestionServiceMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));
});
