import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { FileUpload } from "@/components/ui/file-upload";
import { DataTable } from "@/components/ui/data-table";
import { AIInsights } from "@/components/ui/ai-insights";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { 
  Users, 
  TrendingUp, 
  Award, 
  Building, 
  GraduationCap,
  BarChart3,
  Upload,
  Download,
  Brain
} from "lucide-react";

export default function Index() {
  const [placementData, setPlacementData] = useState<Record<string, any>[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
        averageSalary: 0,
        topCompanies: 0
      };
    }

    const totalStudents = placementData.length;
    
    // Try to find placed students based on common column names
    const placedStudents = placementData.filter(student => {
      const status = student.Status || student.Placement_Status || student.Placed || student.Company;
      return status && status.toString().toLowerCase() !== 'not placed' && status.toString().toLowerCase() !== 'no' && status.toString().trim() !== '';
    }).length;

    const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

    // Calculate average salary
    const salaryFields = ['Salary', 'Package', 'CTC', 'Annual_Package', 'Offer_Amount'];
    let totalSalary = 0;
    let salaryCount = 0;

    placementData.forEach(student => {
      for (const field of salaryFields) {
        const salary = student[field];
        if (salary && !isNaN(parseFloat(salary.toString()))) {
          totalSalary += parseFloat(salary.toString());
          salaryCount++;
          break; // Only count one salary per student
        }
      }
    });

    const averageSalary = salaryCount > 0 ? totalSalary / salaryCount : 0;

    // Count unique companies
    const companyFields = ['Company', 'Employer', 'Organization', 'Company_Name'];
    const companies = new Set();
    
    placementData.forEach(student => {
      for (const field of companyFields) {
        const company = student[field];
        if (company && company.toString().trim() !== '' && company.toString().toLowerCase() !== 'not placed') {
          companies.add(company.toString().trim());
          break;
        }
      }
    });

    return {
      totalStudents,
      placedStudents,
      placementRate,
      averageSalary,
      topCompanies: companies.size
    };
  }, [placementData]);

  const downloadSampleCSV = () => {
    const sampleData = `Name,Department,CGPA,Company,Salary,Status,Gender,Year
John Doe,Computer Science,8.5,Google,120000,Placed,Male,2024
Jane Smith,Information Technology,9.2,Microsoft,115000,Placed,Female,2024
Bob Johnson,Mechanical,7.8,Tata Motors,80000,Placed,Male,2024
Alice Brown,Computer Science,8.9,Amazon,125000,Placed,Female,2024
Charlie Wilson,Electrical,7.5,,0,Not Placed,Male,2024
Diana Miller,Computer Science,9.0,Meta,130000,Placed,Female,2024
Eve Davis,Civil,8.1,L&T,75000,Placed,Female,2024
Frank Garcia,Mechanical,7.9,Mahindra,82000,Placed,Male,2024`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_student_placement_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Determine chart data keys based on available data
  const getChartConfig = () => {
    if (!placementData.length) return null;
    
    const firstRow = placementData[0];
    const keys = Object.keys(firstRow);
    
    // Try to find department/branch field
    const departmentKey = keys.find(key => 
      key.toLowerCase().includes('department') || 
      key.toLowerCase().includes('branch') || 
      key.toLowerCase().includes('course')
    ) || keys[1]; // Fallback to second column
    
    // Try to find company field
    const companyKey = keys.find(key =>
      key.toLowerCase().includes('company') ||
      key.toLowerCase().includes('employer') ||
      key.toLowerCase().includes('organization')
    ) || keys[0]; // Fallback to first column

    return {
      departmentKey,
      companyKey
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Student Placement Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Interactive analytics and AI insights for placement records
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
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
                  Welcome to Your Placement Analytics Hub
                </h2>
                <p className="text-muted-foreground mb-8">
                  Upload your student placement data CSV file to unlock powerful insights, 
                  interactive visualizations, and AI-powered recommendations to improve placement outcomes.
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>

            {/* Features Preview */}
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-xl font-semibold text-center mb-8">
                What You'll Get
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <BarChart3 className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Interactive Charts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Visualize placement trends, department performance, and salary distributions with interactive charts.
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
                      Get intelligent recommendations and predictions to improve placement strategies and outcomes.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Advanced Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Analyze student performance patterns, company preferences, and placement success factors.
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
                title="Avg. Package"
                value={metrics.averageSalary > 0 ? `₹${(metrics.averageSalary / 100000).toFixed(1)}L` : 'N/A'}
                icon={Award}
                description="Annual package"
              />
              <MetricCard
                title="Companies"
                value={metrics.topCompanies.toLocaleString()}
                icon={Building}
                description="Recruiting partners"
              />
            </div>

            {/* Charts and Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartConfig && (
                <>
                  <DashboardChart
                    data={placementData}
                    type="bar"
                    title="Placements by Department"
                    dataKey="value"
                    nameKey={chartConfig.departmentKey}
                  />
                  <DashboardChart
                    data={placementData.filter(item => item[chartConfig.companyKey] && item[chartConfig.companyKey].toString().toLowerCase() !== 'not placed')}
                    type="pie"
                    title="Top Recruiting Companies"
                    dataKey="value"
                    nameKey={chartConfig.companyKey}
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
