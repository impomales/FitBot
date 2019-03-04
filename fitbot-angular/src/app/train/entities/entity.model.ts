import { Value } from '../train.model';

export class Entity {
  constructor(public name: string, public values: Value[]) {}
}
