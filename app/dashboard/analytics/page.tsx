"use server";
import AnalyticsDataTabs from "./_components/AnalyticsDataTabs";

export default async function AnalyticsLayout() {

    return (
        <div className="container">
            <AnalyticsDataTabs />
        </div>
    );
}