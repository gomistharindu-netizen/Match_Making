<?php

namespace App\Filament\Resources\HoroscopeOrders\Pages;

use App\Filament\Resources\HoroscopeOrders\HoroscopeOrderResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHoroscopeOrders extends ListRecords
{
    protected static string $resource = HoroscopeOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
