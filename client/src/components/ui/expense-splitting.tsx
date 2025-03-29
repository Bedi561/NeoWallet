"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckIcon, UserIcon, DollarSignIcon, AlertCircle } from "lucide-react"

interface User {
  id: string;
  username: string;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  paidBy: User;
  splitWith: User[];
  createdAt?: string;
}

interface NewExpense {
  amount: string;
  description: string;
  splitWithIds: string[];
  paidById?: string;
}

export default function ExpenseSplitting(): JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newExpense, setNewExpense] = useState<NewExpense>({ 
    amount: "", 
    description: "", 
    splitWithIds: [],
    paidById: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([fetchExpenses(), fetchUsers()])
      .finally(() => setIsLoading(false));
  }, []);

  const fetchExpenses = async (): Promise<Expense[]> => {
    try {
      const response = await axios.get("/expenses/list");
      setExpenses(response.data);
      return response.data;
    } catch (err) {
      setError("Failed to fetch expenses. Please try refreshing the page.");
      return [];
    }
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
      
      // Set the first user as default paidById if available
      if (response.data.length > 0 && !newExpense.paidById) {
        setNewExpense(prev => ({
          ...prev,
          paidById: response.data[0].id
        }));
      }
      
      return response.data;
    } catch (err) {
      setError("Failed to fetch users. Please try refreshing the page.");
      return [];
    }
  };

  const handleAddExpense = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Form validation
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      setError("Please enter a valid amount");
      setIsSubmitting(false);
      return;
    }
    
    if (!newExpense.description.trim()) {
      setError("Please enter a description");
      setIsSubmitting(false);
      return;
    }
    
    if (!newExpense.paidById) {
      setError("Please select who paid");
      setIsSubmitting(false);
      return;
    }
    
    if (newExpense.splitWithIds.length === 0) {
      setError("Please select at least one person to split with");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await axios.post("/expenses/create", {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      
      // Add the new expense to the list with the current date
      const newExpenseWithDate = {
        ...response.data,
        createdAt: new Date().toISOString()
      };
      
      setExpenses(prev => [newExpenseWithDate, ...prev]);
      
      // Reset form
      setNewExpense({ 
        amount: "", 
        description: "", 
        splitWithIds: [],
        paidById: newExpense.paidById // Keep the same payer for convenience
      });
      
      setSuccess("Expense added successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      setError("Failed to add expense. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSignIcon className="h-5 w-5" />
            Expense Splitter
          </CardTitle>
          <CardDescription>
            Track shared expenses and split costs with friends
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Add New Expense</h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                      className="pl-7"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="What's this expense for?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid by</Label>
                  <Select
                    value={newExpense.paidById}
                    onValueChange={(value) => setNewExpense({ ...newExpense, paidById: value })}
                  >
                    <SelectTrigger id="paidBy">
                      <SelectValue placeholder="Who paid?" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={`payer-${user.id}`} value={user.id}>
                          {user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="splitWith">Split with</Label>
                  <Select
                    value={newExpense.splitWithIds.join(",")}
                    onValueChange={(value) => {
                      const ids = value ? value.split(",") : [];
                      setNewExpense({ ...newExpense, splitWithIds: ids });
                    }}
                  >
                    <SelectTrigger id="splitWith">
                      <SelectValue placeholder="Who's sharing this expense?" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={`split-${user.id}`} value={user.id}>
                          {user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {newExpense.splitWithIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newExpense.splitWithIds.map(id => {
                        const user = users.find(u => u.id === id);
                        return user ? (
                          <Badge key={id} variant="secondary" className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            {user.username}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="mt-4 bg-green-50 text-green-700 border-green-200">
                    <CheckIcon className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Expense"}
                </Button>
              </form>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Expenses</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchExpenses()}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              </div>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : expenses.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <Card key={expense.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{expense.description}</h3>
                            <Badge variant="outline" className="font-mono">
                              {formatCurrency(expense.amount)}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {expense.createdAt && (
                              <span className="text-xs">{formatDate(expense.createdAt)}</span>
                            )}
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <UserIcon className="h-3 w-3" />
                                <span>Paid by</span>
                              </Badge>
                              <span className="text-sm font-medium">{expense.paidBy.username}</span>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1 mt-1">
                                <CheckIcon className="h-3 w-3" />
                                <span>Split with</span>
                              </Badge>
                              <div className="flex flex-wrap gap-1">
                                {expense.splitWith.map((user) => (
                                  <Badge key={user.id} variant="outline" className="text-xs">
                                    {user.username}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg p-6">
                  <DollarSignIcon className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium">No expenses yet</h3>
                  <p className="text-slate-500 mt-1">Add your first expense to get started</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}