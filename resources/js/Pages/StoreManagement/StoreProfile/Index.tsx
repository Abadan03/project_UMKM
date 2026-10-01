import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type BreadcrumbItem } from '@/types'
import { FormEventHandler, useRef } from 'react'
import { cn } from '@/lib/utils'

interface StoreProfile {
  name: string
  address: string
  phone: string
  currency: string
  timezone: string
  logo: File | null
}

interface Props {
  store?: {
    name: string
    address: string
    phone: string
    currency: string
    timezone: string
    logo_url: string | null
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  // { title: 'Store Management', href: '/store-management' },
  { title: 'Profil Toko', href: '/storeManagement' },
]

// border + shadow keras ala 8-bit, dipakai berulang di card & input
const pixelBorder = 'rounded-none border-2 border-foreground'
const pixelShadow = 'shadow-[4px_4px_0_0_theme(colors.foreground)]'

export default function Index({ store }: Props) {
  const logoInputRef = useRef<HTMLInputElement>(null)

  const { data, setData, post, processing, errors, recentlySuccessful } =
    useForm<StoreProfile>({
      name: store?.name ?? '',
      address: store?.address ?? '',
      phone: store?.phone ?? '',
      currency: store?.currency ?? 'IDR',
      timezone: store?.timezone ?? 'Asia/Jakarta',
      logo: null,
    })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('store-management.profile.update'), {
      forceFormData: true,
      preserveScroll: true,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profil Toko" />

      <div className="max-w-2xl space-y-6 p-6">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 shrink-0 bg-lime-500" aria-hidden="true" />
          <div>
            <h2 className="font-mono text-lg font-bold tracking-tight">
              Profil toko
            </h2>
            <p className="text-sm text-muted-foreground">
              Informasi dasar yang tampil di struk dan invoice.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className={cn(pixelBorder, pixelShadow, 'space-y-6 bg-white p-6')}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                pixelBorder,
                'flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-muted',
              )}
            >
              {store?.logo_url ? (
                <img
                  src={store.logo_url}
                  alt="Logo toko"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-mono text-[10px] text-muted-foreground">
                  LOGO
                </span>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                pixelBorder,
                'rounded-none font-mono text-xs uppercase tracking-wide active:translate-x-[2px] active:translate-y-[2px]',
              )}
              onClick={() => logoInputRef.current?.click()}
            >
              Unggah logo
            </Button>
            {data.logo && (
              <span className="text-sm text-muted-foreground">
                {data.logo.name}
              </span>
            )}
          </div>
          {errors.logo && (
            <p className="text-sm text-red-600">{errors.logo}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Nama toko</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={cn(pixelBorder, 'focus-visible:ring-0 focus-visible:shadow-[2px_2px_0_0_theme(colors.foreground)]')}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                placeholder="Jl. Contoh No. 1, Surabaya"
                className={cn(pixelBorder, 'focus-visible:ring-0 focus-visible:shadow-[2px_2px_0_0_theme(colors.foreground)]')}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor telepon</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="+62 812-0000-0000"
                className={cn(pixelBorder, 'focus-visible:ring-0 focus-visible:shadow-[2px_2px_0_0_theme(colors.foreground)]')}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Mata uang</Label>
              <Select
                value={data.currency}
                onValueChange={(value) => setData('currency', value)}
              >
                <SelectTrigger id="currency" className={cn(pixelBorder)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-foreground">
                  <SelectItem value="IDR">IDR (Rp)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona waktu</Label>
              <Select
                value={data.timezone}
                onValueChange={(value) => setData('timezone', value)}
              >
                <SelectTrigger id="timezone" className={cn(pixelBorder)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-foreground">
                  <SelectItem value="Asia/Jakarta">WIB (GMT+7)</SelectItem>
                  <SelectItem value="Asia/Makassar">WITA (GMT+8)</SelectItem>
                  <SelectItem value="Asia/Jayapura">WIT (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
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