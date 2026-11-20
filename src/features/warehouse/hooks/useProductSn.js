import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productSnApi } from "../api/productSnApi"

export const PRODUCT_SN_KEYS = {
  all: ["warehouse", "product_sn"],
  products: ["warehouse", "m_product"],
}

export function useProductSn() {
  const queryClient = useQueryClient()

  // 1. Query Data Serial Number List (dari public.m_product_sn join public.m_product)
  const snQuery = useQuery({
    queryKey: PRODUCT_SN_KEYS.all,
    queryFn: productSnApi.getData,
  })

  // 2. Query Data Master Produk (dari tabel public.m_product)
  const productsQuery = useQuery({
    queryKey: PRODUCT_SN_KEYS.products,
    queryFn: productSnApi.getDataBarang,
  })

  // 3. Mutasi Tambah Data SN
  const createMutation = useMutation({
    mutationFn: productSnApi.simpan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_SN_KEYS.all })
    },
  })

  // 4. Mutasi Update Data SN
  const updateMutation = useMutation({
    mutationFn: productSnApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_SN_KEYS.all })
    },
  })

  // 5. Mutasi Hapus Data SN
  const deleteMutation = useMutation({
    mutationFn: productSnApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_SN_KEYS.all })
    },
  })

  // 6. Helper Quick Toggle Status READY (1) <-> SALE (0)
  const toggleStatus = async (item) => {
    const nextQty = Number(item.nqty) === 1 ? 0 : 1
    return updateMutation.mutateAsync({
      id_product_sn: item.id_product_sn,
      id_product: item.id_product,
      sn: item.sn,
      nqty: nextQty,
      id_product_lokasi: item.id_product_lokasi,
      id_gudang: item.id_gudang,
    })
  }

  // 7. Normalisasi daftar master produk langsung dari tabel public.m_product
  const products = useMemo(() => {
    const map = new Map()

    // Ambil dari query tabel public.m_product
    if (Array.isArray(productsQuery.data)) {
      productsQuery.data.forEach((p) => {
        const id = String(p?.id_product ?? "")
        if (id) {
          const name = String(p?.nm_product ?? p?.name_product ?? p?.nama_barang ?? "")
          map.set(id, {
            id_product: id,
            code_product: String(p?.code_product ?? id),
            nm_product: name,
            name_product: name,
            product_deskripsi: p?.product_deskripsi ?? "",
            id_product_kategori: p?.id_product_kategori ?? null,
            flag_active: p?.flag_active ?? 1,
          })
        }
      })
    }

    // Gabungkan dengan produk dari hasil relasi join m_product_sn
    if (Array.isArray(snQuery.data)) {
      snQuery.data.forEach((item) => {
        const id = String(item?.id_product ?? "")
        if (id && !map.has(id)) {
          const name = String(item?.nm_product ?? item?.name_product ?? "")
          map.set(id, {
            id_product: id,
            code_product: String(item?.code_product ?? id),
            nm_product: name,
            name_product: name,
            product_deskripsi: item?.product_deskripsi ?? "",
          })
        }
      })
    }

    return Array.from(map.values())
  }, [productsQuery.data, snQuery.data])

  return {
    snList: snQuery.data || [],
    products,
    provider: productSnApi.getProvider(),


    isConfigured: productSnApi.isConfigured(),
    isLoading: snQuery.isLoading,
    isProductsLoading: productsQuery.isLoading,
    isError: snQuery.isError,
    error: snQuery.error,
    createSn: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateSn: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteSn: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    toggleStatus,
    refetch: snQuery.refetch,
  }
}
