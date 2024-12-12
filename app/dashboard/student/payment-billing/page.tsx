"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { useSession } from "next-auth/react";

const PaymentBillingPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("credit_card");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    
    try {
      setLoading(true);
      const payload = {
        userId: session?.user?.id,
        amount: Number(amount),
        paymentMethod: selectedMethod,
      };

      const response = await api.post("/api/payments", payload);

      if (response?.data?.success) {
        toast.success("Payment processed successfully");
      }
    } catch (error: any) {
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Payment & Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <button
              onClick={() => setSelectedMethod("credit_card")}
              className={`p-4 flex flex-col items-center justify-center rounded-lg border ${
                selectedMethod === "credit_card"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } transition-colors aspect-square`}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm">Credit Card</span>
            </button>
            <button
              onClick={() => setSelectedMethod("paypal")}
              className={`p-4 flex flex-col items-center justify-center rounded-lg border ${
                selectedMethod === "paypal"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } transition-colors aspect-square`}
            >
              <span className="text-2xl mb-2">P</span>
              <span className="text-sm">Paypal</span>
            </button>
            <button
              onClick={() => setSelectedMethod("apple_pay")}
              className={`p-4 flex flex-col items-center justify-center rounded-lg border ${
                selectedMethod === "apple_pay"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } transition-colors aspect-square`}
            >
              <span className="text-2xl mb-2">⌘</span>
              <span className="text-sm">Apple Pay</span>
            </button>
          </div>

          <Input
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mb-4"
          />

          <Button className="w-full" onClick={handlePayment}>
            {loading ? <LoaderCircleIcon className="animate-spin" /> : "Proceed to Payment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentBillingPage;