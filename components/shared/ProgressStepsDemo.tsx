import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/shared/progressSteps'

const ProgressStepsDemo = () => {
    const [currentStep, setCurrentStep] = useState(1)

    // Define the steps
    const steps = [
        { id: 1, label: "Select Your Bank" },
        { id: 2, label: "Waiting Auth ..." },
        { id: 3, label: "Auth Completed" }
    ]

    // Handle navigation between steps
    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Progress Steps Component */}
            <div className="mb-16 pt-8">
                <ProgressSteps
                    steps={steps}
                    currentStep={currentStep}
                />
            </div>

            {/* Content based on current step */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                {currentStep === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Select Your Bank</h2>
                        <p>Please select your bank from the available options.</p>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Authentication in Progress</h2>
                        <p>Please wait while we authenticate with your bank...</p>
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Authentication Complete</h2>
                        <p>Your bank account has been successfully connected.</p>
                    </div>
                )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 justify-end">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                >
                    Previous
                </Button>
                <Button
                    onClick={nextStep}
                    disabled={currentStep === steps.length}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default ProgressStepsDemo