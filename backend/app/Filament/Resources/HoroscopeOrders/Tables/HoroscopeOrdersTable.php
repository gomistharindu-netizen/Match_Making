<?php

namespace App\Filament\Resources\HoroscopeOrders\Tables;

use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class HoroscopeOrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_code')
                    ->label('Order Code')
                    ->weight('bold')
                    ->color('primary')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Order code copied'),

                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->searchable()
                    ->description(fn ($record) => $record->customer_phone ?: $record->customer_email),

                TextColumn::make('first_party_name')
                    ->label('First Party (Bride/Groom)')
                    ->searchable()
                    ->description(fn ($record) => $record->first_party_birth_datetime ? Carbon::parse($record->first_party_birth_datetime)->format('Y-m-d H:i') . ' • ' . $record->first_party_birth_place : $record->first_party_birth_place),

                TextColumn::make('second_party_name')
                    ->label('Second Party')
                    ->searchable()
                    ->description(fn ($record) => $record->second_party_birth_datetime ? Carbon::parse($record->second_party_birth_datetime)->format('Y-m-d H:i') . ' • ' . $record->second_party_birth_place : $record->second_party_birth_place),

                TextColumn::make('first_party_chart_file')
                    ->label('Charts Uploaded')
                    ->formatStateUsing(function ($state, $record) {
                        $count = 0;
                        if (!empty($record->first_party_chart_file)) $count++;
                        if (!empty($record->second_party_chart_file)) $count++;
                        return $count > 0 ? "{$count} Chart(s) Attached" : "None";
                    })
                    ->badge()
                    ->color(fn ($state, $record) => (!empty($record->first_party_chart_file) || !empty($record->second_party_chart_file)) ? 'info' : 'gray'),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'in_analysis' => 'info',
                        'pending' => 'warning',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'completed' => 'Completed (සම්පූර්ණයි)',
                        'in_analysis' => 'In Analysis (පරීක්ෂා කෙරේ)',
                        'pending' => 'Pending (පොරොත්තුවේ)',
                        'cancelled' => 'Cancelled (අවලංගුයි)',
                        default => ucfirst($state),
                    }),

                TextColumn::make('report_file_path')
                    ->label('Astrologer Report')
                    ->formatStateUsing(fn ($state) => $state ? 'Report Attached (PDF)' : 'Not Uploaded')
                    ->badge()
                    ->color(fn ($state) => $state ? 'success' : 'gray'),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status (තත්ත්වය)')
                    ->options([
                        'pending' => 'Pending (පොරොත්තුවේ)',
                        'in_analysis' => 'In Analysis (පරීක්ෂා කෙරේ)',
                        'completed' => 'Completed (සම්පූර්ණයි)',
                        'cancelled' => 'Cancelled (අවලංගුයි)',
                    ]),
            ])
            ->recordActions([
                Action::make('complete')
                    ->label('Complete')
                    ->icon(Heroicon::OutlinedCheckCircle)
                    ->color('success')
                    ->visible(fn ($record) => $record->status !== 'completed')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'completed'])),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
