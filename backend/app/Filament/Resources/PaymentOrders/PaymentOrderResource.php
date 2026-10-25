<?php

namespace App\Filament\Resources\PaymentOrders;

use App\Filament\Resources\PaymentOrders\Pages\CreatePaymentOrder;
use App\Filament\Resources\PaymentOrders\Pages\EditPaymentOrder;
use App\Filament\Resources\PaymentOrders\Pages\ListPaymentOrders;
use App\Filament\Resources\PaymentOrders\Schemas\PaymentOrderForm;
use App\Filament\Resources\PaymentOrders\Tables\PaymentOrdersTable;
use App\Models\PaymentOrder;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PaymentOrderResource extends Resource
{
    protected static ?string $model = PaymentOrder::class;

    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static UnitEnum|string|null $navigationGroup = 'මුදල් හා ගෙවීම් (Finance & Payments)';

    protected static ?string $navigationLabel = 'ගෙවීම් ඇණවුම් (Orders)';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return PaymentOrderForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PaymentOrdersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPaymentOrders::route('/'),
            'create' => CreatePaymentOrder::route('/create'),
            'edit' => EditPaymentOrder::route('/{record}/edit'),
        ];
    }
}
