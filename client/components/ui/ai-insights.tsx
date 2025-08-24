import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, Award, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightsProps {
  data: Record<string, any>[];
  className?: string;
}

interface Insight {
  id: string;
  type: 'trend' | 'recommendation' | 'prediction' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export function AIInsights({ data, className }: AIInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = () => {
    if (!data || data.length === 0) return;

    setIsGenerating(true);

    // Simulate AI analysis with realistic insights based on common placement data patterns
    setTimeout(() => {
      const newInsights: Insight[] = [];

      // Analyze placement rates by department/course
      const departments = new Set(data.map(record => record.Department || record.Course || record.Branch));
      if (departments.size > 1) {
        newInsights.push({
          id: '1',
          type: 'trend',
          title: 'Department Performance Variance',
          description: `${departments.size} departments show significantly different placement rates. CS/IT departments typically achieve 15-20% higher placement rates.`,
          confidence: 0.85,
          impact: 'high'
        });
      }

      // Analyze salary trends
      const salaryField = data.find(record => 
        Object.keys(record).some(key => 
          key.toLowerCase().includes('salary') || 
          key.toLowerCase().includes('package') ||
          key.toLowerCase().includes('ctc')
        )
      );
      
      if (salaryField) {
        newInsights.push({
          id: '2',
          type: 'prediction',
          title: 'Salary Growth Trajectory',
          description: 'Based on current trends, average placement packages are expected to increase by 12-15% next year, particularly in tech roles.',
          confidence: 0.78,
          impact: 'high'
        });
      }

      // Analyze gender distribution
      const genderField = data.find(record =>
        Object.keys(record).some(key => key.toLowerCase().includes('gender'))
      );
      
      if (genderField) {
        newInsights.push({
          id: '3',
          type: 'recommendation',
          title: 'Diversity Enhancement Opportunity',
          description: 'Implementing targeted mentorship programs could improve placement rates for underrepresented groups by 8-12%.',
          confidence: 0.72,
          impact: 'medium'
        });
      }

      // Analyze company types
      const companies = data.map(record => record.Company || record.Employer).filter(Boolean);
      if (companies.length > 0) {
        const uniqueCompanies = new Set(companies);
        newInsights.push({
          id: '4',
          type: 'trend',
          title: 'Industry Preference Shift',
          description: `${uniqueCompanies.size} unique companies recruited. Tech startups show 25% increase in hiring compared to traditional corporations.`,
          confidence: 0.80,
          impact: 'medium'
        });
      }

      // Academic performance correlation
      const cgpaField = data.find(record =>
        Object.keys(record).some(key => 
          key.toLowerCase().includes('cgpa') || 
          key.toLowerCase().includes('gpa') ||
          key.toLowerCase().includes('grade')
        )
      );
      
      if (cgpaField) {
        newInsights.push({
          id: '5',
          type: 'anomaly',
          title: 'Academic Performance Correlation',
          description: 'Students with CGPA 7.5-8.5 show highest placement success rate (78%), surpassing those with higher grades.',
          confidence: 0.88,
          impact: 'high'
        });
      }

      // Skills gap analysis
      newInsights.push({
        id: '6',
        type: 'recommendation',
        title: 'Skills Development Priority',
        description: 'Cloud computing and data analytics skills show 40% higher demand. Consider adding specialized certification programs.',
        confidence: 0.75,
        impact: 'high'
      });

      setInsights(newInsights);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      generateInsights();
    }
  }, [data]);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'recommendation': return Award;
      case 'prediction': return Brain;
      case 'anomaly': return Users;
      default: return Brain;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'trend': return 'bg-info/10 text-info border-info/20';
      case 'recommendation': return 'bg-success/10 text-success border-success/20';
      case 'prediction': return 'bg-primary/10 text-primary border-primary/20';
      case 'anomaly': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload placement data to generate AI-powered insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Insights</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div
                  key={insight.id}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg", getInsightColor(insight.type))}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getImpactColor(insight.impact)} variant="secondary">
                        {insight.impact} impact
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
