import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { WelcomeModal } from './welcome-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PreferenceService } from '../../services/preference.service';
import { ToastService } from '../../services/toast.service';
import { ApiResource } from '../../services/api/resource';
import { Environment } from '../../env';
import { ApiStore } from '../../services/api/store';
import { MockRouter, MockApiResource, MockApiStore, MockToastService, MockPreferenceService } from '../../shared/mocks';
import { DomHandler } from '@neoassets/helpers/domhandler';

describe('Welcome modal tests', () => {

    let fixture;
    let modalComponent;
    let service;
    let router;

    beforeEach(async(() => {
        // Creates a UserService using a mock class
        TestBed.configureTestingModule({
            declarations: [WelcomeModal],
            providers: [
                {provide: PreferenceService, useClass: MockPreferenceService},
                {provide: Router, useClass: MockRouter},
                {provide: ToastService, useClass: MockToastService},
                Environment,
                DomHandler
            ],
            imports: [RouterTestingModule, FormsModule],
            // CUSTOM_ELEMENTS_SCHEMA to solve html elements issues
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(WelcomeModal);
            modalComponent = fixture.componentInstance;
            service = TestBed.get(PreferenceService);
            router = TestBed.get(Router);
        });
    }));

    // specs
    it('should get the configured setting false', fakeAsync(() => {

        spyOn(service, 'isConfigured').and.returnValue(Promise.resolve(false));

        modalComponent.ngOnInit();
        // Tick ensure the promise finished in ngOnInit
        tick(301);
        expect(modalComponent.isConfigured).toBeFalsy();
    }));

    // specs
    it('should get the configured setting true', fakeAsync(() => {

        spyOn(service, 'isConfigured').and.returnValue(Promise.resolve(true));

        modalComponent.ngOnInit();
        // Tick ensure the promise finished in ngOnInit
        tick();
        expect(modalComponent.isConfigured).toBeTruthy();
    }));

    // specs
    it('should set ommited flag to false', () => {
        expect(modalComponent.wasOmmited).toBeFalsy();
        modalComponent.closeModal();
        expect(modalComponent.wasOmmited).toBeTruthy();
    });

    it('should be navigate to settings', () => {
        spyOn(router, 'navigate');
        modalComponent.goToSettings();
        expect(router.navigate).toHaveBeenCalledWith(['/settings/index']);
    });

});
