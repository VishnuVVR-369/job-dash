import {
  Briefcase,
  FileText,
  ListTodo,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ApplicationsChart } from "@/components/dashboard/ApplicationsChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { UpcomingActionItems } from "@/components/dashboard/UpcomingActionItems";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import {
  getApplicationsOverTime,
  getDashboardMetrics,
  getRecentApplications,
  getStatusDistribution,
  getUpcomingActionItems,
} from "@/lib/queries/dashboard";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const [
    metrics,
    applicationsOverTime,
    statusDistribution,
    recentApplications,
    upcomingItems,
  ] = await Promise.all([
    getDashboardMetrics(userId),
    getApplicationsOverTime(userId, 30),
    getStatusDistribution(userId),
    getRecentApplications(userId, 5),
    getUpcomingActionItems(userId, 5),
  ]);

  const hasApplications = metrics.total > 0;

  if (!hasApplications) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Welcome to JobDash</CardTitle>
            <CardDescription className="text-base">
              Start tracking your job applications to see your progress here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/tracker">Add Your First Application</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your job search progress
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard
          title="Total Applications"
          value={metrics.total}
          icon={FileText}
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Interviewing"
          value={metrics.interviewing}
          description="Active interview stages"
          icon={Users}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Offers"
          value={metrics.offers}
          icon={Trophy}
          iconColor="text-emerald-600"
        />
        <MetricCard
          title="Rejections"
          value={metrics.rejections}
          icon={XCircle}
          iconColor="text-red-600"
        />
        <MetricCard
          title="Response Rate"
          value={`${metrics.responseRate}%`}
          description="Got a response"
          icon={TrendingUp}
          iconColor="text-amber-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicationsChart data={applicationsOverTime} />
        <StatusDistributionChart data={statusDistribution} />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentApplications applications={recentApplications} />
        <UpcomingActionItems items={upcomingItems} />
      </div>

      {/* Quick Stats Footer */}
      {metrics.pendingTasks > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                <ListTodo className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">
                  You have {metrics.pendingTasks} pending task
                  {metrics.pendingTasks !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  Stay on top of your job search
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/tracker">View Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
