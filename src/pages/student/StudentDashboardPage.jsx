import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, FileText, MessageSquare, UploadCloud } from "lucide-react";

const StudentDashboardPage = () => {
  return (
    <div className="p-6 grid gap-6 lg:grid-cols-3">
      {/* Welcome Message */}
      <div className="col-span-full">
        <h1 className="text-2xl font-bold">Welcome back, Norman 👋</h1>
        <p className="text-muted-foreground">Here's a quick overview of your project journey.</p>
      </div>

      {/* Project Overview */}
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Current Project</h2>
          <p className="text-muted-foreground">AI-Based Tutoring System</p>
          <div className="mt-4 text-sm">
            <p>Status: <span className="font-semibold text-yellow-600">In Progress</span></p>
            <p>Supervisor: Dr. Zubeda Ahmed</p>
            <p>Next Deadline: <span className="font-medium">May 30, 2025</span></p>
          </div>
          <div className="mt-4 flex gap-4">
            <Button>View Project</Button>
            <Button variant="outline">Submit Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium">Notifications</h3>
          </div>
          <ul className="text-sm list-disc pl-5 text-muted-foreground">
            <li>Supervisor commented on your last report.</li>
            <li>Upcoming submission deadline: Final Report - May 30</li>
            <li>Profile verification complete.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6 grid gap-4">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium">Quick Actions</h3>
          </div>
          <Button variant="outline" className="w-full">Upload Report</Button>
          <Button variant="outline" className="w-full">View Feedback</Button>
          <Button variant="outline" className="w-full">Book Consultation</Button>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium">Project Progress</h3>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div className="bg-purple-600 h-4 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="text-right text-xs text-muted-foreground mt-1">60% complete</p>
        </CardContent>
      </Card>

      {/* Supervisor Comments */}
      <Card className="lg:col-span-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-pink-600" />
            <h3 className="text-lg font-medium">Supervisor Comments</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            <p><strong>Dr. Zubeda:</strong> "Good progress so far. Ensure your methodology chapter is well aligned with your objectives. Let's meet on Thursday."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboardPage;
