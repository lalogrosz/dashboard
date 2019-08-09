import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MockDashboardService } from '../../../shared/mocks';
import { AntivirusComponent } from './antivirus';
import { ChartModule } from 'angular-highcharts';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { Environment } from '../../../env';

describe('Dashboard Antivirus tests', () => {

    let fixture;
    let component;
    let service;

    beforeEach(async(() => {
        // Creates a UserService using a mock class
        TestBed.configureTestingModule({
            imports: [ChartModule],
            declarations: [AntivirusComponent],
            providers: [
                {provide: DashboardService, useClass: MockDashboardService},
                {provide: ExplorerHelperService, useClass: () => ({})},
                Environment
            ],
            // CUSTOM_ELEMENTS_SCHEMA to solve html elements issues
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(AntivirusComponent);
            component = fixture.componentInstance;
            service = TestBed.get(DashboardService);
        });
    }));

    // specs
    xit('should set the data graph', fakeAsync(() => {

        const data = [
            {'name': 'On', y: 500},
            {'name': 'Off', y: 250},
        ];

        spyOn(service, 'getAntivirus').and.returnValue(Promise.resolve(data));

        component.ngOnInit();
        // Tick ensure the promise finished in ngOnInit
        tick();
        expect(component.chart.options.series[0].data[0].name).toBe('On');
    }));


});
