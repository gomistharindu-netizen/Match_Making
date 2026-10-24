<?php

namespace App\Filament\Resources\MemberProfiles\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MemberProfilesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('owner_user_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('profile_code')
                    ->searchable(),
                TextColumn::make('full_name_private')
                    ->searchable(),
                TextColumn::make('gender')
                    ->searchable(),
                TextColumn::make('birth_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('district')
                    ->searchable(),
                TextColumn::make('city')
                    ->searchable(),
                TextColumn::make('country')
                    ->searchable(),
                TextColumn::make('residence_status')
                    ->searchable(),
                TextColumn::make('religion')
                    ->searchable(),
                TextColumn::make('caste')
                    ->searchable(),
                TextColumn::make('height_feet')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('height_inches')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('education_level')
                    ->searchable(),
                TextColumn::make('profession')
                    ->searchable(),
                TextColumn::make('employed_in')
                    ->searchable(),
                TextColumn::make('monthly_income_lkr')
                    ->searchable(),
                IconColumn::make('horoscope_available')
                    ->boolean(),
                TextColumn::make('primary_photo_url')
                    ->searchable(),
                TextColumn::make('publication_status')
                    ->searchable(),
                TextColumn::make('managed_by_type')
                    ->searchable(),
                IconColumn::make('is_paused')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
