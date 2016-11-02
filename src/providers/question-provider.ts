import {Injectable} from '@angular/core';
import {Question} from '../classes/question';
import {QUESTIONS} from '../mock-tour';

@Injectable()
export class QuestionProvider {
    constructor() { }
    
    getQuestions(): Promise<Question[]> {
        return Promise.resolve(QUESTIONS);
    }
}