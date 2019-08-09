import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import * as _ from 'lodash';
import { Chart } from 'angular-highcharts';
import {Environment} from '../../../env';

@Component({
  selector: 'agent-report',
  templateUrl: './agent-report.html'
})
export class AgentReportComponent implements OnInit {

  public hasData = false;
  public dataReady = false;
    public columnChartColors = ['#6398BF'];
  public chart;
    staticUrl = '';

  constructor (private dashboardService: DashboardService, private env: Environment) {
    this.chart = new Chart(<any>{
        chart: {
          type: 'spline',
          height: 294
        },
        credits: {
            enabled: false
        },
        pane: {
            size: '95%'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        title: null,
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        colors: this.columnChartColors,
        xAxis: {
            categories: [],
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: 'Quantity Reported'
            },
        },
        series: []
      });
      this.staticUrl = this.env.staticUrl;
  }

  ngOnInit(): void {
    this.dashboardService.getAgentReport().then(result => {
        if (_.sum(result.data)) {
            this.chart.options.xAxis.categories = result.labels;
            this.chart.addSeries({
                showInLegend: false,
                data: result.data,
                name: 'Total'
            });
            this.hasData = true;
        }
        this.dataReady = true;
    });
  }
}
