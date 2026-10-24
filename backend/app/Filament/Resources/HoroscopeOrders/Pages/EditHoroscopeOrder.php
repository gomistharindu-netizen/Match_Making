<?php

namespace App\Filament\Resources\HoroscopeOrders\Pages;

use App\Filament\Resources\HoroscopeOrders\HoroscopeOrderResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHoroscopeOrder extends EditRecord
{
    protected static string $resource = HoroscopeOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
