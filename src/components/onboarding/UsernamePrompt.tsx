
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageWrapper } from '@/components/shared/PageWrapper';
import { SmilePlus } from 'lucide-react';

interface UsernamePromptProps {
  onUsernameSet: (name: string) => void;
}

export default function UsernamePrompt({ onUsernameSet }: UsernamePromptProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (name.trim() === '') {
      setError('Username cannot be empty.');
      return;
    }
    if (name.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    setError('');
    onUsernameSet(name.trim());
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      <Card className="w-full max-w-md shadow-2xl bg-card/[.40] backdrop-blur-xl">
        <CardHeader className="text-center">
          <SmilePlus className="w-16 h-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-3xl font-bold text-primary">Welcome to Snacker!</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Let's get started by setting up your username. This will help personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Preferred Username</Label>
            <Input 
              id="username" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Snacker"
              aria-describedby="username-error"
            />
            {error && <p id="username-error" className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full text-lg py-6">
            Save and Continue
          </Button>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
