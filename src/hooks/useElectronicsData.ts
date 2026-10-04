import { useState, useEffect } from 'react';
import { productsApi, categoriesApi, brandsApi, bannersApi } from '../services/electronicsApi';
import type { Product, Category, Brand, Banner } from '../types/electronics';

export function useProducts(filters?: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      const res = await productsApi.getAll(filters);
      if (!cancelled) {
        if (res.success && res.data) {
          setProducts(res.data);
        }
        setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [filters]);

  return { products, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      setLoading(true);
      const res = await categoriesApi.getAll();
      if (!cancelled) {
        if (res.success && res.data) {
          setCategories(res.data);
        }
        setLoading(false);
      }
    };
    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchBrands = async () => {
      setLoading(true);
      const res = await brandsApi.getAll();
      if (!cancelled) {
        if (res.success && res.data) {
          setBrands(res.data);
        }
        setLoading(false);
      }
    };
    fetchBrands();
    return () => { cancelled = true; };
  }, []);

  return { brands, loading };
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchBanners = async () => {
      setLoading(true);
      const res = await bannersApi.getAll();
      if (!cancelled) {
        if (res.success && res.data) {
          setBanners(res.data);
        }
        setLoading(false);
      }
    };
    fetchBanners();
    return () => { cancelled = true; };
  }, []);

  return { banners, loading };
}
