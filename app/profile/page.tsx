"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Camera, Save, Edit3, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const [avatarSrc, setAvatarSrc] = useState<string>("/professional-headshot.png")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState({
    firstName: language === "en" ? "John" : "太郎",
    lastName: language === "en" ? "Doe" : "田中",
    email: "john.doe@example.com",
    phone: "+81 90-1234-5678",
    address: language === "en" ? "Tokyo, Japan" : "東京都",
    bio:
      language === "en"
        ? "Car enthusiast and collector with over 10 years of experience in the automotive industry."
        : "自動車業界で10年以上の経験を持つ車愛好家およびコレクター。",
    dateOfBirth: "1990-05-15",
    gender: "male",
    language: language,
    timezone: "Asia/Tokyo",
  })

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      toast({
        title: language === "en" ? "Invalid file type" : "無効なファイル形式",
        description:
          language === "en"
            ? "Please upload a JPEG, PNG, GIF, or WebP image"
            : "JPEG、PNG、GIF、またはWebP画像をアップロードしてください",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: language === "en" ? "File too large" : "ファイルが大きすぎます",
        description:
          language === "en" ? "Please upload an image smaller than 5MB" : "5MB未満の画像をアップロードしてください",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Create a preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        setAvatarSrc(result)
      }
    }
    reader.readAsDataURL(file)

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: language === "en" ? "Profile picture updated" : "プロフィール写真が更新されました",
        description:
          language === "en"
            ? "Your profile picture has been updated successfully"
            : "プロフィール写真が正常に更新されました",
      })
    }, 1500)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "My Profile" : "プロフィール"}
          </h1>
          <p className="text-gray-600">
            {language === "en" ? "Manage your account settings and preferences" : "アカウント設定と設定を管理する"}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarSrc || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    aria-label={language === "en" ? "Upload profile picture" : "プロフィール写真をアップロード"}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                    aria-label={language === "en" ? "Change profile picture" : "プロフィール写真を変更"}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-placebo-black">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600 mb-2">{profileData.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {isVerified ? (
                      <Badge variant="secondary">{language === "en" ? "Verified User" : "認証済みユーザー"}</Badge>
                    ) : (
                      <Link href="/verification" className="text-sm text-placebo-gold hover:underline font-medium">
                        {language === "en" ? "Verify your account" : "アカウントを認証する"} →
                      </Link>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing
                    ? language === "en"
                      ? "Cancel"
                      : "キャンセル"
                    : language === "en"
                      ? "Edit Profile"
                      : "プロフィール編集"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Personal Information" : "個人情報"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{language === "en" ? "First Name" : "名"}</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{language === "en" ? "Last Name" : "姓"}</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">{language === "en" ? "Email Address" : "メールアドレス"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{language === "en" ? "Phone Number" : "電話番号"}</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">{language === "en" ? "Date of Birth" : "生年月日"}</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">{language === "en" ? "Address" : "住所"}</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="bio">{language === "en" ? "Bio" : "自己紹介"}</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">{language === "en" ? "Gender" : "性別"}</Label>
                  <Select
                    value={profileData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{language === "en" ? "Male" : "男性"}</SelectItem>
                      <SelectItem value="female">{language === "en" ? "Female" : "女性"}</SelectItem>
                      <SelectItem value="other">{language === "en" ? "Other" : "その他"}</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        {language === "en" ? "Prefer not to say" : "回答しない"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">{language === "en" ? "Timezone" : "タイムゾーン"}</Label>
                  <Select
                    value={profileData.timezone}
                    onValueChange={(value) => handleInputChange("timezone", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Asia/Shanghai">Asia/Shanghai (CST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving
                      ? language === "en"
                        ? "Saving..."
                        : "保存中..."
                      : language === "en"
                        ? "Save Changes"
                        : "変更を保存"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {language === "en" ? "Cancel" : "キャンセル"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
