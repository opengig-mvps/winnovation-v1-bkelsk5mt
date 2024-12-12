'use client' ;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Star,
  VideoIcon,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="bg-light-yellow min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">Seamless Social Expert Platform</h1>
              <p className="text-xl text-gray-700">
                Connect with professionals, manage projects, and streamline your communication.
              </p>
            </div>
            <img
              src="https://picsum.photos/seed/picsum/200/300"
              alt="Hero"
              className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
            />
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Avatar>
                    <AvatarImage src="https://github.com/Yuyz0112.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <CardTitle className="ml-4">User-Side Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <Users className="w-4 h-4 inline-block" />
                      </Badge>
                      Authentication & Registration
                    </li>
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <Search className="w-4 h-4 inline-block" />
                      </Badge>
                      Expert Search & Discovery
                    </li>
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <VideoIcon className="w-4 h-4 inline-block" />
                      </Badge>
                      Communication Interface
                    </li>
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <Calendar className="w-4 h-4 inline-block" />
                      </Badge>
                      Booking & Scheduling Module
                    </li>
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <DollarSign className="w-4 h-4 inline-block" />
                      </Badge>
                      Payment & Billing Infrastructure
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Avatar>
                    <AvatarImage src="https://github.com/Yuyz0112.png" />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <CardTitle className="ml-4">Expert-Side Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <Star className="w-4 h-4 inline-block" />
                      </Badge>
                      Professional Onboarding
                    </li>
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <Star className="w-4 h-4 inline-block" />
                      </Badge>
                      Profile & Availability Management
                    </li>
                    <li>
                      <Badge variant="outline" className="mr-2">
                        <DollarSign className="w-4 h-4 inline-block" />
                      </Badge>
                      Earnings & Performance Dashboard
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-light-yellow">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Get Started Today</h2>
            <Button className="px-8 py-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark">
              Join the Platform
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2023 Seamless Social Expert Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;