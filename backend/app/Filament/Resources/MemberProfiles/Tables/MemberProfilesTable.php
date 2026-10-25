<?php

namespace App\Filament\Resources\MemberProfiles\Tables;

use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MemberProfilesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('primary_photo_url')
                    ->label('Photo')
                    ->circular()
                    ->defaultImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),

                TextColumn::make('profile_code')
                    ->label('Code')
                    ->weight('bold')
                    ->color('primary')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Profile code copied')
                    ->sortable(),

                TextColumn::make('full_name_private')
                    ->label('Candidate Name')
                    ->searchable()
                    ->description(fn ($record) => ($record->gender ?? 'Unknown') . ' • ' . ($record->birth_date ? Carbon::parse($record->birth_date)->age . ' yrs' : '')),

                TextColumn::make('district')
                    ->label('Location')
                    ->searchable()
                    ->description(fn ($record) => $record->city ? "{$record->city}, {$record->country}" : ($record->country ?? 'Sri Lanka')),

                TextColumn::make('profession')
                    ->label('Profession / Education')
                    ->searchable()
                    ->description(fn ($record) => $record->education_level),

                IconColumn::make('horoscope_available')
                    ->label('Horoscope')
                    ->boolean(),

                TextColumn::make('publication_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'approved' => 'success',
                        'pending_review' => 'warning',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'approved' => 'Approved (අනුමතයි)',
                        'pending_review' => 'Pending Review (සමාලෝචනයට)',
                        'rejected' => 'Rejected (ප්‍රතික්ෂේපිතයි)',
                        default => ucfirst($state),
                    }),

                TextColumn::make('created_at')
                    ->label('Registered')
                    ->date()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('publication_status')
                    ->label('Status (තත්ත්වය)')
                    ->options([
                        'approved' => 'Approved (අනුමතයි)',
                        'pending_review' => 'Pending Review (සමාලෝචනයට)',
                        'rejected' => 'Rejected (ප්‍රතික්ෂේපිතයි)',
                    ]),
                SelectFilter::make('gender')
                    ->label('Gender (ස්ත්‍රී / පුරුෂ)')
                    ->options([
                        'Male' => 'Male (මනමාලයන්)',
                        'Female' => 'Female (මනමාලියන්)',
                    ]),
                SelectFilter::make('district')
                    ->label('District (දිස්ත්‍රික්කය)')
                    ->searchable(),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Approve')
                    ->icon(Heroicon::OutlinedCheckCircle)
                    ->color('success')
                    ->visible(fn ($record) => $record->publication_status !== 'approved')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['publication_status' => 'approved'])),

                Action::make('reject')
                    ->label('Reject')
                    ->icon(Heroicon::OutlinedXCircle)
                    ->color('danger')
                    ->visible(fn ($record) => $record->publication_status === 'pending_review')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['publication_status' => 'rejected'])),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
