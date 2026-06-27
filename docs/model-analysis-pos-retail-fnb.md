# Analisa Model Untuk POS Retail & F&B

Tanggal analisa: 2026-06-26

## Ringkasan

Model saat ini sudah cukup untuk tahap awal manajemen user, role, produk, unit, dan inventory sederhana. Namun untuk tujuan bisnis POS retail dan F&B, struktur ini belum cukup untuk menangani transaksi kasir, pembayaran, stok historis, multi-outlet, shift kasir, diskon, pajak, refund, dan kebutuhan khusus F&B seperti meja, dine-in/takeaway, modifier, resep, dan kitchen order.

Prioritas terdekat sebaiknya bukan langsung menambah semua model, tetapi memperbaiki fondasi data produk dan inventory, lalu menambahkan model transaksi POS minimum.

## Model Yang Ada Saat Ini

| Model | Tabel | Fungsi saat ini | Catatan |
| --- | --- | --- | --- |
| `User` | `users` | Akun pengguna aplikasi | Sudah punya `roles_id`, password hash, dan relasi ke role. |
| `T_Roles` | `t_roles` | Role user | Relasi dan method masih perlu diperbaiki. |
| `Product` | `t_products` | Master produk | Masih mencampur data produk, harga, dan stok. |
| `T_Units` | `t_units` | Unit produk | Cocok untuk unit seperti pcs, kg, liter, porsi. |
| `Inventory` | `t_inventory` | Status aktif inventory produk | Belum menyimpan quantity stok yang benar sebagai ledger/movement. |

## Masalah Model Saat Ini

### 1. Relasi `Product::inventory()` salah foreign key

Di `Product.php`, relasi memakai `prdocuts_id`, padahal migration memakai `products_id`.

Rekomendasi:

```php
public function inventory()
{
    return $this->hasOne(Inventory::class, 'products_id');
}
```

Jika nantinya satu produk bisa punya stok di banyak outlet/gudang, relasi ini lebih tepat menjadi:

```php
public function inventories()
{
    return $this->hasMany(Inventory::class, 'product_id');
}
```

### 2. Nama foreign key belum konsisten

Saat ini ada `products_id` di inventory dan `roles_id` di user. Laravel convention biasanya `product_id` dan `role_id`.

Rekomendasi:

- Untuk project baru atau sebelum production: rename menjadi `product_id` dan `role_id`.
- Jika data sudah production: buat migration transisi dengan hati-hati.

### 3. `T_Roles::user()` kurang foreign key dan kardinalitas

Satu role biasanya punya banyak user, bukan hanya satu user. Relasi saat ini:

```php
public function user()
{
    return $this->hasOne(User::class);
}
```

Rekomendasi:

```php
public function users()
{
    return $this->hasMany(User::class, 'roles_id');
}
```

### 4. `T_Roles::hasRole()` tidak valid di model role

Method `hasRole()` memanggil `$this->roles()`, tetapi model `T_Roles` tidak punya relasi `roles()`. Method ini lebih cocok berada di `User`, atau gunakan package Spatie Permission secara konsisten.

Rekomendasi praktis:

- Jika tetap pakai tabel custom `t_roles`, pindahkan pengecekan role ke `User`.
- Jika ingin pakai Spatie Permission, ikuti struktur tabel Spatie dan jangan campur dengan `roles_id` custom tanpa desain yang jelas.

### 5. `Product` masih mencampur stok dan master data

Field `qty` berada di `t_products`. Untuk POS, stok sebaiknya tidak hanya satu angka di produk, karena stok berubah karena pembelian, penjualan, retur, adjustment, waste, transfer, dan produksi.

Rekomendasi:

- `products` menyimpan master produk.
- `inventory_stocks` menyimpan saldo stok per outlet/lokasi.
- `stock_movements` menyimpan histori setiap perubahan stok.

### 6. Harga masih terlalu sederhana

Field `pricing` hanya satu harga. Retail dan F&B biasanya butuh:

- Harga jual reguler.
- Harga modal atau average cost.
- Harga promo.
- Harga berdasarkan outlet.
- Harga berdasarkan varian.
- Pajak dan service charge.

Rekomendasi minimum:

- Rename `pricing` menjadi `selling_price`.
- Tambahkan `cost_price`.
- Simpan nominal uang sebagai integer minor unit, misalnya rupiah tanpa desimal.

### 7. Belum ada soft delete dan status bisnis

Produk, user, outlet, customer, supplier, dan transaksi biasanya tidak boleh benar-benar hilang karena laporan dan audit.

Rekomendasi:

- Tambahkan `SoftDeletes` untuk master data penting.
- Tambahkan status seperti `is_active`, `is_sellable`, `is_stock_tracked`.

### 8. `Inventory` belum cukup untuk audit stok

Inventory saat ini hanya punya `isActive` dan `products_id`. Ini belum bisa menjawab:

- Stok awal berapa?
- Stok berubah karena transaksi apa?
- Siapa yang melakukan adjustment?
- Stok di outlet A dan outlet B berapa?
- HPP produk berapa?

Rekomendasi:

- Pisahkan saldo stok dan histori movement.
- Setiap transaksi penjualan membuat movement keluar.
- Setiap pembelian/restock membuat movement masuk.

## Model Minimum Untuk POS

Bagian ini adalah minimum yang diperlukan agar aplikasi bisa disebut POS operasional, bukan hanya product management.

### 1. `stores` atau `outlets`

Untuk mendukung bisnis retail/F&B yang punya satu atau banyak cabang.

Field utama:

- `id`
- `name`
- `code`
- `address`
- `phone`
- `is_active`

Relasi:

- `Outlet hasMany Users`
- `Outlet hasMany Orders`
- `Outlet hasMany InventoryStocks`

### 2. `customers`

Untuk mencatat pelanggan, loyalty, piutang, histori pembelian, dan promo.

Field utama:

- `id`
- `name`
- `phone`
- `email`
- `address`
- `loyalty_points`
- `is_active`

Relasi:

- `Customer hasMany Orders`

### 3. `categories`

Produk perlu kategori untuk filter POS, laporan, dan menu.

Field utama:

- `id`
- `name`
- `slug`
- `parent_id`
- `sort_order`
- `is_active`

Relasi:

- `Category hasMany Products`
- `Category belongsTo Category parent`

### 4. `products`

Master item yang bisa dijual atau dipakai sebagai bahan.

Field minimum:

- `id`
- `category_id`
- `unit_id`
- `sku`
- `barcode`
- `name`
- `description`
- `type`: `retail`, `menu`, `ingredient`, `service`, `bundle`
- `selling_price`
- `cost_price`
- `is_stock_tracked`
- `is_sellable`
- `is_active`

Relasi:

- `Product belongsTo Category`
- `Product belongsTo Unit`
- `Product hasMany ProductVariants`
- `Product hasMany OrderItems`
- `Product hasMany StockMovements`

### 5. `product_variants`

Retail sering punya ukuran/warna. F&B bisa punya size seperti regular/large.

Field utama:

- `id`
- `product_id`
- `sku`
- `barcode`
- `name`
- `attributes` JSON
- `selling_price`
- `cost_price`
- `is_active`

Relasi:

- `ProductVariant belongsTo Product`
- `ProductVariant hasMany OrderItems`

### 6. `inventory_stocks`

Saldo stok terkini per outlet dan produk/varian.

Field utama:

- `id`
- `outlet_id`
- `product_id`
- `product_variant_id`
- `qty_on_hand`
- `qty_reserved`
- `minimum_stock`
- `maximum_stock`

Relasi:

- `InventoryStock belongsTo Outlet`
- `InventoryStock belongsTo Product`
- `InventoryStock belongsTo ProductVariant`

### 7. `stock_movements`

Ledger stok. Ini penting untuk audit dan laporan.

Field utama:

- `id`
- `outlet_id`
- `product_id`
- `product_variant_id`
- `type`: `opening`, `purchase`, `sale`, `refund`, `adjustment`, `waste`, `transfer_in`, `transfer_out`, `production`
- `qty`
- `unit_cost`
- `reference_type`
- `reference_id`
- `notes`
- `created_by`

Relasi:

- `StockMovement belongsTo Outlet`
- `StockMovement belongsTo Product`
- `StockMovement belongsTo User createdBy`

### 8. `orders`

Header transaksi penjualan.

Field utama:

- `id`
- `outlet_id`
- `customer_id`
- `cashier_id`
- `order_number`
- `channel`: `pos`, `online`, `delivery`
- `service_type`: `dine_in`, `takeaway`, `delivery`, `retail`
- `status`: `draft`, `open`, `paid`, `void`, `refunded`
- `subtotal`
- `discount_total`
- `tax_total`
- `service_charge_total`
- `grand_total`
- `paid_total`
- `change_total`
- `notes`
- `paid_at`

Relasi:

- `Order belongsTo Outlet`
- `Order belongsTo Customer`
- `Order belongsTo User cashier`
- `Order hasMany OrderItems`
- `Order hasMany Payments`

### 9. `order_items`

Detail item transaksi.

Field utama:

- `id`
- `order_id`
- `product_id`
- `product_variant_id`
- `name_snapshot`
- `sku_snapshot`
- `qty`
- `unit_price`
- `cost_price`
- `discount_total`
- `tax_total`
- `line_total`
- `notes`

Relasi:

- `OrderItem belongsTo Order`
- `OrderItem belongsTo Product`
- `OrderItem hasMany OrderItemModifiers`

Catatan penting: gunakan snapshot nama dan harga agar laporan historis tidak berubah saat master produk diedit.

### 10. `payments`

Satu transaksi bisa dibayar dengan lebih dari satu metode.

Field utama:

- `id`
- `order_id`
- `payment_method_id`
- `amount`
- `reference_number`
- `status`: `pending`, `paid`, `failed`, `refunded`
- `paid_at`

Relasi:

- `Payment belongsTo Order`
- `Payment belongsTo PaymentMethod`

### 11. `payment_methods`

Metode pembayaran.

Field utama:

- `id`
- `name`: cash, QRIS, debit, credit card, e-wallet, transfer
- `code`
- `is_cash`
- `is_active`

Relasi:

- `PaymentMethod hasMany Payments`

### 12. `cashier_shifts`

Untuk kontrol kas kasir.

Field utama:

- `id`
- `outlet_id`
- `user_id`
- `opened_at`
- `closed_at`
- `opening_cash`
- `closing_cash`
- `expected_cash`
- `cash_difference`
- `status`: `open`, `closed`

Relasi:

- `CashierShift belongsTo Outlet`
- `CashierShift belongsTo User`
- `CashierShift hasMany Orders`

## Tambahan Khusus Retail

### 1. `suppliers`

Untuk pembelian dan restock.

Field utama:

- `id`
- `name`
- `phone`
- `email`
- `address`
- `is_active`

### 2. `purchase_orders`

Header pembelian dari supplier.

Field utama:

- `id`
- `supplier_id`
- `outlet_id`
- `purchase_number`
- `status`: `draft`, `ordered`, `received`, `cancelled`
- `subtotal`
- `discount_total`
- `tax_total`
- `grand_total`
- `received_at`

### 3. `purchase_order_items`

Detail pembelian.

Field utama:

- `id`
- `purchase_order_id`
- `product_id`
- `product_variant_id`
- `qty_ordered`
- `qty_received`
- `unit_cost`
- `line_total`

### 4. `stock_transfers`

Jika ada banyak outlet/gudang.

Field utama:

- `id`
- `from_outlet_id`
- `to_outlet_id`
- `transfer_number`
- `status`
- `sent_at`
- `received_at`

### 5. `stock_transfer_items`

Detail transfer stok.

Field utama:

- `id`
- `stock_transfer_id`
- `product_id`
- `product_variant_id`
- `qty`

## Tambahan Khusus F&B

### 1. `tables`

Untuk dine-in.

Field utama:

- `id`
- `outlet_id`
- `name`
- `capacity`
- `status`: `available`, `occupied`, `reserved`, `inactive`

Relasi:

- `Table belongsTo Outlet`
- `Table hasMany Orders`

### 2. `order_tables`

Jika satu order bisa gabung atau pindah meja.

Field utama:

- `id`
- `order_id`
- `table_id`
- `started_at`
- `ended_at`

### 3. `modifiers`

Tambahan atau pilihan item, misalnya extra cheese, less sugar, spicy level.

Field utama:

- `id`
- `name`
- `type`: `single`, `multiple`
- `is_required`
- `min_select`
- `max_select`

### 4. `modifier_options`

Pilihan modifier.

Field utama:

- `id`
- `modifier_id`
- `name`
- `price_delta`
- `cost_delta`
- `is_active`

### 5. `product_modifiers`

Pivot antara produk/menu dan modifier.

Field utama:

- `id`
- `product_id`
- `modifier_id`

### 6. `order_item_modifiers`

Snapshot modifier yang dipilih pada transaksi.

Field utama:

- `id`
- `order_item_id`
- `modifier_option_id`
- `name_snapshot`
- `price_delta`
- `qty`

### 7. `recipes`

Resep untuk menu F&B.

Field utama:

- `id`
- `product_id`
- `yield_qty`
- `unit_id`

### 8. `recipe_items`

Bahan baku yang dipakai oleh sebuah menu.

Field utama:

- `id`
- `recipe_id`
- `ingredient_product_id`
- `qty`
- `unit_id`

Catatan: Saat menu terjual, stok bahan baku turun berdasarkan resep, bukan stok menu jadi.

### 9. `kitchen_orders`

Ticket ke dapur/bar.

Field utama:

- `id`
- `order_id`
- `station`: `kitchen`, `bar`, `dessert`
- `status`: `queued`, `preparing`, `ready`, `served`, `cancelled`
- `printed_at`

### 10. `kitchen_order_items`

Detail item yang dikerjakan dapur.

Field utama:

- `id`
- `kitchen_order_id`
- `order_item_id`
- `status`
- `notes`

## Tambahan Promo, Pajak, Dan Biaya

### 1. `taxes`

Untuk PPN atau pajak daerah.

Field utama:

- `id`
- `name`
- `rate`
- `is_inclusive`
- `is_active`

### 2. `discounts`

Promo/diskon.

Field utama:

- `id`
- `name`
- `type`: `percentage`, `fixed`
- `value`
- `starts_at`
- `ends_at`
- `minimum_purchase`
- `is_active`

### 3. `vouchers`

Kupon dengan kode.

Field utama:

- `id`
- `code`
- `discount_id`
- `usage_limit`
- `used_count`
- `starts_at`
- `ends_at`

### 4. `service_charges`

Khusus F&B dine-in.

Field utama:

- `id`
- `name`
- `rate`
- `is_active`

## Tambahan Audit Dan Operasional

### 1. `activity_logs`

Untuk audit perubahan penting.

Field utama:

- `id`
- `user_id`
- `action`
- `subject_type`
- `subject_id`
- `before` JSON
- `after` JSON
- `ip_address`

### 2. `voids`

Mencatat pembatalan transaksi/item.

Field utama:

- `id`
- `order_id`
- `order_item_id`
- `user_id`
- `reason`
- `amount`

### 3. `refunds`

Mencatat pengembalian dana/barang.

Field utama:

- `id`
- `order_id`
- `user_id`
- `refund_number`
- `amount`
- `reason`
- `status`

## Rekomendasi Relasi Inti

```text
Outlet 1--* User
Outlet 1--* Order
Outlet 1--* InventoryStock

Role 1--* User

Category 1--* Product
Unit 1--* Product
Product 1--* ProductVariant
Product 1--* OrderItem
Product 1--* StockMovement

Customer 1--* Order
User 1--* Order as cashier
Order 1--* OrderItem
Order 1--* Payment
PaymentMethod 1--* Payment

Product 1--* Recipe
Recipe 1--* RecipeItem
Order 1--* KitchenOrder
KitchenOrder 1--* KitchenOrderItem
```

## Prioritas Implementasi

### Phase 1: Perbaiki fondasi model yang ada

1. Perbaiki typo foreign key `Product::inventory()`.
2. Konsistenkan naming foreign key.
3. Perbaiki relasi `T_Roles`.
4. Tambahkan casts untuk monetary dan quantity.
5. Tambahkan `is_active` pada produk dan unit.
6. Pisahkan stok dari `products.qty`.

### Phase 2: POS minimum

1. Tambahkan `outlets`.
2. Tambahkan `categories`.
3. Tambahkan `customers`.
4. Tambahkan `orders`.
5. Tambahkan `order_items`.
6. Tambahkan `payment_methods`.
7. Tambahkan `payments`.
8. Tambahkan `cashier_shifts`.

### Phase 3: Inventory yang benar

1. Tambahkan `inventory_stocks`.
2. Tambahkan `stock_movements`.
3. Tambahkan `suppliers`.
4. Tambahkan `purchase_orders`.
5. Tambahkan `purchase_order_items`.

### Phase 4: F&B

1. Tambahkan `tables`.
2. Tambahkan `modifiers`.
3. Tambahkan `modifier_options`.
4. Tambahkan `product_modifiers`.
5. Tambahkan `order_item_modifiers`.
6. Tambahkan `recipes`.
7. Tambahkan `recipe_items`.
8. Tambahkan `kitchen_orders`.

### Phase 5: Promo, pajak, laporan, audit

1. Tambahkan `taxes`.
2. Tambahkan `discounts`.
3. Tambahkan `vouchers`.
4. Tambahkan `refunds`.
5. Tambahkan `voids`.
6. Tambahkan `activity_logs`.

## Model Yang Paling Mendesak Untuk Ditambahkan

Jika target berikutnya adalah membuat POS bisa transaksi, tambahkan model ini dulu:

1. `Outlet`
2. `Category`
3. `Customer`
4. `Order`
5. `OrderItem`
6. `PaymentMethod`
7. `Payment`
8. `CashierShift`
9. `InventoryStock`
10. `StockMovement`

Untuk F&B setelah transaksi dasar jalan:

1. `Table`
2. `Modifier`
3. `ModifierOption`
4. `ProductModifier`
5. `OrderItemModifier`
6. `Recipe`
7. `RecipeItem`
8. `KitchenOrder`

## Catatan Desain Penting

- Jangan hanya menyimpan total transaksi di frontend. Total harus dihitung dan divalidasi ulang di backend.
- Simpan snapshot nama produk, SKU, harga, pajak, dan diskon di `order_items`.
- Jangan menghapus transaksi secara hard delete.
- Stok harus berbasis movement agar bisa diaudit.
- Untuk F&B, bedakan produk jual (`menu`) dan bahan baku (`ingredient`).
- Untuk multi-outlet, semua transaksi dan stok harus terkait `outlet_id`.
- Nominal uang sebaiknya integer, bukan float.
- Quantity untuk F&B bisa decimal karena bahan baku bisa 0.25 kg atau 15 ml.
- Tambahkan index untuk kolom pencarian dan foreign key yang sering dipakai.

## Kesimpulan

Model saat ini cocok untuk tahap product management sederhana, tetapi belum siap untuk POS retail dan F&B. Kekurangan paling besar adalah belum adanya model transaksi, pembayaran, shift kasir, customer, outlet, inventory ledger, dan model khusus F&B.

Langkah terbaik adalah membangun POS minimum terlebih dahulu melalui `orders`, `order_items`, `payments`, `payment_methods`, `cashier_shifts`, `inventory_stocks`, dan `stock_movements`. Setelah itu baru tambahkan kebutuhan F&B seperti meja, modifier, resep, dan kitchen order.
