"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Shield, Trophy, Star, Skull, Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    username: "RedSyndicatePlayer",
  })
  const [editData, setEditData] = useState(profileData)
  const { toast } = useToast()

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    })
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
            <Skull className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-red-500">Profile</h2>
        <p className="text-gray-400">Manage your Red Syndicate account settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-400">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-red-600/30 text-red-400 hover:bg-red-600/20"
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription className="text-gray-400">Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-red-500/30">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="bg-red-900/40 text-red-400 text-xl font-bold">RS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white text-lg">{editData.username}</h3>
                <p className="text-sm text-red-400">VIP Gold Member</p>
                <Badge variant="secondary" className="mt-1 bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                  <Trophy className="h-3 w-3 mr-1" />
                  Level 15
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  readOnly={!isEditing}
                  className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  readOnly={!isEditing}
                  className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  readOnly={!isEditing}
                  className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-gray-300">
                  Location
                </Label>
                <Input
                  id="location"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  readOnly={!isEditing}
                  className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 border-red-600/30 text-red-400 hover:bg-red-600/20"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription className="text-gray-400">Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-600/20">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-600/20">
                <div>
                  <p className="font-medium text-white">Email Verification</p>
                  <p className="text-sm text-gray-400">Verify your email address</p>
                </div>
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Verified</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-600/20">
                <div>
                  <p className="font-medium text-white">Phone Verification</p>
                  <p className="text-sm text-gray-400">Verify your phone number</p>
                </div>
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full border-red-600/30 text-red-400 hover:bg-red-600/20">
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Star className="h-5 w-5" />
              VIP Status
            </CardTitle>
            <CardDescription className="text-gray-400">Your VIP benefits and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Level</span>
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">Gold</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">XP Points</span>
                <span className="font-medium text-white">7,500 / 10,000</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">2,500 XP to Platinum level</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-red-400">Current Benefits</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• 5% cashback on all games</li>
                <li>• Priority customer support</li>
                <li>• Exclusive tournament access</li>
                <li>• Higher withdrawal limits</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="text-red-400">Gaming Statistics</CardTitle>
            <CardDescription className="text-gray-400">Your gaming performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-900/20 rounded-lg border border-red-600/20">
                <p className="text-2xl font-bold text-red-400">156</p>
                <p className="text-sm text-gray-400">Games Played</p>
              </div>
              <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-600/20">
                <p className="text-2xl font-bold text-green-400">68%</p>
                <p className="text-sm text-gray-400">Win Rate</p>
              </div>
              <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-600/20">
                <p className="text-2xl font-bold text-yellow-400">$12,450</p>
                <p className="text-sm text-gray-400">Total Winnings</p>
              </div>
              <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-600/20">
                <p className="text-2xl font-bold text-purple-400">23</p>
                <p className="text-sm text-gray-400">Tournaments Won</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
