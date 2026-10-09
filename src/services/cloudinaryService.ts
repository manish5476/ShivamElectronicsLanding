/**
 * Cloudinary Direct Client-Side Upload Service
 * 
 * Works 100% on static frontend hosting (GitHub Pages) with ZERO backend needed.
 * Uses Cloudinary's Unsigned Upload Presets so your API Secret is never exposed.
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
}

export interface CloudinaryUploadResponse {
  success: boolean;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
}

const STORAGE_KEY = 'shivam_cloudinary_config_v1';

export const cloudinaryService = {
  // Get active configuration (Priority: localStorage override -> Vite environment variables)
  getConfig(): CloudinaryConfig {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.cloudName && parsed.uploadPreset) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    return {
      cloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim(),
      uploadPreset: (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim(),
      folder: (import.meta.env.VITE_CLOUDINARY_FOLDER || 'shivam_electronics').trim(),
    };
  },

  // Save config into localStorage (allows admin to configure Cloudinary via UI without re-deploying)
  saveConfig(config: Partial<CloudinaryConfig>): void {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  // Clear manual config override
  clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Check if Cloudinary is configured
  isConfigured(): boolean {
    const { cloudName, uploadPreset } = this.getConfig();
    return Boolean(cloudName && uploadPreset);
  },

  /**
   * Upload an image file directly to Cloudinary from the browser
   */
  async uploadImage(file: File, customFolder?: string): Promise<CloudinaryUploadResponse> {
    const { cloudName, uploadPreset, folder } = this.getConfig();

    if (!cloudName || !uploadPreset) {
      return {
        success: false,
        error: 'Cloudinary is not configured. Please set Cloud Name and Upload Preset.',
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      if (customFolder || folder) {
        formData.append('folder', customFolder || folder || 'shivam_electronics');
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        return {
          success: false,
          error: data.error?.message || `Cloudinary upload failed with status ${res.status}`,
        };
      }

      // Generate optimized CDN URL with auto format (webp/avif) & auto quality
      const secureUrl: string = data.secure_url || data.url;
      const optimizedUrl = secureUrl.includes('/upload/')
        ? secureUrl.replace('/upload/', '/upload/f_auto,q_auto/')
        : secureUrl;

      return {
        success: true,
        url: optimizedUrl,
        secureUrl: optimizedUrl,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error while connecting to Cloudinary',
      };
    }
  },
};
