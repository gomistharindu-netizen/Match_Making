<?php

namespace App\Filament\Resources\AdminSettings;

use App\Filament\Resources\AdminSettings\Pages\CreateAdminSetting;
use App\Filament\Resources\AdminSettings\Pages\EditAdminSetting;
use App\Filament\Resources\AdminSettings\Pages\ListAdminSettings;
use App\Filament\Resources\AdminSettings\Schemas\AdminSettingForm;
use App\Filament\Resources\AdminSettings\Tables\AdminSettingsTable;
use App\Models\AdminSetting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class AdminSettingResource extends Resource
{
    protected static ?string $model = AdminSetting::class;

    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static UnitEnum|string|null $navigationGroup = 'පද්ධති පාලනය (System & Settings)';

    protected static ?string $navigationLabel = 'පද්ධති සැකසුම් (Settings)';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return AdminSettingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AdminSettingsTable::configure($table);
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
            'index' => ListAdminSettings::route('/'),
            'create' => CreateAdminSetting::route('/create'),
            'edit' => EditAdminSetting::route('/{record}/edit'),
        ];
    }
}
