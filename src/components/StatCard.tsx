import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
}

const StatCard = ({ title, value, change, icon: Icon, trend }: StatCardProps) => {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">{value}</p>
            <p className={`text-sm font-semibold flex items-center space-x-1 ${
              trend === 'up' ? 'text-success' : 'text-destructive'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                trend === 'up' ? 'bg-success' : 'bg-destructive'
              }`} />
              <span>{change}</span>
            </p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Icon className="h-7 w-7 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;