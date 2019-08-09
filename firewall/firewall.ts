import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import * as _ from 'lodash';
import { Chart } from 'angular-highcharts';
import {Environment} from '../../../env';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { SearchCategoriesTypes } from '@neoassets/interfaces/search.categories.types.interface';
import { COMPUTER_CATEGORY } from '@neoassets/helpers/widgets/search-new/suggestions/search-term.service';

@Component({
  selector: 'firewall',
  templateUrl: './firewall.html'
})
export class FirewallComponent implements OnInit {

    public pieChartColors = ['#6EB174', '#CB706D', '#c2c2c2'];
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
        this.dashboardService.getFirewall().then(result => {
            if (result.find(item => item.y > 0)) {
                this.chart.addSeries({
                    'name': 'Firewall',
                    colorByPoint: true,
                    size: '85%',
                    data: result
                });
                this.hasData = true;
            }
            this.dataReady = true;
        });
    }

    navigateToExplorer(id: string, name: string) {
        this.helperService.navigateToExplorer(SearchCategoriesTypes.ASSETS, [{
            category: COMPUTER_CATEGORY,
            field: 'firewall',
            operator: ExplorerHelperService.IS_OP,
            value: {id, name}
        }]);
    }
}
