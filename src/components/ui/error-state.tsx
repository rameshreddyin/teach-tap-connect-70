
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  onRetry,
  showRetry = true
}) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-red-600 mb-4">{message}</p>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
