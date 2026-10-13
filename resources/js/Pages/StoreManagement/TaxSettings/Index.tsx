import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FormEventHandler, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TaxSettingForm {
  name: string
  percentage: number
  is_active: boolean
  is_inclusive: boolean
}

interface Props {
  taxSetting?: {
    name: string
    percentage: number
    is_active: boolean
    is_inclusive: boolean
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  //   { title: 'Store Management', href: '/store-management' },
  { title: 'Tax Settings', href: '/storeManagement/taxSettings' },
]

const pixelBorder = 'rounded-none border-2 border-foreground'
const pixelShadow = 'shadow-[4px_4px_0_0_theme(colors.foreground)]'

// contoh harga buat preview, biar keliatan efek exclusive vs inclusive
const SAMPLE_PRICE = 100_000

export default function Index({ taxSetting }: Props) {
  const { data, setData, post, processing, errors, recentlySuccessful } =
    useForm<TaxSettingForm>({
      name: taxSetting?.name ?? 'PPN',
      percentage: taxSetting?.percentage ?? 11,
      is_active: taxSetting?.is_active ?? true,
      is_inclusive: taxSetting?.is_inclusive ?? false,
    })

  const preview = useMemo(() => {
    const pct = Number(data.percentage) || 0

    if (data.is_inclusive) {
      const taxAmount = SAMPLE_PRICE - SAMPLE_PRICE / (1 + pct / 100)
      return {
        base: SAMPLE_PRICE - taxAmount,
        tax: taxAmount,
        total: SAMPLE_PRICE,
      }
    }

    const taxAmount = SAMPLE_PRICE * (pct / 100)
    return {
      base: SAMPLE_PRICE,
      tax: taxAmount,
      total: SAMPLE_PRICE + taxAmount,
    }
  }, [data.percentage, data.is_inclusive])

  const formatRp = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/storeManagement/taxSettings'), {
      preserveScroll: true,
    }
  }

  if(recentlySuccessful) {
    toast.success('Pengaturan pajak berhasil disimpan.');
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tax Settings" />

      <div className="max-w-2xl space-y-6 p-6">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 shrink-0 bg-lime-500" aria-hidden="true" />
          <div>
            <h2 className="font-mono text-lg font-bold tracking-tight">
              Pengaturan pajak
            </h2>
            <p className="text-sm text-muted-foreground">
              Pajak ini otomatis dihitung ke setiap transaksi kasir.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className={cn(pixelBorder, pixelShadow, 'space-y-6 bg-white p-6')}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama pajak</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={cn(
                  pixelBorder,
                  'focus-visible:ring-0 focus-visible:shadow-[2px_2px_0_0_theme(colors.foreground)]',
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Persentase (%)</Label>
              <Input
                id="percentage"
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={data.percentage}
                onChange={(e) => setData('percentage', Number(e.target.value))}
                className={cn(
                  pixelBorder,
                  'focus-visible:ring-0 focus-visible:shadow-[2px_2px_0_0_theme(colors.foreground)]',
                )}
              />
              {errors.percentage && (
                <p className="text-sm text-red-600">{errors.percentage}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className={cn(pixelBorder, 'flex items-center justify-between p-3')}>
              <div>
                <p className="text-sm font-medium">Aktifkan pajak</p>
                <p className="text-xs text-muted-foreground">
                  Pajak dihitung otomatis di setiap transaksi kasir.
                </p>
              </div>
              <Switch
                checked={data.is_active}
                onCheckedChange={(checked) => setData('is_active', checked)}
              />
            </div>

            <div className={cn(pixelBorder, 'flex items-center justify-between p-3')}>
              <div>
                <p className="text-sm font-medium">Harga sudah termasuk pajak</p>
                <p className="text-xs text-muted-foreground">
                  Inclusive: harga jual nggak berubah, pajak dihitung mundur dari
                  harga itu. Exclusive: pajak ditambahkan di atas harga jual.
                </p>
              </div>
              <Switch
                checked={data.is_inclusive}
                onCheckedChange={(checked) => setData('is_inclusive', checked)}
                disabled={true}
              />
            </div>
          </div>

          {/* preview kalkulasi, biar efek exclusive/inclusive langsung keliatan */}
          <div className={cn(pixelBorder, 'space-y-2 bg-muted/40 p-4 font-mono text-xs')}>
            <p className="text-muted-foreground">
              Contoh untuk harga jual {formatRp(SAMPLE_PRICE)}
            </p>
            <div className="flex justify-between">
              <span>Harga dasar</span>
              <span>{formatRp(preview.base)}</span>
            </div>
            <div className="flex justify-between">
              <span>{data.name || 'Pajak'} ({data.percentage || 0}%)</span>
              <span>{formatRp(preview.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-foreground/20 pt-2 font-bold">
              <span>Total bayar</span>
              <span>{formatRp(preview.total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button
              type="submit"
              disabled={processing}
              className={cn(
                pixelBorder,
                pixelShadow,
                'bg-foreground font-mono text-xs uppercase tracking-wide text-background transition-none hover:bg-foreground/90 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
              )}
            >
              Simpan perubahan
            </Button>
            {recentlySuccessful && (
              <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="h-2 w-2 bg-lime-500" aria-hidden="true" />
                Tersimpan
              </span>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  )
}