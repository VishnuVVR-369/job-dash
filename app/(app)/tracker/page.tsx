import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getApplications } from "@/app/actions/applications";
import { auth } from "@/lib/auth";
import { ApplicationsTable } from "./_components/ApplicationsTable";

const TrackerPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  const applications = await getApplications();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Application Tracker
        </h1>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </header>
      <ApplicationsTable data={applications} />
    </div>
  );
};

export default TrackerPage;
