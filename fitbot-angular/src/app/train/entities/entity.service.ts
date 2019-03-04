import {Injectable} from '@angular/core'
import {Entity} from './entity.model'
import {TrainService} from '../train.service'

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  constructor(private trainService: TrainService) {}

  getEntities(): Entity[] {
    return this.trainService.entities
  }

  getEntityByIndex(index: number): Entity {
    return this.trainService.entities[index]
  }
}
