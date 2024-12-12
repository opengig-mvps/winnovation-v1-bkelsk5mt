"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { DateTimePicker } from "@/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { LoaderCircleIcon, Calendar, Clock, Trash2 } from "lucide-react";

type BookingFormData = {
  expertId: number;
  scheduleId: number;
};

const BookingSchedulingPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [experts, setExperts] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | undefined; end: Date | undefined }>({ start: undefined, end: undefined });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingFormData>();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/experts/search');
        setExperts(res?.data?.data);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? 'Something went wrong');
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    try {
      setLoading(true);
      const payload = {
        userId: session?.user?.id,
        expertId: data?.expertId,
        scheduleId: data?.scheduleId,
      };

      const response = await api.post('/api/bookings', payload);

      if (response?.data?.success) {
        toast.success("Booking created successfully!");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Schedule Your Booking</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="expertId" className="block text-sm font-medium text-gray-700">Select Expert</label>
              <select {...register("expertId", { required: "Expert selection is required" })} className="block w-full p-2 border rounded-md">
                {experts?.map((expert: any) => (
                  <option key={expert?.id} value={expert?.id}>
                    {expert?.name} - {expert?.role}
                  </option>
                ))}
              </select>
              {errors?.expertId && <p className="text-red-500 text-sm">{errors?.expertId?.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="scheduleId" className="block text-sm font-medium text-gray-700">Select Schedule</label>
              <select {...register("scheduleId", { required: "Schedule selection is required" })} className="block w-full p-2 border rounded-md">
                <option value="1">Schedule 1</option>
                <option value="2">Schedule 2</option>
              </select>
              {errors?.scheduleId && <p className="text-red-500 text-sm">{errors?.scheduleId?.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Select Date & Time</label>
              <DateTimePicker
                date={selectedDates?.start}
                setDate={(date: any) => setSelectedDates({ ...selectedDates, start: date })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : "Create Booking"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BookingSchedulingPage;