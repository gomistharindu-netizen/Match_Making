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
use UnitEnum;

class BankSlipResource extends Resource
{
    protected static ?string $model = BankSlip::class;

    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedBanknotes;

    protected static UnitEnum|string|null $navigationGroup = 'මුදල් හා ගෙවීම් (Finance & Payments)';

    protected static ?string $navigationLabel = 'බැංකු රිසිට්පත් (Bank Slips)';

    protected static ?int $navigationSort = 3;

    public static function getNavigationBadge(): ?string
    {
        $pending = static::getModel()::whereNull('verified_at')->count();
        return $pending > 0 ? (string) $pending : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

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
