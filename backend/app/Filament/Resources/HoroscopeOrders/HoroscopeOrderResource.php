<?php

namespace App\Filament\Resources\HoroscopeOrders;

use App\Filament\Resources\HoroscopeOrders\Pages\CreateHoroscopeOrder;
use App\Filament\Resources\HoroscopeOrders\Pages\EditHoroscopeOrder;
use App\Filament\Resources\HoroscopeOrders\Pages\ListHoroscopeOrders;
use App\Filament\Resources\HoroscopeOrders\Schemas\HoroscopeOrderForm;
use App\Filament\Resources\HoroscopeOrders\Tables\HoroscopeOrdersTable;
use App\Models\HoroscopeOrder;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class HoroscopeOrderResource extends Resource
{
    protected static ?string $model = HoroscopeOrder::class;

    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static UnitEnum|string|null $navigationGroup = 'ජ්‍යොතිෂ අංශය (Astrology)';

    protected static ?string $navigationLabel = 'කේන්ද්‍ර පරීක්ෂා (Orders)';

    protected static ?int $navigationSort = 2;

    public static function getNavigationBadge(): ?string
    {
        $pending = static::getModel()::where('status', 'pending')->count();
        return $pending > 0 ? (string) $pending : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return HoroscopeOrderForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HoroscopeOrdersTable::configure($table);
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
            'index' => ListHoroscopeOrders::route('/'),
            'create' => CreateHoroscopeOrder::route('/create'),
            'edit' => EditHoroscopeOrder::route('/{record}/edit'),
        ];
    }
}
