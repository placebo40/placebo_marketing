"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Bell,
  Shield,
  Building,
  Save,
  Trash2,
  AlertTriangle,
  CreditCard,
  Calendar,
  Gift,
  X,
  CheckCircle,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SellerSettingsPage() {
  const { language } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCancelTrialConfirm, setShowCancelTrialConfirm] = useState(false)
  const [showCancelSubscriptionConfirm, setShowCancelSubscriptionConfirm] = useState(false)

  // Mock subscription data - in real app this would come from API
  const [subscriptionData] = useState({
    isOnTrial: true,
    trialEndsAt: "2024-01-23",
    currentPlan: "professional",
    planPrice: "¥15,800",
    nextBillingDate: "2024-01-23",
    paymentMethod: "•••• •••• •••• 1234",
    subscriptionStatus: "active", // active, cancelled, past_due
  })

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    businessName: "Tanaka Motors",
    contactPerson: "Hiroshi Tanaka",
    email: "contact@tanakamotors.com",
    phone: "+81-98-XXX-XXXX",
    address: "123 Main Street, Naha, Okinawa 900-0001",
    businessType: "dealership",
    licenseNumber: "OKI-2024-001",
    description: "Family-owned dealership specializing in quality used vehicles with over 20 years of experience.",
    website: "https://tanakamotors.com",
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newInquiries: true,
    testDriveRequests: true,
    listingUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    systemUpdates: true,
  })

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showContactInfo: true,
    showBusinessHours: true,
    allowDirectMessages: true,
    showListingHistory: false,
    dataSharing: false,
  })

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState({
    businessHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: false },
    },
    autoReply: true,
    autoReplyMessage: "Thank you for your inquiry. We'll get back to you within 24 hours.",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    language: language,
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast({
      title: language === "en" ? "Settings saved" : "設定が保存されました",
      description: language === "en" ? "Your settings have been updated successfully." : "設定が正常に更新されました。",
    })
  }

  const handleCancelTrial = async () => {
    // Get current listings count (mock data - in real app would come from API)
    const currentListings = 1 // During trial, only 1 listing allowed
    const guestLimit = 1 // Guest tier allows 1 simultaneous listing

    // Since trial and guest both allow 1 listing, no additional confirmation needed
    toast({
      title: language === "en" ? "Trial cancelled" : "トライアルがキャンセルされました",
      description:
        language === "en"
          ? "Your free trial has been cancelled. You can continue using the service until your trial period ends, then you'll be moved to the guest dashboard."
          : "無料トライアルがキャンセルされました。トライアル期間終了まではサービスをご利用いただけ、その後ゲストダッシュボードに移動されます。",
    })
    setShowCancelTrialConfirm(false)
  }

  const handleCancelSubscription = async () => {
    // Simulate subscription cancellation
    toast({
      title: language === "en" ? "Subscription cancelled" : "サブスクリプションがキャンセルされました",
      description:
        language === "en"
          ? "Your subscription has been cancelled. You can continue using the service until the end of your current billing period."
          : "サブスクリプションがキャンセルされました。現在の請求期間終了まではサービスをご利用いただけます。",
    })
    setShowCancelSubscriptionConfirm(false)
  }

  const handleDeleteAccount = async () => {
    // Simulate account deletion
    toast({
      title: language === "en" ? "Account deletion requested" : "アカウント削除がリクエストされました",
      description:
        language === "en"
          ? "Your account deletion request has been submitted. You'll receive a confirmation email."
          : "アカウント削除リクエストが送信されました。確認メールが届きます。",
      variant: "destructive",
    })
    setShowDeleteConfirm(false)
  }

  const getPlanName = (planKey: string) => {
    const plans = {
      starter: language === "en" ? "Starter" : "スターター",
      professional: language === "en" ? "Professional" : "プロフェッショナル",
      enterprise: language === "en" ? "Enterprise" : "エンタープライズ",
    }
    return plans[planKey as keyof typeof plans] || planKey
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "en" ? "en-US" : "ja-JP")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-2">{language === "en" ? "Settings" : "設定"}</h1>
          <p className="text-gray-600">
            {language === "en" ? "Manage your account and business preferences" : "アカウントとビジネス設定を管理"}
          </p>
        </div>

        <div className="space-y-8">
          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Subscription & Billing" : "サブスクリプション・請求"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Manage your subscription plan and billing information"
                  : "サブスクリプションプランと請求情報を管理"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-placebo-gold/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-placebo-gold/20 rounded-full flex items-center justify-center">
                    {subscriptionData.isOnTrial ? (
                      <Gift className="h-6 w-6 text-placebo-gold" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-placebo-gold" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{getPlanName(subscriptionData.currentPlan)}</h3>
                      {subscriptionData.isOnTrial && (
                        <Badge className="bg-green-100 text-green-800">
                          {language === "en" ? "Free Trial" : "無料トライアル"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {subscriptionData.isOnTrial
                        ? language === "en"
                          ? `Trial ends on ${formatDate(subscriptionData.trialEndsAt)}`
                          : `トライアル終了日: ${formatDate(subscriptionData.trialEndsAt)}`
                        : language === "en"
                          ? `Next billing: ${formatDate(subscriptionData.nextBillingDate)}`
                          : `次回請求日: ${formatDate(subscriptionData.nextBillingDate)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-placebo-gold">
                    {subscriptionData.isOnTrial ? "¥0" : subscriptionData.planPrice}
                  </div>
                  <div className="text-sm text-gray-600">
                    {subscriptionData.isOnTrial
                      ? language === "en"
                        ? "During trial"
                        : "トライアル中"
                      : language === "en"
                        ? "/month"
                        : "/月"}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              {!subscriptionData.isOnTrial && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-placebo-gold" />
                    {language === "en" ? "Payment Method" : "支払い方法"}
                  </h4>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span className="font-mono">{subscriptionData.paymentMethod}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      {language === "en" ? "Update" : "更新"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Trial Actions */}
              {subscriptionData.isOnTrial && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{language === "en" ? "Trial Management" : "トライアル管理"}</h4>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "You can cancel your trial anytime without being charged"
                          : "課金されることなくいつでもトライアルをキャンセルできます"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelTrialConfirm(true)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {language === "en" ? "Cancel Trial" : "トライアルキャンセル"}
                    </Button>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      {language === "en" ? "Trial Limitations" : "トライアル制限"}
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      {language === "en"
                        ? "During your free trial, you can have 1 active listing. After payment, you'll get access to your full plan limits."
                        : "無料トライアル中は1つのアクティブなリスティングが可能です。支払い後、プランの全制限にアクセスできます。"}
                    </p>
                    <p className="text-sm text-orange-700">
                      {language === "en"
                        ? "If you cancel, you'll be moved to the guest dashboard after your trial ends."
                        : "キャンセルした場合、トライアル終了後にゲストダッシュボードに移動されます。"}
                    </p>
                  </div>
                </div>
              )}

              {/* Subscription Actions */}
              {!subscriptionData.isOnTrial && subscriptionData.subscriptionStatus === "active" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {language === "en" ? "Subscription Management" : "サブスクリプション管理"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "Cancel your subscription anytime. You'll retain access until the end of your billing period."
                          : "いつでもサブスクリプションをキャンセルできます。請求期間終了まではアクセスを保持できます。"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelSubscriptionConfirm(true)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {language === "en" ? "Cancel Subscription" : "サブスクリプションキャンセル"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Plan Upgrade/Downgrade */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{language === "en" ? "Change Plan" : "プラン変更"}</h4>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "Upgrade or downgrade your plan anytime"
                        : "いつでもプランをアップグレード・ダウングレードできます"}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === "en" ? "View Plans" : "プランを見る"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Account Information" : "アカウント情報"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Update your business profile and contact information"
                  : "ビジネスプロフィールと連絡先情報を更新"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">{language === "en" ? "Business Name" : "事業者名"}</Label>
                  <Input
                    id="businessName"
                    value={accountSettings.businessName}
                    onChange={(e) => setAccountSettings((prev) => ({ ...prev, businessName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">{language === "en" ? "Contact Person" : "担当者名"}</Label>
                  <Input
                    id="contactPerson"
                    value={accountSettings.contactPerson}
                    onChange={(e) => setAccountSettings((prev) => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">{language === "en" ? "Email Address" : "メールアドレス"}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{language === "en" ? "Phone Number" : "電話番号"}</Label>
                  <Input
                    id="phone"
                    value={accountSettings.phone}
                    onChange={(e) => setAccountSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">{language === "en" ? "Business Address" : "事業所住所"}</Label>
                <Input
                  id="address"
                  value={accountSettings.address}
                  onChange={(e) => setAccountSettings((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessType">{language === "en" ? "Business Type" : "事業タイプ"}</Label>
                  <Select
                    value={accountSettings.businessType}
                    onValueChange={(value) => setAccountSettings((prev) => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dealership">{language === "en" ? "Dealership" : "ディーラー"}</SelectItem>
                      <SelectItem value="private">{language === "en" ? "Private Seller" : "個人販売者"}</SelectItem>
                      <SelectItem value="broker">{language === "en" ? "Broker" : "ブローカー"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="licenseNumber">{language === "en" ? "License Number" : "ライセンス番号"}</Label>
                  <Input
                    id="licenseNumber"
                    value={accountSettings.licenseNumber}
                    onChange={(e) => setAccountSettings((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">{language === "en" ? "Business Description" : "事業説明"}</Label>
                <Textarea
                  id="description"
                  value={accountSettings.description}
                  onChange={(e) => setAccountSettings((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="website">{language === "en" ? "Website" : "ウェブサイト"}</Label>
                <Input
                  id="website"
                  type="url"
                  value={accountSettings.website}
                  onChange={(e) => setAccountSettings((prev) => ({ ...prev, website: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Notification Preferences" : "通知設定"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Choose how you want to be notified about important updates"
                  : "重要な更新についての通知方法を選択"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "en" ? "Email Notifications" : "メール通知"}</Label>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Receive notifications via email" : "メールで通知を受信"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "en" ? "SMS Notifications" : "SMS通知"}</Label>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Receive notifications via SMS" : "SMSで通知を受信"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "en" ? "Push Notifications" : "プッシュ通知"}</Label>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Receive browser push notifications" : "ブラウザプッシュ通知を受信"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "en" ? "New Inquiries" : "新しいお問い合わせ"}</Label>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "When someone inquires about your listings"
                        : "出品についてお問い合わせがあった時"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newInquiries}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, newInquiries: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "en" ? "Test Drive Requests" : "試乗リクエスト"}</Label>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "When someone requests a test drive" : "試乗リクエストがあった時"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.testDriveRequests}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, testDriveRequests: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "en" ? "Listing Updates" : "出品更新"}</Label>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Updates about your listing status" : "出品ステータスの更新について"}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.listingUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, listingUpdates: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Privacy & Security" : "プライバシーとセキュリティ"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Control your privacy and security settings"
                  : "プライバシーとセキュリティ設定を管理"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{language === "en" ? "Profile Visibility" : "プロフィール表示"}</Label>
                  <p className="text-sm text-gray-600">
                    {language === "en"
                      ? "Who can see your business profile"
                      : "ビジネスプロフィールを見ることができる人"}
                  </p>
                </div>
                <Select
                  value={privacySettings.profileVisibility}
                  onValueChange={(value) => setPrivacySettings((prev) => ({ ...prev, profileVisibility: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">{language === "en" ? "Public" : "公開"}</SelectItem>
                    <SelectItem value="registered">
                      {language === "en" ? "Registered Users" : "登録ユーザー"}
                    </SelectItem>
                    <SelectItem value="private">{language === "en" ? "Private" : "非公開"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{language === "en" ? "Show Contact Information" : "連絡先情報を表示"}</Label>
                  <p className="text-sm text-gray-600">
                    {language === "en" ? "Display your contact details on listings" : "出品に連絡先詳細を表示"}
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showContactInfo}
                  onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, showContactInfo: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{language === "en" ? "Allow Direct Messages" : "ダイレクトメッセージを許可"}</Label>
                  <p className="text-sm text-gray-600">
                    {language === "en"
                      ? "Let buyers message you directly"
                      : "購入者が直接メッセージを送信できるようにする"}
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowDirectMessages}
                  onCheckedChange={(checked) =>
                    setPrivacySettings((prev) => ({ ...prev, allowDirectMessages: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Business Settings" : "ビジネス設定"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Configure your business operations" : "ビジネス運営を設定"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{language === "en" ? "Auto-Reply Messages" : "自動返信メッセージ"}</Label>
                  <p className="text-sm text-gray-600">
                    {language === "en" ? "Automatically respond to new inquiries" : "新しいお問い合わせに自動返信"}
                  </p>
                </div>
                <Switch
                  checked={businessSettings.autoReply}
                  onCheckedChange={(checked) => setBusinessSettings((prev) => ({ ...prev, autoReply: checked }))}
                />
              </div>

              {businessSettings.autoReply && (
                <div>
                  <Label htmlFor="autoReplyMessage">
                    {language === "en" ? "Auto-Reply Message" : "自動返信メッセージ"}
                  </Label>
                  <Textarea
                    id="autoReplyMessage"
                    value={businessSettings.autoReplyMessage}
                    onChange={(e) => setBusinessSettings((prev) => ({ ...prev, autoReplyMessage: e.target.value }))}
                    rows={3}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{language === "en" ? "Currency" : "通貨"}</Label>
                  <Select
                    value={businessSettings.currency}
                    onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{language === "en" ? "Timezone" : "タイムゾーン"}</Label>
                  <Select
                    value={businessSettings.timezone}
                    onValueChange={(value) => setBusinessSettings((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                {language === "en" ? "Danger Zone" : "危険ゾーン"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Irreversible and destructive actions for your account"
                  : "アカウントに対する不可逆的で破壊的なアクション"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">
                    {language === "en" ? "Delete Account" : "アカウントを削除"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === "en"
                      ? "Permanently delete your account and all associated data"
                      : "アカウントと関連するすべてのデータを完全に削除"}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === "en" ? "Delete Account" : "アカウント削除"}
                </Button>
              </div>

              {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">
                    {language === "en" ? "Are you absolutely sure?" : "本当によろしいですか？"}
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    {language === "en"
                      ? "This action cannot be undone. This will permanently delete your account and remove all your data from our servers."
                      : "この操作は元に戻すことができません。アカウントが完全に削除され、すべてのデータがサーバーから削除されます。"}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDeleteAccount} size="sm">
                      {language === "en" ? "Yes, delete my account" : "はい、アカウントを削除します"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} size="sm">
                      {language === "en" ? "Cancel" : "キャンセル"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
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
          </div>
        </div>

        {/* Cancel Trial Confirmation Modal */}
        {showCancelTrialConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {language === "en" ? "Cancel Free Trial?" : "無料トライアルをキャンセルしますか？"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === "en"
                        ? `${Math.ceil((new Date(subscriptionData.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                        : `残り${Math.ceil((new Date(subscriptionData.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日`}
                    </p>
                  </div>
                </div>

                {/* Listing Management Warning */}
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    {language === "en" ? "Trial Limitations" : "トライアル制限"}
                  </h4>
                  <p className="text-sm text-orange-700 mb-2">
                    {language === "en"
                      ? "During your free trial, you can have 1 active listing. After payment, you'll get access to your full plan limits."
                      : "無料トライアル中は1つのアクティブなリスティングが可能です。支払い後、プランの全制限にアクセスできます。"}
                  </p>
                  <p className="text-sm text-orange-700">
                    {language === "en"
                      ? "If you cancel, you'll be moved to the guest dashboard after your trial ends."
                      : "キャンセルした場合、トライアル終了後にゲストダッシュボードに移動されます。"}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    {language === "en"
                      ? "If you cancel your trial now, you'll still have access to all features until your trial expires, but you won't be automatically charged when it ends."
                      : "今トライアルをキャンセルしても、トライアル期間終了まではすべての機能にアクセスできますが、期間終了時に自動課金されません。"}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {language === "en" ? "What you'll keep:" : "継続できること："}
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        •{" "}
                        {language === "en" ? "Full access until trial expires" : "トライアル期間終了まで全機能利用可能"}
                      </li>
                      <li>• {language === "en" ? "All your current listings" : "現在の出品情報すべて"}</li>
                      <li>
                        • {language === "en" ? "Customer inquiries and messages" : "顧客からのお問い合わせとメッセージ"}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600" />
                      {language === "en" ? "What happens after trial:" : "トライアル終了後："}
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• {language === "en" ? "No automatic billing" : "自動課金なし"}</li>
                      <li>
                        •{" "}
                        {language === "en"
                          ? "Moved to guest dashboard (1 listing limit)"
                          : "ゲストダッシュボードに移動（1リスティング制限）"}
                      </li>
                      <li>
                        •{" "}
                        {language === "en"
                          ? "No access to seller dashboard features"
                          : "販売者ダッシュボード機能へのアクセス不可"}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCancelTrialConfirm(false)} className="px-6">
                    {language === "en" ? "Keep My Trial" : "トライアル継続"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelTrial}
                    className="px-6 bg-red-600 hover:bg-red-700"
                  >
                    {language === "en" ? "Yes, Cancel Trial" : "はい、キャンセルします"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
