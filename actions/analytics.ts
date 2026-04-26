"use server";

import { db } from "@/lib/db";

export async function getAnalyticsData() {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Basic Counts & Growth
    const [
      totalApplications,
      currentMonthApps,
      lastMonthApps,
      avgScoreData,
    ] = await Promise.all([
      db.application.count(),
      db.application.count({ where: { createdAt: { gte: startOfCurrentMonth } } }),
      db.application.count({ 
        where: { 
          createdAt: { 
            gte: startOfLastMonth, 
            lt: startOfCurrentMonth 
          } 
        } 
      }),
      db.application.aggregate({ _avg: { score: true } }),
    ]);

    const appGrowth = lastMonthApps === 0 ? 100 : Math.round(((currentMonthApps - lastMonthApps) / lastMonthApps) * 100);
    const avgScore = Math.round(avgScoreData._avg.score || 0);

    // 2. Funnel Data (Applied -> Assessment -> Interview -> Offer)
    const funnelSteps = ["APPLIED", "ASSESSMENT", "INTERVIEW1", "INTERVIEW2", "OFFER"];
    const funnelCounts = await db.application.groupBy({
      by: ['stage'],
      _count: true,
    });

    const funnelData = funnelSteps.map(stage => ({
      name: stage.charAt(0) + stage.slice(1).toLowerCase().replace('1', ' 1').replace('2', ' 2'),
      value: funnelCounts.find(c => c.stage === stage)?._count || 0
    }));

    // 3. Resolution Data (Shortlisted vs Rejected)
    const resolutionCounts = await db.application.groupBy({
      by: ['status'],
      _count: true,
    });

    const resolutionData = [
      { name: "Shortlisted", value: resolutionCounts.find(c => c.status === "SHORTLISTED")?._count || 0, fill: "#00DC82" },
      { name: "Rejected", value: resolutionCounts.find(c => c.status === "REJECTED")?._count || 0, fill: "#ef4444" },
      { name: "Sourcing", value: resolutionCounts.find(c => c.status === "PENDING")?._count || 0, fill: "#27272a" },
    ];

    // 4. Trend Data (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const historicalApps = await db.application.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: { createdAt: true }
    });

    const trendData = last7Days.map(dateStr => ({
      date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: historicalApps.filter(a => a.createdAt.toISOString().split('T')[0] === dateStr).length
    }));

    return {
      success: true,
      metrics: {
        totalApplications,
        appGrowth,
        avgScore,
        pendingReview: resolutionCounts.find(c => c.status === "PENDING")?._count || 0
      },
      funnelData,
      resolutionData,
      trendData
    };
  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    return { success: false, error: "Failed to fetch analytics data" };
  }
}
