export class Annotation {
    constructor(public start: string, public end: string, public value: string, public entity: string) {}
}

export class TrainingPhrase {
    constructor(public text: string, public annotations: Annotation[]) {}
}

export class Intent {
    constructor(public name: string, public trainingPhrases: TrainingPhrase[]) {}
}