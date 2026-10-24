<?php

namespace App\Filament\Resources\MemberProfiles\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class MemberProfileForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('owner_user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('profile_code')
                    ->required(),
                TextInput::make('full_name_private')
                    ->required(),
                TextInput::make('gender')
                    ->required(),
                DatePicker::make('birth_date')
                    ->required(),
                TextInput::make('district')
                    ->required(),
                TextInput::make('city'),
                TextInput::make('country')
                    ->required()
                    ->default('Sri Lanka'),
                TextInput::make('residence_status')
                    ->required()
                    ->default('Citizen'),
                TextInput::make('religion')
                    ->required(),
                TextInput::make('caste'),
                TextInput::make('height_feet')
                    ->numeric(),
                TextInput::make('height_inches')
                    ->numeric(),
                TextInput::make('education_level')
                    ->required(),
                TextInput::make('profession')
                    ->required(),
                TextInput::make('employed_in'),
                TextInput::make('monthly_income_lkr'),
                Textarea::make('family_background')
                    ->columnSpanFull(),
                Textarea::make('partner_preferences')
                    ->columnSpanFull(),
                Toggle::make('horoscope_available')
                    ->required(),
                TextInput::make('primary_photo_url')
                    ->url(),
                TextInput::make('publication_status')
                    ->required()
                    ->default('pending'),
                TextInput::make('managed_by_type')
                    ->required()
                    ->default('self'),
                Toggle::make('is_paused')
                    ->required(),
            ]);
    }
}
