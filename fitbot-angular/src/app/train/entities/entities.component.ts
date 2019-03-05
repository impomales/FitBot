import {Component, OnInit, DoCheck} from '@angular/core'
import {Entity} from './entity.model'
import {EntityService} from './entity.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {
  entities: Entity[]
  createEntityForm: FormGroup

  constructor(private entityService: EntityService) {}

  ngOnInit() {
    this.getEntities()
    this.createEntityForm = new FormGroup({
      'name': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    // TODO don't allow duplicates
    this.entities.push({name: this.createEntityForm.get('name').value, values: []})
    this.createEntityForm.reset()
  }

  getEntities() {
    this.entities = this.entityService.getEntities()
  }
}
