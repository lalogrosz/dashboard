import { Component, OnInit, ElementRef } from '@angular/core';
import { PreferenceService } from '../../services/preference.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { Environment } from '../../env';
import { DomHandler } from '../../helpers/domhandler';

@Component({
    selector: 'welcome-modal',
    template: `
    <div class="modal-dialog open" *ngIf="!isConfigured && !wasOmmited">
        <div class="modal-bg"></div>
        <div class="modal-container-small" tabindex="0">
            <div class="modal-title modal-title-big modal-text-center">¡Welcome to {{env.appName}}!</div>
            <div class="modal-body">
                <div class="modal-body-box">
                    <div class="modal-main-img"><img [src]="staticUrl + '/assets/img/img-welcome.png'" /></div>
                    <div class="modal-text modal-text-center">Start deploying the {{env.appName}} agent. You need to distribute the agent over your assets, so they can start reporting to the system. Otherwise, you will only be able to use the system with data you uploaded manually.</div>
                </div>
                <div class="modal-body-box modal-bt modal-body-flex">
                    <button class="button-only-text" (click)="closeModal()" >
                        <div class="button-silver-text">Cancel</div>
                    </button>
                    <button class="button-blue" (click)="goToSettings()">
                        <div class="button-blue-text">Deploy</div>
                    </button>
                    <div class="clear"></div>
                </div>
            </div>
        </div>
    </div>
    `
})
export class WelcomeModal implements OnInit {
    public isConfigured = true;
    public wasOmmited: boolean;
    public staticUrl: string;

    constructor(
        private preferenceService: PreferenceService,
        private router: Router,
        private toastService: ToastService,
        public env: Environment,
        private domHandler: DomHandler
    ) {
        this.staticUrl = this.env.staticUrl;
    }

    ngOnInit() {
        this.wasOmmited = false;
        this.preferenceService.isConfigured().then(isConfigured => {
            this.isConfigured = isConfigured;
            if (!this.isConfigured) {
                setTimeout(() => this.domHandler.trigger(document.activeElement, 'blur'), 300);
            }
        });
    }

    closeModal() {
        // Set that was ommited
        this.wasOmmited = true;
        this.preferenceService.ommitConfiguration();

        // Shows the toast alert
        this.toastService.create({
            id: 'notConfigured',
            text: 'Remember to deploy the agent to start getting data from your assets',
            button: {
                text: 'Deploy',
                handle: () => {
                    this.goToSettings();
                }
            },
            showClose: true,
            icon: 'info-circle'
        });
    }

    goToSettings() {
        this.router.navigate(['/settings/index']);
    }
}
