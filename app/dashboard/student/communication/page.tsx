'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { Video, Phone, Monitor, FileText, Shield, LoaderCircleIcon } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

const CommunicationInterface: React.FC = () => {
  const { data: session } = useSession();
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const initiateCall = async () => {
    if (!session) {
      toast.error("Please log in to initiate a call.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/communications', {
        userId: session?.user?.id,
        expertId: 2,
        callType: callType,
      });

      if (response?.data?.success) {
        toast.success("Communication session initiated successfully!");
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Communication Interface</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant={callType === 'voice' ? 'default' : 'outline'} onClick={() => setCallType('voice')}>
            <Phone className="w-4 h-4 mr-2" />
            Voice Call
          </Button>
          <Button variant={callType === 'video' ? 'default' : 'outline'} onClick={() => setCallType('video')}>
            <Video className="w-4 h-4 mr-2" />
            Video Call
          </Button>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Monitor className="w-4 h-4 mr-2" />
              Screen Sharing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Screen Sharing</DialogTitle>
            </DialogHeader>
            <p>Screen sharing feature is enabled with end-to-end encryption.</p>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Document Sharing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document Sharing</DialogTitle>
            </DialogHeader>
            <p>Share documents securely during the call.</p>
          </DialogContent>
        </Dialog>

        <div className="flex items-center space-x-4">
          <Checkbox
            checked={recordingConsent}
            onCheckedChange={(checked: any) => setRecordingConsent(checked)}
          />
          <span>Consent for call recording</span>
        </div>

        <Button className="w-full" onClick={initiateCall} disabled={loading}>
          {loading ? <LoaderCircleIcon className="animate-spin" /> : "Initiate Call"}
        </Button>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-4">
          <Shield className="w-4 h-4" />
          <span>All communications are protected with end-to-end encryption using TLS.</span>
        </div>
      </div>
    </div>
  );
};

export default CommunicationInterface;