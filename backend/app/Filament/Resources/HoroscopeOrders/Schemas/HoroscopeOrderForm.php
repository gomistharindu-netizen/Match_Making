<?php

namespace App\Filament\Resources\HoroscopeOrders\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class HoroscopeOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_code')
                    ->required(),
                Select::make('user_id')
                    ->relationship('user', 'name'),
                TextInput::make('customer_name')
                    ->required(),
                TextInput::make('customer_email')
                    ->email()
                    ->required(),
                TextInput::make('customer_phone')
                    ->tel()
                    ->required(),
                TextInput::make('first_party_name')
                    ->required(),
                DateTimePicker::make('first_party_birth_datetime')
                    ->required(),
                TextInput::make('first_party_birth_place')
                    ->required(),
                TextInput::make('first_party_chart_file'),
                TextInput::make('second_party_name')
                    ->required(),
                DateTimePicker::make('second_party_birth_datetime')
                    ->required(),
                TextInput::make('second_party_birth_place')
                    ->required(),
                TextInput::make('second_party_chart_file'),
                TextInput::make('status')
                    ->required()
                    ->default('pending_payment'),
                TextInput::make('assigned_astrologer_user_id')
                    ->numeric(),
                TextInput::make('report_file_path'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
