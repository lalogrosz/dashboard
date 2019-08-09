import { Component, OnInit } from '@angular/core';
import { DEFAULT_ASSET_CATEGORY } from '@neoassets/helpers/widgets/search-new/suggestions/search-term.service';
import { SearchCategoriesTypes } from '@neoassets/interfaces/search.categories.types.interface';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { GraphService } from '@neoassets/services/graphs.service';
import { Chart } from 'angular-highcharts';

import { Environment } from '../../../env';
import { DashboardService } from '../dashboard.service';
import * as _ from 'lodash';

@Component({
    selector: 'operating-systems',
    templateUrl: './operating-systems.html'
})
export class OperatingSystemsComponent implements OnInit {
    public chart;
    public hasData = false;
    public dataReady = false;
    staticUrl = '';

    constructor(
        private dashboardService: DashboardService,
        private helperService: ExplorerHelperService,
        private graphService: GraphService,
        private env: Environment
    ) {
        const config = _.cloneDeep(this.graphService.defaultPieConfig);
        config.plotOptions['series'] = {
            point: {
                events: {
                    click: e => {
                        this.navigateToExplorer(e.point.originalName);
                    }
                }
            }
        };
        config.legend['layout'] = 'vertical';
        config.legend['maxHeight'] = '250';
        config.legend['align'] = 'right';
        config.legend['verticalAlign'] = 'middle';
        this.chart = new Chart(<any> config);

        this.staticUrl = this.env.staticUrl;
    }

    ngOnInit(): void {
        this.dashboardService.getOperatingSystems().then(result => {
            if (result.find(item => item.y > 0)) {
                this.chart.addSeries({
                    name: 'Total',
                    colorByPoint: true,
                    size: '100%',
                    data: result
                });
                this.hasData = true;
            }
            this.dataReady = true;
        });
    }

    navigateToExplorer(name: string) {
        this.helperService.navigateToExplorer(SearchCategoriesTypes.ASSETS, [
            {
                category: DEFAULT_ASSET_CATEGORY,
                field: 'operative-system',
                operator: ExplorerHelperService.IS_OP,
                value: { id: name, name }
            }
        ]);
    }
}
