"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Plus, Trash2, Loader2 } from "lucide-react"
import { useSlotManagement } from "@/app/Doctor/hooks/useSlotManagement"
import { format } from "date-fns"

export default function SlotManagement() {
  const { slots, loading, error, createSlot, deleteSlot } = useSlotManagement()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newSlot, setNewSlot] = useState({ startTime: "08:00", endTime: "08:30" })
  const [creating, setCreating] = useState(false)

  // useEffect(() => {
  //   fetchSlots(selectedDate)
  // }, [selectedDate, fetchSlots])

  const handleCreateSlot = async () => {
    setCreating(true)
    try {
      await createSlot({
        date: selectedDate,
        start_time: newSlot.startTime,
        end_time: newSlot.endTime,
      })
      setDialogOpen(false)
      setNewSlot({ startTime: "08:00", endTime: "08:30" })
    } catch (err) {
      console.error("Failed to create slot:", err)
    } finally {
      setCreating(false)
    }
  }

  // const handleDeleteSlot = async (slotId: string) => {
  //   if (confirm("Bạn có chắc muốn xóa slot này?")) {
  //     try {
  //       await deleteSlot(slotId)
  //     } catch (err) {
  //       console.error("Failed to delete slot:", err)
  //     }
  //   }
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quản lý lịch làm việc
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Thêm Slot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo Slot mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Ngày</Label>
                  <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Giờ bắt đầu</Label>
                    <Input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Giờ kết thúc</Label>
                    <Input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateSlot} disabled={creating} className="w-full">
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tạo Slot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Label>Chọn ngày:</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-destructive">{error}</p>
        ) : slots.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Chưa có slot nào trong ngày này</p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {/* {slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">
                    {slot.startTime} - {slot.endTime}
                  </p>
                  <Badge variant={slot.isAvailable ? "secondary" : "destructive"}>
                    {slot.isAvailable ? "Trống" : "Đã đặt"}
                  </Badge>
                </div>
                {slot.isAvailable && (
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSlot(slot.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))} */}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
