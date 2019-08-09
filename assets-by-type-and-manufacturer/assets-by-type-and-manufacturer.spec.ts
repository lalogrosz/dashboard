import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChartModule } from 'angular-highcharts';

import { MockDashboardService } from '../../../shared/mocks';
import { DashboardService } from '../dashboard.service';
import { AssetsByTypeAndManufacturerComponent } from './assets-by-type-and-manufacturer';
import { ExplorerHelperService } from '@neoassets/services/explorer/explorer-helper.service';
import { Environment } from '../../../env';

describe('Dashboard Assets by type and manufacturer tests', () => {

    let fixture;
    let component;
    let service;

    beforeEach(async(() => {
        // Creates a UserService using a mock class
        TestBed.configureTestingModule({
            imports: [ChartModule],
            declarations: [AssetsByTypeAndManufacturerComponent],
            providers: [
                {provide: DashboardService, useClass: MockDashboardService},
                {provide: ExplorerHelperService, useClass: () => ({})},
                Environment
            ],
            // CUSTOM_ELEMENTS_SCHEMA to solve html elements issues
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents().then(() => {
            service = TestBed.get(DashboardService);
        });
    }));

    // specs
    it('should set the data graph', fakeAsync(() => {

        const data = [{
          labels: ['Apple', 'Asus', 'Benq', 'Dell', 'Samsung'],
          data: [
            {
              data: [250, 260, 0, 80, 100],
              label: 'Computer'
            }
          ],
          total: 690
        }];

        spyOn(service, 'getAssetsByTypeAndManufacturer').and.returnValue(Promise.resolve(data));
        fixture = TestBed.createComponent(AssetsByTypeAndManufacturerComponent);
        component = fixture.componentInstance;
        // Tick ensure the promise finished in ngOnInit
        tick();
        expect(component.chart.options.xAxis.categories[0]).toBe('Apple');
        // expect(component.chart.options.series[0].data[0]).toBe(250);
    }));


});
