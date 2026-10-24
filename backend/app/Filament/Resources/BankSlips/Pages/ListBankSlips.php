<?php

namespace App\Filament\Resources\BankSlips\Pages;

use App\Filament\Resources\BankSlips\BankSlipResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBankSlips extends ListRecords
{
    protected static string $resource = BankSlipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
