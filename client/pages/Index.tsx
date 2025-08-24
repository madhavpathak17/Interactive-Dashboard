import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { FileUpload } from "@/components/ui/file-upload";
import { DataTable } from "@/components/ui/data-table";
import { AIInsights } from "@/components/ui/ai-insights";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  TrendingUp,
  Award,
  Building,
  GraduationCap,
  BarChart3,
  Upload,
  Download,
  Brain,
  LogOut,
  User
} from "lucide-react";

export default function Index() {
  const [placementData, setPlacementData] = useState<Record<string, any>[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { user, signOut } = useAuth();

  const handleFileUpload = (file: File, data: any[]) => {
    setUploadedFile(file);
    setPlacementData(data);
  };

  // Calculate metrics from the data
  const metrics = useMemo(() => {
    if (!placementData.length) {
      return {
        totalStudents: 0,
        placedStudents: 0,
        placementRate: 0,
        averageCGPA: 0,
        withInternship: 0,
        internshipRate: 0
      };
    }

    const totalStudents = placementData.length;

    // Find placed students - check for Placement column
    const placedStudents = placementData.filter(student => {
      const placement = student.Placement || student.Placed || student.Status;
      return placement && (
        placement.toString().toLowerCase() === 'placed' ||
        placement.toString().toLowerCase() === 'yes' ||
        placement.toString() === '1'
      );
    }).length;

    const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

    // Calculate average CGPA
    let totalCGPA = 0;
    let cgpaCount = 0;

    placementData.forEach(student => {
      const cgpa = student.CGPA || student.cgpa;
      if (cgpa && !isNaN(parseFloat(cgpa.toString()))) {
        totalCGPA += parseFloat(cgpa.toString());
        cgpaCount++;
      }
    });

    const averageCGPA = cgpaCount > 0 ? totalCGPA / cgpaCount : 0;

    // Count students with internship experience
    const withInternship = placementData.filter(student => {
      const internship = student['Internship Experience'] || student.Internship || student.internship;
      return internship && (
        internship.toString().toLowerCase() === 'yes' ||
        internship.toString() === '1' ||
        parseFloat(internship.toString()) > 0
      );
    }).length;

    const internshipRate = totalStudents > 0 ? (withInternship / totalStudents) * 100 : 0;

    return {
      totalStudents,
      placedStudents,
      placementRate,
      averageCGPA,
      withInternship,
      internshipRate
    };
  }, [placementData]);

  const downloadSampleCSV = () => {
    const sampleData = `College ID,IQ,Prev Sem Result,CGPA,Academic Performance,Internship Experience,Extra Curricular Score,Communication Skills,Projects Completed,Placement
STU001,115,A,8.5,Excellent,Yes,85,Good,3,Placed
STU002,108,B+,7.8,Good,No,70,Average,2,Not Placed
STU003,122,A+,9.2,Excellent,Yes,90,Excellent,4,Placed
STU004,95,B,7.2,Average,No,60,Poor,1,Not Placed
STU005,118,A,8.9,Excellent,Yes,80,Good,3,Placed
STU006,102,B,7.5,Good,Yes,75,Average,2,Placed
STU007,130,A+,9.5,Excellent,Yes,95,Excellent,5,Placed
STU008,88,C+,6.8,Below Average,No,50,Poor,0,Not Placed`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_academic_placement_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Determine chart data keys based on available data
  const getChartConfig = () => {
    if (!placementData.length) return null;

    const firstRow = placementData[0];
    const keys = Object.keys(firstRow);

    // For academic performance analysis
    const cgpaKey = keys.find(key =>
      key.toLowerCase().includes('cgpa') ||
      key.toLowerCase().includes('gpa')
    ) || 'CGPA';

    // For placement status
    const placementKey = keys.find(key =>
      key.toLowerCase().includes('placement') ||
      key.toLowerCase().includes('placed')
    ) || 'Placement';

    // For internship experience
    const internshipKey = keys.find(key =>
      key.toLowerCase().includes('internship')
    ) || 'Internship Experience';

    // For academic performance grouping
    const academicPerfKey = keys.find(key =>
      key.toLowerCase().includes('academic') && key.toLowerCase().includes('performance')
    ) || 'Academic Performance';

    return {
      cgpaKey,
      placementKey,
      internshipKey,
      academicPerfKey
    };
  };

  const chartConfig = getChartConfig();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Academic Placement Analytics</h1>
              <p className="text-muted-foreground mt-2">
                CGPA, Skills & Performance Analysis for Student Placement Success
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button variant="outline" onClick={downloadSampleCSV} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Sample CSV
              </Button>
              {placementData.length > 0 && (
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  {uploadedFile?.name} • {placementData.length} records
                </div>
              )}

              {/* User Info & Sign Out */}
              <div className="flex items-center space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border sm:pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {placementData.length === 0 ? (
          /* Upload Section */
          <div className="space-y-8">
            <div className="text-center">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <BarChart3 className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-4">
                  Academic Placement Analytics Dashboard
                </h2>
                <p className="text-muted-foreground mb-8">
                  Analyze student academic performance, CGPA trends, internship impact, and placement outcomes
                  with AI-powered insights to enhance educational strategies and career guidance.
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>

            {/* Features Preview */}
            <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
              <h3 className="text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">
                What You'll Get
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <BarChart3 className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Academic Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Visualize CGPA distributions, academic performance trends, and internship impact on placement success.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Brain className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">AI Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Get data-driven recommendations to improve student outcomes based on academic performance patterns.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Performance Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Analyze correlations between CGPA, skills, projects, internships and successful placements.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricCard
                title="Total Students"
                value={metrics.totalStudents.toLocaleString()}
                icon={Users}
                description="Students in dataset"
              />
              <MetricCard
                title="Placed Students"
                value={metrics.placedStudents.toLocaleString()}
                icon={GraduationCap}
                description="Successfully placed"
                trend={{
                  value: metrics.placementRate,
                  label: "placement rate",
                  isPositive: metrics.placementRate > 70
                }}
              />
              <MetricCard
                title="Placement Rate"
                value={`${metrics.placementRate.toFixed(1)}%`}
                icon={TrendingUp}
                description="Overall success rate"
              />
              <MetricCard
                title="Avg. CGPA"
                value={metrics.averageCGPA > 0 ? metrics.averageCGPA.toFixed(2) : 'N/A'}
                icon={Award}
                description="Academic performance"
              />
              <MetricCard
                title="With Internship"
                value={`${metrics.internshipRate.toFixed(1)}%`}
                icon={Building}
                description="Have internship experience"
                trend={{
                  value: metrics.internshipRate,
                  label: "with experience",
                  isPositive: metrics.internshipRate > 50
                }}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {chartConfig && (
                <>
                  <DashboardChart
                    data={placementData}
                    type="bar"
                    title="Placements by Academic Performance"
                    dataKey="value"
                    nameKey={chartConfig.academicPerfKey}
                  />
                  <DashboardChart
                    data={placementData}
                    type="pie"
                    title="Students with Internship Experience"
                    dataKey="value"
                    nameKey={chartConfig.internshipKey}
                  />
                  <DashboardChart
                    data={placementData}
                    type="bar"
                    title="Placement Status Distribution"
                    dataKey="value"
                    nameKey={chartConfig.placementKey}
                  />
                </>
              )}
            </div>

            {/* AI Insights */}
            <AIInsights data={placementData} />

            {/* Data Table */}
            <DataTable
              data={placementData}
              title="Student Placement Records"
              searchable={true}
              pageSize={15}
            />
          </div>
        )}
      </div>
    </div>
  );
}
