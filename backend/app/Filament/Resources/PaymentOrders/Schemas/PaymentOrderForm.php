<?php

namespace App\Filament\Resources\PaymentOrders\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PaymentOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_code')
                    ->required(),
                Select::make('user_id')
                    ->relationship('user', 'name'),
                Select::make('horoscope_order_id')
                    ->relationship('horoscopeOrder', 'id'),
                TextInput::make('service_type')
                    ->required(),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                TextInput::make('currency')
                    ->required()
                    ->default('LKR'),
                TextInput::make('payment_method')
                    ->required(),
                TextInput::make('payment_status')
                    ->required()
                    ->default('pending'),
                TextInput::make('gateway_transaction_id'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
