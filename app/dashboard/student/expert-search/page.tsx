"use client";

import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon } from "lucide-react";

const ExpertSearchPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [experts, setExperts] = useState<any[]>([]);
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("ratings");

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/experts/search", {
          params: {
            company,
            role,
            specialization,
            sortBy,
          },
        });
        setExperts(res?.data?.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [company, role, specialization, sortBy]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Expert Search</h2>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search by Company"
          value={company}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e?.target?.value)}
        />
        <Input
          placeholder="Search by Role"
          value={role}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e?.target?.value)}
        />
        <Input
          placeholder="Search by Specialization"
          value={specialization}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecialization(e?.target?.value)}
        />
        <Select value={sortBy} onValueChange={(e: any) => setSortBy(e)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ratings">Ratings</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
            <SelectItem value="availability">Availability</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <LoaderCircleIcon className="animate-spin mx-auto" />
        ) : (
          experts?.map((expert: any) => (
            <Card key={expert?.id}>
              <CardHeader>
                <CardTitle>{expert?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Role: {expert?.role}</p>
                <p>Company: {expert?.company}</p>
                <p>Experience: {expert?.yearsOfExperience} years</p>
                <p>Expertise: {expert?.expertiseAreas}</p>
                <p>Ratings: {expert?.ratings}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Profile</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpertSearchPage;