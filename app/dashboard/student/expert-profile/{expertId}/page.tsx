'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircleIcon } from 'lucide-react';
import api from '@/lib/api';

const ExpertProfilePage = () => {
  const { expertId } = useParams<{ expertId: string }>();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [expertData, setExpertData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchExpertProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/experts/${expertId}`);
        setExpertData(res?.data?.data);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data?.message ?? 'Something went wrong');
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExpertProfile();
  }, [expertId]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    // Implement save profile logic here
    setIsEditing(false);
  };

  if (loading) {
    return <div><LoaderCircleIcon className="animate-spin" /></div>;
  }

  if (!expertData) {
    return <div>No expert data found.</div>;
  }

  return (
    <div className="flex-1 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Expert Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={expertData?.imageUrl} />
              <AvatarFallback>EX</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{expertData?.name}</h2>
              <p className="text-sm text-muted-foreground">{expertData?.role} at {expertData?.company}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Certifications</Label>
            <p>{expertData?.certifications}</p>
          </div>

          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <p>{expertData?.yearsOfExperience}</p>
          </div>

          <div className="space-y-2">
            <Label>Expertise Areas</Label>
            <p>{expertData?.expertiseAreas}</p>
          </div>

          <div className="space-y-2">
            <Label>User Ratings and Reviews</Label>
            {expertData?.ratings?.map((rating: any, index: number) => (
              <div key={index} className="border p-2 rounded-md">
                <p>Rating: {rating?.rating}</p>
                <p>Review: {rating?.review}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleEditProfile}>Edit Profile</Button>
        </CardFooter>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expert Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue={expertData?.name} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input defaultValue={expertData?.role} />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input defaultValue={expertData?.company} />
            </div>
            <div className="space-y-2">
              <Label>Certifications</Label>
              <Textarea defaultValue={expertData?.certifications} />
            </div>
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input type="number" defaultValue={expertData?.yearsOfExperience} />
            </div>
            <div className="space-y-2">
              <Label>Expertise Areas</Label>
              <Textarea defaultValue={expertData?.expertiseAreas} />
            </div>
            <Button onClick={handleSaveProfile}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertProfilePage;