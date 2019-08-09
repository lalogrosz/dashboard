import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import * as _ from 'lodash';
import { Chart } from 'angular-highcharts';
import { SearchCategoriesTypes } from '@neoassets/interfaces/search.categories.types.interface';
import { DEFAULT_SOFTWARE_CATEGORY } from '../../../helpers/widgets/search-new/suggestions/search-term.service';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import {Environment} from '../../../env';

@Component({
    selector: 'installed-software-by-type',
    templateUrl: './installed-software-by-type.html'
})
export class InstalledSoftwareByTypeComponent implements OnInit {

    public hasData = false;
    public dataReady = false;
    public columnChartColors = ['#6398BF'];
    public chart;
    staticUrl = '';

    constructor(private dashboardService: DashboardService, private helperService: ExplorerHelperService,
                private env: Environment) {

        this.chart = new Chart(<any>{
            chart: {
              type: 'bar',
              height: 294
            },
            pane: {
                size: '95%'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            title: null,
            plotOptions: {
                spline: {
                    dataLabels: {
                        enabled: true
                    }
                },
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: (e) => {
                                this.navigateToExplorer(e.point.category);
                            }
                        }
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
                    text: null
                }
            },
            series: []
          });
        this.staticUrl = this.env.staticUrl;
    }

    ngOnInit(): void {
        this.dashboardService.getInstalledSoftwareByType().then(result => {
            if (_.sum(result.data)) {
                this.chart.options.xAxis.categories = result.labels;
                this.chart.addSeries({
                    data: result.data,
                    showInLegend: false,
                    name: 'Total'
                });
                this.hasData = true;
            }
            this.dataReady = true;
        });
    }

    navigateToExplorer(name: string) {
        this.helperService.navigateToExplorer(SearchCategoriesTypes.SOFTWARE, [{
            category: DEFAULT_SOFTWARE_CATEGORY,
            field: 'software-name',
            operator: ExplorerHelperService.IS_OP,
            value: {id: name, name}
        }]);
    }
}
