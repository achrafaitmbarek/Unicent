import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface FormErrorProps {
    message?: string
};

export const FormError = ({
    message,
}: FormErrorProps) => {
    if (!message) return null;
    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive w-2/3 md:w-1/2 mx-auto mt-4">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <p>{message}</p>
        </div>
    )
}