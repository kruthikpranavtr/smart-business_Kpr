// Inventory Management Page for SMARTORA
import React, { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, Plus, Edit2, Trash2, IndianRupee, Layers } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatCard from '../components/common/StatCard';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, stats } = useData();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Hardware',
    stock: 10,
    minStock: 5,
    price: 9999
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Hardware',
      stock: 10,
      minStock: 5,
      price: 9999
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      stock: p.stock,
      minStock: p.minStock,
      price: p.price
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (p) => {
    setSelectedProduct(p);
    setIsDeleteOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Validation Error', 'Product name is required', 'warning');
      return;
    }
    addProduct(formData);
    addToast('Product Added', `${formData.name} added to catalog.`, 'success');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Validation Error', 'Product name is required', 'warning');
      return;
    }
    updateProduct(selectedProduct.id, formData);
    addToast('Product Updated', `${formData.name} stock level updated.`, 'success');
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      addToast('Product Deleted', `${selectedProduct.name} removed.`, 'info');
      setIsDeleteOpen(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product / Hardware Item',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block">{p.name}</span>
          <span className="text-xs text-slate-400">{p.id}</span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true
    },
    {
      key: 'stock',
      label: 'Current Stock',
      sortable: true,
      render: (p) => (
        <span className="font-bold text-xs">
          {p.stock} units
        </span>
      )
    },
    {
      key: 'minStock',
      label: 'Minimum Buffer',
      sortable: true,
      render: (p) => <span className="text-xs text-slate-500">{p.minStock} units</span>
    },
    {
      key: 'price',
      label: 'Unit Price (₹)',
      sortable: true,
      render: (p) => <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">₹{p.price.toLocaleString('en-IN')}</span>
    },
    {
      key: 'status',
      label: 'Health Status',
      sortable: true,
      render: (p) => {
        let variant = 'success';
        if (p.status === 'Low Stock') variant = 'warning';
        if (p.status === 'Out of Stock') variant = 'danger';
        return <Badge variant={variant}>{p.status}</Badge>;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEdit(p)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(p)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Inventory & Asset Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track hardware supplies, classroom AV equipment, and automated reorder buffers
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
          className="shadow-sm shadow-blue-500/20"
        >
          Add Product
        </Button>
      </div>

      {/* Proactive Low Stock Warning Callout */}
      {stats.lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm">
                ⚠ INVENTORY BUFFER DEFICIT DETECTED
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Dell UltraSharp 4K Monitor stock is below minimum buffer (4 remaining, min 8). HP LaserJet Toner is Out of Stock.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addToast('Procurement Request Sent', 'Purchase requisition #PO-9411 dispatched to vendor.', 'success')}
            className="shrink-0 text-xs font-semibold border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
          >
            Trigger Bulk Restock
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          change="Full Catalog"
          isPositive={true}
          icon={Package}
          color="blue"
          subtext="Across 8 categories"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount}
          change="Approaching buffer"
          isPositive={false}
          icon={AlertTriangle}
          color="amber"
          subtext="Reorder recommended"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStockCount}
          change="Immediate action"
          isPositive={false}
          icon={AlertTriangle}
          color="rose"
          subtext="1 consumable item"
        />
        <StatCard
          title="Inventory Value"
          value={`₹${(stats.inventoryValuation / 100000).toFixed(2)}L`}
          change="+11.4% valuation"
          isPositive={true}
          icon={Layers}
          color="emerald"
          subtext="Current warehouse worth"
        />
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search product name, ID, category..."
        searchKeys={['name', 'id', 'category']}
        filterKey="category"
        filterLabel="Category"
        filterOptions={['Hardware', 'Peripherals', 'Networking', 'Consumables', 'Components', 'Classroom Tech', 'Lab Equipment', 'Power', 'Furniture', 'Storage']}
        pageSize={8}
      />

      {/* Modal: Add Product */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Inventory Item"
        subtitle="Catalog new equipment and specify minimum safety stock"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Raspberry Pi 5 8GB Board"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Hardware">Hardware</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Networking">Networking</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Classroom Tech">Classroom Tech</option>
                <option value="Consumables">Consumables</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Unit Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Initial Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Minimum Stock Buffer
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Product */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Inventory"
        subtitle={`Adjusting stock level for ${selectedProduct?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Product Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Current Stock Count
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Minimum Stock Buffer
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Product"
        message={`Are you sure you want to delete ${selectedProduct?.name}?`}
      />
    </div>
  );
}
