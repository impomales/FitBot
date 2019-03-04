import { Annotation } from '../train.model';

export class TrainingPhrase {
    constructor(public text: string, public annotations: Annotation[]) {}
}

export class Intent {
    constructor(public name: string, public trainingPhrases: TrainingPhrase[]) {}
}