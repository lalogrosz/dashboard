import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Chart } from 'angular-highcharts';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { SearchCategoriesTypes } from '@neoassets/interfaces/search.categories.types.interface';
import { COMPUTER_CATEGORY } from '@neoassets/helpers/widgets/search-new/suggestions/search-term.service';
import { DEFAULT_ASSET_CATEGORY } from '../../../helpers/widgets/search-new/suggestions/search-term.service';
import {Environment} from '../../../env';

@Component({
  selector: 'assets-by-type-and-manufacturer',
  templateUrl: './assets-by-type-and-manufacturer.html'
})
export class AssetsByTypeAndManufacturerComponent implements OnInit {

  public chart;
  public columnChartColors = ['#6398BF', '#CB706D', '#6EB174', '#DCD05D', '#B285B2', '#63BCBF', '#F5AE56', '#C2A859', '#999999', '#E898BC' ];
  public hasData = false;
  public dataReady = false;
  staticUrl = '';

  constructor (private dashboardService: DashboardService, private helperService: ExplorerHelperService,
               private env: Environment) {

    this.chart = new Chart(<any>{
        chart: {
          type: 'column',
          height: 510
        },
        pane: {
            size: '95%'
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        title: null,
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'normal'
                    }
                }
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: (e) => {
                            const manufacturerName = e.point.category;
                            const categoryId = e.point.series.userOptions.id;
                            this.navigateToExplorer(manufacturerName, categoryId);
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
            },
            stackLabels: {
                enabled: false,
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            itemStyle: {
                fontWeight: 'normal'
            }
        }
    });

    this.staticUrl = this.env.staticUrl;


    this.dashboardService.getAssetsByTypeAndManufacturer().then(response => {
        const result = response[0];
        if (result.total) {
            this.chart.options.xAxis.categories = result.labels;
            this.chart.options.series = result.data;
            this.hasData = true;
        }
        this.dataReady = true;
    });
    this.staticUrl = this.env.staticUrl;
  }

  navigateToExplorer(manufacturerName: string, categoryId: string) {
    this.helperService.navigateToExplorer(SearchCategoriesTypes.ASSETS, [{
        category: DEFAULT_ASSET_CATEGORY,
        field: 'manufacturer-name',
        operator: ExplorerHelperService.IS_OP,
        value: {id: manufacturerName, name: manufacturerName}
    }], [categoryId]);
}

  ngOnInit(): void {

  }
}
