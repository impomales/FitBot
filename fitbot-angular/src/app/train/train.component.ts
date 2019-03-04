import {Component, OnInit} from '@angular/core'
import {Train} from './train.model'
import {TrainService} from './train.service'

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})
export class TrainComponent implements OnInit {
  trainingData: Train

  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this.loadTrainingData()
  }

  loadTrainingData() {
    this.trainService.getTrainingData().subscribe((data: Train) => {
      this.trainingData = data
      console.log(this.trainingData)
    })
  }

  trainRasa() {
    this.trainService
      .updateTrainingData(this.trainingData)
      .subscribe((data: {message: string}) => {
        console.log(data.message)
      })
  }
}
