<?php

namespace App\Filament\Admin\Widgets;

use App\Models\ArticleNews;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;

class ArticleChart extends ChartWidget
{
    protected static ?string $heading = 'Articles Created';

    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = ArticleNews::query()
            ->selectRaw('COUNT(*) as count, DATE_FORMAT(created_at, "%Y-%m") as month')
            ->where('created_at', '>=', Carbon::now()->subYear())
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->pluck('count', 'month')
            ->all();

        return [
            'datasets' => [
                [
                    'label' => 'Articles per month',
                    'data' => array_values($data),
                    'backgroundColor' => 'rgba(251, 191, 36, 0.2)',
                    'borderColor' => 'rgb(251, 191, 36)',
                    'tension' => 0.4,
                ],
            ],
            'labels' => array_keys($data),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
