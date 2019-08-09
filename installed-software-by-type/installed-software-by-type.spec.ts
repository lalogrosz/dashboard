import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChartModule } from 'angular-highcharts';

import { MockDashboardService } from '../../../shared/mocks';
import { DashboardService } from '../dashboard.service';
import { InstalledSoftwareByTypeComponent } from './installed-software-by-type';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { Environment } from '../../../env';

describe('Dashboard Installed software by type tests', () => {

    let fixture;
    let component;
    let service;

    beforeEach(async(() => {
        // Creates a UserService using a mock class
        TestBed.configureTestingModule({
            imports: [ChartModule],
            declarations: [InstalledSoftwareByTypeComponent],
            providers: [
                {provide: DashboardService, useClass: MockDashboardService},
                {provide: ExplorerHelperService, useClass: () => ({})},
                Environment
            ],
            // CUSTOM_ELEMENTS_SCHEMA to solve html elements issues
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(InstalledSoftwareByTypeComponent);
            component = fixture.componentInstance;
            service = TestBed.get(DashboardService);
        });
    }));

    // specs
    it('should set the data graph', fakeAsync(() => {

        const data = {
          labels: ['Word', 'Excel', 'Phpstorm', 'Photoshop', 'PowerPoint', 'Slack', 'Skype', 'Spotify', 'Chrome'],
          data: [1200, 1025, 900, 850, 700, 650, 500, 450, 233]
        };

        spyOn(service, 'getInstalledSoftwareByType').and.returnValue(Promise.resolve(data));

        component.ngOnInit();
        // Tick ensure the promise finished in ngOnInit
        tick();

        // expect(component.chart.options.series[0].data[0]).toBe(1200);
        expect(component.chart.options.xAxis.categories[0]).toBe('Word');
    }));


});
