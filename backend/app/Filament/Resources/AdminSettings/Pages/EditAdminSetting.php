<?php

namespace App\Filament\Resources\AdminSettings\Pages;

use App\Filament\Resources\AdminSettings\AdminSettingResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAdminSetting extends EditRecord
{
    protected static string $resource = AdminSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
