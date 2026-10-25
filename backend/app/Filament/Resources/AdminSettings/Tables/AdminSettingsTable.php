<?php

namespace App\Filament\Resources\AdminSettings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AdminSettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->label('Setting Key')
                    ->weight('bold')
                    ->color('primary')
                    ->searchable(),

                TextColumn::make('value')
                    ->label('Current Value')
                    ->limit(60)
                    ->wrap()
                    ->badge(fn ($record) => in_array($record->value, ['true', 'false']))
                    ->color(fn ($record) => match ($record->value) {
                        'true' => 'success',
                        'false' => 'danger',
                        default => null,
                    }),

                TextColumn::make('description')
                    ->label('Description')
                    ->searchable()
                    ->wrap(),

                TextColumn::make('updated_at')
                    ->label('Last Modified')
                    ->dateTime('M d, Y')
                    ->sortable(),
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
