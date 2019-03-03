import {Component, OnInit} from '@angular/core'
import {Entity, Value} from './entity.model'

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {
  entities: Entity[] = [
    new Entity('food', [new Value('pear', [])]),
    new Entity('quantity', [new Value('1', ['a', 'an'])]),
    new Entity('unit', [new Value('oz', ['ounce']), new Value('cup', []), new Value('lb', ['pound'])])
  ]

  constructor() {}

  ngOnInit() {}
}
