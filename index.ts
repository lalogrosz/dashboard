import { CommonModule } from '@angular/common';
import { Component, ModuleWithProviders, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'angular-highcharts';

import { Environment } from '../../env';
import { AuthGuard } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { AgentReportComponent } from './agent-report/agent-report';
import { AntivirusComponent } from './antivirus/antivirus';
import { AssetsByHealthComponent } from './assets-by-health/assets-by-health';
import { AssetsByTypeAndManufacturerComponent } from './assets-by-type-and-manufacturer/assets-by-type-and-manufacturer';
import { DashboardService } from './dashboard.service';
import { FirewallComponent } from './firewall/firewall';
import { GeneralComponent } from './general/general';
import { InstalledSoftwareByTypeComponent } from './installed-software-by-type/installed-software-by-type';
import { OperatingSystemsComponent } from './operating-systems/operating-systems';
import { WelcomeModal } from './welcome-modal.component';

@Component({
    selector: 'dashboard',
    templateUrl: './index.html'
})
export class Dashboard implements OnInit{
    staticUrl = '';

    constructor (
        private router: Router,
        private env: Environment,
        private toastService: ToastService,
    ) {
        this.staticUrl = this.env.staticUrl;
    }

    ngOnInit(): void {
        // Removes only the toast named notConfigured to prevent duplicates
        this.toastService.remove('notConfigured');
    }
}

const dashboardRoutes: Routes = [
    {
        path: '',
        component: Dashboard,
        canActivate: [AuthGuard]
    },
];
export const DashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);

@NgModule({
    imports: [
        CommonModule,
        DashboardRouting,
        ChartModule
    ],
    declarations: [
        Dashboard, WelcomeModal,
        OperatingSystemsComponent,
        InstalledSoftwareByTypeComponent,
        AgentReportComponent,
        AssetsByHealthComponent,
        AntivirusComponent,
        FirewallComponent,
        AssetsByTypeAndManufacturerComponent,
        GeneralComponent
    ],
    providers: [DashboardService]
})
export class DashboardPageModule { }
