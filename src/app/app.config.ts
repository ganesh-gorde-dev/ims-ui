import {
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api-interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TenantConfigService } from './core/services/tenant-config.service';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    {
      provide: APP_INITIALIZER,
      useValue: () => {
        const tenantService = inject(TenantConfigService);
        return tenantService.loadConfig();
      },
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    // {
    //   provide: APP_INITIALIZER,
    //   multi: true,
    //   useFactory: () => {
    //     const iconRegistry = inject(MatIconRegistry);
    //     const sanitizer = inject(DomSanitizer);
    //     return () => {
    //       iconRegistry.registerFontClassAlias('material-symbols-outlined');
    //       iconRegistry.registerFontClassAlias('material-icons');
    //       iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    //     };
    //   },
    // },
  ],
};
