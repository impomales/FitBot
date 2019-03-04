import {Component, OnInit, OnDestroy} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {EntityService} from '../entity.service'
import {Entity} from '../entity.model'

@Component({
  selector: 'app-entity-detail',
  templateUrl: './entity-detail.component.html',
  styleUrls: ['./entity-detail.component.css']
})
export class EntityDetailComponent implements OnInit, OnDestroy {
  entity: Entity
  subscribe: any

  constructor(
    private activateRoute: ActivatedRoute,
    private entityService: EntityService
  ) {
    this.subscribe = this.activateRoute.params.subscribe(params => {
      this.entity = this.entityService.getEntityByIndex(params['id'])
    })
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscribe.unsubscribe()
  }
}
