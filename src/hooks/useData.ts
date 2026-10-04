import { useState, useEffect } from 'react';
import { designsApi, collectionsApi } from '../services/api';
import type { Design, Collection } from '../data';

// Hook to fetch designs from Supabase (real-time only)
export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchDesigns = async () => {
      setLoading(true);
      const res = await designsApi.getAll();
      if (!cancelled) {
        setDesigns(res.success && res.data ? res.data : []);
        setLoading(false);
      }
    };
    fetchDesigns();
    return () => { cancelled = true; };
  }, []);

  return { designs, loading };
}

// Hook to fetch collections from Supabase (real-time only)
export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchCollections = async () => {
      setLoading(true);
      const res = await collectionsApi.getAll();
      if (!cancelled) {
        setCollections(res.success && res.data ? res.data : []);
        setLoading(false);
      }
    };
    fetchCollections();
    return () => { cancelled = true; };
  }, []);

  return { collections, loading };
}

// Hook to fetch a single design by slug (real-time only)
export function useDesign(slug: string | undefined) {
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchDesign = async () => {
      setLoading(true);
      setNotFound(false);
      const res = await designsApi.getBySlug(slug);
      if (!cancelled) {
        if (res.success && res.data) {
          setDesign(res.data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      }
    };
    fetchDesign();
    return () => { cancelled = true; };
  }, [slug]);

  return { design, loading, notFound };
}
