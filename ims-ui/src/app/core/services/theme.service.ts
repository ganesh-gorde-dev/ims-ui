import {
  effect,
  Injectable,
  Renderer2,
  RendererFactory2,
  signal,
} from '@angular/core';

export interface Theme {
  id: string;
  primary: string;
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themes: Theme[] = [
    { id: 'blue', primary: '#2F66B9', displayName: 'Blue' },
    { id: 'green', primary: '#00796B', displayName: 'Green' },
  ];
  currentTheme = signal<Theme>(this.themes[0]);
  currentScheme: 'light' | 'dark' = 'light';
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    // Read from localStorage or default
    // const saved = localStorage.getItem('color-scheme') as
    //   | 'light'
    //   | 'dark'
    //   | null;
    // if (saved) {
    //   this.setColorScheme(saved);
    // } else {
    //   const prefersDark = window.matchMedia(
    //     '(prefers-color-scheme: dark)'
    //   ).matches;
    //   this.setColorScheme(prefersDark ? 'dark' : 'light');
    // }
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
    }
  }

  toggleLightDarkTheme(): void {
    const newScheme = this.currentScheme === 'light' ? 'dark' : 'light';
    this.setColorScheme(newScheme);
  }

  setColorScheme(scheme: 'light' | 'dark') {
    document.body.style.colorScheme = scheme;
    this.currentScheme = scheme;
    localStorage.setItem('color-scheme', scheme);
  }

  getCurrentScheme(): 'light' | 'dark' {
    return this.currentScheme;
  }

  updateThemeClass = effect(() => {
    const theme = this.currentTheme();
    document.body.classList.remove(...this.themes.map(t => `${t.id}-theme`));
    document.body.classList.add(`${theme.id}-theme`);

    console.log(document.body.classList);
  });
}
