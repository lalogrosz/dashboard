import { IAgentReport } from './agent-report/agent-report.interface';
import { DashboardModel } from '../../models/dashboard';
import { Injectable } from '@angular/core';
import { ApiResource } from '../../services/api/resource';
import { ApiStore } from '../../services/api/store';
import { IAntivirus } from './antivirus/antivirus.interface';
import { IAssetsByHealth } from './assets-by-health/assets-by-health.interface';
import { IOperatingSystems } from './operating-systems/operating-systems.interface';
import { ITopSoftware } from './installed-software-by-type/installed-software-by-type.interface';
import { IManufacturerByType } from './assets-by-type-and-manufacturer/assets-by-type-and-manufacturer.interface';
import { SearchCategoriesService } from '../../services';

import * as _ from 'lodash';
import { GraphService } from '@neoassets/services/graphs.service';

@Injectable()
export class DashboardService {
    pieChartConfig;

    private apiStore: ApiStore;
    public constructor(
        private apiResource: ApiResource,
        private searchCategoriesService: SearchCategoriesService,
        private graphService: GraphService
    ) {
        this.apiStore = this.apiResource.init(DashboardModel, { notJsonapi: true });

        this.pieChartConfig = _.cloneDeep(this.graphService.defaultPieConfig);
        this.pieChartConfig.chart['margin'] = [0, 0, 0, 0];
        this.pieChartConfig.plotOptions.pie['center'] = ['50%', '43%'];
        this.pieChartConfig.legend = {
            fontWeight: 'normal'
        };
    }

    public getAgentReport() {
        return this.apiStore.fetchPromise('reported-agents').then(response => {
            const parsedData = {
                labels: [],
                data: []
            };
            if (response[0].data !== undefined) {
                const sortedResponse = _.sortBy(response[0].data, ['year', 'month']);
                sortedResponse.forEach((agentModel: IAgentReport) => {
                    parsedData.labels.push(agentModel.month_name + ' ' + agentModel.year);
                    parsedData.data.push(agentModel.total);
                });
            }

            return parsedData;
        });
    }

    public getAntivirus() {
        return this.apiStore.fetchPromise('antivirus').then(response => {
            const parsedData = [];
            if (response[0].data !== undefined) {
                const antivirusModel = response[0].data as IAntivirus;

                parsedData.push({
                    id: 'enabled',
                    name: 'On',
                    y: antivirusModel.enabled ? antivirusModel.enabled : 0
                });
                parsedData.push({
                    id: 'disabled',
                    name: 'Off',
                    y: antivirusModel.disabled ? antivirusModel.disabled : 0
                });
                parsedData.push({
                    id: 'notavailable',
                    name: 'Not detected',
                    y: antivirusModel.notavailable ? antivirusModel.notavailable : 0
                });
            }

            return parsedData;
        });
    }

    public getAssetsByHealth() {
        return this.apiStore.fetchPromise('health').then(response => {
            let parsedData = [];
            if (response[0].data !== undefined) {
                const healthData = response[0].data as IAssetsByHealth[];

                parsedData = healthData.map(item => {
                    return {
                        name: item.label,
                        y: item.count ? item.count : 0,
                        id: item.id
                    };
                });
            }

            return parsedData;
        });
    }

    public getAssetsByTypeAndManufacturer() {
        return this.apiStore.fetchPromise('manufacturer-by-category');
    }

    public getFirewall() {
        return this.apiStore.fetchPromise('firewall').then(response => {
            const parsedData = [];
            if (response[0].data !== undefined) {
                const firewallModel = response[0].data as IAntivirus;
                parsedData.push({
                    id: 'enabled',
                    name: 'On',
                    y: firewallModel.enabled ? firewallModel.enabled : 0
                });
                parsedData.push({
                    id: 'disabled',
                    name: 'Off',
                    y: firewallModel.disabled ? firewallModel.disabled : 0
                });
                parsedData.push({
                    id: 'notavailable',
                    name: 'Not detected',
                    y: firewallModel.notavailable ? firewallModel.notavailable : 0
                });
            }
            return parsedData;
        });
    }

    public getOperatingSystems() {
        return this.apiStore.fetchPromise('operating-system').then(response => {
            let parsedData = [];
            if (response[0].data !== undefined) {
                parsedData = response[0].data.map((osModel: IOperatingSystems) => {
                    return {
                        // WA until backend replaces the Microsoft
                        name: osModel.os_name.replace('Microsoft ', ''),
                        originalName: osModel.os_name,
                        y: osModel.num_installed
                    };
                });
            }

            return parsedData;
        });
    }

    public getInstalledSoftwareByType() {
        return this.apiStore.fetchPromise('top-software').then(response => {
            const parsedData = {
                labels: [],
                data: []
            };
            if (response[0].data !== undefined) {
                response[0].data.forEach((topSoftwareModel: ITopSoftware) => {
                    parsedData.labels.push(topSoftwareModel.name);
                    parsedData.data.push(topSoftwareModel.install_count);
                });
            }

            return parsedData;
        });
    }

    public getSoftwareByCategory() {
        const data = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            data: [
                {
                    data: [75, 100, 80, 120, 150, 135, 80, 55, 100, 95, 160, 180],
                    label: 'Office',
                    fill: false
                },
                {
                    data: [30, 22, 55, 17, 49, 12, 1, 32, 33, 58, 62, 29],
                    label: 'Financial',
                    fill: false
                },
                {
                    data: [0, 0, 0, 0, 0, 0, 58, 98, 185, 160, 122, 149],
                    label: 'Design',
                    fill: false
                },
                {
                    data: [0, 0, 0, 0, 0, 0, 58, 98, 185, 160, 122, 149],
                    label: 'Productivity',
                    fill: false
                },
                {
                    data: [0, 0, 0, 0, 0, 0, 58, 98, 185, 160, 122, 149],
                    label: 'Development',
                    fill: false
                },
                {
                    data: [0, 0, 0, 0, 0, 0, 10, 25, 0, 23, 10, 8],
                    label: 'Games',
                    fill: false
                },
                {
                    data: [10, 25, 0, 23, 10, 8, 12, 0, 0, 33, 10, 6],
                    label: 'Web servers',
                    fill: false
                }
            ]
        };

        return Promise.resolve(data);
    }

    public getGeneral() {
        return this.apiStore.fetchPromise('general').then(response => {
            const parsedData = {
                reported: 0,
                expired: 0,
                tracked: 0
            };
            if (response[0].data !== undefined) {
                parsedData.reported = response[0].data.reported ? response[0].data.reported : 0;
                parsedData.expired = response[0].data.expired ? response[0].data.expired : 0;
                parsedData.tracked = response[0].data.tracked ? response[0].data.tracked : 0;
            }

            return parsedData;
        });
    }

    /**
     * Parses the API response data when it is an object with attribute => value
     *
     * @private
     * @param {any} response
     * @returns
     * @memberof DashboardService
     */
    private parseAttributeValueResponse(response) {
        const parsedData = {
            labels: [],
            data: []
        };
        if (response[0].data !== undefined) {
            for (const key in response[0].data) {
                if (response[0].data.hasOwnProperty(key)) {
                    parsedData.labels.push(key);
                    parsedData.data.push(response[0].data[key]);
                }
            }
        }

        return parsedData;
    }
}
