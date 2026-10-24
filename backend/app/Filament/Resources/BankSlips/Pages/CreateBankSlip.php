<?php

namespace App\Filament\Resources\BankSlips\Pages;

use App\Filament\Resources\BankSlips\BankSlipResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBankSlip extends CreateRecord
{
    protected static string $resource = BankSlipResource::class;
}
