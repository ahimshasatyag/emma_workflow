import axiosClient from "@/api/axiosClient"

// Mock database inventaris gudang awal
const initialInventory = [
  {
    id: "INV-001",
    sku: "RM-STL-01",
    name: "Pelat Baja Karbon 2mm",
    category: "Bahan Baku",
    stock: 145,
    unit: "Lembar",
    location: "Gudang A - Rak 03",
    status: "IN_STOCK",
    minStock: 50,
  },
  {
    id: "INV-002",
    sku: "RM-RSN-09",
    name: "Resin Polimer ABS Grade A",
    category: "Bahan Baku",
    stock: 18,
    unit: "Karung (25kg)",
    location: "Gudang B - Pallet 12",
    status: "LOW_STOCK",
    minStock: 25,
  },
  {
    id: "INV-003",
    sku: "FG-BOX-10",
    name: "Kotak Distribusi Plastik 50L",
    category: "Barang Jadi",
    stock: 420,
    unit: "Unit",
    location: "Gudang Transit - Area C",
    status: "IN_STOCK",
    minStock: 100,
  },
  {
    id: "INV-004",
    sku: "SP-VLV-44",
    name: "Solenoid Valve 24V DC",
    category: "Sparepart Mesin",
    stock: 0,
    unit: "Pcs",
    location: "Ruang Maintenance",
    status: "OUT_OF_STOCK",
    minStock: 5,
  },
]

let localInventory = [...initialInventory]

export const warehouseApi = {
  getInventory: async () => {
    try {
      const response = await axiosClient.get("/warehouse/inventory")
      return response.data || response
    } catch {
      return localInventory
    }
  },

  scanBarcode: async (skuCode) => {
    try {
      const response = await axiosClient.post("/warehouse/scan", { code: skuCode })
      return response.data || response
    } catch {
      const item = localInventory.find(
        (i) => i.sku.toLowerCase() === skuCode.toLowerCase() || i.id.toLowerCase() === skuCode.toLowerCase()
      )
      if (!item) throw new Error(`Barang dengan kode "${skuCode}" tidak ditemukan di database gudang.`)
      return item
    }
  },

  recordMovement: async ({ sku, type, quantity, notes }) => {
    try {
      const response = await axiosClient.post("/warehouse/movement", { sku, type, quantity, notes })
      return response.data || response
    } catch {
      localInventory = localInventory.map((item) => {
        if (item.sku === sku) {
          const qty = Number(quantity)
          const newStock = type === "INBOUND" ? item.stock + qty : Math.max(0, item.stock - qty)
          const newStatus =
            newStock === 0 ? "OUT_OF_STOCK" : newStock <= item.minStock ? "LOW_STOCK" : "IN_STOCK"
          return { ...item, stock: newStock, status: newStatus }
        }
        return item
      })
      return { success: true, sku, type, quantity }
    }
  },
}
