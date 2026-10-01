<?php

namespace App\Enums\XenditSettings;

enum XenditEnvironment: string
{
    case Sandbox = 'sandbox';
    case Live = 'live';

    public function label(): string
    {
        return match ($this) {
            self::Sandbox => 'Sandbox (testing)',
            self::Live => 'Live (production)',
        };
    }
}