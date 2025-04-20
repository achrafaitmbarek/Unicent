import { auth } from "@/auth";
import { ProgressSteps } from "@/components/shared/progressSteps";
import bank1Logo from "@/assets/Societe-Generale-Logo.png";
import bank2Logo from "@/assets/bnpp.png";
import bank3Logo from "@/assets/Hello_bankLogo.png";
import BankCard from "@/components/shared/bank-card";

const DashboardPage = async () => {
    const session = await auth();

    if (!session?.user?.email) {
        return <h1>Access Denied</h1>;
    }

    const steps = [
        { id: 1, label: "Select Your Bank" },
        { id: 2, label: "Waiting Auth ..." },
        { id: 3, label: "Auth Completed" }
    ]
    const banks = [
        { id: 1, name: "Société Générale", logo: bank1Logo },
        { id: 2, name: "BNP Paribas", logo: bank2Logo },
        { id: 3, name: "Crédit Agricole", logo: bank3Logo },
        { id: 4, name: "LCL", logo: bank1Logo },
        { id: 5, name: "HSBC", logo: bank2Logo },
        { id: 6, name: "Boursorama", logo: bank3Logo },
        { id: 7, name: "ING Direct", logo: bank1Logo },
        { id: 8, name: "Revolut", logo: bank2Logo },
    ];
    return (
        <div className="mx-auto flex flex-col items-center justify-center max-w-7xl p-8 space-y-12">
            <h1 className="text-2xl font-bold mb-2">
                Select Your Bank
            </h1>
            <ProgressSteps steps={steps} currentStep={1} />
            <h1 className="text-2xl font-bold mb-6">
                Supported Banks
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {banks.map((bank) => (
                    <BankCard
                        key={bank.id}
                        name={bank.name}
                        logo={bank.logo}
                    />
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;