// Sample data for 100 influencers
const influencerData = [
    { name: 'Influencer1', reach: 5000 },
    { name: 'Influencer2', reach: 3000 },
    { name: 'Influencer3', reach: 7000 },
    { name: 'Influencer4', reach: 4500 },
    { name: 'Influencer5', reach: 80000 },
    { name: 'Influencer6', reach: 6000 },
    { name: 'Influencer7', reach: 3500 },
    { name: 'Influencer8', reach: 2000 },
    { name: 'Influencer9', reach: 4000 },
    { name: 'Influencer10', reach: 5500 },
    { name: 'Influencer11', reach: 2000 },
    { name: 'Influencer12', reach: 4000 },
    { name: 'Influencer13', reach: 5500 },
];

const totalAmount = 10000;
let totalReach = 0;

// Calculate the total reach
for (const influencer of influencerData) {
    totalReach += influencer.reach;
}

// Calculate distribution factor
const distributionFactor = totalAmount / totalReach;

// Calculate earnings for each influencer
const earnings = [];

for (const influencer of influencerData) {
    const influencerEarnings = (influencer.reach * distributionFactor).toFixed(2);
    earnings.push({ name: influencer.name, earnings: parseFloat(influencerEarnings) });
}

// Sort influencers by earnings (optional)
earnings.sort((a, b) => b.earnings - a.earnings);

// Distribute earnings
console.log("Earnings distribution:");
for (const influencer of earnings) {
    console.log(`${influencer.name}: ${influencer.earnings} rupees`);
}
