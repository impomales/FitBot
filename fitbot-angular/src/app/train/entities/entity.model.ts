export class Value {
  constructor(public name: string, public synonyms: string[]) {}
}

export class Entity {
  constructor(public name: string, public values: Value[]) {}
}
