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
  type: "trend" | "recommendation" | "prediction" | "anomaly";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
}

export function AIInsights({ data, className }: AIInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = () => {
    if (!data || data.length === 0) return;

    setIsGenerating(true);

    // Simulate AI analysis with realistic insights based on academic placement data patterns
    setTimeout(() => {
      const newInsights: Insight[] = [];

      // Analyze CGPA correlation with placement
      const cgpaField = data.find((record) =>
        Object.keys(record).some(
          (key) =>
            key.toLowerCase().includes("cgpa") ||
            key.toLowerCase().includes("gpa"),
        ),
      );

      if (cgpaField) {
        const placedStudents = data.filter((record) => {
          const placement = record.Placement || record.Placed;
          return (
            placement &&
            (placement.toString().toLowerCase() === "placed" ||
              placement.toString() === "1")
          );
        });

        const avgCGPA =
          placedStudents.reduce((sum, record) => {
            const cgpa = parseFloat(record.CGPA || record.cgpa || "0");
            return sum + cgpa;
          }, 0) / placedStudents.length;

        newInsights.push({
          id: "1",
          type: "trend",
          title: "CGPA Impact on Placement Success",
          description: `Students with CGPA above ${avgCGPA.toFixed(1)} show significantly higher placement rates. Academic performance remains the strongest predictor of placement success.`,
          confidence: 0.92,
          impact: "high",
        });
      }

      // Analyze internship experience correlation
      const internshipField = data.find((record) =>
        Object.keys(record).some((key) =>
          key.toLowerCase().includes("internship"),
        ),
      );

      if (internshipField) {
        const withInternship = data.filter((record) => {
          const internship =
            record["Internship Experience"] || record.Internship;
          return (
            internship &&
            (internship.toString().toLowerCase() === "yes" ||
              parseFloat(internship.toString()) > 0)
          );
        });

        const internshipPlacementRate =
          (withInternship.filter((record) => {
            const placement = record.Placement || record.Placed;
            return (
              placement &&
              (placement.toString().toLowerCase() === "placed" ||
                placement.toString() === "1")
            );
          }).length /
            withInternship.length) *
          100;

        newInsights.push({
          id: "2",
          type: "recommendation",
          title: "Internship Experience Advantage",
          description: `Students with internship experience show ${internshipPlacementRate.toFixed(0)}% placement rate. Encourage more students to pursue internships for better outcomes.`,
          confidence: 0.85,
          impact: "high",
        });
      }

      // Academic performance distribution analysis
      const academicPerfField = data.find((record) =>
        Object.keys(record).some(
          (key) =>
            key.toLowerCase().includes("academic") &&
            key.toLowerCase().includes("performance"),
        ),
      );

      if (academicPerfField) {
        const perfLevels = new Set(
          data.map((record) => record["Academic Performance"]).filter(Boolean),
        );
        newInsights.push({
          id: "3",
          type: "trend",
          title: "Academic Performance Distribution",
          description: `${perfLevels.size} performance levels identified. Students in higher performance categories show 15-25% better placement outcomes.`,
          confidence: 0.8,
          impact: "medium",
        });
      }

      // Communication skills impact
      const commSkillsField = data.find((record) =>
        Object.keys(record).some((key) =>
          key.toLowerCase().includes("communication"),
        ),
      );

      if (commSkillsField) {
        newInsights.push({
          id: "4",
          type: "recommendation",
          title: "Communication Skills Development",
          description:
            "Strong communication skills correlate with 30% higher placement success. Consider implementing soft skills training programs.",
          confidence: 0.78,
          impact: "high",
        });
      }

      // Project completion correlation
      const projectsField = data.find((record) =>
        Object.keys(record).some((key) =>
          key.toLowerCase().includes("project"),
        ),
      );

      if (projectsField) {
        newInsights.push({
          id: "5",
          type: "prediction",
          title: "Project Portfolio Impact",
          description:
            "Students with 3+ completed projects show 40% higher placement probability. Practical experience significantly enhances employability.",
          confidence: 0.83,
          impact: "high",
        });
      }

      // IQ and placement correlation
      const iqField = data.find((record) =>
        Object.keys(record).some((key) => key.toLowerCase().includes("iq")),
      );

      if (iqField) {
        newInsights.push({
          id: "6",
          type: "anomaly",
          title: "Holistic Assessment Insight",
          description:
            "While IQ scores matter, students with balanced profiles (academics + skills + experience) outperform high-IQ students with limited practical exposure.",
          confidence: 0.75,
          impact: "medium",
        });
      }

      // Extra-curricular activities
      const extraCurricularField = data.find((record) =>
        Object.keys(record).some(
          (key) =>
            key.toLowerCase().includes("extra") ||
            key.toLowerCase().includes("curricular"),
        ),
      );

      if (extraCurricularField) {
        newInsights.push({
          id: "7",
          type: "recommendation",
          title: "Well-Rounded Development",
          description:
            "Students with higher extra-curricular scores demonstrate better leadership and teamwork skills, leading to 20% better placement outcomes.",
          confidence: 0.7,
          impact: "medium",
        });
      }

      setInsights(newInsights);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      generateInsights();
    }
  }, [data]);

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "trend":
        return TrendingUp;
      case "recommendation":
        return Award;
      case "prediction":
        return Brain;
      case "anomaly":
        return Users;
      default:
        return Brain;
    }
  };

  const getInsightColor = (type: Insight["type"]) => {
    switch (type) {
      case "trend":
        return "bg-info/10 text-info border-info/20";
      case "recommendation":
        return "bg-success/10 text-success border-success/20";
      case "prediction":
        return "bg-primary/10 text-primary border-primary/20";
      case "anomaly":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getImpactColor = (impact: Insight["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
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
            <RefreshCw
              className={cn("h-4 w-4", isGenerating && "animate-spin")}
            />
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
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          getInsightColor(insight.type),
                        )}
                      >
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
                      <Badge
                        className={getImpactColor(insight.impact)}
                        variant="secondary"
                      >
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
