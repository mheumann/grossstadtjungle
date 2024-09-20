import {ComponentFixture, fakeAsync, TestBed, waitForAsync} from '@angular/core/testing';

import {MapPage} from './map.page';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideIonicAngular} from "@ionic/angular/standalone";
import {provideHttpClient} from "@angular/common/http";
import {provideMockStore} from "@ngrx/store/testing";
import {QuestionService} from "../../services/question.service";
import {QuestionServiceMock} from "../../services/mock/question-service-mock";
import {provideRouter} from "@angular/router";

describe('MapPage', () => {
  let component: MapPage;
  let fixture: ComponentFixture<MapPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MapPage],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(),
        {provide: QuestionService, useClass: QuestionServiceMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));
});
