<?php

namespace App\Filament\Resources\AdminSettings\Pages;

use App\Filament\Resources\AdminSettings\AdminSettingResource;
use Filament\Resources\Pages\CreateRecord;

class CreateAdminSetting extends CreateRecord
{
    protected static string $resource = AdminSettingResource::class;
}
