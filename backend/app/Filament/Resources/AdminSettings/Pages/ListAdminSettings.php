<?php

namespace App\Filament\Resources\AdminSettings\Pages;

use App\Filament\Resources\AdminSettings\AdminSettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAdminSettings extends ListRecords
{
    protected static string $resource = AdminSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
