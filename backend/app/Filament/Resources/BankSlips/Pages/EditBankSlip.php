<?php

namespace App\Filament\Resources\BankSlips\Pages;

use App\Filament\Resources\BankSlips\BankSlipResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBankSlip extends EditRecord
{
    protected static string $resource = BankSlipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
