<?php

namespace App\Filament\Resources\BankSlips;

use App\Filament\Resources\BankSlips\Pages\CreateBankSlip;
use App\Filament\Resources\BankSlips\Pages\EditBankSlip;
use App\Filament\Resources\BankSlips\Pages\ListBankSlips;
use App\Filament\Resources\BankSlips\Schemas\BankSlipForm;
use App\Filament\Resources\BankSlips\Tables\BankSlipsTable;
use App\Models\BankSlip;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BankSlipResource extends Resource
{
    protected static ?string $model = BankSlip::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return BankSlipForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BankSlipsTable::configure($table);
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
            'index' => ListBankSlips::route('/'),
            'create' => CreateBankSlip::route('/create'),
            'edit' => EditBankSlip::route('/{record}/edit'),
        ];
    }
}
