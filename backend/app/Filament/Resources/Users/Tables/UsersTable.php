<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Full Name')
                    ->weight('bold')
                    ->searchable(),

                TextColumn::make('email')
                    ->label('Email Address')
                    ->searchable()
                    ->copyable(),

                TextColumn::make('phone')
                    ->label('Phone Number')
                    ->searchable(),

                TextColumn::make('role')
                    ->label('Role')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'staff' => 'warning',
                        'member' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => strtoupper($state)),

                TextColumn::make('account_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'pending' => 'warning',
                        'banned' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                TextColumn::make('created_at')
                    ->label('Joined')
                    ->date('M d, Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('role')
                    ->label('Role (භූමිකාව)')
                    ->options([
                        'admin' => 'Administrator',
                        'staff' => 'Staff / Astrologer',
                        'member' => 'Member (සාමාජික)',
                    ]),
                SelectFilter::make('account_status')
                    ->label('Status (තත්ත්වය)')
                    ->options([
                        'active' => 'Active',
                        'pending' => 'Pending',
                        'banned' => 'Banned',
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
