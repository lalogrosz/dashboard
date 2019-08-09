import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'general-report',
  templateUrl: './general.html'
})
export class GeneralComponent implements OnInit {

  public reported = 0;
  public expired = 0;
  public tracked = 0;

  constructor (private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.dashboardService.getGeneral().then(result => {
      this.reported = result.reported;
      this.expired = result.expired;
      this.tracked = result.tracked;
    });
  }
}
