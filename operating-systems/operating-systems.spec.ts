import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChartModule } from 'angular-highcharts';

import { MockDashboardService } from '../../../shared/mocks';
import { DashboardService } from '../dashboard.service';
import { OperatingSystemsComponent } from './operating-systems';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { Environment } from '../../../env';

describe('Dashboard Installed software by category tests', () => {

    let fixture;
    let component;
    let service;

    beforeEach(async(() => {
        // Creates a UserService using a mock class
        TestBed.configureTestingModule({
            imports: [ChartModule],
            declarations: [OperatingSystemsComponent],
            providers: [
                {provide: DashboardService, useClass: MockDashboardService},
                {provide: ExplorerHelperService, useClass: () => ({})},
                Environment
            ],
            // CUSTOM_ELEMENTS_SCHEMA to solve html elements issues
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(OperatingSystemsComponent);
            component = fixture.componentInstance;
            service = TestBed.get(DashboardService);
        });
    }));

    // specs
    xit('should set the data graph', fakeAsync(() => {


        const data = [
            {'name': 'Windows', y: 500},
            {'name': 'Ubuntu', y: 250},
            {'name': 'OSX', y: 125},
        ];

        spyOn(service, 'getOperatingSystems').and.returnValue(Promise.resolve(data));

        component.ngOnInit();
        // Tick ensure the promise finished in ngOnInit
        tick();
        expect(component.chart.options.series[0].data[0].name).toBe('Windows');
    }));


});
