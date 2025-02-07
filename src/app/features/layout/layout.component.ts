import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/api/auth/auth.service';
import { SettingsService } from 'src/app/core/api/settings/settings.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    public settings: any = null;

    constructor(
        private authService: AuthService,
        public settingsService: SettingsService
    ) {
        this.settingsService.getSettings(this.authService.tokenData.ID).subscribe(
            (settings: any) => this.settings = settings
        );
    }

    public logout() {
        this.authService.logout();
    }
}
