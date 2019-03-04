import { Injectable } from '@angular/core';
import { Entity } from './entity.model';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  entities: Entity[]

  constructor() { }

  getEntities(): Entity[] {
    return this.entities
  }

  getEntityByIndex(index: number): Entity {
    return this.entities[index]
  }
}
