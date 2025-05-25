"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Landmark, PiggyBank, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useAppContext } from '@/contexts/AppContext';
import { ALL_DEFAULT_CATEGORIES } from '@/lib/constants';
import { PageWrapper } from '../shared/PageWrapper';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Snacker!",
    description: "Your personal expense tracker to help you manage your finances with ease.",
    image: "https://placehold.co/600x400.png?a=1",
    dataAiHint: "welcome finance",
  },
  {
    title: "Track Income & Expenses",
    description: "Easily log your earnings and spendings. Categorize them for better insights.",
    image: "https://placehold.co/600x400.png?a=2",
    dataAiHint: "tracking money",
  },
  {
    title: "Visualize Your Habits",
    description: "See where your money goes with simple charts and summaries.",
    image: "https://placehold.co/600x400.png?a=3",
    dataAiHint: "financial charts",
  },
  {
    title: "Ready to Start?",
    description: "Let's get your financial journey started with Snacker!",
    icon: CheckCircle2,
  }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { addCategory } = useAppContext(); // Assuming categories are not pre-loaded if onboarding

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step, set up initial data if needed (e.g. default categories)
      // This is now handled in AppContext initialization
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <PageWrapper className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          {step.icon ? <step.icon className="w-16 h-16 mx-auto mb-4 text-primary" /> : 
            step.image && <Image src={step.image} alt={step.title} width={200} height={150} data-ai-hint={step.dataAiHint} className="mx-auto mb-4 rounded-lg" />}
          <CardTitle className="text-3xl font-bold text-primary">{step.title}</CardTitle>
          <CardDescription className="text-md text-muted-foreground">{step.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full justify-center space-x-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
          <Button onClick={handleNext} className="w-full text-lg py-6 mt-4">
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
