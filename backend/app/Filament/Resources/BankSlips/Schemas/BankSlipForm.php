<?php

namespace App\Filament\Resources\BankSlips\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class BankSlipForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('payment_order_id')
                    ->relationship('paymentOrder', 'id')
                    ->required(),
                TextInput::make('slip_file_path')
                    ->required(),
                TextInput::make('bank_name')
                    ->required(),
                TextInput::make('branch_name'),
                DatePicker::make('deposit_date')
                    ->required(),
                TextInput::make('reference_no'),
                TextInput::make('verified_by_user_id')
                    ->numeric(),
                DateTimePicker::make('verified_at'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
