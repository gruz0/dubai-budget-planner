import type { BudgetData, BudgetResults } from './budget-calculator'
import { APP_HOST } from './site'
import { formatDate } from './utils'

export function generatePrintHTML(budgetData: BudgetData, results: BudgetResults): string {
  const currentDate = new Date().toLocaleDateString()
  const monthlyIncomeAED = Math.round(
    budgetData.income.currency === 'USD'
      ? budgetData.income.monthlyAmount * budgetData.income.exchangeRate
      : budgetData.income.monthlyAmount,
  )

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dubai Move-in Budget Report</title>
    <style>
        ${getInlineStyles()}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Dubai Move-in Budget Report</h1>
            <p class="date">Generated on ${currentDate}</p>
            <p class="source">${APP_HOST}</p>
        </div>

        <!-- Print Controls -->
        <div class="print-controls">
            <button onclick="window.print()" class="print-btn">🖨️ Print / Save as PDF</button>
            <button onclick="window.close()" class="close-btn">❌ Close</button>
        </div>

        <!-- Summary Cards -->
        <div class="summary-grid">
            <div class="summary-card upfront">
                <h3>💰 Up-front Costs</h3>
                <div class="amount">AED ${results.upfront.total.toLocaleString()}</div>
            </div>
            <div class="summary-card monthly">
                <h3>📅 Monthly Budget</h3>
                <div class="amount">AED ${results.monthly.total.toLocaleString()}</div>
            </div>
            <div class="summary-card savings">
                <h3>💎 Monthly Savings</h3>
                <div class="amount">AED ${results.savings.monthlyAmount.toLocaleString()}</div>
            </div>
        </div>

        <!-- Combined Layout: Breakdown + Input Summary -->
        <div class="main-content-grid">
            <!-- Left Column: Detailed Breakdown -->
            <div class="breakdown-section">
                <!-- Up-front Costs -->
                <div class="breakdown-card">
                    <h3>Up-front Costs Breakdown</h3>
                    <div class="breakdown-list">
                        <div class="breakdown-item">
                            <span>First rent cheque:</span>
                            <span>AED ${results.upfront.rentFirstCheque.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Security deposit:</span>
                            <span>AED ${results.upfront.securityDeposit.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Broker commission:</span>
                            <span>AED ${results.upfront.brokerFee.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>DEWA deposit:</span>
                            <span>AED ${results.upfront.dewaDeposit.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>District cooling deposit:</span>
                            <span>AED ${results.upfront.coolingDeposit.toLocaleString()}</span>
                        </div>
                        ${
                          results.upfront.gasDeposit > 0
                            ? `
                        <div class="breakdown-item">
                            <span>Gas deposit:</span>
                            <span>AED ${results.upfront.gasDeposit.toLocaleString()}</span>
                        </div>
                        `
                            : ''
                        }
                        <div class="breakdown-item">
                            <span>Ejari registration:</span>
                            <span>AED ${results.upfront.ejari.toLocaleString()}</span>
                        </div>
                        ${
                          results.upfront.appliances > 0
                            ? `
                        <div class="breakdown-item">
                            <span>Appliances & furniture:</span>
                            <span>AED ${results.upfront.appliances.toLocaleString()}</span>
                        </div>
                        `
                            : ''
                        }
                        ${
                          results.upfront.movingServices > 0
                            ? `
                        <div class="breakdown-item">
                            <span>Moving services:</span>
                            <span>AED ${results.upfront.movingServices.toLocaleString()}</span>
                        </div>
                        `
                            : ''
                        }
                        ${
                          results.upfront.relocationServices > 0
                            ? `
                        <div class="breakdown-item">
                            <span>Relocation services:</span>
                            <span>AED ${results.upfront.relocationServices.toLocaleString()}</span>
                        </div>
                        `
                            : ''
                        }
                        <div class="breakdown-total">
                            <span>Total:</span>
                            <span>AED ${results.upfront.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <!-- Monthly Costs -->
                <div class="breakdown-card">
                    <h3>Monthly Costs Breakdown</h3>
                    <div class="breakdown-list">
                        <div class="breakdown-item">
                            <span>Rent:</span>
                            <span>AED ${results.monthly.rent.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Utilities:</span>
                            <span>AED ${results.monthly.utilities.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Transport:</span>
                            <span>AED ${results.monthly.transport.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Food & groceries:</span>
                            <span>AED ${results.monthly.food.toLocaleString()}</span>
                        </div>
                        ${
                          results.monthly.schooling > 0
                            ? `
                        <div class="breakdown-item">
                            <span>Schooling:</span>
                            <span>AED ${results.monthly.schooling.toLocaleString()}</span>
                        </div>
                        `
                            : ''
                        }
                        <div class="breakdown-item">
                            <span>Extras:</span>
                            <span>AED ${results.monthly.extras.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-total">
                            <span>Total:</span>
                            <span>AED ${results.monthly.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Input Summary -->
            <div class="input-summary">
                <h3>Your Input Summary</h3>

                <div class="input-section">
                    <h4>Income & Housing</h4>
                    <div class="input-list">
                        <div>Monthly Income: ${budgetData.income.currency} ${budgetData.income.monthlyAmount.toLocaleString()}</div>
                        ${budgetData.income.currency === 'USD' ? `<div>In AED: AED ${monthlyIncomeAED.toLocaleString()}</div>` : ''}
                        <div>Annual Rent: AED ${budgetData.rent.annualRent.toLocaleString()}</div>
                        <div>Number of Cheques: ${budgetData.rent.numberOfCheques}</div>
                        ${budgetData.rent.area ? `<div>Area: ${budgetData.rent.area}</div>` : ''}
                        ${budgetData.rent.building ? `<div>Building: ${budgetData.rent.building}</div>` : ''}
                    </div>
                </div>

                <div class="input-section">
                    <h4>Household & Transport</h4>
                    <div class="input-list">
                        <div>Adults: ${budgetData.household.adults}</div>
                        <div>Children: ${budgetData.household.children}</div>
                        <div>Transport: ${budgetData.transport.type}</div>
                        <div>Food Budget: AED ${budgetData.food.monthlyAmount.toLocaleString()}/month</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Generated by ${APP_HOST} on ${formatDate(new Date().toISOString())}. For personal, informational use only.</p>
            <p class="disclaimer">⚠️ These are estimates only - not financial advice. Prices and fees change regularly. Always verify with official providers (DEWA, cooling, internet, etc.).</p>
            <p style="font-size: 10px; color: #666; margin-top: 4px;">Not affiliated with any UAE government entity. Visit ${APP_HOST} for updates and disclaimers.</p>
        </div>
    </div>

    <script>
        // Auto-focus for immediate printing
        window.addEventListener('load', function() {
            document.querySelector('.print-btn').focus();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
            if (e.key === 'Escape') {
                window.close();
            }
        });
    </script>
</body>
</html>`
}

function getInlineStyles(): string {
  return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.4;
        color: #333;
        background-color: #f8f9fa;
        font-size: 14px;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: white;
        min-height: 100vh;
    }

    .header {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #e9ecef;
    }

    .header h1 {
        font-size: 1.8rem;
        color: #2563eb;
        margin-bottom: 8px;
    }

    .date {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 4px;
    }


    .source {
        color: #9ca3af;
        font-size: 0.8rem;
    }

    .print-controls {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 20px;
    }

    .print-btn, .close-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .print-btn {
        background: #2563eb;
        color: white;
    }

    .print-btn:hover {
        background: #1d4ed8;
    }

    .close-btn {
        background: #e5e7eb;
        color: #374151;
    }

    .close-btn:hover {
        background: #d1d5db;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-bottom: 25px;
    }

    .summary-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .summary-card h3 {
        font-size: 1rem;
        margin-bottom: 10px;
        color: #374151;
    }

    .summary-card .amount {
        font-size: 1.4rem;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .upfront .amount { color: #2563eb; }
    .monthly .amount { color: #7c3aed; }
    .savings .amount { color: #059669; }

    .sub-amount {
        color: #6b7280;
        font-size: 0.8rem;
    }

    .main-content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-bottom: 25px;
    }

    .breakdown-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .breakdown-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 25px;
    }

    .breakdown-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .breakdown-card h3 {
        font-size: 1.1rem;
        margin-bottom: 12px;
        color: #374151;
        border-bottom: 1px solid #f3f4f6;
        padding-bottom: 6px;
    }

    .breakdown-list {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .breakdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
        border-bottom: 1px solid #f9fafb;
        font-size: 0.9rem;
    }

    .breakdown-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0 6px;
        border-top: 2px solid #e5e7eb;
        font-weight: bold;
        font-size: 1rem;
        margin-top: 8px;
    }

    .input-summary {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .input-summary h3 {
        font-size: 1.1rem;
        margin-bottom: 12px;
        color: #374151;
        border-bottom: 1px solid #f3f4f6;
        padding-bottom: 6px;
    }

    .input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .input-section h4 {
        font-size: 1rem;
        color: #4b5563;
        margin-bottom: 8px;
    }

    .input-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .input-list div {
        padding: 3px 0;
        color: #6b7280;
        border-bottom: 1px solid #f9fafb;
        font-size: 0.85rem;
    }

    .warnings {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
    }

    .warnings h3 {
        color: #92400e;
        margin-bottom: 10px;
        font-size: 1rem;
    }

    .warnings ul {
        list-style-type: disc;
        padding-left: 15px;
    }

    .warnings li {
        color: #92400e;
        margin-bottom: 6px;
        font-size: 0.85rem;
    }

    .footer {
        text-align: center;
        padding: 20px 0;
        border-top: 1px solid #e9ecef;
        color: #6b7280;
        font-size: 0.8rem;
    }

    .footer p {
        margin-bottom: 6px;
    }

    .disclaimer {
        font-weight: 600;
        color: #dc2626 !important;
        margin-top: 10px !important;
    }

    /* Print Styles */
    @media print {
        body {
            background: white;
            font-size: 12px;
            line-height: 1.3;
        }

        .print-controls {
            display: none;
        }

        .container {
            max-width: none;
            padding: 0;
            margin: 0;
        }

        .header {
            margin-bottom: 15px;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 1.5rem;
            margin-bottom: 6px;
        }

        .date, .source {
            font-size: 0.75rem;
        }

        .summary-grid {
            margin-bottom: 20px;
            gap: 12px;
            grid-template-columns: repeat(3, 1fr) !important;
        }

        .summary-card {
            padding: 12px;
            border-radius: 4px;
        }

        .summary-card h3 {
            font-size: 0.9rem;
            margin-bottom: 8px;
        }

        .summary-card .amount {
            font-size: 1.2rem;
        }

        /* Override main content grid for print - use breakdown section directly */
        .main-content-grid {
            display: block;
            margin-bottom: 20px;
        }

        .breakdown-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            break-inside: avoid;
        }

        .breakdown-grid {
            gap: 15px;
            margin-bottom: 20px;
            break-inside: avoid;
        }

        .breakdown-card {
            padding: 12px;
            border-radius: 4px;
            break-inside: avoid;
        }

        .breakdown-card h3 {
            font-size: 1rem;
            margin-bottom: 10px;
        }

        .breakdown-item {
            font-size: 0.8rem;
            padding: 2px 0;
        }

        .breakdown-total {
            font-size: 0.9rem;
            padding: 8px 0 4px;
        }

        .input-summary {
            display: none;
        }

        .footer {
            padding: 15px 0;
            font-size: 0.7rem;
        }

        .footer p {
            margin-bottom: 4px;
        }

        @page {
            margin: 0.5in;
            size: A4;
        }

        * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }

        /* Force page breaks */
        .breakdown-section {
            page-break-inside: avoid;
        }
    }

    /* Responsive */
    @media (max-width: 768px) {
        .main-content-grid {
            grid-template-columns: 1fr;
        }

        .breakdown-grid {
            grid-template-columns: 1fr;
        }

        .input-grid {
            grid-template-columns: 1fr;
        }

        .summary-grid {
            grid-template-columns: 1fr;
        }
    }
  `
}
