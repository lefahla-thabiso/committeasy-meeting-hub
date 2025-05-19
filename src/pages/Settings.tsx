
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { currentUser } from "@/data/mockData";

const Settings = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="account">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your personal information here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={currentUser.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={currentUser.email} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" defaultValue={currentUser.department || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue={currentUser.role} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" placeholder="Tell others about yourself" />
                    </div>
                    
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Update your password here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control when and how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Meeting Invitations</p>
                        <p className="text-sm text-gray-500">Receive emails when invited to meetings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Meeting Reminders</p>
                        <p className="text-sm text-gray-500">Receive reminders 1 hour before meetings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Action Items</p>
                        <p className="text-sm text-gray-500">Receive emails when assigned to action items</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Document Updates</p>
                        <p className="text-sm text-gray-500">Receive emails when documents are updated</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">In-App Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">All Activities</p>
                        <p className="text-sm text-gray-500">Receive notifications for all system activities</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mentions</p>
                        <p className="text-sm text-gray-500">Receive notifications when mentioned in comments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer bg-white shadow-sm">
                        <div className="w-full h-20 bg-white border rounded"></div>
                        <span>Light</span>
                      </div>
                      <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer">
                        <div className="w-full h-20 bg-gray-900 border rounded"></div>
                        <span>Dark</span>
                      </div>
                      <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer">
                        <div className="w-full h-20 bg-gradient-to-b from-white to-gray-900 border rounded"></div>
                        <span>System</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Layout Density</h3>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="density">Compact</Label>
                      <div className="flex-1">
                        <Input type="range" id="density" min="0" max="2" step="1" defaultValue="1" />
                      </div>
                      <Label htmlFor="density">Spacious</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reduce Animations</p>
                      <p className="text-sm text-gray-500">Minimize motion for accessibility</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
