<?php

namespace App\Filament\Resources\MemberProfiles;

use App\Filament\Resources\MemberProfiles\Pages\CreateMemberProfile;
use App\Filament\Resources\MemberProfiles\Pages\EditMemberProfile;
use App\Filament\Resources\MemberProfiles\Pages\ListMemberProfiles;
use App\Filament\Resources\MemberProfiles\Schemas\MemberProfileForm;
use App\Filament\Resources\MemberProfiles\Tables\MemberProfilesTable;
use App\Models\MemberProfile;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class MemberProfileResource extends Resource
{
    protected static ?string $model = MemberProfile::class;

    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static UnitEnum|string|null $navigationGroup = 'මංගල සේවා (Matrimonial)';

    protected static ?string $navigationLabel = 'සාමාජික යෝජනා (Profiles)';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $pending = static::getModel()::where('publication_status', 'pending_review')->count();
        return $pending > 0 ? (string) $pending : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return MemberProfileForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MemberProfilesTable::configure($table);
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
            'index' => ListMemberProfiles::route('/'),
            'create' => CreateMemberProfile::route('/create'),
            'edit' => EditMemberProfile::route('/{record}/edit'),
        ];
    }
}
