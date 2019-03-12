import {Component, OnInit, DoCheck} from '@angular/core'
import {Entity} from './entity.model'
import {EntityService} from './entity.service'
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {TrainService} from '../train.service'

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {
  entities: Entity[]
  createEntityForm: FormGroup
  paramId: string

  constructor(
    private entityService: EntityService,
    private trainService: TrainService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getEntities()
    this.createEntityForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        this.duplicateValidator.bind(this),
        this.forbiddenCharacters.bind(this)
      ])
    })
  }

  onSubmit() {
    // TODO don't allow duplicates
    this.entities.push({
      name: this.createEntityForm.get('name').value,
      values: [],
      color: this.trainService.getNextColor()
    })
    this.createEntityForm.reset()
  }

  deleteEntity(index: number) {
    this.trainService.deleteEntity(index)
    this.paramId = this.router.url.split('/')[3]
    if (+this.paramId === index) this.router.navigate(['/train/entities'])
  }

  duplicateValidator(control: FormControl): {[key: string]: boolean} {
    if (
      this.entities.findIndex(entity => entity.name === control.value) !== -1
    ) {
      return {
        duplicate: true
      }
    }
    return null
  }

  forbiddenCharacters(control: FormControl): {[key: string]: boolean} {
    if (control.value && control.value.match(/^(#|-|\*).*$/)) return { forbidden: true }
    return null
  }

  getEntities() {
    this.entities = this.entityService.getEntities()
  }
}
