'use client';
import { Button } from "@/components/ui/button";
import { AlertCircle, Briefcase, CarTaxiFront, GraduationCap, Home, Hospital, Plus, TicketsPlane } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { FinancialGoalForm } from "@/components/forms/FinancialGoalForm";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { GoalCard } from "@/components/shared/GoalCard";
import { Category, FinancialGoal } from "@prisma/client";
import { deleteFinancialGoal, getUserFinancialGoals } from "@/services/actions/financial-goal";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FinancialPlanning() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [goals, setGoals] = useState<FinancialGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
    const confirmDeleteGoal = (goalId: string) => {
        setGoalToDelete(goalId);
        setDeleteDialogOpen(true);
    };

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const response = await getUserFinancialGoals();
            if (response.success && response.data) {
                setGoals(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch goals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const getRandomProgress = (goalId: string) => {
        const seed = goalId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return Math.floor((seed % 80) + 10);
    };
    const getCategoryIcon = (category: Category) => {
        switch (category) {
            case "TRAVEL":
                return <TicketsPlane />;
            case "EMERGENCY":
                return <AlertCircle />;
            case "RETIREMENT":
                return <Briefcase />;
            case "EDUCATION":
                return <GraduationCap />;
            case "HOME_PURCHASE":
                return <Home />;
            case "VEHICLE":
                return <CarTaxiFront />;
            case "HEALTHCARE":
                return <Hospital />;
            default:
                return <Plus />;
        }
    };

    const handleConfirmDelete = async () => {
        if (!goalToDelete) return;

        try {
            const updatedGoals = goals.filter(goal => goal.id !== goalToDelete);
            setGoals(updatedGoals);

            const response = await deleteFinancialGoal(goalToDelete);

            if (response.success) {
                toast.success("Goal deleted successfully");
            } else {
                toast.error(response.error || "Failed to delete goal");
                fetchGoals();
            }
        } catch (error) {
            console.error("Error deleting goal:", error);
            toast.error("Something went wrong while deleting the goal");
            fetchGoals();
        } finally {
            setDeleteDialogOpen(false);
            setGoalToDelete(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-primary">Create Budget & Goals</h1>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            <span>Set New Target</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white">
                        <DialogHeader className="flex flex-col  items-center">
                            <DialogTitle className="text-xl font-semibold text-primary">Create A New Financial Goal</DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm">
                                Fill in the details to create your goal
                            </DialogDescription>
                        </DialogHeader>
                        <FinancialGoalForm onCancel={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the financial goal.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>


            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-primary">Goals Summary</h2>
                    {loading && <div className="text-sm text-gray-500">Loading goals...</div>}
                </div>

                {goals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {goals.slice(0, 4).map((goal, index) => {
                            const progress = getRandomProgress(goal.id);
                            return (
                                <GoalCard
                                    key={goal.id}
                                    icon={getCategoryIcon(goal.category)}
                                    title={goal.name}
                                    currentAmount={goal.amount * (progress / 100)}
                                    targetAmount={goal.amount}
                                    progress={progress}
                                    hasBackground={index === 1}
                                    onDelete={() => confirmDeleteGoal(goal.id)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        {loading ? (
                            <p>Loading your financial goals...</p>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-gray-500">You haven&apos;t created any financial goals yet.</p>
                                <Button
                                    className="bg-primary hover:bg-primary/90"
                                    onClick={() => setDialogOpen(true)}
                                >
                                    Create your first goal
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3">
                <h2 className="text-xl font-medium text-[#01162c] p-6">Goals History</h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-[#f6fafd]">
                            <TableRow>
                                <TableHead className="font-medium text-[#747682]">Goal Name</TableHead>
                                <TableHead className="font-medium text-[#747682]">Target Amount</TableHead>
                                <TableHead className="font-medium text-[#747682]">Achieved</TableHead>
                                <TableHead className="font-medium text-[#747682]">Duration</TableHead>
                                <TableHead className="font-medium text-[#747682]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goals.length > 0 ? (
                                goals.map(goal => {

                                    const progress = getRandomProgress(goal.id);
                                    const achievedAmount = goal.amount * (progress / 100);


                                    const formattedTarget = new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(goal.amount);

                                    const formattedAchieved = new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(achievedAmount);


                                    const today = new Date();
                                    const targetDate = new Date(goal.targetDate);
                                    const startMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(today);
                                    const startYear = today.getFullYear();
                                    const endMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(targetDate);
                                    const endYear = targetDate.getFullYear();

                                    const duration = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;

                                    let status;
                                    let statusClass;

                                    if (progress >= 80) {
                                        status = "Near Complete";
                                        statusClass = "bg-[#e9f7ee] text-[#23c55e]";
                                    } else if (progress >= 40) {
                                        status = "In Progress";
                                        statusClass = "bg-[#dcf6ff] text-[#077deb]";
                                    } else {
                                        status = "On Track";
                                        statusClass = "bg-[#ffedee] text-[#fc4b53]";
                                    }

                                    return (
                                        <TableRow key={goal.id}>
                                            <TableCell className="font-medium">{goal.name}</TableCell>
                                            <TableCell>{formattedTarget}</TableCell>
                                            <TableCell>{formattedAchieved}</TableCell>
                                            <TableCell>{duration}</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-sm ${statusClass}`}>
                                                    {status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                        {loading ? "Loading goals..." : "No financial goals found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}