/**
 * AGB CHANTIER SaaS - Gestionnaire PWA & Installation Multi-Plateforme
 * Supporte : Android, iOS, Windows, macOS, Linux, ChromeOS
 */

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

class PwaManagerService {
  private deferredPrompt: InstallPromptEvent | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e as InstallPromptEvent;
        this.notify();
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.notify();
        console.log('[AGB PWA] Application installée avec succès sur la machine');
      });
    }
  }

  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }
    try {
      await this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      this.notify();
      return choice.outcome === 'accepted';
    } catch (err) {
      console.error('[AGB PWA] Erreur prompt install:', err);
      return false;
    }
  }

  public getPlatformInfo(): { isIOS: boolean; isAndroid: boolean; isDesktop: boolean; isWindows: boolean; isMac: boolean } {
    if (typeof navigator === 'undefined') {
      return { isIOS: false, isAndroid: false, isDesktop: true, isWindows: false, isMac: false };
    }
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/.test(ua);
    const isWindows = /Windows/.test(ua);
    const isMac = /Macintosh|Mac OS X/.test(ua) && !isIOS;
    const isDesktop = !isIOS && !isAndroid;

    return { isIOS, isAndroid, isDesktop, isWindows, isMac };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => cb());
  }
}

export const PwaManager = new PwaManagerService();
