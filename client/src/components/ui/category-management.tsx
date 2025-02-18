/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface Category {
  id: string
  name: string
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/custom-categories/custom/list")
      setCategories(response.data)
    } catch (err) {
      setError("Failed to fetch categories")
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("/custom-categories/custom/create", { name: newCategory })
      setCategories([...categories, response.data])
      setNewCategory("")
    } catch (err) {
      setError("Failed to add category")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" />
          <Button type="submit">Add Category</Button>
        </form>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Your Categories:</h3>
          <ul className="list-disc pl-5">
            {categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

