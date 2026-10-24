<?php

namespace App\Filament\Resources\PaymentOrders\Pages;

use App\Filament\Resources\PaymentOrders\PaymentOrderResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPaymentOrder extends EditRecord
{
    protected static string $resource = PaymentOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
