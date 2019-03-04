export interface Value {
  value: string
  synonyms: string[]
}

export interface Annotation {
  start: number
  end: number
  value: string
  entity: string
}

export interface Examples {
    intent: string
    text: string
    entities?: Annotation[]
}

export interface NluData {
  common_examples: Examples[]
  regex_features: any[]
  lookup_tables: any[]
  entity_synonyms: Value[]
}

export interface Train {
  rasa_nlu_data: NluData
}
