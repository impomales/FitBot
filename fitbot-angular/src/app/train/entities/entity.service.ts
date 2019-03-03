import { Injectable } from '@angular/core';
import { Entity, Value } from './entity.model';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  entities: Entity[] = [
    new Entity('food', [new Value('pear', [])]),
    new Entity('quantity', [new Value('1', ['a', 'an'])]),
    new Entity('unit', [new Value('oz', ['ounce']), new Value('cup', []), new Value('lb', ['pound'])])
  ]

  constructor() { }

  getEntities(): Entity[] {
    return this.entities
  }

  getEntityByIndex(index: number): Entity {
    return this.entities[index]
  }
}
