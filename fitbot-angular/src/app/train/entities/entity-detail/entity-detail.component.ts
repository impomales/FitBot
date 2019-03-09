import {Component, OnInit, OnDestroy} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {EntityService} from '../entity.service'
import {Entity} from '../entity.model'
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { TrainService } from '../../train.service';

@Component({
  selector: 'app-entity-detail',
  templateUrl: './entity-detail.component.html',
  styleUrls: ['./entity-detail.component.css']
})
export class EntityDetailComponent implements OnInit, OnDestroy {
  entity: Entity
  subscribe: any
  addValueForm: FormGroup
  addSynonymForm: FormGroup

  constructor(
    private activateRoute: ActivatedRoute,
    private entityService: EntityService,
    private trainService: TrainService
  ) {
    this.subscribe = this.activateRoute.params.subscribe(params => {
      this.entity = this.entityService.getEntityByIndex(params['id'])
    })
  }

  ngOnInit() {
    this.addValueForm = new FormGroup({
      value: new FormControl(null, Validators.required)
    })

    this.addSynonymForm = new FormGroup({
      synonym: new FormControl(null, Validators.required)
    })
  }

  onSubmitValue() {
    this.entity.values.push({value: this.addValueForm.value.value, synonyms: []})
    this.addValueForm.reset()
  }

  onSubmitSynonym(index: number) {
    this.entity.values[index].synonyms.push(this.addSynonymForm.value.synonym)
    this.trainService.addSynonym(this.entity.values[index].value, this.entity.values[index].synonyms)
    this.addSynonymForm.reset()
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe()
  }
}
