"use client"

import { useTestDrive } from "@/contexts/test-drive-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RealtimeStatusIndicator() {
  const { state, syncWithRemote } = useTestDrive()

  return (
    <div className="flex items-center gap-2">
      {state.connectionStatus === "connected" ? (
        <Badge variant="outline">Connected</Badge>
      ) : state.connectionStatus === "connecting" ? (
        <Badge variant="secondary">Connecting...</Badge>
      ) : (
        <Badge variant="destructive">Disconnected</Badge>
      )}
      {state.connectionStatus !== "connected" && (
        <Button size="sm" onClick={syncWithRemote}>
          Reconnect
        </Button>
      )}
      {state.lastSync && (
        <span className="text-xs text-muted-foreground">Last Sync: {state.lastSync.toLocaleTimeString()}</span>
      )}
    </div>
  )
}
