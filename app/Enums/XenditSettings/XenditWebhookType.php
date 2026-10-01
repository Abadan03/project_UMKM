<?php

namespace App\Enums\XenditSettings;

enum XenditWebhookType: string
{
    case Invoice = 'invoice';
    case Cash = 'cash';
    case FvaPaid = 'fva_paid';
    case Ewallet = 'ewallet';
    case Disbursement = 'disbursement';

    // sesuaikan sama payment method apa aja yang dipake di POS kamu
}