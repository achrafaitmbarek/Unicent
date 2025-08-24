import React from 'react';
import './FinancialCard.css';

interface FinancialCardProps {
    balance: number;
    currency: string;
    isBlurred?: boolean;
}

const FinancialCard: React.FC<FinancialCardProps> = ({
    balance,
    currency,
    isBlurred = false
}) => {
    return (
        <div className={`balance-container ${isBlurred ? 'balance-blur' : ''}`}>
            <div className="balance-amount">
                {isBlurred ? '****' : `${balance} ${currency}`}
            </div>
        </div>
    );
};

export default FinancialCard;