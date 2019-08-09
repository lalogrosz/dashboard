import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AgentReportComponent } from './agent-report';
import { DashboardService } from '../dashboard.service';
import { MockDashboardService } from '../../../shared/mocks';
import { ChartModule } from 'angular-highcharts';
import { Environment } from '../../../env';

describe('Dashboard Agent Report tests', () => {

    let fixture;
    let component;
    let service;

    beforeEach(async(() => {
        // Creates a UserService using a mock class
        TestBed.configureTestingModule({
            imports: [ChartModule],
            declarations: [AgentReportComponent],
            providers: [
                {provide: DashboardService, useClass: MockDashboardService},
                Environment
            ],
            // CUSTOM_ELEMENTS_SCHEMA to solve html elements issues
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(AgentReportComponent);
            component = fixture.componentInstance;
            service = TestBed.get(DashboardService);
        });
    }));

    // specs
    it('should set the data graph', fakeAsync(() => {

        const data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          data: [20, 25, 34, 48, 50, 61, 65]
        };

        spyOn(service, 'getAgentReport').and.returnValue(Promise.resolve(data));

        component.ngOnInit();
        tick();
        expect(component.chart.options.xAxis.categories[0]).toBe('January');


    }));


});
