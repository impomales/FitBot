import {Annotation} from '../train.model'

export interface TrainingPhrase {
  text: string
  annotations: Annotation[]
}

export interface Intent {
  name: string
  trainingPhrases: TrainingPhrase[]
}
