import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
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
import { FormEventHandler, useState } from 'react'
import { cn } from '@/lib/utils'

interface XenditSettingForm {
  environment: 'sandbox' | 'live'
  api_key: string
//   webhook_token: string
}

interface Props {
  xenditSetting?: {
    environment: 'sandbox' | 'live'
    is_connected: boolean
    callback_url: string
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Xendit Settings', href: '/storeManagement/xenditSettings' },
]

const pixelBorder = 'rounded-none border-2 border-foreground'
const pixelShadow = 'shadow-[4px_4px_0_0_theme(colors.foreground)]'

export default function Index({ xenditSetting }: Props) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')

  const { data, setData, post, processing, errors, recentlySuccessful } =
    useForm<XenditSettingForm>({
      environment: xenditSetting?.environment ?? 'sandbox',
      api_key: '',
    //   webhook_token: '',
    })

  const isConnected = xenditSetting?.is_connected ?? false

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content')


     console.log('CSRF TOKEN:', csrfToken)

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/storeManagement/xenditSettings', {
      preserveScroll: true,
    })
  }

  const testConnection = async () => {
    setTestStatus('testing')
    try {
      const response = await fetch(
        '/storeManagement/xenditSettings-test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN':
              csrfToken ?? ''
          },
          body: JSON.stringify({
            environment: data.environment,
            api_key: data.api_key,
          }),
        },
      )
      setTestStatus(response.ok ? 'success' : 'failed')
    } catch {
      setTestStatus('failed')
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Xendit Settings" />

      <div className="max-w-2xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 shrink-0 bg-lime-500" aria-hidden="true" />
            <div>
              <h2 className="font-mono text-lg font-bold tracking-tight">
                Akun Xendit
              </h2>
              <p className="text-sm text-muted-foreground">
                Hubungkan akun Xendit untuk menerima pembayaran digital
                (QRIS, VA, e-wallet).
              </p>
            </div>
          </div>

          <span
            className={cn(
              pixelBorder,
              'px-2 py-1 font-mono text-[10px] uppercase tracking-wide',
              isConnected
                ? 'bg-lime-100 text-lime-700'
                : 'bg-red-50 text-red-600',
            )}
          >
            {isConnected ? 'Terhubung' : 'Belum terhubung'}
          </span>
        </div>

        <form
          onSubmit={submit}
          className={cn(pixelBorder, pixelShadow, 'space-y-6 bg-white p-6')}
        >
          <div className="space-y-2">
            <Label htmlFor="environment">Environment</Label>
            <Select
              value={data.environment}
              onValueChange={(value) =>
                setData('environment', value as 'sandbox' | 'live')
              }
            >
              <SelectTrigger id="environment" className={cn(pixelBorder)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-foreground">
                <SelectItem value="sandbox">Sandbox (testing)</SelectItem>
                <SelectItem value="live">Live (production)</SelectItem>
              </SelectContent>
            </Select>
            {errors.environment && (
              <p className="text-sm text-red-600">{errors.environment}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_key">Secret API key</Label>
            <div className="flex gap-2">
              <Input
                id="api_key"
                type={showApiKey ? 'text' : 'password'}
                value={data.api_key}
                onChange={(e) => setData('api_key', e.target.value)}
                placeholder="xnd_development_..."
                className={cn(
                  pixelBorder,
                  'focus-visible:ring-0 focus-visible:shadow-[2px_2px_0_0_theme(colors.foreground)]',
                )}
              />
              <Button
                type="button"
                variant="outline"
                className={cn(pixelBorder, 'shrink-0 font-mono text-xs uppercase')}
                onClick={() => setShowApiKey((prev) => !prev)}
              >
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Kosongkan kalau nggak mau ganti key yang udah tersimpan.
            </p>
            {errors.api_key && (
              <p className="text-sm text-red-600">{errors.api_key}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="callback_url">Callback / webhook URL</Label>
            <Input
              id="callback_url"
              value={xenditSetting?.callback_url ?? ''}
              readOnly
              className={cn(pixelBorder, 'bg-muted text-muted-foreground')}
            />
            <p className="text-xs text-muted-foreground">
              Tempel URL ini di dashboard Xendit &rarr; Webhooks. URL ini
              di-generate otomatis, tidak bisa diubah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={processing}
              className={cn(
                pixelBorder,
                pixelShadow,
                'bg-foreground font-mono text-xs uppercase tracking-wide text-background transition-none hover:bg-foreground/90 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
              )}
            >
              Simpan & hubungkan
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={testStatus === 'testing' || !data.api_key}
              onClick={testConnection}
              className={cn(pixelBorder, 'font-mono text-xs uppercase tracking-wide')}
            >
              {testStatus === 'testing' ? 'Menguji...' : 'Tes koneksi'}
            </Button>

            {testStatus === 'success' && (
              <span className="flex items-center gap-2 font-mono text-xs text-lime-700">
                <span className="h-2 w-2 bg-lime-500" aria-hidden="true" />
                Koneksi berhasil
              </span>
            )}
            {testStatus === 'failed' && (
              <span className="font-mono text-xs text-red-600">
                Koneksi gagal, cek kembali API key kamu
              </span>
            )}
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