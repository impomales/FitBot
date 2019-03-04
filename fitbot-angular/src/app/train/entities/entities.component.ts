import {Component, OnInit} from '@angular/core'
import {Entity} from './entity.model'
import {EntityService} from './entity.service'

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {
  entities: Entity[]

  constructor(private entityService: EntityService) {}

  ngOnInit() {
    this.getEntities()
  }

  getEntities() {
    this.entities = this.entityService.getEntities()
  }
}
