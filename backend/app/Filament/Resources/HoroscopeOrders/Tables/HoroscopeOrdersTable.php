<?php

namespace App\Filament\Resources\HoroscopeOrders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class HoroscopeOrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_code')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->searchable(),
                TextColumn::make('customer_name')
                    ->searchable(),
                TextColumn::make('customer_email')
                    ->searchable(),
                TextColumn::make('customer_phone')
                    ->searchable(),
                TextColumn::make('first_party_name')
                    ->searchable(),
                TextColumn::make('first_party_birth_datetime')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('first_party_birth_place')
                    ->searchable(),
                TextColumn::make('first_party_chart_file')
                    ->searchable(),
                TextColumn::make('second_party_name')
                    ->searchable(),
                TextColumn::make('second_party_birth_datetime')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('second_party_birth_place')
                    ->searchable(),
                TextColumn::make('second_party_chart_file')
                    ->searchable(),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('assigned_astrologer_user_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('report_file_path')
                    ->searchable(),
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
