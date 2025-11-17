import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

const Profile = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="text-xl">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="Customer Service Agent" defaultValue="Customer Service Agent" disabled />
              </div>
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Chats</p>
                <p className="text-2xl font-bold">245</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Recommendations</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-2xl font-bold">Jan 2024</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
