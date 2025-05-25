
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { PageWrapper } from '../shared/PageWrapper';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Snacker!",
    description: "Your personal expense tracker to help you manage your finances with ease.",
  },
  {
    title: "Track Income & Expenses",
    description: "Easily log your earnings and spendings. Categorize them for better insights.",
  },
  {
    title: "Visualize Your Habits",
    description: "See where your money goes with simple charts and summaries.",
  },
  {
    title: "Ready to Start?",
    description: "Let's get your financial journey started with Snacker!",
    icon: CheckCircle2,
  }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { addCategory } = useAppContext(); // Kept if needed for future category setup logic

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
      // Set isTransitioning to false after a short delay to allow new content to render before fade-in
      setTimeout(() => setIsTransitioning(false), 50); 
    }, 300); // Duration of fade-out transition
  };

  const step = steps[currentStep];

  return (
    <PageWrapper className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      <Card className="w-full max-w-md shadow-2xl bg-card/[.40] backdrop-blur-xl">
        <CardHeader 
          className={cn(
            "text-center transition-opacity duration-300 ease-in-out",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
        >
          {step.icon && <step.icon className="w-16 h-16 mx-auto mb-4 text-primary" />}
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
          <Button 
            onClick={handleNext} 
            className="w-full text-lg py-6 mt-4"
            disabled={isTransitioning}
          >
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
