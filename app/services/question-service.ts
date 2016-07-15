import {Injectable} from '@angular/core';
import {Question} from '../classes/question';
import {QUESTIONS} from '../mock-tour';

@Injectable()
export class QuestionService {
    constructor() { }
    
    getQuestions(): Promise<Question[]> {
        return Promise.resolve(QUESTIONS);
    }
}