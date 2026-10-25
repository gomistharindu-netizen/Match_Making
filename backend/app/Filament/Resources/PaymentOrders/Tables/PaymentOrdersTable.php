<?php

namespace App\Filament\Resources\PaymentOrders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PaymentOrdersTable
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
                    ->copyable(),

                TextColumn::make('user.name')
                    ->label('Member / Payer')
                    ->searchable()
                    ->description(fn ($record) => $record->user?->phone ?: $record->user?->email),

                TextColumn::make('service_type')
                    ->label('Service')
                    ->badge()
                    ->color('info')
                    ->formatStateUsing(fn ($state) => ucfirst(str_replace('_', ' ', $state))),

                TextColumn::make('amount')
                    ->label('Amount')
                    ->money('LKR')
                    ->weight('bold')
                    ->sortable(),

                TextColumn::make('payment_method')
                    ->label('Method')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn ($state) => strtoupper(str_replace('_', ' ', $state))),

                TextColumn::make('payment_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'paid' => 'Paid (ගෙවා ඇත)',
                        'pending' => 'Pending (අපේක්ෂිත)',
                        'failed' => 'Failed (අසාර්ථකයි)',
                        default => ucfirst($state),
                    }),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('payment_status')
                    ->label('Status')
                    ->options([
                        'paid' => 'Paid (ගෙවා ඇත)',
                        'pending' => 'Pending (අපේක්ෂිත)',
                        'failed' => 'Failed (අසාර්ථකයි)',
                    ]),
                SelectFilter::make('service_type')
                    ->label('Service Type')
                    ->options([
                        'registration' => 'Registration Fee',
                        'horoscope' => 'Horoscope Match',
                        'contact_view' => 'Contact Unlock',
                    ]),
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
