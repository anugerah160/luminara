<?php

namespace App\Filament\Admin\Widgets;

use App\Models\ArticleNews;
use App\Models\Comment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Carbon\Carbon;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $usersLastMonth = User::where('created_at', '>=', Carbon::now()->subMonth())->count();
        $articlesLastMonth = ArticleNews::where('created_at', '>=', Carbon::now()->subMonth())->count();

        return [
            Stat::make('Total Users', User::count())
                ->description($usersLastMonth . ' new users this month')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart($this->generateChartData(User::class)),

            Stat::make('Total Articles', ArticleNews::count())
                ->description($articlesLastMonth . ' new articles this month')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info')
                ->chart($this->generateChartData(ArticleNews::class)),

            Stat::make('Total Comments', Comment::count())
                ->description('All comments on articles')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color('warning')
                ->chart($this->generateChartData(Comment::class)),
        ];
    }
    
    private function generateChartData(string $model): array
    {
        $data = $model::query()
            ->selectRaw('COUNT(*) as count, DATE(created_at) as date')
            ->where('created_at', '>=', Carbon::now()->subDays(14))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->pluck('count')
            ->toArray();
        
        // Pad array to 14 days if needed
        return array_pad($data, 14, 0);
    }
}
