"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  User,
  Shield,
  Bell,
  Eye,
  DollarSign,
  Smartphone,
  Mail,
  Lock,
  Skull,
  Save,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(
    user?.settings || {
      theme: "dark",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        showBalance: true,
        showActivity: true,
      },
      limits: {
        dailyDeposit: 10000,
        dailyWithdrawal: 5000,
        sessionTime: 240,
      },
      language: "en",
      currency: "USD",
    },
  )
  const { toast } = useToast()

  const saveSettings = async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      updateUser({ settings })
      setIsLoading(false)
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully",
      })
    }, 1000)
  }

  const updateSetting = (path: string, value: any) => {
    setSettings((prev) => {
      const keys = path.split(".")
      const newSettings = { ...prev }
      let current: any = newSettings

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
            <Skull className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-red-500">Settings</h2>
        <p className="text-gray-400">Customize your Red Syndicate experience</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/50">
          <TabsTrigger value="account" className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400">
            <Eye className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="limits" className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400">
            <DollarSign className="h-4 w-4 mr-2" />
            Limits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-black/40 border-red-600/20">
            <CardHeader>
              <CardTitle className="text-red-400">Account Information</CardTitle>
              <CardDescription className="text-gray-400">Manage your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Username</Label>
                  <Input value={user?.username || ""} readOnly className="bg-black/50 border-red-600/30 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Email</Label>
                  <Input value={user?.email || ""} readOnly className="bg-black/50 border-red-600/30 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger className="bg-black/50 border-red-600/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/30">
                      <SelectItem value="en" className="text-white hover:bg-red-600/20">
                        English
                      </SelectItem>
                      <SelectItem value="es" className="text-white hover:bg-red-600/20">
                        Español
                      </SelectItem>
                      <SelectItem value="fr" className="text-white hover:bg-red-600/20">
                        Français
                      </SelectItem>
                      <SelectItem value="de" className="text-white hover:bg-red-600/20">
                        Deutsch
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                    <SelectTrigger className="bg-black/50 border-red-600/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/30">
                      <SelectItem value="USD" className="text-white hover:bg-red-600/20">
                        USD ($)
                      </SelectItem>
                      <SelectItem value="EUR" className="text-white hover:bg-red-600/20">
                        EUR (€)
                      </SelectItem>
                      <SelectItem value="GBP" className="text-white hover:bg-red-600/20">
                        GBP (£)
                      </SelectItem>
                      <SelectItem value="BTC" className="text-white hover:bg-red-600/20">
                        BTC (₿)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                  <SelectTrigger className="bg-black/50 border-red-600/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    <SelectItem value="dark" className="text-white hover:bg-red-600/20">
                      Dark (Red Syndicate)
                    </SelectItem>
                    <SelectItem value="light" className="text-white hover:bg-red-600/20">
                      Light
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-black/40 border-red-600/20">
            <CardHeader>
              <CardTitle className="text-red-400">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Protect your account with advanced security features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-600/20">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-medium text-white">Email Verification</p>
                      <p className="text-sm text-gray-400">Your email is verified</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Verified</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/20">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                      {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                    >
                      {user?.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-600/20">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-medium text-white">Password</p>
                      <p className="text-sm text-gray-400">Last changed: Never</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-red-600/30 text-red-400 hover:bg-red-600/20">
                    Change Password
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-red-400">Login Sessions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-red-600/20">
                    <div>
                      <p className="font-medium text-white">Current Session</p>
                      <p className="text-sm text-gray-400">Chrome on Windows • {new Date().toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-black/40 border-red-600/20">
            <CardHeader>
              <CardTitle className="text-red-400">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-400">Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSetting("notifications.email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-sm text-gray-400">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateSetting("notifications.push", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">SMS Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => updateSetting("notifications.sms", checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-red-400">Notification Types</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Account Activity</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="login-alerts" defaultChecked />
                        <Label htmlFor="login-alerts" className="text-sm text-gray-400">
                          Login alerts
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="deposit-alerts" defaultChecked />
                        <Label htmlFor="deposit-alerts" className="text-sm text-gray-400">
                          Deposit confirmations
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="withdrawal-alerts" defaultChecked />
                        <Label htmlFor="withdrawal-alerts" className="text-sm text-gray-400">
                          Withdrawal updates
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Gaming Activity</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="win-alerts" defaultChecked />
                        <Label htmlFor="win-alerts" className="text-sm text-gray-400">
                          Big wins
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="bonus-alerts" defaultChecked />
                        <Label htmlFor="bonus-alerts" className="text-sm text-gray-400">
                          Bonus offers
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="tournament-alerts" />
                        <Label htmlFor="tournament-alerts" className="text-sm text-gray-400">
                          Tournament invites
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-black/40 border-red-600/20">
            <CardHeader>
              <CardTitle className="text-red-400">Privacy Settings</CardTitle>
              <CardDescription className="text-gray-400">Control what information is visible to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Show Balance</Label>
                    <p className="text-sm text-gray-400">Display your balance in leaderboards</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showBalance}
                    onCheckedChange={(checked) => updateSetting("privacy.showBalance", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Show Activity</Label>
                    <p className="text-sm text-gray-400">Display your gaming activity to other players</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showActivity}
                    onCheckedChange={(checked) => updateSetting("privacy.showActivity", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Online Status</Label>
                    <p className="text-sm text-gray-400">Show when you're online</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-red-400">Data & Analytics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Analytics Tracking</Label>
                      <p className="text-sm text-gray-400">Help improve our services with anonymous usage data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Personalized Offers</Label>
                      <p className="text-sm text-gray-400">Receive offers based on your gaming preferences</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <Card className="bg-black/40 border-red-600/20">
            <CardHeader>
              <CardTitle className="text-red-400">Responsible Gaming Limits</CardTitle>
              <CardDescription className="text-gray-400">
                Set limits to help manage your gaming activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Daily Deposit Limit</Label>
                    <p className="text-sm text-gray-400">Maximum amount you can deposit per day</p>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.limits.dailyDeposit]}
                        onValueChange={(value) => updateSetting("limits.dailyDeposit", value[0])}
                        max={50000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>$100</span>
                        <span className="text-white font-medium">${settings.limits.dailyDeposit.toLocaleString()}</span>
                        <span>$50,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Daily Withdrawal Limit</Label>
                    <p className="text-sm text-gray-400">Maximum amount you can withdraw per day</p>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.limits.dailyWithdrawal]}
                        onValueChange={(value) => updateSetting("limits.dailyWithdrawal", value[0])}
                        max={25000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>$100</span>
                        <span className="text-white font-medium">
                          ${settings.limits.dailyWithdrawal.toLocaleString()}
                        </span>
                        <span>$25,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Session Time Limit</Label>
                    <p className="text-sm text-gray-400">Maximum gaming session duration (minutes)</p>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.limits.sessionTime]}
                        onValueChange={(value) => updateSetting("limits.sessionTime", value[0])}
                        max={480}
                        min={30}
                        step={30}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>30 min</span>
                        <span className="text-white font-medium">
                          {Math.floor(settings.limits.sessionTime / 60)}h {settings.limits.sessionTime % 60}m
                        </span>
                        <span>8 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-400">Important Notice</h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Limit changes take effect immediately and cannot be increased for 24 hours. If you need help
                        with gambling addiction, please contact our support team.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-red-400">Self-Exclusion</h4>
                  <p className="text-sm text-gray-400">Temporarily or permanently exclude yourself from gaming</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20">
                      24 Hours
                    </Button>
                    <Button variant="outline" className="border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20">
                      7 Days
                    </Button>
                    <Button variant="outline" className="border-red-600/30 text-red-400 hover:bg-red-600/20">
                      Permanent
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8"
        >
          {isLoading ? (
            <>
              <Settings className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
