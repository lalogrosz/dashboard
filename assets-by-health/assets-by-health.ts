import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Chart } from 'angular-highcharts';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { COMPUTER_CATEGORY } from '@neoassets/helpers/widgets/search-new/suggestions/search-term.service';
import { SearchCategoriesTypes } from '@neoassets/interfaces/search.categories.types.interface';
import {Environment} from '../../../env';
import * as _ from 'lodash';

const COLORS = {
    safe: '#6EB174',
    warning: '#F5AE56',
    critical: '#CB706D',
    notset: '#c2c2c2'
};

@Component({
  selector: 'assets-by-health',
  templateUrl: './assets-by-health.html'
})
export class AssetsByHealthComponent implements OnInit {

  @ViewChild('assetsByHealthCanvas') canvas: ElementRef;


  public pieChartColors = [COLORS.warning, COLORS.critical, COLORS.safe, COLORS.notset];
  public hasData = false;
  public dataReady = false;
  public chart;
  staticUrl = '';

  constructor (private dashboardService: DashboardService, private helperService: ExplorerHelperService,
               private env: Environment) {

    const config = _.cloneDeep(this.dashboardService.pieChartConfig);
    config.plotOptions.pie['colors'] = this.pieChartColors;
    config.plotOptions['series'] = {
        point: {
            events: {
                click: (e) => {
                    this.navigateToExplorer(e.point.id, e.point.name);
                }
            }
        }
    };
    this.chart = new Chart(config);
    this.staticUrl = this.env.staticUrl;
  }

  ngOnInit(): void {
    this.dashboardService.getAssetsByHealth().then(result => {
        if (result.find(item => item.y > 0)) {

            const data = result.map((serie) => {
               return {
                   y: serie.y,
                   id: serie.id,
                   name: serie.name,
                   color: COLORS[serie.id]
               };
            });
            this.chart.addSeries({
                'name': 'Health',
                colorByPoint: true,
                size: '85%',
                data: data
            });

            this.hasData = true;
        }
        this.dataReady = true;
    });
  }

  navigateToExplorer(id: string, name: string) {
    this.helperService.navigateToExplorer(SearchCategoriesTypes.ASSETS, [{
        category: COMPUTER_CATEGORY,
        field: 'computer-health-status',
        operator: ExplorerHelperService.IS_OP,
        value: {id, name}
    }]);
}

}
