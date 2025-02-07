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
    public fullUserName: string = '';

    constructor(
        private authService: AuthService,
        public settingsService: SettingsService
    ) {
        this.settingsService.getSettings(this.authService.tokenData.ID).subscribe(
            (settings: any) => {
                const userData = this.authService.tokenData;
                this.settings = settings;
                this.fullUserName = `${userData.first_name} ${userData.last_name}`;
                console.log('sett .', this.authService.tokenData)
            }
        );
    }

    public logout() {
        this.authService.logout();
    }
}
