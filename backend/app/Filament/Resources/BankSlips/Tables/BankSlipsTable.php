<?php

namespace App\Filament\Resources\BankSlips\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BankSlipsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('paymentOrder.order_code')
                    ->label('Order Code')
                    ->weight('bold')
                    ->color('primary')
                    ->searchable()
                    ->default(fn ($record) => "Slip #{$record->id}"),

                TextColumn::make('paymentOrder.amount')
                    ->label('Amount (LKR)')
                    ->money('LKR')
                    ->sortable()
                    ->description(fn ($record) => $record->paymentOrder?->service_type ? ucfirst(str_replace('_', ' ', $record->paymentOrder->service_type)) : 'General'),

                TextColumn::make('bank_name')
                    ->label('Bank & Branch')
                    ->searchable()
                    ->description(fn ($record) => $record->branch_name),

                TextColumn::make('deposit_date')
                    ->label('Deposit Date')
                    ->date()
                    ->sortable(),

                TextColumn::make('reference_no')
                    ->label('Ref / Slip No')
                    ->searchable()
                    ->copyable(),

                TextColumn::make('verified_at')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state ? 'Verified (තහවුරුයි)' : 'Pending (සමාලෝචනයට)')
                    ->color(fn ($state) => $state ? 'success' : 'danger'),

                TextColumn::make('created_at')
                    ->label('Uploaded')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Filter::make('pending_only')
                    ->label('Pending Verification Only')
                    ->query(fn (Builder $query): Builder => $query->whereNull('verified_at')),
            ])
            ->recordActions([
                Action::make('verify')
                    ->label('Approve & Verify')
                    ->icon(Heroicon::OutlinedCheckCircle)
                    ->color('success')
                    ->visible(fn ($record) => is_null($record->verified_at))
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update([
                            'verified_at' => now(),
                            'verified_by_user_id' => auth()->id(),
                        ]);
                        if ($record->paymentOrder) {
                            $record->paymentOrder->update(['payment_status' => 'paid']);
                        }
                    }),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
