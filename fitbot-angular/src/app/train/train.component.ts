import {Component, OnInit} from '@angular/core'
import {TrainService} from './train.service'

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})
export class TrainComponent implements OnInit {
  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this.loadTrainingData()
  }

  loadTrainingData() {
    if (!this.trainService.trainingData)
      this.trainService.getTrainingData().subscribe(() => {
        console.log('fetched training data.')
      })
  }

  trainRasa() {
    this.trainService
      .updateTrainingData()
      .subscribe((data: {message: string}) => {
        console.log(data.message)
      })
  }
}
