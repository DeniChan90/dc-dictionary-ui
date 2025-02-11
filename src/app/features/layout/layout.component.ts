import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/api/auth/auth.service';
import { SettingsService } from 'src/app/core/api/settings/settings.service';
import { OnlineWsService } from 'src/app/core/online-ws/online-ws.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
    public settings: any = null;
    public fullUserName: string = '';
    public onlineUsers: number = 0;
    private messageSubscription: Subscription | undefined;
    private onlinePing: any;

    constructor(
        public settingsService: SettingsService,
        private authService: AuthService,
        private onlineWs: OnlineWsService
    ) {
        this.settingsService.getSettings(this.authService.tokenData.ID).subscribe(
            (settings: any) => {
                const userData = this.authService.tokenData;
                this.settings = settings;
                this.fullUserName = `${userData.first_name} ${userData.last_name}`;
            }
        );
        this.messageSubscription = this.onlineWs.getMessages().subscribe(
            (message: any) => {
                if (typeof message === 'number') {
                    console.log('message', message)
                    this.onlineUsers = message;
                }
            }
        );

        this.onlinePing = setInterval(() => {
            this.onlineWs.sendMessage("ping");
        }, 3000)

        this.onlineWs.socket$.subscribe((count: number) => {
            console.log("COUNT UPDATED>>>", count)
            this.onlineUsers = count || 0;
        });
    }

    public ngOnDestroy(): void {
        this.messageSubscription?.unsubscribe();
        this.onlineWs.closeConnection();
        this.onlinePing && clearInterval(this.onlinePing);
    }

    public logout() {
        this.authService.logout();
    }
}
