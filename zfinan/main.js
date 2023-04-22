
function isValidRange(parameter, name, minValue = -Infinity, maxValue = Infinity) {
    if (parameter < minValue || parameter > maxValue) {
        const error = `${name} found to be '${parameter}' is expected to be in this range (${minValue}, ${maxValue})`
        throw error
    }
}

function getPeriodRate(profitRateInPercent, periodsPerYear) {
    isValidRange(profitRateInPercent, "Profit Rate", 0, Infinity)
    isValidRange(periodsPerYear, "Periods per year", 0, 365)
    const profitRate = profitRateInPercent / 100
    return (1 + profitRate) ** (1 / periodsPerYear) - 1
}

function getNetPresentValueOfPeriod(period, periodRate, profit) {
    isValidRange(period, "Period Value", 1, Infinity)
    return profit / (1 + periodRate) ** period
}

function getNetPresentValue(investment, numberOfYears, periodsPerYear, 
    profitRateInPercent, expectedIncomeOverYears, expectedCostOverYears) {
    isValidRange(investment, "Investment", 0, Infinity)
    isValidRange(numberOfYears, "Number of Years", 0, Infinity)
    const periodRate = getPeriodRate(profitRateInPercent, periodsPerYear)
    let NPV = -investment
    for (let year = 0; year < numberOfYears; ++year) {
        isValidRange(expectedIncomeOverYears[year], "Expected Income", 0, Infinity)
        isValidRange(expectedCostOverYears[year], "Expected Cost", 0, Infinity)
        profitOfYear = expectedIncomeOverYears[year] - expectedCostOverYears[year]
        const profitPerPeriod = profitOfYear / periodsPerYear
        const endPeriodOfYear = (periodsPerYear * (year + 1))
        for (let period = periodsPerYear * year; period < endPeriodOfYear; ++period) {
            NPV += getNetPresentValueOfPeriod(period + 1, periodRate, profitPerPeriod)
        }
    }
    return NPV
}

