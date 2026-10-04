import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CompanyDocument, DocumentVisibility, DocumentType } from '../types/business';
import type { ApiResponse } from '../types/electronics';

const STORAGE_KEY = 'shivam_documents_v1';

const DEFAULT_DOCUMENTS: CompanyDocument[] = [
  {
    id: 'doc-1',
    title: 'GST Registration Certificate',
    description: 'Official Government of India GST registration for Shivam Electronics & Home Furnishings Pvt. Ltd.',
    documentType: 'REGISTRATION',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000',
    fileName: 'GST_Certificate_ShivamElectronics.pdf',
    mimeType: 'application/pdf',
    fileSize: 420000,
    version: '1.0',
    visibility: 'PUBLIC',
    status: 'ACTIVE',
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc-2',
    title: 'Brand Authorized Dealer Certificate - Sony India',
    description: 'Direct tier-1 authorized showroom certification for Sony Bravia home entertainment systems.',
    documentType: 'CERTIFICATE',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000',
    fileName: 'Sony_Authorized_Partner_2025.pdf',
    mimeType: 'application/pdf',
    fileSize: 680000,
    version: '2025',
    visibility: 'PUBLIC',
    status: 'ACTIVE',
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc-3',
    title: 'Home Furniture & Teakwood Catalogue 2025-26',
    description: 'Comprehensive catalogue of handcrafted beds, wardrobes, dining suites, and home mandirs.',
    documentType: 'CATALOGUE',
    fileUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000',
    fileName: 'Shivam_Furniture_Catalogue_2025.pdf',
    mimeType: 'application/pdf',
    fileSize: 4500000,
    version: '2025-26',
    visibility: 'PUBLIC',
    status: 'ACTIVE',
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc-4',
    title: 'Internal Standard Operating Procedures (SOP) & Return Guidelines',
    description: 'Showroom staff guidelines for technician dispatch, warranty logging and customer replacements.',
    documentType: 'POLICY',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000',
    fileName: 'Internal_Staff_SOP_Warranty.pdf',
    mimeType: 'application/pdf',
    fileSize: 280000,
    version: '2.1',
    visibility: 'ADMIN_ONLY',
    status: 'ACTIVE',
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const documentsApi = {
  async getDocuments(filter?: {
    visibility?: DocumentVisibility;
    documentType?: DocumentType;
    status?: 'ACTIVE' | 'ARCHIVED';
  }): Promise<ApiResponse<CompanyDocument[]>> {
    let list: CompanyDocument[] = [...DEFAULT_DOCUMENTS];
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        list = JSON.parse(cached);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) {
      let filtered = [...list];
      if (filter?.visibility) filtered = filtered.filter(d => d.visibility === filter.visibility);
      if (filter?.documentType) filtered = filtered.filter(d => d.documentType === filter.documentType);
      if (filter?.status) filtered = filtered.filter(d => d.status === filter.status);
      return { success: true, data: filtered };
    }

    try {
      let query = supabase.from('company_documents').select('*').order('sort_order', { ascending: true });
      if (filter?.visibility) query = query.eq('visibility', filter.visibility);
      if (filter?.documentType) query = query.eq('document_type', filter.documentType);
      if (filter?.status) query = query.eq('status', filter.status);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: CompanyDocument[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          documentType: d.document_type,
          fileUrl: d.file_url,
          storageKey: d.storage_key,
          fileName: d.file_name,
          mimeType: d.mime_type,
          fileSize: d.file_size || 0,
          version: d.version || '1.0',
          visibility: d.visibility || 'PUBLIC',
          status: d.status || 'ACTIVE',
          sortOrder: d.sort_order || 0,
          uploadedBy: d.uploaded_by,
          createdAt: d.created_at || new Date().toISOString(),
          updatedAt: d.updated_at || new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (e) {
      // fallback
    }

    let filtered = [...list];
    if (filter?.visibility) filtered = filtered.filter(d => d.visibility === filter.visibility);
    if (filter?.documentType) filtered = filtered.filter(d => d.documentType === filter.documentType);
    if (filter?.status) filtered = filtered.filter(d => d.status === filter.status);
    return { success: true, data: filtered };
  },

  async createDocument(doc: Partial<CompanyDocument>): Promise<ApiResponse<CompanyDocument>> {
    const newDoc: CompanyDocument = {
      id: doc.id || `doc-${Date.now()}`,
      title: doc.title || 'Untitled Document',
      description: doc.description || '',
      documentType: doc.documentType || 'OTHER',
      fileUrl: doc.fileUrl || '',
      storageKey: doc.storageKey,
      fileName: doc.fileName || 'document.pdf',
      mimeType: doc.mimeType || 'application/pdf',
      fileSize: doc.fileSize || 102400,
      version: doc.version || '1.0',
      visibility: doc.visibility || 'PUBLIC',
      status: doc.status || 'ACTIVE',
      sortOrder: doc.sortOrder || 0,
      uploadedBy: doc.uploadedBy || 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local cache
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      const list: CompanyDocument[] = cached ? JSON.parse(cached) : DEFAULT_DOCUMENTS;
      list.push(newDoc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('company_documents')
          .insert({
            title: newDoc.title,
            description: newDoc.description,
            document_type: newDoc.documentType,
            file_url: newDoc.fileUrl,
            storage_key: newDoc.storageKey,
            file_name: newDoc.fileName,
            mime_type: newDoc.mimeType,
            file_size: newDoc.fileSize,
            version: newDoc.version,
            visibility: newDoc.visibility,
            status: newDoc.status,
            sort_order: newDoc.sortOrder,
            uploaded_by: newDoc.uploadedBy,
          })
          .select()
          .maybeSingle();

        if (!error && data) {
          newDoc.id = data.id;
        }
      } catch (e) {
        // ignore
      }
    }

    return { success: true, data: newDoc };
  },

  async updateDocument(id: string, updates: Partial<CompanyDocument>): Promise<ApiResponse<CompanyDocument>> {
    let updatedDoc: CompanyDocument | null = null;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      let list: CompanyDocument[] = cached ? JSON.parse(cached) : DEFAULT_DOCUMENTS;
      list = list.map(d => {
        if (d.id === id) {
          updatedDoc = { ...d, ...updates, updatedAt: new Date().toISOString() };
          return updatedDoc;
        }
        return d;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.documentType !== undefined) payload.document_type = updates.documentType;
        if (updates.fileUrl !== undefined) payload.file_url = updates.fileUrl;
        if (updates.visibility !== undefined) payload.visibility = updates.visibility;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.version !== undefined) payload.version = updates.version;

        await supabase.from('company_documents').update(payload).eq('id', id);
      } catch (e) {
        // ignore
      }
    }

    if (updatedDoc) return { success: true, data: updatedDoc };
    return { success: false, error: 'Document not found' };
  },

  async deleteDocument(id: string): Promise<ApiResponse<boolean>> {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      let list: CompanyDocument[] = cached ? JSON.parse(cached) : DEFAULT_DOCUMENTS;
      list = list.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('company_documents').delete().eq('id', id);
      } catch (e) {
        // ignore
      }
    }

    return { success: true, data: true };
  },
};
