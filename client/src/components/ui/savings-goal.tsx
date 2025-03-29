/* eslint-disable @typescript-eslint/no-unused-vars */


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CreditCard, 
  DollarSign, 
  Book, 
  Calculator,  
  Umbrella,
  Target,
  AlertCircle,
  Info,
  TrendingUp,
  Shield,
  BarChart2,
  Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Realistic financial tips for Indians
const financialTips = [
  {
    title: "Create a Real Emergency Fund",
    description: "Keep 6 months of expenses in a sweep-in FD (not regular savings)",
    category: "must-do",
    icon: <Umbrella className="h-4 w-4" />
  },
  {
    title: "Get Proper Health Insurance",
    description: "Base cover of ₹10 lakh + top-up of ₹25-50 lakh, not employer insurance",
    category: "protection",
    icon: <Shield className="h-4 w-4" />
  },
  {
    title: "Kill Expensive Debt First",
    description: "Pay off personal loans (12%+) and credit cards (40%+) before investing",
    category: "must-do",
    icon: <CreditCard className="h-4 w-4" />
  },
  {
    title: "Term Insurance",
    description: "Pure term plan (₹1 Cr for ~₹10-15K/year) beats expensive ULIPs",
    category: "protection",
    icon: <AlertCircle className="h-4 w-4" />
  },
  {
    title: "Index Funds Over Direct Stocks",
    description: "Nifty/Sensex index funds outperform 85% of active funds long-term",
    category: "investing",
    icon: <BarChart2 className="h-4 w-4" />
  }
]

// Realistic investment options for Indians in 2025
const investmentOptions = [
  {
    name: "Index Funds (Nifty/Sensex)",
    risk: "Medium",
    returns: "12-14% (10-yr avg)",
    taxable: "LTCG: 10% above ₹1 lakh",
    minAmount: "₹100 SIP",
    bestFor: "Core portfolio builder",
    details: "Track Nifty/Sensex with minimal cost (0.1-0.2% expense ratio). Outperforms 85% of active funds over 10 years. Direct plans save 1% yearly."
  },
  {
    name: "Flexi-cap Mutual Funds",
    risk: "Medium-High",
    returns: "13-16% (10-yr avg)",
    taxable: "LTCG: 10% above ₹1 lakh",
    minAmount: "₹500 SIP",
    bestFor: "Long-term growth, diversification",
    details: "Exposure across large, mid and small caps. Choose funds with 10+ year track record and expense ratio under 1% (direct plans)."
  },
  {
    name: "ELSS Mutual Funds",
    risk: "Medium-High",
    returns: "12-15% (10-yr avg)",
    taxable: "Tax exempt up to ₹1.5L (Sec 80C)",
    minAmount: "₹500 monthly",
    bestFor: "Tax saving with growth",
    details: "Only 3-year lock-in unlike PPF/NPS. Qualifies for 80C deduction. Much better returns than traditional tax-saving options."
  },
  {
    name: "Smallcap Index Funds",
    risk: "High",
    returns: "15-18% (10-yr avg)",
    taxable: "LTCG: 10% above ₹1 lakh",
    minAmount: "₹500 SIP",
    bestFor: "Aggressive growth (7+ yr horizon)",
    details: "High volatility but excellent long-term returns. Passive smallcap index funds have lower costs and less manager risk than active funds."
  },
  {
    name: "Corporate Bond Funds",
    risk: "Low-Medium",
    returns: "7-8% (current yield)",
    taxable: "LTCG: 20% with indexation",
    minAmount: "₹5,000 lumpsum",
    bestFor: "Safe income, 3+ year horizon",
    details: "Better than bank FDs with indexation benefits. Target maturity funds offer predictable returns if held till maturity."
  },
  {
    name: "REITs (Real Estate Trusts)",
    risk: "Medium",
    returns: "8-10% (dividend + growth)",
    taxable: "Dividends taxed at slab rate",
    minAmount: "~₹15,000 (1 lot)",
    bestFor: "Regular income + real estate exposure",
    details: "Traded on stock exchange. Own commercial real estate without buying property. 90% of rental income distributed as dividends."
  },
  {
    name: "NPS Tier 1 (Pension)",
    risk: "Low to Medium",
    returns: "10-12% (equity), 8-9% (debt)",
    taxable: "Additional ₹50,000 tax benefit",
    minAmount: "₹1,000 yearly",
    bestFor: "Additional tax saving, retirement",
    details: "Long-term lock-in (till 60). Active fund management with low costs (<0.1%). Additional tax benefit beyond 80C limits."
  }
]

// Asset allocation models by age
const assetAllocationModels = [
  {
    name: "Aggressive (20s-30s)",
    equity: 80,
    debt: 15,
    gold: 5,
    description: "High growth focus, long time horizon to ride out market volatility"
  },
  {
    name: "Balanced (40s)",
    equity: 60,
    debt: 30,
    gold: 10,
    description: "Moderate growth with some safety as responsibilities increase"
  },
  {
    name: "Conservative (50s+)",
    equity: 40,
    debt: 50,
    gold: 10,
    description: "Capital preservation becomes more important near retirement"
  }
]

// Investment mistakes
const investmentMistakes = [
  {
    title: "Buying ULIPs for Insurance",
    description: "High charges (30-50%), low returns, poor insurance. Buy term insurance + mutual funds separately.",
  },
  {
    title: "Investing in Traditional Insurance",
    description: "Endowment/money-back policies give only 4-5% returns. Worst of both worlds.",
  },
  {
    title: "Chasing NFOs/IPOs",
    description: "New fund offers are marketing gimmicks. Stick to established funds with track records.",
  },
  {
    title: "Investing in PMS/AIFs too early",
    description: "High-fee products (2%+ yearly) often underperform. Only consider after ₹50L+ portfolio.",
  },
  {
    title: "Listening to 'Stock Tips'",
    description: "Market tips from friends/social media usually lead to losses. Follow a system.",
  }
]

export default function FinancialLiteracy() {
  const [income, setIncome] = useState<number>(0)
  const [expenses, setExpenses] = useState<number>(0)
  const [savingsGoal, setSavingsGoal] = useState<number>(0)
  const [investmentHorizon, setInvestmentHorizon] = useState<string>("medium")
  const [riskTolerance, setRiskTolerance] = useState<string>("moderate")
  const [age, setAge] = useState<number>(30)
  const [activeTab, setActiveTab] = useState("basics")
  
  // Calculate simple metrics
  const monthlySavings = income - expenses
  const monthsToGoal = savingsGoal > 0 ? Math.ceil(savingsGoal / monthlySavings) : 0
  
  // Get recommended asset allocation
  const getRecommendedAllocation = () => {
    if (age < 40) return assetAllocationModels[0]
    if (age < 50) return assetAllocationModels[1]
    return assetAllocationModels[2]
  }

  // Get recommended investments based on risk and horizon
  const getRecommendedInvestments = () => {
    if (riskTolerance === "conservative") {
      if (investmentHorizon === "short") {
        return ["Corporate Bond Funds", "Bank FDs"]
      } else {
        return ["Corporate Bond Funds", "Index Funds (25%)", "NPS Tier 1"]
      }
    } else if (riskTolerance === "moderate") {
      if (investmentHorizon === "short") {
        return ["Index Funds (50%)", "Corporate Bond Funds (50%)"]
      } else {
        return ["Index Funds (60%)", "Flexi-cap Funds (20%)", "Corporate Bond Funds (20%)"]
      }
    } else {
      if (investmentHorizon === "short") {
        return ["Flexi-cap Funds", "Index Funds"]
      } else {
        return ["Index Funds (40%)", "Flexi-cap Funds (30%)", "Smallcap Index Funds (20%)", "REITs (10%)"]
      }
    }
  }

  const allocation = getRecommendedAllocation()
  const recommendedInvestments = getRecommendedInvestments()
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-medium">Money Playbook</h1>
          </div>
          <TabsList>
            <TabsTrigger value="basics">Must-Know</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="investing">Investment Plan</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Financial Basics Tab */}
<TabsContent value="basics" className="space-y-6 mt-2">
  {/* New Tax Alert */}
  <Alert className="bg-blue-50 border-blue-100">
    {/* <Lightbulb className="h-4 w-4" /> */}
    <AlertTitle>2025 Tax Glow-Up: New Rules = More Money in Your Pocket!</AlertTitle>
    <AlertDescription className="text-sm">
      Good news! No income tax up to ₹12 lakhs under the new tax regime. 
      Gen Z tip: This means more money for your investments (or maybe that PS5 you've been eyeing).
    </AlertDescription>
  </Alert>

  <Card>
    <CardHeader>
      <CardTitle className="text-xl">Money Moves for 2025</CardTitle>
    </CardHeader>
    <CardContent>
      {financialTips.map((tip, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border mb-3">
          <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
            {tip.icon}
          </div>
          <div>
            <h3 className="font-semibold">{tip.title}</h3>
            <p className="text-sm">{tip.description}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">Winning Financial Moves</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="p-3 rounded-lg border border-green-100 bg-green-50">
          <h3 className="font-semibold">1. Index Funds > Stock Picking</h3>
          <p className="text-sm">Just buy the whole market and chill.</p>
        </div>
        
        <div className="p-3 rounded-lg border border-green-100 bg-green-50">
          <h3 className="font-semibold">2. SIPs = Financial Peace</h3>
          <p className="text-sm">Auto-invest monthly and forget about it.</p>
        </div>
        
        <div className="p-3 rounded-lg border border-green-100 bg-green-50">
          <h3 className="font-semibold">3. Health Insurance = Must Have</h3>
          <p className="text-sm">One hospital bill without it can bankrupt you.</p>
        </div>
      </div>
      
      <Alert className="bg-purple-50 mt-3">
        <AlertTitle>Your Simple Money Roadmap</AlertTitle>
        <AlertDescription className="text-sm">
          <ol className="mt-1 space-y-1 ml-5 list-decimal">
            <li>Emergency fund: 6 months' expenses</li>
            <li>Health insurance: ₹10L + top-up</li>
            <li>Term life insurance (if others depend on you)</li>
            <li>Invest through index funds</li>
          </ol>
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">Reality Checks (No 🧢)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="rounded-lg border p-4">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-sm">Company health insurance vanishes when you quit</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-sm">90% of people lose money picking individual stocks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-sm">LIC policies are financial traps (3-5% returns)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-sm">You need ₹2-3 Cr to retire (not ₹50L like parents think)</span>
          </li>
        </ul>
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">Tax Hacks for Gen Z</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="p-3 rounded-lg border">
          <h3 className="font-semibold">New vs Old Tax Regime</h3>
          <p className="text-sm">New regime: No tax up to ₹12L, but fewer deductions. Old regime: More deductions but lower threshold.</p>
        </div>
        
        <div className="p-3 rounded-lg border">
          <h3 className="font-semibold">ELSS > Fixed Deposits</h3>
          <p className="text-sm">ELSS funds get tax benefits with only 3-year lock-in and higher returns.</p>
        </div>
        
        <div className="p-3 rounded-lg border">
          <h3 className="font-semibold">HRA + Rent Receipts</h3>
          <p className="text-sm">Even if living with parents, paying rent to them can save taxes under old regime.</p>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>
        
        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Financial Planning Calculator</CardTitle>
              <CardDescription>Set realistic financial goals and timelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Monthly Income (After Tax)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    value={income || ""}
                    onChange={(e) => setIncome(Number(e.target.value) || 0)}
                    placeholder="60,000"
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Monthly Expenses</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    value={expenses || ""}
                    onChange={(e) => setExpenses(Number(e.target.value) || 0)}
                    placeholder="45,000"
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Savings Goal Amount</label>
                <div className="relative">
                  <Target className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    value={savingsGoal || ""}
                    onChange={(e) => setSavingsGoal(Number(e.target.value) || 0)}
                    placeholder="2,000,000"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Your Age</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    value={age || ""}
                    onChange={(e) => setAge(Number(e.target.value) || 0)}
                    placeholder="30"
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Monthly Savings Potential</div>
                  <div className="font-semibold">₹{monthlySavings.toLocaleString()}</div>
                </div>
                
                {monthlySavings > 0 && savingsGoal > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Months to reach goal</div>
                      <div className="font-semibold">{monthsToGoal} months ({Math.floor(monthsToGoal/12)} years, {monthsToGoal % 12} months)</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">With 12% returns (index funds)</div>
                      <div className="font-semibold">{Math.ceil(Math.log(savingsGoal * 0.01 / monthlySavings + 1) / Math.log(1.01)) || 0} months</div>
                    </div>
                  </>
                )}
                
                {monthlySavings <= 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Financial Danger Zone</AlertTitle>
                    <AlertDescription>
                      You're spending more than you earn. Cut non-essential expenses immediately and consider additional income sources.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Retirement Planning</CardTitle>
              <CardDescription>How much you really need to retire in India</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {income > 0 && (
                <>
                  <div className="rounded-lg border p-4 space-y-2">
                    <h3 className="font-semibold">Estimated Numbers (Based on Current Lifestyle)</h3>
                    
                    <div className="flex justify-between text-sm">
                      <span>Monthly expenses today</span>
                      <span>₹{expenses.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Expected monthly expenses at retirement (inflation adjusted)</span>
                      <span>₹{Math.round(expenses * Math.pow(1.06, 30)).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Retirement corpus needed (25x rule)</span>
                      <span>₹{Math.round(expenses * Math.pow(1.06, 30) * 300).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
  <span>Monthly SIP needed in equity funds to reach target</span>
  <span>₹{Math.round((expenses * Math.pow(1.06, 30) * 300) / (Math.pow(1 + (0.12/12), 30*12) - 1) * (0.12/12)).toLocaleString()}</span>
</div>
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-100">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Retirement Reality Check</AlertTitle>
                    <AlertDescription className="text-sm">
                      Most Indians significantly underestimate retirement needs. You need 25-30x your annual expenses to retire, not just a few crores. Account for healthcare costs and 30+ years of inflation.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}